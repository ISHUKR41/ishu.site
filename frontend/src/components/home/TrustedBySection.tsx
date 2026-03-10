/**
 * TrustedBySection.tsx - "Trusted & Featured In" Section
 * 
 * Shows media partner names in two auto-scrolling marquee rows
 * (forward and reverse direction). Creates social proof.
 * 
 * Features:
 * - Trust badges: Verified Sources, 1M+ Users, #1 Platform, 4.9 Rating
 * - Double marquee: Names scroll continuously in opposite directions
 * - Gradient fade masks on left/right edges
 * - GSAP entrance animations for badges
 * - Subtle background glow effect
 */

import FadeInView from "../animations/FadeInView";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, CheckCircle, Award, Star, Verified } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  "Times of India", "NDTV", "India Today", "The Hindu", "Hindustan Times",
  "Financial Express", "Economic Times", "Jagran Josh", "Career360", "LiveMint",
  "Dainik Bhaskar", "Aaj Tak", "Republic", "CNBC-TV18", "Business Standard"
];

const trustBadges = [
  { icon: Shield, label: "Verified Sources", color: "text-emerald-400" },
  { icon: CheckCircle, label: "1M+ Users", color: "text-blue-400" },
  { icon: Award, label: "#1 Platform", color: "text-amber-400" },
  { icon: Star, label: "4.9 Rating", color: "text-violet-400" },
];

const TrustedBySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".trusted-label",
        { y: 20, opacity: 0 },
        { scrollTrigger: { trigger: sectionRef.current, start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".trust-badge",
        { scale: 0, opacity: 0 },
        { scrollTrigger: { trigger: ".trust-badges-row", start: "top 90%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.08, duration: 0.4, ease: "back.out(2)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-border py-20 overflow-hidden">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-primary/5 blur-[100px]"
      />
      
      <div className="container relative">
        <FadeInView>
          <div className="flex flex-col items-center gap-4">
            <p className="trusted-label text-center text-sm font-semibold uppercase tracking-widest text-primary">
              Trusted & Featured In
            </p>
            
            {/* Trust badges row */}
            <div className="trust-badges-row flex flex-wrap items-center justify-center gap-3 mt-2">
              {trustBadges.map((b) => (
                <motion.div 
                  key={b.label} 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="trust-badge flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30"
                >
                  <b.icon size={12} className={b.color} />
                  {b.label}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-2 gradient-line w-20" />
          </div>
        </FadeInView>

        {/* Double marquee with enhanced styling */}
        <div className="mt-10 relative">
          {/* Gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background via-background/80 to-transparent" />
          
          {/* First row - forward */}
          <div className="overflow-hidden py-2">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
              className="flex items-center gap-14 whitespace-nowrap"
            >
              {[...partners, ...partners].map((p, i) => (
                <span 
                  key={i} 
                  className="text-xl font-display font-bold text-muted-foreground/20 hover:text-primary/70 transition-all duration-300 cursor-default hover:scale-105"
                >
                  {p}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Second row - reverse */}
          <div className="mt-5 overflow-hidden py-2">
            <motion.div 
              animate={{ x: ["-50%", "0%"] }} 
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="flex items-center gap-14 whitespace-nowrap"
            >
              {[...partners.slice().reverse(), ...partners.slice().reverse()].map((p, i) => (
                <span 
                  key={i} 
                  className="text-lg font-display font-semibold text-muted-foreground/15 hover:text-primary/50 transition-all duration-300 cursor-default hover:scale-105"
                >
                  {p}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Bottom accent */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto mt-10 h-px w-64 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>
    </section>
  );
};

export default TrustedBySection;
