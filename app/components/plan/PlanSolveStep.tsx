"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PlanStep, SolveData } from "@/lib/planGenerator";
import EmbeddedProblemSolver from "./EmbeddedProblemSolver";

interface Props {
  step: PlanStep;
  onComplete: (result: {
    score?: number;
    timeSpent?: number;
    skipped?: boolean;
  }) => void;
  userId: string;
}

export default function PlanSolveStep({ step, onComplete, userId }: Props) {
  const data = step.data as SolveData;
  const [phase, setPhase] = useState<"intro" | "solve">("intro");
  const [startTime, setStartTime] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Intro ── */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-4"
        >
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 border ${
              data.difficulty === "easy"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : data.difficulty === "medium"
                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <span className="text-xs">{data.difficulty}</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              {data.problemTitle}
            </h2>
            {data.connectedLessonTitle && (
              <p className="text-sm text-white/25">
                Practices: {data.connectedLessonTitle}
              </p>
            )}
          </div>

          <p className="text-sm text-white/30 max-w-md mx-auto">
            Apply what you&apos;ve learned. If you get stuck for more than 10
            minutes, read the approach — that&apos;s smart studying, not giving
            up.
          </p>

          <button
            onClick={() => {
              setPhase("solve");
              setStartTime(Date.now());
            }}
            className="rounded-xl bg-gradient-to-r from-emerald-500/80 to-emerald-400/80 
                       px-8 py-3 text-sm font-semibold text-black
                       hover:from-emerald-500 hover:to-emerald-400 transition-all
                       shadow-lg shadow-emerald-500/10"
          >
            Start Solving →
          </button>
        </motion.div>
      )}

      {/* ── Solve ── */}
      {phase === "solve" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">
              {data.problemTitle}
            </h3>
            <div className="flex items-center gap-4">
              {startTime && <Timer startTime={startTime} />}
              <button
                onClick={() => {
                  const timeSpent = startTime
                    ? Math.round((Date.now() - startTime) / 1000)
                    : 0;
                  const xp = timeSpent < 300 ? 50 : timeSpent < 600 ? 35 : 20;
                  onComplete({ score: xp, timeSpent });
                }}
                className="text-xs text-white/15 hover:text-white/30 transition-colors"
              >
                Mark done & continue →
              </button>
            </div>
          </div>

          {/* Connected lesson hint */}
          {data.connectedLessonTitle && (
            <div className="rounded-lg border border-primary/10 bg-primary/[0.03] px-4 py-2">
              <p className="text-xs text-primary/40">
                Hint: Use what you learned in &quot;{data.connectedLessonTitle}
                &quot;
              </p>
            </div>
          )}

          <div
            className="rounded-xl border border-white/[0.06] overflow-hidden"
            style={{ height: "60vh" }}
          >
            <EmbeddedProblemSolver
              problemId={data.problemId}
              userId={userId}
              onSolved={() => {
                const timeSpent = startTime
                  ? Math.round((Date.now() - startTime) / 1000)
                  : 0;
                const xp = timeSpent < 300 ? 50 : timeSpent < 600 ? 35 : 20;
                // Delay to allow confetti to show
                setTimeout(() => onComplete({ score: xp, timeSpent }), 2000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Timer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const i = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTime) / 1000)),
      1000
    );
    return () => clearInterval(i);
  }, [startTime]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <span className="text-xs text-white/15 font-mono tabular-nums">
      {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}
