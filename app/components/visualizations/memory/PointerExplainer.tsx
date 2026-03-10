"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PointerExplainerProps {
  className?: string;
}

interface MemorySlot {
  address: string;
  label: string;
  value: string;
  type: "variable" | "pointer" | "empty";
  highlight?: "gold" | "cyan";
}

type Step = {
  title: string;
  description: string;
  guideMessage: string;
  slots: MemorySlot[];
  arrows?: { from: string; to: string }[];
};

const STEPS: Step[] = [
  {
    title: "A Simple Variable",
    description:
      'When you write "int x = 42", the computer picks a memory address and stores the value 42 there.',
    guideMessage: "A variable is just a name for a memory location!",
    slots: [
      { address: "0x1000", label: "x", value: "42", type: "variable", highlight: "gold" },
      { address: "0x1004", label: "", value: "??", type: "empty" },
      { address: "0x1008", label: "", value: "??", type: "empty" },
      { address: "0x100C", label: "", value: "??", type: "empty" },
    ],
    arrows: [],
  },
  {
    title: "A Pointer Variable",
    description:
      'A pointer like "int* ptr = &x" is just another variable — but it stores an ADDRESS instead of a regular value. Here, ptr holds 0x1000 (the address of x).',
    guideMessage: "A pointer stores an address — it POINTS to another spot in memory!",
    slots: [
      { address: "0x1000", label: "x", value: "42", type: "variable", highlight: "gold" },
      { address: "0x1004", label: "", value: "??", type: "empty" },
      { address: "0x2000", label: "ptr", value: "0x1000", type: "pointer", highlight: "cyan" },
      { address: "0x2004", label: "", value: "??", type: "empty" },
    ],
    arrows: [{ from: "0x2000", to: "0x1000" }],
  },
  {
    title: "Dereferencing (*ptr)",
    description:
      'Dereferencing means "go to the address stored in the pointer and read THAT value." So *ptr reads 0x1000 from ptr, then goes to 0x1000 and finds 42.',
    guideMessage: "Dereferencing = follow the arrow! Read the value at the address.",
    slots: [
      { address: "0x1000", label: "x", value: "42", type: "variable", highlight: "gold" },
      { address: "0x1004", label: "", value: "??", type: "empty" },
      { address: "0x2000", label: "ptr", value: "0x1000", type: "pointer", highlight: "cyan" },
      { address: "0x2004", label: "", value: "??", type: "empty" },
    ],
    arrows: [{ from: "0x2000", to: "0x1000" }],
  },
  {
    title: "Pointer Arithmetic",
    description:
      "ptr + 1 doesn't add 1 byte — it adds sizeof(int) = 4 bytes. So ptr + 1 = 0x1004. This is how arrays work under the hood: arr[i] is *(arr + i).",
    guideMessage:
      "ptr + 1 moves to the next element, not the next byte. The compiler knows the type size!",
    slots: [
      { address: "0x1000", label: "arr[0]", value: "10", type: "variable", highlight: "cyan" },
      { address: "0x1004", label: "arr[1]", value: "20", type: "variable", highlight: "gold" },
      { address: "0x1008", label: "arr[2]", value: "30", type: "variable" },
      { address: "0x100C", label: "arr[3]", value: "40", type: "variable" },
    ],
    arrows: [],
  },
];

export default function PointerExplainer({
  className = "",
}: PointerExplainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dereferencing, setDereferencing] = useState(false);

  const step = STEPS[currentStep];

  const startDereference = () => {
    if (currentStep !== 2 || dereferencing) return;
    setDereferencing(true);
    setTimeout(() => setDereferencing(false), 2500);
  };

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-2">
        What Is a Pointer?
      </h3>

      {/* Step indicator */}
      <div className="flex gap-1 mb-4">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentStep(i); setDereferencing(false); }}
            className={`flex-1 h-1 rounded-full transition-colors ${i <= currentStep ? "bg-primary" : "bg-white/10"}`}
          />
        ))}
      </div>

      {/* Title & description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <h4 className="text-base font-semibold text-primary mb-1">
            {step.title}
          </h4>
          <p className="text-sm text-white/60 leading-relaxed">
            {step.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Memory visualization */}
      <div className="relative space-y-1 mb-4">
        {step.slots.map((slot, i) => (
          <motion.div
            key={`${currentStep}-${slot.address}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{
              opacity: 1,
              x: 0,
              scale:
                dereferencing && slot.address === "0x1000" ? 1.04 : 1,
            }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
              slot.highlight === "gold"
                ? "bg-primary/10 border-primary/30"
                : slot.highlight === "cyan"
                ? "bg-primary/10 border-primary/30"
                : "bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            {/* Address */}
            <span className="font-mono text-xs text-primary/70 w-16">
              {slot.address}
            </span>

            {/* Value cell */}
            <div
              className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded border ${
                slot.type === "pointer"
                  ? "bg-primary/10 border-primary/20"
                  : slot.type === "empty"
                  ? "bg-white/[0.02] border-white/[0.04]"
                  : "bg-card border-white/10"
              }`}
            >
              <span
                className={`font-mono ${
                  slot.type === "pointer"
                    ? "text-primary"
                    : slot.type === "empty"
                    ? "text-white/20"
                    : "text-white"
                }`}
              >
                {slot.value}
              </span>
            </div>

            {/* Label */}
            <span className="font-mono text-xs text-primary w-14 text-right">
              {slot.label}
            </span>

            {/* Pointer arrow indicator */}
            {slot.type === "pointer" && (
              <span className="text-primary text-sm">📍</span>
            )}
          </motion.div>
        ))}

        {/* Arrow overlay for pointers */}
        {step.arrows && step.arrows.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none"
          >
            <svg width="60" height="100%" className="overflow-visible">
              {step.arrows.map((arrow, i) => (
                <g key={i}>
                  <defs>
                    <marker
                      id={`arrow-head-${i}`}
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                    >
                      <path
                        d="M0,0 L8,3 L0,6"
                        fill={dereferencing ? "hsl(var(--primary))" : "hsl(var(--primary))"}
                      />
                    </marker>
                  </defs>
                  <motion.path
                    d="M5,80 C30,80 30,15 5,15"
                    stroke={dereferencing ? "hsl(var(--primary))" : "hsl(var(--primary))"}
                    strokeWidth={dereferencing ? 2.5 : 1.5}
                    fill="none"
                    markerEnd={`url(#arrow-head-${i})`}
                    strokeDasharray={dereferencing ? "0" : "5,4"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </g>
              ))}
            </svg>
          </motion.div>
        )}
      </div>

      {/* Dereference button (step 2) */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <button
            onClick={startDereference}
            disabled={dereferencing}
            className="px-4 py-2 text-sm rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors font-mono"
          >
            {dereferencing ? "Following pointer..." : "▶ Dereference *ptr"}
          </button>
          <AnimatePresence>
            {dereferencing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30"
              >
                <p className="font-mono text-sm text-primary">
                  *ptr → read ptr (0x1000) → go to 0x1000 → value is{" "}
                  <span className="text-white font-bold text-lg">42</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pointer arithmetic (step 3) */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-primary/10 border border-primary/30"
        >
          <div className="space-y-1 font-mono text-xs">
            <p className="text-primary">
              ptr = 0x1000 (points to arr[0])
            </p>
            <p className="text-white/80">
              ptr + 1 = 0x1000 + 1×sizeof(int) = 0x1000 + 4 ={" "}
              <span className="text-primary">0x1004</span> (arr[1])
            </p>
            <p className="text-white/80">
              ptr + 2 = 0x1000 + 2×4 ={" "}
              <span className="text-primary">0x1008</span> (arr[2])
            </p>
            <p className="text-white/50 mt-2">
              arr[i] ≡ *(arr + i) — they&apos;re the same thing!
            </p>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/[0.06]">
        <button
          onClick={() => { setCurrentStep((s) => Math.max(0, s - 1)); setDereferencing(false); }}
          disabled={currentStep === 0}
          className="px-3 py-1.5 text-sm rounded bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          ← Back
        </button>
        <span className="text-xs text-white/30 font-mono">
          {currentStep + 1}/{STEPS.length}
        </span>
        <button
          onClick={() => { setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1)); setDereferencing(false); }}
          disabled={currentStep === STEPS.length - 1}
          className="px-3 py-1.5 text-sm rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-30 transition-colors"
        >
          Next →
        </button>
      </div>

    </div>
  );
}
