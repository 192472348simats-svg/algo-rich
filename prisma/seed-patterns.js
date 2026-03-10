// prisma/seed-patterns.js
// Seed script for FlashCards based on pattern definitions
// Run with: node prisma/seed-patterns.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const patternFlashcards = [
  // Two Pointers
  {
    front: "When should you use the Two Pointers pattern?",
    back: "Use when you have a sorted array/linked list and need to find pairs that satisfy a condition — e.g., pair with target sum, remove duplicates.",
    deck: "patterns",
  },
  {
    front: "What is the time complexity of Two Pointers on a sorted array?",
    back: "O(n) — each pointer moves at most n times total.",
    deck: "complexity",
  },
  // Sliding Window
  {
    front: "What is the Sliding Window pattern?",
    back: "Maintain a window of elements in an array/string, expanding and contracting to find optimal subarrays/substrings.",
    deck: "patterns",
  },
  {
    front: "Fixed vs Variable Sliding Window?",
    back: "Fixed: window size is given (e.g., max sum of k elements). Variable: window expands/shrinks to meet a condition (e.g., smallest subarray with sum ≥ target).",
    deck: "concepts",
  },
  // Fast & Slow Pointers
  {
    front: "When do you use Fast & Slow pointers?",
    back: "Use for cycle detection in linked lists or arrays, finding the middle element, or determining if a sequence is cyclic (e.g., happy number).",
    deck: "patterns",
  },
  {
    front: "Floyd's Cycle Detection — how does it work?",
    back: "Slow pointer moves 1 step, fast moves 2 steps. If they meet, there's a cycle. To find the cycle start, reset one pointer to head and move both 1 step at a time until they meet.",
    deck: "concepts",
  },
  // Merge Intervals
  {
    front: "Steps for the Merge Intervals pattern?",
    back: "1) Sort intervals by start time. 2) Initialize merged with first interval. 3) For each interval, if it overlaps with the last merged, extend end. Otherwise, add new interval.",
    deck: "patterns",
  },
  // Cyclic Sort
  {
    front: "When to use Cyclic Sort?",
    back: "When dealing with an array containing numbers in a given range (1 to n or 0 to n). Place each number at its correct index: nums[i] should go to index nums[i]-1.",
    deck: "patterns",
  },
  // Linked List Reversal
  {
    front: "In-place linked list reversal — key variables?",
    back: "Use three pointers: prev (starts null), current (starts at head), next (temp store). For each node: save next, point current.next to prev, advance prev and current.",
    deck: "patterns",
  },
  // Tree BFS
  {
    front: "Tree BFS pattern — implementation?",
    back: "Use a queue. Process nodes level by level: dequeue a node, process it, enqueue its children. Track level size for level-order grouping.",
    deck: "patterns",
  },
  // Tree DFS
  {
    front: "Three types of Tree DFS traversal?",
    back: "Pre-order: root → left → right. In-order: left → root → right. Post-order: left → right → root. Can use recursion or explicit stack.",
    deck: "concepts",
  },
  // Two Heaps
  {
    front: "Two Heaps pattern — use case?",
    back: "Finding the median of a data stream. Use a max-heap for the lower half and a min-heap for the upper half. Balance sizes so median is at the top of one or both heaps.",
    deck: "patterns",
  },
  // Subsets/Backtracking
  {
    front: "Backtracking template?",
    back: "1) Choose: make a choice. 2) Explore: recurse with the choice. 3) Unchoose: undo the choice (backtrack). Base case: valid solution found → add to results.",
    deck: "patterns",
  },
  // Binary Search
  {
    front: "Modified Binary Search — common variations?",
    back: "Search in rotated array, find first/last occurrence, search in infinite array, find peak element, search in 2D matrix. Key: adjust mid comparison logic.",
    deck: "patterns",
  },
  // Top K Elements
  {
    front: "Top K Elements — which heap to use?",
    back: "Use a min-heap of size K. For each element, if it's larger than the heap's min, replace it. Result: the K largest elements remain in the heap. Time: O(n log k).",
    deck: "patterns",
  },
  // K-way Merge
  {
    front: "K-way Merge pattern?",
    back: "Use a min-heap to track the smallest current element from K sorted lists. Pop the smallest, push its next element from the same list. Continues until all lists are exhausted.",
    deck: "patterns",
  },
  // Topological Sort
  {
    front: "Topological Sort — when and how?",
    back: "For DAGs with dependencies. Kahn's algorithm: 1) Find nodes with 0 in-degree. 2) Process them, reduce neighbors' in-degree. 3) Add newly zero in-degree nodes. If result.length < nodes → cycle!",
    deck: "patterns",
  },
  // DP Fibonacci
  {
    front: "Dynamic Programming — Fibonacci pattern?",
    back: "When the problem has overlapping subproblems with optimal substructure. Bottom-up: build table from base cases. Top-down: memoize recursive calls. Optimize space with rolling variables.",
    deck: "patterns",
  },
  // General complexity cards
  {
    front: "O(1) vs O(log n) vs O(n) vs O(n log n) vs O(n²)?",
    back: "O(1): constant. O(log n): binary search. O(n): single loop. O(n log n): efficient sort. O(n²): nested loops. For n=1M: O(n²) = 10¹² ops (way too slow!).",
    deck: "complexity",
  },
  {
    front: "Space complexity of recursion?",
    back: "O(d) where d = max depth of recursion tree. Each call adds a stack frame. For binary tree DFS: O(h) where h = height. For balanced tree: O(log n). For skewed: O(n).",
    deck: "complexity",
  },
];

async function seedPatternFlashcards() {
  console.log("🃏 Seeding pattern flashcards...");

  // Find first user to assign cards to (or create a demo user)
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No users found. Please sign up first, then run this seed.");
    process.exit(1);
  }

  console.log(`Found user: ${user.name || user.email}`);

  // Create flashcards
  for (const card of patternFlashcards) {
    await prisma.flashCard.create({
      data: {
        userId: user.id,
        front: card.front,
        back: card.back,
        deck: card.deck,
      },
    });
  }

  console.log(`✅ Created ${patternFlashcards.length} flashcards`);

  // Initialize pattern progress for all 15 patterns
  const patternIds = [
    "two-pointers",
    "sliding-window",
    "fast-slow-pointers",
    "merge-intervals",
    "cyclic-sort",
    "linked-list-reversal",
    "tree-bfs",
    "tree-dfs",
    "two-heaps",
    "subsets-backtracking",
    "modified-binary-search",
    "top-k-elements",
    "k-way-merge",
    "topological-sort",
    "dp-fibonacci",
  ];

  for (let i = 0; i < patternIds.length; i++) {
    await prisma.patternProgress.upsert({
      where: {
        userId_patternSlug: {
          userId: user.id,
          patternSlug: patternIds[i],
        },
      },
      update: {},
      create: {
        userId: user.id,
        patternSlug: patternIds[i],
        status: i === 0 ? "in-progress" : i < 3 ? "available" : "locked",
      },
    });
  }

  console.log(`✅ Initialized progress for ${patternIds.length} patterns`);
}

seedPatternFlashcards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
