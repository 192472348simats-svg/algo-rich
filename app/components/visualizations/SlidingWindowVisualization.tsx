"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface SlidingWindowVisualizationProps {
  array: number[];
  windowSize?: number;
  mode: "fixed" | "variable" | "interactive";
  onComplete?: () => void;
  className?: string;
}

const BOX_WIDTH = 56;
const BOX_HEIGHT = 56;
const GAP = 4;

export default function SlidingWindowVisualization({
  array,
  windowSize = 3,
  mode,
  onComplete,
  className = "",
}: SlidingWindowVisualizationProps) {
  const [windowStart, setWindowStart] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const windowEnd = Math.min(windowStart + windowSize - 1, array.length - 1);
  const windowSum = useMemo(() => {
    let sum = 0;
    for (let i = windowStart; i <= windowEnd; i++) {
      sum += array[i];
    }
    return sum;
  }, [array, windowStart, windowEnd]);

  // Generate all steps for fixed window
  const steps = useMemo(() => {
    const result: {
      start: number;
      end: number;
      sum: number;
      maxSoFar: number;
      description: string;
    }[] = [];
    let maxSum = -Infinity;

    for (let i = 0; i <= array.length - windowSize; i++) {
      let sum = 0;
      for (let j = i; j < i + windowSize; j++) {
        sum += array[j];
      }
      maxSum = Math.max(maxSum, sum);

      const isNewMax = sum >= maxSum;
      result.push({
        start: i,
        end: i + windowSize - 1,
        sum,
        maxSoFar: maxSum,
        description: isNewMax
          ? `Window [${i}..${i + windowSize - 1}]: sum = ${sum} → New maximum!`
          : `Window [${i}..${i + windowSize - 1}]: sum = ${sum} (max: ${maxSum})`,
      });
    }
    return result;
  }, [array, windowSize]);

  const step = steps[currentStep];
  const maxSum = Math.max(...steps.map((s) => s.sum));

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Interactive mode
  const handleSlide = useCallback(
    (direction: "left" | "right") => {
      if (direction === "right" && windowStart + windowSize < array.length) {
        setWindowStart((prev) => prev + 1);
      } else if (direction === "left" && windowStart > 0) {
        setWindowStart((prev) => prev - 1);
      }
    },
    [windowStart, windowSize, array.length]
  );

  const renderArray = (
    start: number,
    end: number,
    highlightedIndices?: number[]
  ) => (
    <div className="relative overflow-x-auto py-2">
      <div className="flex" style={{ gap: GAP }}>
        {array.map((value, index) => {
          const inWindow = index >= start && index <= end;
          const isHighlighted = highlightedIndices?.includes(index);
          const isEntering = index === end && mode === "fixed";
          const isLeaving = index === start - 1;

          return (
            <motion.div
              key={index}
              className="relative flex-shrink-0"
              style={{ width: BOX_WIDTH }}
            >
              <motion.div
                animate={{
                  backgroundColor: inWindow
                    ? isHighlighted
                      ? "hsl(var(--primary))"
                      : "hsl(var(--primary))"
                    : "hsl(228 40% 20%)",
                  scale: inWindow ? 1.05 : 0.95,
                  opacity: inWindow ? 1 : 0.5,
                  boxShadow: inWindow
                    ? "0 0 16px hsl(43 96% 56%, 0.4)"
                    : "none",
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center rounded-lg border border-border"
                style={{ width: BOX_WIDTH, height: BOX_HEIGHT }}
              >
                <span
                  className={`text-lg font-bold ${
                    inWindow ? "text-white" : "text-muted-foreground/70"
                  }`}
                >
                  {value}
                </span>
              </motion.div>

              {/* Index */}
              <p className="text-center text-xs text-muted-foreground/70 mt-1 font-mono">
                {index}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Window bracket overlay */}
      <motion.div
        animate={{
          x: start * (BOX_WIDTH + GAP) - 3,
          width: (end - start + 1) * (BOX_WIDTH + GAP) - GAP + 6,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 rounded-xl border-2 border-primary/60 pointer-events-none"
        style={{ height: BOX_HEIGHT + 16, top: 4 }}
      />
    </div>
  );

  if (mode === "interactive") {
    return (
      <div className={`card-shiny p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="font-bold text-foreground">
              Sliding Window — Interactive
            </h3>
            <p className="text-xs text-muted-foreground">
              Window size: {windowSize} • Slide to find max sum
            </p>
          </div>
        </div>

        {renderArray(windowStart, windowEnd)}

        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 p-3 rounded-xl bg-card text-center">
            <p className="text-2xl font-bold text-primary">
              {windowSum}
            </p>
            <p className="text-xs text-muted-foreground">Window Sum</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-card text-center">
            <p className="text-2xl font-bold text-primary">{maxSum}</p>
            <p className="text-xs text-muted-foreground">Max Sum</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleSlide("left")}
            disabled={windowStart === 0}
            className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-card/60 disabled:opacity-30 transition-colors"
          >
            ← Slide Left
          </button>
          <button
            onClick={() => handleSlide("right")}
            disabled={windowStart + windowSize >= array.length}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{
              background: "var(--gradient-gold)",
              color: "hsl(228 100% 7%)",
            }}
          >
            Slide Right →
          </button>
        </div>
      </div>
    );
  }

  // Explanation mode
  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            Sliding Window — Step by Step
          </h3>
          <p className="text-xs text-muted-foreground">
            Window: {windowSize} • Step {currentStep + 1}/{steps.length}
          </p>
        </div>
      </div>

      {step && (
        <>
          {renderArray(step.start, step.end)}

          <div className="flex gap-4 mt-4">
            <div className="flex-1 p-3 rounded-xl bg-card text-center">
              <p className="text-2xl font-bold text-primary">
                {step.sum}
              </p>
              <p className="text-xs text-muted-foreground">Current Sum</p>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-card text-center">
              <p className="text-2xl font-bold text-primary">
                {step.maxSoFar}
              </p>
              <p className="text-xs text-muted-foreground">Max So Far</p>
            </div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-xl text-sm ${
              step.sum === maxSum
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-card text-foreground/80"
            }`}
          >
            {step.description}
          </motion.div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-card/60 disabled:opacity-30 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep >= steps.length - 1}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
              style={{
                background: "var(--gradient-gold)",
                color: "hsl(228 100% 7%)",
              }}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
