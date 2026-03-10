"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type MilestoneType =
  | "first-print"
  | "first-variable"
  | "first-loop"
  | "first-function"
  | "first-solve"
  | "first-lesson"
  | "streak-3"
  | "streak-7"
  | "xp-100";

const MILESTONE_CONFIG: Record<
  MilestoneType,
  { emoji: string; title: string; message: string; color: string }
> = {
  "first-print": {
    emoji: "🖨️",
    title: "First Print!",
    message: "You made the computer say something for the first time. That's real code!",
    color: "#22c55e",
  },
  "first-variable": {
    emoji: "📦",
    title: "First Variable!",
    message: "You stored information in memory. Every program ever made does this!",
    color: "#3b82f6",
  },
  "first-loop": {
    emoji: "🔁",
    title: "First Loop!",
    message: "You made the computer repeat itself. You just learned one of the most powerful ideas in programming!",
    color: "#8b5cf6",
  },
  "first-function": {
    emoji: "🔧",
    title: "First Function!",
    message: "You defined your own command. Now you can reuse it anywhere!",
    color: "#f59e0b",
  },
  "first-solve": {
    emoji: "🏆",
    title: "First Problem Solved!",
    message: "You just solved your first coding problem. You're a programmer now!",
    color: "#D4AF37",
  },
  "first-lesson": {
    emoji: "🎓",
    title: "First Lesson Complete!",
    message: "You completed your first session! Every expert started exactly where you are.",
    color: "#06b6d4",
  },
  "streak-3": {
    emoji: "🔥",
    title: "3-Day Streak!",
    message: "3 days in a row! Consistency is the real secret to learning programming.",
    color: "#f97316",
  },
  "streak-7": {
    emoji: "🌟",
    title: "7-Day Streak!",
    message: "One week straight! You've built a real learning habit. That's legendary.",
    color: "#D4AF37",
  },
  "xp-100": {
    emoji: "⚡",
    title: "100 XP Earned!",
    message: "Your first 100 XP! The knowledge is real even when the points are just for fun.",
    color: "#eab308",
  },
};

// Generate particle positions deterministically
function particles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 137.5) % 100),
    y: ((i * 89.3) % 100),
    size: 4 + (i % 5),
    delay: (i * 0.07) % 1,
    duration: 1.2 + (i % 4) * 0.3,
  }));
}

interface Props {
  milestone: MilestoneType;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export default function MilestoneCelebration({
  milestone,
  onDismiss,
  autoDismissMs = 4000,
}: Props) {
  const config = MILESTONE_CONFIG[milestone];
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), autoDismissMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoDismissMs]);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(onDismiss, 400);
      return () => clearTimeout(t);
    }
  }, [visible, onDismiss]);

  const pts = particles(24);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
        >
          {/* Gold particle burst */}
          <div className="absolute inset-0 overflow-hidden">
            {pts.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: config.color,
                  opacity: 0.7,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                  y: [-20, -60 - (p.id % 40)],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="pointer-events-auto relative z-10 rounded-3xl border bg-[#0d1627] shadow-2xl px-8 py-7 text-center max-w-sm mx-4"
            style={{ borderColor: config.color + "44" }}
            onClick={() => setVisible(false)}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-10 blur-xl"
              style={{ background: `radial-gradient(circle, ${config.color}, transparent)` }}
            />

            <motion.div
              animate={{ rotate: [0, -10, 10, -6, 6, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl mb-3 relative"
            >
              {config.emoji}
            </motion.div>

            <h2 className="text-xl font-bold text-white relative">{config.title}</h2>
            <p className="text-sm text-white/60 mt-2 leading-relaxed relative">{config.message}</p>

            {/* Auto-dismiss progress bar */}
            <div className="mt-4 h-1 rounded-full bg-white/[0.06] overflow-hidden relative">
              <motion.div
                className="h-full rounded-full"
                style={{ background: config.color }}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: autoDismissMs / 1000, ease: "linear" }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1.5 relative">Tap to dismiss</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Hook for milestone tracking ─────────────────────────────────────────────

const STORAGE_KEY = "algo-rich-milestones-seen";

export function useMilestoneCelebration() {
  const [activeMilestone, setActiveMilestone] = useState<MilestoneType | null>(null);

  function trigger(milestone: MilestoneType) {
    try {
      const seen: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
      );
      if (!seen.includes(milestone)) {
        setActiveMilestone(milestone);
      }
    } catch {
      setActiveMilestone(milestone);
    }
  }

  function dismiss() {
    if (!activeMilestone) return;
    try {
      const seen: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
      );
      if (!seen.includes(activeMilestone)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, activeMilestone]));
      }
    } catch { /* ignore */ }
    setActiveMilestone(null);
  }

  return { activeMilestone, trigger, dismiss };
}
