"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StackQueueVisualizationProps {
  type: "stack" | "queue";
  initialElements?: (number | string)[];
  mode: "explanation" | "interactive";
  className?: string;
}

export default function StackQueueVisualization({
  type,
  initialElements = [],
  mode,
  className = "",
}: StackQueueVisualizationProps) {
  const [elements, setElements] = useState<(number | string)[]>(initialElements);
  const [inputValue, setInputValue] = useState("");
  const [lastAction, setLastAction] = useState<string>("");
  const [removedValue, setRemovedValue] = useState<string | number | null>(null);

  const handlePush = useCallback(() => {
    const val = inputValue.trim();
    if (!val) return;
    const numVal = isNaN(Number(val)) ? val : Number(val);

    if (type === "stack") {
      setElements((prev) => [...prev, numVal]);
      setLastAction(`Push ${numVal} → top of stack`);
    } else {
      setElements((prev) => [...prev, numVal]);
      setLastAction(`Enqueue ${numVal} → rear of queue`);
    }
    setInputValue("");
    setRemovedValue(null);
  }, [inputValue, type]);

  const handlePop = useCallback(() => {
    if (elements.length === 0) return;

    if (type === "stack") {
      const val = elements[elements.length - 1];
      setElements((prev) => prev.slice(0, -1));
      setLastAction(`Pop ${val} ← from top`);
      setRemovedValue(val);
    } else {
      const val = elements[0];
      setElements((prev) => prev.slice(1));
      setLastAction(`Dequeue ${val} ← from front`);
      setRemovedValue(val);
    }
  }, [elements, type]);

  const isStack = type === "stack";

  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            {isStack ? "Stack (LIFO)" : "Queue (FIFO)"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {elements.length} element{elements.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Visualization */}
      <div
        className="relative rounded-xl bg-background/80 border border-border p-6 min-h-[200px] flex items-center justify-center"
      >
        {elements.length === 0 ? (
          <p className="text-sm text-muted-foreground/60 italic">Empty</p>
        ) : isStack ? (
          /* Stack: vertical */
          <div className="flex flex-col-reverse gap-1 items-center">
            <AnimatePresence>
              {elements.map((el, i) => (
                <motion.div
                  key={`${el}-${i}`}
                  initial={{ opacity: 0, y: -30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <div
                    className={`w-28 h-12 flex items-center justify-center rounded-lg border text-lg font-bold ${
                      i === elements.length - 1
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-card/60 border-border text-foreground"
                    }`}
                    style={
                      i === elements.length - 1
                        ? { boxShadow: "0 0 12px hsl(43 96% 56%,0.3)" }
                        : {}
                    }
                  >
                    {el}
                  </div>
                  {i === elements.length - 1 && (
                    <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs text-primary font-semibold">
                      TOP
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Queue: horizontal */
          <div className="flex gap-1 items-center relative">
            <AnimatePresence>
              {elements.map((el, i) => (
                <motion.div
                  key={`${el}-${i}`}
                  initial={
                    i === elements.length - 1
                      ? { opacity: 0, x: 40, scale: 0.8 }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-lg border text-lg font-bold ${
                      i === 0
                        ? "bg-primary/20 border-primary text-primary"
                        : i === elements.length - 1
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-card/60 border-border text-foreground"
                    }`}
                  >
                    {el}
                  </div>
                  {i === 0 && (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-primary font-semibold whitespace-nowrap">
                      FRONT
                    </span>
                  )}
                  {i === elements.length - 1 && (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-primary font-semibold whitespace-nowrap">
                      REAR
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action feedback */}
      {lastAction && (
        <motion.div
          key={lastAction}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2.5 rounded-lg bg-card text-center text-sm text-foreground/70 font-mono"
        >
          {lastAction}
        </motion.div>
      )}

      {/* Interactive controls */}
      {mode === "interactive" && (
        <div className="flex gap-3 mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePush()}
            placeholder={`Value to ${isStack ? "push" : "enqueue"}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePush}
            disabled={!inputValue.trim()}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40"
            style={{
              background: "var(--gradient-gold)",
              color: "hsl(228 100% 7%)",
            }}
          >
            {isStack ? "Push" : "Enqueue"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePop}
            disabled={elements.length === 0}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
          >
            {isStack ? "Pop" : "Dequeue"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
