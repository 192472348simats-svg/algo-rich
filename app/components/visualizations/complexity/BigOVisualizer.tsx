"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface BigOVisualizerProps {
  className?: string;
}

interface ComplexityClass {
  label: string;
  fn: (n: number) => number;
  color: string;
  description: string;
  example: string;
}

const COMPLEXITIES: ComplexityClass[] = [
  {
    label: "O(1)",
    fn: () => 1,
    color: "#10b981",
    description: "Constant — doesn't grow",
    example: "Array access, hash lookup",
  },
  {
    label: "O(log n)",
    fn: (n) => Math.max(1, Math.log2(n)),
    color: "#E5A829",
    description: "Logarithmic — halves each step",
    example: "Binary search",
  },
  {
    label: "O(n)",
    fn: (n) => n,
    color: "#d4af37",
    description: "Linear — grows proportionally",
    example: "Linear search, single loop",
  },
  {
    label: "O(n log n)",
    fn: (n) => n * Math.max(1, Math.log2(n)),
    color: "#f59e0b",
    description: "Linearithmic — efficient sorts",
    example: "Merge sort, quick sort",
  },
  {
    label: "O(n²)",
    fn: (n) => n * n,
    color: "#ef4444",
    description: "Quadratic — nested loops",
    example: "Bubble sort, selection sort",
  },
  {
    label: "O(2ⁿ)",
    fn: (n) => Math.pow(2, Math.min(n, 20)),
    color: "#dc2626",
    description: "Exponential — doubles each step",
    example: "Naive Fibonacci, subsets",
  },
];

export default function BigOVisualizer({
  className = "",
}: BigOVisualizerProps) {
  const [n, setN] = useState(10);
  const [selectedComplexities, setSelectedComplexities] = useState<Set<number>>(
    new Set([0, 1, 2, 3, 4])
  );
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"bars" | "graph">("bars");

  const values = useMemo(
    () => COMPLEXITIES.map((c) => c.fn(n)),
    [n]
  );

  const maxVal = useMemo(() => {
    const selected = values.filter((_, i) => selectedComplexities.has(i));
    return Math.max(...selected, 1);
  }, [values, selectedComplexities]);

  const toggleComplexity = (idx: number) => {
    const next = new Set(selectedComplexities);
    if (next.has(idx)) {
      if (next.size > 1) next.delete(idx);
    } else {
      next.add(idx);
    }
    setSelectedComplexities(next);
  };

  // Graph points
  const graphPoints = useMemo(() => {
    const steps = 50;
    const maxN = Math.max(n, 10);
    return COMPLEXITIES.map((c) => {
      const pts: { x: number; y: number }[] = [];
      for (let i = 1; i <= steps; i++) {
        const xVal = (i / steps) * maxN;
        pts.push({ x: xVal, y: c.fn(xVal) });
      }
      return pts;
    });
  }, [n]);

  const graphMaxY = useMemo(() => {
    let m = 1;
    graphPoints.forEach((pts, i) => {
      if (!selectedComplexities.has(i)) return;
      if (i === 5) return; // Skip 2^n for scale
      pts.forEach((p) => {
        if (p.y > m) m = p.y;
      });
    });
    return m;
  }, [graphPoints, selectedComplexities]);

  const graphW = 380, graphH = 200;

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Big-O Complexity Visualizer</h3>
        <div className="flex gap-1">
          {(["bars", "graph"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                viewMode === v
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-white/5 text-white/40"
              }`}
            >
              {v === "bars" ? "Bar Chart" : "Growth Curves"}
            </button>
          ))}
        </div>
      </div>

      {/* N slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-white/40">Input size (n):</span>
          <span className="text-sm font-mono font-bold text-primary">{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={500}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_hsl(43 96% 56%,0.5)]"
        />
        <div className="flex justify-between text-[10px] text-white/20 font-mono">
          <span>1</span>
          <span>100</span>
          <span>250</span>
          <span>500</span>
        </div>
      </div>

      {/* Complexity toggles */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {COMPLEXITIES.map((c, i) => (
          <button
            key={c.label}
            onClick={() => toggleComplexity(i)}
            className={`px-2 py-1 text-xs rounded-full font-mono transition-all ${
              selectedComplexities.has(i)
                ? "border"
                : "bg-white/5 text-white/20 border border-transparent"
            }`}
            style={
              selectedComplexities.has(i)
                ? { backgroundColor: c.color + "20", color: c.color, borderColor: c.color + "50" }
                : undefined
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Visualization */}
      {viewMode === "bars" ? (
        <div className="space-y-1.5">
          {COMPLEXITIES.map((c, i) => {
            if (!selectedComplexities.has(i)) return null;
            const val = values[i];
            const pct = Math.min((val / maxVal) * 100, 100);
            const isHovered = hoveredBar === i;
            return (
              <motion.div
                key={c.label}
                layout
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
                className="group cursor-default"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono w-20" style={{ color: c.color }}>
                    {c.label}
                  </span>
                  <span className="text-[10px] font-mono text-white/30">
                    {val >= 1e6
                      ? `${(val / 1e6).toFixed(1)}M`
                      : val >= 1e3
                      ? `${(val / 1e3).toFixed(1)}K`
                      : Math.round(val)}{" "}
                    ops
                  </span>
                </div>
                <div className="h-6 bg-white/[0.03] rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="h-full rounded-lg relative"
                    style={{
                      background: `linear-gradient(90deg, ${c.color}30, ${c.color}60)`,
                      boxShadow: isHovered ? `0 0 16px ${c.color}40` : "none",
                    }}
                  >
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white whitespace-nowrap"
                      >
                        {c.example}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center overflow-x-auto">
          <svg width={graphW} height={graphH} viewBox={`0 0 ${graphW} ${graphH}`}>
            {/* Axes */}
            <line x1={40} y1={graphH - 30} x2={graphW - 10} y2={graphH - 30} stroke="rgba(255,255,255,0.1)" />
            <line x1={40} y1={10} x2={40} y2={graphH - 30} stroke="rgba(255,255,255,0.1)" />
            <text x={graphW / 2} y={graphH - 8} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="monospace">n</text>
            <text x={12} y={graphH / 2} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="monospace" transform={`rotate(-90, 12, ${graphH / 2})`}>ops</text>

            {/* Curves */}
            {graphPoints.map((pts, i) => {
              if (!selectedComplexities.has(i)) return null;
              const plotMaxY = i === 5 ? graphMaxY * 10 : graphMaxY; // different scale for 2^n
              const maxN = Math.max(n, 10);
              const d = pts
                .map((p, j) => {
                  const x = 40 + ((p.x / maxN) * (graphW - 50));
                  const y = graphH - 30 - Math.min((p.y / plotMaxY) * (graphH - 40), graphH - 40);
                  return `${j === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ");

              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={COMPLEXITIES[i].color}
                  strokeWidth={1.5}
                  opacity={0.7}
                />
              );
            })}

            {/* Legend in graph */}
            {COMPLEXITIES.map((c, i) => {
              if (!selectedComplexities.has(i)) return null;
              return (
                <text
                  key={i}
                  x={graphW - 8}
                  y={20 + i * 14}
                  textAnchor="end"
                  fill={c.color}
                  fontSize={9}
                  fontFamily="monospace"
                  opacity={0.8}
                >
                  {c.label}
                </text>
              );
            })}
          </svg>
        </div>
      )}

      {/* Insight panel */}
      <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <p className="text-xs font-mono text-white/40 mb-2">At n = {n}:</p>
        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
          {COMPLEXITIES.filter((_, i) => selectedComplexities.has(i)).slice(0, 6).map((c, idx) => (
            <div key={idx}>
              <p style={{ color: c.color }}>{c.label}</p>
              <p className="text-white/60">
                {c.fn(n) >= 1e9
                  ? "∞ (overflow)"
                  : c.fn(n) >= 1e6
                  ? `${(c.fn(n) / 1e6).toFixed(1)}M`
                  : c.fn(n) >= 1e3
                  ? `${(c.fn(n) / 1e3).toFixed(1)}K`
                  : Math.round(c.fn(n))}
              </p>
              <p className="text-white/20 text-[10px]">{c.description.split("—")[0]}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
