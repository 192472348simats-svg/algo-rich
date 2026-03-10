/**
 * DSA Pattern Definitions
 * All 15 core patterns with metadata for pattern-based learning.
 */

export interface Pattern {
  id: string;
  name: string;
  slug: string;
  description: string;
  whenToUse: string[];
  template: string;
  complexity: { time: string; space: string };
  relatedPatterns: string[];
  difficulty: number; // 1-5
  icon: string;
  category: "pointers" | "sorting" | "trees" | "search" | "advanced";
}

export const patterns: Pattern[] = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    slug: "two-pointers",
    description:
      "Use two pointers to traverse a sorted array or linked list from both ends, moving them toward each other based on conditions.",
    whenToUse: [
      "Sorted array or linked list",
      "Find pair with a target sum",
      "Compare elements from both ends",
      "In-place array manipulation",
      "Remove duplicates from sorted array",
    ],
    template: `def two_pointers(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return [-1, -1]  # Not found`,
    complexity: { time: "O(n)", space: "O(1)" },
    relatedPatterns: ["fast-slow-pointers", "sliding-window"],
    difficulty: 1,
    icon: "↔️",
    category: "pointers",
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    slug: "sliding-window",
    description:
      "Maintain a window of elements that slides across an array, tracking a running calculation to avoid recomputing from scratch.",
    whenToUse: [
      "Contiguous subarray/substring problems",
      "Find max/min sum of k-length subarray",
      "Longest substring with constraint",
      "String permutations or anagrams",
      "Fixed or variable-size window needed",
    ],
    template: `def sliding_window(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]  # Slide window
        max_sum = max(max_sum, window_sum)
    
    return max_sum

def variable_window(s, condition):
    left = 0
    result = 0
    window = {}
    
    for right in range(len(s)):
        # Expand window
        window[s[right]] = window.get(s[right], 0) + 1
        
        # Shrink window if condition violated
        while not condition(window):
            window[s[left]] -= 1
            if window[s[left]] == 0:
                del window[s[left]]
            left += 1
        
        result = max(result, right - left + 1)
    
    return result`,
    complexity: { time: "O(n)", space: "O(1) or O(k)" },
    relatedPatterns: ["two-pointers"],
    difficulty: 2,
    icon: "🪟",
    category: "pointers",
  },
  {
    id: "fast-slow-pointers",
    name: "Fast & Slow Pointers",
    slug: "fast-slow-pointers",
    description:
      "Use two pointers moving at different speeds to detect cycles, find middle elements, or determine linked list properties.",
    whenToUse: [
      "Detect cycle in linked list or array",
      "Find the middle of a linked list",
      "Find the start of a cycle",
      "Determine if a number is happy",
      "Palindrome linked list check",
    ],
    template: `def has_cycle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps
        
        if slow == fast:
            return True  # Cycle detected
    
    return False  # No cycle

def find_middle(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow  # Middle node`,
    complexity: { time: "O(n)", space: "O(1)" },
    relatedPatterns: ["two-pointers", "linked-list-reversal"],
    difficulty: 2,
    icon: "🐇",
    category: "pointers",
  },
  {
    id: "merge-intervals",
    name: "Merge Intervals",
    slug: "merge-intervals",
    description:
      "Sort intervals by start time and merge overlapping ones by comparing each interval's start with the previous interval's end.",
    whenToUse: [
      "Overlapping intervals",
      "Merge meeting times",
      "Insert new interval",
      "Find free time between intervals",
      "Minimum number of meeting rooms",
    ],
    template: `def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        if current[0] <= last[1]:  # Overlapping
            merged[-1] = [last[0], max(last[1], current[1])]
        else:
            merged.append(current)
    
    return merged`,
    complexity: { time: "O(n log n)", space: "O(n)" },
    relatedPatterns: [],
    difficulty: 2,
    icon: "📊",
    category: "sorting",
  },
  {
    id: "cyclic-sort",
    name: "Cyclic Sort",
    slug: "cyclic-sort",
    description:
      "Place each number at its correct index in a single pass. Useful when dealing with numbers in a range [1, n].",
    whenToUse: [
      "Array contains numbers in range [1, n]",
      "Find missing number",
      "Find duplicate number",
      "Find all missing/duplicate numbers",
      "Numbers are unsorted but in known range",
    ],
    template: `def cyclic_sort(nums):
    i = 0
    while i < len(nums):
        correct = nums[i] - 1  # Where this number should be
        
        if nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]  # Swap
        else:
            i += 1
    
    return nums

def find_missing(nums):
    cyclic_sort(nums)
    for i in range(len(nums)):
        if nums[i] != i + 1:
            return i + 1
    return len(nums) + 1`,
    complexity: { time: "O(n)", space: "O(1)" },
    relatedPatterns: [],
    difficulty: 2,
    icon: "🔄",
    category: "sorting",
  },
  {
    id: "linked-list-reversal",
    name: "In-place Reversal of LinkedList",
    slug: "linked-list-reversal",
    description:
      "Reverse a linked list or a portion of it in-place by manipulating node pointers without extra space.",
    whenToUse: [
      "Reverse entire linked list",
      "Reverse a sub-list between positions",
      "Reverse in groups of K",
      "Alternate reversing",
      "Palindrome check on linked list",
    ],
    template: `def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_node = current.next  # Save next
        current.next = prev       # Reverse pointer
        prev = current            # Move prev forward
        current = next_node       # Move current forward
    
    return prev  # New head

def reverse_between(head, left, right):
    dummy = ListNode(0, head)
    prev = dummy
    
    for _ in range(left - 1):
        prev = prev.next
    
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next`,
    complexity: { time: "O(n)", space: "O(1)" },
    relatedPatterns: ["fast-slow-pointers"],
    difficulty: 3,
    icon: "🔗",
    category: "pointers",
  },
  {
    id: "tree-bfs",
    name: "Tree BFS",
    slug: "tree-bfs",
    description:
      "Traverse a tree level by level using a queue. Process all nodes at the current depth before moving to the next level.",
    whenToUse: [
      "Level-order traversal",
      "Find minimum depth",
      "Level averages or sums",
      "Connect level-order siblings",
      "Zigzag traversal",
    ],
    template: `from collections import deque

def bfs(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result`,
    complexity: { time: "O(n)", space: "O(n)" },
    relatedPatterns: ["tree-dfs"],
    difficulty: 2,
    icon: "🌳",
    category: "trees",
  },
  {
    id: "tree-dfs",
    name: "Tree DFS",
    slug: "tree-dfs",
    description:
      "Traverse a tree depth-first using recursion or a stack. Three variants: pre-order, in-order, post-order.",
    whenToUse: [
      "Path sum problems",
      "Check tree properties (balanced, symmetric)",
      "Serialize/deserialize tree",
      "Find all paths with condition",
      "LCA (Lowest Common Ancestor)",
    ],
    template: `def dfs_path_sum(root, target):
    def dfs(node, current_sum, path):
        if not node:
            return
        
        path.append(node.val)
        current_sum += node.val
        
        # Check if leaf with target sum
        if not node.left and not node.right and current_sum == target:
            results.append(list(path))
        
        dfs(node.left, current_sum, path)
        dfs(node.right, current_sum, path)
        
        path.pop()  # Backtrack
    
    results = []
    dfs(root, 0, [])
    return results`,
    complexity: { time: "O(n)", space: "O(h) where h = height" },
    relatedPatterns: ["tree-bfs", "subsets"],
    difficulty: 2,
    icon: "🌲",
    category: "trees",
  },
  {
    id: "two-heaps",
    name: "Two Heaps",
    slug: "two-heaps",
    description:
      "Use a max-heap and min-heap together to efficiently find the median or manage a stream of numbers.",
    whenToUse: [
      "Find median from data stream",
      "Sliding window median",
      "Maximize capital (scheduling)",
      "Need quick access to both min and max",
    ],
    template: `import heapq

class MedianFinder:
    def __init__(self):
        self.max_heap = []  # Lower half (negated for max behavior)
        self.min_heap = []  # Upper half
    
    def add_num(self, num):
        heapq.heappush(self.max_heap, -num)
        
        # Ensure max_heap top <= min_heap top
        if self.min_heap and -self.max_heap[0] > self.min_heap[0]:
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        
        # Balance sizes (max_heap can have at most 1 extra)
        if len(self.max_heap) > len(self.min_heap) + 1:
            heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        elif len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))
    
    def find_median(self):
        if len(self.max_heap) > len(self.min_heap):
            return -self.max_heap[0]
        return (-self.max_heap[0] + self.min_heap[0]) / 2`,
    complexity: { time: "O(log n) insert, O(1) median", space: "O(n)" },
    relatedPatterns: ["top-k-elements"],
    difficulty: 4,
    icon: "⚖️",
    category: "advanced",
  },
  {
    id: "subsets",
    name: "Subsets (Backtracking)",
    slug: "subsets",
    description:
      "Generate all subsets, permutations, or combinations using backtracking. Build solutions incrementally and prune invalid branches.",
    whenToUse: [
      "Generate all subsets/combinations",
      "Generate all permutations",
      "Combination sum problems",
      "Letter combinations",
      "Constraint satisfaction (N-Queens, Sudoku)",
    ],
    template: `def subsets(nums):
    result = []
    
    def backtrack(start, current):
        result.append(list(current))
        
        for i in range(start, len(nums)):
            current.append(nums[i])     # Choose
            backtrack(i + 1, current)    # Explore
            current.pop()               # Un-choose (backtrack)
    
    backtrack(0, [])
    return result

def permutations(nums):
    result = []
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(list(current))
            return
        
        for num in nums:
            if num not in current:
                current.append(num)
                backtrack(current)
                current.pop()
    
    backtrack([])
    return result`,
    complexity: { time: "O(2^n) subsets, O(n!) permutations", space: "O(n)" },
    relatedPatterns: ["tree-dfs"],
    difficulty: 3,
    icon: "🧩",
    category: "advanced",
  },
  {
    id: "modified-binary-search",
    name: "Modified Binary Search",
    slug: "modified-binary-search",
    description:
      "Adapt binary search for rotated arrays, find boundaries, or search in infinite/unknown-size arrays.",
    whenToUse: [
      "Sorted or rotated sorted array",
      "Find element in sorted array",
      "Find boundary (first/last occurrence)",
      "Search in nearly sorted array",
      "Minimize/maximize with monotonic condition",
    ],
    template: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        if nums[left] <= nums[mid]:  # Left half sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1`,
    complexity: { time: "O(log n)", space: "O(1)" },
    relatedPatterns: [],
    difficulty: 3,
    icon: "🔍",
    category: "search",
  },
  {
    id: "top-k-elements",
    name: "Top K Elements",
    slug: "top-k-elements",
    description:
      "Use a heap to efficiently find the top/bottom K elements from a collection without fully sorting it.",
    whenToUse: [
      "Find K largest/smallest elements",
      "K most frequent elements",
      "K closest points to origin",
      "Sort characters by frequency",
      "Reorganize string",
    ],
    template: `import heapq

def top_k_frequent(nums, k):
    freq = {}
    for n in nums:
        freq[n] = freq.get(n, 0) + 1
    
    # Use min-heap of size k
    return heapq.nlargest(k, freq.keys(), key=freq.get)

def k_closest_points(points, k):
    # Max-heap of size k (negate distance for max behavior)
    heap = []
    
    for x, y in points:
        dist = -(x*x + y*y)
        if len(heap) < k:
            heapq.heappush(heap, (dist, x, y))
        elif dist > heap[0][0]:
            heapq.heapreplace(heap, (dist, x, y))
    
    return [[x, y] for _, x, y in heap]`,
    complexity: { time: "O(n log k)", space: "O(k)" },
    relatedPatterns: ["two-heaps", "k-way-merge"],
    difficulty: 3,
    icon: "🏆",
    category: "advanced",
  },
  {
    id: "k-way-merge",
    name: "K-way Merge",
    slug: "k-way-merge",
    description:
      "Merge K sorted arrays or linked lists efficiently using a min-heap to always pick the smallest element.",
    whenToUse: [
      "Merge K sorted lists",
      "K-th smallest in sorted matrix",
      "Smallest range covering K lists",
      "Multiple sorted inputs need merging",
    ],
    template: `import heapq

def merge_k_sorted(lists):
    heap = []
    
    # Initialize heap with first element from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0].val, i, lst[0]))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next`,
    complexity: { time: "O(N log K)", space: "O(K)" },
    relatedPatterns: ["top-k-elements"],
    difficulty: 4,
    icon: "🔀",
    category: "advanced",
  },
  {
    id: "topological-sort",
    name: "Topological Sort",
    slug: "topological-sort",
    description:
      "Order nodes in a directed acyclic graph (DAG) such that for every edge u→v, u comes before v.",
    whenToUse: [
      "Task scheduling with dependencies",
      "Course prerequisites",
      "Build system ordering",
      "Detect cycles in directed graph",
      "Alien dictionary problem",
    ],
    template: `from collections import deque, defaultdict

def topological_sort(vertices, edges):
    graph = defaultdict(list)
    in_degree = {i: 0 for i in range(vertices)}
    
    for parent, child in edges:
        graph[parent].append(child)
        in_degree[child] += 1
    
    # Start with nodes having 0 in-degree
    queue = deque([n for n in in_degree if in_degree[n] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    if len(result) != vertices:
        return []  # Cycle detected
    
    return result`,
    complexity: { time: "O(V + E)", space: "O(V + E)" },
    relatedPatterns: ["tree-bfs"],
    difficulty: 4,
    icon: "📐",
    category: "advanced",
  },
  {
    id: "dp-fibonacci",
    name: "Dynamic Programming - Fibonacci Pattern",
    slug: "dp-fibonacci",
    description:
      "Solve DP problems where each state depends on the previous 1-2 states. Includes staircase, house robber, and similar patterns.",
    whenToUse: [
      "Current state depends on previous 1-2 states",
      "Climbing stairs variations",
      "House robber (non-adjacent selection)",
      "Fibonacci-like recurrence",
      "Minimum cost path with limited lookback",
    ],
    template: `def climb_stairs(n):
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1

def house_robber(nums):
    if len(nums) <= 2:
        return max(nums)
    
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1`,
    complexity: { time: "O(n)", space: "O(1) with optimization" },
    relatedPatterns: [],
    difficulty: 3,
    icon: "🧮",
    category: "advanced",
  },
];

/**
 * Get a pattern by its ID or slug.
 */
export function getPattern(idOrSlug: string): Pattern | undefined {
  return patterns.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

/**
 * Get patterns by category.
 */
export function getPatternsByCategory(category: Pattern["category"]): Pattern[] {
  return patterns.filter((p) => p.category === category);
}

/**
 * Get related patterns for a given pattern.
 */
export function getRelatedPatterns(patternId: string): Pattern[] {
  const pattern = getPattern(patternId);
  if (!pattern) return [];
  return pattern.relatedPatterns
    .map((id) => getPattern(id))
    .filter(Boolean) as Pattern[];
}
