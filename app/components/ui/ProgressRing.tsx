"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export default function ProgressRing({
  value,
  size = 52,
  strokeWidth = 4,
  label,
  className = "",
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const springValue = useSpring(0, { stiffness: 50, damping: 18 });
  const dashOffset = useTransform(
    springValue,
    (v) => circumference - (v / 100) * circumference
  );

  useEffect(() => {
    springValue.set(clampedValue);
  }, [clampedValue, springValue]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted) / 0.4)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(43 96% 56%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: dashOffset,
            filter: "drop-shadow(0 0 3px hsl(43 96% 56% / 0.6))",
          }}
        />
      </svg>
      {/* Center label */}
      {label && (
        <motion.span
          className="absolute text-xs font-bold text-primary tabular-nums"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
