"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export type GlowColor = "gold" | "blue" | "green" | "purple" | "red";

const GLOW_MAP: Record<GlowColor, string> = {
  gold:   "hsl(43 96% 56% / 0.18)",
  blue:   "hsl(210 100% 60% / 0.18)",
  green:  "hsl(142 76% 54% / 0.18)",
  purple: "hsl(270 76% 65% / 0.18)",
  red:    "hsl(0 84% 60% / 0.18)",
};

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: GlowColor;
  hoverable?: boolean;
  tiltEnabled?: boolean;
}

const BASE_SHADOW =
  "0 2px 8px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.20)";

function getHoverShadow(color: GlowColor) {
  return `0 4px 16px rgba(0,0,0,0.40), 0 16px 48px rgba(0,0,0,0.30), 0 0 30px ${GLOW_MAP[color]}`;
}

export default function Card3D({
  children,
  className = "",
  glowColor = "gold",
  hoverable = true,
  tiltEnabled = false,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Detect reduced-motion preference once on mount
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltEnabled || prefersReduced) return;
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 → 0.5
      const py = (e.clientY - r.top)  / r.height - 0.5;
      setTilt({ x: py * -3, y: px * 3 });
    },
    [tiltEnabled, prefersReduced],
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const shadow =
    hoverable && hovered ? getHoverShadow(glowColor) : BASE_SHADOW;

  return (
    <motion.div
      ref={cardRef}
      className={`glass rounded-xl ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        boxShadow: shadow,
        y: hoverable && hovered && !prefersReduced ? -3 : 0,
        rotateX: tiltEnabled && !prefersReduced ? tilt.x : 0,
        rotateY: tiltEnabled && !prefersReduced ? tilt.y : 0,
      }}
      transition={{
        boxShadow: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        y:         { type: "spring", stiffness: 300, damping: 30 },
        rotateX:   { type: "spring", stiffness: 200, damping: 25 },
        rotateY:   { type: "spring", stiffness: 200, damping: 25 },
      }}
      style={{
        perspective: tiltEnabled ? 800 : undefined,
        transformStyle: tiltEnabled ? "preserve-3d" : undefined,
        willChange: hoverable ? "transform, box-shadow" : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
