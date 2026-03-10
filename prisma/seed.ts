import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Clean up duplicates ────────────────────────────────────
  console.log("🧹 Cleaning up duplicates...");
  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  console.log("  ✓ Cleaned courses, lessons, progress\n");

  // ─── Courses ────────────────────────────────────────────────
  console.log("📚 Creating courses...");

  const courseData = [
    {
      slug: "python-foundations",
      title: "Python Foundations",
      description:
        "Variables, data types, control flow, functions, OOP, and Pythonic idioms — everything you need before tackling DSA.",
      category: "python",
      difficulty: "beginner",
      icon: "🐍",
      order: 1,
    },
    {
      slug: "data-structures",
      title: "Data Structures",
      description:
        "Arrays, linked lists, stacks, queues, hash maps, trees, and graphs — with complexity analysis for every operation.",
      category: "data-structures",
      difficulty: "intermediate",
      icon: "🏗️",
      order: 2,
    },
    {
      slug: "algorithms",
      title: "Algorithms",
      description:
        "Sorting, searching, recursion, backtracking, dynamic programming, and greedy algorithms — the core interview toolkit.",
      category: "algorithms",
      difficulty: "intermediate",
      icon: "⚡",
      order: 3,
    },
    {
      slug: "advanced-patterns",
      title: "Advanced Patterns",
      description:
        "Two pointers, sliding window, graph traversal, and more. Recognize the patterns that turn hard problems into structured solutions.",
      category: "patterns",
      difficulty: "advanced",
      icon: "🧩",
      order: 4,
    },
  ];

  const courses: Record<string, { id: string }> = {};
  for (const c of courseData) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    courses[c.slug] = course;
    console.log(`  ✓ Course: ${c.title}`);
  }

  // Python lessons
  const pythonLessons = [
    {
      id: "lesson-py-1",
      slug: "variables-and-data-types",
      title: "Variables & Data Types",
      order: 1,
      difficulty: "beginner",
      estimatedTime: 15,
      codeExample: `name = "Alice"\nage = 25\nheight = 5.6\nis_student = True\nprint(f"Name: {name}, Age: {age}")`,
      content: `# Variables & Data Types\n\nPython is dynamically typed — you don't need to declare variable types.\n\n## Core Types\n- **int** — whole numbers: \`42\`\n- **float** — decimals: \`3.14\`\n- **str** — text: \`"hello"\`\n- **bool** — True / False\n\n## Type Conversion\n\`\`\`python\nx = int("42")    # str → int\ny = float(10)    # int → float\nz = str(3.14)    # float → str\n\`\`\`\n\nTry experimenting with different variable types in the code editor!`,
    },
    {
      id: "lesson-py-2",
      slug: "control-flow",
      title: "Control Flow",
      order: 2,
      difficulty: "beginner",
      estimatedTime: 20,
      codeExample: `score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")`,
      content: `# Control Flow\n\nControl flow lets your program make decisions and repeat actions.\n\n## if / elif / else\n\`\`\`python\nif condition:\n    # runs if True\nelif other_condition:\n    # runs if first is False, this is True\nelse:\n    # runs if all above are False\n\`\`\`\n\n## Loops\n\`\`\`python\nfor i in range(5):\n    print(i)\n\nwhile count > 0:\n    count -= 1\n\`\`\``,
    },
    {
      id: "lesson-py-3",
      slug: "functions",
      title: "Functions",
      order: 3,
      difficulty: "beginner",
      estimatedTime: 25,
      codeExample: `def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))\nprint(greet("Bob", "Hi"))`,
      content: `# Functions\n\nFunctions let you organize and reuse code.\n\n## Defining Functions\n\`\`\`python\ndef function_name(param1, param2="default"):\n    \"\"\"Docstring explaining the function.\"\"\"\n    # function body\n    return result\n\`\`\`\n\n## Key Concepts\n- **Parameters** — inputs to the function\n- **Return** — output from the function\n- **Default arguments** — optional params with fallback values\n- **Scope** — variables inside a function are local`,
    },
    {
      id: "lesson-py-4",
      slug: "object-oriented-programming",
      title: "Object-Oriented Programming",
      order: 4,
      difficulty: "intermediate",
      estimatedTime: 30,
      codeExample: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n    def __repr__(self):\n        return f"Node({self.val})"`,
      content: `# Object-Oriented Programming\n\nOOP is essential for DSA — every data structure is a class.\n\n## Classes in Python\n\`\`\`python\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\`\`\`\n\n## Why OOP Matters for Interviews\n- **ListNode**, **TreeNode**, **GraphNode** — you'll implement these constantly\n- **Encapsulation** — group data and behavior\n- **\\_\\_repr\\_\\_** — debug your data structures easily\n- **Inheritance** — understand how Python's built-in types work`,
    },
    {
      id: "lesson-py-5",
      slug: "list-comprehensions-and-pythonic-code",
      title: "List Comprehensions & Pythonic Code",
      order: 5,
      difficulty: "beginner",
      estimatedTime: 20,
      codeExample: `# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# Dict comprehension\nfreq = {ch: s.count(ch) for ch in set(s)}\n\n# Enumerate\nfor i, val in enumerate(arr):\n    print(i, val)`,
      content: `# List Comprehensions & Pythonic Code\n\nWriting clean, idiomatic Python makes your interview code readable.\n\n## List Comprehensions\n\`\`\`python\n# Filter + transform in one line\nevens = [x for x in range(20) if x % 2 == 0]\n\`\`\`\n\n## Essential Pythonic Patterns\n- **enumerate()** — loop with index: \`for i, v in enumerate(arr)\`\n- **zip()** — iterate two lists together\n- **collections.Counter** — frequency counting in O(n)\n- **collections.defaultdict** — auto-initialized dicts\n- **Tuple unpacking** — \`a, b = b, a\` for swapping\n\n## Interview Impact\nClean code demonstrates mastery. Interviewers notice when you use tools like Counter instead of manual counting loops.`,
    },
  ];

  for (const l of pythonLessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: { ...l, courseId: courses["python-foundations"].id },
    });
  }

  // Data Structures lessons
  const dsLessons = [
    {
      id: "lesson-ds-1",
      slug: "arrays-and-lists",
      title: "Arrays & Lists",
      order: 1,
      difficulty: "beginner",
      estimatedTime: 20,
      codeExample: `arr = [1, 2, 3, 4, 5]\narr.append(6)\narr.insert(0, 0)\nprint(arr)      # [0, 1, 2, 3, 4, 5, 6]\nprint(arr[2:5])  # [2, 3, 4]`,
      content: `# Arrays & Lists\n\nArrays (Python lists) are ordered, mutable collections.\n\n## Key Operations\n| Operation | Time |\n|-----------|------|\n| Access by index | O(1) |\n| Append | O(1) amortized |\n| Insert at index | O(n) |\n| Search | O(n) |\n| Delete by index | O(n) |\n\n## Common Patterns\n- Two pointers\n- Sliding window\n- Prefix sums`,
    },
    {
      id: "lesson-ds-2",
      slug: "linked-lists",
      title: "Linked Lists",
      order: 2,
      difficulty: "intermediate",
      estimatedTime: 25,
      codeExample: `class Node:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\nhead = Node(1, Node(2, Node(3)))`,
      content: `# Linked Lists\n\nA linked list is a linear data structure where each element (node) points to the next.\n\n## Types\n- **Singly linked** — each node points to the next\n- **Doubly linked** — each node points to next and previous\n\n## Key Operations\n| Operation | Time |\n|-----------|------|\n| Access | O(n) |\n| Insert at head | O(1) |\n| Insert at tail | O(n) or O(1) with tail pointer |\n| Delete | O(n) |`,
    },
    {
      id: "lesson-ds-3",
      slug: "stacks-and-queues",
      title: "Stacks & Queues",
      order: 3,
      difficulty: "intermediate",
      estimatedTime: 20,
      codeExample: `from collections import deque\n\nstack = []\nstack.append(1)\nstack.append(2)\nprint(stack.pop())  # 2\n\nqueue = deque()\nqueue.append(1)\nqueue.append(2)\nprint(queue.popleft())  # 1`,
      content: `# Stacks & Queues\n\n## Stack (LIFO)\nLast In, First Out. Think of a stack of plates.\n\n## Queue (FIFO)\nFirst In, First Out. Think of a line at a store.\n\n## Applications\n- **Stack**: undo operations, expression parsing, DFS\n- **Queue**: BFS, task scheduling, buffering`,
    },
    {
      id: "lesson-ds-4",
      slug: "hash-maps",
      title: "Hash Maps",
      order: 4,
      difficulty: "intermediate",
      estimatedTime: 25,
      codeExample: `from collections import Counter, defaultdict\n\n# Frequency counting\nfreq = Counter("aabbbcccc")\nprint(freq)  # Counter({'c': 4, 'b': 3, 'a': 2})\n\n# Grouping\ngroups = defaultdict(list)\nfor word in ["eat", "tea", "tan", "ate", "nat", "bat"]:\n    key = "".join(sorted(word))\n    groups[key].append(word)`,
      content: `# Hash Maps\n\nHash maps (dictionaries in Python) provide O(1) average-case lookups — the most frequently used data structure in interviews.\n\n## Key Operations\n| Operation | Average | Worst |\n|-----------|---------|-------|\n| Get/Set | O(1) | O(n) |\n| Delete | O(1) | O(n) |\n| Search | O(1) | O(n) |\n\n## Essential Interview Tools\n- **Counter** — frequency maps in one line\n- **defaultdict** — auto-initialized values\n- **Two-pass pattern** — build map, then query it\n\n## Common Interview Patterns\n1. **Two Sum** — store complement in map\n2. **Group Anagrams** — sorted key → group\n3. **Frequency counting** — Counter for top-K problems\n4. **Seen set** — tracking visited elements`,
    },
    {
      id: "lesson-ds-5",
      slug: "trees-and-binary-search-trees",
      title: "Trees & Binary Search Trees",
      order: 5,
      difficulty: "intermediate",
      estimatedTime: 30,
      codeExample: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)`,
      content: `# Trees & Binary Search Trees\n\nTrees are hierarchical structures — ubiquitous in interviews.\n\n## Binary Tree Traversals\n- **Inorder** (Left → Root → Right) — sorted order for BST\n- **Preorder** (Root → Left → Right) — serialize/copy tree\n- **Postorder** (Left → Right → Root) — delete tree\n- **Level-order** (BFS) — breadth-first with queue\n\n## BST Property\nFor every node: left subtree values < node < right subtree values.\n\n## Key Operations\n| Operation | Average | Worst |\n|-----------|---------|-------|\n| Search | O(log n) | O(n) |\n| Insert | O(log n) | O(n) |\n| Delete | O(log n) | O(n) |\n\n## Interview Tip\nMost tree problems use recursion. The pattern: handle base case (null node), process current node, recurse on children.`,
    },
  ];

  for (const l of dsLessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: { ...l, courseId: courses["data-structures"].id },
    });
  }

  // Algorithms lessons
  const algoLessons = [
    {
      id: "lesson-algo-1",
      slug: "sorting-algorithms",
      title: "Sorting Algorithms",
      order: 1,
      difficulty: "intermediate",
      estimatedTime: 30,
      codeExample: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)`,
      content: `# Sorting Algorithms\n\nSorting is fundamental to many algorithms.\n\n## Comparison\n| Algorithm | Best | Average | Worst | Space |\n|-----------|------|---------|-------|-------|\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |`,
    },
    {
      id: "lesson-algo-2",
      slug: "recursion-and-backtracking",
      title: "Recursion & Backtracking",
      order: 2,
      difficulty: "intermediate",
      estimatedTime: 30,
      codeExample: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))  # 120`,
      content: `# Recursion & Backtracking\n\nRecursion is when a function calls itself. Backtracking explores all possibilities and prunes invalid ones.\n\n## Recursion Template\n\`\`\`python\ndef solve(state):\n    if base_case(state):\n        return result\n    return solve(smaller_state)\n\`\`\`\n\n## Backtracking Template\n\`\`\`python\ndef backtrack(choices, path):\n    if is_solution(path):\n        results.append(path[:])\n        return\n    for choice in choices:\n        path.append(choice)\n        backtrack(remaining, path)\n        path.pop()  # undo choice\n\`\`\``,
    },
  ];

  for (const l of algoLessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: { ...l, courseId: courses["algorithms"].id },
    });
  }

  console.log("  ✓ Created 4 courses with 14 lessons\n");

  // Pattern lessons (under advanced-patterns course)
  const patternLessons = [
    {
      id: "lesson-pat-1",
      slug: "two-pointers-mastery",
      title: "Two Pointers Mastery",
      order: 1,
      difficulty: "intermediate",
      estimatedTime: 25,
      codeExample: `def two_sum_sorted(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target: return [left, right]\n        elif s < target: left += 1\n        else: right -= 1\n    return []`,
      content: `# Two Pointers Mastery\n\nTwo pointers is the most frequently tested pattern in placement interviews.\n\n## When to Use\n- Sorted array → think two pointers from ends\n- "Find pair" or "find triplet" → two pointers\n- In-place operations → two pointers (fast/slow)\n\n## Variants\n1. **Opposite direction** — start from ends, converge (Two Sum, Container With Most Water)\n2. **Same direction** — slow/fast pointers (Remove Duplicates, Linked List Cycle)\n3. **Three pointers** — fix one, two-pointer the rest (3Sum)\n\n## Interview Recognition\n> "Given a SORTED array, find two numbers that..." → Two Pointers\n> "Remove duplicates IN-PLACE..." → Two Pointers`,
    },
    {
      id: "lesson-pat-2",
      slug: "sliding-window-mastery",
      title: "Sliding Window Mastery",
      order: 2,
      difficulty: "intermediate",
      estimatedTime: 25,
      codeExample: `def longest_substring_k_distinct(s, k):\n    window_start, max_len = 0, 0\n    freq = {}\n    for window_end in range(len(s)):\n        ch = s[window_end]\n        freq[ch] = freq.get(ch, 0) + 1\n        while len(freq) > k:\n            left_ch = s[window_start]\n            freq[left_ch] -= 1\n            if freq[left_ch] == 0: del freq[left_ch]\n            window_start += 1\n        max_len = max(max_len, window_end - window_start + 1)\n    return max_len`,
      content: `# Sliding Window Mastery\n\nSliding window transforms O(n²) brute force into O(n).\n\n## Two Types\n1. **Fixed window** — window size is given (Max Sum Subarray of Size K)\n2. **Variable window** — find longest/shortest window meeting a condition\n\n## Variable Window Template\n\`\`\`python\nwindow_start = 0\nfor window_end in range(len(arr)):\n    # expand: add arr[window_end] to window\n    while window_invalid():\n        # shrink: remove arr[window_start]\n        window_start += 1\n    # update answer\n\`\`\`\n\n## Interview Recognition\n> "Longest substring with at most K..." → Sliding Window\n> "Minimum window containing..." → Sliding Window\n> "Subarray with sum..." → Sliding Window`,
    },
  ];

  for (const l of patternLessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: { ...l, courseId: courses["advanced-patterns"].id },
    });
  }

  // ─── Patterns ───────────────────────────────────────────────
  console.log("🧩 Creating patterns...");

  const patternData = [
    {
      slug: "two-pointers",
      name: "Two Pointers",
      description:
        "Use two pointers to traverse a sorted array or linked list from both ends, moving toward each other based on conditions.",
      whenToUse: JSON.stringify([
        "Sorted array or linked list",
        "Find pair with a target sum",
        "Compare elements from both ends",
        "In-place array manipulation",
      ]),
      template: `def two_pointers(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        current = arr[left] + arr[right]\n        if current == target:\n            return [left, right]\n        elif current < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      difficulty: 1,
      order: 1,
    },
    {
      slug: "sliding-window",
      name: "Sliding Window",
      description:
        "Maintain a window over a portion of data that slides through to find optimal subarrays or substrings.",
      whenToUse: JSON.stringify([
        "Find longest/shortest subarray with condition",
        "Maximum/minimum in windows of size k",
        "String problems with substring requirements",
      ]),
      template: `def sliding_window(arr, k):\n    window_start = 0\n    window_sum = 0\n    max_sum = 0\n    for window_end in range(len(arr)):\n        window_sum += arr[window_end]\n        if window_end >= k - 1:\n            max_sum = max(max_sum, window_sum)\n            window_sum -= arr[window_start]\n            window_start += 1\n    return max_sum`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      difficulty: 2,
      order: 2,
    },
    {
      slug: "fast-slow-pointers",
      name: "Fast & Slow Pointers",
      description:
        "Two pointers moving at different speeds through a sequence, useful for cycle detection.",
      whenToUse: JSON.stringify([
        "Detect cycle in linked list",
        "Find middle of linked list",
        "Find cycle start position",
      ]),
      template: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      difficulty: 2,
      order: 3,
    },
    {
      slug: "merge-intervals",
      name: "Merge Intervals",
      description:
        "Sort intervals by start time, then merge overlapping ones by comparing end times.",
      whenToUse: JSON.stringify([
        "Overlapping intervals",
        "Meeting room scheduling",
        "Insert interval into sorted list",
      ]),
      template: `def merge_intervals(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged`,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      difficulty: 2,
      order: 4,
    },
    {
      slug: "cyclic-sort",
      name: "Cyclic Sort",
      description:
        "Place each number at its correct index for arrays containing numbers in a range.",
      whenToUse: JSON.stringify([
        "Array has numbers in range [0, n] or [1, n]",
        "Find missing or duplicate numbers",
      ]),
      template: `def cyclic_sort(nums):\n    i = 0\n    while i < len(nums):\n        correct = nums[i] - 1\n        if nums[i] != nums[correct]:\n            nums[i], nums[correct] = nums[correct], nums[i]\n        else:\n            i += 1\n    return nums`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      difficulty: 2,
      order: 5,
    },
    {
      slug: "linked-list-reversal",
      name: "In-place Linked List Reversal",
      description:
        "Reverse links between nodes of a linked list in-place using prev/curr/next pointers.",
      whenToUse: JSON.stringify([
        "Reverse entire linked list",
        "Reverse a sub-list",
        "Reverse every k-group",
      ]),
      template: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      difficulty: 2,
      order: 6,
    },
    {
      slug: "tree-bfs",
      name: "Tree BFS",
      description:
        "Traverse tree level by level using a queue, processing all nodes at each depth before moving deeper.",
      whenToUse: JSON.stringify([
        "Level-order traversal",
        "Find minimum depth",
        "Connect level-order siblings",
      ]),
      template: `from collections import deque\n\ndef bfs(root):\n    if not root:\n        return []\n    result = []\n    queue = deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      difficulty: 3,
      order: 7,
    },
    {
      slug: "tree-dfs",
      name: "Tree DFS",
      description:
        "Traverse tree by exploring as deep as possible along each branch before backtracking.",
      whenToUse: JSON.stringify([
        "Path sum problems",
        "All paths from root to leaves",
        "Validate BST",
      ]),
      template: `def dfs(root, target, path=[]):\n    if not root:\n        return\n    path.append(root.val)\n    if not root.left and not root.right and sum(path) == target:\n        results.append(list(path))\n    dfs(root.left, target, path)\n    dfs(root.right, target, path)\n    path.pop()`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
      difficulty: 3,
      order: 8,
    },
    {
      slug: "two-heaps",
      name: "Two Heaps",
      description:
        "Use a max-heap and min-heap together to efficiently find median or partition elements.",
      whenToUse: JSON.stringify([
        "Find median in a stream",
        "Maximize capital / minimize cost",
      ]),
      template: `import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.small = []  # max-heap (negate)\n        self.large = []  # min-heap\n    def add(self, num):\n        heapq.heappush(self.small, -num)\n        heapq.heappush(self.large, -heapq.heappop(self.small))\n        if len(self.large) > len(self.small):\n            heapq.heappush(self.small, -heapq.heappop(self.large))`,
      timeComplexity: "O(log n)",
      spaceComplexity: "O(n)",
      difficulty: 4,
      order: 9,
    },
    {
      slug: "subsets",
      name: "Subsets / Combinations",
      description:
        "Generate all subsets or combinations using BFS or backtracking.",
      whenToUse: JSON.stringify([
        "Generate all subsets",
        "Permutations or combinations",
        "String permutations with duplicates",
      ]),
      template: `def subsets(nums):\n    result = [[]]\n    for num in nums:\n        result += [curr + [num] for curr in result]\n    return result`,
      timeComplexity: "O(2ⁿ)",
      spaceComplexity: "O(2ⁿ)",
      difficulty: 3,
      order: 10,
    },
    {
      slug: "modified-binary-search",
      name: "Modified Binary Search",
      description:
        "Variations of binary search for rotated arrays, finding boundaries, or searching in special arrays.",
      whenToUse: JSON.stringify([
        "Sorted or rotated sorted array",
        "Find first/last occurrence",
        "Find peak element",
      ]),
      template: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      difficulty: 2,
      order: 11,
    },
    {
      slug: "top-k-elements",
      name: "Top K Elements",
      description:
        "Use a heap to efficiently find the top/bottom K elements in a dataset.",
      whenToUse: JSON.stringify([
        "Kth largest/smallest element",
        "Top K frequent elements",
        "K closest points",
      ]),
      template: `import heapq\n\ndef top_k(nums, k):\n    return heapq.nlargest(k, nums)`,
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(k)",
      difficulty: 3,
      order: 12,
    },
    {
      slug: "k-way-merge",
      name: "K-way Merge",
      description:
        "Merge K sorted lists using a min-heap to efficiently find the next smallest element.",
      whenToUse: JSON.stringify([
        "Merge K sorted arrays/lists",
        "Kth smallest in sorted matrix",
        "Smallest range covering K lists",
      ]),
      template: `import heapq\n\ndef merge_k_sorted(lists):\n    heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(heap, (lst[0], i, 0))\n    result = []\n    while heap:\n        val, list_idx, elem_idx = heapq.heappop(heap)\n        result.append(val)\n        if elem_idx + 1 < len(lists[list_idx]):\n            heapq.heappush(heap, (lists[list_idx][elem_idx + 1], list_idx, elem_idx + 1))\n    return result`,
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(k)",
      difficulty: 4,
      order: 13,
    },
    {
      slug: "topological-sort",
      name: "Topological Sort",
      description:
        "Order vertices in a DAG so every directed edge goes from earlier to later in the ordering.",
      whenToUse: JSON.stringify([
        "Task scheduling with dependencies",
        "Course prerequisites",
        "Build order",
      ]),
      template: `from collections import deque, defaultdict\n\ndef topological_sort(vertices, edges):\n    in_degree = {i: 0 for i in range(vertices)}\n    graph = defaultdict(list)\n    for parent, child in edges:\n        graph[parent].append(child)\n        in_degree[child] += 1\n    queue = deque([v for v in in_degree if in_degree[v] == 0])\n    order = []\n    while queue:\n        v = queue.popleft()\n        order.append(v)\n        for child in graph[v]:\n            in_degree[child] -= 1\n            if in_degree[child] == 0:\n                queue.append(child)\n    return order if len(order) == vertices else []`,
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
      difficulty: 4,
      order: 14,
    },
    {
      slug: "dp-fibonacci",
      name: "Dynamic Programming",
      description:
        "Break problems into overlapping subproblems and store solutions to avoid redundant computation.",
      whenToUse: JSON.stringify([
        "Fibonacci-style recurrences",
        "Optimization problems",
        "Counting paths or ways",
      ]),
      template: `def dp_fibonacci(n):\n    if n <= 1:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      difficulty: 3,
      order: 15,
    },
  ];

  for (const p of patternData) {
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
      create: p,
    });
    console.log(`  ✓ Pattern: ${p.name}`);
  }

  // ─── Problems ───────────────────────────────────────────────
  console.log("\n💡 Creating problems...");

  const problemData = [
    {
      slug: "two-sum-sorted",
      title: "Two Sum II - Sorted Array",
      difficulty: "easy",
      pattern: "two-pointers",
      topics: JSON.stringify(["arrays", "two_pointers"]),
      companies: JSON.stringify(["Amazon", "Google"]),
      category: "DSA",
      description: `Given a **1-indexed** sorted array, find two numbers that add up to a target.\n\nReturn the indices (1-indexed) as \\[index1, index2\\].`,
      examples: JSON.stringify([
        { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]", explanation: "2 + 7 = 9" },
      ]),
      constraints: JSON.stringify(["2 <= numbers.length <= 3×10⁴", "Array is sorted"]),
      hints: JSON.stringify(["Use two pointers from both ends", "Move the pointer that helps approach the target"]),
      starterCode: `def two_sum(numbers: list[int], target: int) -> list[int]:\n    # Your code here\n    pass\n\nprint(two_sum([2, 7, 11, 15], 9))`,
      solutionCode: `def two_sum(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        s = numbers[left] + numbers[right]\n        if s == target: return [left+1, right+1]\n        elif s < target: left += 1\n        else: right -= 1\n    return []`,
      solutionExplanation: "Two pointers converge toward the target sum.",
      testCases: JSON.stringify([
        { input: { numbers: [2, 7, 11, 15], target: 9 }, expectedOutput: [1, 2] },
        { input: { numbers: [2, 3, 4], target: 6 }, expectedOutput: [1, 3] },
        { input: { numbers: [-1, 0], target: -1 }, expectedOutput: [1, 2] },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { numbers: [1, 2], target: 3 }, expectedOutput: [1, 2] },
      ]),
      solutionApproach: "Two pointers from both ends of the sorted array.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      order: 1,
    },
    {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "easy",
      pattern: "two-pointers",
      topics: JSON.stringify(["strings", "two_pointers"]),
      companies: JSON.stringify(["Facebook", "Microsoft"]),
      category: "DSA",
      description: `Check if a string is a palindrome after removing non-alphanumeric characters and ignoring case.`,
      examples: JSON.stringify([
        { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: "It reads the same forwards and backwards." },
      ]),
      constraints: JSON.stringify(["1 <= s.length <= 2×10⁵"]),
      hints: JSON.stringify(["Use two pointers", "Skip non-alphanumeric characters", "Compare case-insensitively"]),
      starterCode: `def is_palindrome(s: str) -> bool:\n    # Your code here\n    pass\n\nprint(is_palindrome("A man, a plan, a canal: Panama"))`,
      solutionCode: `def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum(): left += 1\n        while left < right and not s[right].isalnum(): right -= 1\n        if s[left].lower() != s[right].lower(): return False\n        left += 1; right -= 1\n    return True`,
      solutionExplanation: "Two pointers skip non-alnum and compare case-insensitively.",
      testCases: JSON.stringify([
        { input: { s: "A man, a plan, a canal: Panama" }, expectedOutput: true },
        { input: { s: "race a car" }, expectedOutput: false },
        { input: { s: " " }, expectedOutput: true },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { s: "a" }, expectedOutput: true },
      ]),
      solutionApproach: "Two pointers from both ends, skipping non-alphanumeric.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      order: 2,
    },
    {
      slug: "max-sum-subarray-k",
      title: "Maximum Sum Subarray of Size K",
      difficulty: "easy",
      pattern: "sliding-window",
      topics: JSON.stringify(["arrays", "sliding_window"]),
      companies: JSON.stringify(["Amazon"]),
      category: "DSA",
      description: `Given an array of positive integers and a number k, find the maximum sum of any contiguous subarray of size k.`,
      examples: JSON.stringify([
        { input: "nums = [2,1,5,1,3,2], k = 3", output: "9", explanation: "Subarray [5,1,3] has max sum 9." },
      ]),
      constraints: JSON.stringify(["1 <= nums.length <= 10⁵", "1 <= k <= nums.length"]),
      hints: JSON.stringify(["Calculate sum of first k elements", "Slide: add next, remove first"]),
      starterCode: `def max_sum_subarray(nums: list[int], k: int) -> int:\n    # Your code here\n    pass\n\nprint(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))`,
      solutionCode: `def max_sum_subarray(nums, k):\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum`,
      solutionExplanation: "Fixed-size sliding window.",
      testCases: JSON.stringify([
        { input: { nums: [2, 1, 5, 1, 3, 2], k: 3 }, expectedOutput: 9 },
        { input: { nums: [2, 3, 4, 1, 5], k: 2 }, expectedOutput: 7 },
        { input: { nums: [1, 2, 3, 4, 5], k: 5 }, expectedOutput: 15 },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [10], k: 1 }, expectedOutput: 10 },
      ]),
      solutionApproach: "Fixed-size sliding window tracking max sum.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      order: 3,
    },
    {
      slug: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "medium",
      pattern: "two-pointers",
      topics: JSON.stringify(["arrays", "two_pointers", "greedy"]),
      companies: JSON.stringify(["Amazon", "Google"]),
      category: "DSA",
      description: `Given n vertical lines on a coordinate plane, find two lines that form a container holding the most water.`,
      examples: JSON.stringify([
        { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 and 8: min(8,7)×7 = 49" },
      ]),
      constraints: JSON.stringify(["2 <= n <= 10⁵", "0 <= height[i] <= 10⁴"]),
      hints: JSON.stringify(["Start with widest container", "Move the shorter line's pointer"]),
      starterCode: `def max_area(height: list[int]) -> int:\n    # Your code here\n    pass\n\nprint(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))`,
      solutionCode: `def max_area(height):\n    left, right = 0, len(height) - 1\n    max_water = 0\n    while left < right:\n        w = right - left\n        h = min(height[left], height[right])\n        max_water = max(max_water, w * h)\n        if height[left] < height[right]: left += 1\n        else: right -= 1\n    return max_water`,
      solutionExplanation: "Greedy two pointers — always move shorter side.",
      testCases: JSON.stringify([
        { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expectedOutput: 49 },
        { input: { height: [1, 1] }, expectedOutput: 1 },
        { input: { height: [4, 3, 2, 1, 4] }, expectedOutput: 16 },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { height: [100, 1, 1, 1, 100] }, expectedOutput: 400 },
      ]),
      solutionApproach: "Two pointers with greedy — move shorter line.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      order: 4,
    },
    {
      slug: "binary-search-basic",
      title: "Binary Search",
      difficulty: "easy",
      pattern: "modified-binary-search",
      topics: JSON.stringify(["arrays", "binary_search"]),
      companies: JSON.stringify(["Microsoft", "Apple"]),
      category: "DSA",
      description: `Given a sorted array and a target, return its index or -1. Must run in O(log n).`,
      examples: JSON.stringify([
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 is at index 4." },
      ]),
      constraints: JSON.stringify(["1 <= nums.length <= 10⁴", "All integers are unique", "Array is sorted"]),
      hints: JSON.stringify(["Compare with middle element", "Halve search space each step"]),
      starterCode: `def binary_search(nums: list[int], target: int) -> int:\n    # Your code here\n    pass\n\nprint(binary_search([-1, 0, 3, 5, 9, 12], 9))`,
      solutionCode: `def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1`,
      solutionExplanation: "Classic binary search halving search space each iteration.",
      testCases: JSON.stringify([
        { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expectedOutput: 4 },
        { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expectedOutput: -1 },
        { input: { nums: [5], target: 5 }, expectedOutput: 0 },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [1, 2, 3], target: 1 }, expectedOutput: 0 },
      ]),
      solutionApproach: "Standard binary search on sorted array.",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      order: 5,
    },
    {
      slug: "merge-sorted-intervals",
      title: "Merge Intervals",
      difficulty: "medium",
      pattern: "merge-intervals",
      topics: JSON.stringify(["arrays", "sorting"]),
      companies: JSON.stringify(["Google", "Facebook", "Bloomberg"]),
      category: "DSA",
      description: `Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.`,
      examples: JSON.stringify([
        { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap." },
      ]),
      constraints: JSON.stringify(["1 <= intervals.length <= 10⁴"]),
      hints: JSON.stringify(["Sort by start time", "Compare current start with previous end"]),
      starterCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # Your code here\n    pass\n\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))`,
      solutionCode: `def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged`,
      solutionExplanation: "Sort then greedily merge overlapping intervals.",
      testCases: JSON.stringify([
        { input: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, expectedOutput: [[1,6],[8,10],[15,18]] },
        { input: { intervals: [[1,4],[4,5]] }, expectedOutput: [[1,5]] },
        { input: { intervals: [[1,4],[0,4]] }, expectedOutput: [[0,4]] },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { intervals: [[1,4],[2,3]] }, expectedOutput: [[1,4]] },
      ]),
      solutionApproach: "Sort by start, merge overlapping intervals greedily.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      order: 6,
    },
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "easy",
      pattern: "dp-fibonacci",
      topics: JSON.stringify(["dynamic_programming"]),
      companies: JSON.stringify(["Amazon", "Apple", "Google"]),
      category: "DSA",
      description: `You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?`,
      examples: JSON.stringify([
        { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
      ]),
      constraints: JSON.stringify(["1 <= n <= 45"]),
      hints: JSON.stringify(["Notice the Fibonacci pattern", "ways(n) = ways(n-1) + ways(n-2)"]),
      starterCode: `def climb_stairs(n: int) -> int:\n    # Your code here\n    pass\n\nprint(climb_stairs(3))`,
      solutionCode: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`,
      solutionExplanation: "Classic DP / Fibonacci pattern.",
      testCases: JSON.stringify([
        { input: { n: 2 }, expectedOutput: 2 },
        { input: { n: 3 }, expectedOutput: 3 },
        { input: { n: 5 }, expectedOutput: 8 },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { n: 1 }, expectedOutput: 1 },
      ]),
      solutionApproach: "Dynamic programming — Fibonacci recurrence.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      order: 7,
    },
    {
      slug: "longest-substring-no-repeat",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      pattern: "sliding-window",
      topics: JSON.stringify(["strings", "sliding_window", "hash_map"]),
      companies: JSON.stringify(["Amazon", "Google", "Microsoft", "Bloomberg"]),
      category: "DSA",
      description: `Given a string s, find the length of the longest substring without repeating characters.`,
      examples: JSON.stringify([
        { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
        { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with length 1.' },
      ]),
      constraints: JSON.stringify(["0 <= s.length <= 5 × 10⁴", "s consists of English letters, digits, symbols, and spaces"]),
      hints: JSON.stringify(["Use a sliding window with a set", "When you find a duplicate, shrink the window from the left"]),
      starterCode: `def length_of_longest_substring(s: str) -> int:\n    # Your code here\n    pass\n\nprint(length_of_longest_substring("abcabcbb"))`,
      solutionCode: `def length_of_longest_substring(s):\n    seen = {}\n    start = max_len = 0\n    for end, ch in enumerate(s):\n        if ch in seen and seen[ch] >= start:\n            start = seen[ch] + 1\n        seen[ch] = end\n        max_len = max(max_len, end - start + 1)\n    return max_len`,
      solutionExplanation: "Variable sliding window — expand right, shrink left when duplicate found.",
      testCases: JSON.stringify([
        { input: { s: "abcabcbb" }, expectedOutput: 3 },
        { input: { s: "bbbbb" }, expectedOutput: 1 },
        { input: { s: "pwwkew" }, expectedOutput: 3 },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { s: "" }, expectedOutput: 0 },
        { input: { s: " " }, expectedOutput: 1 },
      ]),
      solutionApproach: "Sliding window with hash map tracking last seen index.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(min(n, m)) where m is charset size",
      order: 8,
    },
    {
      slug: "reverse-linked-list",
      title: "Reverse Linked List",
      difficulty: "easy",
      pattern: "linked-list-reversal",
      topics: JSON.stringify(["linked_list"]),
      companies: JSON.stringify(["Amazon", "Microsoft", "Apple", "Goldman Sachs"]),
      category: "DSA",
      description: `Given the head of a singly linked list, reverse the list and return the reversed list.`,
      examples: JSON.stringify([
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "Reverse all pointers." },
      ]),
      constraints: JSON.stringify(["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000"]),
      hints: JSON.stringify(["Use three pointers: prev, curr, next", "At each step, reverse the link direction"]),
      starterCode: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head: ListNode) -> ListNode:\n    # Your code here\n    pass`,
      solutionCode: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
      solutionExplanation: "Iterative reversal using three pointers — prev/curr/next.",
      testCases: JSON.stringify([
        { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1] },
        { input: { head: [1, 2] }, expectedOutput: [2, 1] },
        { input: { head: [] }, expectedOutput: [] },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { head: [1] }, expectedOutput: [1] },
      ]),
      solutionApproach: "Three-pointer iterative reversal — classic interview question.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      order: 9,
    },
    {
      slug: "find-all-missing-numbers",
      title: "Find All Numbers Disappeared in an Array",
      difficulty: "easy",
      pattern: "cyclic-sort",
      topics: JSON.stringify(["arrays", "cyclic_sort"]),
      companies: JSON.stringify(["Google", "Amazon"]),
      category: "DSA",
      description: `Given an array nums of n integers where nums[i] is in the range [1, n], return all integers in [1, n] that do not appear in nums.\n\nDo it without extra space and in O(n) time.`,
      examples: JSON.stringify([
        { input: "nums = [4,3,2,7,8,2,3,1]", output: "[5,6]", explanation: "5 and 6 are missing from [1..8]." },
      ]),
      constraints: JSON.stringify(["n == nums.length", "1 <= n <= 10⁵", "1 <= nums[i] <= n"]),
      hints: JSON.stringify(["Place each number at its correct index", "Numbers in range [1,n] → index [0,n-1]"]),
      starterCode: `def find_disappeared_numbers(nums: list[int]) -> list[int]:\n    # Your code here\n    pass\n\nprint(find_disappeared_numbers([4,3,2,7,8,2,3,1]))`,
      solutionCode: `def find_disappeared_numbers(nums):\n    i = 0\n    while i < len(nums):\n        correct = nums[i] - 1\n        if nums[i] != nums[correct]:\n            nums[i], nums[correct] = nums[correct], nums[i]\n        else:\n            i += 1\n    return [i + 1 for i in range(len(nums)) if nums[i] != i + 1]`,
      solutionExplanation: "Cyclic sort — place each number at index (value - 1), then find mismatches.",
      testCases: JSON.stringify([
        { input: { nums: [4,3,2,7,8,2,3,1] }, expectedOutput: [5,6] },
        { input: { nums: [1,1] }, expectedOutput: [2] },
        { input: { nums: [1] }, expectedOutput: [] },
      ]),
      hiddenTestCases: JSON.stringify([
        { input: { nums: [2,2] }, expectedOutput: [1] },
      ]),
      solutionApproach: "Cyclic sort — place each number at its correct index, then scan.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      order: 10,
    },
  ];

  for (const p of problemData) {
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    console.log(`  ✓ Problem: ${p.title} (${p.difficulty})`);
  }

  // ─── Topic Ordering for Problems ──────────────────────────
  console.log("\n📐 Setting topic order on problems...");
  const topicOrderMap: Record<string, number> = {
    "two-sum-sorted": 1,
    "valid-palindrome": 2,
    "container-with-most-water": 3,
    "find-all-missing-numbers": 4,
    "max-sum-subarray-k": 5,
    "longest-substring-no-repeat": 6,
    "binary-search-basic": 7,
    "merge-sorted-intervals": 8,
    "reverse-linked-list": 9,
    "climbing-stairs": 10,
  };
  for (const [slug, topicOrder] of Object.entries(topicOrderMap)) {
    await prisma.problem.update({
      where: { slug },
      data: { topicOrder },
    });
  }
  console.log(`  ✓ Set topic order for ${Object.keys(topicOrderMap).length} problems`);

  // ─── Lesson ↔ Problem Connections ───────────────────────────
  console.log("\n🔗 Creating lesson-problem connections...");
  await prisma.lessonProblem.deleteMany();

  const connections: { lessonSlug: string; problemSlug: string; order: number }[] = [
    // arrays-and-lists → array problems
    { lessonSlug: "arrays-and-lists", problemSlug: "two-sum-sorted", order: 1 },
    { lessonSlug: "arrays-and-lists", problemSlug: "find-all-missing-numbers", order: 2 },
    { lessonSlug: "arrays-and-lists", problemSlug: "container-with-most-water", order: 3 },
    // linked-lists → linked-list problems
    { lessonSlug: "linked-lists", problemSlug: "reverse-linked-list", order: 1 },
    // stacks-and-queues → valid-palindrome (uses stack-like approach)
    { lessonSlug: "stacks-and-queues", problemSlug: "valid-palindrome", order: 1 },
    // hash-maps → two-sum uses hash map, longest-substring uses hash set
    { lessonSlug: "hash-maps", problemSlug: "two-sum-sorted", order: 1 },
    { lessonSlug: "hash-maps", problemSlug: "longest-substring-no-repeat", order: 2 },
    // trees-and-binary-search-trees → binary-search
    { lessonSlug: "trees-and-binary-search-trees", problemSlug: "binary-search-basic", order: 1 },
    // sorting-algorithms → merge-sorted-intervals
    { lessonSlug: "sorting-algorithms", problemSlug: "merge-sorted-intervals", order: 1 },
    // recursion-and-backtracking → climbing-stairs
    { lessonSlug: "recursion-and-backtracking", problemSlug: "climbing-stairs", order: 1 },
    // two-pointers-mastery → two-pointer problems
    { lessonSlug: "two-pointers-mastery", problemSlug: "two-sum-sorted", order: 1 },
    { lessonSlug: "two-pointers-mastery", problemSlug: "valid-palindrome", order: 2 },
    { lessonSlug: "two-pointers-mastery", problemSlug: "container-with-most-water", order: 3 },
    // sliding-window-mastery → sliding window problems
    { lessonSlug: "sliding-window-mastery", problemSlug: "max-sum-subarray-k", order: 1 },
    { lessonSlug: "sliding-window-mastery", problemSlug: "longest-substring-no-repeat", order: 2 },
    // control-flow → basic problem
    { lessonSlug: "control-flow", problemSlug: "climbing-stairs", order: 1 },
    // functions → valid-palindrome (implement a function)
    { lessonSlug: "functions", problemSlug: "valid-palindrome", order: 1 },
    // list-comprehensions-and-pythonic-code → find-all-missing-numbers
    { lessonSlug: "list-comprehensions-and-pythonic-code", problemSlug: "find-all-missing-numbers", order: 1 },
  ];

  for (const conn of connections) {
    const lesson = await prisma.lesson.findUnique({ where: { slug: conn.lessonSlug } });
    const problem = await prisma.problem.findUnique({ where: { slug: conn.problemSlug } });
    if (lesson && problem) {
      await prisma.lessonProblem.create({
        data: {
          lessonId: lesson.id,
          problemId: problem.id,
          order: conn.order,
        },
      });
      console.log(`  ✓ ${conn.lessonSlug} → ${conn.problemSlug}`);
    } else {
      console.log(`  ⚠ Skipped: ${conn.lessonSlug} → ${conn.problemSlug} (not found)`);
    }
  }

  console.log("\n✅ Seeding complete!");
  console.log(
    `   📚 ${await prisma.course.count()} courses, ` +
    `📝 ${await prisma.lesson.count()} lessons, ` +
    `🧩 ${await prisma.pattern.count()} patterns, ` +
    `💡 ${await prisma.problem.count()} problems, ` +
    `🔗 ${await prisma.lessonProblem.count()} connections`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
