/**
 * FloatingIcon.tsx - Animated Floating Icon
 * 
 * Renders a Lucide icon with a gentle up-and-down floating animation.
 * Used for decorative purposes in hero sections and feature cards.
 * 
 * Props:
 * - icon: Any Lucide icon component (e.g., Sparkles, Shield)
 * - size: Icon size in pixels (default 24)
 * - delay: Seconds before animation starts (stagger multiple icons)
 * - duration: How long one float cycle takes (default 3 seconds)
 * - floatAmount: How many pixels up/down it moves (default 8)
 * - className: Extra CSS classes
 */

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FloatingIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  delay?: number;
  duration?: number;
  floatAmount?: number;
}

const FloatingIcon = ({
  icon: Icon,
  size = 24,
  className = "",
  delay = 0,
  duration = 3,
  floatAmount = 8,
}: FloatingIconProps) => {
  return (
    <motion.div
      animate={{
        y: [-floatAmount, floatAmount, -floatAmount],  // Move up, down, up (loop)
      }}
      transition={{
        repeat: Infinity,      // Never stop floating
        duration,              // Time for one complete cycle
        delay,                 // Wait before starting
        ease: "easeInOut",     // Smooth acceleration/deceleration
      }}
      className={className}
    >
      <Icon size={size} />
    </motion.div>
  );
};

export default FloatingIcon;
