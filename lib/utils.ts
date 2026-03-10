/**
 * Shared utility functions used across dashboard components.
 */

/**
 * Conditional class name joiner — lightweight alternative to clsx.
 * Accepts strings, undefined, null, false, and filters out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a number with optional K/M suffix for compact display.
 */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/**
 * Returns an emoji icon for a course category.
 */
export function categoryIcon(cat: string): string {
  switch (cat.toLowerCase()) {
    case "python":
      return "🐍";
    case "data-structures":
      return "📦";
    case "algorithms":
      return "⚡";
    default:
      return "📚";
  }
}

/**
 * Returns Tailwind classes for lesson difficulty badges (beginner/intermediate/advanced).
 */
export function lessonDifficultyColor(d: string): string {
  switch (d.toLowerCase()) {
    case "beginner":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "intermediate":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "advanced":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

/**
 * Returns Tailwind classes for problem difficulty badges (easy/medium/hard).
 */
export function problemDifficultyColor(d: string): string {
  switch (d.toLowerCase()) {
    case "easy":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "hard":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

/**
 * Combined difficulty color that handles both lesson and problem naming conventions.
 */
export function difficultyColor(d: string): string {
  switch (d.toLowerCase()) {
    case "beginner":
    case "easy":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "intermediate":
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "advanced":
    case "hard":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}
