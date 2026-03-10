"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface Step {
  id: string;
  description: string;
  codeLine?: number;
}

interface VisualizationPlayerProps {
  visualization: React.ReactNode;
  steps: Step[];
  code?: string;
  onStepChange?: (step: number) => void;
  className?: string;
}

export default function VisualizationPlayer({
  visualization,
  steps,
  code,
  onStepChange,
  className = "",
}: VisualizationPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  // Notify parent on step change
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [steps.length]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const codeLines = code?.split("\n") || [];

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-background/80" : ""
      } ${className}`}
    >
      <div
        className={`card-shiny overflow-hidden ${
          isFullscreen ? "h-full flex flex-col" : ""
        }`}
      >
        {/* Main content area */}
        <div
          className={`${
            code ? "grid grid-cols-1 lg:grid-cols-[1fr_300px]" : ""
          } ${isFullscreen ? "flex-1 overflow-hidden" : ""}`}
        >
          {/* Visualization area */}
          <div className="p-6 flex-1 overflow-auto">{visualization}</div>

          {/* Code panel */}
          {code && (
            <div className="border-l border-border bg-background/80 p-4 overflow-auto max-h-[500px]">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Code
              </p>
              <pre className="text-xs font-mono leading-relaxed">
                {codeLines.map((line, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      backgroundColor:
                        step?.codeLine === i + 1
                          ? "hsl(43 96% 56%, 0.15)"
                          : "transparent",
                    }}
                    className="px-2 py-0.5 rounded"
                  >
                    <span className="text-muted-foreground/60 mr-2 inline-block w-3 text-right">
                      {i + 1}
                    </span>
                    <span
                      className={
                        step?.codeLine === i + 1
                          ? "text-primary"
                          : "text-foreground/70"
                      }
                    >
                      {line}
                    </span>
                  </motion.div>
                ))}
              </pre>
            </div>
          )}
        </div>

        {/* Step description (subtitle) */}
        {step && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 bg-card/50 border-t border-border text-center"
          >
            <p className="text-sm text-foreground/80">
              {step.description}
            </p>
          </motion.div>
        )}

        {/* Controls bar */}
        <div className="px-6 py-3 border-t border-border flex items-center gap-4">
          {/* Step backward */}
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className="text-foreground hover:text-white disabled:opacity-30 transition-colors"
            title="Previous (←)"
          >
            ⏮
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-background font-bold"
            style={{ background: "var(--gradient-gold)" }}
            title="Play/Pause (Space)"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Step forward */}
          <button
            onClick={() =>
              setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
            }
            disabled={currentStep >= steps.length - 1}
            className="text-foreground hover:text-white disabled:opacity-30 transition-colors"
            title="Next (→)"
          >
            ⏭
          </button>

          {/* Progress bar */}
          <div
            className="flex-1 h-1.5 bg-card/60 rounded-full cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              setCurrentStep(Math.round(pct * (steps.length - 1)));
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-gold)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Step counter */}
          <span className="text-xs text-muted-foreground font-mono min-w-[50px] text-right">
            {currentStep + 1}/{steps.length}
          </span>

          {/* Speed control */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-card border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:outline-none"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-foreground hover:text-white transition-colors text-sm"
            title="Fullscreen"
          >
            {isFullscreen ? "⊟" : "⊞"}
          </button>
        </div>
      </div>
    </div>
  );
}
