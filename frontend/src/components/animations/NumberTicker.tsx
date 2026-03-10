/**
 * NumberTicker.tsx - Spring-Physics Number Animation
 * 
 * Similar to AnimatedCounter but uses spring physics for more natural movement.
 * The number "ticks" up (or down) with a springy, bouncy feel.
 * Supports decimal places and number formatting.
 * 
 * Props:
 * - value: Target number to animate to
 * - direction: "up" (0 → value) or "down" (value → 0)
 * - delay: Seconds before animation starts
 * - decimalPlaces: Number of decimal places to show
 * - className: CSS classes for styling
 * 
 * Usage:
 *   <NumberTicker value={99.9} decimalPlaces={1} direction="up" />
 */

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useSpring, useTransform } from "framer-motion";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  decimalPlaces?: number;
}

const NumberTicker = ({
  value,
  direction = "up",
  delay = 0,
  className = "",
  decimalPlaces = 0,
}: NumberTickerProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Create a spring that animates from 0 to value (or value to 0)
  const springValue = useSpring(direction === "up" ? 0 : value, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  // Format the spring value as a readable number string
  const displayValue = useTransform(springValue, (current) =>
    Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(current)
  );

  // Start animation when element scrolls into view
  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        springValue.set(direction === "up" ? value : 0);
        setHasAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, springValue, value, direction, delay]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
};

export default NumberTicker;
