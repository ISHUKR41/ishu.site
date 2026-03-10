/**
 * ISHUBrandBanner.tsx - Full Brand Identity Banner
 * 
 * A premium animated banner that displays the full ISHU brand identity.
 * Designed to be used across pages for consistent branding.
 */

import { motion } from "framer-motion";
import { Sparkles, Shield, Globe, Zap, GraduationCap } from "lucide-react";
import FadeInView from "../animations/FadeInView";

const badges = [
  { icon: Shield, text: "100% Free" },
  { icon: Globe, text: "Pan-India" },
  { icon: Zap, text: "Real-time" },
  { icon: GraduationCap, text: "For Students" },
];

const ISHUBrandBanner = () => {
  return (
    <div className="border-b border-border bg-card/50 py-6 overflow-hidden">
      <div className="container">
        <FadeInView>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Brand name */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
              >
                <Sparkles size={18} className="text-primary" />
              </motion.div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">
                  <span className="text-gradient">ISHU</span> — Indian StudentHub University
                </p>
                <p className="text-[10px] text-muted-foreground">
                  India's #1 Platform for Government Exam Aspirants
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {badges.map((b) => (
                <motion.div
                  key={b.text}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <b.icon size={10} className="text-primary" />
                  {b.text}
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInView>
      </div>
    </div>
  );
};

export default ISHUBrandBanner;
