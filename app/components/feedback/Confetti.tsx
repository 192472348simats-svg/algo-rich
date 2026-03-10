"use client";

import confetti from "canvas-confetti";

const goldColors = ["#d4af37", "#f4d03f", "#F4E4C1", "#ffffff"];

/** Trigger a burst of gold/white confetti. */
export function triggerConfetti(options?: {
  particleCount?: number;
  spread?: number;
}) {
  confetti({
    particleCount: options?.particleCount ?? 100,
    spread: options?.spread ?? 70,
    origin: { y: 0.6 },
    colors: goldColors,
    ticks: 200,
    gravity: 1.2,
    scalar: 1.1,
  });
}

/** Preset confetti for lesson/problem success — fires from both sides. */
export function triggerSuccessConfetti() {
  const defaults = {
    particleCount: 50,
    spread: 55,
    colors: goldColors,
    ticks: 180,
    gravity: 1,
    scalar: 1,
  };

  confetti({ ...defaults, angle: 60, origin: { x: 0, y: 0.65 } });
  confetti({ ...defaults, angle: 120, origin: { x: 1, y: 0.65 } });

  // Second burst slightly delayed
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 30,
      angle: 90,
      origin: { x: 0.5, y: 0.7 },
      spread: 80,
    });
  }, 150);
}
