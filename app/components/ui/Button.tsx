"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "text-[var(--navy-primary)] font-semibold rounded-lg",
  secondary:
    "bg-primary/15 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/25",
  ghost:
    "bg-transparent border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10",
  danger:
    "bg-transparent border border-red-500/40 text-red-400 font-semibold rounded-lg hover:bg-red-500/10",
};

/** Enhanced button with variants, loading state, and press animation. */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        disabled={isDisabled}
        className={`transition-all duration-300 inline-flex items-center justify-center gap-2 ${sizeClasses[size]} ${variantClasses[variant]} ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${variant === "primary" ? "" : ""} ${className}`}
        style={
          variant === "primary"
            ? {
                background: "var(--gradient-gold)",
                boxShadow: "var(--shadow-button)",
              }
            : undefined
        }
        onHoverStart={
          variant === "primary" && !isDisabled
            ? (e) => {
                const el = e.target as HTMLElement;
                el.style.boxShadow = "var(--shadow-button-hover)";
              }
            : undefined
        }
        onHoverEnd={
          variant === "primary" && !isDisabled
            ? (e) => {
                const el = e.target as HTMLElement;
                el.style.boxShadow = "var(--shadow-button)";
              }
            : undefined
        }
        {...props}
      >
        {isLoading && (
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
