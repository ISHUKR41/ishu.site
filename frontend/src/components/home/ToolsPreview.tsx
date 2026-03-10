/**
 * ToolsPreview.tsx - PDF Tools Showcase Section
 * 
 * Displays the 12 most popular PDF tools in a responsive grid on the homepage.
 * Each tool card shows an icon, name, and short description.
 * 
 * Features:
 * - Stats row: 100+ Total Tools, 0 Files Stored, 10M+ Processed, Free Forever
 * - Privacy banner: "Your files never leave your device"
 * - Tilt cards with hover glow effects
 * - GSAP staggered entrance animation (back.out easing)
 * - Magnetic CTA button linking to full tools page
 * - Holographic and mesh gradient background effects
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import MagneticButton from "../animations/MagneticButton";
import {
  ArrowRight, Merge, Scissors, FileDown, FileUp, Lock, Unlock, Image, FileEdit, RotateCw, FileSearch, Stamp, ScanLine,
  Sparkles, Shield, Zap, Globe
} from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { icon: Merge, name: "Merge PDF", desc: "Combine multiple PDFs", color: "text-blue-400" },
  { icon: Scissors, name: "Split PDF", desc: "Extract pages", color: "text-rose-400" },
  { icon: FileDown, name: "Compress PDF", desc: "Reduce file size", color: "text-emerald-400" },
  { icon: FileUp, name: "PDF to Word", desc: "Convert to DOCX", color: "text-violet-400" },
  { icon: Image, name: "PDF to JPG", desc: "Convert to images", color: "text-amber-400" },
  { icon: FileEdit, name: "Edit PDF", desc: "Modify content", color: "text-cyan-400" },
  { icon: Lock, name: "Protect PDF", desc: "Add password", color: "text-orange-400" },
  { icon: Unlock, name: "Unlock PDF", desc: "Remove password", color: "text-green-400" },
  { icon: Stamp, name: "Watermark", desc: "Add watermark", color: "text-pink-400" },
  { icon: RotateCw, name: "Rotate PDF", desc: "Rotate pages", color: "text-teal-400" },
  { icon: ScanLine, name: "OCR PDF", desc: "Extract text", color: "text-indigo-400" },
  { icon: FileSearch, name: "Compare PDF", desc: "Find differences", color: "text-yellow-400" },
];

const toolStats = [
  { icon: Sparkles, value: "100+", label: "Total Tools" },
  { icon: Shield, value: "0", label: "Files Stored" },
  { icon: Zap, value: "10M+", label: "Files Processed" },
  { icon: Globe, value: "100%", label: "Free Forever" },
];

const ToolsPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tool-card",
        { y: 30, opacity: 0, scale: 0.9 },
        { scrollTrigger: { trigger: ".tools-grid", start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1, stagger: 0.04, duration: 0.4, ease: "back.out(1.4)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 border-t border-border bg-gradient-to-b from-background via-card/60 to-background overflow-hidden">
      {/* Enhanced backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 holo-effect opacity-40" />
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Animated orbs */}
      <motion.div 
        animate={{ opacity: [0.3, 0.55, 0.3], x: [0, 40, 0], y: [0, -30, 0] }} 
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] top-[8%] h-[450px] w-[450px] rounded-full bg-[hsl(260,100%,66%,0.08)] blur-[160px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.25, 0.5, 0.25], y: [0, 35, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[5%] bottom-[15%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[hsl(170,100%,50%,0.04)] blur-[180px]" 
      />

      <div className="container relative z-10">
        <FadeInView>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground">
              <Sparkles size={12} className="text-primary" /> Browser-based Processing
            </div>
            <span className="block font-display text-sm font-semibold uppercase tracking-widest text-primary">Free PDF Tools</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              100+ Tools at Your <span className="text-gradient-accent">Fingertips</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Merge, split, compress, convert — everything PDF, completely free. All processing happens in your browser.</p>
          </div>
        </FadeInView>

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {toolStats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 rounded-xl border border-border glass px-4 py-2 text-xs">
              <s.icon size={14} className="text-primary" />
              <span className="font-bold text-foreground">{s.value}</span>
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Privacy banner */}
        <FadeInView delay={0.1}>
          <div className="mt-6 mx-auto max-w-lg rounded-xl border border-success/20 bg-success/5 px-4 py-2.5 text-center text-xs text-success">
            <Shield size={12} className="inline mr-1.5" />
            <strong>Your files never leave your device</strong> — All processing happens 100% in your browser
          </div>
        </FadeInView>

        <div className="tools-grid mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {tools.map((tool) => (
            <Tilt key={tool.name} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.04} glareBorderRadius="1rem" scale={1.02} transitionSpeed={400}>
              <motion.div whileTap={{ scale: 0.97 }}
                className="tool-card group cursor-pointer rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className={`mx-auto mb-3 inline-flex rounded-xl bg-secondary p-3 ${tool.color} transition-all group-hover:scale-110 group-hover:shadow-glow`}>
                    <tool.icon size={24} />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        <FadeInView delay={0.3}>
          <div className="mt-10 text-center">
            <MagneticButton>
              <Link to="/tools"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                Explore All 100+ Tools
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default ToolsPreview;
