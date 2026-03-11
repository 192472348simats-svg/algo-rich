"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  currentStreak: number;
  practicedToday: boolean;
}

function hoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
}

export default function StreakUrgencyBanner({ currentStreak, practicedToday }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [hoursLeft, setHoursLeft] = useState(hoursUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => setHoursLeft(hoursUntilMidnight()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const shouldShow = currentStreak > 0 && !practicedToday && !dismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm rounded-lg mb-4 ${
            hoursLeft <= 3
              ? "bg-red-500/15 border border-red-500/30 text-red-300"
              : "bg-amber-500/15 border border-amber-500/30 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg flex-shrink-0">{hoursLeft <= 3 ? "🔥" : "⚠️"}</span>
            <span className="font-medium">
              Your{" "}
              <span className="text-white font-bold">{currentStreak}-day streak</span>{" "}
              expires in{" "}
              <span className="font-bold">
                {hoursLeft}h
              </span>
              {hoursLeft <= 3 ? " — practice now!" : " — don't break it!"}
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-current/50 hover:text-current transition-colors text-xs"
            aria-label="Dismiss streak warning"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
