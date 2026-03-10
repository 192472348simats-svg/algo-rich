"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { DailyPlan } from "@/lib/planGenerator";

interface Props {
  plan: DailyPlan;
  stepResults: Record<
    string,
    {
      score?: number;
      timeSpent?: number;
      skipped?: boolean;
      completedAt: string;
    }
  >;
  totalTime: number;
}

export default function PlanCompleteScreen({
  plan,
  stepResults,
  totalTime,
}: Props) {
  const stats = useMemo(() => {
    const completed = Object.values(stepResults).filter(
      (r) => !r.skipped
    ).length;
    const skipped = Object.values(stepResults).filter(
      (r) => r.skipped
    ).length;
    const totalXP = Object.values(stepResults).reduce(
      (sum, r) => sum + (r.score || 0),
      0
    );
    return { completed, skipped, totalXP };
  }, [stepResults]);

  const minutes = Math.floor(totalTime / 60);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Celebration emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="text-5xl"
        >
          {stats.completed === plan.steps.length ? "🏆" : "✅"}
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-2"
          >
            {stats.completed === plan.steps.length
              ? "Today's plan complete!"
              : "Good session!"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-white/30"
          >
            {minutes} minutes of focused learning. That compounds.
          </motion.p>
        </div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xl font-bold text-primary">
              {stats.completed}
            </p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider mt-1">
              Completed
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xl font-bold text-purple-400">
              +{stats.totalXP}
            </p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider mt-1">
              XP Earned
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xl font-bold text-primary">
              {plan.metadata.currentStreak}d
            </p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider mt-1">
              Streak
            </p>
          </div>
        </motion.div>

        {/* Step breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-1.5"
        >
          {plan.steps.map((step) => {
            const result = stepResults[step.id];
            const wasSkipped = result?.skipped;
            return (
              <div
                key={step.id}
                className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/[0.02]"
              >
                <span
                  className={
                    wasSkipped ? "text-white/15" : "text-emerald-400"
                  }
                >
                  {wasSkipped ? "⏭" : "✓"}
                </span>
                <span
                  className={`flex-1 text-left ${wasSkipped ? "text-white/15 line-through" : "text-white/40"}`}
                >
                  {step.title}
                </span>
                {!wasSkipped && result?.score ? (
                  <span className="text-primary/60">
                    +{result.score}
                  </span>
                ) : null}
              </div>
            );
          })}
        </motion.div>

        {/* Milestone progress */}
        {plan.metadata.nextMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4"
          >
            <div className="flex items-center justify-between text-xs text-white/30 mb-2">
              <span>Next milestone: {plan.metadata.nextMilestone.label}</span>
              <span>
                {plan.metadata.nextMilestone.current}/
                {plan.metadata.nextMilestone.target}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((plan.metadata.nextMilestone.current / plan.metadata.nextMilestone.target) * 100, 100)}%`,
                }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
              />
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex gap-3 justify-center pt-2"
        >
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-primary to-primary/60
                       px-6 py-2.5 text-sm font-semibold text-background
                       hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/dashboard/practice"
            className="rounded-xl bg-white/[0.06] border border-white/[0.06] px-6 py-2.5
                       text-sm text-white/60 hover:bg-white/10 transition-colors"
          >
            Keep Practicing
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
