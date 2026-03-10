"use client";

import { motion } from "framer-motion";

interface StreakFlameProps {
  streakCount: number;
  isActive: boolean;
}

/** Animated flame icon with glow pulse for active streaks. */
export default function StreakFlame({
  streakCount,
  isActive,
}: StreakFlameProps) {
  // Scale flame slightly with streak, max at 30 days
  const scaleFactor = Math.min(1 + streakCount * 0.015, 1.45);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={
          isActive
            ? {
                scale: [scaleFactor, scaleFactor * 1.08, scaleFactor],
                filter: [
                  "drop-shadow(0 0 6px rgba(212,175,55,0.4))",
                  "drop-shadow(0 0 14px rgba(212,175,55,0.7))",
                  "drop-shadow(0 0 6px rgba(212,175,55,0.4))",
                ],
              }
            : {}
        }
        transition={
          isActive
            ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" as const }
            : undefined
        }
        className="text-3xl select-none"
        style={{ transform: `scale(${isActive ? scaleFactor : 1})` }}
      >
        {isActive ? "🔥" : "🕯️"}
      </motion.div>
      <span
        className={`text-xs font-bold mt-1 ${
          isActive ? "text-primary" : "text-muted-foreground/70"
        }`}
      >
        {streakCount} {streakCount === 1 ? "day" : "days"}
      </span>
    </div>
  );
}
