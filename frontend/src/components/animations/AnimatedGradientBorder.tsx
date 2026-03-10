/**
 * AnimatedGradientBorder.tsx - Animated Rainbow Border
 * 
 * Wraps any content with a 1px animated gradient border that shifts colors.
 * The gradient is defined in CSS class "animated-border-gradient".
 * Used for premium card effects on hover states.
 */

import { ReactNode } from "react";

interface AnimatedGradientBorderProps {
  children: ReactNode;
  className?: string;
}

const AnimatedGradientBorder = ({ children, className = "" }: AnimatedGradientBorderProps) => {
  return (
    <div className={`relative rounded-2xl p-px overflow-hidden ${className}`}>
      <div className="absolute inset-0 rounded-2xl animated-border-gradient" />
      <div className="relative rounded-2xl bg-card">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradientBorder;
