"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
}

interface InterleavingSessionProps {
  problems: (Problem & { pattern: string })[];
  patterns: string[];
  duration: number; // minutes
  onComplete: (results: SessionResult) => void;
  className?: string;
}

interface SessionResult {
  problemsAttempted: number;
  correctPatterns: number;
  totalTime: number;
  patternAccuracy: Record<string, { correct: number; total: number }>;
}

export default function InterleavingSession({
  problems,
  patterns,
  duration,
  onComplete,
  className = "",
}: InterleavingSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<
    { pattern: string; correct: boolean }[]
  >([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffle problems so same patterns don't appear consecutively
  const shuffledProblems = useMemo(() => {
    const shuffled = [...problems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Ensure no consecutive same patterns
    for (let i = 1; i < shuffled.length; i++) {
      if (shuffled[i].pattern === shuffled[i - 1].pattern) {
        // Find a different one to swap with
        for (let j = i + 1; j < shuffled.length; j++) {
          if (shuffled[j].pattern !== shuffled[i - 1].pattern) {
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            break;
          }
        }
      }
    }
    return shuffled;
  }, [problems]);

  const currentProblem = shuffledProblems[currentIndex];
  const isCorrect = selectedPattern === currentProblem?.pattern;

  const handlePatternSelect = useCallback(
    (pattern: string) => {
      if (showResult) return;
      setSelectedPattern(pattern);
      setShowResult(true);
      setResults((prev) => [
        ...prev,
        { pattern: currentProblem.pattern, correct: pattern === currentProblem.pattern },
      ]);
    },
    [showResult, currentProblem]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= shuffledProblems.length) {
      // Session complete
      const patternAccuracy: Record<string, { correct: number; total: number }> = {};
      results.forEach((r) => {
        if (!patternAccuracy[r.pattern]) {
          patternAccuracy[r.pattern] = { correct: 0, total: 0 };
        }
        patternAccuracy[r.pattern].total++;
        if (r.correct) patternAccuracy[r.pattern].correct++;
      });

      setIsCompleted(true);
      onComplete({
        problemsAttempted: results.length,
        correctPatterns: results.filter((r) => r.correct).length,
        totalTime: duration,
        patternAccuracy,
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedPattern(null);
      setShowResult(false);
    }
  }, [currentIndex, shuffledProblems.length, results, duration, onComplete]);

  const correctCount = results.filter((r) => r.correct).length;

  if (!isStarted) {
    return (
      <div className={`card-shiny p-8 text-center ${className}`}>
        <h3 className="text-2xl font-bold text-foreground">
          Pattern Shuffle 🔀
        </h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Random problems from different patterns. Identify the pattern before
          solving! No two same patterns in a row.
        </p>
        <div className="flex justify-center gap-4 mt-6 text-sm text-muted-foreground">
          <span>⏱ {duration} min</span>
          <span>•</span>
          <span>🎯 {shuffledProblems.length} problems</span>
          <span>•</span>
          <span>🧩 {patterns.length} patterns</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsStarted(true)}
          className="mt-6 px-8 py-3 rounded-xl font-semibold text-sm"
          style={{
            background: "var(--gradient-gold)",
            color: "hsl(228 100% 7%)",
          }}
        >
          Start Session →
        </motion.button>
      </div>
    );
  }

  if (isCompleted) {
    const score = Math.round((correctCount / results.length) * 100);
    return (
      <div className={`card-shiny p-8 text-center ${className}`}>
        <h3 className="text-2xl font-bold text-foreground">
          Session Complete! 🎉
        </h3>
        <div className="flex justify-center gap-8 mt-6">
          <div>
            <p className="text-3xl font-bold text-primary">{score}%</p>
            <p className="text-xs text-muted-foreground">Recognition</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">
              {correctCount}/{results.length}
            </p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
        </div>

        {/* Pattern breakdown */}
        <div className="mt-8 text-left">
          <h4 className="text-sm font-semibold text-foreground/70 mb-3">
            Pattern Breakdown
          </h4>
          <div className="space-y-2">
            {patterns.map((p) => {
              const res = results.filter((r) => r.pattern === p);
              const correct = res.filter((r) => r.correct).length;
              if (res.length === 0) return null;
              return (
                <div
                  key={p}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-card/50"
                >
                  <span className="text-sm text-foreground">{p}</span>
                  <span
                    className={`text-sm font-mono ${
                      correct === res.length
                        ? "text-emerald-400"
                        : "text-orange-400"
                    }`}
                  >
                    {correct}/{res.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-shiny p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-foreground">
              Pattern Shuffle
            </h3>
            <p className="text-xs text-muted-foreground">
              Problem {currentIndex + 1} of {shuffledProblems.length} • {correctCount} correct
            </p>
          </div>
        </div>
        <span className="text-sm px-3 py-1 rounded-full bg-card/60 text-primary">
          🎯 Identify the Pattern
        </span>
      </div>

      {/* Progress */}
      <div className="h-1 bg-card/60 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--gradient-gold)" }}
          animate={{
            width: `${((currentIndex + 1) / shuffledProblems.length) * 100}%`,
          }}
        />
      </div>

      {/* Problem */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-foreground">
                {currentProblem.title}
              </h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  currentProblem.difficulty === "easy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : currentProblem.difficulty === "medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {currentProblem.difficulty}
              </span>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {currentProblem.description}
            </p>
          </div>

          {/* Pattern selection */}
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Which pattern applies?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {patterns.map((pattern) => {
              let borderColor = "border-border";
              let bgColor = "";

              if (showResult) {
                if (pattern === currentProblem.pattern) {
                  borderColor = "border-emerald-500";
                  bgColor = "bg-emerald-500/10";
                } else if (
                  pattern === selectedPattern &&
                  pattern !== currentProblem.pattern
                ) {
                  borderColor = "border-red-500";
                  bgColor = "bg-red-500/10";
                }
              }

              return (
                <motion.button
                  key={pattern}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handlePatternSelect(pattern)}
                  disabled={showResult}
                  className={`p-3 rounded-xl border text-sm text-left transition-all ${borderColor} ${bgColor} ${
                    !showResult
                      ? "hover:border-primary cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  <span className="text-foreground">{pattern}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Result + Next */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <div
                  className={`p-3 rounded-xl text-sm ${
                    isCorrect
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {isCorrect
                    ? "✓ Correct! Great pattern recognition!"
                    : `✗ The correct pattern is: ${currentProblem.pattern}`}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="mt-3 w-full py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "hsl(228 100% 7%)",
                  }}
                >
                  {currentIndex + 1 >= shuffledProblems.length
                    ? "See Results"
                    : "Next Problem →"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
