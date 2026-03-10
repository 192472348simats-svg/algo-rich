"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";

interface Edge {
  from: number;
  to: number;
  weight?: number;
}

interface GraphInMemoryProps {
  vertices?: number[];
  edges?: Edge[];
  directed?: boolean;
  className?: string;
}

type RepMode = "adjacency_matrix" | "adjacency_list" | "edge_list";

const DEFAULT_VERTICES = [0, 1, 2, 3, 4];
const DEFAULT_EDGES: Edge[] = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 1 },
  { from: 1, to: 2, weight: 2 },
  { from: 1, to: 3, weight: 5 },
  { from: 2, to: 3, weight: 8 },
  { from: 3, to: 4, weight: 3 },
];

export default function GraphInMemory({
  vertices = DEFAULT_VERTICES,
  edges = DEFAULT_EDGES,
  directed = false,
  className = "",
}: GraphInMemoryProps) {
  const [repMode, setRepMode] = useState<RepMode>("adjacency_list");
  const [highlightVertex, setHighlightVertex] = useState<number | null>(null);
  const [highlightEdge, setHighlightEdge] = useState<Edge | null>(null);
  const n = vertices.length;

  // Build adjacency matrix
  const adjMatrix = useMemo(() => {
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    edges.forEach(({ from, to, weight }) => {
      matrix[from][to] = weight ?? 1;
      if (!directed) matrix[to][from] = weight ?? 1;
    });
    return matrix;
  }, [edges, n, directed]);

  // Build adjacency list
  const adjList = useMemo(() => {
    const list: Record<number, { to: number; weight?: number }[]> = {};
    vertices.forEach((v) => (list[v] = []));
    edges.forEach(({ from, to, weight }) => {
      list[from].push({ to, weight });
      if (!directed) list[to].push({ to: from, weight });
    });
    return list;
  }, [vertices, edges, directed]);

  // SVG positions for graph drawing
  const nodePositions = useMemo(() => {
    const cx = 140, cy = 110, radius = 80;
    return vertices.map((_, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });
  }, [vertices, n]);

  // Memory analysis
  const matrixMemory = n * n;
  const listMemory = edges.length * (directed ? 1 : 2) + n;
  const edgeListMemory = edges.length;

  const isEdgeHighlighted = useCallback(
    (e: Edge) =>
      highlightEdge &&
      ((e.from === highlightEdge.from && e.to === highlightEdge.to) ||
        (!directed && e.from === highlightEdge.to && e.to === highlightEdge.from)),
    [highlightEdge, directed]
  );

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Graph Memory Representations</h3>
        <span className="text-[10px] font-mono text-white/30">{directed ? "Directed" : "Undirected"}</span>
      </div>

      {/* Representation selector */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {([
          { key: "adjacency_list" as RepMode, label: "Adjacency List" },
          { key: "adjacency_matrix" as RepMode, label: "Adjacency Matrix" },
          { key: "edge_list" as RepMode, label: "Edge List" },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setRepMode(key)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              repMode === key
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Graph SVG */}
        <div className="flex justify-center">
          <svg width={280} height={220} viewBox="0 0 280 220">
            <defs>
              <filter id="graphGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {directed && (
                <marker id="arrowhead" viewBox="0 0 10 10" refX="22" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(43 96% 56%,0.5)" />
                </marker>
              )}
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const from = nodePositions[edge.from];
              const to = nodePositions[edge.to];
              if (!from || !to) return null;
              const highlighted = isEdgeHighlighted(edge);
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;

              return (
                <g key={`e-${i}`}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={highlighted ? "hsl(43 96% 56%,0.8)" : "rgba(255,255,255,0.12)"}
                    strokeWidth={highlighted ? 2 : 1}
                    markerEnd={directed ? "url(#arrowhead)" : undefined}
                    filter={highlighted ? "url(#graphGlow)" : undefined}
                  />
                  {edge.weight !== undefined && (
                    <text x={midX} y={midY - 6} textAnchor="middle"
                      fill={highlighted ? "hsl(43 96% 56%,0.9)" : "rgba(255,255,255,0.25)"}
                      fontSize={9} fontFamily="monospace">
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Vertices */}
            {vertices.map((v, i) => {
              const pos = nodePositions[i];
              if (!pos) return null;
              const isHL = highlightVertex === v;
              return (
                <g
                  key={`v-${v}`}
                  onMouseEnter={() => setHighlightVertex(v)}
                  onMouseLeave={() => setHighlightVertex(null)}
                  style={{ cursor: "pointer" }}
                >
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={16}
                    fill={isHL ? "rgba(212,175,55,0.25)" : "rgba(10,22,40,0.85)"}
                    stroke={isHL ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.2)"}
                    strokeWidth={1.5}
                    animate={{ scale: isHL ? 1.15 : 1 }}
                  />
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                    fill="white" fontSize={12} fontFamily="monospace" fontWeight="bold">
                    {v}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Representation view */}
        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            {repMode === "adjacency_matrix" && (
              <motion.div
                key="matrix"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <span className="text-xs font-mono text-white/40 mb-2 block">
                  Adjacency Matrix ({n}×{n} = {matrixMemory} cells):
                </span>
                <div className="overflow-x-auto">
                  <table className="font-mono text-xs">
                    <thead>
                      <tr>
                        <th className="px-1.5 py-0.5 text-white/20"></th>
                        {vertices.map((v) => (
                          <th key={v} className="px-1.5 py-0.5 text-primary/60">{v}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vertices.map((row, ri) => (
                        <tr key={row}>
                          <td className="px-1.5 py-0.5 text-primary/60">{row}</td>
                          {vertices.map((_, ci) => {
                            const val = adjMatrix[ri][ci];
                            const isHL = highlightVertex === row || highlightVertex === vertices[ci];
                            return (
                              <td
                                key={ci}
                                onMouseEnter={() => {
                                  if (val > 0) setHighlightEdge({ from: row, to: vertices[ci] });
                                }}
                                onMouseLeave={() => setHighlightEdge(null)}
                                className={`px-1.5 py-0.5 text-center rounded cursor-pointer transition-colors ${
                                  val > 0 && isHL
                                    ? "bg-primary/20 text-primary"
                                    : val > 0
                                    ? "text-white/80"
                                    : "text-white/10"
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-white/30 font-mono mt-2">
                  Space: O(V²) — wastes memory for sparse graphs
                </p>
              </motion.div>
            )}

            {repMode === "adjacency_list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <span className="text-xs font-mono text-white/40 mb-2 block">
                  Adjacency List:
                </span>
                <div className="space-y-1">
                  {vertices.map((v) => {
                    const neighbors = adjList[v] || [];
                    const isHL = highlightVertex === v;
                    return (
                      <motion.div
                        key={v}
                        onMouseEnter={() => setHighlightVertex(v)}
                        onMouseLeave={() => setHighlightVertex(null)}
                        className={`flex items-center gap-1 py-1 px-2 rounded text-xs font-mono transition-colors cursor-pointer ${
                          isHL ? "bg-primary/10" : "bg-white/[0.02]"
                        }`}
                      >
                        <span className={`font-bold ${isHL ? "text-primary" : "text-primary"}`}>
                          {v}:
                        </span>
                        <span className="text-white/30">→</span>
                        <div className="flex gap-0.5 flex-wrap">
                          {neighbors.map((nb, ni) => (
                            <span
                              key={ni}
                              onMouseEnter={() => setHighlightEdge({ from: v, to: nb.to })}
                              onMouseLeave={() => setHighlightEdge(null)}
                              className={`px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] ${
                                isHL ? "text-white" : "text-white/60"
                              }`}
                            >
                              {nb.to}
                              {nb.weight !== undefined && (
                                <span className="text-white/20">(w{nb.weight})</span>
                              )}
                            </span>
                          ))}
                          {neighbors.length === 0 && <span className="text-white/15">∅</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-white/30 font-mono mt-2">
                  Space: O(V + E) — efficient for sparse graphs
                </p>
              </motion.div>
            )}

            {repMode === "edge_list" && (
              <motion.div
                key="edge_list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <span className="text-xs font-mono text-white/40 mb-2 block">
                  Edge List ({edges.length} edges):
                </span>
                <div className="space-y-0.5">
                  {edges.map((edge, i) => {
                    const highlighted = isEdgeHighlighted(edge);
                    return (
                      <motion.div
                        key={i}
                        onMouseEnter={() => setHighlightEdge(edge)}
                        onMouseLeave={() => setHighlightEdge(null)}
                        className={`flex items-center gap-2 py-1 px-2 rounded text-xs font-mono cursor-pointer transition-colors ${
                          highlighted ? "bg-primary/10" : "bg-white/[0.02]"
                        }`}
                      >
                        <span className="text-white/20 w-4">{i}.</span>
                        <span className={highlighted ? "text-primary" : "text-white/60"}>
                          ({edge.from}, {edge.to})
                        </span>
                        {edge.weight !== undefined && (
                          <span className="text-white/30">w={edge.weight}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-white/30 font-mono mt-2">
                  Space: O(E) — minimal, great for Kruskal&apos;s MST
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Comparison summary */}
      <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
          <div className={repMode === "adjacency_matrix" ? "text-primary" : "text-white/40"}>
            <p className="mb-1">Matrix</p>
            <p className="text-[10px]">Space: O(V²)</p>
            <p className="text-[10px]">Edge lookup: O(1)</p>
            <p className="text-[10px]">Best: dense</p>
          </div>
          <div className={repMode === "adjacency_list" ? "text-primary" : "text-white/40"}>
            <p className="mb-1">Adj List</p>
            <p className="text-[10px]">Space: O(V+E)</p>
            <p className="text-[10px]">Edge lookup: O(deg)</p>
            <p className="text-[10px]">Best: sparse</p>
          </div>
          <div className={repMode === "edge_list" ? "text-primary" : "text-white/40"}>
            <p className="mb-1">Edge List</p>
            <p className="text-[10px]">Space: O(E)</p>
            <p className="text-[10px]">Edge lookup: O(E)</p>
            <p className="text-[10px]">Best: MST</p>
          </div>
        </div>
      </div>

    </div>
  );
}
