/**
 * FeaturesSection.tsx - Platform Features Showcase
 * 
 * Displays the 6 main platform features in a responsive grid:
 * 1. Government Results - Exam results for UPSC, SSC, Banking, etc.
 * 2. 100+ PDF Tools - Browser-based document processing
 * 3. Live News Feed - 1000+ daily articles in 22 languages
 * 4. Expert Blog - Preparation guides and topper strategies
 * 5. WhatsApp Alerts - Instant notifications for vacancies
 * 6. All 36 States - Pan-India coverage for state-level exams
 * 
 * Each card has: icon, title, description, highlight bullets, hover effects,
 * tilt animation, gradient overlays, and links to the relevant page.
 */

import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import { FileText, Wrench, Newspaper, BookOpen, Bell, Shield, ArrowRight, Check } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: FileText, title: "Government Results",
    description: "Central & State-level exam results, admit cards, answer keys for UPSC, SSC, Banking, Railways, NTA & more.",
    highlights: ["Real-time updates", "All 36 states", "Official sources"],
    gradient: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
    glowColor: "group-hover:shadow-[0_0_40px_hsl(210,100%,56%,0.1)]", link: "/results",
  },
  {
    icon: Wrench, title: "100+ PDF Tools",
    description: "Merge, split, compress, convert — complete PDF toolkit. Free, fast, and works right in your browser.",
    highlights: ["No uploads needed", "Browser-based", "100% free"],
    gradient: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10",
    glowColor: "group-hover:shadow-[0_0_40px_hsl(142,76%,46%,0.1)]", link: "/tools",
  },
  {
    icon: Newspaper, title: "Live News Feed",
    description: "1000+ news articles daily across 30 categories. Multi-language support with auto-translation.",
    highlights: ["30+ categories", "22 languages", "Real-time feed"],
    gradient: "from-orange-500/20 to-amber-500/20", iconColor: "text-orange-400", iconBg: "bg-orange-500/10",
    glowColor: "group-hover:shadow-[0_0_40px_hsl(38,92%,50%,0.1)]", link: "/news",
  },
  {
    icon: BookOpen, title: "Expert Blog",
    description: "In-depth exam guides, preparation tips, syllabus analysis & success stories from toppers.",
    highlights: ["Topper strategies", "Study plans", "Free guides"],
    gradient: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400", iconBg: "bg-purple-500/10",
    glowColor: "group-hover:shadow-[0_0_40px_hsl(260,100%,66%,0.1)]", link: "/blog",
  },
  {
    icon: Bell, title: "WhatsApp Alerts",
    description: "Get instant notifications on WhatsApp for new vacancies, results & admit cards. Never miss a deadline.",
    highlights: ["Instant delivery", "Customizable", "Free forever"],
    gradient: "from-green-500/20 to-emerald-500/20", iconColor: "text-green-400", iconBg: "bg-green-500/10",
    glowColor: "group-hover:shadow-[0_0_40px_hsl(142,76%,46%,0.1)]", link: "/contact",
  },
  {
    icon: Shield, title: "All 36 States & UTs",
    description: "Complete coverage of all Indian states and union territories with state-specific exam updates.",
    highlights: ["State-wise pages", "Local exams", "UT coverage"],
    gradient: "from-rose-500/20 to-red-500/20", iconColor: "text-rose-400", iconBg: "bg-rose-500/10",
    glowColor: "group-hover:shadow-[0_0_40px_hsl(0,84%,60%,0.1)]", link: "/results",
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".feature-heading",
        { y: 60, opacity: 0 },
        { scrollTrigger: { trigger: ".feature-heading", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 1, ease: "power4.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-card/50 to-background">
      {/* Multiple layered backgrounds */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 holo-effect" />
      
      {/* Grain texture */}
      <div className="pointer-events-none absolute inset-0 grain" />
      
      {/* Animated orbs */}
      <motion.div 
        animate={{ opacity: [0.4, 0.7, 0.4], x: [0, 30, 0] }} 
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[8%] top-[15%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, -30, 0] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[8%] bottom-[15%] h-[350px] w-[350px] rounded-full bg-[hsl(260,100%,66%,0.08)] blur-[130px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[180px]" 
      />
      
      <div className="container relative z-10">
        <FadeInView>
          <div className="feature-heading mx-auto max-w-2xl text-center">
            <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
              Everything You Need
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              One Platform,{" "}
              <span className="text-shimmer">Infinite Possibilities</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From exam results to PDF tools — we've got every student covered.
            </p>
            <div className="mx-auto mt-4 gradient-line w-24" />
          </div>
        </FadeInView>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FadeInView key={feature.title} delay={i * 0.08}>
              <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} glareColor="hsl(210 100% 56%)" glarePosition="all" glareBorderRadius="1rem" scale={1.02} transitionSpeed={400}>
                <motion.div whileTap={{ scale: 0.98 }}
                  className={`group spotlight-card relative overflow-hidden rounded-2xl border border-border glass-strong p-8 transition-all duration-500 hover:border-primary/20 ${feature.glowColor} h-full`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`mb-5 inline-flex rounded-xl ${feature.iconBg} p-3.5 ${feature.iconColor} transition-all duration-300`}>
                      <feature.icon size={26} />
                    </motion.div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>

                    {/* Feature highlights */}
                    <div className="mt-4 space-y-1.5">
                      {feature.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check size={10} className="text-success shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <Link to={feature.link}
                      className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100 hover:gap-2">
                      Explore <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              </Tilt>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
