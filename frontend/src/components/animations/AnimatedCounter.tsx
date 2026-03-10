/**
 * AnimatedCounter.tsx - Counting Number Animation
 * 
 * Displays a number that counts up from 0 to the target value
 * when the component scrolls into view. Only animates once.
 * 
 * Props:
 * - target: The final number to count to (e.g., 1000)
 * - suffix: Text after the number (e.g., "+", "%")
 * - prefix: Text before the number (e.g., "$", "₹")
 * - duration: How many seconds the counting takes (default 2)
 * 
 * Usage:
 *   <AnimatedCounter target={100} suffix="+" />  // Shows: 100+
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const AnimatedCounter = ({ target, suffix = "", prefix = "", duration = 2 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });  // Only trigger once

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const increment = target / (duration * 60);  // 60 FPS
    
    // Update the counter 60 times per second until target is reached
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);       // Snap to exact target
        clearInterval(timer);   // Stop the interval
      } else {
        setCount(Math.floor(start));  // Round down to integer
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);  // Cleanup on unmount
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
