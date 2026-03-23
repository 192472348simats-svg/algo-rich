// Load .env.local first (same as Next.js app), then fall back to .env
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

// prisma/seed-patterns.js
// Seed script for FlashCards based on pattern definitions
// Run with: node prisma/seed-patterns.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const patterns = [
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description: "Use when you have a sorted array/linked list and need to find pairs that satisfy a condition.",
    whenToUse: JSON.stringify(["Sorted array/list", "Find pair with target sum", "Remove duplicates"]),
    template: `left, right = 0, len(arr) - 1
while left < right:
    current_sum = arr[left] + arr[right]
    if current_sum == target:
        # found pair
        left += 1
        right -= 1
    elif current_sum < target:
        left += 1
    else:
        right -= 1`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 1,
    order: 1,
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description: "Maintain a dynamic window over a sequence to find optimal sub-sequences.",
    whenToUse: JSON.stringify(["Find optimal subarray/substring", "Max/min sum of subarray", "Longest substring with condition"]),
    template: `window_start = 0
max_length = 0
for window_end in range(len(arr)):
    # add arr[window_end] to window
    while condition_not_met:
        # remove arr[window_start] from window
        window_start += 1
    # update max_length`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    difficulty: 2,
    order: 2,
  },
  {
    slug: "fast-slow-pointers",
    name: "Fast & Slow Pointers",
    description: "Use two pointers moving at different speeds to solve problems in lists or sequences.",
    whenToUse: JSON.stringify(["Cycle detection in linked list/array", "Find middle of linked list", "Happy number problem"]),
    template: `slow, fast = head, head
while fast is not None and fast.next is not None:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        # cycle detected`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 3,
  },
  {
    slug: "merge-intervals",
    name: "Merge Intervals",
    description: "Combine overlapping intervals into a set of non-overlapping intervals.",
    whenToUse: JSON.stringify(["Overlapping meeting times", "Combine date ranges", "Genomic sequencing"]),
    template: `intervals.sort(key=lambda x: x[0])
merged = [intervals[0]]
for start, end in intervals[1:]:
    if start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    difficulty: 3,
    order: 4,
  },
  {
    slug: "cyclic-sort",
    name: "Cyclic Sort",
    description: "Place elements in their correct positions in an array containing numbers in a specific range.",
    whenToUse: JSON.stringify(["Array with numbers in range 1 to n", "Find missing/duplicate number"]),
    template: `i = 0
while i < len(nums):
    j = nums[i] - 1
    if nums[i] != nums[j]:
        nums[i], nums[j] = nums[j], nums[i]
    else:
        i += 1`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 3,
    order: 5,
  },
  {
    slug: "linked-list-reversal",
    name: "In-place Linked List Reversal",
    description: "Reverse the direction of pointers in a linked list without using extra space.",
    whenToUse: JSON.stringify(["Reverse a linked list", "Reverse sub-list", "Palindrome linked list"]),
    template: `prev, curr = None, head
while curr:
    next_node = curr.next
    curr.next = prev
    prev = curr
    curr = next_node
return prev`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 6,
  },
  {
    slug: "tree-bfs",
    name: "Tree BFS",
    description: "Traverse a tree level by level using a queue.",
    whenToUse: JSON.stringify(["Level-order traversal", "Find shortest path in unweighted graph/tree", "Web crawler"]),
    template: `from collections import deque
queue = deque([root])
while queue:
    level_size = len(queue)
    current_level = []
    for _ in range(level_size):
        node = queue.popleft()
        current_level.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(w)",
    difficulty: 2,
    order: 7,
  },
  {
    slug: "tree-dfs",
    name: "Tree DFS",
    description: "Traverse a tree by exploring as far as possible down each branch before backtracking.",
    whenToUse: JSON.stringify(["Pre-order, in-order, post-order traversal", "Path finding", "Topological sort"]),
    template: `def dfs(node):
    if node is None:
        return
    # Pre-order: process node
    dfs(node.left)
    # In-order: process node
    dfs(node.right)
    # Post-order: process node`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    difficulty: 2,
    order: 8,
  },
  {
    slug: "two-heaps",
    name: "Two Heaps",
    description: "Use a min-heap and a max-heap to find the median of a data stream.",
    whenToUse: JSON.stringify(["Find median of data stream", "Scheduling problems", "Find kth smallest/largest element"]),
    template: `import heapq
# max_heap for lower half, min_heap for upper half
# Balance heaps after each insertion`,
    timeComplexity: "O(log n) per insertion",
    spaceComplexity: "O(n)",
    difficulty: 4,
    order: 9,
  },
  {
    slug: "subsets-backtracking",
    name: "Subsets / Backtracking",
    description: "Generate all possible combinations or permutations by exploring choices and undoing them.",
    whenToUse: JSON.stringify(["Generate all subsets/permutations", "Combinations that sum to target", "Word search on a grid"]),
    template: `def backtrack(current, remaining):
    if solution_found:
        result.append(current)
        return
    for choice in remaining:
        # make choice
        backtrack(new_current, new_remaining)
        # undo choice`,
    timeComplexity: "O(2^n) or O(n!)",
    spaceComplexity: "O(n)",
    difficulty: 3,
    order: 10,
  },
  {
    slug: "modified-binary-search",
    name: "Modified Binary Search",
    description: "Adapt binary search for problems on sorted or partially-sorted data structures.",
    whenToUse: JSON.stringify(["Search in rotated sorted array", "Find first/last occurrence", "Find peak element"]),
    template: `left, right = 0, len(arr) - 1
while left <= right:
    mid = (left + right) // 2
    # modify comparison logic based on problem`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    difficulty: 3,
    order: 11,
  },
  {
    slug: "top-k-elements",
    name: "Top 'K' Elements",
    description: "Find the top 'K' largest or smallest elements from a set.",
    whenToUse: JSON.stringify(["Top K frequent items", "Kth largest/smallest element", "Closest points to origin"]),
    template: `import heapq
heap = []
for item in data:
    heapq.heappush(heap, item)
    if len(heap) > k:
        heapq.heappop(heap)
return heap`,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    difficulty: 3,
    order: 12,
  },
  {
    slug: "k-way-merge",
    name: "K-way Merge",
    description: "Merge 'K' sorted lists into a single sorted list.",
    whenToUse: JSON.stringify(["Merge K sorted linked lists/arrays", "Find smallest range covering elements from K lists"]),
    template: `import heapq
min_heap = []
for i in range(len(lists)):
    if lists[i]:
        heapq.heappush(min_heap, (lists[i][0], i, 0))
# Pop from heap, add to result, push next from same list`,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    difficulty: 4,
    order: 13,
  },
  {
    slug: "topological-sort",
    name: "Topological Sort",
    description: "Linearly order the vertices of a Directed Acyclic Graph (DAG).",
    whenToUse: JSON.stringify(["Course scheduling", "Task dependencies", "Build systems"]),
    template: `# Kahn's Algorithm (BFS) or DFS-based approach`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    difficulty: 4,
    order: 14,
  },
  {
    slug: "dp-fibonacci",
    name: "Dynamic Programming (Fibonacci)",
    description: "Solve complex problems by breaking them into simpler, overlapping subproblems.",
    whenToUse: JSON.stringify(["Climbing stairs", "Coin change", "Longest common subsequence"]),
    template: `# Bottom-up (tabulation) or Top-down (memoization)`,
    timeComplexity: "Varies (e.g., O(n))",
    spaceComplexity: "Varies (e.g., O(n) or O(1))",
    difficulty: 3,
    order: 15,
  },
];

async function seedPatterns() {
  console.log("💠 Seeding patterns...");

  for (const p of patterns) {
    await prisma.pattern.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        whenToUse: p.whenToUse,
        template: p.template,
        timeComplexity: p.timeComplexity,
        spaceComplexity: p.spaceComplexity,
        difficulty: p.difficulty,
        order: p.order,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        whenToUse: p.whenToUse,
        template: p.template,
        timeComplexity: p.timeComplexity,
        spaceComplexity: p.spaceComplexity,
        difficulty: p.difficulty,
        order: p.order,
      },
    });
  }

  console.log(`✅ Seeded ${patterns.length} patterns`);
}

async function main() {
  await seedPatterns();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
