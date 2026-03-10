"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Hint {
  level: number;
  text: string;
  showCode?: boolean;
  code?: string;
}

interface HintSystemProps {
  hints: Hint[];
  onHintUsed?: (level: number) => void;
}

/** Progressive hint system — each click reveals the next hint level. */
export default function HintSystem({ hints, onHintUsed }: HintSystemProps) {
  const [revealedLevel, setRevealedLevel] = useState(0);

  const sorted = [...hints].sort((a, b) => a.level - b.level);

  function revealNext() {
    const nextLevel = revealedLevel + 1;
    setRevealedLevel(nextLevel);
    onHintUsed?.(nextLevel);
  }

  // Color intensifies as more hints are used
  function hintColor(idx: number) {
    if (idx < sorted.length * 0.5) return "border-primary/20 bg-primary/5";
    if (idx < sorted.length * 0.75) return "border-orange-500/20 bg-orange-500/5";
    return "border-red-500/20 bg-red-500/5";
  }

  function hintLabel(idx: number) {
    if (idx < sorted.length * 0.5) return "text-primary";
    if (idx < sorted.length * 0.75) return "text-orange-400";
    return "text-red-400";
  }

  return (
    <div className="my-4 space-y-2">
      <AnimatePresence>
        {sorted.slice(0, revealedLevel).map((hint, i) => (
          <motion.div
            key={hint.level}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
            className={`rounded-lg border px-4 py-3 ${hintColor(i)}`}
            style={{ marginLeft: `${i * 8}px` }}
          >
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${hintLabel(i)}`}>
              Hint {hint.level}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {hint.text}
            </p>
            {hint.showCode && hint.code && (
              <pre className="mt-2 text-xs bg-background/60 rounded-md p-3 overflow-x-auto text-foreground/70 font-mono">
                {hint.code}
              </pre>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {revealedLevel < sorted.length ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={revealNext}
          className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
            revealedLevel === 0
              ? "border-primary/30 text-primary hover:bg-primary/10"
              : revealedLevel < sorted.length - 1
                ? "border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                : "border-red-500/30 text-red-400 hover:bg-red-500/10"
          }`}
        >
          {revealedLevel === 0
            ? "🤔 Need a hint?"
            : `Show next hint (${revealedLevel}/${sorted.length} used)`}
        </motion.button>
      ) : (
        <p className="text-xs text-muted-foreground/70 italic">
          All hints revealed
        </p>
      )}
    </div>
  );
}
