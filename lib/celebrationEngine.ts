"use client";

import confetti from "canvas-confetti";

type CelebrationEvent =
  | "solve"           // Solved a problem
  | "level_up"        // Levelled up XP tier
  | "pattern_unlock"  // Unlocked a new DSA pattern
  | "streak_milestone"; // 7 / 14 / 30 / 100-day streak

const gold = ["#E5A829", "#F4D03F", "#F4E4C1", "#ffffff"];
const blue = ["#3B82F6", "#60A5FA", "#93C5FD", "#ffffff"];
const rainbow = ["#E5A829", "#EF4444", "#10B981", "#3B82F6", "#A855F7", "#F472B6"];

function burst(colors: string[], particleCount = 80, spread = 70, origin = { x: 0.5, y: 0.6 }) {
  confetti({ particleCount, spread, origin, colors, ticks: 220, gravity: 1.1, scalar: 1.1 });
}

function sides(colors: string[], particleCount = 50) {
  const defaults = { particleCount, spread: 55, colors, ticks: 180, gravity: 1, scalar: 1 };
  confetti({ ...defaults, angle: 60, origin: { x: 0, y: 0.65 } });
  confetti({ ...defaults, angle: 120, origin: { x: 1, y: 0.65 } });
}

/** Trigger a celebration animation for the given event type. Safe to call in any client component. */
export function celebrate(event: CelebrationEvent): void {
  switch (event) {
    case "solve":
      sides(gold, 50);
      setTimeout(() => burst(gold, 40, 80), 150);
      break;

    case "level_up":
      burst(rainbow, 120, 90);
      setTimeout(() => burst(rainbow, 80, 100, { x: 0.3, y: 0.5 }), 200);
      setTimeout(() => burst(rainbow, 80, 100, { x: 0.7, y: 0.5 }), 400);
      break;

    case "pattern_unlock":
      burst(blue, 100, 75);
      setTimeout(() => sides(blue, 40), 200);
      break;

    case "streak_milestone":
      sides(gold, 60);
      setTimeout(() => burst(gold, 120, 90), 100);
      setTimeout(() => burst(rainbow, 60, 110, { x: 0.5, y: 0.4 }), 400);
      break;

    default:
      burst(gold);
  }
}
