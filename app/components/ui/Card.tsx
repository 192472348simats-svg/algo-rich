"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Enable hover lift + glow effect */
  hoverable?: boolean;
}

/** Glass-morphism card component with optional hover animation. */
export default function Card({
  children,
  className = "",
  hoverable = true,
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.01 } : {}}
      className={`card-glass ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {children}
    </motion.div>
  );
}
