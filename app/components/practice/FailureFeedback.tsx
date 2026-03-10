"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FailureAnalysis } from "@/lib/failureAnalysis";

interface Props {
  analysis: FailureAnalysis;
  passedCount: number;
  totalCount: number;
  attemptNumber: number;
  solutionApproach?: string | null;
  onRetry: () => void;
}

const typeIcons: Record<string, string> = {
  "returns-none": "📭",
  "print-not-return": "🖨️",
  "off-by-one": "↔️",
  "wrong-type": "🔄",
  "wrong-order": "🔀",
  "wrong-sign": "±",
  "missing-edge-case-empty": "∅",
  "missing-edge-case-single": "1️⃣",
  "missing-edge-case-duplicate": "👯",
  "missing-edge-case-negative": "➖",
  "partial-correct": "🧩",
  "timeout": "⏰",
  "infinite-loop": "♾️",
  "infinite-recursion": "🔄",
  "index-out-of-range": "📏",
  "null-reference": "❌",
  "syntax-error": "✏️",
  "type-error": "🏷️",
  "division-by-zero": "÷",
  "wrong-approach": "🧭",
  "almost-correct": "🎯",
  "reversed-output": "🔃",
  unknown: "❓",
};

const severityColors: Record<string, string> = {
  minor: "border-yellow-500/15 bg-yellow-500/[0.03]",
  moderate: "border-orange-500/15 bg-orange-500/[0.03]",
  major: "border-red-500/15 bg-red-500/[0.03]",
};

const severityTitleColors: Record<string, string> = {
  minor: "text-yellow-400",
  moderate: "text-orange-400",
  major: "text-red-400",
};

export default function FailureFeedback({
  analysis,
  passedCount,
  totalCount,
  attemptNumber,
  solutionApproach,
  onRetry,
}: Props) {
  const [showDebugTip, setShowDebugTip] = useState(false);
  const [showCommonFix, setShowCommonFix] = useState(false);
  const [showApproach, setShowApproach] = useState(false);

  const icon = typeIcons[analysis.type] || "❓";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Main analysis card */}
      <div
        className={`rounded-xl border p-4 ${severityColors[analysis.severity]}`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-lg flex-shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-semibold ${severityTitleColors[analysis.severity]}`}
            >
              {analysis.title}
            </h4>
            <p className="text-xs text-white/30 mt-0.5">
              {passedCount}/{totalCount} tests passed · Attempt {attemptNumber}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm text-white/50 leading-relaxed mb-3">
          {analysis.explanation}
        </p>

        {/* Hint */}
        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
          <p className="text-[11px] text-white/20 uppercase tracking-wider mb-1">
            💡 Hint
          </p>
          <p className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed">
            {analysis.hint}
          </p>
        </div>

        {/* Concept gap (if identified) */}
        {analysis.conceptGap && (
          <div className="mt-3 rounded-lg border border-primary/10 bg-primary/[0.03] px-3 py-2">
            <p className="text-[11px] text-primary/40 uppercase tracking-wider mb-1">
              Key concept
            </p>
            <p className="text-xs text-primary/60 leading-relaxed">
              {analysis.conceptGap}
            </p>
          </div>
        )}

        {/* Expandable sections */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.04]">
          {analysis.debugTip && (
            <button
              onClick={() => setShowDebugTip(!showDebugTip)}
              className="text-[11px] text-white/20 hover:text-white/40 transition-colors"
            >
              {showDebugTip ? "▼" : "▶"} Debug tip
            </button>
          )}
          {analysis.commonFix && (
            <button
              onClick={() => setShowCommonFix(!showCommonFix)}
              className="text-[11px] text-white/20 hover:text-white/40 transition-colors"
            >
              {showCommonFix ? "▼" : "▶"} Common fix pattern
            </button>
          )}
          {attemptNumber >= 3 && solutionApproach && (
            <button
              onClick={() => setShowApproach(!showApproach)}
              className="text-[11px] text-purple-400/40 hover:text-purple-400/70 transition-colors ml-auto"
            >
              {showApproach ? "▼" : "▶"} Show approach
            </button>
          )}
        </div>

        {/* Debug tip expanded */}
        <AnimatePresence>
          {showDebugTip && analysis.debugTip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <div className="rounded-lg bg-[#0d1117] border border-white/[0.04] px-3 py-2">
                <pre className="text-xs text-white/40 whitespace-pre-wrap font-mono">
                  {analysis.debugTip}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Common fix expanded */}
        <AnimatePresence>
          {showCommonFix && analysis.commonFix && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <div className="rounded-lg bg-[#0d1117] border border-white/[0.04] px-3 py-2">
                <p className="text-[10px] text-white/15 mb-1">
                  Pattern (not the solution):
                </p>
                <pre className="text-xs text-emerald-400/50 whitespace-pre-wrap font-mono">
                  {analysis.commonFix}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Approach expanded (only after 3+ attempts) */}
        <AnimatePresence>
          {showApproach && solutionApproach && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <div className="rounded-lg bg-purple-500/5 border border-purple-500/10 px-3 py-2">
                <p className="text-xs text-purple-400/60 leading-relaxed">
                  {solutionApproach}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Encouragement based on attempt number */}
      <div className="text-center">
        {attemptNumber === 1 && (
          <p className="text-xs text-white/15">
            First attempt — failing is expected. Read the hint and try again.
          </p>
        )}
        {attemptNumber === 2 && (
          <p className="text-xs text-white/15">
            Second attempt — you&apos;re narrowing down the issue. Keep going.
          </p>
        )}
        {attemptNumber >= 3 && attemptNumber < 5 && (
          <p className="text-xs text-white/15">
            Multiple attempts show persistence. Try the debug tip above, or read
            the approach.
          </p>
        )}
        {attemptNumber >= 5 && (
          <p className="text-xs text-white/15">
            Consider studying the solution approach, then re-solving tomorrow.
            That&apos;s smarter than brute-forcing.
          </p>
        )}
      </div>

      {/* Retry button */}
      <div className="text-center">
        <button
          onClick={onRetry}
          className="rounded-lg bg-white/[0.06] border border-white/[0.06] px-5 py-2
                     text-sm text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
}
