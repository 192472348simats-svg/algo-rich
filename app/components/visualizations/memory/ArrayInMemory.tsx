"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback, useEffect } from "react";


type DataType = "int" | "char" | "float";
type OperationMode = "static" | "access" | "insert" | "delete";

interface ArrayInMemoryProps {
  array: number[];
  dataType?: DataType;
  baseAddress?: number;
  highlightIndex?: number;
  showAddresses?: boolean;
  showCalculation?: boolean;
  mode?: OperationMode;
  className?: string;
}

const BYTE_SIZES: Record<DataType, number> = { int: 4, char: 1, float: 4 };
const TYPE_LABELS: Record<DataType, string> = {
  int: "int (4 bytes)",
  char: "char (1 byte)",
  float: "float (4 bytes)",
};

interface Scene {
  id: string;
  title: string;
  description: string;
  guideMessage: string;
  guideState: string;
}

const SCENES: Scene[] = [
  {
    id: "what",
    title: "What Is an Array?",
    description:
      "An array is a collection of elements stored at contiguous (side-by-side) memory locations. Each element can be accessed by its index.",
    guideMessage: "An array is just values lined up next to each other in memory!",
    guideState: "explaining",
  },
  {
    id: "memory",
    title: "But in Memory…",
    description:
      "Each element occupies a fixed number of bytes based on its data type. Because they're contiguous, we can calculate any element's address from the base address.",
    guideMessage:
      "See how each element is exactly 4 bytes apart? That's the secret sauce!",
    guideState: "excited",
  },
  {
    id: "access",
    title: "Why O(1) Access?",
    description:
      "To access arr[i], the CPU computes: base_address + (i × element_size). One calculation, one memory fetch — constant time no matter the array size!",
    guideMessage:
      "Direct address math = instant access. No searching needed!",
    guideState: "celebrating",
  },
  {
    id: "insert",
    title: "Why O(n) Insertion?",
    description:
      "To insert at index i, every element from i onward must shift right to make room. In the worst case (insert at index 0), ALL elements move.",
    guideMessage:
      "Everyone has to scoot over! That's why insertion is slow in arrays.",
    guideState: "thinking",
  },
];

export default function ArrayInMemory({
  array,
  dataType = "int",
  baseAddress = 0x1000,
  highlightIndex,
  showAddresses = true,
  showCalculation = false,
  mode = "static",
  className = "",
}: ArrayInMemoryProps) {
  const byteSize = BYTE_SIZES[dataType];
  const [currentScene, setCurrentScene] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(highlightIndex);
  const [insertIndex, setInsertIndex] = useState(2);
  const [shiftStep, setShiftStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [internalArray, setInternalArray] = useState(array);

  useEffect(() => {
    setInternalArray(array);
  }, [array]);

  const getAddress = useCallback(
    (index: number) => baseAddress + index * byteSize,
    [baseAddress, byteSize]
  );

  const formatAddr = useCallback(
    (index: number) => "0x" + getAddress(index).toString(16).toUpperCase().padStart(4, "0"),
    [getAddress]
  );

  const scene = SCENES[currentScene];

  // Insert animation
  const animateInsert = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShiftStep(-1);

    for (let i = internalArray.length - 1; i >= insertIndex; i--) {
      setShiftStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    const newArr = [...internalArray];
    newArr.splice(insertIndex, 0, 99);
    setInternalArray(newArr);
    setShiftStep(-1);
    setIsAnimating(false);
  }, [isAnimating, internalArray, insertIndex]);

  // Access animation
  const animateAccess = useCallback(
    (idx: number) => {
      setActiveIndex(idx);
    },
    []
  );

  const showInsertScene = currentScene === 3;
  const showAccessScene = currentScene === 2;
  const displayArray = internalArray;

  return (
    <div
      className={`relative p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">Array in Memory</h3>
        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 text-white/50">
          {TYPE_LABELS[dataType]}
        </span>
      </div>

      {/* Scene tabs */}
      <div className="flex gap-1 mb-4">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setCurrentScene(i);
              setShiftStep(-1);
              setInternalArray(array);
            }}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              i === currentScene
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40 hover:text-white/60"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Scene description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentScene}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-sm text-white/60 mb-6 leading-relaxed"
        >
          {scene.description}
        </motion.p>
      </AnimatePresence>

      {/* === Scene 0 & 1: Simple array view === */}
      {(currentScene === 0 || currentScene === 1) && (
        <div className="space-y-6">
          {/* Logical view — always visible */}
          <div>
            <span className="text-xs text-white/40 font-mono mb-2 block">
              Logical View
            </span>
            <div className="flex gap-1">
              {displayArray.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    flex items-center justify-center w-14 h-14 rounded-lg
                    font-mono text-lg border cursor-pointer transition-all
                    ${
                      activeIndex === i
                        ? "bg-primary/20 border-primary/50 text-white shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        : "bg-white/5 border-white/10 text-white/80 hover:border-white/20"
                    }
                  `}
                >
                  {val}
                </motion.div>
              ))}
            </div>
            <div className="flex gap-1 mt-1">
              {displayArray.map((_, i) => (
                <span
                  key={i}
                  className="w-14 text-center text-[10px] font-mono text-white/40"
                >
                  [{i}]
                </span>
              ))}
            </div>
          </div>

          {/* Memory view — scene 1+ */}
          {currentScene >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-xs text-white/40 font-mono mb-2 block">
                Memory View
              </span>
              <div className="space-y-1">
                {displayArray.map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setActiveIndex(i)}
                    className={`flex items-center gap-4 p-2.5 rounded-lg cursor-pointer transition-all ${
                      activeIndex === i
                        ? "bg-primary/15 border border-primary/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
                    }`}
                  >
                    {showAddresses && (
                      <span className="font-mono text-xs text-primary w-20">
                        {formatAddr(i)}
                      </span>
                    )}
                    <div className="flex-1 flex items-center justify-center py-1 px-3 bg-card rounded border border-white/10">
                      <span className="font-mono text-base text-white">
                        {val}
                      </span>
                    </div>
                    <span className="text-xs text-white/40 font-mono w-14">
                      arr[{i}]
                    </span>
                    {showAddresses && i < displayArray.length - 1 && (
                      <span className="text-[10px] text-white/20 font-mono">
                        +{byteSize}B
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* === Scene 2: O(1) access animation === */}
      {showAccessScene && (
        <div className="space-y-4">
          {/* Index selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">Access index:</span>
            <div className="flex gap-1">
              {displayArray.map((_, i) => (
                <button
                  key={i}
                  onClick={() => animateAccess(i)}
                  className={`w-8 h-8 rounded text-xs font-mono transition-all ${
                    activeIndex === i
                      ? "bg-primary/30 text-primary border border-primary/50"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Memory with highlight */}
          <div className="space-y-1">
            {displayArray.map((val, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: activeIndex === i ? 1.02 : 1,
                  borderColor:
                    activeIndex === i
                      ? "rgba(212,175,55,0.5)"
                      : "rgba(255,255,255,0.06)",
                }}
                className={`flex items-center gap-4 p-2.5 rounded-lg transition-colors ${
                  activeIndex === i
                    ? "bg-primary/15"
                    : "bg-white/[0.03]"
                } border`}
              >
                <span className="font-mono text-xs text-primary w-20">
                  {formatAddr(i)}
                </span>
                <div className="flex-1 flex items-center justify-center py-1 px-3 bg-card rounded border border-white/10">
                  <span className="font-mono text-base text-white">{val}</span>
                </div>
                <span className="text-xs text-white/40 font-mono w-14">
                  arr[{i}]
                </span>
                {activeIndex === i && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-primary font-semibold"
                  >
                    ← FOUND!
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Address calculation */}
          {activeIndex !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-primary/10 border border-primary/30"
            >
              <p className="font-mono text-xs text-primary mb-1">
                Address = base + (index × element_size)
              </p>
              <p className="font-mono text-sm text-white">
                <span className="text-primary">{formatAddr(0)}</span>
                {" + ("}
                <span className="text-primary">{activeIndex}</span>
                {" × "}
                <span className="text-primary">{byteSize}</span>
                {") = "}
                <span className="text-primary font-bold">
                  {formatAddr(activeIndex)}
                </span>
              </p>
              <p className="text-xs text-emerald-400 mt-2">
                ✓ One calculation → direct access → O(1)
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* === Scene 3: O(n) insertion animation === */}
      {showInsertScene && (
        <div className="space-y-4">
          {/* Insert index selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-white/60">Insert at index:</span>
            <div className="flex gap-1">
              {displayArray.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setInsertIndex(i)}
                  className={`w-8 h-8 rounded text-xs font-mono transition-all ${
                    insertIndex === i
                      ? "bg-primary/30 text-primary border border-primary/50"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <button
              onClick={animateInsert}
              disabled={isAnimating}
              className="px-3 py-1 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors"
            >
              {isAnimating ? "Shifting…" : "▶ Insert 99"}
            </button>
            <button
              onClick={() => {
                setInternalArray(array);
                setShiftStep(-1);
              }}
              className="px-3 py-1 text-xs rounded bg-white/5 text-white/50 hover:bg-white/10 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Memory cells with shift animation */}
          <div className="space-y-1">
            {displayArray.map((val, i) => {
              const isShifting = shiftStep >= 0 && i >= insertIndex && i <= shiftStep;
              return (
                <motion.div
                  key={`${i}-${val}`}
                  animate={{
                    x: isShifting ? 16 : 0,
                    backgroundColor: isShifting
                      ? "rgba(245,158,11,0.15)"
                      : "rgba(255,255,255,0.02)",
                  }}
                  className="flex items-center gap-4 p-2.5 rounded-lg border border-white/[0.06]"
                >
                  <span className="font-mono text-xs text-primary w-20">
                    {formatAddr(i)}
                  </span>
                  <div
                    className={`flex-1 flex items-center justify-center py-1 px-3 rounded border ${
                      isShifting
                        ? "bg-[var(--warning)]/10 border-[var(--warning)]/30"
                        : "bg-card border-white/10"
                    }`}
                  >
                    <span className="font-mono text-base text-white">{val}</span>
                  </div>
                  <span className="text-xs text-white/40 font-mono w-14">
                    arr[{i}]
                  </span>
                  {isShifting && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-[var(--warning)]"
                    >
                      → shift
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Operation count */}
          <div className="p-3 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30">
            <p className="text-xs text-[var(--warning)]">
              Shifts needed: {displayArray.length - insertIndex} out of{" "}
              {displayArray.length} elements → O(n) worst case
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/[0.06]">
        <button
          onClick={() => {
            setCurrentScene((s) => Math.max(0, s - 1));
            setInternalArray(array);
            setShiftStep(-1);
          }}
          disabled={currentScene === 0}
          className="px-3 py-1.5 text-sm rounded bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          ← Previous
        </button>
        <div className="flex gap-1">
          {SCENES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentScene ? "bg-primary" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            setCurrentScene((s) => Math.min(SCENES.length - 1, s + 1));
            setInternalArray(array);
            setShiftStep(-1);
          }}
          disabled={currentScene === SCENES.length - 1}
          className="px-3 py-1.5 text-sm rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-30 transition-colors"
        >
          Next →
        </button>
      </div>

    </div>
  );
}
