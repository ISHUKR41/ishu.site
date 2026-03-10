/**
 * FadeInView.tsx - Scroll-Triggered Fade In Animation
 * 
 * Wraps any content to make it fade in when it scrolls into view.
 * Only animates once (won't re-animate when scrolling back up).
 * 
 * Props:
 * - delay: Seconds to wait before starting animation (default 0)
 * - direction: Which direction the content slides from ("up", "down", "left", "right")
 * - className: Extra CSS classes
 * 
 * Usage:
 *   <FadeInView delay={0.2} direction="left">
 *     <Card>Content here</Card>
 *   </FadeInView>
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const directionMap = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
};

const FadeInView = ({ children, delay = 0, direction = "up", className = "" }: FadeInViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;
