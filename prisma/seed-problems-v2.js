// Seed script with real DSA problems and comprehensive test cases
// Run with: node prisma/seed-problems-v2.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const patterns = [
  {
    slug: "two_pointers",
    name: "Two Pointers",
    description:
      "Use two pointers to traverse data structure from different positions, often from both ends moving toward center or at different speeds.",
    whenToUse: JSON.stringify([
      "Sorted array or linked list",
      "Need to find pair with target sum",
      "Need to compare elements from both ends",
      "Need to reverse in-place",
      "Searching for triplets or quadruplets",
      "Removing duplicates from sorted array",
    ]),
    template: `def two_pointers(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current = arr[left] + arr[right]
        
        if current == target:
            return [left, right]  # Found!
        elif current < target:
            left += 1   # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return []  # Not found`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 1,
  },
  {
    slug: "sliding_window",
    name: "Sliding Window",
    description:
      "Maintain a 'window' over a portion of data that slides through, useful for finding subarrays/substrings meeting certain criteria.",
    whenToUse: JSON.stringify([
      "Find longest/shortest subarray with condition",
      "Find subarray with given sum",
      "String problems with substring requirements",
      "Maximum/minimum in all windows of size k",
      "Problems involving contiguous sequence",
    ]),
    template: `def sliding_window(arr, k):
    window_start = 0
    window_sum = 0
    result = []
    
    for window_end in range(len(arr)):
        window_sum += arr[window_end]
        
        if window_end >= k - 1:
            result.append(window_sum)
            window_sum -= arr[window_start]
            window_start += 1
    
    return result`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 2,
  },
  {
    slug: "fast_slow_pointers",
    name: "Fast & Slow Pointers",
    description:
      "Two pointers moving at different speeds through a sequence, useful for cycle detection and finding middle elements.",
    whenToUse: JSON.stringify([
      "Detect cycle in linked list or array",
      "Find middle of linked list",
      "Find cycle start position",
      "Check if linked list is palindrome",
      "Problems involving cyclic sequences",
    ]),
    template: `def fast_slow_pointers(head):
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True  # Cycle detected!
    
    return False  # No cycle`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 3,
  },
  {
    slug: "binary_search",
    name: "Modified Binary Search",
    description:
      "Variations of binary search for rotated arrays, finding boundaries, or searching in infinite arrays.",
    whenToUse: JSON.stringify([
      "Sorted or rotated sorted array",
      "Find element in sorted array",
      "Find first/last occurrence",
      "Search in nearly sorted array",
      "Find peak element",
      "Minimize/maximize with monotonic condition",
    ]),
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
    
    return -1  # Not found`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    difficulty: 2,
    order: 4,
  },
  {
    slug: "hash_map",
    name: "Hash Map Pattern",
    description:
      "Use hash maps for O(1) lookups to track frequencies, find pairs, or cache computed values.",
    whenToUse: JSON.stringify([
      "Need O(1) lookup time",
      "Count frequencies of elements",
      "Find pairs with target sum (unsorted)",
      "Check for duplicates",
      "Group elements by property",
      "Cache computed results",
    ]),
    template: `def hash_map_pattern(arr, target):
    seen = {}  # value -> index
    
    for i, num in enumerate(arr):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    difficulty: 1,
    order: 5,
  },
  {
    slug: "linked_list_reversal",
    name: "In-place Linked List Reversal",
    description:
      "Reverse links between nodes of a linked list in-place using prev/curr/next pointers.",
    whenToUse: JSON.stringify([
      "Reverse entire linked list",
      "Reverse a sub-list (between positions)",
      "Reverse every k-group",
      "Reverse alternating k-group",
    ]),
    template: `def reverse_list(head):
    prev = None
    curr = head
    
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
];

const problems = [
  // ═══════════════════════════════════════════════════════════════
  // TWO POINTERS PROBLEMS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "two-sum-sorted",
    title: "Two Sum II - Sorted Array",
    difficulty: "easy",
    pattern: "two_pointers",
    topics: JSON.stringify(["arrays", "two_pointers"]),
    companies: JSON.stringify(["Amazon", "Google", "Facebook"]),
    category: "DSA",
    description: `Given a **1-indexed** array of integers \`numbers\` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers (1-indexed) as an array \`[index1, index2]\`.

You may assume that each input would have **exactly one solution** and you may not use the same element twice.

**Your solution must use only constant extra space.**`,
    examples: JSON.stringify([
      {
        input: "numbers = [2,7,11,15], target = 9",
        output: "[1,2]",
        explanation:
          "The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.",
      },
      {
        input: "numbers = [2,3,4], target = 6",
        output: "[1,3]",
        explanation:
          "The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3.",
      },
      {
        input: "numbers = [-1,0], target = -1",
        output: "[1,2]",
        explanation:
          "The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2.",
      },
    ]),
    constraints: JSON.stringify([
      "2 <= numbers.length <= 3 * 10^4",
      "-1000 <= numbers[i] <= 1000",
      "numbers is sorted in non-decreasing order",
      "-1000 <= target <= 1000",
      "Only one valid answer exists",
    ]),
    hints: JSON.stringify([
      "Since the array is sorted, think about how you can use that property.",
      "If you pick two numbers and their sum is too small, which pointer should move?",
      "If the sum is too large, which pointer should move?",
      "Use two pointers: one at the start, one at the end.",
    ]),
    starterCode: `def two_sum(numbers: list[int], target: int) -> list[int]:
    # Your code here
    pass

# Test
print(two_sum([2, 7, 11, 15], 9))`,
    testCases: JSON.stringify([
      {
        input: { numbers: [2, 7, 11, 15], target: 9 },
        expectedOutput: [1, 2],
      },
      { input: { numbers: [2, 3, 4], target: 6 }, expectedOutput: [1, 3] },
      { input: { numbers: [-1, 0], target: -1 }, expectedOutput: [1, 2] },
      {
        input: { numbers: [1, 2, 3, 4, 5], target: 9 },
        expectedOutput: [4, 5],
      },
      {
        input: { numbers: [1, 3, 5, 7, 9], target: 10 },
        expectedOutput: [2, 5],
      },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { numbers: [1, 2], target: 3 }, expectedOutput: [1, 2] },
      {
        input: { numbers: [-5, -3, -1, 0, 2, 4, 6], target: 1 },
        expectedOutput: [3, 5],
      },
      {
        input: { numbers: [1, 1, 1, 1, 1, 1], target: 2 },
        expectedOutput: [1, 2],
      },
      {
        input: { numbers: [-100, -50, 0, 50, 100], target: 0 },
        expectedOutput: [1, 5],
      },
    ]),
    solutionApproach: `**Two Pointers Approach:**

Since the array is sorted, we use two pointers starting from both ends:
1. Initialize \`left = 0\` and \`right = len(numbers) - 1\`
2. Calculate \`sum = numbers[left] + numbers[right]\`
3. If \`sum == target\`: Found! Return indices (1-indexed)
4. If \`sum < target\`: Move \`left\` right for larger sum
5. If \`sum > target\`: Move \`right\` left for smaller sum

**Why it works:** Moving left pointer right increases sum; moving right pointer left decreases sum.`,
    solutionCode: `def two_sum(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    visualizationType: "two_pointers",
    order: 1,
  },
  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "easy",
    pattern: "two_pointers",
    topics: JSON.stringify(["strings", "two_pointers"]),
    companies: JSON.stringify(["Facebook", "Microsoft", "Apple"]),
    category: "DSA",
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: JSON.stringify([
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation: "After removing non-alphanumeric, s is empty. An empty string is a palindrome.",
      },
    ]),
    constraints: JSON.stringify([
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters",
    ]),
    hints: JSON.stringify([
      "Consider using two pointers, one from the start and one from the end.",
      "Skip non-alphanumeric characters.",
      "Compare characters case-insensitively.",
    ]),
    starterCode: `def is_palindrome(s: str) -> bool:
    # Your code here
    pass

# Test
print(is_palindrome("A man, a plan, a canal: Panama"))`,
    testCases: JSON.stringify([
      {
        input: { s: "A man, a plan, a canal: Panama" },
        expectedOutput: true,
      },
      { input: { s: "race a car" }, expectedOutput: false },
      { input: { s: " " }, expectedOutput: true },
      {
        input: { s: "Was it a car or a cat I saw?" },
        expectedOutput: true,
      },
      { input: { s: "hello" }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "a" }, expectedOutput: true },
      { input: { s: "ab" }, expectedOutput: false },
      { input: { s: "aa" }, expectedOutput: true },
      { input: { s: "0P" }, expectedOutput: false },
      { input: { s: "No 'x' in Nixon" }, expectedOutput: true },
    ]),
    solutionApproach: `**Two Pointers:**

1. Use \`left\` at start, \`right\` at end
2. Skip non-alphanumeric characters
3. Compare lowercase characters
4. If different → not palindrome
5. If pointers meet → palindrome`,
    solutionCode: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    visualizationType: "two_pointers",
    order: 2,
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "medium",
    pattern: "two_pointers",
    topics: JSON.stringify(["arrays", "two_pointers", "greedy"]),
    companies: JSON.stringify(["Amazon", "Google", "Goldman Sachs"]),
    category: "DSA",
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

**Notice** that you may not slant the container.`,
    examples: JSON.stringify([
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The max area is between index 1 (height 8) and index 8 (height 7). Area = min(8,7) * (8-1) = 49",
      },
      {
        input: "height = [1,1]",
        output: "1",
        explanation: "Area = min(1,1) * (1-0) = 1",
      },
    ]),
    constraints: JSON.stringify([
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4",
    ]),
    hints: JSON.stringify([
      "Start with the widest container (first and last lines).",
      "The area is limited by the shorter line.",
      "To potentially get more area, move the pointer at the shorter line.",
      "Moving the taller line can only decrease width without guaranteed height increase.",
    ]),
    starterCode: `def max_area(height: list[int]) -> int:
    # Your code here
    pass

# Test
print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))`,
    testCases: JSON.stringify([
      {
        input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
        expectedOutput: 49,
      },
      { input: { height: [1, 1] }, expectedOutput: 1 },
      { input: { height: [4, 3, 2, 1, 4] }, expectedOutput: 16 },
      { input: { height: [1, 2, 1] }, expectedOutput: 2 },
      { input: { height: [2, 3, 4, 5, 18, 17, 6] }, expectedOutput: 17 },
    ]),
    hiddenTestCases: JSON.stringify([
      {
        input: { height: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        expectedOutput: 25,
      },
      {
        input: { height: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
        expectedOutput: 25,
      },
      {
        input: { height: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
        expectedOutput: 9,
      },
      { input: { height: [100, 1, 1, 1, 100] }, expectedOutput: 400 },
    ]),
    solutionApproach: `**Two Pointers with Greedy:**

1. Start with widest container: left=0, right=n-1
2. Calculate area = min(height[left], height[right]) * (right - left)
3. Move the pointer at the shorter line
4. Track maximum area seen`,
    solutionCode: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    visualizationType: "two_pointers",
    order: 3,
  },

  // ═══════════════════════════════════════════════════════════════
  // SLIDING WINDOW PROBLEMS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "maximum-subarray-sum-k",
    title: "Maximum Sum Subarray of Size K",
    difficulty: "easy",
    pattern: "sliding_window",
    topics: JSON.stringify(["arrays", "sliding_window"]),
    companies: JSON.stringify(["Amazon", "Microsoft"]),
    category: "DSA",
    description: `Given an array of positive integers \`nums\` and a positive integer \`k\`, find the **maximum sum** of any contiguous subarray of size \`k\`.

Return the maximum sum.`,
    examples: JSON.stringify([
      {
        input: "nums = [2, 1, 5, 1, 3, 2], k = 3",
        output: "9",
        explanation: "Subarray [5, 1, 3] has the maximum sum of 9.",
      },
      {
        input: "nums = [2, 3, 4, 1, 5], k = 2",
        output: "7",
        explanation: "Subarray [3, 4] has the maximum sum of 7.",
      },
    ]),
    constraints: JSON.stringify([
      "1 <= nums.length <= 10^5",
      "1 <= nums[i] <= 10^4",
      "1 <= k <= nums.length",
    ]),
    hints: JSON.stringify([
      "Calculate the sum of the first k elements.",
      "Slide the window: add the next element, remove the first element of previous window.",
      "Track the maximum sum seen.",
    ]),
    starterCode: `def max_sum_subarray(nums: list[int], k: int) -> int:
    # Your code here
    pass

# Test
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))`,
    testCases: JSON.stringify([
      { input: { nums: [2, 1, 5, 1, 3, 2], k: 3 }, expectedOutput: 9 },
      { input: { nums: [2, 3, 4, 1, 5], k: 2 }, expectedOutput: 7 },
      { input: { nums: [1, 2, 3, 4, 5], k: 1 }, expectedOutput: 5 },
      { input: { nums: [1, 2, 3, 4, 5], k: 5 }, expectedOutput: 15 },
      { input: { nums: [5, 5, 5, 5, 5], k: 3 }, expectedOutput: 15 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [10], k: 1 }, expectedOutput: 10 },
      { input: { nums: [1, 2], k: 2 }, expectedOutput: 3 },
      { input: { nums: [100, 1, 1, 1, 100], k: 2 }, expectedOutput: 101 },
    ]),
    solutionApproach: `**Fixed-Size Sliding Window:**

1. Calculate sum of first k elements (initial window)
2. Slide window: add new element, remove old element
3. Track maximum sum`,
    solutionCode: `def max_sum_subarray(nums: list[int], k: int) -> int:
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum += nums[i]
        window_sum -= nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    visualizationType: "sliding_window",
    order: 4,
  },
  {
    slug: "longest-substring-k-distinct",
    title: "Longest Substring with K Distinct Characters",
    difficulty: "medium",
    pattern: "sliding_window",
    topics: JSON.stringify(["strings", "sliding_window", "hash_map"]),
    companies: JSON.stringify(["Google", "Amazon", "Facebook"]),
    category: "DSA",
    description: `Given a string \`s\` and an integer \`k\`, return the length of the longest substring that contains **at most** \`k\` distinct characters.`,
    examples: JSON.stringify([
      {
        input: 's = "araaci", k = 2',
        output: "4",
        explanation:
          'The longest substring with at most 2 distinct characters is "araa".',
      },
      {
        input: 's = "araaci", k = 1',
        output: "2",
        explanation:
          'The longest substring with at most 1 distinct character is "aa".',
      },
      {
        input: 's = "cbbebi", k = 3',
        output: "5",
        explanation:
          'The longest substrings with at most 3 distinct characters are "cbbeb" and "bbebi".',
      },
    ]),
    constraints: JSON.stringify([
      "1 <= s.length <= 5 * 10^4",
      "0 <= k <= 50",
    ]),
    hints: JSON.stringify([
      "Use a hash map to count character frequencies in the current window.",
      "Expand the window by moving the right pointer.",
      "When distinct characters exceed k, shrink from the left.",
      "Track the maximum window size.",
    ]),
    starterCode: `def longest_substring_k_distinct(s: str, k: int) -> int:
    # Your code here
    pass

# Test
print(longest_substring_k_distinct("araaci", 2))`,
    testCases: JSON.stringify([
      { input: { s: "araaci", k: 2 }, expectedOutput: 4 },
      { input: { s: "araaci", k: 1 }, expectedOutput: 2 },
      { input: { s: "cbbebi", k: 3 }, expectedOutput: 5 },
      { input: { s: "aaa", k: 1 }, expectedOutput: 3 },
      { input: { s: "abcdef", k: 3 }, expectedOutput: 3 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "a", k: 1 }, expectedOutput: 1 },
      { input: { s: "a", k: 0 }, expectedOutput: 0 },
      { input: { s: "aabbcc", k: 2 }, expectedOutput: 4 },
      { input: { s: "abaccc", k: 2 }, expectedOutput: 4 },
    ]),
    solutionApproach: `**Variable-Size Sliding Window:**

1. Use hash map to track character frequencies
2. Expand window with right pointer
3. If distinct chars > k, shrink from left
4. Track max valid window size`,
    solutionCode: `def longest_substring_k_distinct(s: str, k: int) -> int:
    if k == 0:
        return 0
    
    char_count = {}
    max_length = 0
    window_start = 0
    
    for window_end in range(len(s)):
        right_char = s[window_end]
        char_count[right_char] = char_count.get(right_char, 0) + 1
        
        while len(char_count) > k:
            left_char = s[window_start]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            window_start += 1
        
        max_length = max(max_length, window_end - window_start + 1)
    
    return max_length`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    visualizationType: "sliding_window",
    order: 5,
  },

  // ═══════════════════════════════════════════════════════════════
  // HASH MAP PROBLEMS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    pattern: "hash_map",
    topics: JSON.stringify(["arrays", "hash_map"]),
    companies: JSON.stringify([
      "Google",
      "Amazon",
      "Facebook",
      "Apple",
      "Microsoft",
    ]),
    category: "DSA",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: JSON.stringify([
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
      },
    ]),
    constraints: JSON.stringify([
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists",
    ]),
    hints: JSON.stringify([
      "For each number, you need to find if (target - number) exists.",
      "A hash map can help you look up values in O(1) time.",
      "Store each number and its index as you iterate.",
    ]),
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass

# Test
print(two_sum([2, 7, 11, 15], 9))`,
    testCases: JSON.stringify([
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1],
      },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
      {
        input: { nums: [1, 2, 3, 4, 5], target: 9 },
        expectedOutput: [3, 4],
      },
      {
        input: { nums: [-1, -2, -3, -4, -5], target: -8 },
        expectedOutput: [2, 4],
      },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [0, 4, 3, 0], target: 0 }, expectedOutput: [0, 3] },
      {
        input: { nums: [-3, 4, 3, 90], target: 0 },
        expectedOutput: [0, 2],
      },
      {
        input: { nums: [1, 5, 5, 1], target: 10 },
        expectedOutput: [1, 2],
      },
    ]),
    solutionApproach: `**Hash Map Approach:**

1. Create empty hash map {value: index}
2. For each number at index i:
   - complement = target - num
   - If complement in map → return [map[complement], i]
   - Store num: i in map
3. O(n) time, O(n) space`,
    solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    visualizationType: "hash_map",
    order: 6,
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "easy",
    pattern: "hash_map",
    topics: JSON.stringify(["arrays", "hash_map"]),
    companies: JSON.stringify(["Amazon", "Apple", "Adobe"]),
    category: "DSA",
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    examples: JSON.stringify([
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "1 appears twice.",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "All elements are distinct.",
      },
      {
        input: "nums = [1,1,1,3,3,4,3,2,4,2]",
        output: "true",
        explanation: "Multiple elements appear more than once.",
      },
    ]),
    constraints: JSON.stringify([
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
    ]),
    hints: JSON.stringify([
      "Use a set to track seen elements.",
      "If you encounter an element already in the set, return True.",
      "A set provides O(1) lookup time.",
    ]),
    starterCode: `def contains_duplicate(nums: list[int]) -> bool:
    # Your code here
    pass

# Test
print(contains_duplicate([1, 2, 3, 1]))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: true },
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: false },
      {
        input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] },
        expectedOutput: true,
      },
      { input: { nums: [1] }, expectedOutput: false },
      { input: { nums: [1, 1] }, expectedOutput: true },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [0, 0] }, expectedOutput: true },
      { input: { nums: [-1, -1] }, expectedOutput: true },
    ]),
    solutionApproach: `**Hash Set Approach:**

1. Create empty set
2. For each number: if in set → True; else add to set
3. Return False after loop`,
    solutionCode: `def contains_duplicate(nums: list[int]) -> bool:
    seen = set()
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    visualizationType: "hash_map",
    order: 7,
  },

  // ═══════════════════════════════════════════════════════════════
  // BINARY SEARCH PROBLEMS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "easy",
    pattern: "binary_search",
    topics: JSON.stringify(["arrays", "binary_search"]),
    companies: JSON.stringify(["Microsoft", "Apple", "Bloomberg"]),
    category: "DSA",
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: JSON.stringify([
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1.",
      },
    ]),
    constraints: JSON.stringify([
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All integers in nums are unique",
      "nums is sorted in ascending order",
    ]),
    hints: JSON.stringify([
      "Compare target with the middle element.",
      "If target is smaller, search left half.",
      "If target is larger, search right half.",
      "Repeat until found or range is empty.",
    ]),
    starterCode: `def binary_search(nums: list[int], target: int) -> int:
    # Your code here
    pass

# Test
print(binary_search([-1, 0, 3, 5, 9, 12], 9))`,
    testCases: JSON.stringify([
      {
        input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
        expectedOutput: 4,
      },
      {
        input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 },
        expectedOutput: -1,
      },
      { input: { nums: [5], target: 5 }, expectedOutput: 0 },
      {
        input: { nums: [1, 2, 3, 4, 5], target: 1 },
        expectedOutput: 0,
      },
      {
        input: { nums: [1, 2, 3, 4, 5], target: 5 },
        expectedOutput: 4,
      },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1], target: 2 }, expectedOutput: -1 },
      { input: { nums: [1, 2], target: 2 }, expectedOutput: 1 },
    ]),
    solutionApproach: `**Binary Search:**

1. left=0, right=len-1
2. While left <= right: mid = (left+right)//2
3. If nums[mid] == target → return mid
4. If < target → left = mid+1
5. If > target → right = mid-1
6. Return -1`,
    solutionCode: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    visualizationType: "binary_search",
    order: 8,
  },
  {
    slug: "search-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    pattern: "binary_search",
    topics: JSON.stringify(["arrays", "binary_search"]),
    companies: JSON.stringify(["Facebook", "Amazon", "Microsoft", "LinkedIn"]),
    category: "DSA",
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\` such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: JSON.stringify([
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "0 is at index 4.",
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
        explanation: "3 is not in the array.",
      },
      {
        input: "nums = [1], target = 0",
        output: "-1",
        explanation: "0 is not in the array.",
      },
    ]),
    constraints: JSON.stringify([
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique",
      "nums is an ascending array that is possibly rotated",
      "-10^4 <= target <= 10^4",
    ]),
    hints: JSON.stringify([
      "One half of the array is always sorted.",
      "Determine which half is sorted by comparing mid with left.",
      "Check if target lies in the sorted half.",
      "Adjust search range accordingly.",
    ]),
    starterCode: `def search(nums: list[int], target: int) -> int:
    # Your code here
    pass

# Test
print(search([4, 5, 6, 7, 0, 1, 2], 0))`,
    testCases: JSON.stringify([
      {
        input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 },
        expectedOutput: 4,
      },
      {
        input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 },
        expectedOutput: -1,
      },
      { input: { nums: [1], target: 0 }, expectedOutput: -1 },
      { input: { nums: [1], target: 1 }, expectedOutput: 0 },
      { input: { nums: [3, 1], target: 1 }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [5, 1, 3], target: 5 }, expectedOutput: 0 },
      {
        input: { nums: [4, 5, 6, 7, 8, 1, 2, 3], target: 8 },
        expectedOutput: 4,
      },
      {
        input: { nums: [1, 2, 3, 4, 5, 6], target: 4 },
        expectedOutput: 3,
      },
    ]),
    solutionApproach: `**Modified Binary Search:**

Key insight: One half is always sorted.

1. Find mid
2. If nums[left] <= nums[mid] → left half sorted
   - Check if target in [left, mid) → search left; else right
3. Else → right half sorted
   - Check if target in (mid, right] → search right; else left`,
    solutionCode: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
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
                right = mid - 1
    
    return -1`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    visualizationType: "binary_search",
    order: 9,
  },

  // ═══════════════════════════════════════════════════════════════
  // LINKED LIST PROBLEMS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "easy",
    pattern: "linked_list_reversal",
    topics: JSON.stringify(["linked_list"]),
    companies: JSON.stringify(["Amazon", "Microsoft", "Apple", "Bloomberg"]),
    category: "DSA",
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

The input is given as an array representing the linked list values. Return the reversed array.`,
    examples: JSON.stringify([
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed.",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation: "The linked list is reversed.",
      },
      {
        input: "head = []",
        output: "[]",
        explanation: "Empty list remains empty.",
      },
    ]),
    constraints: JSON.stringify([
      "The number of nodes is in the range [0, 5000]",
      "-5000 <= Node.val <= 5000",
    ]),
    hints: JSON.stringify([
      "Keep track of the previous node.",
      "Change each node's next pointer to point to the previous node.",
      "Move all three pointers (prev, curr, next) one step forward.",
      "The new head is what prev points to at the end.",
    ]),
    starterCode: `def reverse_list(head: list[int]) -> list[int]:
    # For simplicity, we work with arrays
    # In a real interview, you'd use ListNode
    # Your code here
    pass

# Test
print(reverse_list([1, 2, 3, 4, 5]))`,
    testCases: JSON.stringify([
      {
        input: { head: [1, 2, 3, 4, 5] },
        expectedOutput: [5, 4, 3, 2, 1],
      },
      { input: { head: [1, 2] }, expectedOutput: [2, 1] },
      { input: { head: [] }, expectedOutput: [] },
      { input: { head: [1] }, expectedOutput: [1] },
      { input: { head: [1, 2, 3] }, expectedOutput: [3, 2, 1] },
    ]),
    hiddenTestCases: JSON.stringify([
      {
        input: {
          head: Array.from({ length: 100 }, (_, i) => i + 1),
        },
        expectedOutput: Array.from({ length: 100 }, (_, i) => 100 - i),
      },
    ]),
    solutionApproach: `**Iterative Reversal:**

Use three pointers: prev=None, curr=head, next
1. Save next node
2. Reverse pointer: curr.next = prev
3. Move prev and curr forward
4. New head = prev`,
    solutionCode: `def reverse_list(head: list[int]) -> list[int]:
    # Array-based for Pyodide compatibility
    return head[::-1]

# With actual linked list:
# def reverse_list(head):
#     prev = None
#     curr = head
#     while curr:
#         next_node = curr.next
#         curr.next = prev
#         prev = curr
#         curr = next_node
#     return prev`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    visualizationType: "linked_list",
    order: 10,
  },
];

async function main() {
  console.log("🌱 Seeding patterns...");

  for (const pattern of patterns) {
    await prisma.pattern.upsert({
      where: { slug: pattern.slug },
      update: pattern,
      create: pattern,
    });
    console.log(`  ✓ Pattern: ${pattern.name}`);
  }

  console.log("\n🌱 Seeding problems with test cases...");

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: problem,
      create: problem,
    });
    console.log(`  ✓ Problem: ${problem.title} (${problem.difficulty})`);
  }

  const patternCount = await prisma.pattern.count();
  const problemCount = await prisma.problem.count();
  console.log(
    `\n✅ Seeding complete! ${patternCount} patterns, ${problemCount} problems`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
