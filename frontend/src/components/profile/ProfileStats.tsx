/**
 * ProfileStats.tsx — Animated Stats Cards Grid
 * 
 * 6-card grid showing user stats with:
 * - Gradient icon backgrounds
 * - react-countup animated numbers
 * - react-parallax-tilt hover effect
 * - Framer-motion stagger entrance
 * - Glassmorphism card style
 */

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";
import { Wrench, FileText, Newspaper, GraduationCap, Flame, Trophy } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    toolsUsed: number;
    pdfProcessed: number;
    newsRead: number;
    examsTracked: number;
    loginStreak: number;
    points: number;
  };
}

const statsConfig = [
  { key: "toolsUsed", icon: Wrench, label: "Tools Used", color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
  { key: "pdfProcessed", icon: FileText, label: "PDFs Processed", color: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20" },
  { key: "newsRead", icon: Newspaper, label: "News Read", color: "from-emerald-500 to-green-500", shadow: "shadow-emerald-500/20" },
  { key: "examsTracked", icon: GraduationCap, label: "Exams Tracked", color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
  { key: "loginStreak", icon: Flame, label: "Login Streak", color: "from-rose-500 to-pink-500", shadow: "shadow-rose-500/20", suffix: "🔥" },
  { key: "points", icon: Trophy, label: "Points", color: "from-yellow-500 to-amber-500", shadow: "shadow-yellow-500/20" },
] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {statsConfig.map((cfg) => {
        const value = stats[cfg.key] ?? 0;
        return (
          <motion.div key={cfg.key} variants={item}>
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable
              glareMaxOpacity={0.08}
              glareColor="#60a5fa"
              glareBorderRadius="16px"
              scale={1.02}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
                {/* Background gradient */}
                <div className={`absolute top-0 right-0 h-20 w-20 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${cfg.color}`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.color} ${cfg.shadow} shadow-lg mb-3 transition-transform duration-300 group-hover:scale-110`}>
                    <cfg.icon size={18} className="text-white" />
                  </div>
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">{cfg.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      <CountUp end={value} duration={2.5} enableScrollSpy scrollSpyOnce />
                    </span>
                    {"suffix" in cfg && cfg.suffix && <span className="text-base">{cfg.suffix}</span>}
                  </div>
                </div>
              </div>
            </Tilt>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProfileStats;
