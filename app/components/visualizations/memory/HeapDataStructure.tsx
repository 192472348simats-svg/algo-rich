"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";

interface HeapDataStructureProps {
  initialValues?: number[];
  type?: "min" | "max";
  className?: string;
}

// Heap helpers
function parentIdx(i: number) { return Math.floor((i - 1) / 2); }
function leftChild(i: number) { return 2 * i + 1; }
function rightChild(i: number) { return 2 * i + 2; }

function heapifyUp(arr: number[], i: number, type: "min" | "max"): number[] {
  const heap = [...arr];
  while (i > 0) {
    const p = parentIdx(i);
    const shouldSwap = type === "min" ? heap[i] < heap[p] : heap[i] > heap[p];
    if (shouldSwap) {
      [heap[i], heap[p]] = [heap[p], heap[i]];
      i = p;
    } else break;
  }
  return heap;
}

function heapifyDown(arr: number[], i: number, type: "min" | "max"): number[] {
  const heap = [...arr];
  const n = heap.length;
  while (true) {
    let target = i;
    const l = leftChild(i);
    const r = rightChild(i);
    if (type === "min") {
      if (l < n && heap[l] < heap[target]) target = l;
      if (r < n && heap[r] < heap[target]) target = r;
    } else {
      if (l < n && heap[l] > heap[target]) target = l;
      if (r < n && heap[r] > heap[target]) target = r;
    }
    if (target !== i) {
      [heap[i], heap[target]] = [heap[target], heap[i]];
      i = target;
    } else break;
  }
  return heap;
}

export default function HeapDataStructure({
  initialValues = [1, 3, 2, 5, 4, 6],
  type = "min",
  className = "",
}: HeapDataStructureProps) {
  const [heap, setHeap] = useState<number[]>(initialValues);
  const [insertValue, setInsertValue] = useState("");
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [lastOp, setLastOp] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"both" | "array" | "tree">("both");

  const insert = useCallback(() => {
    const val = parseInt(insertValue);
    if (isNaN(val)) return;
    const newHeap = [...heap, val];
    const result = heapifyUp(newHeap, newHeap.length - 1, type);
    setHeap(result);
    setInsertValue("");
    setHighlightIndices([result.indexOf(val)]);
    setLastOp(`Inserted ${val}, bubbled up to index ${result.indexOf(val)}`);
    setTimeout(() => setHighlightIndices([]), 2000);
  }, [insertValue, heap, type]);

  const extractRoot = useCallback(() => {
    if (heap.length === 0) return;
    const removed = heap[0];
    if (heap.length === 1) {
      setHeap([]);
      setLastOp(`Extracted root: ${removed}`);
      return;
    }
    const newHeap = [heap[heap.length - 1], ...heap.slice(1, -1)];
    const result = heapifyDown(newHeap, 0, type);
    setHeap(result);
    setHighlightIndices([0]);
    setLastOp(`Extracted ${removed}, moved last to root, bubbled down`);
    setTimeout(() => setHighlightIndices([]), 2000);
  }, [heap, type]);

  // SVG tree dimensions
  const treeWidth = 360;
  const maxDepth = heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0;
  const treeHeight = maxDepth * 70 + 60;

  // Compute node positions
  const nodePositions = useMemo(() => {
    return heap.map((_, i) => {
      const depth = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, depth) - 1);
      const nodesInLevel = Math.pow(2, depth);
      const levelWidth = treeWidth - 40;
      const gap = levelWidth / nodesInLevel;
      return {
        x: 20 + gap * posInLevel + gap / 2,
        y: depth * 70 + 35,
      };
    });
  }, [heap, treeWidth]);

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {type === "min" ? "Min" : "Max"} Heap — Array = Tree!
        </h3>
        <span className="text-[10px] font-mono text-white/30">
          Priority Queue
        </span>
      </div>

      {/* Key insight */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4">
        <p className="text-xs text-primary font-mono">
          💡 A heap is stored as a plain <strong>array</strong>, but we visualize it as a tree!
        </p>
        <p className="text-[10px] text-white/50 font-mono mt-1">
          Left child = 2×i + 1 &nbsp;|&nbsp; Right child = 2×i + 2 &nbsp;|&nbsp; Parent = ⌊(i-1)/2⌋
        </p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 mb-4">
        {(["both", "array", "tree"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeView === v
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40"
            }`}
          >
            {v === "both" ? "Both" : v === "array" ? "Array View" : "Tree View"}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input
          type="number"
          value={insertValue}
          onChange={(e) => setInsertValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && insert()}
          placeholder="Value"
          className="w-20 px-2 py-1.5 text-sm font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:outline-none"
        />
        <button
          onClick={insert}
          className="px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
        >
          Insert
        </button>
        <button
          onClick={extractRoot}
          disabled={heap.length === 0}
          className="px-3 py-1.5 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-30 transition-colors"
        >
          Extract {type === "min" ? "Min" : "Max"}
        </button>
        <button
          onClick={() => {
            setHeap(initialValues);
            setLastOp(null);
            setHighlightIndices([]);
          }}
          className="px-3 py-1.5 text-xs rounded bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className={`${activeView === "both" ? "grid md:grid-cols-2 gap-4" : ""}`}>
        {/* Array view */}
        {(activeView === "both" || activeView === "array") && (
          <div>
            <span className="text-xs font-mono text-white/40 mb-2 block">
              Array (actual memory):
            </span>
            <div className="flex gap-0.5 flex-wrap">
              {heap.map((val, i) => (
                <motion.div
                  key={`${i}-${val}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg border font-mono text-xs transition-colors ${
                    highlightIndices.includes(i)
                      ? "bg-primary/20 border-primary/50 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                      : i === 0
                      ? "bg-primary/10 border-primary/30"
                      : "bg-white/[0.04] border-white/[0.08]"
                  }`}
                >
                  <span className="text-white font-bold">{val}</span>
                  <span className="text-white/30 text-[8px]">[{i}]</span>
                </motion.div>
              ))}
              {heap.length === 0 && (
                <span className="text-xs text-white/20 py-4">Empty heap</span>
              )}
            </div>

            {/* Formula display */}
            {highlightIndices.length > 0 && highlightIndices[0] > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-[10px] font-mono text-white/40"
              >
                parent[{highlightIndices[0]}] = ⌊({highlightIndices[0]}-1)/2⌋ = {parentIdx(highlightIndices[0])}
              </motion.div>
            )}
          </div>
        )}

        {/* Tree view */}
        {(activeView === "both" || activeView === "tree") && heap.length > 0 && (
          <div className="flex justify-center overflow-x-auto">
            <svg
              width={treeWidth}
              height={treeHeight}
              viewBox={`0 0 ${treeWidth} ${treeHeight}`}
            >
              {/* Edges */}
              {heap.map((_, i) => {
                if (i === 0) return null;
                const p = parentIdx(i);
                const from = nodePositions[p];
                const to = nodePositions[i];
                if (!from || !to) return null;
                return (
                  <line
                    key={`edge-${i}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Nodes */}
              {heap.map((val, i) => {
                const pos = nodePositions[i];
                if (!pos) return null;
                const isHighlighted = highlightIndices.includes(i);
                const isRoot = i === 0;

                return (
                  <motion.g
                    key={`node-${i}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: isHighlighted ? 1.15 : 1,
                    }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={18}
                      fill={
                        isHighlighted
                          ? "rgba(212,175,55,0.25)"
                          : isRoot
                          ? "hsl(43 96% 56%,0.15)"
                          : "rgba(10,22,40,0.8)"
                      }
                      stroke={
                        isHighlighted
                          ? "rgba(212,175,55,0.6)"
                          : isRoot
                          ? "hsl(43 96% 56%,0.4)"
                          : "rgba(255,255,255,0.15)"
                      }
                      strokeWidth={1.5}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={12}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 26}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.2)"
                      fontSize={8}
                      fontFamily="monospace"
                    >
                      [{i}]
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Last operation */}
      <AnimatePresence>
        {lastOp && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/60"
          >
            {lastOp}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complexity */}
      <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
          <div>
            <p className="text-white/30 mb-1">Insert</p>
            <p className="text-emerald-400">O(log n)</p>
            <p className="text-white/20 text-[10px]">bubble up</p>
          </div>
          <div>
            <p className="text-white/30 mb-1">Extract {type === "min" ? "Min" : "Max"}</p>
            <p className="text-emerald-400">O(log n)</p>
            <p className="text-white/20 text-[10px]">bubble down</p>
          </div>
          <div>
            <p className="text-white/30 mb-1">Peek</p>
            <p className="text-emerald-400">O(1)</p>
            <p className="text-white/20 text-[10px]">arr[0]</p>
          </div>
        </div>
      </div>

    </div>
  );
}
