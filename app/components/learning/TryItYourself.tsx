"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TryItYourselfProps {
  challenge: string;
  hints?: string[];
}

/** Challenge prompt card with progressively revealed hints. */
export default function TryItYourself({
  challenge,
  hints = [],
}: TryItYourselfProps) {
  const [revealedHints, setRevealedHints] = useState(0);

  function showNextHint() {
    setRevealedHints((prev) => Math.min(prev + 1, hints.length));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="my-6 rounded-xl border border-primary/25 bg-primary/5 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-2.5 bg-primary/10 border-b border-primary/15 flex items-center gap-2">
        <span className="text-base">🎯</span>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Try It Yourself
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-foreground text-[15px] leading-relaxed font-medium">
          {challenge}
        </p>

        {/* Hints */}
        {hints.length > 0 && (
          <div className="space-y-2">
            <AnimatePresence>
              {Array.from({ length: revealedHints }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-[var(--gold-light)]/70 bg-background/30 border border-primary/10 rounded-lg px-4 py-2.5"
                >
                  <span className="text-primary font-semibold mr-1">
                    Hint {i + 1}:
                  </span>{" "}
                  {hints[i]}
                </motion.div>
              ))}
            </AnimatePresence>

            {revealedHints < hints.length && (
              <button
                onClick={showNextHint}
                className="text-xs text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5"
              >
                💡 Show hint ({revealedHints + 1}/{hints.length})
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
