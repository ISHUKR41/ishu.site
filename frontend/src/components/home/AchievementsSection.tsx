/**
 * AchievementsSection.tsx - Animated Milestones & Achievements
 * 
 * Premium section showcasing ISHU platform achievements with
 * animated timeline, counters, and 3D effects.
 */

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import {
  Rocket, Award, Globe, Users, Zap, Shield,
  Sparkles, TrendingUp, Star, GraduationCap, CheckCircle
} from "lucide-react";
import FadeInView from "../animations/FadeInView";
import NumberTicker from "../animations/NumberTicker";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  { icon: Users, value: 1000000, suffix: "+", label: "Students Helped", color: "from-blue-500 to-cyan-500" },
  { icon: Globe, value: 36, suffix: "", label: "States Covered", color: "from-emerald-500 to-green-500" },
  { icon: Zap, value: 100, suffix: "+", label: "Free PDF Tools", color: "from-violet-500 to-purple-500" },
  { icon: GraduationCap, value: 500, suffix: "+", label: "Exams Tracked", color: "from-amber-500 to-orange-500" },
  { icon: Star, value: 1000, suffix: "+", label: "Daily News", color: "from-rose-500 to-pink-500" },
  { icon: Shield, value: 99, suffix: ".9%", label: "Uptime", color: "from-teal-500 to-cyan-500" },
];

const milestones = [
  { year: "2024", title: "Platform Conceived", desc: "Research & development started for India's most comprehensive exam platform.", icon: Sparkles, status: "done" },
  { year: "2025", title: "Beta Launch", desc: "Launched with 50+ PDF tools, results for 10 major exam boards, and blog platform.", icon: Rocket, status: "done" },
  { year: "2026", title: "Full Platform Live", desc: "100+ tools, 36 states, WhatsApp alerts, news feed, and 22 language support.", icon: Award, status: "active" },
  { year: "Future", title: "AI Test Series", desc: "AI-powered mock tests, personalized study plans, and native mobile app.", icon: TrendingUp, status: "upcoming" },
];

const AchievementsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".achievement-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          scrollTrigger: { trigger: ".achievements-grid", start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.08, duration: 0.6, ease: "back.out(1.7)", clearProps: "all",
        }
      );
      gsap.fromTo(
        ".milestone-item",
        { x: -50, opacity: 0 },
        {
          scrollTrigger: { trigger: ".milestones-timeline", start: "top 80%", toggleActions: "play none none none" },
          x: 0, opacity: 1,
          stagger: 0.15, duration: 0.7, ease: "power3.out", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 border-t border-border">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-10" />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[5%] top-[15%] h-[450px] w-[450px] rounded-full bg-primary/5 blur-[150px]"
      />

      <div className="container relative">
        {/* Header */}
        <FadeInView>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
            >
              <Award size={14} className="text-primary" />
              <span className="font-semibold text-foreground">ISHU Achievements</span>
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Our <span className="text-shimmer">Journey</span> So Far
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built with passion for India's government exam aspirants
            </p>
          </div>
        </FadeInView>

        {/* Achievement counters grid */}
        <div className="achievements-grid grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {achievements.map((a) => (
            <Tilt key={a.label} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} glareEnable glareMaxOpacity={0.06} glareBorderRadius="1rem">
              <div className="achievement-card group rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-glow">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} text-white shadow-lg`}
                >
                  <a.icon size={22} />
                </motion.div>
                <div className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  <NumberTicker value={a.value} />
                  <span className="text-primary">{a.suffix}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.label}</p>
              </div>
            </Tilt>
          ))}
        </div>

        {/* Timeline */}
        <div className="milestones-timeline mt-20 mx-auto max-w-3xl">
          <FadeInView>
            <h3 className="mb-10 text-center font-display text-2xl font-bold text-foreground">
              Platform <span className="text-gradient">Timeline</span>
            </h3>
          </FadeInView>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent md:left-1/2 md:-translate-x-px" />

            {milestones.map((m, i) => (
              <div key={m.year} className={`milestone-item relative flex gap-6 pb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-6 -translate-x-1/2 md:left-1/2">
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      m.status === "done" ? "border-success bg-success/10" :
                      m.status === "active" ? "border-primary bg-primary/10 animate-pulse" :
                      "border-border bg-card"
                    }`}
                  >
                    <m.icon size={18} className={
                      m.status === "done" ? "text-success" :
                      m.status === "active" ? "text-primary" :
                      "text-muted-foreground"
                    } />
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-glow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                          m.status === "done" ? "bg-success/10 text-success" :
                          m.status === "active" ? "bg-primary/10 text-primary" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {m.year}
                        </span>
                        {m.status === "done" && <CheckCircle size={12} className="text-success" />}
                      </div>
                      <h4 className="font-display text-base font-bold text-foreground">{m.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                    </div>
                  </Tilt>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
