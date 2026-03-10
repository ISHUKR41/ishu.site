/**
 * ShimmerText.tsx - Animated Shimmer/Shine Text Effect
 * 
 * Wraps text content with a moving gradient shine animation.
 * The gradient shifts from primary → purple → primary creating
 * a "light passing over text" shimmer effect.
 * Uses the "animate-shimmer-text" CSS animation from index.css.
 * 
 * Usage:
 *   <ShimmerText className="text-4xl">Shiny Text</ShimmerText>
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShimmerTextProps {
  children: ReactNode;
  className?: string;
}
const ShimmerText = ({ children, className = "" }: ShimmerTextProps) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 bg-gradient-to-r from-primary via-[hsl(260,100%,66%)] to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer-text">
        {children}
      </span>
    </span>
  );
};

export default ShimmerText;
