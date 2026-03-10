/**
 * BlogPreview.tsx - Blog Posts Showcase Section
 * 
 * Displays 4 featured blog posts in a responsive grid on the homepage.
 * Each card shows: emoji thumbnail, trending badge, category, title,
 * read time, and like count.
 * 
 * Features:
 * - Color-coded category badges (UPSC, SSC, Tools, Banking)
 * - "Trending" badge on popular posts
 * - Tilt cards with glare effect on hover
 * - GSAP staggered entrance animation
 * - Links to individual blog post pages via slug
 */

import FadeInView from "../animations/FadeInView";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Heart, BookOpen, TrendingUp, Star } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const posts = [
  { title: "UPSC CSE 2026: Complete Preparation Roadmap", category: "UPSC", readTime: "12 min", image: "📚", slug: "complete-upsc-cse-2026-preparation-strategy", likes: 342, trending: true },
  { title: "Top 10 Mistakes to Avoid in SSC CGL", category: "SSC", readTime: "8 min", image: "⚠️", slug: "top-10-mistakes-ssc-cgl-aspirants-make", likes: 256, trending: true },
  { title: "How to Use PDF Tools for Better Study Notes", category: "Tools", readTime: "5 min", image: "🛠️", slug: "best-free-pdf-tools-for-students-in-2026", likes: 178, trending: false },
  { title: "Banking Exam 2026: 90-Day Strategy", category: "Banking", readTime: "10 min", image: "🏦", slug: "how-to-crack-banking-exams-in-3-months", likes: 189, trending: true },
];

const categoryColors: Record<string, string> = {
  UPSC: "bg-blue-500/10 text-blue-400",
  SSC: "bg-emerald-500/10 text-emerald-400",
  Tools: "bg-violet-500/10 text-violet-400",
  Banking: "bg-amber-500/10 text-amber-400",
};

const BlogPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".blog-card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".blog-grid", start: "top 95%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-gradient-to-b from-background via-card/60 to-background">
      {/* Enhanced backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      <div className="pointer-events-none absolute inset-0 grain" />
      
      {/* Animated orbs */}
      <motion.div 
        animate={{ opacity: [0.25, 0.5, 0.25], x: [0, 35, 0] }} 
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[8%] top-[10%] h-[400px] w-[400px] rounded-full bg-primary/8 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2], y: [0, 30, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[10%] bottom-[15%] h-[350px] w-[350px] rounded-full bg-[hsl(260,100%,66%,0.06)] blur-[130px]" 
      />

      <div className="container relative z-10">
        <FadeInView>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground">
                <BookOpen size={12} className="text-primary" />
                Expert Content
              </div>
              <span className="block font-display text-sm font-semibold uppercase tracking-widest text-primary">From Our Blog</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                Expert Guides & <span className="text-shimmer">Tips</span>
              </h2>
            </div>
            <Link to="/blog" className="hidden items-center gap-1 rounded-xl border border-border glass px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/30 hover:shadow-glow md:flex">
              All Posts <ArrowRight size={14} />
            </Link>
          </div>
        </FadeInView>

        <div className="blog-grid mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <Tilt key={post.title} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.05} glareBorderRadius="1rem" scale={1.02}>
              <Link to={`/blog/${post.slug}`}>
                <motion.div whileTap={{ scale: 0.98 }}
                  className="blog-card group spotlight-card flex h-full flex-col overflow-hidden rounded-2xl border border-border glass-strong transition-all hover:border-primary/20 hover:shadow-card">
                  <div className="relative flex h-32 items-center justify-center bg-secondary text-4xl">
                    {post.image}
                    {post.trending && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-destructive/90 px-2 py-0.5 text-[10px] font-medium text-white">
                        <TrendingUp size={8} /> Trending
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium self-start ${categoryColors[post.category] || "bg-secondary text-foreground"}`}>
                      {post.category}
                    </span>
                    <h3 className="mt-3 flex-1 font-display text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                      <span className="flex items-center gap-1"><Heart size={10} /> {post.likes}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </Tilt>
          ))}
        </div>

        <FadeInView delay={0.3}>
          <div className="mt-8 text-center md:hidden">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              All Posts <ArrowRight size={14} />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default BlogPreview;
