"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import MemoryCell from "./MemoryCell";

interface AddressExplainerProps {
  totalCells?: number;
  baseAddress?: number;
  highlightAddress?: number;
  className?: string;
}

type Step = {
  title: string;
  description: string;
  guideMessage: string;
};

const STEPS: Step[] = [
  {
    title: "Memory as a Strip of Cells",
    description:
      "Computer memory is a long sequence of storage cells. Each cell holds one byte (8 bits = a number 0-255).",
    guideMessage: "Think of memory like a HUGE row of tiny mailboxes!",
  },
  {
    title: "Every Cell Has an Address",
    description:
      "Just like houses on a street, each cell has a unique number — its address. We use these to find data.",
    guideMessage: "An address is just a number that tells us WHERE to look!",
  },
  {
    title: "Hexadecimal Notation",
    description:
      "Addresses are written in hex (base 16) for brevity. 0x0A = 10 in decimal. It's just a more compact way to write big numbers.",
    guideMessage:
      "Hex uses 0-9 and A-F. So 0xFF = 255, and 0x100 = 256!",
  },
  {
    title: "Pointers = Stored Addresses",
    description:
      "A pointer is a variable that stores an address — it literally points to another location in memory. That's all it is!",
    guideMessage:
      "A pointer is just a variable that holds an address. Follow it to find data!",
  },
];

export default function AddressExplainer({
  totalCells = 16,
  baseAddress = 0x1000,
  highlightAddress,
  className = "",
}: AddressExplainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [jumpAddress, setJumpAddress] = useState("");

  // Generate stable random cell values once on mount
  const [cells] = useState(() =>
    Array.from({ length: totalCells }, (_, i) => ({
      address: baseAddress + i,
      value: Math.floor(Math.random() * 256),
    }))
  );

  const handleJump = useCallback(() => {
    const parsed = parseInt(jumpAddress, 16);
    if (!isNaN(parsed)) {
      const idx = parsed - baseAddress;
      if (idx >= 0 && idx < totalCells) {
        setSelectedCell(idx);
      }
    }
  }, [jumpAddress, baseAddress, totalCells]);

  const step = STEPS[currentStep];

  return (
    <div
      className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Understanding Memory Addresses
        </h3>
        <span className="text-xs font-mono text-white/40">
          Step {currentStep + 1}/{STEPS.length}
        </span>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 mb-4">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i <= currentStep ? "bg-primary" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <h4 className="text-base font-semibold text-primary mb-2">
            {step.title}
          </h4>
          <p className="text-sm text-white/70 leading-relaxed">
            {step.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Memory strip */}
      <div className="overflow-x-auto pb-8 pt-6">
        <div className="flex gap-1 min-w-max">
          {cells.map((cell, i) => {
            const isHighlighted =
              selectedCell === i ||
              highlightAddress === cell.address;

            // Step-dependent display
            const showAs: "decimal" | "hex" | "binary" =
              currentStep >= 2 ? "hex" : "decimal";

            // Step 3: show pointer value
            if (currentStep === 3 && i === 4) {
              return (
                <div key={i} className="relative">
                  <MemoryCell
                    address={`0x${cell.address.toString(16).toUpperCase()}`}
                    value={cells[8]?.address ?? 0}
                    showAs="hex"
                    highlighted={true}
                    highlightColor="gold"
                    label="ptr"
                    size="sm"
                    onClick={() => setSelectedCell(i)}
                  />
                  {/* Arrow to target */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-1/2 -right-1 z-10"
                  >
                    <svg width="60" height="40" className="overflow-visible">
                      <defs>
                        <marker
                          id="arrow-ptr"
                          markerWidth="8"
                          markerHeight="6"
                          refX="8"
                          refY="3"
                          orient="auto"
                        >
                          <path d="M0,0 L8,3 L0,6" fill="hsl(var(--primary))" />
                        </marker>
                      </defs>
                      <path
                        d="M0,0 Q30,-30 55,0"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        fill="none"
                        markerEnd="url(#arrow-ptr)"
                        strokeDasharray="4,3"
                      />
                    </svg>
                  </motion.div>
                </div>
              );
            }

            return (
              <MemoryCell
                key={i}
                address={
                  currentStep >= 1
                    ? `0x${cell.address.toString(16).toUpperCase()}`
                    : `[${i}]`
                }
                value={cell.value}
                showAs={showAs}
                highlighted={isHighlighted}
                highlightColor={selectedCell === i ? "gold" : "cyan"}
                size="sm"
                onClick={() => setSelectedCell(i)}
              />
            );
          })}
        </div>
      </div>

      {/* Jump to address */}
      {currentStep >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-2"
        >
          <span className="text-xs text-white/40">Jump to:</span>
          <span className="text-xs font-mono text-primary/60">0x</span>
          <input
            type="text"
            value={jumpAddress}
            onChange={(e) => setJumpAddress(e.target.value.replace(/[^0-9a-fA-F]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleJump()}
            placeholder="1000"
            className="w-20 px-2 py-1 rounded text-xs font-mono bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
          />
          <button
            onClick={handleJump}
            className="px-2 py-1 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            Go
          </button>
        </motion.div>
      )}

      {/* Selected cell details */}
      <AnimatePresence>
        {selectedCell !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono">
              <span className="text-white/50">Address (hex):</span>
              <span className="text-primary">
                0x{cells[selectedCell].address.toString(16).toUpperCase()}
              </span>
              <span className="text-white/50">Address (dec):</span>
              <span className="text-white/80">{cells[selectedCell].address}</span>
              <span className="text-white/50">Value (dec):</span>
              <span className="text-white">{cells[selectedCell].value}</span>
              <span className="text-white/50">Value (bin):</span>
              <span className="text-white/80">
                {(cells[selectedCell].value & 0xff).toString(2).padStart(8, "0")}
              </span>
              <span className="text-white/50">Offset from base:</span>
              <span className="text-primary">+{selectedCell} bytes</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-3 py-1 text-sm rounded bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={currentStep === STEPS.length - 1}
          className="px-3 py-1 text-sm rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-30 transition-colors"
        >
          Next →
        </button>
      </div>

    </div>
  );
}
