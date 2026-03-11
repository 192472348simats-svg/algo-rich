/**
 * Simplified plain-English descriptions for common patterns.
 * Keys are problem slugs (or pattern names mapped to a description).
 * When a problem has a patternTag matching a key here, we can show a
 * simplified starter description alongside the full one.
 */
export const SIMPLIFIED_DESCRIPTIONS: Record<string, string> = {
  "two-pointers": `**🔰 Beginner Explanation**\n\nUse two variables to point to positions in the array. Usually one starts at the beginning and one at the end. Move them toward each other based on a condition.\n\n**When to use it?** When you need to find a pair, remove duplicates, or compare elements from both ends.\n\n**Example idea:**\n- Start: left = 0, right = len(array) - 1\n- While left < right: check the pair, then move left or right`,

  "sliding-window": `**🔰 Beginner Explanation**\n\nImagine a moving window (subarray) of fixed or variable size sliding through an array or string. Track what's inside the window using a simple counter or map.\n\n**When to use it?** When you need the maximum, minimum, or some property of a contiguous subarray/substring.\n\n**Example idea:**\n- Add the new element entering the window\n- Remove the element leaving the window\n- Update your answer each step`,

  "binary-search": `**🔰 Beginner Explanation**\n\nDivide the search space in half each time. Always check the middle element and eliminate the half that can't contain the answer.\n\n**When to use it?** When the input is sorted, or when you can ask "is the answer ≤ X?" for any X.\n\n**Example idea:**\n- low = 0, high = len(array) - 1\n- mid = (low + high) // 2\n- If array[mid] < target: low = mid + 1, else high = mid - 1`,

  "tree-dfs": `**🔰 Beginner Explanation**\n\nTraverse a tree by going as deep as possible before backtracking. Use recursion or a stack.\n\n**When to use it?** Path problems, depth calculations, checking subtree properties.\n\n**Example idea:**\n- def dfs(node): if not node: return base_case\n- Process node, then recurse left and right`,

  "tree-bfs": `**🔰 Beginner Explanation**\n\nTraverse a tree level by level using a queue. Process all nodes at depth 1 before depth 2, etc.\n\n**When to use it?** Level-order traversal, finding shortest path, connecting nodes at same level.\n\n**Example idea:**\n- queue = deque([root])\n- While queue: process all nodes at current level, add their children`,

  "dynamic-programming": `**🔰 Beginner Explanation**\n\nBreak the problem into overlapping subproblems. Store the result of each subproblem so you don't recalculate it.\n\n**When to use it?** Optimization problems, counting paths, or any "number of ways" question.\n\n**Example idea:**\n- Define dp[i] = answer for the first i elements\n- Find the recurrence: dp[i] = some function of dp[i-1], dp[i-2], etc.`,

  "backtracking": `**🔰 Beginner Explanation**\n\nBuild solutions piece by piece. If a partial solution can't lead to a valid answer, backtrack and try a different choice.\n\n**When to use it?** Permutations, combinations, subsets, constraint satisfaction (like Sudoku).\n\n**Example idea:**\n- def backtrack(start, current): if done: save result\n- For each choice: add it, recurse, then remove it (undo)`,

  "graphs": `**🔰 Beginner Explanation**\n\nModel the problem as nodes (vertices) and connections (edges). Use DFS or BFS to explore the graph.\n\n**When to use it?** Connected components, shortest path, cycle detection, traversal problems.\n\n**Example idea:**\n- Build adjacency list: graph = defaultdict(list)\n- visited = set(); DFS/BFS from each unvisited node`,

  "fast-slow-pointers": `**🔰 Beginner Explanation**\n\nUse two pointers moving at different speeds through a sequence. The fast one moves 2 steps, the slow one moves 1 step.\n\n**When to use it?** Detecting cycles in linked lists, finding the middle of a list.\n\n**Example idea:**\n- slow = head; fast = head\n- While fast and fast.next: slow = slow.next; fast = fast.next.next\n- If slow == fast: cycle detected`,

  "merge-intervals": `**🔰 Beginner Explanation**\n\nSort intervals by start time, then merge overlapping ones by comparing the end of the last merged interval with the start of the next.\n\n**When to use it?** Scheduling, calendar problems, finding gaps.\n\n**Example idea:**\n- Sort by start\n- If current.start ≤ last_merged.end: merge (update end to max)\n- Else: add current as new interval`,
};

/**
 * Given a problem's patternTags (JSON string or comma-separated),
 * return a simplified description if one exists for any matched pattern.
 */
export function getSimplifiedDescription(patternTags: string): string | null {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(patternTags);
    tags = Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    tags = patternTags.split(",").map((t) => t.trim().toLowerCase());
  }

  for (const tag of tags) {
    const normalized = tag.toLowerCase().replace(/\s+/g, "-");
    if (SIMPLIFIED_DESCRIPTIONS[normalized]) {
      return SIMPLIFIED_DESCRIPTIONS[normalized];
    }
  }
  return null;
}
