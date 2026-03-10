"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ReflectConfig } from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";

interface Props {
  config: ReflectConfig;
  onComplete: (result: StageResult) => void;
}

export default function ReflectStage({ config, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const question = config.questions[currentQ];
  const isCorrect = selectedIndex === question.correctIndex;

  function handleSelect(index: number) {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    if (index === question.correctIndex) {
      setScore((prev) => prev + 10);
    }
  }

  function next() {
    if (currentQ + 1 >= config.questions.length) {
      onComplete({ score, timeSpent: 0 });
    } else {
      setCurrentQ((prev) => prev + 1);
      setAnswered(false);
      setSelectedIndex(null);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">
          Reflect
        </p>
        <p className="text-sm text-white/40">
          {currentQ + 1}/{config.questions.length} — Quick knowledge check
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <p className="text-base text-white mb-5">{question.question}</p>

        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            let style =
              "border-white/[0.06] bg-white/[0.02] text-white/60";
            if (answered) {
              if (i === question.correctIndex) {
                style =
                  "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
              } else if (i === selectedIndex) {
                style = "border-red-500/30 bg-red-500/10 text-red-400";
              }
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                whileHover={!answered ? { scale: 1.01 } : {}}
                whileTap={!answered ? { scale: 0.99 } : {}}
                className={`w-full text-left rounded-lg border ${style} px-4 py-3 text-sm transition-colors
                           ${
                             !answered
                               ? "hover:border-white/15 hover:bg-white/[0.04] cursor-pointer"
                               : "cursor-default"
                           }`}
              >
                <span className="text-white/20 mr-3 font-mono text-xs">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback + explanation */}
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 rounded-lg border p-4 ${
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
              {isCorrect ? "Correct! +10 XP" : "Not quite"}
            </p>
            <p className="text-xs text-white/50">{question.explanation}</p>
            <button
              onClick={next}
              className="mt-3 rounded-lg bg-white/[0.06] px-4 py-2 text-sm text-white/60
                         hover:bg-white/10 transition-colors cursor-pointer"
            >
              {currentQ + 1 < config.questions.length
                ? "Next →"
                : "Continue →"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
