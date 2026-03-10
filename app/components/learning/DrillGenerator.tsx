"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

interface DrillProblem {
  id: string;
  prompt: string;
  code?: string;
  answer: string;
  options?: string[];
}

interface DrillGeneratorProps {
  weakArea: string;
  problems: DrillProblem[];
  difficulty: "easy" | "medium" | "hard";
  onComplete: (score: number) => void;
  className?: string;
}

export default function DrillGenerator({
  weakArea,
  problems,
  difficulty,
  onComplete,
  className = "",
}: DrillGeneratorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentProblem = problems[currentIndex];

  const isCorrect = useMemo(() => {
    const normalized = userAnswer.trim().toLowerCase();
    const expected = currentProblem?.answer.trim().toLowerCase();
    return normalized === expected;
  }, [userAnswer, currentProblem]);

  const handleSubmit = useCallback(() => {
    setShowResult(true);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
  }, [isCorrect]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= problems.length) {
      const finalScore = Math.round(
        ((correctCount + (isCorrect ? 1 : 0)) / problems.length) * 100
      );
      setIsCompleted(true);
      onComplete(finalScore);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowResult(false);
    }
  }, [currentIndex, problems.length, correctCount, isCorrect, onComplete]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      setUserAnswer(option);
      setShowResult(true);
      if (option.trim().toLowerCase() === currentProblem.answer.trim().toLowerCase()) {
        setCorrectCount((prev) => prev + 1);
      }
    },
    [currentProblem]
  );

  const difficultyColor =
    difficulty === "easy"
      ? "text-emerald-400"
      : difficulty === "medium"
      ? "text-yellow-400"
      : "text-red-400";

  if (isCompleted) {
    const score = Math.round((correctCount / problems.length) * 100);
    return (
      <div className={`card-shiny p-8 text-center ${className}`}>
        <h3 className="text-2xl font-bold text-foreground">
          Drill Complete!
        </h3>
        <p className="text-muted-foreground mt-2">
          Focused on: <span className="text-primary">{weakArea}</span>
        </p>
        <p className="text-4xl font-bold text-primary mt-4">
          {score}%
        </p>
        <p className="text-sm text-muted-foreground">
          {correctCount}/{problems.length} correct
        </p>
      </div>
    );
  }

  if (!currentProblem) return null;

  return (
    <div className={`card-shiny p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-foreground">
              Drill: {weakArea}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentIndex + 1}/{problems.length} •{" "}
              <span className={difficultyColor}>{difficulty}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-card/60 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--gradient-gold)" }}
          animate={{
            width: `${((currentIndex + 1) / problems.length) * 100}%`,
          }}
        />
      </div>

      {/* Problem */}
      <p className="text-foreground mb-4 leading-relaxed">
        {currentProblem.prompt}
      </p>

      {currentProblem.code && (
        <pre className="p-4 rounded-xl bg-background/80 border border-border text-sm font-mono text-foreground mb-4 overflow-x-auto">
          <code>{currentProblem.code}</code>
        </pre>
      )}

      {/* Input */}
      {currentProblem.options ? (
        <div className="space-y-2">
          {currentProblem.options.map((option) => {
            let borderColor = "border-border";
            let bgColor = "";

            if (showResult) {
              if (
                option.trim().toLowerCase() ===
                currentProblem.answer.trim().toLowerCase()
              ) {
                borderColor = "border-emerald-500";
                bgColor = "bg-emerald-500/10";
              } else if (
                option === userAnswer &&
                option.trim().toLowerCase() !==
                  currentProblem.answer.trim().toLowerCase()
              ) {
                borderColor = "border-red-500";
                bgColor = "bg-red-500/10";
              }
            }

            return (
              <motion.button
                key={option}
                whileHover={!showResult ? { scale: 1.01 } : {}}
                whileTap={!showResult ? { scale: 0.99 } : {}}
                onClick={() => !showResult && handleOptionSelect(option)}
                disabled={showResult}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${borderColor} ${bgColor} ${
                  !showResult ? "hover:border-primary cursor-pointer" : ""
                }`}
              >
                <span className="text-foreground">{option}</span>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={showResult}
            onKeyDown={(e) => e.key === "Enter" && !showResult && handleSubmit()}
            placeholder="Type your answer..."
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          {!showResult && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40"
              style={{
                background: "var(--gradient-gold)",
                color: "hsl(228 100% 7%)",
              }}
            >
              Check
            </motion.button>
          )}
        </div>
      )}

      {/* Result */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div
            className={`p-3 rounded-xl text-sm ${
              isCorrect || (currentProblem.options && userAnswer.trim().toLowerCase() === currentProblem.answer.trim().toLowerCase())
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isCorrect || (currentProblem.options && userAnswer.trim().toLowerCase() === currentProblem.answer.trim().toLowerCase())
              ? "✓ Correct!"
              : `✗ Answer: ${currentProblem.answer}`}
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
            {currentIndex + 1 >= problems.length ? "See Results" : "Next →"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
