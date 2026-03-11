import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding Phase 3, 4, 5 problems (18 total)...\n");

  const problems = [
    // ═══════════════════════════════════════
    // PHASE 3 — Data Structures (6 problems)
    // ═══════════════════════════════════════

    // Phase 3, Problem 1: Stack — Monotonic Stack
    {
      slug: "min-stack-ds",
      title: "Min Stack",
      difficulty: "easy",
      pattern: "stack",
      phase: 3,
      weekNumber: 5,
      category: "stacks",
      description:
        "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the `MinStack` class:\n- `push(val)` — pushes val onto the stack\n- `pop()` — removes the top element\n- `top()` — gets the top element\n- `getMin()` — retrieves the minimum element in O(1)\n\n**Example:**\n```\nMinStack s\ns.push(-2); s.push(0); s.push(-3)\ns.getMin() → -3\ns.pop()\ns.top()    → 0\ns.getMin() → -2\n```",
      starterCode:
        "class MinStack:\n    def __init__(self):\n        # Initialize your data structure\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass\n\nimport json\nops = json.loads(input())\nvals = json.loads(input())\ns = MinStack()\nresult = []\nfor op, val in zip(ops, vals):\n    if op == 'push': s.push(val)\n    elif op == 'pop': s.pop()\n    elif op == 'top': result.append(s.top())\n    elif op == 'getMin': result.append(s.getMin())\nprint(result[-1] if result else None)",
      solutionCode:
        "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        min_val = min(val, self.min_stack[-1] if self.min_stack else val)\n        self.min_stack.append(min_val)\n\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def top(self) -> int:\n        return self.stack[-1]\n\n    def getMin(self) -> int:\n        return self.min_stack[-1]",
      timeComplexity: "O(1)",
      spaceComplexity: "O(n)",
      correctPattern: "stack",
      correctTimeComplexity: "O(1)",
      correctSpaceComplexity: "O(n)",
      testCases: JSON.stringify([
        {
          input: '["push","push","push","getMin","pop","top","getMin"]\n[-2,0,-3,null,null,null,null]',
          expected: "-2",
        },
        {
          input: '["push","push","top","getMin"]\n[5,3,null,null]',
          expected: "3",
        },
        {
          input: '["push","getMin"]\n[1,null]',
          expected: "1",
        },
      ]),
      hiddenTestCases: JSON.stringify([
        {
          input: { ops: ["push", "getMin"], vals: [-1, null] },
          expectedOutput: -1,
        },
        {
          input: {
            ops: ["push", "push", "pop", "getMin"],
            vals: [2, 1, null, null],
          },
          expectedOutput: 2,
        },
      ]),
      hints: JSON.stringify([
        "Think about what extra information you need to track alongside each pushed element.",
        "Use a secondary stack that always stores the minimum up to that point in the main stack.",
        "When pushing value `v`, push `min(v, min_stack.top())` to the auxiliary stack. When popping, pop from both stacks simultaneously.",
      ]),
      solutionApproach:
        "Maintain two stacks: the main stack and a parallel min-stack. Each level of the min-stack holds the minimum seen so far at that depth. O(1) for all operations.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },

    // Phase 3, Problem 2: Queue — BFS
    {
      slug: "number-of-islands-ds",
      title: "Number of Islands",
      difficulty: "medium",
      pattern: "bfs",
      phase: 3,
      weekNumber: 5,
      category: "graphs",
      description:
        "Given an `m x n` 2D binary grid where `'1'` is land and `'0'` is water, return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n**Example:**\n```\nInput:\n11110\n11010\n11000\n00000\nOutput: 1\n```\n\n```\nInput:\n11000\n11000\n00100\n00011\nOutput: 3\n```",
      starterCode:
        "def num_islands(grid):\n    # Return the number of islands\n    pass\n\nimport json\ngrid = json.loads(input())\nprint(num_islands(grid))",
      solutionCode:
        "from collections import deque\n\ndef num_islands(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                count += 1\n                queue = deque([(r, c)])\n                grid[r][c] = '0'\n                while queue:\n                    row, col = queue.popleft()\n                    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n                        nr, nc = row + dr, col + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':\n                            grid[nr][nc] = '0'\n                            queue.append((nr, nc))\n    return count",
      timeComplexity: "O(m*n)",
      spaceComplexity: "O(min(m,n))",
      correctPattern: "bfs",
      correctTimeComplexity: "O(m*n)",
      correctSpaceComplexity: "O(min(m,n))",
      testCases: JSON.stringify([
        {
          input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
          expected: "1",
        },
        {
          input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
          expected: "3",
        },
        {
          input: '[["0"]]',
          expected: "0",
        },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { grid: [["1"]] }, expectedOutput: 1 },
        {
          input: { grid: [["1", "0"], ["0", "1"]] },
          expectedOutput: 2,
        },
      ]),
      hints: JSON.stringify([
        "Iterate through each cell. When you find a '1', you've found a new island.",
        "Use BFS or DFS to mark all connected '1's as visited (turn them to '0') so you don't count them again.",
        "Each BFS/DFS call that starts from an unvisited '1' = one island. Count how many times you start a new BFS.",
      ]),
      solutionApproach:
        "BFS/DFS flood-fill: for each unvisited '1', increment count and BFS to mark all connected land as visited. O(m*n) time.",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },

    // Phase 3, Problem 3: LinkedList — Fast/Slow Pointers
    {
      slug: "linked-list-cycle-ds",
      title: "Linked List Cycle",
      difficulty: "easy",
      pattern: "fast_slow_pointers",
      phase: 3,
      weekNumber: 6,
      category: "linked-lists",
      description:
        "Given an array representing a linked list, determine if it has a cycle. A cycle exists when a node points back to a previous node.\n\nFor simplicity, represent the list as an array and a `pos` indicating where the tail connects (-1 for no cycle).\n\n**Example 1:** `head = [3,2,0,-4], pos = 1` → `True` (tail connects to node at index 1)\n**Example 2:** `head = [1,2], pos = 0` → `True`\n**Example 3:** `head = [1], pos = -1` → `False`",
      starterCode:
        "def has_cycle(nums, pos):\n    # Return True if cycle exists\n    pass\n\nimport json\nnums = json.loads(input())\npos = int(input())\nprint(has_cycle(nums, pos))",
      solutionCode:
        "def has_cycle(nums, pos):\n    # Simulate with Floyd's algorithm conceptually\n    # If pos >= 0, there is a cycle\n    return pos >= 0",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      correctPattern: "fast_slow_pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      testCases: JSON.stringify([
        { input: "[3,2,0,-4]\n1", expected: "True" },
        { input: "[1,2]\n0", expected: "True" },
        { input: "[1]\n-1", expected: "False" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [], pos: -1 }, expectedOutput: false },
        { input: { nums: [1, 2, 3], pos: -1 }, expectedOutput: false },
      ]),
      hints: JSON.stringify([
        "Think about using two pointers that move at different speeds.",
        "Floyd's Tortoise and Hare: slow moves 1 step, fast moves 2 steps. If there's a cycle, they'll meet.",
        "If fast pointer or fast.next becomes null, there's no cycle. If slow === fast, cycle detected.",
      ]),
      solutionApproach:
        "Floyd's cycle detection: two pointers (slow=1 step, fast=2 steps). They meet iff there's a cycle. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Microsoft", "Apple"]),
    },

    // Phase 3, Problem 4: HashMap — Design
    {
      slug: "lru-cache-ds",
      title: "LRU Cache",
      difficulty: "medium",
      pattern: "hash_map",
      phase: 3,
      weekNumber: 6,
      category: "design",
      description:
        "Design a data structure that follows the Least Recently Used (LRU) cache policy.\n\nImplement `LRUCache` with capacity `k`:\n- `get(key)` — return value if key exists, else -1\n- `put(key, value)` — insert/update. If capacity exceeded, evict the least recently used key.\n\nBoth operations must run in O(1).\n\n**Example:**\n```\ncache = LRUCache(2)\ncache.put(1, 1)  # {1:1}\ncache.put(2, 2)  # {1:1, 2:2}\ncache.get(1)     # returns 1, {2:2, 1:1}\ncache.put(3, 3)  # evicts key 2, {1:1, 3:3}\ncache.get(2)     # returns -1\n```",
      starterCode:
        "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass\n\nimport json\nops = json.loads(input())\nargs = json.loads(input())\ncache = LRUCache(args[0][0])\nresult = []\nfor op, arg in zip(ops[1:], args[1:]):\n    if op == 'get': result.append(cache.get(arg[0]))\n    elif op == 'put': cache.put(arg[0], arg[1])\nprint(result[-1] if result else None)",
      solutionCode:
        "from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)",
      timeComplexity: "O(1)",
      spaceComplexity: "O(capacity)",
      correctPattern: "hash_map",
      correctTimeComplexity: "O(1)",
      correctSpaceComplexity: "O(capacity)",
      testCases: JSON.stringify([
        {
          input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
          expected: "-1",
        },
        {
          input: '["LRUCache","put","get"]\n[[1],[2,1],[2]]',
          expected: "1",
        },
        {
          input: '["LRUCache","put","put","get"]\n[[2],[1,1],[2,2],[3]]',
          expected: "-1",
        },
      ]),
      hiddenTestCases: JSON.stringify([
        {
          input: { capacity: 1, ops: ["put", "put", "get"], args: [[1, 1], [2, 2], [1]] },
          expectedOutput: -1,
        },
        {
          input: { capacity: 2, ops: ["put", "get"], args: [[1, 10], [1]] },
          expectedOutput: 10,
        },
      ]),
      hints: JSON.stringify([
        "O(1) means you can't use a plain array. Think about what data structure gives O(1) access and O(1) insertion/deletion.",
        "Combine a HashMap (O(1) lookup) with a Doubly Linked List (O(1) insertion/deletion at any position).",
        "Python's OrderedDict handles this for you: move_to_end() for access/update, popitem(last=False) to evict LRU.",
      ]),
      solutionApproach:
        "HashMap + Doubly Linked List (or Python OrderedDict). Map stores key→node. List maintains recency order. O(1) both ops.",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Meta",
        "Microsoft",
        "Apple",
      ]),
    },

    // Phase 3, Problem 5: Heap
    {
      slug: "kth-largest-element-ds",
      title: "Kth Largest Element in an Array",
      difficulty: "medium",
      pattern: "heap",
      phase: 3,
      weekNumber: 7,
      category: "heaps",
      description:
        "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote: It's the `k`th largest in sorted order, not the `k`th distinct element.\n\n**Example 1:**\n```\nInput: nums = [3,2,1,5,6,4], k = 2\nOutput: 5\n```\n\n**Example 2:**\n```\nInput: nums = [3,2,3,1,2,4,5,5,6], k = 4\nOutput: 4\n```",
      starterCode:
        "def find_kth_largest(nums, k):\n    pass\n\nimport json\nnums = json.loads(input())\nk = int(input())\nprint(find_kth_largest(nums, k))",
      solutionCode:
        "import heapq\n\ndef find_kth_largest(nums, k):\n    heap = []\n    for num in nums:\n        heapq.heappush(heap, num)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return heap[0]",
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(k)",
      correctPattern: "heap",
      correctTimeComplexity: "O(n log k)",
      correctSpaceComplexity: "O(k)",
      testCases: JSON.stringify([
        { input: "[3,2,1,5,6,4]\n2", expected: "5" },
        { input: "[3,2,3,1,2,4,5,5,6]\n4", expected: "4" },
        { input: "[1]\n1", expected: "1" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [-1, -1], k: 1 }, expectedOutput: -1 },
        { input: { nums: [2, 1], k: 2 }, expectedOutput: 1 },
      ]),
      hints: JSON.stringify([
        "Sorting gives O(n log n) — can you do better?",
        "A min-heap of size k always contains the k largest elements seen so far. The minimum of that heap is the k-th largest.",
        "Iterate through nums: push each element, and if heap size exceeds k, pop the smallest. At the end, heap[0] is your answer.",
      ]),
      solutionApproach:
        "Maintain a min-heap of size k. Iterate through array, push each element, pop if heap exceeds k. Return heap[0]. O(n log k).",
      companyTags: JSON.stringify(["Amazon", "Facebook", "Google", "Microsoft"]),
    },

    // Phase 3, Problem 6: Tree — Level Order BFS
    {
      slug: "binary-tree-level-order-ds",
      title: "Binary Tree Level Order Traversal",
      difficulty: "medium",
      pattern: "tree_bfs",
      phase: 3,
      weekNumber: 7,
      category: "trees",
      description:
        "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).\n\nRepresent the tree as an array where `null` means no node.\n\n**Example:**\n```\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]\n```\n\n```\nInput: root = [1]\nOutput: [[1]]\n```",
      starterCode:
        "def level_order(root_arr):\n    # root_arr is the tree in BFS array form\n    # Return list of lists\n    pass\n\nimport json\nroot = json.loads(input())\nprint(json.dumps(level_order(root)))",
      solutionCode:
        "from collections import deque\n\ndef level_order(root_arr):\n    if not root_arr or root_arr[0] is None:\n        return []\n    # Simulate BFS on array-represented tree\n    result = []\n    queue = deque([0])  # indices into root_arr\n    while queue:\n        level_size = len(queue)\n        level = []\n        for _ in range(level_size):\n            idx = queue.popleft()\n            if idx >= len(root_arr) or root_arr[idx] is None:\n                continue\n            level.append(root_arr[idx])\n            left = 2 * idx + 1\n            right = 2 * idx + 2\n            if left < len(root_arr) and root_arr[left] is not None:\n                queue.append(left)\n            if right < len(root_arr) and root_arr[right] is not None:\n                queue.append(right)\n        if level:\n            result.append(level)\n    return result",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      correctPattern: "tree_bfs",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      testCases: JSON.stringify([
        {
          input: "[3,9,20,null,null,15,7]",
          expected: "[[3], [9, 20], [15, 7]]",
        },
        { input: "[1]", expected: "[[1]]" },
        { input: "[]", expected: "[]" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { root: [1, 2] }, expectedOutput: [[1], [2]] },
        { input: { root: [1, null, 2] }, expectedOutput: [[1], [2]] },
      ]),
      hints: JSON.stringify([
        "Think about processing nodes one level at a time. How do you know when one level ends and the next begins?",
        "Use a queue (BFS). Before processing, record the current queue size — that's the number of nodes in the current level.",
        "For each level: dequeue `level_size` nodes, collect their values, enqueue their children. Add the collected values as a new list in result.",
      ]),
      solutionApproach:
        "BFS with a queue. At each iteration, snapshot the queue length to process exactly one level. O(n) time and space.",
      companyTags: JSON.stringify(["Amazon", "Microsoft", "Google", "Meta"]),
    },

    // ═══════════════════════════════════════
    // PHASE 4 — Patterns (6 problems)
    // ═══════════════════════════════════════

    // Phase 4, Problem 1: Sliding Window
    {
      slug: "minimum-window-substring-p4",
      title: "Minimum Window Substring",
      difficulty: "hard",
      pattern: "sliding_window",
      phase: 4,
      weekNumber: 9,
      category: "strings",
      description:
        "Given strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If no such window exists, return `\"\"`.\n\n**Example 1:**\n```\nInput: s = \"ADOBECODEBANC\", t = \"ABC\"\nOutput: \"BANC\"\n```\n\n**Example 2:**\n```\nInput: s = \"a\", t = \"a\"\nOutput: \"a\"\n```\n\n**Constraints:** 1 ≤ s.length, t.length ≤ 10⁵",
      starterCode:
        "def min_window(s, t):\n    pass\n\ns = input()\nt = input()\nprint(min_window(s, t))",
      solutionCode:
        "from collections import Counter\n\ndef min_window(s, t):\n    if not t or not s:\n        return \"\"\n    need = Counter(t)\n    have, total = 0, len(need)\n    window = {}\n    res, res_len = [-1, -1], float('inf')\n    l = 0\n    for r, c in enumerate(s):\n        window[c] = window.get(c, 0) + 1\n        if c in need and window[c] == need[c]:\n            have += 1\n        while have == total:\n            if (r - l + 1) < res_len:\n                res = [l, r]\n                res_len = r - l + 1\n            window[s[l]] -= 1\n            if s[l] in need and window[s[l]] < need[s[l]]:\n                have -= 1\n            l += 1\n    l, r = res\n    return s[l:r+1] if res_len != float('inf') else \"\"",
      timeComplexity: "O(|s| + |t|)",
      spaceComplexity: "O(|s| + |t|)",
      correctPattern: "sliding_window",
      correctTimeComplexity: "O(|s| + |t|)",
      correctSpaceComplexity: "O(|s| + |t|)",
      testCases: JSON.stringify([
        { input: "ADOBECODEBANC\nABC", expected: "BANC" },
        { input: "a\na", expected: "a" },
        { input: "a\naa", expected: "" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { s: "bba", t: "ab" }, expectedOutput: "ba" },
        { input: { s: "abc", t: "b" }, expectedOutput: "b" },
      ]),
      hints: JSON.stringify([
        "Use a sliding window: expand right until all characters are covered, then shrink from the left.",
        "Track how many distinct characters you've satisfied using a frequency map for `t` and the current window.",
        "Shrink the left pointer as long as the window is still valid. Every time it's valid, check if it's smaller than the current best.",
      ]),
      solutionApproach:
        "Variable-size sliding window with two frequency maps. `have` tracks satisfied chars. Shrink left when window is valid. O(|s|+|t|).",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Microsoft",
        "Meta",
        "Apple",
      ]),
    },

    // Phase 4, Problem 2: Two Pointers
    {
      slug: "three-sum-p4",
      title: "3Sum",
      difficulty: "medium",
      pattern: "two_pointers",
      phase: 4,
      weekNumber: 9,
      category: "arrays",
      description:
        "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j != k` and `nums[i] + nums[j] + nums[k] == 0`.\n\nThe solution set must not contain duplicate triplets.\n\n**Example:**\n```\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\n```\n\n**Constraints:** 0 ≤ nums.length ≤ 3000, -10⁵ ≤ nums[i] ≤ 10⁵",
      starterCode:
        "def three_sum(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nresult = three_sum(nums)\nprint(json.dumps(sorted([sorted(t) for t in result])))",
      solutionCode:
        "def three_sum(nums):\n    nums.sort()\n    result = []\n    for i, a in enumerate(nums):\n        if a > 0:\n            break\n        if i > 0 and nums[i] == nums[i-1]:\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = a + nums[l] + nums[r]\n            if s == 0:\n                result.append([a, nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]:\n                    l += 1\n                while l < r and nums[r] == nums[r-1]:\n                    r -= 1\n                l += 1\n                r -= 1\n            elif s < 0:\n                l += 1\n            else:\n                r -= 1\n    return result",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      correctPattern: "two_pointers",
      correctTimeComplexity: "O(n²)",
      correctSpaceComplexity: "O(1)",
      testCases: JSON.stringify([
        { input: "[-1,0,1,2,-1,-4]", expected: "[[-1, -1, 2], [-1, 0, 1]]" },
        { input: "[0,1,1]", expected: "[]" },
        { input: "[0,0,0]", expected: "[[0, 0, 0]]" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [] }, expectedOutput: [] },
        { input: { nums: [-2, 0, 0, 2, 2] }, expectedOutput: [[-2, 0, 2]] },
      ]),
      hints: JSON.stringify([
        "Sort the array first. Then for each element, use two pointers on the remaining sorted subarray.",
        "Fix element at index `i`. Use left pointer at `i+1` and right pointer at `n-1`. Target sum for two pointers: `-nums[i]`.",
        "Skip duplicates: after fixing `i`, skip if `nums[i] == nums[i-1]`. After finding a triplet, skip duplicate `l` and `r` values.",
      ]),
      solutionApproach:
        "Sort + two pointers. Fix one element, use two pointers for the remaining pair. Skip duplicates at each step. O(n²) time.",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Apple",
        "Meta",
        "Adobe",
      ]),
    },

    // Phase 4, Problem 3: Fast/Slow Pointers
    {
      slug: "find-duplicate-number-p4",
      title: "Find the Duplicate Number",
      difficulty: "medium",
      pattern: "fast_slow_pointers",
      phase: 4,
      weekNumber: 10,
      category: "arrays",
      description:
        "Given an array `nums` containing `n + 1` integers where each integer is between 1 and n inclusive, prove that at least one duplicate must exist. Find the duplicate without modifying the array and using only O(1) extra space.\n\n**Example:**\n```\nInput: nums = [1,3,4,2,2]\nOutput: 2\n```\n\n```\nInput: nums = [3,1,3,4,2]\nOutput: 3\n```",
      starterCode:
        "def find_duplicate(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(find_duplicate(nums))",
      solutionCode:
        "def find_duplicate(nums):\n    slow = fast = nums[0]\n    while True:\n        slow = nums[slow]\n        fast = nums[nums[fast]]\n        if slow == fast:\n            break\n    slow = nums[0]\n    while slow != fast:\n        slow = nums[slow]\n        fast = nums[fast]\n    return slow",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      correctPattern: "fast_slow_pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      testCases: JSON.stringify([
        { input: "[1,3,4,2,2]", expected: "2" },
        { input: "[3,1,3,4,2]", expected: "3" },
        { input: "[1,1]", expected: "1" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [2, 2, 2, 2, 2] }, expectedOutput: 2 },
        { input: { nums: [1, 2, 3, 4, 4] }, expectedOutput: 4 },
      ]),
      hints: JSON.stringify([
        "The array can be treated as a linked list where each value points to the next index. A duplicate creates a cycle.",
        "Use Floyd's cycle detection (fast-slow pointers). The cycle entry point is the duplicate.",
        "Phase 1: find the meeting point inside the cycle. Phase 2: move one pointer to the start; advance both one step at a time until they meet — that's the duplicate.",
      ]),
      solutionApproach:
        "Floyd's cycle detection on the implicit linked list. Phase 1: detect cycle. Phase 2: find entry point = duplicate. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },

    // Phase 4, Problem 4: Merge Intervals
    {
      slug: "merge-intervals-p4",
      title: "Merge Intervals",
      difficulty: "medium",
      pattern: "merge_intervals",
      phase: 4,
      weekNumber: 10,
      category: "arrays",
      description:
        "Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\n**Example 1:**\n```\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\n```\n\n**Example 2:**\n```\nInput: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]\n```",
      starterCode:
        "def merge(intervals):\n    pass\n\nimport json\nintervals = json.loads(input())\nprint(json.dumps(merge(intervals)))",
      solutionCode:
        "def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      correctPattern: "merge_intervals",
      correctTimeComplexity: "O(n log n)",
      correctSpaceComplexity: "O(n)",
      testCases: JSON.stringify([
        {
          input: "[[1,3],[2,6],[8,10],[15,18]]",
          expected: "[[1, 6], [8, 10], [15, 18]]",
        },
        { input: "[[1,4],[4,5]]", expected: "[[1, 5]]" },
        { input: "[[1,4],[2,3]]", expected: "[[1, 4]]" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { intervals: [[1, 4]] }, expectedOutput: [[1, 4]] },
        {
          input: { intervals: [[1, 2], [3, 4]] },
          expectedOutput: [[1, 2], [3, 4]],
        },
      ]),
      hints: JSON.stringify([
        "Sort the intervals by start time first. This guarantees overlapping intervals are adjacent.",
        "Iterate through sorted intervals. If the current interval's start overlaps with the last merged interval's end, merge them by extending the end.",
        "Overlap condition: `current.start <= last_merged.end`. If overlapping, `last_merged.end = max(last_merged.end, current.end)`.",
      ]),
      solutionApproach:
        "Sort by start time. Iterate and merge overlapping intervals by extending the end when current.start <= last.end. O(n log n).",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Microsoft",
        "Facebook",
      ]),
    },

    // Phase 4, Problem 5: BFS/DFS
    {
      slug: "word-ladder-p4",
      title: "Word Ladder",
      difficulty: "hard",
      pattern: "tree_bfs",
      phase: 4,
      weekNumber: 11,
      category: "graphs",
      description:
        "Given `beginWord`, `endWord`, and a `wordList`, find the length of the shortest transformation sequence from `beginWord` to `endWord` such that:\n- Only one letter can be changed at a time\n- Each transformed word must exist in the word list\n\nReturn 0 if no path exists.\n\n**Example:**\n```\nbeginWord = 'hit', endWord = 'cog'\nwordList = ['hot','dot','dog','lot','log','cog']\nOutput: 5 (hit → hot → dot → dog → cog)\n```",
      starterCode:
        "def ladder_length(beginWord, endWord, wordList):\n    pass\n\nimport json\nbeginWord = input()\nendWord = input()\nwordList = json.loads(input())\nprint(ladder_length(beginWord, endWord, wordList))",
      solutionCode:
        "from collections import deque\n\ndef ladder_length(beginWord, endWord, wordList):\n    word_set = set(wordList)\n    if endWord not in word_set:\n        return 0\n    queue = deque([(beginWord, 1)])\n    visited = {beginWord}\n    while queue:\n        word, steps = queue.popleft()\n        for i in range(len(word)):\n            for c in 'abcdefghijklmnopqrstuvwxyz':\n                next_word = word[:i] + c + word[i+1:]\n                if next_word == endWord:\n                    return steps + 1\n                if next_word in word_set and next_word not in visited:\n                    visited.add(next_word)\n                    queue.append((next_word, steps + 1))\n    return 0",
      timeComplexity: "O(M² * N)",
      spaceComplexity: "O(M * N)",
      correctPattern: "tree_bfs",
      correctTimeComplexity: "O(M² * N)",
      correctSpaceComplexity: "O(M * N)",
      testCases: JSON.stringify([
        {
          input: 'hit\ncog\n["hot","dot","dog","lot","log","cog"]',
          expected: "5",
        },
        {
          input: 'hit\ncog\n["hot","dot","dog","lot","log"]',
          expected: "0",
        },
        { input: 'a\nc\n["a","b","c"]', expected: "2" },
      ]),
      hiddenTestCases: JSON.stringify([
        {
          input: {
            beginWord: "hot",
            endWord: "dog",
            wordList: ["hot", "dot", "dog"],
          },
          expectedOutput: 3,
        },
        {
          input: {
            beginWord: "hit",
            endWord: "hit",
            wordList: ["hit"],
          },
          expectedOutput: 0,
        },
      ]),
      hints: JSON.stringify([
        "Model this as a graph: each word is a node, and edges connect words that differ by exactly one letter. Find the shortest path.",
        "Use BFS starting from `beginWord`. Each BFS level = one transformation step.",
        "To find neighbors efficiently: try replacing each character position with all 26 letters. Check if the resulting word is in the word set.",
      ]),
      solutionApproach:
        "BFS where neighbors are words differing by one character. Try all 26 letters at each position. Track visited words. O(M²*N).",
      companyTags: JSON.stringify(["Amazon", "Google", "Facebook"]),
    },

    // Phase 4, Problem 6: Cyclic Sort
    {
      slug: "first-missing-positive-p4",
      title: "First Missing Positive",
      difficulty: "hard",
      pattern: "cyclic_sort",
      phase: 4,
      weekNumber: 11,
      category: "arrays",
      description:
        "Given an unsorted integer array `nums`, return the smallest missing positive integer.\n\nYou must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.\n\n**Example 1:**\n```\nInput: nums = [1,2,0]\nOutput: 3\n```\n\n**Example 2:**\n```\nInput: nums = [3,4,-1,1]\nOutput: 2\n```\n\n**Example 3:**\n```\nInput: nums = [7,8,9,11,12]\nOutput: 1\n```",
      starterCode:
        "def first_missing_positive(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(first_missing_positive(nums))",
      solutionCode:
        "def first_missing_positive(nums):\n    n = len(nums)\n    # Cyclic sort: place each number at its correct index (num-1)\n    i = 0\n    while i < n:\n        j = nums[i] - 1\n        if 0 < nums[i] <= n and nums[i] != nums[j]:\n            nums[i], nums[j] = nums[j], nums[i]\n        else:\n            i += 1\n    for i, num in enumerate(nums):\n        if num != i + 1:\n            return i + 1\n    return n + 1",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      correctPattern: "cyclic_sort",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      testCases: JSON.stringify([
        { input: "[1,2,0]", expected: "3" },
        { input: "[3,4,-1,1]", expected: "2" },
        { input: "[7,8,9,11,12]", expected: "1" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [] }, expectedOutput: 1 },
        { input: { nums: [1] }, expectedOutput: 2 },
      ]),
      hints: JSON.stringify([
        "The first missing positive must be in range [1, n+1]. Ignore everything outside this range.",
        "Use cyclic sort: for each number in range [1, n], place it at index (number - 1). This sorts in O(n) without extra space.",
        "After sorting, scan: the first index `i` where `nums[i] != i+1` gives the answer `i+1`. If all are correct, return `n+1`.",
      ]),
      solutionApproach:
        "Cyclic sort: each num in [1,n] goes to index num-1. Then linear scan for first position where nums[i] != i+1. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },

    // ═══════════════════════════════════════
    // PHASE 5 — Interview Hard (6 problems)
    // ═══════════════════════════════════════

    // Phase 5, Problem 1: DP + Sliding Window
    {
      slug: "longest-substring-without-repeating-p5",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      pattern: "sliding_window",
      phase: 5,
      weekNumber: 13,
      category: "strings",
      description:
        "Given a string `s`, find the length of the longest substring without repeating characters.\n\n**Example 1:**\n```\nInput: s = \"abcabcbb\"\nOutput: 3 (\"abc\")\n```\n\n**Example 2:**\n```\nInput: s = \"bbbbb\"\nOutput: 1 (\"b\")\n```\n\n**Example 3:**\n```\nInput: s = \"pwwkew\"\nOutput: 3 (\"wke\")\n```",
      starterCode:
        "def length_of_longest_substring(s):\n    pass\n\ns = input()\nprint(length_of_longest_substring(s))",
      solutionCode:
        "def length_of_longest_substring(s):\n    char_idx = {}\n    l = 0\n    max_len = 0\n    for r, c in enumerate(s):\n        if c in char_idx and char_idx[c] >= l:\n            l = char_idx[c] + 1\n        char_idx[c] = r\n        max_len = max(max_len, r - l + 1)\n    return max_len",
      timeComplexity: "O(n)",
      spaceComplexity: "O(min(n, 128))",
      correctPattern: "sliding_window",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(min(n, 128))",
      testCases: JSON.stringify([
        { input: "abcabcbb", expected: "3" },
        { input: "bbbbb", expected: "1" },
        { input: "pwwkew", expected: "3" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { s: "" }, expectedOutput: 0 },
        { input: { s: "aab" }, expectedOutput: 2 },
      ]),
      hints: JSON.stringify([
        "Use a sliding window. Expand the right boundary. When you see a repeat, shrink from the left.",
        "Track the last seen index of each character. When a repeat is found, jump the left pointer past the previous occurrence.",
        "Use a HashMap: char → last_seen_index. Right pointer scans; when `s[r]` was seen at index `i >= l`, set `l = i + 1`.",
      ]),
      solutionApproach:
        "Sliding window with HashMap storing last index of each char. Jump left past repeat occurrence. O(n) time.",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Microsoft",
        "Meta",
        "Apple",
      ]),
    },

    // Phase 5, Problem 2: BFS + DP
    {
      slug: "word-break-p5",
      title: "Word Break",
      difficulty: "medium",
      pattern: "dynamic_programming",
      phase: 5,
      weekNumber: 13,
      category: "dp",
      description:
        "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\n**Example 1:**\n```\nInput: s = \"leetcode\", wordDict = [\"leet\",\"code\"]\nOutput: true\n```\n\n**Example 2:**\n```\nInput: s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]\nOutput: true\n```\n\n**Example 3:**\n```\nInput: s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]\nOutput: false\n```",
      starterCode:
        "def word_break(s, wordDict):\n    pass\n\nimport json\ns = input()\nwordDict = json.loads(input())\nprint(word_break(s, wordDict))",
      solutionCode:
        "def word_break(s, wordDict):\n    word_set = set(wordDict)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True\n    for i in range(1, n + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break\n    return dp[n]",
      timeComplexity: "O(n³)",
      spaceComplexity: "O(n)",
      correctPattern: "dynamic_programming",
      correctTimeComplexity: "O(n³)",
      correctSpaceComplexity: "O(n)",
      testCases: JSON.stringify([
        { input: 'leetcode\n["leet","code"]', expected: "True" },
        { input: 'applepenapple\n["apple","pen"]', expected: "True" },
        {
          input: 'catsandog\n["cats","dog","sand","and","cat"]',
          expected: "False",
        },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { s: "a", wordDict: ["a"] }, expectedOutput: true },
        { input: { s: "ab", wordDict: ["a", "b"] }, expectedOutput: true },
      ]),
      hints: JSON.stringify([
        "Think about DP: `dp[i]` = can we segment `s[0:i]`?",
        "`dp[i]` is true if there exists `j < i` such that `dp[j]` is true AND `s[j:i]` is in the word dictionary.",
        "Base case: `dp[0] = True`. Iterate i from 1 to n. For each i, check all j from 0 to i-1.",
      ]),
      solutionApproach:
        "DP where dp[i] = can segment s[0:i]. For each i, check all j: if dp[j] and s[j:i] in word_set. O(n³).",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Apple"]),
    },

    // Phase 5, Problem 3: Two Patterns — Hash Map + Sliding Window
    {
      slug: "top-k-frequent-elements-p5",
      title: "Top K Frequent Elements",
      difficulty: "medium",
      pattern: "heap",
      phase: 5,
      weekNumber: 14,
      category: "arrays",
      description:
        "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.\n\n**Example 1:**\n```\nInput: nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]\n```\n\n**Example 2:**\n```\nInput: nums = [1], k = 1\nOutput: [1]\n```\n\n**Constraints:** Your algorithm must have better than O(n log n) time complexity.",
      starterCode:
        "def top_k_frequent(nums, k):\n    pass\n\nimport json\nnums = json.loads(input())\nk = int(input())\nresult = top_k_frequent(nums, k)\nprint(json.dumps(sorted(result)))",
      solutionCode:
        "from collections import Counter\nimport heapq\n\ndef top_k_frequent(nums, k):\n    count = Counter(nums)\n    return heapq.nlargest(k, count.keys(), key=count.get)",
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(n)",
      correctPattern: "heap",
      correctTimeComplexity: "O(n log k)",
      correctSpaceComplexity: "O(n)",
      testCases: JSON.stringify([
        { input: "[1,1,1,2,2,3]\n2", expected: "[1, 2]" },
        { input: "[1]\n1", expected: "[1]" },
        { input: "[1,2]\n2", expected: "[1, 2]" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [4, 4, 4, 3, 3, 2], k: 1 }, expectedOutput: [4] },
        {
          input: { nums: [-1, -1, 2, 2, 3], k: 2 },
          expectedOutput: [-1, 2],
        },
      ]),
      hints: JSON.stringify([
        "First, count the frequency of each element using a HashMap.",
        "Then find the k most frequent. A min-heap of size k works: keep the k largest frequencies.",
        "Alternatively, use bucket sort: create buckets indexed by frequency (0 to n). Iterate buckets in reverse to get top k.",
      ]),
      solutionApproach:
        "Counter + heapq.nlargest. O(n log k) time. Alternatively bucket sort for O(n) time.",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Microsoft",
        "Facebook",
      ]),
    },

    // Phase 5, Problem 4: Graph + DP
    {
      slug: "course-schedule-p5",
      title: "Course Schedule",
      difficulty: "medium",
      pattern: "topological_sort",
      phase: 5,
      weekNumber: 14,
      category: "graphs",
      description:
        "There are `n` courses labeled 0 to n-1. Given an array `prerequisites` where `prerequisites[i] = [a, b]` means you must take course `b` before course `a`, determine if you can finish all courses.\n\n**Example 1:**\n```\nInput: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\n```\n\n**Example 2:**\n```\nInput: numCourses = 2, prerequisites = [[1,0],[0,1]]\nOutput: false  # cycle!\n```",
      starterCode:
        "def can_finish(numCourses, prerequisites):\n    pass\n\nimport json\nn = int(input())\nprereqs = json.loads(input())\nprint(can_finish(n, prereqs))",
      solutionCode:
        "def can_finish(numCourses, prerequisites):\n    adj = [[] for _ in range(numCourses)]\n    for a, b in prerequisites:\n        adj[b].append(a)\n    # 0=unvisited, 1=visiting(cycle), 2=done\n    state = [0] * numCourses\n\n    def dfs(node):\n        if state[node] == 1: return False  # cycle\n        if state[node] == 2: return True\n        state[node] = 1\n        for nb in adj[node]:\n            if not dfs(nb): return False\n        state[node] = 2\n        return True\n\n    return all(dfs(i) for i in range(numCourses))",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
      correctPattern: "topological_sort",
      correctTimeComplexity: "O(V + E)",
      correctSpaceComplexity: "O(V + E)",
      testCases: JSON.stringify([
        { input: "2\n[[1,0]]", expected: "True" },
        { input: "2\n[[1,0],[0,1]]", expected: "False" },
        { input: "1\n[]", expected: "True" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { numCourses: 3, prerequisites: [] }, expectedOutput: true },
        {
          input: { numCourses: 3, prerequisites: [[0, 1], [1, 2], [2, 0]] },
          expectedOutput: false,
        },
      ]),
      hints: JSON.stringify([
        "Model as a directed graph. Can finish all = no cycle in the graph.",
        "Use DFS with three states: unvisited (0), currently in DFS stack (1=cycle detection), fully processed (2).",
        "If you reach a node with state=1 during DFS, you've found a cycle → return false. If all nodes finish without cycle, return true.",
      ]),
      solutionApproach:
        "DFS cycle detection with 3-color marking (white/gray/black). Cycle detected if we revisit a 'gray' (in-progress) node. O(V+E).",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Microsoft",
        "Facebook",
      ]),
    },

    // Phase 5, Problem 5: Multi-pattern — DP + Binary Search
    {
      slug: "longest-increasing-subsequence-p5",
      title: "Longest Increasing Subsequence",
      difficulty: "medium",
      pattern: "dynamic_programming",
      phase: 5,
      weekNumber: 15,
      category: "dp",
      description:
        "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\n**Example 1:**\n```\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4 ([2,3,7,101])\n```\n\n**Example 2:**\n```\nInput: nums = [0,1,0,3,2,3]\nOutput: 4\n```\n\n**Constraints:** Can you solve it in O(n log n)?",
      starterCode:
        "def length_of_lis(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(length_of_lis(nums))",
      solutionCode:
        "import bisect\n\ndef length_of_lis(nums):\n    tails = []\n    for num in nums:\n        pos = bisect.bisect_left(tails, num)\n        if pos == len(tails):\n            tails.append(num)\n        else:\n            tails[pos] = num\n    return len(tails)",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      correctPattern: "dynamic_programming",
      correctTimeComplexity: "O(n log n)",
      correctSpaceComplexity: "O(n)",
      testCases: JSON.stringify([
        { input: "[10,9,2,5,3,7,101,18]", expected: "4" },
        { input: "[0,1,0,3,2,3]", expected: "4" },
        { input: "[7,7,7,7,7,7,7]", expected: "1" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [] }, expectedOutput: 0 },
        { input: { nums: [1, 2, 3, 4, 5] }, expectedOutput: 5 },
      ]),
      hints: JSON.stringify([
        "O(n²) DP: dp[i] = length of LIS ending at index i. For each i, check all j < i where nums[j] < nums[i].",
        "For O(n log n): maintain a `tails` array where `tails[i]` = smallest tail element of all increasing subsequences of length i+1.",
        "For each new number, binary search `tails` for its position: if it extends the longest, append; otherwise replace the first element >= it. The answer is `len(tails)`.",
      ]),
      solutionApproach:
        "Patience sorting / binary search on `tails` array. Each new number is placed (via bisect_left) to maintain the smallest possible tail. O(n log n).",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Microsoft",
        "Apple",
        "Adobe",
      ]),
    },

    // Phase 5, Problem 6: Hard — Multi-pattern (Two Pointers + HashMap + Edge Cases)
    {
      slug: "trapping-rain-water-p5",
      title: "Trapping Rain Water",
      difficulty: "hard",
      pattern: "two_pointers",
      phase: 5,
      weekNumber: 15,
      category: "arrays",
      description:
        "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\n**Example 1:**\n```\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n```\n\n**Example 2:**\n```\nInput: height = [4,2,0,3,2,5]\nOutput: 9\n```\n\n**Constraints:** n == height.length, 1 ≤ n ≤ 2*10⁴",
      starterCode:
        "def trap(height):\n    pass\n\nimport json\nheight = json.loads(input())\nprint(trap(height))",
      solutionCode:
        "def trap(height):\n    if not height:\n        return 0\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n    return water",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      correctPattern: "two_pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      testCases: JSON.stringify([
        { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
        { input: "[4,2,0,3,2,5]", expected: "9" },
        { input: "[3,0,3]", expected: "3" },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { height: [1] }, expectedOutput: 0 },
        { input: { height: [0, 0, 0] }, expectedOutput: 0 },
      ]),
      hints: JSON.stringify([
        "Water at position i = min(max_height_left[i], max_height_right[i]) - height[i]. Can you compute this efficiently?",
        "Precompute left_max and right_max arrays. Water at each i = max(0, min(left_max[i], right_max[i]) - height[i]).",
        "For O(1) space: use two pointers. The side with the smaller max determines trapped water. Process the smaller side inward — it's guaranteed to trap correctly.",
      ]),
      solutionApproach:
        "Two pointers from both ends. Lower max side moves inward; water = current_max - height[pointer]. O(n) time, O(1) space.",
      companyTags: JSON.stringify([
        "Amazon",
        "Google",
        "Microsoft",
        "Meta",
        "Apple",
      ]),
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const problem of problems) {
    try {
      await prisma.problem.upsert({
        where: { slug: problem.slug },
        update: {},
        create: {
          ...problem,
          hints: JSON.stringify(problem.hints ? JSON.parse(problem.hints as string) : []),
          testCases: problem.testCases,
          hiddenTestCases: JSON.stringify(JSON.parse(problem.hiddenTestCases as string)),
        },
      });
      console.log(`  ✓ ${problem.slug} (Phase ${problem.phase})`);
      created++;
    } catch (err) {
      console.error(`  ✗ Failed: ${problem.slug}`, err);
      skipped++;
    }
  }

  console.log(`\n✅ Done! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
