"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type QuizType =
  | "pattern"
  | "complexity"
  | "fill_blank"
  | "debug"
  | "explain";

interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

interface RetrievalQuizProps {
  questions: QuizQuestion[];
  topic: string;
  timeLimit?: number; // seconds per question
  onComplete: (results: { correct: number; total: number; avgTime: number }) => void;
  className?: string;
}

export default function RetrievalQuiz({
  questions,
  topic,
  timeLimit = 30,
  onComplete,
  className = "",
}: RetrievalQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<
    { correct: boolean; timeSpent: number }[]
  >([]);
  const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;

  const handleSubmit = useCallback(
    (answer: number) => {
      if (showResult) return;
      const timeSpent = (Date.now() - questionStartTime) / 1000;
      const correct = answer === currentQuestion.correctIndex;

      setSelectedAnswer(answer);
      setShowResult(true);
      setResults((prev) => [...prev, { correct, timeSpent }]);
    },
    [showResult, questionStartTime, currentQuestion]
  );

  // Timer
  useEffect(() => {
    if (isCompleted || !timeLimit) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up — auto submit wrong
          handleSubmit(-1);
          return timeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, timeLimit, handleSubmit]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete
      const newResults = results;
      const correct = newResults.filter((r) => r.correct).length;
      const avgTime =
        newResults.reduce((acc, r) => acc + r.timeSpent, 0) /
        newResults.length;
      setIsCompleted(true);
      onComplete({ correct, total: questions.length, avgTime });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(timeLimit);
      setQuestionStartTime(Date.now());
    }
  }, [currentIndex, questions.length, results, timeLimit, onComplete]);

  const correctCount = results.filter((r) => r.correct).length;

  if (isCompleted) {
    const avgTime =
      results.reduce((acc, r) => acc + r.timeSpent, 0) / results.length;
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className={`card-shiny p-8 text-center ${className}`}>
        <h3 className="text-2xl font-bold text-foreground">
          Quiz Complete!
        </h3>
        <div className="flex justify-center gap-8 mt-6">
          <div>
            <p className="text-4xl font-bold text-primary">{score}%</p>
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">
              {correctCount}/{questions.length}
            </p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-foreground">
              {avgTime.toFixed(1)}s
            </p>
            <p className="text-sm text-muted-foreground">Avg Time</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className={`card-shiny p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-foreground">
              Retrieval Quiz: {topic}
            </h3>
            <p className="text-xs text-muted-foreground">
              Question {currentIndex + 1} of {questions.length} •{" "}
              {correctCount} correct
            </p>
          </div>
        </div>

        {/* Timer */}
        {timeLimit > 0 && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono ${
              timeLeft <= 10
                ? "bg-red-500/20 text-red-400"
                : "bg-card/60 text-primary"
            }`}
          >
            ⏱ {timeLeft}s
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-card/60 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--gradient-gold)" }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question type badge */}
          <span className="inline-block px-3 py-1 rounded-full text-xs bg-card/60 text-primary mb-3">
            {currentQuestion.type === "pattern"
              ? "🎯 Which Pattern?"
              : currentQuestion.type === "complexity"
              ? "📊 What's the Complexity?"
              : currentQuestion.type === "fill_blank"
              ? "✏️ Fill the Blank"
              : currentQuestion.type === "debug"
              ? "🐛 Debug This"
              : "💬 Explain"}
          </span>

          <p className="text-lg text-foreground mb-4 leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Code block if present */}
          {currentQuestion.code && (
            <pre className="p-4 rounded-xl bg-background/80 border border-border text-sm font-mono text-foreground mb-4 overflow-x-auto">
              <code>{currentQuestion.code}</code>
            </pre>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectOption = i === currentQuestion.correctIndex;

              let borderColor = "border-border";
              let bgColor = "";

              if (showResult) {
                if (isCorrectOption) {
                  borderColor = "border-emerald-500";
                  bgColor = "bg-emerald-500/10";
                } else if (isSelected && !isCorrectOption) {
                  borderColor = "border-red-500";
                  bgColor = "bg-red-500/10";
                }
              } else if (isSelected) {
                borderColor = "border-primary";
                bgColor = "bg-primary/10";
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => !showResult && handleSubmit(i)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${borderColor} ${bgColor} ${
                    !showResult
                      ? "hover:border-primary cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                        showResult && isCorrectOption
                          ? "border-emerald-500 text-emerald-400"
                          : showResult && isSelected
                          ? "border-red-500 text-red-400"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {showResult && isCorrectOption
                        ? "✓"
                        : showResult && isSelected
                        ? "✗"
                        : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-foreground">
                      {option}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation (after answer) */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-xl bg-card/60 border border-border"
              >
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <span className="font-semibold text-primary">
                    Explanation:{" "}
                  </span>
                  {currentQuestion.explanation}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="mt-4 w-full py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "hsl(228 100% 7%)",
                  }}
                >
                  {currentIndex + 1 >= questions.length
                    ? "See Results"
                    : "Next Question →"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
