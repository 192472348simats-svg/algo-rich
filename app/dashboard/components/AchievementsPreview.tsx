"use client";

import { useMemo } from "react";
import { evaluateAchievements, UserStats } from "@/lib/achievements";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any },
};

export default function AchievementsPreview({
  stats,
}: {
  stats: {
    problemsSolved: number;
    lessonsCompleted: number;
    cardsReviewed: number;
    currentStreak: number;
    mediumSolved: number;
    hardSolved: number;
    topicsCovered: number;
    reviewsCompleted: number;
    coursesCompleted: number;
  };
}) {
  const userStats: UserStats = useMemo(
    () => ({
      totalSolved: stats.problemsSolved,
      lessonsCompleted: stats.lessonsCompleted,
      cardsReviewed: stats.cardsReviewed,
      streak: stats.currentStreak,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      topicsCovered: stats.topicsCovered,
      reviewsCompleted: stats.reviewsCompleted,
      fastestEasy: null,
      patternsLearned: 0,
      coursesCompleted: stats.coursesCompleted,
    }),
    [stats]
  );

  const allAchievements = useMemo(
    () => evaluateAchievements(userStats),
    [userStats]
  );

  const unlocked = allAchievements.filter((a) => a.unlocked);
  const locked = allAchievements
    .filter((a) => !a.unlocked)
    .sort((a, b) => b.progress / b.target - a.progress / a.target);

  const display = [...unlocked.slice(-2), ...locked.slice(0, 3)].slice(0, 5);

  return (
    <motion.div variants={itemVariants} className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base text-gold-primary">🏆</span>
        <h3 className="text-sm font-semibold text-white">Achievements</h3>
        <span className="ml-auto text-xs text-white/30">
          {unlocked.length}/{allAchievements.length} Unlocked
        </span>
      </div>
      <div className="space-y-3">
        {display.map((ach) => (
          <div
            key={ach.id}
            className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
              ach.unlocked
                ? "bg-gold-primary/10 border-gold-primary/30"
                : "bg-white/[0.02] border-white/[0.05]"
            }`}
          >
            <div className={`text-2xl ${ach.unlocked ? "" : "grayscale opacity-40"} flex-shrink-0`}>
              {ach.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span className={`text-xs font-semibold truncate ${ach.unlocked ? "text-gold-light" : "text-white/60"}`}>
                  {ach.title}
                </span>
                <span className="text-[10px] text-white/40 ml-2 flex-shrink-0">
                  {Math.min(ach.progress, ach.target)} / {ach.target}
                </span>
              </div>
              <div className="h-1.5 w-full bg-navy-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    ach.unlocked ? "bg-gold-primary" : "bg-white/20"
                  }`}
                  style={{
                    width: `${Math.min((ach.progress / ach.target) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
