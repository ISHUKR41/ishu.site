/**
 * GlowingText.tsx - Character-by-Character Text Animation with Glow
 * 
 * Animates each character of the text individually when scrolled into view.
 * Each letter flips in from below with a 3D rotation effect.
 * After all characters appear, a glowing light sweep passes over the text.
 * 
 * Props:
 * - text: The text to animate (each character animates separately)
 * - className: CSS classes (usually includes "text-gradient" for color)
 * 
 * Usage:
 *   <GlowingText text="Aspirants" className="text-gradient" />
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface GlowingTextProps {
  text: string;
  className?: string;
}

const GlowingText = ({ text, className = "" }: GlowingTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Animate each character with staggered 3D flip effect */}
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, rotateX: 90 }}  // Start flipped down
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}  // Flip up to normal
          transition={{
            duration: 0.5,
            delay: i * 0.03,  // Each character appears 30ms after the previous
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      {/* Glowing light sweep that passes over the text after reveal */}
      <motion.span
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.6, 0] } : {}}
        transition={{ duration: 2, delay: text.length * 0.03 }}
      />
    </motion.span>
  );
};

export default GlowingText;
