"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { patterns, type Pattern } from "@/lib/patterns/patternDefinitions";

interface PatternRecognitionProps {
  problemDescription: string;
  correctPatternId: string;
  hints?: string[];
  onResult?: (correct: boolean, timeMs: number) => void;
  className?: string;
}

export default function PatternRecognition({
  problemDescription,
  correctPatternId,
  hints = [],
  onResult,
  className = "",
}: PatternRecognitionProps) {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [startTime] = useState(() => Date.now());

  const correctPattern = patterns.find((p) => p.id === correctPatternId);
  const isCorrect = selectedPattern === correctPatternId;

  // Shuffle answer options once on mount
  const [shuffledPatterns] = useState(() => {
    // Show 4 patterns including the correct one
    const others = patterns
      .filter((p) => p.id !== correctPatternId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correctPattern!, ...others].sort(() => Math.random() - 0.5);
    return options;
  });

  const handleSelect = useCallback(
    (patternId: string) => {
      if (showResult) return;
      setSelectedPattern(patternId);
      setShowResult(true);

      const timeMs = Date.now() - startTime;
      onResult?.(patternId === correctPatternId, timeMs);
    },
    [showResult, correctPatternId, startTime, onResult]
  );

  const handleShowHint = useCallback(() => {
    if (hintIndex < hints.length - 1) {
      setHintIndex((prev) => prev + 1);
    }
  }, [hintIndex, hints.length]);

  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            Pattern Recognition
          </h3>
          <p className="text-xs text-muted-foreground">
            Which pattern fits this problem?
          </p>
        </div>
      </div>

      {/* Problem description */}
      <div className="p-4 rounded-xl bg-background/80 border border-border mb-4">
        <p className="text-sm text-foreground leading-relaxed">
          {problemDescription}
        </p>
      </div>

      {/* Hints */}
      {hints.length > 0 && !showResult && (
        <div className="mb-4">
          <AnimatePresence>
            {Array.from({ length: hintIndex + 1 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-2 p-2.5 rounded-lg bg-primary/10 border border-primary/20"
              >
                <p className="text-xs text-primary">
                  💡 Hint {i + 1}: {hints[i]}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {hintIndex < hints.length - 1 && (
            <button
              onClick={handleShowHint}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Show hint ({hintIndex + 2}/{hints.length})
            </button>
          )}
        </div>
      )}

      {/* Pattern options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shuffledPatterns.map((pattern) => {
          const isSelected = selectedPattern === pattern.id;
          const isAnswer = pattern.id === correctPatternId;
          const showCorrectOutline = showResult && isAnswer;
          const showWrongOutline = showResult && isSelected && !isCorrect;

          return (
            <motion.button
              key={pattern.id}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(pattern.id)}
              disabled={showResult}
              className={`p-3 rounded-xl border text-left transition-all ${
                showCorrectOutline
                  ? "border-emerald-400 bg-emerald-500/10"
                  : showWrongOutline
                  ? "border-red-400 bg-red-500/10"
                  : isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{pattern.icon}</span>
                <span className="text-sm font-semibold text-foreground">
                  {pattern.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {pattern.description}
              </p>
              {showCorrectOutline && (
                <span className="inline-block mt-1 text-xs text-emerald-400">
                  ✓ Correct answer
                </span>
              )}
              {showWrongOutline && (
                <span className="inline-block mt-1 text-xs text-red-400">
                  ✗ Incorrect
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Result explanation */}
      <AnimatePresence>
        {showResult && correctPattern && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 rounded-xl bg-background/80 border border-border"
          >
            <p className="text-sm font-semibold text-foreground mb-2">
              {isCorrect ? "🎉 Correct!" : "💡 The correct pattern is:"}
            </p>
            <p className="text-sm text-foreground/70 mb-2">
              <strong className="text-primary">
                {correctPattern.name}
              </strong>{" "}
              — {correctPattern.description}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>When to use:</strong>{" "}
              {correctPattern.whenToUse.slice(0, 2).join(", ")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
