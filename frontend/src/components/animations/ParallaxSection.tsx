/**
 * ParallaxSection.tsx - Parallax Scroll Effect Wrapper
 * 
 * Wraps any content to give it a parallax scrolling effect.
 * As the user scrolls, the wrapped content moves at a different
 * speed than the rest of the page, creating a depth illusion.
 * 
 * Props:
 * - speed: How strong the parallax effect is (default 0.3)
 *   Higher values = more movement. Negative = opposite direction.
 * - className: Extra CSS classes for the wrapper
 * 
 * Also fades content in/out as it enters/exits the viewport.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

const ParallaxSection = ({ children, speed = 0.3, className = "" }: ParallaxSectionProps) => {
  const ref = useRef(null);
  
  // Track how far this element has scrolled through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],  // Track from entering to leaving viewport
  });

  // Convert scroll progress to vertical movement (parallax offset)
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);
  
  // Fade in when entering viewport, fade out when leaving
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
