"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StackFrame {
  functionName: string;
  params: Record<string, string | number>;
  locals: Record<string, string | number>;
  returnValue?: string | number;
  line: number;
  isBase?: boolean;
}

interface RecursionVisualizationProps {
  code: string;
  trace: StackFrame[];
  mode: "play" | "step" | "interactive";
  className?: string;
}

export default function RecursionVisualization({
  code,
  trace,
  mode,
  className = "",
}: RecursionVisualizationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeFrames = useMemo(() => {
    // Show frames 0..currentFrame as the "stack" at this point
    return trace.slice(0, currentFrame + 1);
  }, [trace, currentFrame]);

  const codeLines = useMemo(() => code.split("\n"), [code]);
  const currentLine = trace[currentFrame]?.line;

  const handleNext = () => {
    if (currentFrame < trace.length - 1) {
      setCurrentFrame((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentFrame > 0) {
      setCurrentFrame((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  const isReturning = trace[currentFrame]?.returnValue !== undefined;

  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            Recursion — Call Stack
          </h3>
          <p className="text-xs text-muted-foreground">
            Step {currentFrame + 1}/{trace.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code panel */}
        <div className="rounded-xl bg-background/80 border border-border p-4 overflow-auto max-h-[400px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Code
          </p>
          <pre className="text-sm font-mono leading-relaxed">
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor:
                    i + 1 === currentLine
                      ? "hsl(43 96% 56%, 0.15)"
                      : "transparent",
                }}
                className="px-2 py-0.5 rounded"
              >
                <span className="text-muted-foreground/60 mr-3 inline-block w-4 text-right">
                  {i + 1}
                </span>
                <span
                  className={
                    i + 1 === currentLine
                      ? "text-primary"
                      : "text-foreground/80"
                  }
                >
                  {line}
                </span>
              </motion.div>
            ))}
          </pre>
        </div>

        {/* Call stack panel */}
        <div className="rounded-xl bg-background/80 border border-border p-4 overflow-auto max-h-[400px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Call Stack
          </p>
          <div className="flex flex-col-reverse gap-2">
            <AnimatePresence>
              {activeFrames.map((frame, i) => {
                const isTop = i === activeFrames.length - 1;
                const isBase = frame.isBase;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg border ${
                      isTop
                        ? "border-primary bg-primary/10"
                        : isBase
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-border bg-card/50"
                    }`}
                  >
                    {/* Function name */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-semibold ${
                          isTop
                            ? "text-primary"
                            : isBase
                            ? "text-emerald-400"
                            : "text-foreground"
                        }`}
                      >
                        {frame.functionName}(
                        {Object.entries(frame.params)
                          .map(([k, v]) => `${k}=${v}`)
                          .join(", ")}
                        )
                      </span>
                      {isTop && (
                        <span className="text-xs text-primary px-2 py-0.5 rounded-full bg-primary/20">
                          ACTIVE
                        </span>
                      )}
                      {isBase && (
                        <span className="text-xs text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20">
                          BASE CASE
                        </span>
                      )}
                    </div>

                    {/* Locals */}
                    {Object.keys(frame.locals).length > 0 && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {Object.entries(frame.locals).map(([k, v]) => (
                          <span key={k} className="mr-3">
                            {k}={String(v)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Return value */}
                    {frame.returnValue !== undefined && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-xs font-mono text-primary"
                      >
                        ↩ return {String(frame.returnValue)}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4 items-center">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-card/60 transition-colors"
        >
          ⟲ Reset
        </button>
        <button
          onClick={handlePrev}
          disabled={currentFrame === 0}
          className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-card/60 disabled:opacity-30 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentFrame >= trace.length - 1}
          className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
          style={{
            background: "var(--gradient-gold)",
            color: "hsl(228 100% 7%)",
          }}
        >
          Next →
        </button>
        <div className="text-xs text-muted-foreground/70 font-mono">
          {currentFrame + 1}/{trace.length}
        </div>
      </div>
    </div>
  );
}
