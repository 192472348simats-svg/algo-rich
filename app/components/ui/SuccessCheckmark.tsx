"use client";

import { motion } from "framer-motion";

type CheckmarkSize = "sm" | "md" | "lg";

const sizes: Record<CheckmarkSize, { svg: number; stroke: number }> = {
  sm: { svg: 40, stroke: 3 },
  md: { svg: 64, stroke: 3 },
  lg: { svg: 96, stroke: 3 },
};

interface SuccessCheckmarkProps {
  size?: CheckmarkSize;
  className?: string;
}

/** Animated SVG checkmark for success states. Circle draws, then checkmark appears. */
export default function SuccessCheckmark({
  size = "md",
  className = "",
}: SuccessCheckmarkProps) {
  const { svg: s, stroke } = sizes[size];
  const r = s / 2 - stroke - 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {/* Circle */}
        <motion.circle
          cx={s / 2}
          cy={s / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        />
        {/* Checkmark */}
        <motion.path
          d={
            size === "sm"
              ? "M12 20L18 26L28 16"
              : size === "lg"
                ? "M28 48L40 60L66 34"
                : "M19 32L27 40L45 22"
          }
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.4,
            ease: "easeOut" as const,
          }}
        />
      </svg>
    </div>
  );
}
