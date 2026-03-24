"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import ArrayVisualization from "./ArrayVisualization";

interface TwoPointersVisualizationProps {
  array: number[];
  target?: number;
  mode: "explanation" | "interactive";
  onComplete?: () => void;
  className?: string;
}

interface Step {
  left: number;
  right: number;
  sum: number;
  description: string;
  found: boolean;
}

function generateSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    const found = sum === target;
    const desc = found
      ? `Found! arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum} == ${target}`
      : sum < target
      ? `arr[${left}] + arr[${right}] = ${sum} < ${target} → move left pointer right`
      : `arr[${left}] + arr[${right}] = ${sum} > ${target} → move right pointer left`;

    steps.push({ left, right, sum, description: desc, found });

    if (found) break;
    if (sum < target) left++;
    else right--;
  }

  return steps;
}

export default function TwoPointersVisualization({
  array,
  target = 0,
  mode,
  onComplete,
  className = "",
}: TwoPointersVisualizationProps) {
  const steps = useMemo(() => generateSteps(array, target), [array, target]);
  const [currentStep, setCurrentStep] = useState(0);
  const [interactiveLeft, setInteractiveLeft] = useState(0);
  const [interactiveRight, setInteractiveRight] = useState(array.length - 1);
  const [interactiveMessage, setInteractiveMessage] = useState(
    "Move the pointers to find the pair that sums to " + target
  );

  const step = steps[currentStep];
  const isLastStep = currentStep >= steps.length - 1;

  // Explanation mode handlers
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    if (isLastStep && step?.found) {
      onComplete?.();
    }
  }, [currentStep, steps.length, isLastStep, step, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Interactive mode handlers
  const handleInteractiveMove = useCallback(
    (pointer: "left" | "right", direction: "forward" | "backward") => {
      if (pointer === "left") {
        const newLeft =
          direction === "forward"
            ? Math.min(interactiveLeft + 1, interactiveRight - 1)
            : Math.max(interactiveLeft - 1, 0);
        setInteractiveLeft(newLeft);
        const sum = array[newLeft] + array[interactiveRight];
        if (sum === target) {
          setInteractiveMessage(
            `🎉 Found! ${array[newLeft]} + ${array[interactiveRight]} = ${target}`
          );
          onComplete?.();
        } else {
          setInteractiveMessage(
            `Sum: ${array[newLeft]} + ${array[interactiveRight]} = ${sum}`
          );
        }
      } else {
        const newRight =
          direction === "forward"
            ? Math.min(interactiveRight + 1, array.length - 1)
            : Math.max(interactiveRight - 1, interactiveLeft + 1);
        setInteractiveRight(newRight);
        const sum = array[interactiveLeft] + array[newRight];
        if (sum === target) {
          setInteractiveMessage(
            `🎉 Found! ${array[interactiveLeft]} + ${array[newRight]} = ${target}`
          );
          onComplete?.();
        } else {
          setInteractiveMessage(
            `Sum: ${array[interactiveLeft]} + ${array[newRight]} = ${sum}`
          );
        }
      }
    },
    [array, interactiveLeft, interactiveRight, target, onComplete]
  );

  const interactiveSum = array[interactiveLeft] + array[interactiveRight];
  const interactiveFound = interactiveSum === target;

  if (mode === "interactive") {
    return (
      <div className={`card-shiny p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="font-bold text-foreground">
              Two Pointers — Interactive
            </h3>
            <p className="text-xs text-muted-foreground">
              Target sum: {target}
            </p>
          </div>
        </div>

        <ArrayVisualization
          data={array}
          pointers={[
            { name: "L", index: interactiveLeft, color: "#E5A829" },
            { name: "R", index: interactiveRight, color: "#d4af37" },
          ]}
          highlighted={interactiveFound ? [interactiveLeft, interactiveRight] : []}
        />

        {/* Sum display */}
        <div
          className={`mt-4 p-3 rounded-xl text-center text-sm font-mono ${
            interactiveFound
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-card text-foreground"
          }`}
        >
          {interactiveMessage}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <p className="text-xs text-primary font-semibold">
              Left Pointer
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleInteractiveMove("left", "backward")}
                disabled={interactiveLeft <= 0}
                className="flex-1 py-2 rounded-lg border border-primary/40 text-primary text-sm hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => handleInteractiveMove("left", "forward")}
                disabled={interactiveLeft >= interactiveRight - 1}
                className="flex-1 py-2 rounded-lg border border-primary/40 text-primary text-sm hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                Forward →
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-primary font-semibold">
              Right Pointer
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleInteractiveMove("right", "backward")}
                disabled={interactiveRight <= interactiveLeft + 1}
                className="flex-1 py-2 rounded-lg border border-primary/40 text-primary text-sm hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => handleInteractiveMove("right", "forward")}
                disabled={interactiveRight >= array.length - 1}
                className="flex-1 py-2 rounded-lg border border-primary/40 text-primary text-sm hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                Forward →
              </button>
            </div>
          </div>
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
            Two Pointers — Step by Step
          </h3>
          <p className="text-xs text-muted-foreground">
            Target: {target} • Step {currentStep + 1}/{steps.length}
          </p>
        </div>
      </div>

      {step && (
        <>
          <ArrayVisualization
            data={array}
            pointers={[
              { name: "L", index: step.left, color: "#E5A829" },
              { name: "R", index: step.right, color: "#d4af37" },
            ]}
            highlighted={step.found ? [step.left, step.right] : []}
            comparing={!step.found ? [step.left, step.right] : null}
          />

          {/* Step description */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-xl text-sm ${
              step.found
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-card text-foreground/80"
            }`}
          >
            {step.description}
          </motion.div>

          {/* Navigation */}
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
              disabled={isLastStep && step.found}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
              style={{
                background: "var(--gradient-gold)",
                color: "hsl(228 100% 7%)",
              }}
            >
              {isLastStep ? "Done ✓" : "Next →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
