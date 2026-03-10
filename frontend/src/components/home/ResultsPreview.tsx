/**
 * ResultsPreview.tsx - Latest Results & Vacancies Section
 * 
 * Shows a preview of the 5 latest government exam updates on the homepage.
 * Each row displays: category badge, status (Active/Result Out/Upcoming),
 * title, organization name, vacancy count, last date, and a "View" button.
 * 
 * Features:
 * - Live indicator badge with pulsing green dot
 * - Quick stats bar (500+ Active Posts, 1.5L+ Vacancies, etc.)
 * - GSAP staggered row entrance animation
 * - Hover effect: rows slide slightly to the right
 * - Links to the full Results page
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import { ArrowRight, Calendar, Users as UsersIcon, FileText, TrendingUp, Award, Zap } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const latestResults = [
  { title: "SSC CGL 2026 Notification", body: "Staff Selection Commission", category: "SSC", type: "vacancy", vacancies: 14582, lastDate: "30 Apr 2026", status: "active" },
  { title: "UPSC Civil Services 2026", body: "Union Public Service Commission", category: "UPSC", type: "vacancy", vacancies: 1056, lastDate: "15 Apr 2026", status: "active" },
  { title: "IBPS PO 2026 Result", body: "Institute of Banking Personnel", category: "Banking", type: "result", vacancies: 4500, lastDate: "Result Out", status: "result_out" },
  { title: "RRB NTPC 2026 CBT-2", body: "Railway Recruitment Board", category: "Railways", type: "admit_card", vacancies: 35208, lastDate: "20 Mar 2026", status: "upcoming" },
  { title: "NEET UG 2026 Registration", body: "National Testing Agency", category: "NTA", type: "vacancy", vacancies: 108000, lastDate: "10 Apr 2026", status: "active" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  result_out: "bg-primary/10 text-primary",
  upcoming: "bg-warning/10 text-warning",
  expired: "bg-destructive/10 text-destructive",
};
const statusLabels: Record<string, string> = {
  active: "Active", result_out: "Result Out", upcoming: "Upcoming", expired: "Expired",
};

const quickStats = [
  { icon: FileText, val: "500+", label: "Active Posts" },
  { icon: UsersIcon, val: "1.5L+", label: "Total Vacancies" },
  { icon: Award, val: "36", label: "States" },
  { icon: Zap, val: "Daily", label: "Updates" },
];

const ResultsPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".result-row",
        { x: -20, opacity: 0 },
        { scrollTrigger: { trigger: ".results-list", start: "top 88%", toggleActions: "play none none none" },
          x: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".result-stat",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: ".result-stats-row", start: "top 88%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.4, ease: "back.out(1.7)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-border bg-gradient-to-b from-background via-card/70 to-background py-28 overflow-hidden">
      {/* Enhanced backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-25" />
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-50" />
      <div className="pointer-events-none absolute inset-0 grain" />
      
      {/* Animated orbs */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3], x: [0, 45, 0] }} 
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[5%] top-[10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.45, 0.2], y: [0, 35, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] bottom-[15%] h-[350px] w-[350px] rounded-full bg-[hsl(142,76%,46%,0.06)] blur-[130px]" 
      />

      <div className="container relative z-10">
        <FadeInView>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground">
                <TrendingUp size={12} className="text-primary" />
                Live Updates
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                  className="h-1.5 w-1.5 rounded-full bg-success" />
              </div>
              <span className="block font-display text-sm font-semibold uppercase tracking-widest text-primary">Latest Updates</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                Recent Results & <span className="text-shimmer">Vacancies</span>
              </h2>
            </div>
            <Link to="/results"
              className="hidden items-center gap-1 rounded-xl border border-border glass px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/30 hover:shadow-glow md:flex">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </FadeInView>

        {/* Quick stats */}
        <div className="result-stats-row mt-8 flex flex-wrap items-center gap-4">
          {quickStats.map((s) => (
            <div key={s.label} className="result-stat flex items-center gap-2 rounded-xl border border-border glass px-4 py-2">
              <s.icon size={14} className="text-primary" />
              <span className="text-sm font-bold text-foreground">{s.val}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="results-list mt-8 space-y-3">
          {latestResults.map((result, i) => (
            <FadeInView key={result.title} delay={i * 0.04}>
              <motion.div whileHover={{ x: 4 }}
                className="result-row group flex flex-col gap-4 rounded-xl border border-border glass-strong p-5 transition-all hover:border-primary/20 hover:shadow-card sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-secondary px-2.5 py-1 font-display text-xs font-semibold text-foreground">{result.category}</span>
                    <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${statusColors[result.status]}`}>{statusLabels[result.status]}</span>
                    {result.status === "active" && (
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                        className="h-1.5 w-1.5 rounded-full bg-success" />
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{result.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{result.body}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <UsersIcon size={14} className="text-primary" />
                    <span className="font-medium text-foreground">{result.vacancies.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{result.lastDate}</span>
                  </div>
                  <Link to="/results"
                    className="group/btn flex items-center gap-1 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                    View <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.3}>
          <div className="mt-8 text-center md:hidden">
            <Link to="/results" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              View All Results <ArrowRight size={14} />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default ResultsPreview;
