/**
 * PlatformOverview.tsx - Premium Platform Capabilities Showcase
 *
 * A visually rich section that highlights ISHU's core pillars with
 * animated cards, number tickers, and a split layout.
 * Positioned after StatsSection on the home page.
 *
 * Features:
 * - "Indian StudentHub University" full brand display
 * - 4 animated capability cards with gradient overlays
 * - Hover-triggered micro-animations
 * - GSAP scroll-triggered stagger entrance
 * - Glassmorphism & gradient mesh background
 * - Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
 */

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import {
  FileText, Newspaper, GraduationCap, Wrench,
  ArrowRight, Sparkles, Shield, Globe, Zap, BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import FadeInView from "../animations/FadeInView";
import NumberTicker from "../animations/NumberTicker";

gsap.registerPlugin(ScrollTrigger);

// Each pillar of the ISHU platform
const pillars = [
  {
    icon: GraduationCap,
    title: "Exam Results",
    desc: "Central & state-level government exam results, vacancies, admit cards & answer keys — updated in real-time from official sources.",
    stat: 500,
    statSuffix: "+",
    statLabel: "Active Posts",
    href: "/results",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Wrench,
    title: "PDF Tools",
    desc: "Merge, split, compress, convert, OCR & more — 100+ tools that run entirely in your browser. No uploads, no sign-up, 100% free.",
    stat: 100,
    statSuffix: "+",
    statLabel: "Free Tools",
    href: "/tools",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: Newspaper,
    title: "Live News",
    desc: "1000+ daily articles across 30 categories in 22 Indian languages — from government job notifications to education policy updates.",
    stat: 1000,
    statSuffix: "+",
    statLabel: "Daily Articles",
    href: "/news",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: BookOpen,
    title: "Expert Blog",
    desc: "Topper strategies, subject-wise guides, and success stories — curated by experts who've cracked UPSC, SSC, Banking & more.",
    stat: 50,
    statSuffix: "+",
    statLabel: "Guides",
    href: "/blog",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
];

const PlatformOverview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pillar-card",
        { y: 60, opacity: 0, scale: 0.92 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.12, duration: 0.8, ease: "back.out(1.5)", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-10" />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[15%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-[hsl(260,100%,66%,0.04)] blur-[120px]"
      />

      <div className="container relative">
        {/* Section header */}
        <FadeInView>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Everything You Need,{" "}
              <span className="text-gradient">One Platform</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From exam results to PDF tools to daily news — ISHU is India's most comprehensive platform for government exam aspirants.
            </p>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {[
                { icon: Shield, text: "Verified Sources" },
                { icon: Globe, text: "All 36 States" },
                { icon: Zap, text: "Real-time Updates" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <badge.icon size={12} className="text-primary" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>

        {/* Pillar cards grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <Tilt key={pillar.title} tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} glareEnable glareMaxOpacity={0.08} glareBorderRadius="1rem">
              <Link to={pillar.href} className="pillar-card group block">
                <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
                  {/* Background gradient overlay */}
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* Icon */}
                  <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${pillar.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <pillar.icon size={22} className={pillar.iconColor} />
                  </div>

                  {/* Stat ticker */}
                  <div className="relative mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-bold text-foreground">
                        <NumberTicker value={pillar.stat} />
                      </span>
                      <span className="text-lg font-bold text-primary">{pillar.statSuffix}</span>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{pillar.statLabel}</p>
                  </div>

                  {/* Title & description */}
                  <h3 className="relative font-display text-lg font-bold text-foreground">{pillar.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.desc}</p>

                  {/* CTA arrow */}
                  <div className="relative mt-5 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;
