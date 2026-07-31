"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { patterns, type Pattern } from "@/lib/patterns/patternDefinitions";
import {
  ArrowLeftRight,
  Maximize2,
  Zap,
  GitMerge,
  RotateCw,
  Repeat,
  GitBranch,
  GitFork,
  Layers,
  Grid,
  Search,
  Trophy,
  Workflow,
  Sparkles,
  HelpCircle,
  Check
} from "lucide-react";

type PatternProgress = { status: string; problemsSolved: number };
type NodePosition = { x: number; y: number };

// Positions are deliberately stable so the graph is readable on every render.
const POSITIONS: Record<string, NodePosition> = {
  "two-pointers": { x: 115, y: 90 },
  "sliding-window": { x: 300, y: 90 },
  "fast-slow-pointers": { x: 485, y: 90 },
  "merge-intervals": { x: 670, y: 90 },
  "cyclic-sort": { x: 115, y: 260 },
  "linked-list-reversal": { x: 300, y: 260 },
  "tree-bfs": { x: 485, y: 260 },
  "tree-dfs": { x: 670, y: 260 },
  "two-heaps": { x: 115, y: 430 },
  "subsets": { x: 300, y: 430 },
  "modified-binary-search": { x: 485, y: 430 },
  "top-k-elements": { x: 670, y: 430 },
  "k-way-merge": { x: 210, y: 600 },
  "topological-sort": { x: 420, y: 600 },
  "dp-fibonacci": { x: 630, y: 600 },
};

const categoryColors: Record<Pattern["category"], string> = {
  pointers: "#2563eb",
  sorting: "#7c3aed",
  trees: "#059669",
  search: "#0891b2",
  advanced: "#d97706",
};

const patternIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "two-pointers": ArrowLeftRight,
  "sliding-window": Maximize2,
  "fast-slow-pointers": Zap,
  "merge-intervals": GitMerge,
  "cyclic-sort": RotateCw,
  "linked-list-reversal": Repeat,
  "tree-bfs": GitBranch,
  "tree-dfs": GitFork,
  "two-heaps": Layers,
  "subsets": Grid,
  "modified-binary-search": Search,
  "top-k-elements": Trophy,
  "k-way-merge": GitMerge,
  "topological-sort": Workflow,
  "dp-fibonacci": Sparkles,
};

function nodeState(pattern: Pattern, progress: Record<string, PatternProgress>) {
  const item = progress[pattern.id];
  if (item?.status === "completed") return "mastered" as const;
  if (item?.status === "in-progress" || item?.status === "available" || (item?.problemsSolved ?? 0) > 0) return "progress" as const;
  return pattern.id === "two-pointers" ? "progress" as const : "locked" as const;
}

function shorten(label: string) {
  return label.length > 19 ? `${label.slice(0, 17)}…` : label;
}

export default function PatternTree({ progress }: { progress: Record<string, PatternProgress> }) {
  const [hoveredNode, setHoveredNode] = useState<{
    pattern: Pattern;
    x: number;
    y: number;
    solved: number;
    total: number;
    masteryPct: number;
  } | null>(null);

  const known = new Set(patterns.map((pattern) => pattern.id));
  const nodes = patterns.filter((pattern) => POSITIONS[pattern.id]);
  const connections = nodes.flatMap((pattern) =>
    pattern.relatedPatterns
      .filter((related) => known.has(related) && POSITIONS[related])
      .map((related) => ({ from: pattern.id, to: related }))
  );

  return (
    <section className="card-shiny p-4 mb-6 relative" aria-label="Pattern learning graph">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Pattern learning tree</h2>
          <p className="text-xs text-muted-foreground mt-1">Follow the connections from fundamentals to interview patterns.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground" aria-label="Pattern status legend">
          <span><i className="inline-block w-2 h-2 rounded-full bg-primary mr-1" />Learning</span>
          <span><i className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" />Mastered</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg bg-background/30 border border-border relative">
        <svg viewBox="0 0 800 690" className="w-full min-w-[700px] h-auto" role="img" aria-label="Connected graph of DSA patterns">
          <defs>
            <filter id="pattern-tree-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {connections.map((connection, index) => {
            const from = POSITIONS[connection.from];
            const to = POSITIONS[connection.to];
            return (
              <motion.line
                key={`${connection.from}-${connection.to}-${index}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#334155"
                strokeWidth="2"
                strokeOpacity="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: index * 0.03 }}
              />
            );
          })}

          {nodes.map((pattern, index) => {
            const position = POSITIONS[pattern.id];
            const state = nodeState(pattern, progress);
            const mastered = state === "mastered";
            const locked = state === "locked";
            const fill = locked ? "#1e293b" : mastered ? "#b7791f" : categoryColors[pattern.category];
            const IconComponent = patternIcons[pattern.id] || HelpCircle;

            const itemProgress = progress[pattern.id];
            const solved = itemProgress?.problemsSolved ?? 0;
            const total = 5;
            const masteryPct = mastered ? 100 : Math.min(100, Math.round((solved / total) * 100));

            return (
              <motion.a
                key={pattern.id}
                href={`/dashboard/patterns/${pattern.id}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={
                  mastered
                    ? {
                        opacity: 1,
                        scale: [1, 1.03, 1],
                        transition: {
                          scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                          opacity: { duration: 0.3 },
                        },
                      }
                    : { opacity: locked ? 0.42 : 1, scale: 1 }
                }
                whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 10px #F5A623)" }}
                onMouseEnter={() =>
                  setHoveredNode({
                    pattern,
                    x: position.x,
                    y: position.y,
                    solved,
                    total,
                    masteryPct,
                  })
                }
                onMouseLeave={() => setHoveredNode(null)}
                style={{ transformBox: "fill-box", transformOrigin: "center", cursor: "pointer" }}
                aria-label={`${pattern.name}, ${state}`}
              >
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={mastered ? 42 : 38}
                  fill={fill}
                  fillOpacity={locked ? 0.3 : 0.9}
                  stroke={mastered ? "#f5a623" : locked ? "#475569" : "#94a3b8"}
                  strokeWidth={mastered ? 3 : 2}
                  strokeDasharray={locked ? "5 4" : undefined}
                  filter={mastered ? "url(#pattern-tree-glow)" : undefined}
                />
                
                {/* Lucide Icon via foreignObject */}
                <foreignObject
                  x={position.x - 12}
                  y={position.y - 28}
                  width={24}
                  height={24}
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <IconComponent size={16} className={locked ? "text-slate-400" : "text-white"} />
                  </div>
                </foreignObject>

                <text
                  x={position.x}
                  y={position.y + 4}
                  textAnchor="middle"
                  fill={locked ? "#64748b" : "#f8fafc"}
                  fontSize="11"
                  fontWeight="600"
                >
                  {shorten(pattern.name)}
                </text>
                <text
                  x={position.x}
                  y={position.y + 18}
                  textAnchor="middle"
                  fill={locked ? "#64748b" : "#cbd5e1"}
                  fontSize="9"
                >
                  {mastered ? "MASTERED" : locked ? "LOCKED" : "LEARNING"}
                </text>
                {mastered && (
                  <text x={position.x + 26} y={position.y - 25} fontSize="16" fill="#f5a623" fontWeight="bold">
                    ✓
                  </text>
                )}
              </motion.a>
            );
          })}
        </svg>

        {/* Floating Tooltip on Hover */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                left: `${(hoveredNode.x / 800) * 100}%`,
                top: `${(hoveredNode.y / 690) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
              className="pointer-events-none z-20 bg-slate-900/95 border border-amber-500/40 text-white rounded-lg p-3 shadow-xl backdrop-blur-md min-w-[160px]"
            >
              <p className="text-xs font-bold text-amber-400 mb-1">{hoveredNode.pattern.name}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Mastery:</span>
                <span className="font-semibold text-amber-300">{hoveredNode.masteryPct}%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 mt-0.5">
                <span>Solved:</span>
                <span className="font-medium text-white">{hoveredNode.solved} / {hoveredNode.total}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
