/**
 * ProtectedRoute.tsx - Route Guard Component
 * 
 * Wraps pages that need authentication or admin access.
 * 
 * Behavior:
 * - Shows a loading spinner while checking auth state
 * - Redirects to /auth/signin if user is not logged in
 * - Redirects to / (home) if adminOnly is true but user is not admin
 * - Renders children (the protected page) if all checks pass
 * 
 * Usage:
 *   <ProtectedRoute adminOnly>
 *     <AdminPanel />
 *   </ProtectedRoute>
 */

import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;         // If true, only admin users can access this route
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { user, loading, isAdmin } = useAuth();

  // Still checking if user is logged in - show loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in - redirect to sign in page
  if (!user) return <Navigate to="/auth/signin" replace />;

  // Logged in but not admin - redirect to home page
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  // All checks passed - render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
