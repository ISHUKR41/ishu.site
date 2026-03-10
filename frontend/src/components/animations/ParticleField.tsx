/**
 * ParticleField.tsx - Canvas-Based Particle Animation
 * 
 * Renders a transparent canvas overlay with floating particles
 * that drift slowly and connect with lines when close together.
 * Creates a subtle "network" or "constellation" visual effect.
 * 
 * Features:
 * - Particles bounce off canvas edges
 * - Nearby particles are connected with faint lines
 * - Automatically adjusts particle count based on screen size
 * - Respects device pixel ratio for sharp rendering
 * - Resizes with the window
 * - Non-interactive (pointer-events: none)
 */

import { useEffect, useRef } from "react";

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    
    // Array to store all particle objects
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    // Resize canvas to match its container (accounting for retina displays)
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    // Create initial particles with random positions and velocities
    const init = () => {
      resize();
      // Limit particle count based on screen area (max 80) to keep performance smooth
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 12000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,    // Slow horizontal speed
          vy: (Math.random() - 0.5) * 0.3,    // Slow vertical speed
          size: Math.random() * 2 + 0.5,       // Radius between 0.5 and 2.5 pixels
          alpha: Math.random() * 0.5 + 0.1,    // Transparency between 0.1 and 0.6
        });
      }
    };

    // Main animation loop - runs every frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Update and draw each particle
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        // Bounce off edges
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        // Draw the particle as a small circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(210, 100%, 70%, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Only connect particles within 120px of each other
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Line fades as particles get further apart
            ctx.strokeStyle = `hsla(210, 100%, 70%, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);

    // Cleanup: stop animation and remove resize listener
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ParticleField;
