import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PatternSeed {
  slug: string;
  name: string;
  description: string;
  whenToUse: string;
  template: string;
  timeComplexity: string;
  spaceComplexity: string;
  difficulty: number;
  order: number;
  whenNotToUse?: string;
  commonMistakes?: string[];
}

const patterns: PatternSeed[] = [
  {
    slug: "basic-io",
    name: "Basic I/O",
    description: "Reading input and printing output.",
    whenToUse: "Foundational interaction with the user.",
    template: `name = input("Name: ")\nprint(f"Hello {name}")`,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "data-types",
    name: "Data Types & Variables",
    description: "Understanding int, float, str, bool and assignment.",
    whenToUse: "Every program requires data storage.",
    template: `x = 5\ny = "hello"\nb = True`,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "strings",
    name: "String Manipulation",
    description: "Slicing, indexing, and string methods.",
    whenToUse: "Processing text data.",
    template: `s = "hello"\nprint(s[::-1]) # Reverse`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "conditionals",
    name: "Conditional Logic",
    description: "Decision making with if/elif/else.",
    whenToUse: "Branching code paths.",
    template: `if x > 0:\n    print("Positive")\nelse:\n    print("Non-positive")`,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "loops",
    name: "Iteration & Loops",
    description: "Repeating work with while and for loops.",
    whenToUse: "Processing collections or repeated tasks.",
    template: `for i in range(5):\n    print(i)`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "arrays",
    name: "Array Basics",
    description: "Basic list operations (append, pop, index).",
    whenToUse: "Storing ordered collections.",
    template: `lst = [1, 2, 3]\nlst.append(4)`,
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "error-handling",
    name: "Error Handling",
    description: "Graceful failure with try/except.",
    whenToUse: "Handling unpredictable input or system states.",
    template: `try:\n    res = 10 / 0\nexcept ZeroDivisionError:\n    print("Safe")`,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "foundations",
    name: "Computational Foundations",
    description: "Basic logic and problem decomposition.",
    whenToUse: "Starting a new problem or project.",
    template: `# Break it down\n# Step 1...`,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    difficulty: 0,
    order: 0,
  },
  {
    slug: "hash-map",
    name: "Hash Map / Dictionary",
    description: "Use a hash map to store key-value pairs for fast lookup in O(1) time.",
    whenToUse: "When you need to count occurrences, map values, or check existence quickly.",
    template: `seen = {}
for item in items:
    if item in seen:
        # Found it
    else:
        seen[item] = value`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    difficulty: 1,
    order: 1,
  },
  {
    slug: "hash-set",
    name: "Hash Set",
    description: "Use a set to store unique values and check membership in O(1) time.",
    whenToUse: "When you need to track unique items or check if something exists.",
    template: `seen = set()
for item in items:
    if item in seen:
        # Duplicate found
    else:
        seen.add(item)`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    difficulty: 1,
    order: 2,
  },
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description: "Use two pointers moving towards each other or in the same direction for efficient traversal.",
    whenToUse: "Array problems, palindromes, finding pairs in sorted arrays.",
    template: `left, right = 0, len(arr) - 1
while left < right:
    if condition:
        left += 1
    else:
        right -= 1`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 3,
    whenNotToUse: `
**DO NOT use Two Pointers when:**

1. **The array is unsorted AND you need the original indices**
   - Sorting destroys index information
   - Use: Hash Map (O(n) time, O(n) space)

2. **You need ALL pairs, not just one valid pair**
   - Two Pointers finds one solution then exits
   - Use: Nested loops with pruning, or backtracking

3. **The problem requires non-contiguous elements with gaps**
   - Example: "Pick elements i and j where j - i > k"
   - Use: Sliding Window or Dynamic Programming

4. **You're comparing across two different arrays**
   - Two Pointers works on ONE array with two indices
   - Use: Merge technique (similar but different)

**Common Misapplication:**
"Sorted array? Use Two Pointers!" ← Wrong if you need original indices.
  `,
    commonMistakes: [
      "Moving both pointers in the same direction",
      "Not checking if array is sorted first",
      "Using on linked lists without handling next pointers carefully"
    ]
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description: "Maintain a window of elements and slide it to find optimal subarray/substring.",
    whenToUse: "Subarray/substring problems, max/min length, contiguous elements.",
    template: `left = 0
for right in range(len(arr)):
    # Expand window
    while condition:
        # Shrink window
        left += 1`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    difficulty: 2,
    order: 4,
    whenNotToUse: `
**DO NOT use Sliding Window when:**

1. **The subarray/substring is NOT contiguous**
   - If you can pick elements from anywhere, it's not a "window."
   - Use: Subsets, Hash Map, or Sorting.

2. **The array contains negative numbers (for sum-based windows)**
   - Negative numbers break the "expand until invalid, shrink until valid" logic because adding an element could decrease the sum.
   - Use: Prefix Sums or Dynamic Programming.

3. **Ordering within the window doesn't matter**
   - If you just need a collection of elements, a Hash Map alone is often simpler.
  `,
    commonMistakes: [
      "Forgetting to update the window state when shrinking from the left",
      "Incorrect while loop condition for shrinking",
      "Off-by-one errors with window length (right - left + 1)"
    ]
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    description: "Search in O(log n) by repeatedly dividing the search space in half.",
    whenToUse: "Sorted arrays, finding exact values or positions.",
    template: `left, right = 0, len(arr) - 1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
return -1`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 5,
    whenNotToUse: `
**DO NOT use Binary Search when:**

1. **The data is NOT sorted**
   - Binary Search relies on the transitive property (a < b and b < c).
   - Use: Linear Search or Sort first.

2. **The search space is too small**
   - For small arrays (e.g., n < 50), linear search is often faster due to cache locality and lower overhead.

3. **Accessing elements is expensive**
   - On a linked list, finding the "mid" takes O(n), negating the O(log n) benefit.
  `,
    commonMistakes: [
      "Incorrect mid calculation leading to overflow: (left + right) // 2 vs left + (right - left) // 2",
      "Using while left < right when you need while left <= right",
      "Updating pointers incorrectly (e.g., left = mid instead of left = mid + 1)"
    ]
  },
  {
    slug: "tree",
    name: "Tree Traversal",
    description: "Traverse tree structures using DFS (in-order, pre-order, post-order) or BFS.",
    whenToUse: "Tree problems, finding nodes, building trees, tree operations.",
    template: `def dfs(node):
    if not node:
        return
    process(node)
    dfs(node.left)
    dfs(node.right)`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    difficulty: 2,
    order: 6,
  },
  {
    slug: "graph",
    name: "Graph Traversal",
    description: "Traverse graphs using DFS or BFS to explore all reachable nodes.",
    whenToUse: "Connected components, cycle detection, shortest path, topological sort.",
    template: `def dfs(node, visited, graph):
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, visited, graph)`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    difficulty: 3,
    order: 7,
  },
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    description: "Break down problem into overlapping subproblems, store results to avoid recomputation.",
    whenToUse: "Optimization problems, counting problems, longest/shortest patterns.",
    template: `dp = [0] * (n + 1)
dp[0] = base_case
for i in range(1, n + 1):
    dp[i] = compute(dp[i-1], dp[i-2], ...)
return dp[n]`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    difficulty: 3,
    order: 8,
  },
  {
    slug: "stack",
    name: "Stack (LIFO)",
    description: "Use stack for LIFO operations - useful for matching problems and DFS.",
    whenToUse: "Parentheses matching, next greater element, monotonic stack problems.",
    template: `stack = []
for item in items:
    if condition:
        stack.pop()
    else:
        stack.append(item)
return stack`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    difficulty: 1,
    order: 9,
  },
  {
    slug: "heap",
    name: "Heap / Priority Queue",
    description: "Use min/max heap for efficient extraction of minimum/maximum elements.",
    whenToUse: "K-th largest/smallest, merge k lists, frequent elements.",
    template: `import heapq
heap = []
for item in items:
    heapq.heappush(heap, item)
while heap:
    smallest = heapq.heappop(heap)`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    difficulty: 2,
    order: 10,
  },
  {
    slug: "linked-list",
    name: "Linked List Manipulation",
    description: "Operate on linked lists using pointers and traversal.",
    whenToUse: "Linked list problems, reversing, merging, cycle detection.",
    template: `current = head
prev = None
while current:
    next_temp = current.next
    current.next = prev
    prev = current
    current = next_temp
return prev`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 11,
  },
  {
    slug: "backtracking",
    name: "Backtracking",
    description: "Explore all possible solutions by trying each option and undoing if it doesn't work.",
    whenToUse: "Permutations, combinations, subsets, sudoku, N-queens.",
    template: `def backtrack(path, choices):
    if is_solution(path):
        result.append(path[:])
        return
    for choice in choices:
        path.append(choice)
        backtrack(path, remaining_choices)
        path.pop()`,
    timeComplexity: "O(N!)",
    spaceComplexity: "O(N)",
    difficulty: 3,
    order: 12,
  },
  {
    slug: "sorting",
    name: "Sorting Algorithms",
    description: "Sort arrays using comparators or sorting techniques.",
    whenToUse: "Anagrams, sorted problems, ordering elements.",
    template: `# For custom sorting in Python
arr.sort(key=lambda x: custom_key)
# For sorting with multiple criteria
arr.sort(key=lambda x: (x[0], -x[1]))`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1) to O(n)",
    difficulty: 1,
    order: 13,
  },
  {
    slug: "prefix-product",
    name: "Prefix/Suffix Array",
    description: "Pre-compute prefix or suffix values to solve problems in one pass.",
    whenToUse: "Product of array except self, prefix sums, range queries.",
    template: `prefix = [0] * len(arr)
prefix[0] = 1
for i in range(1, len(arr)):
    prefix[i] = prefix[i-1] * arr[i-1]`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    difficulty: 2,
    order: 14,
  },
  {
    slug: "fast-slow-pointers",
    name: "Fast and Slow Pointers",
    description: "Use two pointers at different speeds (fast and slow) to detect cycles.",
    whenToUse: "Cycle detection in linked lists, middle of linked list.",
    template: `slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:  # Cycle detected
        return True`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 15,
  },
  {
    slug: "dfs",
    name: "Depth-First Search (DFS)",
    description: "Explicit DFS pattern for exploring graph structures deeply.",
    whenToUse: "Graph problems, tree problems, backtracking.",
    template: `def dfs(node, visited):
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, visited)`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    difficulty: 2,
    order: 16,
  },
  {
    slug: "bfs",
    name: "Breadth-First Search (BFS)",
    description: "Explore level by level using a queue for shortest path problems.",
    whenToUse: "Shortest path, level-order traversal, connected components.",
    template: `from collections import deque
queue = deque([start])
visited = {start}
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    difficulty: 2,
    order: 17,
  },
  {
    slug: "bfs-dfs",
    name: "BFS and DFS Combined",
    description: "Use both BFS and DFS for complementary aspects of graph exploration.",
    whenToUse: "Complex graph problems, finding all paths or patterns.",
    template: `def dfs(node, visited): ...
def bfs(start, visited): ...
# Use BFS for shortest path, DFS for all paths`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    difficulty: 3,
    order: 18,
  },
  {
    slug: "bst",
    name: "Binary Search Tree (BST)",
    description: "Operations on binary search trees: search, insert, delete.",
    whenToUse: "BST problems, finding ancestors, validating BST.",
    template: `def search_bst(node, val):
    if not node:
        return None
    if node.val == val:
        return node
    elif node.val > val:
        return search_bst(node.left, val)
    else:
        return search_bst(node.right, val)`,
    timeComplexity: "O(log n) to O(n)",
    spaceComplexity: "O(h)",
    difficulty: 2,
    order: 19,
  },
  {
    slug: "merge-intervals",
    name: "Merge Intervals",
    description: "Merge or process overlapping intervals efficiently.",
    whenToUse: "Interval problems, calendar scheduling, meeting rooms.",
    template: `intervals.sort()
merged = []
for start, end in intervals:
    if merged and start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    difficulty: 2,
    order: 20,
  },
  {
    slug: "topological-sort",
    name: "Topological Sort",
    description: "Sort DAG nodes such that parents come before children.",
    whenToUse: "Course schedule, build order, dependency resolution.",
    template: `from collections import deque
in_degree = {...}
queue = deque([node for node in graph if in_degree[node] == 0])
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        in_degree[neighbor] -= 1
        if in_degree[neighbor] == 0:
            queue.append(neighbor)`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    difficulty: 3,
    order: 21,
  },
  {
    slug: "union-find",
    name: "Union Find / Disjoint Set",
    description: "Track connected components and perform union-find operations.",
    whenToUse: "Connected components, cycle detection, Kruskal's algorithm.",
    template: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    def union(self, x, y):
        self.parent[self.find(x)] = self.find(y)`,
    timeComplexity: "O(α(n))",
    spaceComplexity: "O(n)",
    difficulty: 3,
    order: 22,
  },
  {
    slug: "trie",
    name: "Trie (Prefix Tree)",
    description: "Tree structure for efficient prefix-based searches.",
    whenToUse: "Word search, autocomplete, dictionary problems.",
    template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False
def add_word(root, word):
    node = root
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
    node.is_word = True`,
    timeComplexity: "O(m) where m is word length",
    spaceComplexity: "O(n * m)",
    difficulty: 3,
    order: 23,
  },
  {
    slug: "monotonic-deque",
    name: "Monotonic Deque",
    description: "Maintain a deque in monotonic order for sliding window problems.",
    whenToUse: "Sliding window maximum/minimum, max/min in subarrays.",
    template: `from collections import deque
dq = deque()
for i, num in enumerate(arr):
    while dq and arr[dq[-1]] <= num:
        dq.pop()
    dq.append(i)
    if i - dq[0] >= k:  # Window size check
        dq.popleft()`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    difficulty: 3,
    order: 24,
  },
  {
    slug: "design",
    name: "Design Patterns",
    description: "Design data structures or systems with specific operations.",
    whenToUse: "LRU cache, custom data structures, system design.",
    template: `class CustomDS:
    def __init__(self):
        self.cache = {}
        self.order = []
    def get(self, key):
        if key in self.cache:
            return self.cache[key]
        return -1
    def put(self, key, value):
        self.cache[key] = value`,
    timeComplexity: "Varies",
    spaceComplexity: "O(n)",
    difficulty: 3,
    order: 25,
  },
  {
    slug: "greedy",
    name: "Greedy",
    description: "Make the locally optimal choice at each step, hoping to find the global optimum. Greedy algorithms work when a problem has optimal substructure and the greedy-choice property.",
    whenToUse: "Scheduling, interval problems, activity selection, coin change (with certain denominations), Huffman coding, Dijkstra's algorithm.",
    template: `def greedy_approach(items):
    items.sort(key=lambda x: x[1])  # Sort by end time / weight / etc.
    result = []
    for item in items:
        if is_compatible(item, result):
            result.append(item)
    return result`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    difficulty: 2,
    order: 26,
    whenNotToUse: "When the problem requires considering all possibilities (use DP or backtracking instead). Classic trap: 0/1 Knapsack is NOT greedy-solvable.",
    commonMistakes: [
      "Assuming greedy works without proving the greedy-choice property",
      "Not sorting the input correctly before applying greedy logic",
      "Confusing greedy with dynamic programming problems (e.g. 0/1 knapsack)",
    ],
  },
  {
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    description: "Use bitwise operations (AND, OR, XOR, NOT, shifts) to solve problems efficiently. Particularly useful for toggling, checking, and setting individual bits.",
    whenToUse: "Finding single/unique numbers, power of two checks, subset generation, flag manipulation, optimization of space usage.",
    template: `# Common bit tricks
n & (n - 1)       # Clear lowest set bit
n & (-n)           # Isolate lowest set bit
n ^ n == 0         # XOR with self = 0
n ^ 0 == n         # XOR with 0 = n
n >> 1             # Divide by 2
n << 1             # Multiply by 2
bin(n).count('1')  # Count set bits`,
    timeComplexity: "O(1) to O(log n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 27,
    whenNotToUse: "When the problem involves floating point numbers or when simpler math operations suffice.",
    commonMistakes: [
      "Forgetting that Python integers have arbitrary precision (no overflow)",
      "Confusing arithmetic right shift with logical right shift",
      "Not handling negative numbers correctly with bitwise operations",
    ],
  },
];

export async function seedPatterns() {
  console.log(`🔗 Seeding ${patterns.length} patterns...`);

  for (const p of patterns) {
    try {
      const pattern = await prisma.pattern.upsert({
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
          whenNotToUse: p.whenNotToUse,
          commonMistakes: p.commonMistakes || [],
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
          whenNotToUse: p.whenNotToUse,
          commonMistakes: p.commonMistakes || [],
        },
      });
      console.log(`  ✓ Pattern: ${pattern.name}`);
    } catch (e) {
      console.warn(`  ⚠ Skipped ${p.slug}: `);
      console.error(e);
    }
  }
  const totalPatterns = await prisma.pattern.count();
  console.log(`\n  ✅ Seeded ${patterns.length}/${patterns.length} patterns`);
  console.log(`     Total patterns in DB: ${totalPatterns}`);
}

if (require.main === module || process.argv[1]?.includes('seed-patterns')) {
  seedPatterns()
    .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
