/**
 * CallToActionSection.tsx - Premium Final CTA Section
 * 
 * Eye-catching call to action with 3D effects, particle-like floating elements,
 * animated gradients, and magnetic buttons. Placed near bottom of home page.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Rocket, Star, Zap, Shield, Globe, Users, FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import MagneticButton from "../animations/MagneticButton";
import FadeInView from "../animations/FadeInView";

gsap.registerPlugin(ScrollTrigger);

const quickStats = [
  { icon: Users, value: "1M+", label: "Students" },
  { icon: FileText, value: "100+", label: "Tools" },
  { icon: Globe, value: "36", label: "States" },
  { icon: Star, value: "4.9", label: "Rating" },
];

const CallToActionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-stat-item",
        { y: 30, opacity: 0, scale: 0.8 },
        {
          scrollTrigger: { trigger: ".cta-stats-row", start: "top 88%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.1, duration: 0.6, ease: "back.out(1.7)", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-36">
      {/* Multi-layer backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-[hsl(220,40%,6%)] to-background" />
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced opacity-80" />
      <div className="pointer-events-none absolute inset-0 holo-effect opacity-40" />
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Large animated orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -60, 0], scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[15%] top-[20%] h-[700px] w-[700px] rounded-full bg-primary/10 blur-[200px] morph-blob"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 50, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-[hsl(260,100%,66%,0.08)] blur-[180px] morph-blob"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[hsl(170,100%,50%,0.05)] blur-[160px]"
      />

      {/* Floating sparkle particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30 - i * 5, 0],
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.3, ease: "easeInOut" }}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-primary/40"
          style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%` }}
        />
      ))}

      <div className="container relative z-10">
        <FadeInView>
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
            >
              <Rocket size={14} className="text-primary" />
              <span className="font-semibold text-foreground">Start Your Journey Today</span>
              <motion.span
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-2 w-2 rounded-full bg-[hsl(var(--success))]"
              />
            </motion.div>

            {/* Heading */}
            <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Ready to Ace Your{" "}
              <span className="text-shimmer">Next Exam?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Join 1M+ students using <strong className="text-foreground">ISHU — Indian StudentHub University</strong> for
              exam results, PDF tools, live news, and expert preparation guides. 100% free, forever.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton>
                <Link
                  to="/auth/signup"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-10 py-4 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <Sparkles size={16} className="relative" />
                  <span className="relative">Join Free — No Credit Card</span>
                  <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  to="/tools"
                  className="group flex items-center gap-2 rounded-xl border border-border glass px-10 py-4 font-display text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:shadow-glow"
                >
                  <Zap size={16} className="text-primary" />
                  Try PDF Tools
                </Link>
              </MagneticButton>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              {[
                { icon: Shield, text: "100% Free" },
                { icon: Zap, text: "No Login Required for Tools" },
                { icon: Globe, text: "All India Coverage" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5">
                  <b.icon size={12} className="text-success" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>

        {/* Stats row */}
        <div className="cta-stats-row mt-16 flex flex-wrap items-center justify-center gap-5">
          {quickStats.map((s) => (
            <Tilt key={s.label} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.03} glareEnable glareMaxOpacity={0.06} glareBorderRadius="0.75rem">
              <div className="cta-stat-item flex items-center gap-3 rounded-xl border border-border glass-strong px-6 py-4 transition-all hover:border-primary/20 hover:shadow-glow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
