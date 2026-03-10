/**
 * AuthContext.tsx - Authentication State Manager
 * 
 * This context provides login, signup, and logout functionality
 * across the entire app. Any component can use the `useAuth()` hook
 * to access the current user, check if they're an admin, or trigger
 * auth actions like signIn/signUp/signOut.
 * 
 * How it works:
 * 1. On app load, checks if user is already logged in (session exists)
 * 2. Listens for auth state changes (login, logout, token refresh)
 * 3. After login, checks if user has an "admin" role in the database
 * 4. Provides all auth data via React Context to child components
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Shape of the auth data available to all components
interface AuthContextType {
  user: User | null;           // Current logged-in user (null if not logged in)
  session: Session | null;     // Current auth session with tokens
  loading: boolean;            // True while checking initial auth state
  isAdmin: boolean;            // True if user has "admin" role
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Create the context (undefined until AuthProvider wraps the app)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Wraps the app and provides auth state to all children.
 * Must be placed inside BrowserRouter (for navigation after auth).
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);    // Start as loading until we check session
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Check if a user has the "admin" role in the database.
   * Uses a secure database function (has_role) that runs with elevated privileges.
   */
  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    setIsAdmin(!!data);
  };

  useEffect(() => {
    // Listen for any auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Use setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(() => checkAdmin(session.user.id), 0);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Also check if there's an existing session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
      setLoading(false);
    });

    // Cleanup: unsubscribe when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with email and password.
   * Returns { error } - check if error is null for success.
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  /**
   * Create a new account with email and password.
   * Optional: displayName and phone are stored in user metadata.
   * User must verify email before they can sign in.
   */
  const signUp = async (email: string, password: string, displayName?: string, phone?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, phone },
        emailRedirectTo: window.location.origin,  // Where to redirect after email verification
      },
    });
    return { error };
  };

  /** Sign out the current user and clear session */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth() - Hook to access auth state from any component.
 * Must be used inside an AuthProvider.
 * 
 * Example usage:
 *   const { user, isAdmin, signOut } = useAuth();
 *   if (!user) return <LoginPage />;
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
