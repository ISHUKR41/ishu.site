/**
 * FAQSection.tsx - Frequently Asked Questions
 * 
 * Accordion-style FAQ section with 8 common questions about ISHU.
 * Features GSAP scroll-triggered animations and JSON-LD structured data for SEO.
 */
import FadeInView from "../animations/FadeInView";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, MessageCircle, HelpCircle, Shield, Zap, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { q: "What is ISHU?", a: "ISHU (Indian StudentHub University) is India's leading platform for government exam results, vacancies, admit cards, answer keys, and educational tools. We cover all central and state-level exams including UPSC, SSC, Banking, Railways, NTA, and more.", icon: HelpCircle },
  { q: "Is everything on this website free?", a: "Yes! All features including 100+ PDF tools, results, news, and blog content are completely free to use. No hidden charges or subscriptions required.", icon: Shield },
  { q: "How do WhatsApp notifications work?", a: "Simply enter your WhatsApp number and select the exam categories you're interested in. Whenever a new vacancy, result, or admit card is published, you'll receive an instant WhatsApp message with all the details and direct links.", icon: MessageCircle },
  { q: "Which exams do you cover?", a: "We cover all major central exams (UPSC, SSC, Banking, Railways, NTA, Defence, PSU, Teaching) and state-level exams for all 28 states and 8 union territories of India.", icon: Zap },
  { q: "Are the PDF tools safe to use?", a: "Absolutely. All files are processed securely and automatically deleted from our servers within 1 hour. We never access or store your file content.", icon: Shield },
  { q: "How often is the news updated?", a: "Our news section is updated continuously throughout the day with 1000+ articles across 30+ categories. News is available in multiple Indian languages.", icon: Zap },
  { q: "Can I contribute to the blog?", a: "Yes! If you're an exam topper or education expert, contact us to share your preparation strategy and help millions of aspirants.", icon: HelpCircle },
  { q: "How do I report incorrect information?", a: "You can use our Contact page or WhatsApp us directly at 8986985813. We verify and correct information within hours.", icon: MessageCircle },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".faq-heading",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: sectionRef.current, start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".faq-item",
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ".faq-list", start: "top 95%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-border bg-gradient-to-b from-background via-card/80 to-background py-28 overflow-hidden">
      {/* Animated background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      
      {/* Floating orbs */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 50, 0], y: [0, -30, 0] }} 
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[5%] top-[15%] h-[400px] w-[400px] rounded-full bg-primary/8 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2], x: [0, -40, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] bottom-[15%] h-[350px] w-[350px] rounded-full bg-[hsl(260,100%,66%,0.08)] blur-[120px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.15, 0.35, 0.15] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[180px]" 
      />
      
      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 grain" />
      
      <div className="container relative z-10">
        <div className="faq-heading mx-auto max-w-2xl text-center mb-14">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            <span className="font-medium">Got Questions?</span>
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Everything you need to know about ISHU — Indian StudentHub University.</p>
          <div className="mx-auto mt-4 gradient-line w-24" />
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="faq-list space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i}
                className={`faq-item group overflow-hidden rounded-xl border transition-all ${open === i ? 'border-primary/30 shadow-glow' : 'border-border'} glass-strong`}
                layout>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left">
                  <div className="flex items-center gap-3 pr-4">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${open === i ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                      <faq.icon size={14} />
                    </span>
                    <span className="font-display text-sm font-semibold text-foreground">{faq.q}</span>
                  </div>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0">
                    <ChevronDown size={18} className={`transition-colors ${open === i ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        <p className="text-sm leading-relaxed text-muted-foreground pl-11">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still have questions */}
          <FadeInView delay={0.3}>
            <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.04} glareBorderRadius="1rem">
              <div className="mt-10 rounded-2xl border border-border glass-strong p-8 text-center">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle size={22} className="text-primary" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold text-foreground">Still have questions?</h3>
                <p className="mt-2 text-sm text-muted-foreground">We're always here to help. Reach out anytime.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--success))] px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-glow">
                    <MessageCircle size={16} /> Chat on WhatsApp
                  </a>
                  <a href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-border glass px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/30">
                    Contact Us
                  </a>
                </div>
              </div>
            </Tilt>
          </FadeInView>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question", "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a }
            }))
          })
        }} />
      </div>
    </section>
  );
};

export default FAQSection;
