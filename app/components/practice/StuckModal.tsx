"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface StuckHint {
  level: number;
  title: string;
  cost: number;   // XP cost (0 = free)
  content: string;
}

interface Props {
  hints?: string[];          // problem-specific hints (up to 4)
  problemTitle?: string;
  onXPPenalty?: (xp: number) => void;
  onClose: () => void;
}

const DEFAULT_GUIDANCE = [
  "Re-read the problem statement slowly. What exactly is it asking you to produce?",
  "Work through the first example by hand on paper. Write every step you take mentally.",
  "Can you think of the simplest possible input and output? What would your code need to do for THAT case?",
  "Look at the constraints. How large can the input get? Does that suggest any approach?",
];

function buildHints(hints?: string[]): StuckHint[] {
  const levels: StuckHint[] = [
    {
      level: 1,
      title: "Think First 🤔",
      cost: 0,
      content: DEFAULT_GUIDANCE[0],
    },
    {
      level: 2,
      title: "Guiding Question",
      cost: 2,
      content: hints?.[0] ?? DEFAULT_GUIDANCE[1],
    },
    {
      level: 3,
      title: "Approach Hint",
      cost: 5,
      content: hints?.[1] ?? DEFAULT_GUIDANCE[2],
    },
    {
      level: 4,
      title: "Strategy",
      cost: 10,
      content: hints?.[2] ?? DEFAULT_GUIDANCE[3],
    },
    {
      level: 5,
      title: "Step-by-Step",
      cost: 15,
      content:
        hints?.[3] ??
        "Break the problem into 3 steps: (1) understand the input, (2) figure out one transformation, (3) produce the output. Write pseudocode first, then translate to Python.",
    },
  ];
  return levels;
}

export default function StuckModal({
  hints,
  problemTitle,
  onXPPenalty,
  onClose,
}: Props) {
  const allHints = buildHints(hints);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeLevel, setActiveLevel] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

  function unlockNext() {
    const next = unlockedLevel + 1;
    if (next > allHints.length) return;
    const cost = allHints[next - 1].cost;
    setUnlockedLevel(next);
    setActiveLevel(next);
    if (cost > 0) {
      setTotalCost((prev) => prev + cost);
      onXPPenalty?.(cost);
    }
  }

  const currentHint = allHints[activeLevel - 1];
  const nextHint = allHints[unlockedLevel]; // hint after currently unlocked
  const allUnlocked = unlockedLevel >= allHints.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(10, 17, 40, 0.85)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d1627] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold text-white">💡 Hint System</h2>
            {problemTitle && (
              <p className="text-xs text-white/30 mt-0.5 truncate max-w-[260px]">{problemTitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {totalCost > 0 && (
              <span className="text-xs text-orange-400 font-medium">-{totalCost} XP used</span>
            )}
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Hint level tabs */}
        <div className="flex border-b border-white/[0.04]">
          {allHints.map((hint) => {
            const isUnlocked = hint.level <= unlockedLevel;
            return (
              <button
                key={hint.level}
                onClick={() => isUnlocked && setActiveLevel(hint.level)}
                className={`flex-1 py-2.5 text-[10px] font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                  activeLevel === hint.level
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : isUnlocked
                    ? "text-white/40 hover:text-white/60"
                    : "text-white/15 cursor-not-allowed"
                }`}
              >
                {isUnlocked ? `L${hint.level}` : "🔒"}
              </button>
            );
          })}
        </div>

        {/* Hint content */}
        <div className="p-5 min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLevel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                {currentHint.title}
                {currentHint.cost === 0 && (
                  <span className="ml-2 text-emerald-400 normal-case">Free</span>
                )}
              </p>
              <p className="text-sm text-white/75 leading-relaxed">{currentHint.content}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Unlock next or close */}
        <div className="px-5 pb-5">
          {!allUnlocked ? (
            <button
              onClick={unlockNext}
              className="w-full py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/50
                         hover:bg-white/[0.04] hover:text-white/70 transition-all cursor-pointer"
            >
              {nextHint.cost === 0
                ? `Unlock Level ${nextHint.level} (Free)`
                : `Unlock Level ${nextHint.level} (−${nextHint.cost} XP)`}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-xs text-white/30 mb-3">All hints unlocked. You got this! 💪</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-sm text-primary
                           hover:bg-primary/30 transition-colors cursor-pointer"
              >
                Back to problem →
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
