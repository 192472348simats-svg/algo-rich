"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { DailyPlan } from "@/lib/planGenerator";

import PlanReviewStep from "@/app/components/plan/PlanReviewStep";
import PlanLessonStep from "@/app/components/plan/PlanLessonStep";
import PlanVisualizeStep from "@/app/components/plan/PlanVisualizeStep";
import PlanSolveStep from "@/app/components/plan/PlanSolveStep";
import PlanCardsStep from "@/app/components/plan/PlanCardsStep";
import PlanCompleteScreen from "@/app/components/plan/PlanCompleteScreen";

interface Props {
  userId: string;
}

export default function PlanFlow({ userId }: Props) {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<
    Record<string, { score?: number; timeSpent?: number; skipped?: boolean; completedAt: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flowComplete, setFlowComplete] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/plan")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load plan")
      )
      .then(async (data) => {
        setPlan(data);

        // Restore today's completed steps
        try {
          const csRes = await fetch("/api/plan/complete-step");
          if (csRes.ok) {
            const csData = await csRes.json();
            const completedIds: string[] = csData.stepIds ?? [];
            if (completedIds.length > 0 && data.steps) {
              const restoredResults: Record<string, { completedAt: string }> = {};
              for (const id of completedIds) {
                const stepData = csData.completedSteps?.[id] ?? {};
                restoredResults[id] = {
                  ...stepData,
                  completedAt: stepData.completedAt ?? new Date().toISOString(),
                };
              }
              setStepResults(restoredResults);
              // Find first uncompleted step
              const firstIncomplete = data.steps.findIndex(
                (s: { id: string }) => !completedIds.includes(s.id)
              );
              if (firstIncomplete === -1) {
                setCompletionTime(Date.now());
                setFlowComplete(true);
              } else {
                setCurrentStepIndex(firstIncomplete);
              }
            }
          }
        } catch {
          // Non-critical — continue without restoration
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  const completeStep = useCallback(
    (result: { score?: number; timeSpent?: number; skipped?: boolean }) => {
      if (!plan) return;

      const step = plan.steps[currentStepIndex];

      setStepResults((prev) => ({
        ...prev,
        [step.id]: { ...result, completedAt: new Date().toISOString() },
      }));

      // Notify server (fire and forget)
      fetch("/api/plan/complete-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: step.id,
          stepType: step.type,
          timeSpent: result.timeSpent || 0,
          score: result.score || 0,
          skipped: result.skipped || false,
        }),
      }).catch(() => {});

      // Advance or complete
      if (currentStepIndex + 1 >= plan.steps.length) {
        setCompletionTime(Date.now());
        setFlowComplete(true);
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
    [plan, currentStepIndex]
  );

  const skipStep = useCallback(() => {
    completeStep({ skipped: true });
  }, [completeStep]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white/30 text-sm"
          >
            Building your plan...
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Error or empty plan ──
  if (error || !plan || plan.steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
        {error ? (
          <>
            <p className="text-white/40 mb-4">
              Couldn&apos;t load today&apos;s plan
            </p>
            <Link
              href="/dashboard"
              className="text-primary text-sm hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="text-4xl">🎯</div>
            <h2 className="text-xl font-bold text-white">
              You&apos;re all caught up!
            </h2>
            <p className="text-sm text-white/30 max-w-sm">
              No new items for today. Come back tomorrow for your spaced review,
              or explore problems on your own.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link
                href="/dashboard/practice"
                className="rounded-xl bg-white/[0.06] border border-white/[0.06] px-5 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors"
              >
                Browse Problems
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl bg-white/[0.06] border border-white/[0.06] px-5 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // ── Completion screen ──
  if (flowComplete) {
    return (
      <PlanCompleteScreen
        plan={plan}
        stepResults={stepResults}
        totalTime={Math.round(((completionTime ?? startTime) - startTime) / 1000)}
      />
    );
  }

  // ── Active flow ──
  const currentStep = plan.steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Exit */}
          <Link
            href="/dashboard"
            className="text-white/15 hover:text-white/40 transition-colors text-sm"
          >
            ✕
          </Link>

          {/* Step dots */}
          <div className="flex-1 flex items-center gap-1.5 justify-center">
            {plan.steps.map((step, i) => (
              <motion.div
                key={step.id}
                className={`rounded-full transition-all ${
                  i < currentStepIndex
                    ? "w-2 h-2 bg-primary"
                    : i === currentStepIndex
                      ? "w-6 h-2 bg-primary rounded-full"
                      : "w-2 h-2 bg-white/10"
                }`}
                layout
              />
            ))}
          </div>

          {/* Skip */}
          <button
            onClick={skipStep}
            className="text-white/15 hover:text-white/40 transition-colors text-xs"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Step header */}
          <motion.div
            key={`header-${currentStep.id}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 mb-3">
              <span className="text-[10px] text-white/20 uppercase tracking-widest">
                Step {currentStepIndex + 1} of {plan.steps.length}
              </span>
              <span className="text-[10px] text-white/10">·</span>
              <span className="text-[10px] text-white/15">
                ~{currentStep.estimatedMinutes} min
              </span>
            </div>
          </motion.div>

          {/* Step body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {currentStep.type === "review" && (
                <PlanReviewStep
                  step={currentStep}
                  onComplete={completeStep}
                  userId={userId}
                />
              )}
              {currentStep.type === "lesson" && (
                <PlanLessonStep
                  step={currentStep}
                  onComplete={completeStep}
                />
              )}
              {currentStep.type === "visualize" && (
                <PlanVisualizeStep
                  step={currentStep}
                  onComplete={completeStep}
                />
              )}
              {currentStep.type === "solve" && (
                <PlanSolveStep
                  step={currentStep}
                  onComplete={completeStep}
                  userId={userId}
                />
              )}
              {currentStep.type === "cards" && (
                <PlanCardsStep
                  step={currentStep}
                  onComplete={completeStep}
                />
              )}
              {!["review", "lesson", "visualize", "solve", "cards"].includes(
                currentStep.type
              ) && (
                <div className="card-pro p-8 text-center">
                  <p className="text-white/50 text-sm mb-4">
                    Unknown step type: {currentStep.type}
                  </p>
                  <button
                    onClick={() => completeStep({ skipped: true })}
                    className="px-6 py-2 rounded-lg bg-gold-primary/15 text-gold-primary text-sm"
                  >
                    Skip →
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
