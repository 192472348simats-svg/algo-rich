"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

type Operation = "access" | "insert" | "memory";

interface ArrayVsLinkedListProps {
  className?: string;
}

const ARRAY_VALUES = [5, 8, 1, 7];
const LL_ADDRESSES = ["0x1000", "0x2050", "0x1500", "0x3000"];

const OPERATIONS: { id: Operation; label: string; description: string }[] = [
  {
    id: "access",
    label: "Access Element",
    description: "How fast can we get to element [2]?",
  },
  {
    id: "insert",
    label: "Insert Element",
    description: "Insert value 99 after position 1",
  },
  {
    id: "memory",
    label: "Memory Usage",
    description: "How much memory does each structure use?",
  },
];

export default function ArrayVsLinkedList({
  className = "",
}: ArrayVsLinkedListProps) {
  const [activeOp, setActiveOp] = useState<Operation>("access");
  const [animating, setAnimating] = useState(false);
  const [arrayStep, setArrayStep] = useState(-1);
  const [llStep, setLlStep] = useState(-1);

  const animateAccess = useCallback(async () => {
    if (animating) return;
    setAnimating(true);
    setArrayStep(-1);
    setLlStep(-1);

    // Array: instant
    setArrayStep(2);

    // LL: step through 0, 1, 2
    for (let i = 0; i <= 2; i++) {
      setLlStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    setAnimating(false);
  }, [animating]);

  const animateInsert = useCallback(async () => {
    if (animating) return;
    setAnimating(true);
    setArrayStep(-1);
    setLlStep(-1);

    // Array: shift elements 2,3
    for (let i = ARRAY_VALUES.length - 1; i >= 2; i--) {
      setArrayStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    // LL: just update pointers (step 0=allocate, 1=redirect)
    setLlStep(0);
    await new Promise((r) => setTimeout(r, 800));
    setLlStep(1);
    await new Promise((r) => setTimeout(r, 800));
    setLlStep(2);
    setAnimating(false);
  }, [animating]);

  const runAnimation = () => {
    if (activeOp === "access") animateAccess();
    if (activeOp === "insert") animateInsert();
  };

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Array vs. Linked List — Memory Comparison
      </h3>

      {/* Operation selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {OPERATIONS.map((op) => (
          <button
            key={op.id}
            onClick={() => {
              setActiveOp(op.id);
              setArrayStep(-1);
              setLlStep(-1);
            }}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              activeOp === op.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40 hover:text-white/60"
            }`}
          >
            {op.label}
          </button>
        ))}
        {activeOp !== "memory" && (
          <button
            onClick={runAnimation}
            disabled={animating}
            className="ml-auto px-4 py-1.5 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors"
          >
            {animating ? "Running…" : "▶ Animate"}
          </button>
        )}
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Array side */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-primary">Array</span>
            <span className="text-[10px] text-white/30 font-mono">CONTIGUOUS</span>
          </div>

          <div className="space-y-1">
            {ARRAY_VALUES.map((val, i) => {
              const isHighlighted =
                (activeOp === "access" && arrayStep === i) ||
                (activeOp === "insert" && arrayStep >= 0 && i >= 2 && i <= arrayStep);
              return (
                <motion.div
                  key={i}
                  animate={{
                    x: activeOp === "insert" && arrayStep >= 0 && i >= 2 && i <= arrayStep ? 12 : 0,
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-mono transition-colors ${
                    isHighlighted
                      ? activeOp === "access"
                        ? "bg-primary/15 border-primary/40"
                        : "bg-[var(--warning)]/15 border-[var(--warning)]/40"
                      : "bg-white/[0.03] border-white/[0.06]"
                  }`}
                >
                  <span className="text-primary/70 w-14">
                    0x{(0x1000 + i * 4).toString(16).toUpperCase()}
                  </span>
                  <div className="flex-1 text-center text-white">{val}</div>
                  <span className="text-white/30">arr[{i}]</span>
                  {activeOp === "access" && arrayStep === i && (
                    <span className="text-primary">✓</span>
                  )}
                  {activeOp === "insert" && isHighlighted && (
                    <span className="text-[var(--warning)]">→</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Result */}
          <div className="mt-3 p-2 rounded bg-primary/10 border border-primary/20 text-xs">
            {activeOp === "access" && (
              <p className="text-primary">
                base + (2 × 4) = 0x1008 → <strong>O(1)</strong>
              </p>
            )}
            {activeOp === "insert" && (
              <p className="text-[var(--warning)]">
                Shift {ARRAY_VALUES.length - 2} elements → <strong>O(n)</strong>
              </p>
            )}
            {activeOp === "memory" && (
              <div className="text-white/60">
                <p>4 ints × 4 bytes = <span className="text-primary">16 bytes</span></p>
                <p className="text-emerald-400 mt-1">No overhead — just values!</p>
              </div>
            )}
          </div>
        </div>

        {/* Linked List side */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-primary">
              Linked List
            </span>
            <span className="text-[10px] text-white/30 font-mono">SCATTERED</span>
          </div>

          <div className="space-y-1">
            {ARRAY_VALUES.map((val, i) => {
              const isHighlighted =
                (activeOp === "access" && llStep >= 0 && i <= llStep) ||
                (activeOp === "insert" && llStep >= 0 && (i === 1 || i === 2));
              const isCurrent =
                (activeOp === "access" && llStep === i) ||
                (activeOp === "insert" && llStep === 2 && i === 1);
              return (
                <motion.div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-mono transition-colors ${
                    isCurrent
                      ? "bg-primary/20 border-primary/50"
                      : isHighlighted
                      ? "bg-primary/10 border-primary/30"
                      : "bg-white/[0.03] border-white/[0.06]"
                  }`}
                >
                  <span className="text-primary/70 w-14">{LL_ADDRESSES[i]}</span>
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-white">{val}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-primary/60 text-[10px]">
                      {i < ARRAY_VALUES.length - 1 ? LL_ADDRESSES[i + 1] : "null"}
                    </span>
                  </div>
                  {activeOp === "access" && isCurrent && (
                    <span className="text-primary">
                      {i === 2 ? "✓ Found" : "→"}
                    </span>
                  )}
                </motion.div>
              );
            })}

            {/* Show new node for insert */}
            {activeOp === "insert" && llStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-mono"
              >
                <span className="text-primary/70 w-14">0x2800</span>
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-emerald-400 font-bold">99</span>
                  <span className="text-white/20">|</span>
                  <span className="text-primary/60 text-[10px]">
                    {LL_ADDRESSES[2]}
                  </span>
                </div>
                <span className="text-emerald-400">NEW</span>
              </motion.div>
            )}
          </div>

          {/* Result */}
          <div className="mt-3 p-2 rounded bg-primary/10 border border-primary/20 text-xs">
            {activeOp === "access" && (
              <p className="text-primary">
                Follow 3 pointers → <strong>O(n)</strong>
              </p>
            )}
            {activeOp === "insert" && (
              <p className="text-emerald-400">
                Allocate + 2 pointer updates → <strong>O(1)*</strong>
                <span className="text-white/30 block mt-0.5">
                  *if we have a reference to the insertion point
                </span>
              </p>
            )}
            {activeOp === "memory" && (
              <div className="text-white/60">
                <p>4 nodes × (4B value + 8B pointer) = <span className="text-primary">48 bytes</span></p>
                <p className="text-[var(--warning)] mt-1">3× more than array (pointer overhead)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 overflow-hidden rounded-lg border border-white/10"
      >
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="text-left p-2 text-white/40">Operation</th>
              <th className="text-center p-2 text-primary">Array</th>
              <th className="text-center p-2 text-primary">Linked List</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Access by index", "O(1)", "O(n)"],
              ["Insert at beginning", "O(n)", "O(1)"],
              ["Insert at end", "O(1)*", "O(1)**"],
              ["Delete by value", "O(n)", "O(n)"],
              ["Memory per element", "value only", "value + pointer"],
              ["Cache performance", "Excellent", "Poor"],
            ].map(([op, arr, ll]) => (
              <tr key={op} className="border-t border-white/[0.04]">
                <td className="p-2 text-white/60">{op}</td>
                <td className="p-2 text-center text-primary">{arr}</td>
                <td className="p-2 text-center text-primary">{ll}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

    </div>
  );
}
