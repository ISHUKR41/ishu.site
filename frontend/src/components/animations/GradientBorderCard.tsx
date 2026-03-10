/**
 * GradientBorderCard.tsx - Card with Gradient Border on Hover
 * 
 * A card wrapper that reveals a gradient border and glow effect when hovered.
 * Border transitions from invisible to a primary/accent gradient.
 * Includes a subtle blur glow behind the card on hover.
 * 
 * Props:
 * - hoverGlow: Enable/disable the glow effect (default: true)
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientBorderCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

const GradientBorderCard = ({ children, className = "", hoverGlow = true }: GradientBorderCardProps) => {
  return (
    <motion.div
      whileHover={hoverGlow ? { scale: 1.02 } : undefined}
      className={`group relative rounded-2xl p-[1px] transition-all duration-500 ${className}`}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Glow effect */}
      {hoverGlow && (
        <div className="absolute -inset-1 rounded-2xl bg-primary/5 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />
      )}
      
      {/* Content */}
      <div className="relative rounded-2xl border border-border bg-card transition-all duration-500 group-hover:border-primary/20">
        {children}
      </div>
    </motion.div>
  );
};

export default GradientBorderCard;
