"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

export type MemoryDisplayMode = "binary" | "decimal" | "hex" | "ascii" | "all";

export interface MemoryCellProps {
  address: string;
  value: number;
  showAs?: MemoryDisplayMode;
  highlighted?: boolean;
  highlightColor?: "gold" | "cyan" | "success" | "error";
  label?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function MemoryCell({
  address,
  value,
  showAs = "decimal",
  highlighted = false,
  highlightColor = "gold",
  label,
  size = "md",
  animate = true,
  onClick,
  className = "",
}: MemoryCellProps) {
  const [hovered, setHovered] = useState(false);

  const binary = useMemo(
    () => (value & 0xff).toString(2).padStart(8, "0"),
    [value]
  );
  const decimal = useMemo(() => (value & 0xff).toString(10), [value]);
  const hex = useMemo(
    () =>
      "0x" +
      (value & 0xff)
        .toString(16)
        .toUpperCase()
        .padStart(2, "0"),
    [value]
  );
  const ascii = useMemo(() => {
    const v = value & 0xff;
    if (v >= 32 && v <= 126) return `'${String.fromCharCode(v)}'`;
    if (v === 0) return "'\\0'";
    if (v === 10) return "'\\n'";
    if (v === 13) return "'\\r'";
    return "·";
  }, [value]);

  const sizeClasses = {
    sm: "w-20 min-h-[48px] text-xs",
    md: "w-28 min-h-[72px] text-sm",
    lg: "w-36 min-h-[96px] text-base",
  };

  const glowMap = {
    gold: "shadow-[0_0_20px_rgba(212,175,55,0.3)] border-primary",
    cyan: "shadow-[0_0_20px_hsl(43 96% 56%,0.3)] border-primary",
    success:
      "shadow-[0_0_20px_rgba(16,185,129,0.3)] border-[var(--success)]",
    error:
      "shadow-[0_0_20px_rgba(239,68,68,0.3)] border-[var(--error)]",
  };

  const renderValue = () => {
    if (showAs === "all") {
      return (
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-white/90">{binary}</span>
          <span className="font-mono text-white/70">({decimal})</span>
          <span className="font-mono text-primary">{hex}</span>
          <span className="font-mono text-primary">{ascii}</span>
        </div>
      );
    }
    const displayMap = { binary, decimal, hex, ascii };
    const colorMap = {
      binary: "text-white/90",
      decimal: "text-white",
      hex: "text-primary",
      ascii: "text-primary",
    };
    return (
      <span className={`font-mono ${colorMap[showAs]}`}>
        {displayMap[showAs]}
      </span>
    );
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        ${sizeClasses[size]}
        rounded-lg border transition-colors duration-200
        ${
          highlighted
            ? `bg-white/10 ${glowMap[highlightColor]}`
            : "bg-card border-white/10 hover:border-white/20"
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* Label above */}
      {label && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono text-primary whitespace-nowrap">
          {label}
        </span>
      )}

      {/* Value */}
      <div className="flex items-center justify-center p-1">
        {renderValue()}
      </div>

      {/* Address below */}
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary/70 whitespace-nowrap">
        {address}
      </span>

      {/* Hover tooltip with all representations */}
      {hovered && showAs !== "all" && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-lg bg-card/60 border border-white/20 shadow-xl whitespace-nowrap"
        >
          <div className="flex flex-col text-[10px] font-mono gap-0.5">
            <span className="text-white/80">BIN: {binary}</span>
            <span className="text-white/80">DEC: {decimal}</span>
            <span className="text-primary">HEX: {hex}</span>
            <span className="text-primary">CHR: {ascii}</span>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-card/60 border-r border-b border-white/20" />
        </motion.div>
      )}
    </motion.div>
  );
}
