"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

interface QueueInMemoryProps {
  initialElements?: number[];
  showCircular?: boolean;
  capacity?: number;
  className?: string;
}

export default function QueueInMemory({
  initialElements = [5, 8, 1, 7],
  showCircular = true,
  capacity = 8,
  className = "",
}: QueueInMemoryProps) {
  const [mode, setMode] = useState<"basic" | "circular">("basic");

  // Basic queue mode
  const [queue, setQueue] = useState<(number | null)[]>(() => {
    const arr = new Array(capacity).fill(null);
    initialElements.forEach((v, i) => {
      if (i < capacity) arr[i] = v;
    });
    return arr;
  });
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(initialElements.length - 1);
  const [size, setSize] = useState(initialElements.length);
  const [enqueueValue, setEnqueueValue] = useState("");
  const [lastOp, setLastOp] = useState<{ type: "enqueue" | "dequeue"; value: number } | null>(null);

  const isFull = size >= capacity;
  const isEmpty = size === 0;

  const enqueue = useCallback(() => {
    const val = parseInt(enqueueValue);
    if (isNaN(val) || isFull) return;
    const newRear = mode === "circular" ? (rear + 1) % capacity : rear + 1;
    if (mode !== "circular" && newRear >= capacity) return;

    setQueue((q) => {
      const next = [...q];
      next[newRear] = val;
      return next;
    });
    setRear(newRear);
    setSize((s) => s + 1);
    setLastOp({ type: "enqueue", value: val });
    setEnqueueValue("");
  }, [enqueueValue, isFull, rear, capacity, mode]);

  const dequeue = useCallback(() => {
    if (isEmpty) return;
    const removedVal = queue[front];
    setQueue((q) => {
      const next = [...q];
      next[front] = null;
      return next;
    });
    const newFront = mode === "circular" ? (front + 1) % capacity : front + 1;
    setFront(newFront);
    setSize((s) => s - 1);
    if (removedVal !== null) setLastOp({ type: "dequeue", value: removedVal });
  }, [isEmpty, queue, front, capacity, mode]);

  const reset = useCallback(() => {
    const arr = new Array(capacity).fill(null);
    initialElements.forEach((v, i) => {
      if (i < capacity) arr[i] = v;
    });
    setQueue(arr);
    setFront(0);
    setRear(initialElements.length - 1);
    setSize(initialElements.length);
    setLastOp(null);
  }, [capacity, initialElements]);

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Queue (FIFO) in Memory
        </h3>
        <span className="text-[10px] font-mono text-white/30">
          First In, First Out
        </span>
      </div>

      {/* Mode toggle */}
      {showCircular && (
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => { setMode("basic"); reset(); }}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              mode === "basic"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40"
            }`}
          >
            Basic Queue
          </button>
          <button
            onClick={() => { setMode("circular"); reset(); }}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              mode === "circular"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40"
            }`}
          >
            Circular Queue
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input
          type="number"
          value={enqueueValue}
          onChange={(e) => setEnqueueValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enqueue()}
          placeholder="Value"
          className="w-20 px-2 py-1.5 text-sm font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
        />
        <button
          onClick={enqueue}
          disabled={isFull}
          className="px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-30 transition-colors"
        >
          Enqueue →
        </button>
        <button
          onClick={dequeue}
          disabled={isEmpty}
          className="px-3 py-1.5 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-30 transition-colors"
        >
          ← Dequeue
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-xs rounded bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
        >
          Reset
        </button>
        <span className="ml-auto text-xs text-white/30 font-mono">
          {size}/{capacity}
        </span>
      </div>

      {/* Linear visualization */}
      <div className="mb-4">
        {/* FRONT / REAR labels */}
        <div className="flex mb-1" style={{ paddingLeft: 0 }}>
          {queue.map((_, i) => (
            <div key={i} className="w-14 flex-shrink-0 flex justify-center mr-0.5">
              {i === front && size > 0 && (
                <span className="text-[10px] font-mono text-emerald-400">FRONT</span>
              )}
              {i === rear && size > 0 && i !== front && (
                <span className="text-[10px] font-mono text-primary">REAR</span>
              )}
              {i === front && i === rear && size > 0 && (
                <span className="text-[10px] font-mono text-primary">F/R</span>
              )}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="flex gap-0.5 overflow-x-auto pb-2">
          {queue.map((val, i) => {
            const isFrontCell = i === front && size > 0;
            const isRearCell = i === rear && size > 0;
            const hasValue = val !== null;

            return (
              <motion.div
                key={i}
                animate={{
                  borderColor: isFrontCell
                    ? "rgba(16,185,129,0.5)"
                    : isRearCell
                    ? "rgba(212,175,55,0.5)"
                    : hasValue
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.04)",
                }}
                className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg border font-mono transition-colors ${
                  isFrontCell
                    ? "bg-emerald-500/10"
                    : isRearCell
                    ? "bg-primary/10"
                    : hasValue
                    ? "bg-white/[0.04]"
                    : "bg-white/[0.01]"
                }`}
              >
                <AnimatePresence mode="wait">
                  {hasValue ? (
                    <motion.span
                      key={`v-${val}`}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7, y: -10 }}
                      className="text-white text-sm"
                    >
                      {val}
                    </motion.span>
                  ) : (
                    <span className="text-white/10 text-xs">—</span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Index labels */}
        <div className="flex gap-0.5">
          {queue.map((_, i) => (
            <span
              key={i}
              className="flex-shrink-0 w-14 text-center text-[10px] font-mono text-white/30"
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      {/* Circular visualization (when in circular mode) */}
      {mode === "circular" && (
        <div className="flex justify-center my-6">
          <svg width="220" height="220" viewBox="0 0 220 220">
            {queue.map((val, i) => {
              const angle = (i / capacity) * 2 * Math.PI - Math.PI / 2;
              const cx = 110 + 80 * Math.cos(angle);
              const cy = 110 + 80 * Math.sin(angle);
              const isFrontCell = i === front && size > 0;
              const isRearCell = i === rear && size > 0;
              const hasValue = val !== null;

              return (
                <g key={i}>
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={20}
                    fill={
                      isFrontCell
                        ? "rgba(16,185,129,0.15)"
                        : isRearCell
                        ? "rgba(212,175,55,0.15)"
                        : hasValue
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.02)"
                    }
                    stroke={
                      isFrontCell
                        ? "rgba(16,185,129,0.5)"
                        : isRearCell
                        ? "rgba(212,175,55,0.5)"
                        : hasValue
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.05)"
                    }
                    strokeWidth={1.5}
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={hasValue ? "white" : "rgba(255,255,255,0.15)"}
                    fontSize={12}
                    fontFamily="monospace"
                  >
                    {hasValue ? val : "—"}
                  </text>
                  {/* Index */}
                  <text
                    x={110 + 105 * Math.cos(angle)}
                    y={110 + 105 * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="rgba(255,255,255,0.25)"
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    {i}
                  </text>
                  {/* FRONT/REAR label */}
                  {isFrontCell && (
                    <text
                      x={110 + 55 * Math.cos(angle)}
                      y={110 + 55 * Math.sin(angle)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="rgba(16,185,129,0.8)"
                      fontSize={8}
                      fontFamily="monospace"
                    >
                      F
                    </text>
                  )}
                  {isRearCell && !isFrontCell && (
                    <text
                      x={110 + 55 * Math.cos(angle)}
                      y={110 + 55 * Math.sin(angle)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="rgba(212,175,55,0.8)"
                      fontSize={8}
                      fontFamily="monospace"
                    >
                      R
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Modulo explanation for circular */}
      {mode === "circular" && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 mb-4">
          <p className="text-xs font-mono text-primary mb-1">
            Circular queue uses modulo to wrap around:
          </p>
          <p className="text-xs font-mono text-white/70">
            next_rear = (rear + 1) % {capacity} ={" "}
            <span className="text-primary">
              ({rear} + 1) % {capacity} = {(rear + 1) % capacity}
            </span>
          </p>
          <p className="text-xs font-mono text-white/70">
            next_front = (front + 1) % {capacity} ={" "}
            <span className="text-primary">
              ({front} + 1) % {capacity} = {(front + 1) % capacity}
            </span>
          </p>
        </div>
      )}

      {/* Last operation */}
      <AnimatePresence>
        {lastOp && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-2 rounded-lg text-xs font-mono ${
              lastOp.type === "enqueue"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {lastOp.type === "enqueue"
              ? `Enqueued ${lastOp.value} at rear → O(1)`
              : `Dequeued ${lastOp.value} from front → O(1)`}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
