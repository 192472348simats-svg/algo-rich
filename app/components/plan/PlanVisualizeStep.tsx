"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { PlanStep, VisualizeData } from "@/lib/planGenerator";

// Dynamic imports for each visualizer (same as app/dashboard/visualize/[type]/page.tsx)
const TreePlayground = dynamic(
  () =>
    import(
      "@/app/components/visualizations/interactive/TreePlayground"
    ),
  { ssr: false, loading: () => <VisSkeleton /> }
);
const ArrayPlayground = dynamic(
  () =>
    import(
      "@/app/components/visualizations/interactive/ArrayPlayground"
    ),
  { ssr: false, loading: () => <VisSkeleton /> }
);
const LinkedListPlayground = dynamic(
  () =>
    import(
      "@/app/components/visualizations/interactive/LinkedListPlayground"
    ),
  { ssr: false, loading: () => <VisSkeleton /> }
);
const StackQueuePlayground = dynamic(
  () =>
    import(
      "@/app/components/visualizations/interactive/StackQueuePlayground"
    ),
  { ssr: false, loading: () => <VisSkeleton /> }
);

function VisSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white/5 border border-white/10 h-full flex items-center justify-center">
      <span className="text-white/20 text-sm">Loading visualizer…</span>
    </div>
  );
}

interface Props {
  step: PlanStep;
  onComplete: (result: {
    score?: number;
    timeSpent?: number;
    skipped?: boolean;
  }) => void;
}

export default function PlanVisualizeStep({ step, onComplete }: Props) {
  const data = step.data as VisualizeData;
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-8"
      >
        <div className="text-4xl">🔬</div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{step.title}</h2>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            {step.subtitle}. Spend 2-3 minutes exploring how this data structure
            works visually before solving the problem.
          </p>
        </div>

        {data.guidedSteps && data.guidedSteps.length > 0 && (
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 max-w-sm mx-auto text-left">
            <p className="text-xs text-white/25 uppercase tracking-wider mb-2">
              Try this:
            </p>
            {data.guidedSteps.map(
              (
                gs: { instruction: string; values?: number[] },
                i: number
              ) => (
                <p key={i} className="text-sm text-white/50 mb-1">
                  {gs.instruction}
                  {gs.values && (
                    <span className="text-primary/60 font-mono text-xs ml-1">
                      [{gs.values.join(", ")}]
                    </span>
                  )}
                </p>
              )
            )}
          </div>
        )}

        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => setStarted(true)}
            className="rounded-xl bg-gradient-to-r from-primary to-primary/60
                       px-8 py-3 text-sm font-semibold text-background
                       hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Open Visualizer →
          </button>
          <button
            onClick={() => onComplete({ score: 0, timeSpent: 0, skipped: true })}
            className="text-xs text-white/15 hover:text-white/30 transition-colors"
          >
            Skip
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Active visualizer ──
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{step.title}</h3>
        <button
          onClick={() => onComplete({ score: 10, timeSpent: 0 })}
          className="rounded-lg bg-white/[0.06] border border-white/[0.06] px-4 py-2
                     text-sm text-white/50 hover:bg-white/10 transition-colors"
        >
          Done exploring → Continue
        </button>
      </div>

      {/* Guided hint */}
      {data.guidedSteps && data.guidedSteps.length > 0 && (
        <div className="rounded-lg border border-primary/10 bg-primary/[0.03] px-4 py-2.5">
          <p className="text-xs text-primary/50">
            {data.guidedSteps[0]?.instruction}
            {data.guidedSteps[0]?.values && (
              <span className="font-mono ml-1">
                → try: {data.guidedSteps[0].values.join(", ")}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Visualizer container */}
      <div
        className="rounded-xl border border-white/[0.06] overflow-hidden"
        style={{ height: "55vh" }}
      >
        {data.visualizerType === "tree" && <TreePlayground />}
        {data.visualizerType === "array" && <ArrayPlayground />}
        {data.visualizerType === "linked-list" && <LinkedListPlayground />}
        {data.visualizerType === "stack-queue" && <StackQueuePlayground />}
        {!["tree", "array", "linked-list", "stack-queue"].includes(
          data.visualizerType
        ) && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <p className="text-white/30 text-sm">
                {data.visualizerType} visualizer coming soon
              </p>
              <button
                onClick={() => onComplete({ score: 5, timeSpent: 0 })}
                className="text-primary text-sm hover:underline"
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
