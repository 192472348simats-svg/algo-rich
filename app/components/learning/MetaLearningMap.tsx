"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { patterns, type Pattern } from "@/lib/patterns/patternDefinitions";

interface MetaLearningMapProps {
  completedPatterns?: string[];
  currentPattern?: string;
  unlockedPatterns?: string[];
  onPatternClick?: (patternId: string) => void;
  className?: string;
}

interface StarNode {
  pattern: Pattern;
  x: number;
  y: number;
  ring: number;
}

const categoryRings: Record<string, number> = {
  pointers: 1,
  sorting: 1,
  trees: 2,
  search: 2,
  advanced: 3,
};

export default function MetaLearningMap({
  completedPatterns = [],
  currentPattern,
  unlockedPatterns = [],
  onPatternClick,
  className = "",
}: MetaLearningMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPattern, setHoveredPattern] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState("0 0 800 600");

  // Arrange patterns as stars in concentric rings
  const starNodes: StarNode[] = patterns.map((pattern, i) => {
    const ring = categoryRings[pattern.category] || 2;
    const ringPatterns = patterns.filter(
      (p) => categoryRings[p.category] === ring
    );
    const indexInRing = ringPatterns.indexOf(pattern);
    const angle = (indexInRing / ringPatterns.length) * Math.PI * 2 - Math.PI / 2;
    const radius = ring * 140;

    return {
      pattern,
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius,
      ring,
    };
  });

  const getNodeStatus = useCallback(
    (patternId: string): "completed" | "current" | "unlocked" | "locked" => {
      if (completedPatterns.includes(patternId)) return "completed";
      if (patternId === currentPattern) return "current";
      if (unlockedPatterns.includes(patternId)) return "unlocked";
      return "locked";
    },
    [completedPatterns, currentPattern, unlockedPatterns]
  );

  const getNodeColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "hsl(var(--primary))";
      case "current":
        return "hsl(var(--primary))";
      case "unlocked":
        return "hsl(228 40% 30%)";
      default:
        return "hsl(228 40% 20%)";
    }
  };

  const getGlowFilter = (status: string): string => {
    switch (status) {
      case "completed":
        return "url(#glowGold)";
      case "current":
        return "url(#glowCyan)";
      default:
        return "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Map the Territory
          </h2>
          <p className="text-sm text-muted-foreground">
            Your DSA constellation — explore the patterns universe
          </p>
        </div>
      </div>

      {/* Map container */}
      <div
        className="card-shiny p-4 overflow-hidden"
        style={{ background: "hsl(228 100% 7%)" }}
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="w-full h-[500px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs */}
          <defs>
            <filter id="glowGold" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="bgGlow">
              <stop offset="0%" stopColor="hsl(228 40% 20%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(228 100% 7%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background glow at center */}
          <circle cx="400" cy="300" r="200" fill="url(#bgGlow)" />

          {/* Ring outlines */}
          {[1, 2, 3].map((ring) => (
            <circle
              key={ring}
              cx="400"
              cy="300"
              r={ring * 140}
              fill="none"
              stroke="hsl(228 40% 20%)"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              opacity="0.3"
            />
          ))}

          {/* Connection lines for related patterns */}
          {starNodes.map((node) =>
            node.pattern.relatedPatterns.map((relId) => {
              const relNode = starNodes.find((n) => n.pattern.id === relId);
              if (!relNode) return null;
              return (
                <line
                  key={`${node.pattern.id}-${relId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={relNode.x}
                  y2={relNode.y}
                  stroke="hsl(228 40% 25%)"
                  strokeWidth="0.5"
                  opacity="0.3"
                  strokeDasharray="2 4"
                />
              );
            })
          )}

          {/* Star nodes */}
          {starNodes.map((node) => {
            const status = getNodeStatus(node.pattern.id);
            const isHovered = hoveredPattern === node.pattern.id;
            const color = getNodeColor(status);
            const baseRadius = status === "current" ? 18 : 14;

            return (
              <g
                key={node.pattern.id}
                onClick={() =>
                  status !== "locked" && onPatternClick?.(node.pattern.id)
                }
                onMouseEnter={() => setHoveredPattern(node.pattern.id)}
                onMouseLeave={() => setHoveredPattern(null)}
                className={`${
                  status !== "locked" ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                {/* Star glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? baseRadius + 8 : baseRadius + 3}
                  fill={color}
                  opacity={status === "locked" ? 0.05 : 0.15}
                  filter={getGlowFilter(status)}
                />

                {/* Star body */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? baseRadius + 2 : baseRadius}
                  fill={status === "locked" ? "hsl(228 40% 15%)" : color}
                  opacity={status === "locked" ? 0.4 : 1}
                  stroke={
                    isHovered
                      ? "hsl(var(--primary))"
                      : status === "locked"
                      ? "hsl(228 40% 25%)"
                      : color
                  }
                  strokeWidth={isHovered ? 2 : 1}
                  style={{
                    transition: "all 0.3s ease",
                  }}
                />

                {/* Icon */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  opacity={status === "locked" ? 0.3 : 1}
                >
                  {node.pattern.icon}
                </text>

                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + baseRadius + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill={
                    status === "locked"
                      ? "hsl(228 40% 25%)"
                      : "hsl(var(--foreground))"
                  }
                  opacity={isHovered ? 1 : 0.7}
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {node.pattern.name}
                </text>

                {/* Current indicator pulse */}
                {status === "current" && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={baseRadius + 6}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        values={`${baseRadius + 4};${baseRadius + 12};${baseRadius + 4}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.5;0;0.5"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}
              </g>
            );
          })}

          {/* Center label */}
          <text
            x="400"
            y="300"
            textAnchor="middle"
            dominantBaseline="central"
            fill="hsl(var(--foreground))"
            fontSize="12"
            opacity="0.4"
          >
            DSA Patterns
          </text>
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredPattern && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 p-4 rounded-xl"
              style={{
                background: "hsl(228 40% 12% / 0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid hsl(var(--border))",
              }}
            >
              {(() => {
                const p = patterns.find((p) => p.id === hoveredPattern);
                if (!p) return null;
                return (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground">
                        {p.name}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-card/60 text-primary">
                          {p.complexity.time}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-card/60 text-primary">
                          Difficulty: {"⭐".repeat(p.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
