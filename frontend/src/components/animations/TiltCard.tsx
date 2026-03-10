/**
 * TiltCard.tsx - 3D Tilt Effect Card (Custom Implementation)
 * 
 * Makes any wrapped content tilt in 3D based on mouse position.
 * Also adds a subtle glare effect that follows the cursor.
 * This is a custom implementation - for most cards we use react-parallax-tilt instead.
 * 
 * Props:
 * - tiltDegree: Maximum tilt angle in degrees (default 10)
 * - className: Extra CSS classes
 * 
 * How it works:
 * - Tracks mouse position relative to element center
 * - Applies CSS rotateX/rotateY transforms with spring physics
 * - Adds a radial gradient overlay that follows the cursor (glare)
 * - Resets to flat when mouse leaves
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
}

const TiltCard = ({ children, className = "", tiltDegree = 10 }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position as percentage (0 to 1) of element dimensions
  const x = useMotionValue(0.5);  // 0.5 = center
  const y = useMotionValue(0.5);

  // Convert mouse position to tilt rotation with spring physics
  const rotateX = useSpring(useTransform(y, [0, 1], [tiltDegree, -tiltDegree]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltDegree, tiltDegree]), { stiffness: 300, damping: 30 });
  
  // Track mouse position for glare effect
  const glareX = useTransform(x, [0, 1], [0, 100]);
  const glareY = useTransform(y, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);    // 0 = left edge, 1 = right edge
    y.set((e.clientY - rect.top) / rect.height);    // 0 = top edge, 1 = bottom edge
  };

  // Reset to center (flat) when mouse leaves
  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}  // 800px perspective for 3D depth
      className={`relative ${className}`}
    >
      {children}
      {/* Glare overlay - follows cursor position */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, hsl(210 100% 70% / 0.06), transparent 60%)`
          ),
        }}
      />
    </motion.div>
  );
};

export default TiltCard;
