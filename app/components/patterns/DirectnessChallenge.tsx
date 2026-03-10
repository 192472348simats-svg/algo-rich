"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Challenge {
  description: string;
  starterCode: string;
  expectedOutput?: string;
  hints: string[];
}

interface DirectnessChallengeProps {
  patternName: string;
  patternIcon: string;
  challenges: Challenge[];
  onComplete?: (score: number) => void;
  className?: string;
}

export default function DirectnessChallenge({
  patternName,
  patternIcon,
  challenges,
  onComplete,
  className = "",
}: DirectnessChallengeProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [code, setCode] = useState(challenges[0]?.starterCode || "");
  const [hintIndex, setHintIndex] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const challenge = challenges[currentChallenge];
  const isLast = currentChallenge >= challenges.length - 1;

  const handleSubmit = useCallback(() => {
    // Simple check: code has been modified from starter
    const modified = code.trim() !== challenge.starterCode.trim();
    if (modified) {
      setScore((prev) => prev + 1);
    }
    setSubmitted(true);
  }, [code, challenge]);

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete?.(score);
    } else {
      setCurrentChallenge((prev) => prev + 1);
      setCode(challenges[currentChallenge + 1]?.starterCode || "");
      setHintIndex(-1);
      setSubmitted(false);
    }
  }, [isLast, currentChallenge, challenges, score, onComplete]);

  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            {patternIcon} {patternName} — Directness Challenge
          </h3>
          <p className="text-xs text-muted-foreground">
            Challenge {currentChallenge + 1}/{challenges.length}
          </p>
        </div>
      </div>

      {/* Challenge description */}
      <div className="p-4 rounded-xl bg-background/80 border border-border mb-4">
        <p className="text-sm text-foreground leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Hints */}
      {challenge.hints.length > 0 && !submitted && (
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
                  💡 {challenge.hints[i]}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {hintIndex < challenge.hints.length - 1 && (
            <button
              onClick={() => setHintIndex((prev) => prev + 1)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Need a hint? ({hintIndex + 2}/{challenge.hints.length})
            </button>
          )}
        </div>
      )}

      {/* Code editor */}
      <div className="relative mb-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={submitted}
          rows={12}
          className="w-full p-4 rounded-xl bg-background/80 border border-border text-sm font-mono text-foreground focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-60"
          spellCheck={false}
        />
        {challenge.expectedOutput && submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <p className="text-xs text-emerald-400">
              Expected output: {challenge.expectedOutput}
            </p>
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!code.trim()}
            className="flex-1 py-3 rounded-xl font-semibold text-sm disabled:opacity-40"
            style={{
              background: "var(--gradient-gold)",
              color: "hsl(228 100% 7%)",
            }}
          >
            Submit Solution
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-semibold text-sm"
            style={{
              background: "var(--gradient-gold)",
              color: "hsl(228 100% 7%)",
            }}
          >
            {isLast ? `Finish (${score}/${challenges.length})` : "Next Challenge →"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
