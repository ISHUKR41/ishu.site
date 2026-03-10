/**
 * TechStackSection.tsx - Premium Technology & Trust Section
 * 
 * Showcases ISHU platform capabilities with animated tech cards,
 * floating icons, gradient mesh backgrounds, and 3D tilt effects.
 * Heavy use of gsap, framer-motion, react-parallax-tilt.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import {
  Cpu, Database, Globe, Layers, Lock, Wifi,
  Smartphone, Cloud, Code, BarChart3, Fingerprint,
  Sparkles, Zap, ArrowRight, CheckCircle
} from "lucide-react";
import FadeInView from "../animations/FadeInView";
import NumberTicker from "../animations/NumberTicker";

gsap.registerPlugin(ScrollTrigger);

const techFeatures = [
  {
    icon: Cpu, title: "AI-Powered Engine",
    desc: "Advanced AI processes 1000+ news articles daily, auto-categorizes content, and powers smart search.",
    stats: "50ms", statsLabel: "Avg Response",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Database, title: "Real-time Database",
    desc: "Instant sync across devices. Results appear within seconds of official announcement.",
    stats: "99.9%", statsLabel: "Uptime",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Lock, title: "Bank-Grade Security",
    desc: "End-to-end encryption, secure authentication, and privacy-first architecture.",
    stats: "256-bit", statsLabel: "Encryption",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Globe, title: "CDN Worldwide",
    desc: "Content delivered from edge servers closest to you for blazing-fast load times.",
    stats: "<1s", statsLabel: "Load Time",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Smartphone, title: "Mobile-First PWA",
    desc: "Works offline, installable on any device, push notifications for instant alerts.",
    stats: "100", statsLabel: "Lighthouse",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Layers, title: "Microservices",
    desc: "Modular architecture ensures each feature scales independently for millions of users.",
    stats: "10M+", statsLabel: "Requests/Day",
    gradient: "from-teal-500 to-cyan-600",
  },
];

const floatingIcons = [
  { icon: Code, x: "10%", y: "20%", delay: 0 },
  { icon: Cloud, x: "85%", y: "15%", delay: 1.5 },
  { icon: BarChart3, x: "5%", y: "70%", delay: 3 },
  { icon: Fingerprint, x: "90%", y: "75%", delay: 2 },
  { icon: Wifi, x: "50%", y: "8%", delay: 4 },
  { icon: Zap, x: "45%", y: "85%", delay: 2.5 },
];

const TechStackSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tech-card",
        { y: 60, opacity: 0, rotateX: 10 },
        {
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, rotateX: 0,
          stagger: 0.1, duration: 0.8, ease: "power4.out", clearProps: "all",
        }
      );
      gsap.fromTo(
        ".tech-heading-word",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tech-heading-container", start: "top 88%", toggleActions: "play none none none" },
          y: 0, opacity: 1,
          stagger: 0.06, duration: 0.7, ease: "power3.out", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-36 border-t border-border">
      {/* Multi-layer background */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-10" />
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[5%] top-[10%] h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px] morph-blob"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[hsl(260,100%,66%,0.06)] blur-[160px] morph-blob"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]"
      />

      {/* Floating icons */}
      {floatingIcons.map((fi, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ repeat: Infinity, duration: 6 + i, delay: fi.delay, ease: "easeInOut" }}
          className="pointer-events-none absolute z-0"
          style={{ left: fi.x, top: fi.y, y: parallaxY }}
        >
          <fi.icon size={28} className="text-primary/20" />
        </motion.div>
      ))}

      <div className="container relative z-10">
        {/* Section header */}
        <FadeInView>
          <div className="tech-heading-container mx-auto mb-16 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
            >
              <Cpu size={14} className="text-primary" />
              <span className="font-semibold text-foreground">Built with Modern Tech</span>
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {"Powered by ".split(" ").map((word, i) => (
                <span key={i} className="tech-heading-word inline-block mr-2">{word}</span>
              ))}
              <span className="tech-heading-word inline-block text-shimmer">World-Class</span>{" "}
              <span className="tech-heading-word inline-block">Technology</span>
            </h2>

            <p className="mt-5 text-lg text-muted-foreground">
              Enterprise-grade infrastructure ensuring speed, security, and reliability for millions of students
            </p>
          </div>
        </FadeInView>

        {/* Tech cards grid */}
        <div ref={gridRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {techFeatures.map((tech) => (
            <Tilt
              key={tech.title}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable
              glareMaxOpacity={0.08}
              glareColor="hsl(210 100% 56%)"
              glareBorderRadius="1rem"
              scale={1.02}
              transitionSpeed={400}
            >
              <div className="tech-card group spotlight-card relative h-full overflow-hidden rounded-2xl border border-border glass-strong p-7 transition-all duration-500 hover:border-primary/25 hover:shadow-glow">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  {/* Icon with gradient bg */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${tech.gradient} text-white shadow-lg`}
                  >
                    <tech.icon size={26} />
                  </motion.div>

                  {/* Title & desc */}
                  <h3 className="font-display text-lg font-bold text-foreground">{tech.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tech.desc}</p>

                  {/* Stats badge */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-1.5">
                      <CheckCircle size={12} className="text-success" />
                      <span className="font-display text-sm font-bold text-foreground">{tech.stats}</span>
                      <span className="text-[10px] text-muted-foreground">{tech.statsLabel}</span>
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100"
                  >
                    Learn More <ArrowRight size={12} />
                  </motion.div>
                </div>
              </div>
            </Tilt>
          ))}
        </div>

        {/* Bottom stats row */}
        <FadeInView delay={0.3}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { value: 10, suffix: "M+", label: "API Calls / Month" },
              { value: 36, suffix: "", label: "States Connected" },
              { value: 100, suffix: "+", label: "PDF Tools Running" },
              { value: 22, suffix: "", label: "Languages Supported" },
            ].map((s) => (
              <Tilt key={s.label} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                <div className="flex items-center gap-3 rounded-xl border border-border glass px-6 py-4 transition-all hover:border-primary/20 hover:shadow-glow">
                  <div className="font-display text-2xl font-bold text-foreground">
                    <NumberTicker value={s.value} />
                    <span className="text-primary">{s.suffix}</span>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                </div>
              </Tilt>
            ))}
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default TechStackSection;
