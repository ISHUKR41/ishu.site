/**
 * TestimonialsSection.tsx - User Reviews Carousel
 * 
 * Displays 6 student testimonials in an auto-scrolling carousel.
 * Each card shows: star rating, review text, avatar, name, and achievement.
 * 
 * Features:
 * - Embla carousel: Loop, auto-advance every 5 seconds, prev/next buttons
 * - Social proof bar: 1M+ Happy Students, 4.9/5 Rating, etc.
 * - Tilt cards with spotlight hover effect
 * - GSAP scroll-triggered entrance animation
 * - Gradient avatar backgrounds matching testimonial theme
 * - Star rating animation (stars pop in one by one)
 */

import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle, Users, TrendingUp } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  { name: "Priya Sharma", role: "UPSC CSE 2025 — AIR 42", text: "This platform kept me updated with every notification. The WhatsApp alerts were a game-changer during my preparation. I never missed a single deadline.", rating: 5, gradient: "from-blue-500/20 to-cyan-500/20", avatar: "PS" },
  { name: "Rahul Verma", role: "SSC CGL Selected", text: "The PDF tools saved me so much time. I could merge all my notes and compress study materials easily. Best free tool suite available.", rating: 5, gradient: "from-emerald-500/20 to-green-500/20", avatar: "RV" },
  { name: "Anita Kumari", role: "IBPS PO 2025", text: "Best platform for government job updates. The state-wise filtering helped me find Bihar-specific vacancies quickly. UI is very smooth and fast.", rating: 5, gradient: "from-violet-500/20 to-purple-500/20", avatar: "AK" },
  { name: "Vikash Singh", role: "RRB NTPC Selected", text: "I used to check 10 different websites. Now this one platform gives me everything — results, news, and tools. Clean design, no ads!", rating: 5, gradient: "from-amber-500/20 to-orange-500/20", avatar: "VS" },
  { name: "Sneha Patel", role: "NEET UG 2025 Qualified", text: "The news section with multi-language support helped me stay updated in Gujarati. The blog preparation tips were incredibly useful for my exam.", rating: 5, gradient: "from-rose-500/20 to-pink-500/20", avatar: "SP" },
  { name: "Amit Yadav", role: "UP Police Constable Selected", text: "State-wise pages are amazing. Found all UP Police vacancies in one place. The document checklist feature made my application process so easy.", rating: 5, gradient: "from-teal-500/20 to-cyan-500/20", avatar: "AY" },
];

const socialProof = [
  { icon: Users, value: "1M+", label: "Happy Students" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: TrendingUp, value: "50K+", label: "Success Stories" },
  { icon: MessageCircle, value: "10K+", label: "WhatsApp Users" },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, 5000);
    return () => { emblaApi.off("select", onSelect); clearInterval(interval); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".testimonial-heading",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: sectionRef.current, start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".social-proof-item",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: ".social-proof-bar", start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-border bg-gradient-to-b from-background via-card/70 to-background py-28 overflow-hidden">
      {/* Enhanced background effects */}
      <div className="pointer-events-none absolute inset-0 mesh-animated" />
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-60" />
      <div className="pointer-events-none absolute inset-0 grain" />
      
      {/* Animated orbs */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 40, 0], y: [0, -25, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[10%] top-[8%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2], x: [0, -30, 0] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[15%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-[hsl(260,100%,66%,0.08)] blur-[120px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[180px]" 
      />
      
      <div className="container relative z-10">
        <div className="testimonial-heading mx-auto max-w-2xl text-center mb-10">
          <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Success Stories
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Trusted by <span className="text-shimmer">Lakhs</span> of Students
          </h2>
          <p className="mt-4 text-muted-foreground">Real stories from real aspirants who achieved their dreams.</p>
          <div className="mx-auto mt-4 gradient-line w-24" />
        </div>

        {/* Social proof bar */}
        <div className="social-proof-bar mb-12 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {socialProof.map((s) => (
            <div key={s.label} className="social-proof-item flex items-center gap-2 rounded-xl border border-border glass px-4 py-2.5">
              <s.icon size={16} className="text-primary" />
              <div>
                <p className="font-display text-base font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-1">
                  <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.06} glareColor="hsl(210 100% 56%)" glarePosition="all" glareBorderRadius="1rem" scale={1.02} transitionSpeed={400}>
                    <motion.div whileTap={{ scale: 0.98 }}
                      className={`group spotlight-card relative h-full overflow-hidden rounded-2xl border border-border glass-strong p-8 transition-all hover:border-primary/20 hover:shadow-card`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                      <div className="relative">
                        <Quote size={28} className="mb-4 text-primary/20" />
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <motion.div key={j} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }} transition={{ delay: j * 0.1 + 0.2 }}>
                              <Star size={14} className="fill-warning text-warning" />
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground min-h-[80px]">{t.text}</p>
                        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                          <motion.div whileHover={{ scale: 1.1 }}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-primary-foreground ring-2 ring-primary/20">
                            {t.avatar}
                          </motion.div>
                          <div>
                            <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
                            <p className="text-xs text-primary">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Tilt>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-3">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/30 hover:shadow-glow disabled:opacity-40"
              disabled={!canScrollPrev}>
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/30 hover:shadow-glow disabled:opacity-40"
              disabled={!canScrollNext}>
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
