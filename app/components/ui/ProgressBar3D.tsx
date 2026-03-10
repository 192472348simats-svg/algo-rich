"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface ProgressBar3DProps {
  value: number; // 0-100
  className?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar3D({
  value,
  className = "",
  height = 10,
  showLabel = false,
}: ProgressBar3DProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const springValue = useSpring(0, { stiffness: 60, damping: 20 });
  const widthPct = useTransform(springValue, (v) => `${v}%`);

  useEffect(() => {
    springValue.set(clampedValue);
  }, [clampedValue, springValue]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative flex-1 rounded-full overflow-hidden"
        style={{
          height: `${height}px`,
          backgroundColor: "hsl(var(--muted) / 0.5)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: widthPct,
            background:
              "linear-gradient(90deg, hsl(43 96% 46%), hsl(43 96% 60%), hsl(43 96% 50%))",
            backgroundSize: "200% 100%",
            backgroundPosition: widthPct,
            boxShadow: "0 0 8px hsl(43 96% 56% / 0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            animation: "shimmer 2.5s linear infinite",
          }}
        />
        {/* Inner shine layer */}
        <div
          className="absolute inset-x-0 top-0 rounded-full pointer-events-none"
          style={{
            height: "40%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground tabular-nums w-8 text-right">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
}
