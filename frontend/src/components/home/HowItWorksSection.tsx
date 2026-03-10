/**
 * HowItWorksSection.tsx - Animated Step-by-Step Guide
 * 
 * Shows how ISHU platform works in 4 simple steps with
 * connected animated timeline, GSAP stagger, and 3D tilt cards.
 */

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { Search, Bell, FileText, Trophy, ArrowRight, Sparkles } from "lucide-react";
import FadeInView from "../animations/FadeInView";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search & Discover",
    desc: "Find government exam results, vacancies, admit cards & answer keys from all 36 states and central boards.",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    lineColor: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bell,
    step: "02",
    title: "Get Instant Alerts",
    desc: "Subscribe to WhatsApp notifications for your preferred exam categories. Never miss a deadline again.",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    lineColor: "from-emerald-500 to-green-500",
  },
  {
    icon: FileText,
    step: "03",
    title: "Use Free Tools",
    desc: "Access 100+ PDF tools — merge, split, compress, convert & more. Everything runs in your browser, 100% free.",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    lineColor: "from-violet-500 to-purple-500",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Achieve Your Goals",
    desc: "Stay informed with 1000+ daily news, expert blogs, and preparation guides. Crack your dream exam!",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    lineColor: "from-amber-500 to-orange-500",
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".how-step-card",
        { y: 60, opacity: 0, scale: 0.9 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.15, duration: 0.8, ease: "back.out(1.5)", clearProps: "all",
        }
      );
      gsap.fromTo(
        ".how-connector",
        { scaleX: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" },
          scaleX: 1, stagger: 0.2, duration: 0.6, delay: 0.5, ease: "power3.out", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-background via-card/30 to-background">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" />
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[15%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-[hsl(260,100%,66%,0.04)] blur-[120px]"
      />

      <div className="container relative">
        <FadeInView>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="font-semibold text-foreground">How ISHU Works</span>
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Simple Steps to{" "}
              <span className="text-gradient">Success</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From discovering results to cracking your exam — ISHU makes it effortless.
            </p>
            <div className="mx-auto mt-5 gradient-line w-24" />
          </div>
        </FadeInView>

        {/* Steps grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {/* Connector line (hidden on last item and mobile) */}
              {i < steps.length - 1 && (
                <div className="how-connector pointer-events-none absolute right-0 top-16 hidden h-0.5 w-8 origin-left xl:block -mr-4 z-10">
                  <div className={`h-full w-full rounded-full bg-gradient-to-r ${step.lineColor} opacity-30`} />
                </div>
              )}

              <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} glareEnable glareMaxOpacity={0.08} glareBorderRadius="1rem">
                <div className="how-step-card group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* Step number */}
                  <div className="relative mb-4 flex items-center justify-between">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-xl ${step.iconBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <step.icon size={26} className={step.iconColor} />
                    </motion.div>
                    <span className="font-display text-4xl font-bold text-border/50 group-hover:text-primary/20 transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="relative font-display text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>

                  <div className="relative mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Learn more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
