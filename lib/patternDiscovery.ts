// Pattern Discovery Engine
// Detects when users solve 2+ problems using the same pattern
// and surfaces "aha moment" insights to reinforce learning

export interface PatternTrigger {
  patternSlug: string;
  patternName: string;
  requiredProblems: number; // how many problems of this pattern before triggering
  discoveryMessage: string; // the "aha!" message
  codeComparison: {
    problem1: string;
    problem2: string;
    sharedLogic: string;
  };
  relatedProblems: string[]; // slugs of other problems using this pattern
  keyInsight: string;
}

export const PATTERN_TRIGGERS: PatternTrigger[] = [
  {
    patternSlug: "hash-map",
    patternName: "Hash Map Pattern",
    requiredProblems: 2,
    discoveryMessage:
      "You just used a hash map in TWO different problems. See the pattern?",
    codeComparison: {
      problem1: `# Two Sum
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]
    seen[num] = i`,
      problem2: `# Valid Anagram
count = {}
for char in s:
    count[char] = count.get(char, 0) + 1
for char in t:
    count[char] = count.get(char, 0) - 1`,
      sharedLogic: `# The pattern: Store → Lookup → Decide
storage = {}
for item in collection:
    if lookup_condition(item, storage):
        return result
    storage[key] = value`,
    },
    relatedProblems: [
      "group-anagrams",
      "contains-duplicate",
      "longest-consecutive-sequence",
    ],
    keyInsight:
      "Hash maps give O(1) lookup. Whenever you need to 'remember' something you've seen before, reach for a hash map.",
  },
  {
    patternSlug: "two-pointers",
    patternName: "Two Pointers Pattern",
    requiredProblems: 2,
    discoveryMessage:
      "Two problems, same technique: two pointers walking toward each other!",
    codeComparison: {
      problem1: `# Valid Palindrome
left, right = 0, len(s) - 1
while left < right:
    if s[left] != s[right]:
        return False
    left += 1
    right -= 1`,
      problem2: `# Two Sum II (Sorted Array)
left, right = 0, len(nums) - 1
while left < right:
    total = nums[left] + nums[right]
    if total == target:
        return [left+1, right+1]
    elif total < target:
        left += 1
    else:
        right -= 1`,
      sharedLogic: `# The pattern: Two pointers converging
left, right = 0, len(arr) - 1
while left < right:
    # Check condition at both pointers
    # Move the pointer that gets closer to solution`,
    },
    relatedProblems: ["container-with-most-water", "three-sum", "trapping-rain-water"],
    keyInsight:
      "When working with sorted arrays or checking pairs from both ends, two pointers eliminate the need for nested loops — O(n) instead of O(n²).",
  },
  {
    patternSlug: "sliding-window",
    patternName: "Sliding Window Pattern",
    requiredProblems: 2,
    discoveryMessage:
      "You've mastered the sliding window — expand right, shrink left!",
    codeComparison: {
      problem1: `# Max Subarray Sum of Size K
window_sum = sum(arr[:k])
max_sum = window_sum
for i in range(k, len(arr)):
    window_sum += arr[i] - arr[i-k]
    max_sum = max(max_sum, window_sum)`,
      problem2: `# Longest Substring Without Repeating
seen = {}
left = max_len = 0
for right, char in enumerate(s):
    if char in seen and seen[char] >= left:
        left = seen[char] + 1
    seen[char] = right
    max_len = max(max_len, right - left + 1)`,
      sharedLogic: `# The pattern: Window slides right, shrinks from left
left = 0
for right in range(len(arr)):
    # Expand window by including arr[right]
    while window_invalid():
        # Shrink from left
        left += 1
    # Update answer`,
    },
    relatedProblems: [
      "minimum-window-substring",
      "permutation-in-string",
      "longest-repeating-character-replacement",
    ],
    keyInsight:
      "Sliding window turns O(n×k) brute force into O(n) by reusing computation. If the problem asks about contiguous subarrays/substrings, think sliding window.",
  },
  {
    patternSlug: "bfs-dfs",
    patternName: "Tree/Graph Traversal Pattern",
    requiredProblems: 2,
    discoveryMessage:
      "BFS and DFS are the same pattern — just swap the queue for a stack!",
    codeComparison: {
      problem1: `# BFS Level Order Traversal
queue = deque([root])
while queue:
    node = queue.popleft()
    process(node)
    if node.left: queue.append(node.left)
    if node.right: queue.append(node.right)`,
      problem2: `# DFS Inorder Traversal
stack = []
current = root
while stack or current:
    while current:
        stack.append(current)
        current = current.left
    current = stack.pop()
    process(current)
    current = current.right`,
      sharedLogic: `# The pattern: Visit nodes using a container
container = [start_node]  # Queue for BFS, Stack for DFS
while container:
    node = container.remove()  # popleft() = BFS, pop() = DFS
    process(node)
    for neighbor in node.children:
        container.add(neighbor)`,
    },
    relatedProblems: [
      "maximum-depth-of-binary-tree",
      "number-of-islands",
      "course-schedule",
    ],
    keyInsight:
      "BFS uses a queue (FIFO) and explores level by level. DFS uses a stack (LIFO) and dives deep first. The choice depends on whether you need shortest path (BFS) or exhaustive exploration (DFS).",
  },
  {
    patternSlug: "dynamic-programming",
    patternName: "Dynamic Programming Pattern",
    requiredProblems: 2,
    discoveryMessage:
      "You're building solutions from smaller subproblems — that's DP!",
    codeComparison: {
      problem1: `# Climbing Stairs
dp = [0] * (n + 1)
dp[1] = 1
dp[2] = 2
for i in range(3, n + 1):
    dp[i] = dp[i-1] + dp[i-2]`,
      problem2: `# House Robber
dp = [0] * len(nums)
dp[0] = nums[0]
dp[1] = max(nums[0], nums[1])
for i in range(2, len(nums)):
    dp[i] = max(dp[i-1], dp[i-2] + nums[i])`,
      sharedLogic: `# The pattern: Build answer from subproblems
dp[base_case] = known_value
for i in range(start, end):
    dp[i] = combine(dp[smaller_subproblems])
return dp[target]`,
    },
    relatedProblems: [
      "coin-change",
      "longest-common-subsequence",
      "unique-paths",
    ],
    keyInsight:
      "DP = recursion + memoization. If a problem has overlapping subproblems and optimal substructure, define the recurrence relation and build bottom-up.",
  },
  {
    patternSlug: "binary-search",
    patternName: "Binary Search Pattern",
    requiredProblems: 2,
    discoveryMessage:
      "Binary search isn't just for sorted arrays — it works on any monotonic function!",
    codeComparison: {
      problem1: `# Classic Binary Search
left, right = 0, len(nums) - 1
while left <= right:
    mid = (left + right) // 2
    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        left = mid + 1
    else:
        right = mid - 1`,
      problem2: `# Search in Rotated Sorted Array
left, right = 0, len(nums) - 1
while left <= right:
    mid = (left + right) // 2
    if nums[mid] == target:
        return mid
    if nums[left] <= nums[mid]:
        if nums[left] <= target < nums[mid]:
            right = mid - 1
        else:
            left = mid + 1
    else:
        if nums[mid] < target <= nums[right]:
            left = mid + 1
        else:
            right = mid - 1`,
      sharedLogic: `# The pattern: Halve the search space
left, right = boundaries
while left <= right:
    mid = (left + right) // 2
    if condition(mid):
        return mid
    elif should_go_right(mid):
        left = mid + 1
    else:
        right = mid - 1`,
    },
    relatedProblems: [
      "find-minimum-in-rotated-sorted-array",
      "search-a-2d-matrix",
      "koko-eating-bananas",
    ],
    keyInsight:
      "Binary search works whenever the search space is monotonic - if checking mid tells you which half to discard, you can binary search it. O(log n) from O(n).",
  },
  {
    patternSlug: "stack",
    patternName: "Stack Pattern",
    requiredProblems: 2,
    discoveryMessage:
      "Stacks aren't just for parentheses — they track 'what came before'!",
    codeComparison: {
      problem1: `# Valid Parentheses
stack = []
pairs = {')': '(', ']': '[', '}': '{'}
for char in s:
    if char in pairs:
        if not stack or stack[-1] != pairs[char]:
            return False
        stack.pop()
    else:
        stack.append(char)`,
      problem2: `# Daily Temperatures
stack = []  # indices of unresolved temps
result = [0] * len(temps)
for i, temp in enumerate(temps):
    while stack and temps[stack[-1]] < temp:
        prev = stack.pop()
        result[prev] = i - prev
    stack.append(i)`,
      sharedLogic: `# The pattern: Process with history
stack = []
for item in sequence:
    while stack and should_resolve(stack[-1], item):
        resolved = stack.pop()
        process(resolved, item)
    stack.append(item)`,
    },
    relatedProblems: [
      "min-stack",
      "evaluate-reverse-polish-notation",
      "largest-rectangle-in-histogram",
    ],
    keyInsight:
      "Stacks excel when you need to match pairs, track dependencies, or find the 'next greater/smaller' element. The LIFO property naturally handles nested and sequential relationships.",
  },
];

// Check if a user has triggered any pattern discovery
export function checkPatternDiscovery(
  solvedProblemPatterns: { slug: string; pattern: string }[]
): PatternTrigger | null {
  // Count problems solved per pattern
  const patternCounts: Record<string, number> = {};
  for (const p of solvedProblemPatterns) {
    if (p.pattern) {
      patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
    }
  }

  // Check each trigger
  for (const trigger of PATTERN_TRIGGERS) {
    const count = patternCounts[trigger.patternSlug] || 0;
    if (count >= trigger.requiredProblems) {
      return trigger;
    }
  }

  return null;
}

// Get all discovered patterns for a user
export function getDiscoveredPatterns(
  solvedProblemPatterns: { slug: string; pattern: string }[]
): PatternTrigger[] {
  const patternCounts: Record<string, number> = {};
  for (const p of solvedProblemPatterns) {
    if (p.pattern) {
      patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
    }
  }

  return PATTERN_TRIGGERS.filter(
    (trigger) => (patternCounts[trigger.patternSlug] || 0) >= trigger.requiredProblems
  );
}

// Get the next closest pattern to discovery
export function getNextPatternToDiscover(
  solvedProblemPatterns: { slug: string; pattern: string }[]
): { trigger: PatternTrigger; current: number; needed: number } | null {
  const patternCounts: Record<string, number> = {};
  for (const p of solvedProblemPatterns) {
    if (p.pattern) {
      patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
    }
  }

  let closest: { trigger: PatternTrigger; current: number; needed: number } | null = null;
  let minGap = Infinity;

  for (const trigger of PATTERN_TRIGGERS) {
    const count = patternCounts[trigger.patternSlug] || 0;
    const gap = trigger.requiredProblems - count;
    if (gap > 0 && gap < minGap) {
      minGap = gap;
      closest = { trigger, current: count, needed: trigger.requiredProblems };
    }
  }

  return closest;
}
