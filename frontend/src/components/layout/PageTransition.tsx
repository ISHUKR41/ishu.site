/**
 * PageTransition.tsx - Animated Page Wrapper
 * 
 * Wraps page content with a fade-in/slide-up animation on enter
 * and fade-out/slide-up animation on exit. Used for smooth
 * transitions between pages.
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Animation states: start hidden below, animate to visible, exit hidden above
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
