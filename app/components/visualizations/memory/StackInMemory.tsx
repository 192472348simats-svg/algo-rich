"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

export interface StackFrame {
  name: string;
  variables: Record<string, string | number>;
  returnAddress?: string;
}

interface StackInMemoryProps {
  mode?: "data_structure" | "call_stack";
  elements?: (number | string)[];
  stackFrames?: StackFrame[];
  showAddresses?: boolean;
  className?: string;
}

export default function StackInMemory({
  mode = "data_structure",
  elements: initialElements = [5, 8, 1],
  stackFrames: externalFrames,
  showAddresses = true,
  className = "",
}: StackInMemoryProps) {
  // Data structure mode
  const [stack, setStack] = useState<(number | string)[]>(initialElements);
  const [pushValue, setPushValue] = useState("");
  const [lastOp, setLastOp] = useState<"push" | "pop" | null>(null);
  const [lastOpValue, setLastOpValue] = useState<string | number | null>(null);

  // Call stack mode
  const [callStep, setCallStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const FACTORIAL_FRAMES: StackFrame[][] = [
    [{ name: "main", variables: { result: "?" } }],
    [
      { name: "factorial", variables: { n: 3 }, returnAddress: "0x300" },
      { name: "main", variables: { result: "?" } },
    ],
    [
      { name: "factorial", variables: { n: 2 }, returnAddress: "0x400" },
      { name: "factorial", variables: { n: 3 }, returnAddress: "0x300" },
      { name: "main", variables: { result: "?" } },
    ],
    [
      { name: "factorial", variables: { n: 1 }, returnAddress: "0x400" },
      { name: "factorial", variables: { n: 2 }, returnAddress: "0x400" },
      { name: "factorial", variables: { n: 3 }, returnAddress: "0x300" },
      { name: "main", variables: { result: "?" } },
    ],
    // Unwinding
    [
      { name: "factorial", variables: { n: 2, "return": "2×1=2" }, returnAddress: "0x400" },
      { name: "factorial", variables: { n: 3 }, returnAddress: "0x300" },
      { name: "main", variables: { result: "?" } },
    ],
    [
      { name: "factorial", variables: { n: 3, "return": "3×2=6" }, returnAddress: "0x300" },
      { name: "main", variables: { result: "?" } },
    ],
    [{ name: "main", variables: { result: 6 } }],
  ];

  const frames = externalFrames ?? (mode === "call_stack" ? FACTORIAL_FRAMES[callStep] : []);

  const push = useCallback(() => {
    const val = pushValue.trim();
    if (!val) return;
    const num = Number(val);
    const element = isNaN(num) ? val : num;
    setStack((s) => [...s, element]);
    setLastOp("push");
    setLastOpValue(element);
    setPushValue("");
  }, [pushValue]);

  const pop = useCallback(() => {
    if (stack.length === 0) return;
    const removed = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setLastOp("pop");
    setLastOpValue(removed);
  }, [stack]);

  const animateCallStack = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    for (let i = 0; i < FACTORIAL_FRAMES.length; i++) {
      setCallStep(i);
      await new Promise((r) => setTimeout(r, 1200));
    }
    setIsAnimating(false);
  }, [isAnimating]);

  const baseAddr = 0x7fff0000;

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {mode === "data_structure"
            ? "Stack (LIFO) in Memory"
            : "Call Stack — Function Recursion"}
        </h3>
        {mode === "data_structure" && (
          <span className="text-[10px] font-mono text-white/30">
            Last In, First Out
          </span>
        )}
      </div>

      {/* === Data Structure Mode === */}
      {mode === "data_structure" && (
        <>
          {/* Controls */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={pushValue}
              onChange={(e) => setPushValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && push()}
              placeholder="Value"
              className="w-20 px-2 py-1.5 text-sm font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
            />
            <button
              onClick={push}
              className="px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              Push ↓
            </button>
            <button
              onClick={pop}
              disabled={stack.length === 0}
              className="px-3 py-1.5 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-30 transition-colors"
            >
              Pop ↑
            </button>
            <span className="ml-auto text-xs text-white/30 font-mono">
              size: {stack.length}
            </span>
          </div>

          {/* Stack visualization */}
          <div className="relative">
            {/* TOP label */}
            {stack.length > 0 && (
              <div className="flex items-center gap-1 mb-1 ml-1">
                <span className="text-[10px] font-mono text-primary">
                  ← TOP
                </span>
              </div>
            )}

            <div className="space-y-0.5">
              <AnimatePresence>
                {[...stack].reverse().map((val, reverseI) => {
                  const i = stack.length - 1 - reverseI;
                  const isTop = i === stack.length - 1;
                  return (
                    <motion.div
                      key={`${i}-${val}`}
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                        isTop
                          ? "bg-primary/15 border-primary/40"
                          : "bg-white/[0.03] border-white/[0.06]"
                      }`}
                    >
                      {showAddresses && (
                        <span className="font-mono text-[10px] text-primary/60 w-20">
                          0x{(baseAddr - i * 4).toString(16).toUpperCase()}
                        </span>
                      )}
                      <div className="flex-1 flex items-center justify-center py-1 px-3 bg-card rounded border border-white/10">
                        <span className="font-mono text-white">{String(val)}</span>
                      </div>
                      {isTop && (
                        <span className="text-xs text-primary font-mono">
                          TOP
                        </span>
                      )}
                      {i === 0 && !isTop && (
                        <span className="text-xs text-white/30 font-mono">
                          BOTTOM
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {stack.length === 0 && (
                <div className="flex items-center justify-center py-8 text-white/20 text-sm">
                  Stack is empty
                </div>
              )}
            </div>
          </div>

          {/* Last operation */}
          <AnimatePresence>
            {lastOp && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-2 rounded-lg text-xs font-mono ${
                  lastOp === "push"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {lastOp === "push"
                  ? `Pushed ${lastOpValue} → O(1)`
                  : `Popped ${lastOpValue} → O(1)`}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* === Call Stack Mode === */}
      {mode === "call_stack" && (
        <>
          {/* Code preview */}
          <div className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] font-mono text-xs">
            <p className="text-white/40 mb-1"># Recursive factorial</p>
            <p className="text-white/80">
              <span className="text-primary">def</span>{" "}
              <span className="text-primary">factorial</span>(n):
            </p>
            <p className="text-white/60 ml-4">
              <span className="text-primary">if</span> n &lt;= 1:{" "}
              <span className="text-primary">return</span> 1
            </p>
            <p className="text-white/60 ml-4">
              <span className="text-primary">return</span> n *{" "}
              factorial(n - 1)
            </p>
            <p className="text-white/80 mt-1">
              result = factorial(<span className="text-primary">3</span>)
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={animateCallStack}
              disabled={isAnimating}
              className="px-4 py-1.5 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors"
            >
              {isAnimating ? "Running…" : "▶ Run factorial(3)"}
            </button>
            <div className="flex gap-1 ml-auto">
              {FACTORIAL_FRAMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCallStep(i)}
                  className={`w-6 h-6 rounded text-[10px] font-mono transition-colors ${
                    callStep === i
                      ? "bg-primary/30 text-primary"
                      : "bg-white/5 text-white/30 hover:text-white/50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Stack frames */}
          <div className="space-y-0.5">
            <AnimatePresence>
              {frames.map((frame, i) => {
                const isCurrent = i === 0;
                return (
                  <motion.div
                    key={`${frame.name}-${Object.values(frame.variables).join("-")}-${i}`}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`p-3 rounded-lg border ${
                      isCurrent
                        ? "bg-primary/10 border-primary/30"
                        : "bg-white/[0.03] border-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-sm font-semibold ${isCurrent ? "text-primary" : "text-white/60"}`}>
                        {frame.name}()
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          ← Current
                        </span>
                      )}
                      {frame.returnAddress && (
                        <span className="text-[10px] text-white/30 font-mono">
                          ret: {frame.returnAddress}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(frame.variables).map(([k, v]) => (
                        <span key={k} className="text-xs font-mono text-white/50">
                          {k} ={" "}
                          <span className={k === "return" ? "text-emerald-400" : "text-white"}>
                            {String(v)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Phase label */}
          <div className="mt-4 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-xs text-white/50 font-mono">
              {callStep <= 3
                ? `📥 Winding: Pushing frames (depth ${Math.min(callStep, 3)})`
                : `📤 Unwinding: Popping frames, returning values`}
            </p>
          </div>
        </>
      )}

    </div>
  );
}
