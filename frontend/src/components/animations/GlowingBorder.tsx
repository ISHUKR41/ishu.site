/**
 * GlowingBorder.tsx - Rotating Glow Border Effect
 * 
 * Creates a border that glows and rotates around the wrapped content.
 * Uses a conic gradient that spins continuously, creating a light-chasing effect.
 * 
 * Props:
 * - glowColor: Color of the glow (default: primary blue)
 * - borderWidth: Thickness of the visible border in pixels
 * - animationDuration: Seconds for one full rotation (default: 3)
 * 
 * Usage:
 *   <GlowingBorder><Card>...</Card></GlowingBorder>
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowingBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderWidth?: number;
  animationDuration?: number;
}
const GlowingBorder = ({
  children,
  className = "",
  glowColor = "hsl(210 100% 56%)",
  borderWidth = 2,
  animationDuration = 3,
}: GlowingBorderProps) => {
  return (
    <div className={`relative rounded-2xl p-px overflow-hidden ${className}`}>
      {/* Rotating gradient border */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: animationDuration,
          ease: "linear",
        }}
        className="absolute inset-[-100%] z-0"
        style={{
          background: `conic-gradient(from 0deg, ${glowColor}, transparent 25%, transparent 50%, ${glowColor} 75%, transparent)`,
        }}
      />
      {/* Inner content */}
      <div
        className="relative z-10 rounded-2xl bg-card"
        style={{ margin: borderWidth }}
      >
        {children}
      </div>
    </div>
  );
};

export default GlowingBorder;
