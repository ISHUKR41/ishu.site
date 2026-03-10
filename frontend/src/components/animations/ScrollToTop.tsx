/**
 * ScrollToTop.tsx - Scroll-to-Top Button
 * 
 * A floating button that appears in the bottom-right corner
 * after the user scrolls down 400+ pixels.
 * Clicking it smoothly scrolls back to the top of the page.
 * 
 * Features:
 * - Appears/disappears with smooth scale + fade animation
 * - Hover effect: scales up to 115%
 * - Click effect: scales down to 90%
 * - Blue background with glow shadow
 * - Fixed position, z-index 50
 * - Accessible: has aria-label for screen readers
 */

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show button when scrolled past 400px
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}     // Start small and hidden
          animate={{ opacity: 1, scale: 1, y: 0 }}         // Grow to full size
          exit={{ opacity: 0, scale: 0.5, y: 20 }}         // Shrink and hide
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-shadow hover:shadow-[0_0_30px_hsl(210_100%_56%/0.4)]"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
