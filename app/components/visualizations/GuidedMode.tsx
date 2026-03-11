"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type Walkthrough,
  type WalkthroughStep,
  getAllWalkthroughs,
  getWalkthrough,
} from "@/lib/guidedWalkthroughs";

interface GuidedModeProps {
  visualizerType: "tree" | "array" | "stack" | "linked-list";
  onInsert?: (value: number) => void;
  onDelete?: (value: number) => void;
  onSearch?: (value: number) => void;
  onClose?: () => void;
}

export default function GuidedMode({
  visualizerType,
  onInsert,
  onDelete,
  onSearch,
  onClose,
}: GuidedModeProps) {
  const walkthroughs = getAllWalkthroughs().filter(
    (w) => w.visualizerType === visualizerType
  );

  const [activeWalkthrough, setActiveWalkthrough] = useState<Walkthrough | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [experimentResult, setExperimentResult] = useState<"correct" | "wrong" | null>(null);

  const currentStep: WalkthroughStep | null =
    activeWalkthrough?.steps[stepIndex] ?? null;

  const totalSteps = activeWalkthrough?.steps.length ?? 0;

  const executeAction = useCallback(
    (step: WalkthroughStep) => {
      if (!step.action || step.value == null) return;
      switch (step.action) {
        case "insert":
          onInsert?.(step.value);
          break;
        case "delete":
          onDelete?.(step.value);
          break;
        case "search":
          onSearch?.(step.value);
          break;
      }
    },
    [onInsert, onDelete, onSearch]
  );

  const advanceStep = useCallback(() => {
    if (!activeWalkthrough) return;

    const nextIndex = stepIndex + 1;
    if (nextIndex >= activeWalkthrough.steps.length) {
      // Save completion to server
      fetch("/api/walkthroughs/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: activeWalkthrough.slug,
          stepsCompleted: activeWalkthrough.steps.length,
          totalSteps: activeWalkthrough.steps.length,
        }),
      }).catch(() => {});
      setActiveWalkthrough(null);
      setStepIndex(0);
      return;
    }

    setStepIndex(nextIndex);
    setSelectedOption(null);
    setShowResult(false);
    setInputValue("");
    setExperimentResult(null);

    const nextStep = activeWalkthrough.steps[nextIndex];
    if (nextStep.type === "auto-play" || nextStep.type === "observe") {
      executeAction(nextStep);
    }
  }, [activeWalkthrough, stepIndex, executeAction, setActiveWalkthrough, setStepIndex, setSelectedOption, setShowResult, setInputValue, setExperimentResult]);

  const startWalkthrough = useCallback(
    (slug: string) => {
      const wt = getWalkthrough(slug);
      if (!wt) return;
      setActiveWalkthrough(wt);
      setStepIndex(0);
      setSelectedOption(null);
      setShowResult(false);

      const firstStep = wt.steps[0];
      if (firstStep.type === "auto-play" || firstStep.type === "observe") {
        executeAction(firstStep);
      }
    },
    [executeAction, setActiveWalkthrough, setStepIndex, setSelectedOption, setShowResult]
  );

  const handleOptionSelect = useCallback(
    (optionIndex: number) => {
      if (!currentStep || showResult) return;
      setSelectedOption(optionIndex);
      setShowResult(true);

      if (currentStep.correctOption === optionIndex) {
        executeAction(currentStep);
      }
    },
    [currentStep, showResult, executeAction]
  );

  const handleExperimentSubmit = useCallback(() => {
    if (!currentStep || currentStep.expectedValue == null) return;
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;

    if (val === currentStep.expectedValue) {
      setExperimentResult("correct");
      if (currentStep.action) {
        switch (currentStep.action) {
          case "insert":
            onInsert?.(val);
            break;
          case "delete":
            onDelete?.(val);
            break;
          case "search":
            onSearch?.(val);
            break;
        }
      }
    } else {
      setExperimentResult("wrong");
    }
  }, [currentStep, inputValue, onInsert, onDelete, onSearch]);

  // ── Walkthrough List ──
  if (!activeWalkthrough) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/60">
            Guided Walkthroughs
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-white/20 hover:text-white/40 transition-colors"
            >
              Close
            </button>
          )}
        </div>

        {walkthroughs.length === 0 ? (
          <p className="text-sm text-white/30">
            No walkthroughs available for this visualizer type.
          </p>
        ) : (
          <div className="grid gap-3">
            {walkthroughs.map((wt) => (
              <button
                key={wt.slug}
                onClick={() => startWalkthrough(wt.slug)}
                className="text-left rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {wt.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      wt.difficulty === "beginner"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : wt.difficulty === "intermediate"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {wt.difficulty}
                  </span>
                </div>
                <p className="text-xs text-white/30">{wt.description}</p>
                <span className="text-[10px] text-white/15 mt-2 inline-block">
                  ~{wt.estimatedMinutes} min · {wt.steps.length} steps
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Active Walkthrough ──
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveWalkthrough(null);
              setStepIndex(0);
            }}
            className="text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            ← Back
          </button>
          <span className="text-xs text-white/30">
            {stepIndex + 1}/{totalSteps}
          </span>
        </div>
        <span className="text-xs text-white/15">{activeWalkthrough.title}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Narration */}
            <p className="text-sm text-white/70 leading-relaxed">
              {currentStep.narration}
            </p>

            {/* Prediction options */}
            {currentStep.type === "predict" && currentStep.options && (
              <div className="space-y-2">
                {currentStep.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = currentStep.correctOption === i;
                  let btnClass =
                    "w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ";

                  if (showResult) {
                    if (isCorrect) {
                      btnClass +=
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
                    } else if (isSelected && !isCorrect) {
                      btnClass +=
                        "border-red-500/30 bg-red-500/10 text-red-400";
                    } else {
                      btnClass +=
                        "border-white/[0.04] text-white/20";
                    }
                  } else {
                    btnClass +=
                      "border-white/[0.08] text-white/60 hover:border-white/20 hover:bg-white/[0.03]";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      disabled={showResult}
                      className={btnClass}
                    >
                      {opt}
                      {showResult && isCorrect && (
                        <span className="ml-2">✓</span>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <span className="ml-2">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Experiment input */}
            {currentStep.type === "experiment" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleExperimentSubmit()
                    }
                    placeholder="Enter a value..."
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-white/20 focus:border-primary/40 focus:outline-none"
                  />
                  <button
                    onClick={handleExperimentSubmit}
                    className="rounded-lg bg-primary/20 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/30 transition-colors"
                  >
                    Try
                  </button>
                </div>
                {experimentResult === "correct" && (
                  <p className="text-sm text-emerald-400">✓ Correct!</p>
                )}
                {experimentResult === "wrong" && (
                  <p className="text-sm text-red-400">
                    ✗ Try again! Expected: {currentStep.expectedValue}
                  </p>
                )}
              </div>
            )}

            {/* Continue button */}
            {(currentStep.type === "instruction" ||
              currentStep.type === "insight" ||
              currentStep.type === "auto-play" ||
              currentStep.type === "observe" ||
              (currentStep.type === "predict" && showResult) ||
              (currentStep.type === "experiment" &&
                experimentResult === "correct")) && (
              <button
                onClick={advanceStep}
                className="rounded-lg bg-white/[0.06] border border-white/[0.06] px-5 py-2 text-sm text-white/60 hover:bg-white/10 transition-colors"
              >
                {stepIndex + 1 >= totalSteps ? "Finish" : "Continue →"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
