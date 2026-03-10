/**
 * WhyChooseUs.tsx - Trust Signals & Value Proposition Section
 * 
 * Displays 6 key reasons to use ISHU with trust stats and animated cards.
 * Features GSAP scroll-triggered animations and 3D tilt effects.
 */
import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import StaggerChildren from "../animations/StaggerChildren";
import GlowingText from "../animations/GlowingText";
import { Globe, Award, Zap, Shield, Smartphone, Clock, CheckCircle, TrendingUp, Star, Users, Sparkles } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  { icon: Globe, title: "Pan-India Coverage", desc: "All 28 States + 8 Union Territories covered with dedicated pages for each.", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
  { icon: Award, title: "Verified Information", desc: "Every result & vacancy is verified from official government sources.", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
  { icon: Zap, title: "Instant Updates", desc: "Get notified within minutes of any new vacancy or result announcement.", color: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-400" },
  { icon: Shield, title: "100% Free & Secure", desc: "All tools and features are completely free. Your data stays private.", color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
  { icon: Smartphone, title: "Mobile Optimized", desc: "Perfect experience on every device — phone, tablet, or desktop.", color: "from-rose-500/20 to-pink-500/20", iconColor: "text-rose-400" },
  { icon: Clock, title: "24/7 Availability", desc: "Access results, tools, and news anytime, anywhere — no downtime.", color: "from-teal-500/20 to-cyan-500/20", iconColor: "text-teal-400" },
];

const trustStats = [
  { icon: Users, value: "1M+", label: "Students Trust Us" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: TrendingUp, value: "99.9%", label: "Uptime Record" },
  { icon: CheckCircle, value: "50K+", label: "Results Delivered" },
];

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".why-card",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: ".why-grid", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".trust-stat",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: ".trust-row", start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-gradient-to-b from-background via-card/60 to-background">
      {/* Enhanced backgrounds */}
      <div className="pointer-events-none absolute inset-0 aurora-bg" />
      <div className="pointer-events-none absolute inset-0 bg-floating-dots opacity-25" />
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      
      {/* Animated orbs */}
      <motion.div 
        animate={{ x: [0, 60, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-20 bottom-1/4 h-[350px] w-[350px] rounded-full bg-accent/8 blur-[130px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[hsl(260,100%,66%,0.05)] blur-[180px]" 
      />
      
      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 grain" />
      
      <div className="container relative z-10">
        <FadeInView>
          <div className="mx-auto max-w-2xl text-center">
            {/* Section badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground">
              <Sparkles size={14} className="text-primary" />
              <span className="font-medium">Why ISHU?</span>
            </motion.div>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Built for India's{" "}
              <GlowingText text="Aspirants" className="text-gradient" />
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Trusted by millions of students across India for accurate, timely updates.
            </p>
            <div className="mx-auto mt-4 gradient-line w-24" />
          </div>
        </FadeInView>

        {/* Trust stats bar */}
        <div className="trust-row mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {trustStats.map((s) => (
            <div key={s.label} className="trust-stat flex items-center gap-3 rounded-xl border border-border glass px-5 py-3">
              <s.icon size={18} className="text-primary" />
              <div>
                <p className="font-display text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="why-grid mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <Tilt key={item.title} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} glareColor="hsl(210 100% 56%)" glarePosition="all" glareBorderRadius="1rem" scale={1.02} transitionSpeed={400}>
              <motion.div whileTap={{ scale: 0.98 }}
                className={`why-card spotlight-card group relative flex gap-4 overflow-hidden rounded-2xl border border-border glass-strong p-6 transition-all hover:border-primary/20 hover:shadow-card`}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-110">
                  <item.icon size={26} />
                </div>
                <div className="relative">
                  <h3 className="font-display text-lg font-semibold text-foreground glow-text">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
