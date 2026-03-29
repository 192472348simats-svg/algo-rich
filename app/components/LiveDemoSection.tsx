// NEW: Interactive live session demo — no signup required
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STAGES = [
  {
    id: "hook",
    label: "Hook",
    emoji: "🎯",
    title: "The Problem",
    content: "You have an array of numbers and a target. Find two numbers that add up to the target. Return their indices.",
    example: "nums = [2, 7, 11, 15]\ntarget = 9\n→ Answer: [0, 1]  (2 + 7 = 9)",
    question: null,
  },
  {
    id: "watch",
    label: "Watch",
    emoji: "👀",
    title: "See It Step by Step",
    content: "The naive approach checks every pair. But we can do better — use a hash map to remember numbers we've seen.",
    example: "Step 1: See 2. Store it. {2: 0}\nStep 2: See 7. Need 2? Yes! Return [0, 1]",
    question: null,
  },
  {
    id: "predict",
    label: "Predict",
    emoji: "🧠",
    title: "Your Turn",
    content: "Before we code — what's the time complexity of the hash map approach?",
    example: null,
    question: {
      prompt: "What is the time complexity?",
      options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
      correct: 2,
      explanation: "Correct! O(n) — we visit each element once and hash map lookup is O(1).",
    },
  },
  {
    id: "learn",
    label: "Learn",
    emoji: "💻",
    title: "Write the Code",
    content: "Here's the hash map solution. Notice how we check for the complement before storing.",
    example: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i",
    question: null,
  },
  {
    id: "reflect",
    label: "Reflect",
    emoji: "✨",
    title: "Key Takeaway",
    content: "The pattern here is: Hash Map for O(1) lookup. Whenever you need to find a pair/complement in an array, think hash map first.",
    example: "Pattern name: Hash Map\nWhere else: 3Sum, Subarray Sum, Two Sum variants",
    question: null,
  },
];

export default function LiveDemoSection() {
  const [stage, setStage] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  const [showXpPop, setShowXpPop] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = STAGES[stage];

  const advance = () => {
    if (stage < STAGES.length - 1) {
      setStage(s => s + 1);
      setAnswered(null);
      addXp(20);
    } else {
      setCompleted(true);
      addXp(50);
    }
  };

  const addXp = (amt: number) => {
    setXp(v => v + amt);
    setShowXpPop(true);
    setTimeout(() => setShowXpPop(false), 1200);
  };

  const reset = () => { setStage(0); setAnswered(null); setXp(0); setCompleted(false); };

  const canAdvance = current.question ? answered === current.question.correct : true;

  return (
    <section id="demo" className="py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-px" style={{ background: "#E5A829" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#E5A829" }}>No signup needed</span>
            <span className="w-6 h-px" style={{ background: "#E5A829" }} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            Try a real session now
          </h2>
          <p className="text-lg" style={{ color: "#6b7a99" }}>This is exactly what learning on AlgoRich feels like.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          {/* XP bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "#E5A829" }}>⚡ Two Sum — Easy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-xs font-bold tabular-nums" style={{ color: "#E5A829" }}>+{xp} XP</span>
                <AnimatePresence>
                  {showXpPop && (
                    <motion.span initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
                      className="absolute -top-5 left-0 text-xs font-bold" style={{ color: "#10b981" }}>
                      +20
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stage pills */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
            {STAGES.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: i < stage ? "#0d2a1a" : i === stage ? "#1a1400" : "#0f1629",
                    color: i < stage ? "#10b981" : i === stage ? "#E5A829" : "#6b7a99",
                    border: `1px solid ${i < stage ? "#10b98140" : i === stage ? "#E5A82950" : "#1E3A5F"}`,
                  }}
                >
                  {i < stage ? "✓" : s.emoji} {s.label}
                </div>
                {i < STAGES.length - 1 && (
                  <div className="w-4 h-px" style={{ background: i < stage ? "#10b98140" : "#1E3A5F" }} />
                )}
              </div>
            ))}
          </div>

          {/* Stage card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}>
            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.div key={stage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{current.emoji}</span>
                      <h3 className="text-xl font-bold text-white">{current.title}</h3>
                    </div>

                    <p className="text-base leading-relaxed mb-5" style={{ color: "#c8d0e0" }}>{current.content}</p>

                    {current.example && (
                      <div className="rounded-xl p-4 mb-5 font-mono text-sm" style={{ background: "#0a0f24", border: "1px solid #1E3A5F" }}>
                        <pre className="whitespace-pre-wrap" style={{ color: "#c8d0e0", margin: 0, lineHeight: "1.7" }}>
                          {current.example}
                        </pre>
                      </div>
                    )}

                    {current.question && (
                      <div className="mb-5">
                        <p className="text-sm font-medium text-white mb-3">{current.question.prompt}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {current.question.options.map((opt, i) => {
                            const isCorrect = i === current.question!.correct;
                            const isSelected = answered === i;
                            const showResult = answered !== null;
                            return (
                              <button key={i} onClick={() => answered === null && setAnswered(i)}
                                disabled={answered !== null}
                                className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                                style={{
                                  background: showResult
                                    ? isCorrect ? "#0d2a1a" : isSelected ? "#1a0505" : "#0a0f24"
                                    : "#0a0f24",
                                  border: `1px solid ${showResult
                                    ? isCorrect ? "#10b981" : isSelected ? "#ef4444" : "#1E3A5F"
                                    : "#1E3A5F"}`,
                                  color: showResult
                                    ? isCorrect ? "#10b981" : isSelected ? "#ef4444" : "#6b7a99"
                                    : "#c8d0e0",
                                  cursor: answered !== null ? "default" : "pointer",
                                }}>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {answered !== null && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 rounded-xl text-sm"
                            style={{
                              background: answered === current.question.correct ? "#0d2a1a" : "#1a0505",
                              color: answered === current.question.correct ? "#10b981" : "#ef4444",
                              border: `1px solid ${answered === current.question.correct ? "#10b98130" : "#ef444430"}`,
                            }}>
                            {answered === current.question.correct
                              ? current.question.explanation
                              : "Not quite. The hash map approach visits each element once → O(n)."}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-6 md:px-8 pb-6 flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#6b7a99" }}>
                      Step {stage + 1} of {STAGES.length}
                    </span>
                    <button
                      onClick={advance}
                      disabled={!canAdvance}
                      className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                      style={{ background: canAdvance ? "#E5A829" : "#1a1400", color: canAdvance ? "#0a0f24" : "#6b7a99" }}>
                      {stage === STAGES.length - 1 ? "Complete lesson ✓" : "Next →"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Session complete!</h3>
                  <p className="mb-2" style={{ color: "#6b7a99" }}>You earned <span style={{ color: "#E5A829" }}>{xp} XP</span> and learned the Hash Map pattern.</p>
                  <p className="text-sm mb-8" style={{ color: "#6b7a99" }}>
                    There are 150+ problems and 13 sessions waiting for you inside AlgoRich.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/signup">
                      <button className="px-7 py-3 rounded-xl font-semibold text-sm hover:opacity-90" style={{ background: "#E5A829", color: "#0a0f24" }}>
                        Create free account →
                      </button>
                    </Link>
                    <button onClick={reset} className="px-7 py-3 rounded-xl font-semibold text-sm" style={{ background: "transparent", color: "#c8d0e0", border: "1px solid #1E3A5F" }}>
                      Try again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
