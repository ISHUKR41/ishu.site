/**
 * NewsPreview.tsx - Latest News Section on Homepage
 * 
 * Shows 6 sample news articles in a 3-column grid with a breaking news ticker.
 * Each card displays: category badge, trending indicator, title, source, and time.
 * 
 * Features:
 * - Breaking news ticker: Auto-scrolling marquee of trending headlines
 * - Color-coded category badges (Education, Govt Jobs, Banking, etc.)
 * - "Trending" badge with fire icon on popular articles
 * - Tilt cards with spotlight hover effect
 * - GSAP staggered entrance animation
 * - Stats chips: 1000+ Daily Articles, 22 Languages, 30+ Categories
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import { ArrowRight, Clock, TrendingUp, Newspaper, Globe, Zap } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const newsItems = [
  { category: "Education", title: "CBSE Board Exams 2026: Date Sheet Released for Class 10th and 12th", time: "2 hours ago", source: "Times of India", trending: true },
  { category: "Government Jobs", title: "SSC Announces 15,000+ Vacancies for CGL 2026 — Biggest Recruitment Drive", time: "4 hours ago", source: "NDTV", trending: true },
  { category: "Technology", title: "NTA Launches New AI-Powered Exam Portal for JEE & NEET Registrations", time: "5 hours ago", source: "India Today", trending: false },
  { category: "Results", title: "UPSC CSE 2025 Final Results Declared — 933 Candidates Selected", time: "6 hours ago", source: "The Hindu", trending: true },
  { category: "Banking", title: "RBI Grade B 2026 Notification Expected Next Month — Key Details Inside", time: "8 hours ago", source: "Financial Express", trending: false },
  { category: "Defence", title: "Indian Army Agniveer Rally 2026: Online Registration Begins for All States", time: "10 hours ago", source: "Hindustan Times", trending: false },
];

const categoryColors: Record<string, string> = {
  Education: "bg-blue-500/10 text-blue-400",
  "Government Jobs": "bg-emerald-500/10 text-emerald-400",
  Technology: "bg-violet-500/10 text-violet-400",
  Results: "bg-amber-500/10 text-amber-400",
  Banking: "bg-cyan-500/10 text-cyan-400",
  Defence: "bg-rose-500/10 text-rose-400",
};

const newsStats = [
  { icon: Newspaper, val: "1000+", label: "Daily Articles" },
  { icon: Globe, val: "22", label: "Languages" },
  { icon: Zap, val: "30+", label: "Categories" },
];

const NewsPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".news-card",
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ".news-grid", start: "top 88%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-border bg-gradient-to-b from-background via-card/70 to-background py-28 overflow-hidden">
      {/* Enhanced backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-50" />
      <div className="pointer-events-none absolute inset-0 grain" />
      
      {/* Animated orbs */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3], x: [0, -40, 0] }} 
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[8%] top-[10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.45, 0.2], y: [0, 30, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] bottom-[15%] h-[350px] w-[350px] rounded-full bg-[hsl(0,84%,60%,0.05)] blur-[130px]" 
      />

      <div className="container relative z-10">
        <FadeInView>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground">
                <Newspaper size={12} className="text-primary" />
                Live Feed
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                  className="h-1.5 w-1.5 rounded-full bg-destructive" />
              </div>
              <span className="block font-display text-sm font-semibold uppercase tracking-widest text-primary">Stay Updated</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                Latest News & <span className="text-shimmer">Updates</span>
              </h2>
            </div>
            <Link to="/news"
              className="hidden items-center gap-1 rounded-xl border border-border glass px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/30 hover:shadow-glow md:flex">
              All News <ArrowRight size={14} />
            </Link>
          </div>
        </FadeInView>

        {/* News stats */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {newsStats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 rounded-xl border border-border glass px-3 py-1.5 text-xs">
              <s.icon size={12} className="text-primary" />
              <span className="font-bold text-foreground">{s.val}</span>
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Breaking news ticker */}
        <FadeInView delay={0.1}>
          <div className="mt-6 overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5 py-3">
            <div className="flex animate-marquee items-center gap-8 whitespace-nowrap">
              {[...newsItems.filter(n => n.trending), ...newsItems.filter(n => n.trending)].map((news, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <TrendingUp size={14} className="text-destructive" />
                  {news.title}
                </span>
              ))}
            </div>
          </div>
        </FadeInView>

        <div className="news-grid mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((news, i) => (
            <Tilt key={i} tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.04} glareBorderRadius="0.75rem" scale={1.01}>
              <motion.div whileTap={{ scale: 0.98 }}
                className="news-card group spotlight-card flex h-full flex-col rounded-xl border border-border glass-strong p-6 transition-all hover:border-primary/20 hover:shadow-card">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${categoryColors[news.category] || "bg-secondary text-foreground"}`}>
                    {news.category}
                  </span>
                  {news.trending && (
                    <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                      <TrendingUp size={8} /> Trending
                    </span>
                  )}
                </div>
                <h3 className="mt-3 flex-1 font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">{news.source}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {news.time}</span>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
