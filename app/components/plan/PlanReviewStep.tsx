"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PlanStep, ReviewData } from "@/lib/planGenerator";
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

export default function PlanReviewStep({ step, onComplete, userId }: Props) {
  const data = step.data as ReviewData;
  const [phase, setPhase] = useState<"intro" | "solve" | "result">("intro");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [solveTimeSeconds, setSolveTimeSeconds] = useState(0);
  const [solved, setSolved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Intro phase ── */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-1.5">
            <span className="text-xs text-purple-400">Spaced Review</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              {data.problemTitle}
            </h2>
            <p className="text-sm text-white/30">
              You solved this {data.daysSinceSolved} days ago. Try solving it
              again from scratch — no peeking at your old solution.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 max-w-sm mx-auto">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/30">Difficulty</span>
              <span
                className={`font-medium ${
                  data.difficulty === "easy"
                    ? "text-emerald-400"
                    : data.difficulty === "medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {data.difficulty}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-white/30">Originally solved</span>
              <span className="text-white/50">
                {new Date(data.originalSolveDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-xs text-white/15 max-w-xs mx-auto">
            Research shows re-solving after 3+ days boosts long-term retention
            from 20% to 85%.
          </p>

          <button
            onClick={() => {
              setPhase("solve");
              setStartTime(Date.now());
            }}
            className="rounded-xl bg-gradient-to-r from-purple-500/80 to-purple-400/80 
                       px-8 py-3 text-sm font-semibold text-white
                       hover:from-purple-500 hover:to-purple-400 transition-all
                       shadow-lg shadow-purple-500/10"
          >
            Start Solving →
          </button>
        </motion.div>
      )}

      {/* ── Solve phase ── */}
      {phase === "solve" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">
              {data.problemTitle}
            </h3>
            <div className="flex items-center gap-3">
              {startTime && <Timer startTime={startTime} />}
              <button
                onClick={() => {
                  setPhase("result");
                }}
                className="text-xs text-white/15 hover:text-white/30 transition-colors"
              >
                Give up & continue
              </button>
            </div>
          </div>

          <div
            className="rounded-xl border border-white/[0.06] overflow-hidden"
            style={{ height: "60vh" }}
          >
            <EmbeddedProblemSolver
              problemId={data.problemId}
              userId={userId}
              onSolved={() => {
                setSolved(true);
                setSolveTimeSeconds(startTime ? Math.round((Date.now() - startTime) / 1000) : 0);
                // Small delay for the confetti to play
                setTimeout(() => setPhase("result"), 2000);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Result phase ── */}
      {phase === "result" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-5 py-8"
        >
          {solved ? (
            <>
              <div className="text-4xl">🧠</div>
              <h3 className="text-xl font-bold text-white">Still got it!</h3>
              <p className="text-sm text-white/30">
                Solved in{" "}
                {formatTime(solveTimeSeconds)}
                . This problem is now locked into your long-term memory.
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl">🔄</div>
              <h3 className="text-xl font-bold text-white">
                Good review attempt
              </h3>
              <p className="text-sm text-white/30 max-w-sm mx-auto">
                Struggling means your brain is working harder to recall —
                that&apos;s actually better for learning. This will come back for
                review in 2 days.
              </p>
            </>
          )}

          <button
            onClick={() =>
              onComplete({
                score: solved ? 20 : 5,
                timeSpent: startTime
                  ? Math.round((Date.now() - startTime) / 1000)
                  : 0,
              })
            }
            className="rounded-xl bg-white/[0.06] border border-white/[0.06] px-6 py-2.5
                       text-sm text-white/60 hover:bg-white/10 transition-colors"
          >
            Continue →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ── Timer ──
function Timer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <span className="text-xs text-white/20 font-mono tabular-nums">
      {formatTime(elapsed)}
    </span>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
