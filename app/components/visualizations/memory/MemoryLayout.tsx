"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

export interface StackFrame {
  name: string;
  variables: Record<string, string | number>;
  returnAddress?: string;
}

export interface HeapBlock {
  id: string;
  label: string;
  size: number;
  address: string;
  color?: "cyan" | "gold" | "success" | "error";
  freed?: boolean;
}

type MemorySection = "stack" | "heap" | "data" | "code";

interface MemoryLayoutProps {
  highlightSection?: MemorySection;
  stackFrames?: StackFrame[];
  heapAllocations?: HeapBlock[];
  animate?: boolean;
  className?: string;
}

const SECTION_COLORS: Record<MemorySection, { bg: string; border: string; text: string; label: string }> = {
  stack: {
    bg: "bg-primary/10",
    border: "border-primary/40",
    text: "text-primary",
    label: "STACK",
  },
  heap: {
    bg: "bg-primary/10",
    border: "border-primary/40",
    text: "text-primary",
    label: "HEAP",
  },
  data: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    label: "DATA",
  },
  code: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
    text: "text-purple-400",
    label: "CODE",
  },
};

const SECTION_DESCRIPTIONS: Record<MemorySection, string> = {
  stack:
    "Local variables and function call frames. Grows downward. Automatically managed — allocated on function call, freed on return.",
  heap:
    "Dynamically allocated memory (e.g., objects, arrays created at runtime). Grows upward. Must be explicitly managed.",
  data: "Global and static variables. Initialized when the program starts, persists for its entire lifetime.",
  code: "The compiled machine instructions of your program. Read-only memory — executing these instructions is what runs your code.",
};

export default function MemoryLayout({
  highlightSection,
  stackFrames = [],
  heapAllocations = [],
  animate = true,
  className = "",
}: MemoryLayoutProps) {
  const [hoveredSection, setHoveredSection] = useState<MemorySection | null>(null);
  const [zoomedSection, setZoomedSection] = useState<MemorySection | null>(null);

  const activeSection = hoveredSection ?? highlightSection ?? null;

  const renderSection = useCallback(
    (section: MemorySection, content: React.ReactNode, extra?: string) => {
      const s = SECTION_COLORS[section];
      const isActive = activeSection === section;
      const isZoomed = zoomedSection === section;

      return (
        <motion.div
          layout
          onHoverStart={() => setHoveredSection(section)}
          onHoverEnd={() => setHoveredSection(null)}
          onClick={() => setZoomedSection(isZoomed ? null : section)}
          animate={{
            flex: isZoomed ? 3 : 1,
            borderColor: isActive ? undefined : "rgba(255,255,255,0.08)",
          }}
          className={`
            relative rounded-lg border p-3 cursor-pointer
            transition-colors duration-200
            ${isActive ? `${s.bg} ${s.border}` : "bg-white/[0.02] border-white/[0.08]"}
            ${isActive ? "shadow-lg" : ""}
          `}
        >
          {/* Section label */}
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs font-bold ${isActive ? s.text : "text-white/50"}`}>
              {s.label}
            </span>
            {extra && (
              <span className="text-[10px] text-white/40 font-mono">{extra}</span>
            )}
          </div>

          {/* Description subtitle */}
          <p className="text-[10px] text-white/40 mb-2 leading-relaxed">
            {section === "stack"
              ? "Local variables, function calls"
              : section === "heap"
              ? "Dynamic allocation (objects, arrays)"
              : section === "data"
              ? "Global & static variables"
              : "Program instructions"}
          </p>

          {/* Content */}
          <div className="min-h-[40px]">{content}</div>

          {/* Growth arrow */}
          {section === "stack" && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center text-primary/50 text-xs">
              <span>↓</span>
              <span className="text-[8px] font-mono">grows</span>
            </div>
          )}
          {section === "heap" && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center text-primary/50 text-xs">
              <span className="text-[8px] font-mono">grows</span>
              <span>↑</span>
            </div>
          )}
        </motion.div>
      );
    },
    [activeSection, zoomedSection]
  );

  return (
    <div className={`relative p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Memory Layout</h3>
        <span className="text-[10px] font-mono text-white/30">
          High → Low Address
        </span>
      </div>

      {/* Address markers */}
      <div className="flex items-center justify-between text-[10px] font-mono text-white/30 mb-2 px-1">
        <span>0xFFFF...</span>
        <span className="text-white/20">High Address</span>
      </div>

      {/* Memory sections — vertical layout */}
      <div className="flex flex-col gap-1">
        {/* STACK */}
        {renderSection(
          "stack",
          <div className="space-y-1">
            {stackFrames.length > 0 ? (
              <AnimatePresence>
                {stackFrames.map((frame, i) => (
                  <motion.div
                    key={frame.name + i}
                    initial={animate ? { opacity: 0, y: -10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-mono"
                  >
                    <span className="text-primary font-semibold">{frame.name}()</span>
                    <div className="flex flex-wrap gap-2 mt-0.5">
                      {Object.entries(frame.variables).map(([k, v]) => (
                        <span key={k} className="text-white/60">
                          {k}=<span className="text-white">{String(v)}</span>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <span className="text-xs text-white/20 italic">
                (no active frames)
              </span>
            )}
          </div>,
          "← Grows ↓"
        )}

        {/* PADDING — free space */}
        <div className="flex items-center justify-center py-2 border border-dashed border-white/[0.06] rounded text-[10px] text-white/20 font-mono">
          ··· free space ···
        </div>

        {/* HEAP */}
        {renderSection(
          "heap",
          <div className="space-y-1">
            {heapAllocations.length > 0 ? (
              <AnimatePresence>
                {heapAllocations.map((block) => {
                  const c = block.color ?? "gold";
                  const colorMap = {
                    cyan: "border-primary/30 bg-primary/10 text-primary",
                    gold: "border-primary/30 bg-primary/10 text-primary",
                    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                    error: "border-red-500/30 bg-red-500/10 text-red-400",
                  };
                  return (
                    <motion.div
                      key={block.id}
                      initial={animate ? { opacity: 0, scale: 0.9 } : false}
                      animate={{ opacity: block.freed ? 0.4 : 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`px-2 py-1 rounded border text-xs font-mono ${colorMap[c]} ${block.freed ? "line-through opacity-50" : ""}`}
                    >
                      <span className="font-semibold">{block.label}</span>
                      <span className="ml-2 text-white/40">
                        {block.address} ({block.size}B)
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <span className="text-xs text-white/20 italic">
                (no allocations)
              </span>
            )}
          </div>,
          "← Grows ↑"
        )}

        {/* DATA */}
        {renderSection(
          "data",
          <span className="text-xs text-white/40 font-mono">
            globals, static vars
          </span>
        )}

        {/* CODE */}
        {renderSection(
          "code",
          <span className="text-xs text-white/40 font-mono">
            program instructions
          </span>
        )}
      </div>

      {/* Bottom address */}
      <div className="flex items-center justify-between text-[10px] font-mono text-white/30 mt-2 px-1">
        <span>0x0000...</span>
        <span className="text-white/20">Low Address</span>
      </div>

      {/* Description panel */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/10"
          >
            <p className={`text-xs ${SECTION_COLORS[activeSection].text}`}>
              {SECTION_DESCRIPTIONS[activeSection]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
