/**
 * WaveSection.tsx - Animated Wave Divider
 * 
 * Renders an SVG wave shape at the top or bottom of a section.
 * The wave gently animates left and right for a fluid effect.
 * Used to create smooth visual transitions between page sections.
 * 
 * Props:
 * - position: "top" or "bottom" (flips the wave for top placement)
 * - color: Fill color (defaults to background color)
 * - className: Extra CSS classes
 */

import { motion } from "framer-motion";

interface WaveSectionProps {
  position?: "top" | "bottom";
  color?: string;
  className?: string;
}
const WaveSection = ({
  position = "bottom",
  color = "hsl(var(--background))",
  className = "",
}: WaveSectionProps) => {
  return (
    <div
      className={`absolute left-0 right-0 w-full overflow-hidden leading-none ${
        position === "top" ? "top-0 rotate-180" : "bottom-0"
      } ${className}`}
    >
      <motion.svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-[60px] w-full"
        initial={{ x: 0 }}
        animate={{ x: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={color}
        />
      </motion.svg>
    </div>
  );
};

export default WaveSection;
