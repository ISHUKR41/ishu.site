/**
 * StaggerChildren.tsx - Staggered Children Animation
 * 
 * Wraps a group of child elements and animates them one by one
 * with a staggered delay when they scroll into view.
 * Each child slides in from the specified direction with a blur effect.
 * 
 * Props:
 * - staggerDelay: Seconds between each child appearing (default 0.08)
 * - direction: Which direction children slide from ("up", "down", "left", "right")
 * - className: CSS classes for the container
 * 
 * Usage:
 *   <StaggerChildren direction="up" staggerDelay={0.1}>
 *     <Card>First</Card>
 *     <Card>Second</Card>
 *     <Card>Third</Card>
 *   </StaggerChildren>
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
}

// Map direction to initial offset values
const directionVariants = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

const StaggerChildren = ({
  children,
  className = "",
  staggerDelay = 0.08,
  direction = "up",
}: StaggerChildrenProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const offset = directionVariants[direction];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, ...offset, filter: "blur(8px)" },  // Hidden + blurred
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  filter: "blur(0px)",  // Sharp and visible
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
};

export default StaggerChildren;
