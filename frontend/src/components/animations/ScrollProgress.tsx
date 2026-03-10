/**
 * ScrollProgress.tsx - Page Scroll Progress Bar
 * 
 * Shows a thin colored gradient bar at the very top of the page
 * that fills from left to right as the user scrolls down.
 * At 0% scroll it's empty, at 100% scroll it's fully filled.
 * 
 * Uses framer-motion's useScroll and useSpring for smooth animation.
 * The bar has a blue-to-purple-to-teal gradient.
 */

import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  // scrollYProgress: 0 at top of page, 1 at bottom
  const { scrollYProgress } = useScroll();
  
  // useSpring adds smooth easing to the progress value (no jitter)
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,  // Scales horizontally from 0 to 1 based on scroll
        background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(260 100% 66%), hsl(170 100% 50%))",
      }}
    />
  );
};

export default ScrollProgress;
