/**
 * CursorSpotlight.tsx - Mouse-Following Glow Effect
 * 
 * Creates a subtle glowing circle that follows the cursor around the page.
 * Hidden on mobile devices (only shows on screens with mouse/trackpad).
 * 
 * How it works:
 * - Tracks mouse position via mousemove event
 * - Renders two radial gradients centered on cursor:
 *   1. Large (600px) outer glow - very subtle blue
 *   2. Small (100px) inner glow - slightly brighter
 * - Fades out when mouse leaves the browser window
 * - Uses pointer-events: none so it doesn't block clicks
 * - Fixed position, z-index 9999 so it's always on top
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CursorSpotlight = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });  // Start off-screen
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Update spotlight position on mouse move
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    // Hide when mouse leaves the window
    const leave = () => setVisible(false);
    // Show when mouse enters the window
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Large outer glow */}
      <div
        className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          background: "radial-gradient(circle, hsl(210 100% 56% / 0.04) 0%, transparent 70%)",
        }}
      />
      {/* Small inner glow - brighter center point */}
      <div
        className="absolute h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          background: "radial-gradient(circle, hsl(210 100% 70% / 0.08) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
};

export default CursorSpotlight;
