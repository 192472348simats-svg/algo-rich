"use client";

import { motion } from "framer-motion";

const levelTitles: Record<number, string> = {
  1: "Beginner",
  2: "Learner",
  3: "Pythonista",
  4: "Problem Solver",
  5: "Algorithm Apprentice",
  6: "Data Structure Pro",
  7: "Code Warrior",
  8: "DSA Master",
  9: "Algorithm Expert",
  10: "Grandmaster",
};

interface LevelBadgeProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

/** Displays user level, title, and XP progress bar. */
export default function LevelBadge({
  level,
  xp,
  xpToNextLevel,
}: LevelBadgeProps) {
  const clampedLevel = Math.max(1, Math.min(10, level));
  const title = levelTitles[clampedLevel] ?? "Beginner";
  const percent =
    xpToNextLevel > 0 ? Math.min(100, Math.round((xp / xpToNextLevel) * 100)) : 100;

  return (
    <div className="flex items-center gap-3">
      {/* Level badge */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "var(--gradient-gold)",
          boxShadow: "var(--glow-gold)",
        }}
      >
        <span className="text-background font-extrabold text-sm">
          {clampedLevel}
        </span>
      </motion.div>

      {/* Level info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-white">
            Level {clampedLevel}
          </span>
          <span className="text-xs text-primary">{title}</span>
        </div>
        <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
            className="h-full rounded-full"
            style={{ background: "var(--gradient-gold)" }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {xp} / {xpToNextLevel} XP
        </p>
      </div>
    </div>
  );
}
