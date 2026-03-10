"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  requirement: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function AchievementsContent() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch("/api/user/achievements");
        if (res.ok) {
          const data = await res.json();
          setBadges(data.badges);
          setUnlockedCount(data.unlockedCount);
          setTotalBadges(data.totalBadges);
        }
      } catch (e) {
        console.error("Failed to fetch achievements:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground text-lg">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-1">Achievements</h1>
        <p className="text-foreground opacity-70">
          Earn badges by completing lessons, solving problems, and building streaks
        </p>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        variants={itemVariants}
        className="bg-card/60 border border-primary/20 rounded-xl p-6 backdrop-blur-sm flex items-center gap-6"
      >
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-3xl">
          🏆
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-white">
            {unlockedCount} / {totalBadges}
          </div>
          <div className="text-sm text-foreground opacity-70 mb-2">
            Badges Unlocked
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden max-w-md">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${totalBadges > 0 ? (unlockedCount / totalBadges) * 100 : 0}%`,
              }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" as const }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Badge Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, ease: "easeOut" as const }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative rounded-xl p-5 border transition-all ${
              badge.unlocked
                ? "bg-card/80 border-primary/40 shadow-lg shadow-primary/5"
                : "bg-card/30 border-white/5 opacity-70"
            }`}
          >
            {/* Unlocked shimmer */}
            {badge.unlocked && (
              <div className="absolute top-3 right-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  Unlocked!
                </span>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                  badge.unlocked
                    ? "bg-primary/20"
                    : "bg-white/5 grayscale"
                }`}
              >
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base mb-0.5">
                  {badge.name}
                </h3>
                <p className="text-sm text-foreground opacity-60 mb-3 leading-snug">
                  {badge.description}
                </p>
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground opacity-50">
                      {badge.requirement}
                    </span>
                    <span
                      className={`font-medium ${
                        badge.unlocked
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {badge.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${badge.progress}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + i * 0.08,
                        ease: "easeOut" as const,
                      }}
                      className={`h-full rounded-full ${
                        badge.unlocked
                          ? "bg-primary"
                          : "bg-white/20"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
