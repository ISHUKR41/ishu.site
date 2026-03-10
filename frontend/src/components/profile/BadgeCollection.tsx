/**
 * BadgeCollection.tsx — Achievement Badge Shelf (REAL DATA)
 * 
 * Badge unlock status is computed from REAL user stats (from MongoDB).
 * No hardcoded demo progress — everything is computed dynamically.
 * 
 * Props:
 * - stats: real user stats from MongoDB (toolsUsed, pdfProcessed, etc.)
 * - badges: array of unlocked badge IDs from user.stats.badges
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Lock, FileText, Newspaper, GraduationCap, Flame,
  Trophy, Star, Zap, Target, Heart, Crown, Shield, X
} from "lucide-react";

interface BadgeCollectionProps {
  stats: {
    toolsUsed: number;
    pdfProcessed: number;
    newsRead: number;
    examsTracked: number;
    loginStreak: number;
    points: number;
  };
  badges: string[]; // Unlocked badge IDs from MongoDB
}

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  criteria: string;
  maxProgress: number;
  // Function to compute current progress from real stats
  getProgress: (stats: BadgeCollectionProps["stats"]) => number;
}

// Badge definitions — progress is COMPUTED from real stats
const badgeDefs: BadgeDef[] = [
  { id: "pdf_5", name: "PDF Starter", description: "Process 5 PDFs", icon: FileText, color: "from-blue-400 to-cyan-400", bgColor: "from-blue-500/20 to-cyan-500/20", criteria: "Process 5 PDFs", maxProgress: 5, getProgress: (s) => s.pdfProcessed },
  { id: "pdf_50", name: "PDF Master", description: "Process 50 PDFs", icon: Crown, color: "from-violet-400 to-purple-400", bgColor: "from-violet-500/20 to-purple-500/20", criteria: "Process 50 PDFs", maxProgress: 50, getProgress: (s) => s.pdfProcessed },
  { id: "tools_10", name: "Tool Explorer", description: "Use 10 different tools", icon: Zap, color: "from-amber-400 to-yellow-400", bgColor: "from-amber-500/20 to-yellow-500/20", criteria: "Use 10 tools", maxProgress: 10, getProgress: (s) => s.toolsUsed },
  { id: "news_100", name: "News Follower", description: "Read 100 news articles", icon: Newspaper, color: "from-emerald-400 to-green-400", bgColor: "from-emerald-500/20 to-green-500/20", criteria: "Read 100 news", maxProgress: 100, getProgress: (s) => s.newsRead },
  { id: "news_500", name: "News Expert", description: "Read 500 news articles", icon: Star, color: "from-indigo-400 to-blue-400", bgColor: "from-indigo-500/20 to-blue-500/20", criteria: "Read 500 news", maxProgress: 500, getProgress: (s) => s.newsRead },
  { id: "exam_1", name: "Exam Ready", description: "Track your first exam", icon: GraduationCap, color: "from-orange-400 to-red-400", bgColor: "from-orange-500/20 to-red-500/20", criteria: "Track 1 exam", maxProgress: 1, getProgress: (s) => s.examsTracked },
  { id: "exam_5", name: "Exam Champion", description: "Track 5 exams", icon: Trophy, color: "from-yellow-400 to-amber-400", bgColor: "from-yellow-500/20 to-amber-500/20", criteria: "Track 5 exams", maxProgress: 5, getProgress: (s) => s.examsTracked },
  { id: "streak_7", name: "Week Warrior", description: "7-day login streak", icon: Flame, color: "from-rose-400 to-pink-400", bgColor: "from-rose-500/20 to-pink-500/20", criteria: "7-day streak", maxProgress: 7, getProgress: (s) => s.loginStreak },
  { id: "streak_30", name: "Month Master", description: "30-day login streak", icon: Target, color: "from-cyan-400 to-teal-400", bgColor: "from-cyan-500/20 to-teal-500/20", criteria: "30-day streak", maxProgress: 30, getProgress: (s) => s.loginStreak },
  { id: "points_1000", name: "Point Hoarder", description: "Earn 1000 points", icon: Heart, color: "from-pink-400 to-rose-400", bgColor: "from-pink-500/20 to-rose-500/20", criteria: "1000 points", maxProgress: 1000, getProgress: (s) => s.points },
  { id: "points_5000", name: "Elite Member", description: "Earn 5000 points", icon: Shield, color: "from-green-400 to-emerald-400", bgColor: "from-green-500/20 to-emerald-500/20", criteria: "5000 points", maxProgress: 5000, getProgress: (s) => s.points },
];

const BadgeCollection = ({ stats, badges: unlockedBadgeIds }: BadgeCollectionProps) => {
  const [selectedBadge, setSelectedBadge] = useState<(BadgeDef & { progress: number; unlocked: boolean }) | null>(null);

  // Compute badge states from REAL stats
  const computedBadges = useMemo(() => {
    return badgeDefs.map((def) => {
      const progress = Math.min(def.getProgress(stats), def.maxProgress);
      const unlocked = progress >= def.maxProgress || unlockedBadgeIds.includes(def.id);
      return { ...def, progress, unlocked };
    });
  }, [stats, unlockedBadgeIds]);

  const unlockedCount = computedBadges.filter(b => b.unlocked).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
          <p className="text-xs text-white/35 mt-0.5">{unlockedCount}/{computedBadges.length} badges unlocked</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / computedBadges.length) * 100}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
            />
          </div>
          <span className="text-[10px] text-white/30">{Math.round((unlockedCount / computedBadges.length) * 100)}%</span>
        </div>
      </div>

      {/* Scrollable badge shelf */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {computedBadges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Tilt
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
              glareEnable={badge.unlocked}
              glareMaxOpacity={0.15}
              glareColor="#60a5fa"
              glareBorderRadius="16px"
              scale={1.05}
            >
              <button
                onClick={() => setSelectedBadge(badge)}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 min-w-[110px] transition-all duration-300 ${
                  badge.unlocked
                    ? "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.06]"
                    : "border-white/[0.04] bg-white/[0.01] opacity-50"
                }`}
              >
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${badge.bgColor}`}>
                  <badge.icon size={22}
                    style={{ color: badge.unlocked ? undefined : "rgba(255,255,255,0.15)" }}
                  />
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                      <Lock size={14} className="text-white/40" />
                    </div>
                  )}
                </div>

                <span className={`text-[11px] font-semibold text-center ${badge.unlocked ? "text-white/80" : "text-white/25"}`}>
                  {badge.name}
                </span>

                {/* Progress bar (only for locked badges with progress) */}
                {!badge.unlocked && (
                  <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${badge.color}`}
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                )}
              </button>
            </Tilt>
          </motion.div>
        ))}
      </div>

      {/* Badge detail modal */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm rounded-2xl border border-white/[0.1] bg-[hsl(225,50%,8%)] p-6 shadow-2xl"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedBadge.bgColor} mb-4`}>
                  <selectedBadge.icon size={28} style={{ color: selectedBadge.unlocked ? undefined : "rgba(255,255,255,0.2)" }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{selectedBadge.name}</h3>
                <p className="text-sm text-white/40 mb-3">{selectedBadge.description}</p>
                
                {selectedBadge.unlocked ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Unlocked
                  </span>
                ) : (
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-white/30">Progress</span>
                      <span className="text-xs text-white/50">{selectedBadge.progress}/{selectedBadge.maxProgress}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${selectedBadge.color}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeCollection;
