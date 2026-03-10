/**
 * SignUpPage.tsx - Registration Page (301 lines)
 * 
 * Allows new users to create an account.
 * After signup, user must verify their email before logging in.
 * 
 * Features:
 * - Full registration form: name, email, phone, password, confirm password
 * - Real-time password strength meter (Weak/Fair/Good/Strong/Very Strong)
 * - Password confirmation matching check
 * - Show/hide password toggle
 * - Loading state during signup
 * - Success toast with "check your email" message
 * - Error handling with toast notifications
 * - Link to Sign In page for existing users
 * - GSAP entrance animations
 * - Trust badges and feature highlights
 */
import Layout from "@/components/layout/Layout";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, BookOpen, Check, Loader2, Sparkles, MessageCircle, ArrowRight, Star, Shield, TrendingUp, Users, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import Tilt from "react-parallax-tilt";

const getPasswordStrength = (pw: string) => {
  if (pw.length === 0) return { label: "", color: "", width: "0%", score: 0 };
  if (pw.length < 6) return { label: "Weak", color: "bg-destructive", width: "25%", score: 1 };
  if (pw.length < 8) return { label: "Fair", color: "bg-warning", width: "50%", score: 2 };
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(pw) && pw.length >= 10) return { label: "Very Strong", color: "bg-success", width: "100%", score: 4 };
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw) && pw.length >= 8) return { label: "Strong", color: "bg-success", width: "100%", score: 4 };
  return { label: "Good", color: "bg-primary", width: "75%", score: 3 };
};

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappSame, setWhatsappSame] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".signup-benefit",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.3, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".signup-stat",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.8, ease: "back.out(1.7)", clearProps: "all" }
      );
    }, panelRef);
    return () => ctx.revert();
  }, []);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, displayName, phone);
    setLoading(false);
    if (error) {
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Check your email for verification." });
      navigate("/auth/signin");
    }
  };

  return (
    <Layout>
      <section ref={panelRef} className="relative flex min-h-screen items-center overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />

        {/* Animated orbs */}
        <motion.div animate={{ x: [0, 60, 0], y: [0, -40, 0] }} transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[5%] top-[15%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[130px]" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[5%] bottom-[15%] h-[400px] w-[400px] rounded-full bg-[hsl(260,100%,66%,0.04)] blur-[100px]" />
        <motion.div animate={{ x: [0, 35, 0], y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[40%] top-[5%] h-[350px] w-[350px] rounded-full bg-[hsl(170,100%,50%,0.03)] blur-[110px]" />


        <div className="container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Side */}
            <div className="hidden lg:block">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles size={14} className="text-primary" /> Join Free
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                </div>
                <h2 className="font-display text-4xl font-bold text-foreground lg:text-5xl">
                  Join India's{" "}
                  <span className="text-shimmer">
                    <TypeAnimation
                      sequence={['#1 Platform', 3000, 'Largest Network', 2000, 'Best Tools', 2000]}
                      wrapper="span" speed={30} repeat={Infinity}
                    />
                  </span>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Get instant WhatsApp alerts for new vacancies, results & admit cards. Everything free, forever.
                </p>

                {/* Quick stats */}
                <div className="mt-8 flex items-center gap-6">
                  {[
                    { icon: Users, val: "1M+", label: "Students" },
                    { icon: Zap, val: "100+", label: "Tools" },
                    { icon: TrendingUp, val: "36", label: "States" },
                  ].map((s) => (
                    <div key={s.label} className="signup-stat flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <s.icon size={14} className="text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground">{s.val}</span>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    { icon: MessageCircle, text: "Instant WhatsApp Notifications", desc: "Never miss a deadline again" },
                    { icon: BookOpen, text: "100+ Free PDF Tools", desc: "Merge, compress, convert & more" },
                    { icon: Check, text: "All 36 States Covered", desc: "Central + every state & UT" },
                    { icon: Check, text: "Multi-language News", desc: "1000+ daily articles in 22 languages" },
                    { icon: Check, text: "Expert Blog & Guides", desc: "Preparation tips from toppers" },
                  ].map((f) => (
                    <motion.div key={f.text} whileHover={{ x: 4 }}
                      className="signup-benefit flex items-center gap-4 rounded-xl border border-border glass p-4 transition-all hover:border-primary/20 hover:shadow-glow">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                        <f.icon size={18} className="text-success" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">{f.text}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="mt-6 rounded-xl border border-border glass p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm italic text-muted-foreground">"Joined a month ago and the WhatsApp alerts are a game-changer for UPSC preparation!"</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">P</div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Priya Singh</p>
                      <p className="text-[10px] text-muted-foreground">UPSC 2025 Aspirant</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable glareMaxOpacity={0.03} glareBorderRadius="1rem" scale={1.005}>
                <div className="mx-auto w-full max-w-md">
                  <div className="relative overflow-hidden rounded-2xl border border-border glass-strong p-8">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[hsl(260,100%,66%)] to-[hsl(170,100%,50%)]" />
                    <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />

                    <div className="text-center">
                      <motion.div animate={{ y: [0, -6, 0], rotateY: [0, 360] }}
                        transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotateY: { repeat: Infinity, duration: 8, ease: "linear" } }}
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
                        style={{ transformStyle: "preserve-3d" }}>
                        <BookOpen size={28} className="text-primary" />
                      </motion.div>
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-[10px] text-muted-foreground">
                        <Sparkles size={10} className="text-primary" />
                        <span><strong className="text-foreground">ISHU</strong> — Indian StudentHub University</span>
                      </div>
                      <h1 className="font-display text-2xl font-bold text-foreground">Create Account</h1>
                      <p className="mt-2 text-sm text-muted-foreground">Join India's #1 exam platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name *</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                          <User size={16} className="text-muted-foreground" />
                          <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your full name"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                          <Mail size={16} className="text-muted-foreground" />
                          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Phone / WhatsApp Number</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                          <Phone size={16} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">+91</span>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Phone number"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={whatsappSame} onChange={(e) => setWhatsappSame(e.target.checked)} className="rounded border-border" />
                        WhatsApp number same as phone
                      </label>
                      {!whatsappSame && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
                          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3">
                            <MessageCircle size={16} className="text-success" />
                            <span className="text-sm text-muted-foreground">+91</span>
                            <input type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="WhatsApp number"
                              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                          </div>
                        </motion.div>
                      )}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Password *</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                          <Lock size={16} className="text-muted-foreground" />
                          <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {password.length > 0 && (
                          <div className="mt-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((level) => (
                                <motion.div key={level} initial={{ scaleX: 0 }} animate={{ scaleX: strength.score >= level ? 1 : 0.3 }}
                                  className={`h-1.5 flex-1 rounded-full ${strength.score >= level ? strength.color : "bg-secondary"}`} />
                              ))}
                            </div>
                            <p className={`mt-1 text-xs font-medium ${strength.color.replace("bg-", "text-")}`}>{strength.label}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password *</label>
                        <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                          <Lock size={16} className="text-muted-foreground" />
                          <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password"
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                        </div>
                        {confirmPassword.length > 0 && password !== confirmPassword && (
                          <p className="mt-1 text-xs text-destructive">Passwords don't match</p>
                        )}
                        {confirmPassword.length > 0 && password === confirmPassword && password.length > 0 && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-success"><Check size={10} /> Passwords match</p>
                        )}
                      </div>
                      <label className="flex items-start gap-2 text-xs text-muted-foreground">
                        <input type="checkbox" required className="mt-0.5 rounded border-border" />
                        <span>I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> & <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
                      </label>
                      <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3.5 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : <><span>Create Account</span><ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></>}
                      </motion.button>
                    </form>

                    <div className="mt-5 flex items-center gap-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">🔒 Secured</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/auth/signin" className="font-semibold text-primary hover:underline">Sign In</Link>
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

export default SignUpPage;
