"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef } from "react";

interface OperationCounterProps {
  className?: string;
}

interface Algorithm {
  name: string;
  complexity: string;
  color: string;
  code: string[];
  run: (arr: number[]) => { steps: StepInfo[]; result: number[] };
}

interface StepInfo {
  line: number;
  ops: number;
  description: string;
  array: number[];
  highlights: number[];
}

// --- Algorithms ---
function bubbleSortTrace(arr: number[]): { steps: StepInfo[]; result: number[] } {
  const a = [...arr];
  const steps: StepInfo[] = [{ line: 0, ops: 0, description: "Start", array: [...a], highlights: [] }];
  let ops = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      ops++;
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ line: 3, ops, description: `Swap a[${j}]↔a[${j + 1}]`, array: [...a], highlights: [j, j + 1] });
      } else {
        steps.push({ line: 2, ops, description: `Compare a[${j}] ≤ a[${j + 1}]`, array: [...a], highlights: [j, j + 1] });
      }
    }
  }
  return { steps, result: a };
}

function selectionSortTrace(arr: number[]): { steps: StepInfo[]; result: number[] } {
  const a = [...arr];
  const steps: StepInfo[] = [{ line: 0, ops: 0, description: "Start", array: [...a], highlights: [] }];
  let ops = 0;
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      ops++;
      if (a[j] < a[minIdx]) minIdx = j;
      steps.push({ line: 3, ops, description: `Compare a[${j}] with min`, array: [...a], highlights: [j, minIdx] });
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ line: 5, ops, description: `Swap a[${i}]↔a[${minIdx}]`, array: [...a], highlights: [i, minIdx] });
    }
  }
  return { steps, result: a };
}

const ALGORITHMS: Algorithm[] = [
  {
    name: "Bubble Sort",
    complexity: "O(n²)",
    color: "#ef4444",
    code: [
      "for i in range(n):",
      "  for j in range(n-i-1):",
      "    if a[j] > a[j+1]:  # compare",
      "      swap(a[j], a[j+1])",
    ],
    run: bubbleSortTrace,
  },
  {
    name: "Selection Sort",
    complexity: "O(n²)",
    color: "#f59e0b",
    code: [
      "for i in range(n):",
      "  min_idx = i",
      "  for j in range(i+1, n):",
      "    if a[j] < a[min_idx]:  # compare",
      "    min_idx = j",
      "  swap(a[i], a[min_idx])",
    ],
    run: selectionSortTrace,
  },
];

export default function OperationCounter({
  className = "",
}: OperationCounterProps) {
  const [selectedAlgo, setSelectedAlgo] = useState(0);
  const [inputArray, setInputArray] = useState<number[]>([5, 3, 8, 1, 9, 2, 7]);
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const algo = ALGORITHMS[selectedAlgo];

  const runAlgorithm = useCallback(() => {
    const { steps: newSteps } = algo.run(inputArray);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsComplete(false);
    setIsRunning(true);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= newSteps.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsComplete(true);
        return;
      }
      setCurrentStep(step);
    }, 200);
  }, [algo, inputArray]);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    stopAnimation();
    setSteps([]);
    setCurrentStep(0);
    setIsComplete(false);
  }, [stopAnimation]);

  const randomizeArray = useCallback(() => {
    reset();
    const size = 5 + Math.floor(Math.random() * 6);
    setInputArray(Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1));
  }, [reset]);

  const currentStepData = steps[currentStep];
  const totalOps = steps.length > 0 ? steps[steps.length - 1].ops : 0;
  const displayArray = currentStepData?.array ?? inputArray;

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Operation Counter</h3>
        <span className="text-[10px] font-mono text-white/30">Count the real cost</span>
      </div>

      {/* Algorithm selector */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {ALGORITHMS.map((a, i) => (
          <button
            key={a.name}
            onClick={() => { setSelectedAlgo(i); reset(); }}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedAlgo === i
                ? "border"
                : "bg-white/5 text-white/40 border border-transparent"
            }`}
            style={
              selectedAlgo === i
                ? { backgroundColor: a.color + "20", color: a.color, borderColor: a.color + "50" }
                : undefined
            }
          >
            {a.name} ({a.complexity})
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Code panel */}
        <div>
          <span className="text-xs font-mono text-white/40 mb-2 block">Algorithm:</span>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] font-mono text-xs">
            {algo.code.map((line, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currentStepData && currentStepData.line === i
                    ? "bg-primary/15 text-primary"
                    : "text-white/50"
                }`}
              >
                <span className="text-white/15 mr-2 select-none">{i + 1}</span>
                {line}
              </div>
            ))}
          </div>

          {/* Counter display */}
          <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/40">Operations:</span>
              <motion.span
                key={currentStepData?.ops}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-lg font-mono font-bold"
                style={{ color: algo.color }}
              >
                {currentStepData?.ops ?? 0}
              </motion.span>
            </div>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-[10px] font-mono text-white/30"
              >
                Total: {totalOps} ops for n={inputArray.length} → ~{inputArray.length}²={inputArray.length * inputArray.length}
              </motion.div>
            )}
          </div>
        </div>

        {/* Array visualization */}
        <div>
          <span className="text-xs font-mono text-white/40 mb-2 block">Array state:</span>
          <div className="flex gap-0.5 flex-wrap mb-3">
            {displayArray.map((val, i) => (
              <motion.div
                key={`${i}-${val}`}
                layout
                className={`w-10 h-10 flex items-center justify-center rounded-lg border font-mono text-sm transition-colors ${
                  currentStepData?.highlights.includes(i)
                    ? "bg-primary/20 border-primary/50 text-white shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                    : "bg-white/[0.04] border-white/[0.08] text-white/60"
                }`}
              >
                {val}
              </motion.div>
            ))}
          </div>

          {/* Step description */}
          <AnimatePresence mode="wait">
            {currentStepData && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/50"
              >
                Step {currentStep + 1}/{steps.length}: {currentStepData.description}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          {steps.length > 0 && (
            <div className="mt-3 h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: algo.color }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <button
          onClick={isRunning ? stopAnimation : runAlgorithm}
          className={`px-4 py-1.5 text-xs rounded transition-colors ${
            isRunning
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
          }`}
        >
          {isRunning ? "⏸ Pause" : "▶ Run"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-xs rounded bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={randomizeArray}
          className="px-3 py-1.5 text-xs rounded bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
        >
          🎲 Randomize
        </button>
        <span className="text-[10px] font-mono text-white/20 ml-auto">
          n = {inputArray.length}
        </span>
      </div>

    </div>
  );
}
