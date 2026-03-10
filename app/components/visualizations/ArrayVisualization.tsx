"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Pointer {
  name: string;
  index: number;
  color: string;
}

interface ArrayVisualizationProps {
  data: (number | string)[];
  pointers?: Pointer[];
  highlighted?: number[];
  comparing?: [number, number] | null;
  swapping?: [number, number] | null;
  speed?: number; // 0.5 to 2
  className?: string;
  showIndices?: boolean;
  label?: string;
}

const BOX_WIDTH = 56;
const BOX_HEIGHT = 56;
const GAP = 4;
const POINTER_AREA = 40;

export default function ArrayVisualization({
  data,
  pointers = [],
  highlighted = [],
  comparing = null,
  swapping = null,
  speed = 1,
  className = "",
  showIndices = true,
  label,
}: ArrayVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalWidth = data.length * (BOX_WIDTH + GAP) - GAP;
  const animDuration = 0.4 / speed;

  const getBoxColor = useCallback(
    (index: number): string => {
      if (swapping && (index === swapping[0] || index === swapping[1])) {
        return "var(--warning)";
      }
      if (comparing && (index === comparing[0] || index === comparing[1])) {
        return "hsl(var(--primary))";
      }
      if (highlighted.includes(index)) {
        return "hsl(var(--primary))";
      }
      return "hsl(228 40% 20%)";
    },
    [highlighted, comparing, swapping]
  );

  const getBoxGlow = useCallback(
    (index: number): string => {
      if (swapping && (index === swapping[0] || index === swapping[1])) {
        return "0 0 12px rgba(245, 158, 11, 0.5)";
      }
      if (comparing && (index === comparing[0] || index === comparing[1])) {
        return "var(--glow-cyan)";
      }
      if (highlighted.includes(index)) {
        return "var(--glow-gold)";
      }
      return "none";
    },
    [highlighted, comparing, swapping]
  );

  return (
    <div className={`relative ${className}`}>
      {label && (
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          {label}
        </p>
      )}

      <div
        ref={containerRef}
        className="relative overflow-x-auto pb-4"
        style={{ minHeight: BOX_HEIGHT + POINTER_AREA + 30 }}
      >
        {/* Pointers above */}
        <div className="relative" style={{ height: POINTER_AREA }}>
          {pointers.map((pointer) => (
            <motion.div
              key={pointer.name}
              animate={{
                x: pointer.index * (BOX_WIDTH + GAP) + BOX_WIDTH / 2 - 16,
              }}
              transition={{ duration: animDuration, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 flex flex-col items-center"
            >
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: pointer.color,
                  backgroundColor: `${pointer.color}20`,
                  border: `1px solid ${pointer.color}40`,
                }}
              >
                {pointer.name}
              </span>
              <svg width="12" height="12" className="mt-0.5">
                <polygon
                  points="6,12 0,0 12,0"
                  fill={pointer.color}
                  opacity="0.8"
                />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* Array boxes */}
        <div className="flex" style={{ gap: GAP }}>
          {data.map((value, index) => (
            <motion.div
              key={index}
              layout
              className="relative flex-shrink-0"
              style={{ width: BOX_WIDTH }}
            >
              {/* Box */}
              <motion.div
                animate={{
                  backgroundColor: getBoxColor(index),
                  boxShadow: getBoxGlow(index),
                  scale:
                    comparing &&
                    (index === comparing[0] || index === comparing[1])
                      ? 1.1
                      : 1,
                }}
                transition={{ duration: animDuration }}
                className="flex items-center justify-center rounded-lg border border-border"
                style={{
                  width: BOX_WIDTH,
                  height: BOX_HEIGHT,
                  backdropFilter: "blur(8px)",
                }}
              >
                <motion.span
                  className="text-lg font-bold text-foreground"
                  animate={{
                    scale:
                      highlighted.includes(index) ||
                      (comparing &&
                        (index === comparing[0] || index === comparing[1]))
                        ? 1.2
                        : 1,
                  }}
                  transition={{ duration: animDuration }}
                >
                  {value}
                </motion.span>
              </motion.div>

              {/* Index label */}
              {showIndices && (
                <p className="text-center text-xs text-muted-foreground/70 mt-1 font-mono">
                  {index}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
