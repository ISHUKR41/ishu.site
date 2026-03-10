/**
 * LivePulseSection.tsx - Real-time Platform Activity Pulse
 * 
 * A visually stunning section showing live platform activity with
 * animated counters, pulsing dots, and a glassmorphism activity feed.
 * 
 * Features:
 * - GSAP scroll-triggered entrance animations
 * - Framer Motion continuous pulse/glow effects
 * - react-parallax-tilt on stat cards
 * - Animated ring indicators
 * - Simulated live activity feed with typing effect
 * - Gradient mesh background with floating orbs
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import {
  Activity, Users, Globe2, FileText, Newspaper, Radio,
  TrendingUp, Eye, Sparkles, Zap, MapPin, Bell
} from "lucide-react";
import FadeInView from "../animations/FadeInView";

gsap.registerPlugin(ScrollTrigger);

const liveStats = [
  { icon: Users, label: "Active Users", value: "12,847", trend: "+23%", color: "text-blue-400", bg: "bg-blue-500/10", ring: "border-blue-500/30" },
  { icon: Eye, label: "Page Views Today", value: "1,45,920", trend: "+18%", color: "text-emerald-400", bg: "bg-emerald-500/10", ring: "border-emerald-500/30" },
  { icon: FileText, label: "PDFs Processed", value: "8,234", trend: "+31%", color: "text-violet-400", bg: "bg-violet-500/10", ring: "border-violet-500/30" },
  { icon: Newspaper, label: "News Read Today", value: "67,410", trend: "+12%", color: "text-amber-400", bg: "bg-amber-500/10", ring: "border-amber-500/30" },
];

const activities = [
  { user: "Priya S.", action: "checked UPSC CSE 2025 result", location: "Delhi", time: "2s ago" },
  { user: "Rahul K.", action: "merged 5 PDF files", location: "Mumbai", time: "5s ago" },
  { user: "Ankit M.", action: "read SSC CGL notification", location: "Patna", time: "8s ago" },
  { user: "Sneha R.", action: "translated news to Hindi", location: "Lucknow", time: "12s ago" },
  { user: "Vikram P.", action: "downloaded admit card", location: "Jaipur", time: "15s ago" },
  { user: "Meera T.", action: "compressed PDF to 2MB", location: "Chennai", time: "18s ago" },
  { user: "Arun D.", action: "checked Bihar BPSC result", location: "Ranchi", time: "22s ago" },
  { user: "Kavita N.", action: "read banking news", location: "Pune", time: "25s ago" },
];

const LivePulseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleActivities, setVisibleActivities] = useState(activities.slice(0, 4));
  const [activityIndex, setActivityIndex] = useState(4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pulse-stat",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.1, duration: 0.6, ease: "power3.out", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Rotate activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => {
        const next = (prev + 1) % activities.length;
        setVisibleActivities((old) => {
          const updated = [...old.slice(1), activities[next]];
          return updated;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-border py-20 md:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced opacity-30" />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[200px]"
      />

      <div className="container relative">
        <FadeInView>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border glass px-5 py-2 text-xs text-muted-foreground">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-2 w-2 rounded-full bg-success"
              />
              <span><strong className="text-foreground">ISHU</strong> — Indian StudentHub University · Live Now</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Platform <span className="text-gradient">Activity Pulse</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Real-time snapshot of what's happening on ISHU right now — thousands of students, every second.
            </p>
          </div>
        </FadeInView>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {liveStats.map((stat) => (
            <Tilt key={stat.label} tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable glareMaxOpacity={0.05} glareBorderRadius="1rem" scale={1.01}>
              <div className={`pulse-stat rounded-2xl border ${stat.ring} glass-strong p-5 transition-all hover:shadow-glow`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center gap-1 text-xs font-medium text-success"
                  >
                    <Activity size={10} />
                    <span>LIVE</span>
                  </motion.div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                    <TrendingUp size={10} /> {stat.trend}
                  </span>
                </div>
              </div>
            </Tilt>
          ))}
        </div>

        {/* Live Activity Feed */}
        <FadeInView delay={0.2}>
          <div className="mx-auto max-w-2xl rounded-2xl border border-border glass-strong p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <Radio size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Live Activity Feed</span>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="h-1.5 w-1.5 rounded-full bg-success ml-auto"
              />
            </div>
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {visibleActivities.map((activity, i) => (
                  <motion.div
                    key={`${activity.user}-${activity.action}-${i}`}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 rounded-lg bg-secondary/30 px-3 py-2 text-xs"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Users size={12} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-muted-foreground shrink-0">
                      <MapPin size={9} />
                      <span>{activity.location}</span>
                    </div>
                    <span className="text-muted-foreground/60 shrink-0">{activity.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default LivePulseSection;
