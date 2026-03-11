/**
 * Maps lesson category/topic keywords to a visualizer type on /dashboard/visualize.
 * The visualizer page accepts a `?type=` query param to deep-link.
 */
export const LESSON_VISUALIZER_MAP: Record<string, string> = {
  // Tree topics
  "binary-search-tree": "tree",
  "bst": "tree",
  "binary-tree": "tree",
  "tree-traversal": "tree",
  "tree-dfs": "tree",
  "tree-bfs": "tree",
  "trees": "tree",

  // Array / sorting topics
  "arrays": "array",
  "sorting": "array",
  "binary-search": "array",
  "two-pointers": "array",
  "sliding-window": "array",

  // Linked list topics
  "linked-list": "linked-list",
  "linked-lists": "linked-list",
  "fast-slow-pointers": "linked-list",
  "in-place-reversal": "linked-list",

  // Stack / queue topics
  "stack": "stack-queue",
  "queue": "stack-queue",
  "stacks-and-queues": "stack-queue",
  "monotonic-stack": "stack-queue",
};

/**
 * Given a lesson's title (and optionally course title), return the visualizer
 * type to link to, or null if no visualizer exists for this topic.
 */
export function getVisualizerForLesson(title: string, courseTitle?: string): string | null {
  const combined = `${title} ${courseTitle ?? ""}`.toLowerCase().replace(/\s+/g, "-");
  for (const [keyword, type] of Object.entries(LESSON_VISUALIZER_MAP)) {
    if (combined.includes(keyword)) return type;
  }
  return null;
}
