"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PredictConfig } from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";

interface Props {
  config: PredictConfig;
  onComplete: (result: StageResult) => void;
}

export default function PredictStage({ config, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const question = config.questions[currentQ];

  function handleAnswer(answer: string) {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(answer);

    const correct = String(answer).trim() === String(question.correctAnswer).trim();
    setIsCorrect(correct);
    if (correct) setScore((prev) => prev + question.xp);
  }

  function nextQuestion() {
    if (currentQ + 1 >= config.questions.length) {
      onComplete({ score, timeSpent: 0 });
    } else {
      setCurrentQ((prev) => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">
          Predict
        </p>
        <p className="text-sm text-white/40">
          Question {currentQ + 1} of {config.questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="space-y-6"
        >
          {/* Question */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <p className="text-base text-white leading-relaxed whitespace-pre-wrap">
              {question.question}
            </p>
          </div>

          {/* Multiple-choice options */}
          {question.options && question.answerType === "multiple-choice" && (
            <div className="grid gap-3">
              {question.options.map((option, i) => {
                let borderColor = "border-white/[0.06]";
                let bgColor = "bg-white/[0.02]";
                let textColor = "text-white/70";

                if (answered && option === String(question.correctAnswer)) {
                  borderColor = "border-emerald-500/40";
                  bgColor = "bg-emerald-500/10";
                  textColor = "text-emerald-400";
                } else if (
                  answered &&
                  option === selectedAnswer &&
                  !isCorrect
                ) {
                  borderColor = "border-red-500/40";
                  bgColor = "bg-red-500/10";
                  textColor = "text-red-400";
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    className={`text-left rounded-xl border ${borderColor} ${bgColor} px-5 py-3.5
                               ${textColor} text-sm transition-colors
                               ${
                                 !answered
                                   ? "hover:border-white/15 hover:bg-white/[0.04] cursor-pointer"
                                   : "cursor-default"
                               }`}
                  >
                    <span className="text-white/20 mr-3 font-mono text-xs">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Click-direction options */}
          {question.answerType === "click-direction" &&
            question.options && (
              <div className="flex items-center justify-center gap-4">
                {question.options.map((option, i) => {
                  let style = "border-white/[0.06] bg-white/[0.02] text-white/70";
                  if (answered && option === String(question.correctAnswer)) {
                    style = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
                  } else if (answered && option === selectedAnswer && !isCorrect) {
                    style = "border-red-500/40 bg-red-500/10 text-red-400";
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={answered}
                      whileHover={!answered ? { scale: 1.05 } : {}}
                      whileTap={!answered ? { scale: 0.95 } : {}}
                      className={`rounded-xl border ${style} px-8 py-4 text-sm font-medium transition-colors
                                 ${!answered ? "cursor-pointer hover:border-white/15" : "cursor-default"}`}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            )}

          {/* Type-number answer */}
          {question.answerType === "type-number" && !answered && (
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="number"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputRef.current?.value) {
                    handleAnswer(inputRef.current.value);
                  }
                }}
                placeholder="Your answer..."
                className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3
                           text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary/30"
              />
              <button
                onClick={() => {
                  if (inputRef.current?.value) handleAnswer(inputRef.current.value);
                }}
                className="rounded-xl bg-primary/20 border border-primary/30 px-5 py-3
                           text-sm text-primary hover:bg-primary/30 transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
          )}

          {/* Feedback */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-5 ${
                isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-orange-500/20 bg-orange-500/5"
              }`}
            >
              <p
                className={`text-sm font-medium mb-1 ${
                  isCorrect ? "text-emerald-400" : "text-orange-400"
                }`}
              >
                {isCorrect ? `Correct! +${question.xp} XP` : "Not quite"}
              </p>
              <p className="text-sm text-white/50">
                {isCorrect
                  ? question.feedbackCorrect
                  : question.feedbackWrong}
              </p>
              <button
                onClick={nextQuestion}
                className="mt-4 rounded-lg bg-white/[0.06] px-4 py-2 text-sm text-white/60
                           hover:bg-white/10 transition-colors cursor-pointer"
              >
                {currentQ + 1 < config.questions.length
                  ? "Next Question →"
                  : "Continue →"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
