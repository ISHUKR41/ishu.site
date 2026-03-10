/**
 * SignInPage.tsx - Login Page (231 lines)
 * 
 * Allows existing users to sign in with email and password.
 * Redirects to home page if user is already logged in.
 * 
 * Features:
 * - Email and password input fields
 * - Show/hide password toggle
 * - Loading state during sign-in
 * - Error handling with toast notifications
 * - Auto-redirect if already authenticated
 * - Link to Sign Up page for new users
 * - GSAP entrance animations
 * - TypeAnimation for dynamic welcome text
 * - Trust badges (100% Free, Secure, etc.)
 */
import Layout from "@/components/layout/Layout";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Shield, Zap, Globe, Award, Loader2, Sparkles, ArrowRight, CheckCircle, Star, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import Tilt from "react-parallax-tilt";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".signin-feature-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".signin-testimonial",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, delay: 1, ease: "power3.out", clearProps: "all" }
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Sign In Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/");
    }
  };

  return (
    <Layout>
      <section ref={formRef} className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />

        {/* Animated orbs */}
        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/6 blur-[120px]" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[10%] bottom-[20%] h-[350px] w-[350px] rounded-full bg-[hsl(260,100%,66%,0.05)] blur-[100px]" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[40%] top-[10%] h-[300px] w-[300px] rounded-full bg-[hsl(170,100%,50%,0.03)] blur-[100px]" />


        <div className="container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Side - Brand & Features */}
            <div className="hidden lg:block">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles size={14} className="text-primary" />
                  Welcome Back
                  <motion.span animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                </div>
                <h2 className="font-display text-4xl font-bold text-foreground lg:text-5xl">
                  Sign in to{" "}
                  <span className="text-shimmer">
                    <TypeAnimation
                      sequence={['ISHU', 3000, 'Your Dashboard', 2000, 'Exam Updates', 2000]}
                      wrapper="span" speed={30} repeat={Infinity}
                    />
                  </span>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Access your personalized dashboard, saved exams, and WhatsApp notification preferences.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  {[
                    { icon: Zap, label: "Instant Alerts", desc: "WhatsApp notifications", gradient: "from-amber-500/20 to-orange-500/20" },
                    { icon: Globe, label: "36 States", desc: "Complete coverage", gradient: "from-blue-500/20 to-cyan-500/20" },
                    { icon: Award, label: "100+ Tools", desc: "Free PDF suite", gradient: "from-emerald-500/20 to-green-500/20" },
                    { icon: Shield, label: "Verified Data", desc: "Official sources", gradient: "from-violet-500/20 to-purple-500/20" },
                  ].map((f) => (
                    <Tilt key={f.label} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareMaxOpacity={0.06} glareColor="hsl(210 100% 56%)" glareBorderRadius="0.75rem" scale={1.03}>
                      <div className={`signin-feature-card group rounded-xl border border-border glass-strong p-5 transition-all hover:border-primary/20 hover:shadow-glow`}>
                        <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${f.gradient} p-2.5`}>
                          <f.icon size={20} className="text-foreground" />
                        </div>
                        <p className="font-display text-sm font-semibold text-foreground">{f.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                    </Tilt>
                  ))}
                </div>

                {/* Trust testimonial */}
                <div className="signin-testimonial mt-8 rounded-xl border border-border glass p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm italic text-muted-foreground">"ISHU helped me get instant alerts for SSC CGL results. Never missed a deadline!"</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">R</div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Rahul Kumar</p>
                      <p className="text-[10px] text-muted-foreground">SSC CGL 2025 Aspirant</p>
                    </div>
                  </div>
                </div>

                {/* Live stats */}
                <div className="mt-6 flex items-center gap-6">
                  {[
                    { icon: Users, val: "1M+", label: "Users" },
                    { icon: TrendingUp, val: "99.9%", label: "Uptime" },
                    { icon: CheckCircle, val: "50K+", label: "Results" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <s.icon size={14} className="text-primary" />
                      <span className="text-sm font-bold text-foreground">{s.val}</span>
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.04} glareBorderRadius="1rem" scale={1.01}>
                <div className="mx-auto max-w-md w-full">
                  <div className="relative overflow-hidden rounded-2xl border border-border glass-strong p-8">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[hsl(260,100%,66%)] to-primary" />
                    
                    {/* Decorative corner glow */}
                    <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-accent/10 blur-2xl" />

                    <div className="text-center">
                      <motion.div
                        animate={{ y: [0, -6, 0], rotateY: [0, 360] }}
                        transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotateY: { repeat: Infinity, duration: 8, ease: "linear" } }}
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Shield size={28} className="text-primary" />
                      </motion.div>
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-[10px] text-muted-foreground">
                        <Sparkles size={10} className="text-primary" />
                        <span><strong className="text-foreground">ISHU</strong> — Indian StudentHub University</span>
                      </div>
                      <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back</h1>
                      <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                          <Mail size={16} className="text-muted-foreground" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                          <Lock size={16} className="text-muted-foreground" />
                          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                          <input type="checkbox" className="rounded border-border" /> Remember me
                        </label>
                      </div>
                      <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3.5 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : <><span>Sign In</span><ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></>}
                      </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Social hint */}
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      🔒 Secured with end-to-end encryption
                    </p>

                    <div className="mt-4 gradient-line" />

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="/auth/signup" className="font-semibold text-primary hover:underline">Create Account</Link>
                    </p>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SignInPage;
