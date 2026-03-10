"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface QuizOption {
  id: string;
  text: string;
}

export interface ConceptCheckProps {
  /** The quiz question */
  question: string;
  /** Array of answer options */
  options: QuizOption[];
  /** The id of the correct option */
  correctId: string;
  /** Explanation shown after answering */
  explanation: string;
  /** Optional hint shown before answering */
  hint?: string;
  /** Optional callback when answered */
  onAnswer?: (correct: boolean) => void;
}

export default function ConceptCheck({
  question,
  options,
  correctId,
  explanation,
  hint,
  onAnswer,
}: ConceptCheckProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);

  const answered = selectedId !== null;
  const isCorrect = selectedId === correctId;

  function handleSelect(optionId: string) {
    if (answered) return;
    setSelectedId(optionId);

    const correct = optionId === correctId;
    if (!correct) {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }

    // Reveal explanation after a short delay
    setTimeout(() => setShowExplanation(true), correct ? 400 : 800);
    onAnswer?.(correct);
  }

  function handleReset() {
    setSelectedId(null);
    setShowExplanation(false);
    setShowHint(false);
    setShakeWrong(false);
  }

  function getOptionState(optionId: string) {
    if (!answered) return "idle";
    if (optionId === correctId) return "correct";
    if (optionId === selectedId) return "incorrect";
    return "dimmed";
  }

  const optionStyles = {
    idle: "border-white/10 bg-background/40 hover:border-primary/40 hover:bg-background/60 cursor-pointer",
    correct:
      "border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30",
    incorrect: "border-red-500/60 bg-red-500/10 ring-1 ring-red-500/30",
    dimmed: "border-white/5 bg-background/20 opacity-50",
  };

  const optionIcons = {
    idle: null,
    correct: (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    ),
    incorrect: (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.div>
    ),
    dimmed: null,
  };

  const letterLabels = ["A", "B", "C", "D", "E", "F"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="my-6 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3 bg-primary/10 border-b border-primary/15 flex items-center gap-2.5">
        <span className="text-lg">🧠</span>
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
          Concept Check
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Question */}
        <p className="text-white font-medium text-base leading-relaxed">
          {question}
        </p>

        {/* Hint toggle */}
        {hint && !answered && (
          <AnimatePresence>
            {!showHint ? (
              <motion.button
                key="hint-btn"
                onClick={() => setShowHint(true)}
                className="text-xs text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>💡</span> Show hint
              </motion.button>
            ) : (
              <motion.div
                key="hint-text"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-[var(--gold-light)]/70 bg-primary/5 border border-primary/10 rounded-lg px-4 py-2.5 leading-relaxed"
              >
                💡 {hint}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Options */}
        <motion.div
          animate={shakeWrong ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="space-y-2.5"
        >
          {options.map((option, i) => {
            const state = getOptionState(option.id);
            return (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={answered}
                whileHover={!answered ? { scale: 1.01 } : {}}
                whileTap={!answered ? { scale: 0.99 } : {}}
                layout
                className={`w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  optionStyles[state]
                } ${answered ? "cursor-default" : ""}`}
              >
                {/* Letter badge */}
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                    state === "correct"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : state === "incorrect"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {letterLabels[i]}
                </span>

                {/* Option text */}
                <span
                  className={`flex-1 text-sm leading-snug ${
                    state === "correct"
                      ? "text-emerald-300"
                      : state === "incorrect"
                        ? "text-red-300"
                        : "text-foreground"
                  }`}
                >
                  {option.text}
                </span>

                {/* Result icon */}
                {optionIcons[state]}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Feedback banner */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" as const }}
              className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
                isCorrect
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              <span className="text-xl">{isCorrect ? "🎉" : "😔"}</span>
              <span
                className={`text-sm font-medium ${
                  isCorrect ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isCorrect
                  ? "Correct! Well done."
                  : "Not quite. Check the explanation below."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
              className="bg-background/50 border border-white/8 rounded-lg px-4 py-3.5 space-y-1.5"
            >
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Explanation
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Try again */}
        {answered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end"
          >
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try again
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
