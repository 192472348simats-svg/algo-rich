"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";

export interface TreeNodeData {
  value: number;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
}

type TraversalType = "inorder" | "preorder" | "postorder" | "bfs";

interface TreeInMemoryProps {
  root: TreeNodeData;
  showMemoryTable?: boolean;
  showLogicalView?: boolean;
  highlightNode?: number;
  traversalType?: TraversalType;
  className?: string;
}

interface FlatNode {
  value: number;
  address: string;
  leftAddr: string | null;
  rightAddr: string | null;
  depth: number;
  x: number;
  y: number;
}

// Generate deterministic scattered addresses
function addrForIndex(i: number): string {
  const addrs = [0x1000, 0x2000, 0x3000, 0x4000, 0x5000, 0x6000, 0x7000, 0x8000, 0x1800, 0x2800, 0x3800, 0x4800, 0x5800, 0x6800, 0x7800];
  return "0x" + (addrs[i % addrs.length]).toString(16).toUpperCase().padStart(4, "0");
}

// Flatten tree to array with positions
function flattenTree(
  node: TreeNodeData | null | undefined,
  depth: number,
  x: number,
  spreadMultiplier: number,
  idx: { current: number },
  result: FlatNode[]
): void {
  if (!node) return;
  const i = idx.current++;
  const flat: FlatNode = {
    value: node.value,
    address: addrForIndex(i),
    leftAddr: null,
    rightAddr: null,
    depth,
    x,
    y: depth * 80 + 30,
  };
  result.push(flat);

  const leftIdx = idx.current;
  if (node.left) {
    flattenTree(node.left, depth + 1, x - spreadMultiplier / (depth + 1), spreadMultiplier, idx, result);
    flat.leftAddr = addrForIndex(leftIdx);
  }

  const rightIdx = idx.current;
  if (node.right) {
    flattenTree(node.right, depth + 1, x + spreadMultiplier / (depth + 1), spreadMultiplier, idx, result);
    flat.rightAddr = addrForIndex(rightIdx);
  }
}

// Traversal orders
function getTraversalOrder(root: TreeNodeData | null | undefined, type: TraversalType): number[] {
  const result: number[] = [];
  function inorder(n: TreeNodeData | null | undefined) {
    if (!n) return;
    inorder(n.left);
    result.push(n.value);
    inorder(n.right);
  }
  function preorder(n: TreeNodeData | null | undefined) {
    if (!n) return;
    result.push(n.value);
    preorder(n.left);
    preorder(n.right);
  }
  function postorder(n: TreeNodeData | null | undefined) {
    if (!n) return;
    postorder(n.left);
    postorder(n.right);
    result.push(n.value);
  }
  function bfs(root: TreeNodeData) {
    const queue = [root];
    while (queue.length) {
      const n = queue.shift()!;
      result.push(n.value);
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
  }

  if (!root) return result;
  if (type === "inorder") inorder(root);
  else if (type === "preorder") preorder(root);
  else if (type === "postorder") postorder(root);
  else bfs(root);
  return result;
}

const DEFAULT_TREE: TreeNodeData = {
  value: 10,
  left: {
    value: 5,
    left: { value: 3 },
    right: { value: 7 },
  },
  right: {
    value: 15,
    right: { value: 20 },
  },
};

export default function TreeInMemory({
  root = DEFAULT_TREE,
  showMemoryTable = true,
  showLogicalView = true,
  highlightNode,
  traversalType = "inorder",
  className = "",
}: TreeInMemoryProps) {
  const [activeView, setActiveView] = useState<"logical" | "memory" | "traversal">(
    showLogicalView ? "logical" : "memory"
  );
  const [selectedTraversal, setSelectedTraversal] = useState<TraversalType>(traversalType);
  const [traversalStep, setTraversalStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const flatNodes = useMemo(() => {
    const result: FlatNode[] = [];
    flattenTree(root, 0, 200, 120, { current: 0 }, result);
    return result;
  }, [root]);

  const traversalOrder = useMemo(
    () => getTraversalOrder(root, selectedTraversal),
    [root, selectedTraversal]
  );

  const animateTraversal = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTraversalStep(-1);
    for (let i = 0; i < traversalOrder.length; i++) {
      setTraversalStep(i);
      await new Promise((r) => setTimeout(r, 800));
    }
    setIsAnimating(false);
  }, [isAnimating, traversalOrder]);

  const svgWidth = 400;
  const svgHeight = Math.max(280, (flatNodes.reduce((m, n) => Math.max(m, n.depth), 0) + 1) * 80 + 60);

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Binary Tree in Memory
      </h3>

      {/* View tabs */}
      <div className="flex gap-1 mb-4">
        {showLogicalView && (
          <button
            onClick={() => setActiveView("logical")}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeView === "logical"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40"
            }`}
          >
            Logical View
          </button>
        )}
        {showMemoryTable && (
          <button
            onClick={() => setActiveView("memory")}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeView === "memory"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40"
            }`}
          >
            Memory Table
          </button>
        )}
        <button
          onClick={() => setActiveView("traversal")}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            activeView === "traversal"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-white/5 text-white/40"
          }`}
        >
          Traversal
        </button>
      </div>

      {/* === Logical View === */}
      {activeView === "logical" && (
        <div className="flex justify-center overflow-x-auto">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <defs>
              <filter id="tree-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {flatNodes.map((node) => {
              const children = flatNodes.filter(
                (c) =>
                  c.address === node.leftAddr || c.address === node.rightAddr
              );
              return children.map((child) => (
                <motion.line
                  key={`${node.address}-${child.address}`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke="hsl(43 96% 56%,0.3)"
                  strokeWidth={1.5}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ));
            })}

            {/* Nodes */}
            {flatNodes.map((node, i) => {
              const isHighlighted = highlightNode === node.value;
              return (
                <motion.g
                  key={node.address}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill={
                      isHighlighted
                        ? "rgba(212,175,55,0.2)"
                        : "rgba(10,22,40,0.8)"
                    }
                    stroke={
                      isHighlighted
                        ? "rgba(212,175,55,0.6)"
                        : "hsl(43 96% 56%,0.4)"
                    }
                    strokeWidth={1.5}
                    filter={isHighlighted ? "url(#tree-glow)" : undefined}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={13}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.value}
                  </text>
                  {/* Address label */}
                  <text
                    x={node.x}
                    y={node.y + 32}
                    textAnchor="middle"
                    fill="hsl(43 96% 56%,0.4)"
                    fontSize={8}
                    fontFamily="monospace"
                  >
                    {node.address}
                  </text>
                  {/* Root label */}
                  {i === 0 && (
                    <text
                      x={node.x}
                      y={node.y - 30}
                      textAnchor="middle"
                      fill="rgba(212,175,55,0.7)"
                      fontSize={9}
                      fontFamily="monospace"
                    >
                      ROOT
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>
      )}

      {/* === Memory Table === */}
      {activeView === "memory" && (
        <div className="space-y-1">
          <p className="text-xs text-white/50 mb-3">
            Each node is scattered in memory. They&apos;re connected only by pointers:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-white/40 border-b border-white/[0.06]">
                  <th className="text-left p-2">Address</th>
                  <th className="text-center p-2">Value</th>
                  <th className="text-center p-2">Left Ptr</th>
                  <th className="text-center p-2">Right Ptr</th>
                  <th className="text-right p-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {flatNodes.map((node, i) => {
                  const isHighlighted = highlightNode === node.value;
                  return (
                    <motion.tr
                      key={node.address}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`border-b border-white/[0.04] ${
                        isHighlighted ? "bg-primary/10" : ""
                      }`}
                    >
                      <td className="p-2 text-primary">{node.address}</td>
                      <td className="p-2 text-center text-white font-bold">
                        {node.value}
                      </td>
                      <td className="p-2 text-center">
                        {node.leftAddr ? (
                          <span className="text-primary/70">{node.leftAddr}</span>
                        ) : (
                          <span className="text-white/20">null</span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {node.rightAddr ? (
                          <span className="text-primary/70">{node.rightAddr}</span>
                        ) : (
                          <span className="text-white/20">null</span>
                        )}
                      </td>
                      <td className="p-2 text-right text-white/30">
                        {i === 0 ? "root" : node.leftAddr === null && node.rightAddr === null ? "leaf" : ""}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-xs text-white/50">
              Each node stores: <span className="text-white">value</span> +{" "}
              <span className="text-primary">left pointer</span> +{" "}
              <span className="text-primary">right pointer</span> = {">"}12 bytes each.
              Nodes can be anywhere in memory!
            </p>
          </div>
        </div>
      )}

      {/* === Traversal View === */}
      {activeView === "traversal" && (
        <div className="space-y-4">
          {/* Traversal type selector */}
          <div className="flex gap-1 flex-wrap">
            {(["inorder", "preorder", "postorder", "bfs"] as TraversalType[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTraversal(t);
                    setTraversalStep(-1);
                  }}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedTraversal === t
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {t === "bfs" ? "BFS (Level Order)" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              )
            )}
            <button
              onClick={animateTraversal}
              disabled={isAnimating}
              className="ml-auto px-4 py-1 text-xs rounded bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors"
            >
              {isAnimating ? "Running…" : "▶ Animate"}
            </button>
          </div>

          {/* Tree with traversal highlighting */}
          <div className="flex justify-center overflow-x-auto">
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Edges */}
              {flatNodes.map((node) => {
                const children = flatNodes.filter(
                  (c) => c.address === node.leftAddr || c.address === node.rightAddr
                );
                return children.map((child) => (
                  <line
                    key={`${node.address}-${child.address}`}
                    x1={node.x}
                    y1={node.y}
                    x2={child.x}
                    y2={child.y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                  />
                ));
              })}

              {/* Nodes — with traversal state */}
              {flatNodes.map((node) => {
                const orderIdx = traversalOrder.indexOf(node.value);
                const isVisited = traversalStep >= 0 && orderIdx >= 0 && orderIdx <= traversalStep;
                const isCurrent = traversalStep >= 0 && orderIdx === traversalStep;

                return (
                  <g key={node.address}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={22}
                      fill={
                        isCurrent
                          ? "rgba(212,175,55,0.3)"
                          : isVisited
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(10,22,40,0.8)"
                      }
                      stroke={
                        isCurrent
                          ? "rgba(212,175,55,0.7)"
                          : isVisited
                          ? "rgba(16,185,129,0.5)"
                          : "rgba(255,255,255,0.15)"
                      }
                      strokeWidth={isCurrent ? 2 : 1.5}
                      animate={{
                        scale: isCurrent ? 1.15 : 1,
                      }}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={13}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.value}
                    </text>
                    {isVisited && (
                      <text
                        x={node.x}
                        y={node.y - 30}
                        textAnchor="middle"
                        fill="rgba(16,185,129,0.7)"
                        fontSize={9}
                        fontFamily="monospace"
                      >
                        #{orderIdx + 1}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Traversal output */}
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-xs font-mono text-white/40 mb-1">
              {selectedTraversal} order:
            </p>
            <div className="flex gap-1 flex-wrap">
              {traversalOrder.map((val, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-xs font-mono ${
                    traversalStep >= 0 && i === traversalStep
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : traversalStep >= 0 && i < traversalStep
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
