/**
 * MagneticButton.tsx - Mouse-Attracted Button Effect
 * 
 * Wraps any element to make it "magnetically" follow the cursor
 * when hovering near it. The element gently shifts toward the mouse
 * and springs back to center when the mouse leaves.
 * 
 * Props:
 * - strength: How strongly the element follows the cursor (default 0.3)
 *   Higher value = more movement. 0.5 = strong, 0.1 = subtle.
 * - className: Extra CSS classes
 * 
 * Uses framer-motion springs for smooth, natural movement.
 * 
 * Usage:
 *   <MagneticButton strength={0.4}>
 *     <button>Hover me!</button>
 *   </MagneticButton>
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

const MagneticButton = ({ children, className = "", strength = 0.3 }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Springs add smooth easing to the magnetic movement
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  // Calculate offset from element center to mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
