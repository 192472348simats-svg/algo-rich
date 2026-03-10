"use client";

import { motion } from "framer-motion";

interface Button3DProps {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button3D({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: Button3DProps) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (variant === "primary") {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold text-background
          transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
          select-none ${className}`}
        style={{
          background: "linear-gradient(160deg, hsl(43 96% 50%), hsl(43 96% 56%))",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.3), 0 4px 12px hsl(43 96% 56% / 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
        whileHover={
          !disabled && !prefersReduced
            ? {
                y: -1,
                filter: "brightness(1.05)",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.35), 0 8px 20px hsl(43 96% 56% / 0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
              }
            : undefined
        }
        whileTap={
          !disabled && !prefersReduced
            ? {
                y: 0,
                scale: 0.99,
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.2), 0 2px 6px hsl(43 96% 56% / 0.15), inset 0 2px 4px rgba(0,0,0,0.15)",
              }
            : undefined
        }
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.button>
    );
  }

  // Ghost variant
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold text-foreground
        border border-border transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed select-none ${className}`}
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
      }}
      whileHover={
        !disabled && !prefersReduced
          ? {
              borderColor: "hsl(43 96% 56% / 0.3)",
              backgroundColor: "hsl(43 96% 56% / 0.05)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.2), 0 0 0 1px hsl(43 96% 56% / 0.15)",
            }
          : undefined
      }
      whileTap={
        !disabled && !prefersReduced
          ? {
              scale: 0.99,
              boxShadow: "0 1px 2px rgba(0,0,0,0.1), inset 0 1px 3px rgba(0,0,0,0.15)",
            }
          : undefined
      }
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  );
}
