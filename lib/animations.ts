import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────
   Shared Framer Motion Variants
   ────────────────────────────────────────────── */

/**
 * Stagger container — use on a motion parent to stagger child animations.
 * @example <motion.div variants={containerVariants} initial="hidden" animate="visible">
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

/**
 * Slide-up + fade child variant — use on motion children inside a containerVariants parent.
 */
export const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/**
 * Fast stagger variant set — tighter timing for lists with many items.
 */
export const fastContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const fastItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ──────────────────────────────────────────────
   Hooks
   ────────────────────────────────────────────── */

/**
 * Animated count-up hook with ease-out quadratic easing.
 * Counts from 0 to `target` over `duration` ms.
 */
export function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (target === 0) return;

    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

/* ──────────────────────────────────────────────
   Spring presets for whileHover / whileTap
   ────────────────────────────────────────────── */

/** Card hover — subtle lift */
export const cardHover = { y: -4, scale: 1.01 };

/** Button hover — gentle scale */
export const buttonHover = { scale: 1.03 };

/** Button tap — press feedback */
export const buttonTap = { scale: 0.97 };
