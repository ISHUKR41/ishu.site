/**
 * RevealOnScroll.tsx - Scroll-Driven Clip-Path Reveal
 * 
 * Reveals content with a wipe/curtain effect as the user scrolls.
 * The content is initially hidden behind a CSS clip-path and
 * gradually revealed from left to right based on scroll position.
 * 
 * Props:
 * - width: "full" (takes full container width) or "fit" (content width)
 * - className: Extra CSS classes
 * 
 * How it works:
 * - Uses useScroll to track element position in viewport
 * - Maps scroll progress to a clip-path polygon
 * - At 0%: content is fully clipped (hidden)
 * - At 100%: content is fully visible
 * - Also fades in the opacity for a smoother effect
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  width?: "fit" | "full";
}

const RevealOnScroll = ({ children, className = "", width = "full" }: RevealOnScrollProps) => {
  const ref = useRef(null);
  
  // Track scroll position: starts when top of element hits 85% of viewport,
  // ends when it reaches 35% of viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });

  // Map scroll progress to clip-path animation (left-to-right reveal)
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "polygon(0 0, 0 0, 0 100%, 0 100%)",          // Fully clipped (hidden)
      "polygon(0 0, 100% 0, 100% 100%, 0 100%)",    // Fully visible
    ]
  );

  // Also fade in the opacity
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className={`${width === "full" ? "w-full" : "w-fit"} ${className}`}>
      <motion.div style={{ clipPath, opacity }}>
        {children}
      </motion.div>
    </div>
  );
};

export default RevealOnScroll;
