import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("💡 Seeding 50+ problems...\n");

  const problems = [
    // ═══════════════════════════════════════
    // EASY — Arrays & Strings (10 problems)
    // ═══════════════════════════════════════
    {
      slug: "two-sum",
      title: "Two Sum",
      description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.\n\n**Example 1:**\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0, 1]\n```\n\n**Example 2:**\n```\nInput: nums = [3,2,4], target = 6\nOutput: [1, 2]\n```\n\n**Constraints:**\n- 2 ≤ nums.length ≤ 10⁴\n- -10⁹ ≤ nums[i] ≤ 10⁹",
      difficulty: "easy",
      category: "arrays",
      starterCode: "def two_sum(nums, target):\n    # Return indices of two numbers that add up to target\n    pass\n\n# Read input\nimport json, sys\nnums = json.loads(input())\ntarget = int(input())\nprint(two_sum(nums, target))",
      testCases: JSON.stringify([
        { input: "[2,7,11,15]\n9", expected: "[0, 1]" },
        { input: "[3,2,4]\n6", expected: "[1, 2]" },
        { input: "[3,3]\n6", expected: "[0, 1]" }
      ]),
      solutionApproach: "Use a hash map to store each number's index. For each number, check if (target - number) exists in the map. O(n) time, O(n) space.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Meta"]),
    },
    {
      slug: "reverse-string",
      title: "Reverse String",
      description: "Write a function that reverses a list of characters in-place.\n\n**Example:**\n```\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n```\n\nDo it with O(1) extra memory.",
      difficulty: "easy",
      category: "strings",
      starterCode: "def reverse_string(s):\n    # Modify s in-place\n    pass\n\nimport json\ns = json.loads(input())\nreverse_string(s)\nprint(json.dumps(s))",
      testCases: JSON.stringify([
        { input: '["h","e","l","l","o"]', expected: '["o", "l", "l", "e", "h"]' },
        { input: '["H","a","n","n","a","h"]', expected: '["h", "a", "n", "n", "a", "H"]' },
        { input: '["a"]', expected: '["a"]' }
      ]),
      solutionApproach: "Two pointers from both ends, swap and move inward. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Microsoft"]),
    },
    {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      description: "Given a string `s` containing just `(){}[]`, determine if the input string is valid.\n\nA string is valid if:\n- Open brackets are closed by the same type\n- Open brackets are closed in the correct order\n- Every close bracket has a corresponding open bracket\n\n**Example 1:** `\"()[]{}\"` → `True`\n**Example 2:** `\"(]\"` → `False`\n**Example 3:** `\"([)]\"` → `False`",
      difficulty: "easy",
      category: "stacks",
      starterCode: "def is_valid(s):\n    # Return True if valid parentheses\n    pass\n\ns = input().strip()\nprint(is_valid(s))",
      testCases: JSON.stringify([
        { input: "()[]{}", expected: "True" },
        { input: "(]", expected: "False" },
        { input: "([)]", expected: "False" },
        { input: "{[]}", expected: "True" }
      ]),
      solutionApproach: "Use a stack. Push opening brackets. For closing brackets, pop and check match. End: stack should be empty.",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta"]),
    },
    {
      slug: "best-time-to-buy-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      description: "Given an array `prices` where `prices[i]` is the price of a stock on day `i`, find the maximum profit from one buy and one sell.\n\nIf no profit is possible, return 0.\n\n**Example:**\n```\nInput: prices = [7,1,5,3,6,4]\nOutput: 5 (Buy day 2 at 1, sell day 5 at 6)\n```",
      difficulty: "easy",
      category: "arrays",
      starterCode: "def max_profit(prices):\n    pass\n\nimport json\nprices = json.loads(input())\nprint(max_profit(prices))",
      testCases: JSON.stringify([
        { input: "[7,1,5,3,6,4]", expected: "5" },
        { input: "[7,6,4,3,1]", expected: "0" },
        { input: "[2,4,1]", expected: "2" }
      ]),
      solutionApproach: "Track minimum price seen so far. At each price, calculate profit = price - min_price. Track max profit. O(n) time.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Goldman Sachs"]),
    },
    {
      slug: "contains-duplicate",
      title: "Contains Duplicate",
      description: "Given an integer array `nums`, return `True` if any value appears at least twice, `False` if every element is distinct.\n\n**Example 1:** `[1,2,3,1]` → `True`\n**Example 2:** `[1,2,3,4]` → `False`",
      difficulty: "easy",
      category: "arrays",
      starterCode: "def contains_duplicate(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(contains_duplicate(nums))",
      testCases: JSON.stringify([
        { input: "[1,2,3,1]", expected: "True" },
        { input: "[1,2,3,4]", expected: "False" },
        { input: "[1,1,1,3,3,4,3,2,4,2]", expected: "True" }
      ]),
      solutionApproach: "Use a set. If adding a number that's already in the set, return True. O(n) time, O(n) space.",
      companyTags: JSON.stringify(["Amazon", "Apple"]),
    },
    {
      slug: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      description: "Merge two sorted linked lists into one sorted list by splicing together the nodes.\n\nFor simplicity, use arrays:\n\n**Example:**\n```\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]\n```",
      difficulty: "easy",
      category: "linked-lists",
      starterCode: "def merge_lists(list1, list2):\n    pass\n\nimport json\nlist1 = json.loads(input())\nlist2 = json.loads(input())\nprint(json.dumps(merge_lists(list1, list2)))",
      testCases: JSON.stringify([
        { input: "[1,2,4]\n[1,3,4]", expected: "[1, 1, 2, 3, 4, 4]" },
        { input: "[]\n[0]", expected: "[0]" },
        { input: "[]\n[]", expected: "[]" }
      ]),
      solutionApproach: "Two pointers, compare heads, append smaller to result. Append remaining. O(n+m) time.",
      companyTags: JSON.stringify(["Amazon", "Microsoft", "Apple"]),
    },
    {
      slug: "linked-list-cycle",
      title: "Linked List Cycle Detection",
      description: "Given an array representing a linked list and a `pos` indicating where the tail connects to (cycle), return `True` if there is a cycle.\n\n**Example:**\n```\nInput: head = [3,2,0,-4], pos = 1\nOutput: True (tail connects to node index 1)\n```\n\nFor simplicity: if pos >= 0, there's a cycle. If pos = -1, no cycle.",
      difficulty: "easy",
      category: "linked-lists",
      starterCode: "def has_cycle(head, pos):\n    pass\n\nimport json\nhead = json.loads(input())\npos = int(input())\nprint(has_cycle(head, pos))",
      testCases: JSON.stringify([
        { input: "[3,2,0,-4]\n1", expected: "True" },
        { input: "[1,2]\n0", expected: "True" },
        { input: "[1]\n-1", expected: "False" }
      ]),
      solutionApproach: "Floyd's cycle detection: slow pointer (1 step) and fast pointer (2 steps). If they meet, cycle exists. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Microsoft"]),
    },
    {
      slug: "binary-search",
      title: "Binary Search",
      description: "Given a sorted array `nums` and a `target`, return the index if found, otherwise return -1.\n\n**Example:**\n```\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\n```\n\nYou must write an O(log n) solution.",
      difficulty: "easy",
      category: "binary-search",
      starterCode: "def search(nums, target):\n    pass\n\nimport json\nnums = json.loads(input())\ntarget = int(input())\nprint(search(nums, target))",
      testCases: JSON.stringify([
        { input: "[-1,0,3,5,9,12]\n9", expected: "4" },
        { input: "[-1,0,3,5,9,12]\n2", expected: "-1" },
        { input: "[5]\n5", expected: "0" }
      ]),
      solutionApproach: "Classic binary search: lo=0, hi=len-1. While lo<=hi: mid=(lo+hi)//2. Compare and adjust bounds. O(log n).",
      companyTags: JSON.stringify(["Google", "Microsoft", "Amazon"]),
    },
    {
      slug: "palindrome-check",
      title: "Valid Palindrome",
      description: "Given a string `s`, return `True` if it is a palindrome considering only alphanumeric characters and ignoring case.\n\n**Example:**\n```\nInput: s = \"A man, a plan, a canal: Panama\"\nOutput: True\n```",
      difficulty: "easy",
      category: "strings",
      starterCode: "def is_palindrome(s):\n    pass\n\ns = input()\nprint(is_palindrome(s))",
      testCases: JSON.stringify([
        { input: "A man, a plan, a canal: Panama", expected: "True" },
        { input: "race a car", expected: "False" },
        { input: " ", expected: "True" }
      ]),
      solutionApproach: "Two pointers from both ends, skip non-alphanumeric, compare lowercase. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Meta", "Microsoft"]),
    },
    {
      slug: "max-depth-binary-tree",
      title: "Maximum Depth of Binary Tree",
      description: "Given a binary tree (as array), find its maximum depth.\n\n**Example:**\n```\nInput: [3,9,20,null,null,15,7]\nOutput: 3\n```",
      difficulty: "easy",
      category: "trees",
      starterCode: "def max_depth(tree):\n    pass\n\nimport json\ntree = json.loads(input())\nprint(max_depth(tree))",
      testCases: JSON.stringify([
        { input: "[3,9,20,null,null,15,7]", expected: "3" },
        { input: "[1,null,2]", expected: "2" },
        { input: "[]", expected: "0" }
      ]),
      solutionApproach: "Recursive: max(depth(left), depth(right)) + 1. Base case: empty = 0. O(n).",
      companyTags: JSON.stringify(["Amazon", "Google"]),
    },

    // ═══════════════════════════════════════
    // MEDIUM — Core Interview Problems (30)
    // ═══════════════════════════════════════
    {
      slug: "maximum-subarray",
      title: "Maximum Subarray",
      description: "Find the contiguous subarray with the largest sum.\n\n**Example:**\n```\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: Subarray [4,-1,2,1] has the largest sum.\n```",
      difficulty: "medium",
      category: "arrays",
      starterCode: "def max_subarray(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(max_subarray(nums))",
      testCases: JSON.stringify([
        { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
        { input: "[1]", expected: "1" },
        { input: "[5,4,-1,7,8]", expected: "23" },
        { input: "[-1]", expected: "-1" }
      ]),
      solutionApproach: "Kadane's algorithm: current_sum = max(num, current_sum + num). Track global max. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Apple", "LinkedIn"]),
    },
    {
      slug: "longest-substring-no-repeat-v2",
      title: "Longest Substring Without Repeating Characters",
      description: "Given a string `s`, find the length of the longest substring without repeating characters.\n\n**Example:**\n```\nInput: s = \"abcabcbb\"\nOutput: 3 (\"abc\")\n```",
      difficulty: "medium",
      category: "sliding-window",
      starterCode: "def length_of_longest_substring(s):\n    pass\n\ns = input()\nprint(length_of_longest_substring(s))",
      testCases: JSON.stringify([
        { input: "abcabcbb", expected: "3" },
        { input: "bbbbb", expected: "1" },
        { input: "pwwkew", expected: "3" },
        { input: "", expected: "0" }
      ]),
      solutionApproach: "Sliding window with a set. Expand right, if duplicate found shrink left. Track max window size. O(n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft", "Apple"]),
    },
    {
      slug: "three-sum",
      title: "3Sum",
      description: "Given array `nums`, find all unique triplets that sum to zero.\n\n**Example:**\n```\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\n```\n\nThe solution set must not contain duplicate triplets.",
      difficulty: "medium",
      category: "two-pointers",
      starterCode: "def three_sum(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nresult = three_sum(nums)\nprint(json.dumps(sorted([sorted(x) for x in result])))",
      testCases: JSON.stringify([
        { input: "[-1,0,1,2,-1,-4]", expected: "[[-1, -1, 2], [-1, 0, 1]]" },
        { input: "[0,1,1]", expected: "[]" },
        { input: "[0,0,0]", expected: "[[0, 0, 0]]" }
      ]),
      solutionApproach: "Sort array. Fix one number, use two pointers on remainder. Skip duplicates. O(n²).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "group-anagrams",
      title: "Group Anagrams",
      description: "Given an array of strings, group anagrams together.\n\n**Example:**\n```\nInput: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nOutput: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]\n```",
      difficulty: "medium",
      category: "hash-maps",
      starterCode: "def group_anagrams(strs):\n    pass\n\nimport json\nstrs = json.loads(input())\nresult = group_anagrams(strs)\nprint(json.dumps([sorted(g) for g in sorted(result, key=lambda x: x[0])]))",
      testCases: JSON.stringify([
        { input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]' },
        { input: '[""]', expected: '[[""]]' },
        { input: '["a"]', expected: '[["a"]]' }
      ]),
      solutionApproach: "Use sorted string as key in a hash map. Group by key. O(n * k log k) where k is max string length.",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta"]),
    },
    {
      slug: "product-except-self",
      title: "Product of Array Except Self",
      description: "Given array `nums`, return array where `answer[i]` is the product of all elements except `nums[i]`.\n\n**Do not use division.**\n\n**Example:**\n```\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n```",
      difficulty: "medium",
      category: "arrays",
      starterCode: "def product_except_self(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(json.dumps(product_except_self(nums)))",
      testCases: JSON.stringify([
        { input: "[1,2,3,4]", expected: "[24, 12, 8, 6]" },
        { input: "[-1,1,0,-3,3]", expected: "[0, 0, 9, 0, 0]" }
      ]),
      solutionApproach: "Two passes: left products then right products. O(n) time, O(1) extra space (output array doesn't count).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Apple"]),
    },
    {
      slug: "container-with-most-water-v2",
      title: "Container With Most Water",
      description: "Given `n` vertical lines at positions `[i, height[i]]`, find two lines that form a container holding the most water.\n\n**Example:**\n```\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\n```",
      difficulty: "medium",
      category: "two-pointers",
      starterCode: "def max_area(height):\n    pass\n\nimport json\nheight = json.loads(input())\nprint(max_area(height))",
      testCases: JSON.stringify([
        { input: "[1,8,6,2,5,4,8,3,7]", expected: "49" },
        { input: "[1,1]", expected: "1" },
        { input: "[4,3,2,1,4]", expected: "16" }
      ]),
      solutionApproach: "Two pointers at both ends. Calculate area. Move the shorter line inward. O(n) time.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Goldman Sachs"]),
    },
    {
      slug: "number-of-islands",
      title: "Number of Islands",
      description: "Given a 2D grid of `'1'`s (land) and `'0'`s (water), count the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n**Example:**\n```\nInput: grid = [\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"1\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"1\",\"1\"]\n]\nOutput: 3\n```",
      difficulty: "medium",
      category: "graphs",
      starterCode: "def num_islands(grid):\n    pass\n\nimport json\ngrid = json.loads(input())\nprint(num_islands(grid))",
      testCases: JSON.stringify([
        { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expected: "1" },
        { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: "3" }
      ]),
      solutionApproach: "BFS/DFS from each unvisited '1'. Mark all connected '1's as visited. Count number of BFS/DFS calls. O(m*n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "invert-binary-tree",
      title: "Invert Binary Tree",
      description: "Given the root of a binary tree (as array), invert the tree and return the result.\n\n**Example:**\n```\nInput: [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]\n```",
      difficulty: "easy",
      category: "trees",
      starterCode: "def invert_tree(tree):\n    if not tree:\n        return []\n    pass\n\nimport json\ntree = json.loads(input())\nprint(json.dumps(invert_tree(tree)))",
      testCases: JSON.stringify([
        { input: "[4,2,7,1,3,6,9]", expected: "[4, 7, 2, 9, 6, 3, 1]" },
        { input: "[2,1,3]", expected: "[2, 3, 1]" },
        { input: "[]", expected: "[]" }
      ]),
      solutionApproach: "Recursion: swap left and right children, then recurse on both subtrees. O(n).",
      companyTags: JSON.stringify(["Google", "Amazon"]),
    },
    {
      slug: "validate-bst",
      title: "Validate Binary Search Tree",
      description: "Given a binary tree (as array), determine if it is a valid BST.\n\nBST rule: For every node, all left descendants < node < all right descendants.\n\n**Example 1:** `[2,1,3]` → `True`\n**Example 2:** `[5,1,4,null,null,3,6]` → `False`",
      difficulty: "medium",
      category: "trees",
      starterCode: "def is_valid_bst(tree):\n    pass\n\nimport json\ntree = json.loads(input())\nprint(is_valid_bst(tree))",
      testCases: JSON.stringify([
        { input: "[2,1,3]", expected: "True" },
        { input: "[5,1,4,null,null,3,6]", expected: "False" },
        { input: "[1]", expected: "True" }
      ]),
      solutionApproach: "Recursive with min/max bounds, or in-order traversal should produce sorted array. O(n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta"]),
    },
    {
      slug: "level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      description: "Given a binary tree (as array), return the level order traversal as a list of lists.\n\n**Example:**\n```\nInput: [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]\n```",
      difficulty: "medium",
      category: "trees",
      starterCode: "def level_order(tree):\n    pass\n\nimport json\ntree = json.loads(input())\nprint(json.dumps(level_order(tree)))",
      testCases: JSON.stringify([
        { input: "[3,9,20,null,null,15,7]", expected: "[[3], [9, 20], [15, 7]]" },
        { input: "[1]", expected: "[[1]]" },
        { input: "[]", expected: "[]" }
      ]),
      solutionApproach: "BFS with a queue. Process one level at a time. O(n).",
      companyTags: JSON.stringify(["Amazon", "Microsoft", "Meta"]),
    },
    {
      slug: "climbing-stairs-v2",
      title: "Climbing Stairs",
      description: "You are climbing a staircase. It takes `n` steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb?\n\n**Example:**\n```\nInput: n = 3\nOutput: 3 (1+1+1, 1+2, 2+1)\n```",
      difficulty: "easy",
      category: "dynamic-programming",
      starterCode: "def climb_stairs(n):\n    pass\n\nn = int(input())\nprint(climb_stairs(n))",
      testCases: JSON.stringify([
        { input: "2", expected: "2" },
        { input: "3", expected: "3" },
        { input: "5", expected: "8" }
      ]),
      solutionApproach: "Fibonacci-like DP: dp[i] = dp[i-1] + dp[i-2]. O(n) time, O(1) space with two variables.",
      companyTags: JSON.stringify(["Amazon", "Google", "Apple"]),
    },
    {
      slug: "coin-change",
      title: "Coin Change",
      description: "Given coins of different denominations and a total `amount`, return the fewest number of coins needed. If impossible, return -1.\n\n**Example:**\n```\nInput: coins = [1,5,10], amount = 12\nOutput: 3 (10+1+1)\n```",
      difficulty: "medium",
      category: "dynamic-programming",
      starterCode: "def coin_change(coins, amount):\n    pass\n\nimport json\ncoins = json.loads(input())\namount = int(input())\nprint(coin_change(coins, amount))",
      testCases: JSON.stringify([
        { input: "[1,5,10]\n12", expected: "3" },
        { input: "[2]\n3", expected: "-1" },
        { input: "[1]\n0", expected: "0" }
      ]),
      solutionApproach: "Bottom-up DP: dp[i] = min coins for amount i. For each amount, try all coins. O(amount * coins).",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Goldman Sachs"]),
    },
    {
      slug: "house-robber",
      title: "House Robber",
      description: "Each house has money. Adjacent houses have security — can't rob two adjacent houses. Return max amount.\n\n**Example:**\n```\nInput: nums = [2,7,9,3,1]\nOutput: 12 (2+9+1)\n```",
      difficulty: "medium",
      category: "dynamic-programming",
      starterCode: "def rob(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(rob(nums))",
      testCases: JSON.stringify([
        { input: "[1,2,3,1]", expected: "4" },
        { input: "[2,7,9,3,1]", expected: "12" },
        { input: "[2,1,1,2]", expected: "4" }
      ]),
      solutionApproach: "DP: dp[i] = max(dp[i-1], dp[i-2] + nums[i]). O(n) time, O(1) space with two variables.",
      companyTags: JSON.stringify(["Amazon", "Google", "Cisco"]),
    },
    {
      slug: "rotate-array",
      title: "Rotate Array",
      description: "Given an array, rotate it right by `k` steps.\n\n**Example:**\n```\nInput: nums = [1,2,3,4,5,6,7], k = 3\nOutput: [5,6,7,1,2,3,4]\n```\n\nDo it in-place with O(1) extra space.",
      difficulty: "medium",
      category: "arrays",
      starterCode: "def rotate(nums, k):\n    pass\n\nimport json\nnums = json.loads(input())\nk = int(input())\nrotate(nums, k)\nprint(json.dumps(nums))",
      testCases: JSON.stringify([
        { input: "[1,2,3,4,5,6,7]\n3", expected: "[5, 6, 7, 1, 2, 3, 4]" },
        { input: "[-1,-100,3,99]\n2", expected: "[3, 99, -1, -100]" }
      ]),
      solutionApproach: "Reverse entire array, then reverse first k, then reverse rest. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Microsoft"]),
    },
    {
      slug: "min-stack",
      title: "Min Stack",
      description: "Design a stack that supports push, pop, top, and retrieving the minimum element, all in O(1).\n\nImplement `push(val)`, `pop()`, `top()`, `get_min()`.\n\n**Example:**\n```\nOperations: push(-2), push(0), push(-3), get_min(), pop(), top(), get_min()\nOutput: -3, 0, -2\n```",
      difficulty: "medium",
      category: "stacks",
      starterCode: "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def top(self):\n        pass\n    def get_min(self):\n        pass\n\nstack = MinStack()\nops = input().split(',')\nfor op in ops:\n    op = op.strip()\n    if op.startswith('push'):\n        val = int(op.split('(')[1].rstrip(')'))\n        stack.push(val)\n    elif op == 'pop':\n        stack.pop()\n    elif op == 'top':\n        print(stack.top())\n    elif op == 'getmin':\n        print(stack.get_min())",
      testCases: JSON.stringify([
        { input: "push(-2),push(0),push(-3),getmin,pop,top,getmin", expected: "-3\n0\n-2" }
      ]),
      solutionApproach: "Use two stacks: main stack and min stack. Min stack tracks current minimum at each level. All operations O(1).",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },
    {
      slug: "top-k-frequent",
      title: "Top K Frequent Elements",
      description: "Given an integer array `nums` and `k`, return the `k` most frequent elements.\n\n**Example:**\n```\nInput: nums = [1,1,1,2,2,3], k = 2\nOutput: [1, 2]\n```",
      difficulty: "medium",
      category: "hash-maps",
      starterCode: "def top_k_frequent(nums, k):\n    pass\n\nimport json\nnums = json.loads(input())\nk = int(input())\nprint(json.dumps(sorted(top_k_frequent(nums, k))))",
      testCases: JSON.stringify([
        { input: "[1,1,1,2,2,3]\n2", expected: "[1, 2]" },
        { input: "[1]\n1", expected: "[1]" }
      ]),
      solutionApproach: "Count frequencies with hash map. Use bucket sort or heap to get top k. O(n) with bucket sort.",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta"]),
    },
    {
      slug: "merge-intervals",
      title: "Merge Intervals",
      description: "Given a collection of intervals, merge all overlapping intervals.\n\n**Example:**\n```\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\n```",
      difficulty: "medium",
      category: "intervals",
      starterCode: "def merge(intervals):\n    pass\n\nimport json\nintervals = json.loads(input())\nprint(json.dumps(merge(intervals)))",
      testCases: JSON.stringify([
        { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1, 6], [8, 10], [15, 18]]" },
        { input: "[[1,4],[4,5]]", expected: "[[1, 5]]" }
      ]),
      solutionApproach: "Sort by start time. Iterate and merge if current start <= previous end. O(n log n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "search-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      description: "A sorted array was rotated at some pivot. Given a `target`, return its index or -1.\n\n**Example:**\n```\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n```\n\nMust be O(log n).",
      difficulty: "medium",
      category: "binary-search",
      starterCode: "def search(nums, target):\n    pass\n\nimport json\nnums = json.loads(input())\ntarget = int(input())\nprint(search(nums, target))",
      testCases: JSON.stringify([
        { input: "[4,5,6,7,0,1,2]\n0", expected: "4" },
        { input: "[4,5,6,7,0,1,2]\n3", expected: "-1" },
        { input: "[1]\n0", expected: "-1" }
      ]),
      solutionApproach: "Modified binary search: determine which half is sorted, then decide which half the target is in. O(log n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft", "Apple"]),
    },
    {
      slug: "letter-combinations-phone",
      title: "Letter Combinations of a Phone Number",
      description: "Given a string of digits 2-9, return all possible letter combinations (like old phone keypad).\n\n**Example:**\n```\nInput: digits = \"23\"\nOutput: [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\n```",
      difficulty: "medium",
      category: "backtracking",
      starterCode: "def letter_combinations(digits):\n    pass\n\nimport json\ndigits = input().strip()\nresult = letter_combinations(digits)\nprint(json.dumps(sorted(result) if result else []))",
      testCases: JSON.stringify([
        { input: "23", expected: '["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]' },
        { input: "", expected: "[]" },
        { input: "2", expected: '["a", "b", "c"]' }
      ]),
      solutionApproach: "Backtracking: map digits to letters, recursively build combinations. O(4^n) where n is digits length.",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta"]),
    },
    {
      slug: "subsets",
      title: "Subsets",
      description: "Given an integer array of unique elements, return all possible subsets (power set).\n\n**Example:**\n```\nInput: nums = [1,2,3]\nOutput: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]\n```",
      difficulty: "medium",
      category: "backtracking",
      starterCode: "def subsets(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nresult = subsets(nums)\nprint(json.dumps(sorted(result)))",
      testCases: JSON.stringify([
        { input: "[1,2,3]", expected: "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]" },
        { input: "[0]", expected: "[[], [0]]" }
      ]),
      solutionApproach: "Backtracking: at each element, choose to include or exclude. OR iterative: start with [[]], for each num add it to all existing subsets. O(2^n).",
      companyTags: JSON.stringify(["Amazon", "Meta", "Google"]),
    },
    {
      slug: "word-break",
      title: "Word Break",
      description: "Given a string `s` and a dictionary of words, return `True` if `s` can be segmented into dictionary words.\n\n**Example:**\n```\nInput: s = \"leetcode\", wordDict = [\"leet\",\"code\"]\nOutput: True\n```",
      difficulty: "medium",
      category: "dynamic-programming",
      starterCode: "def word_break(s, word_dict):\n    pass\n\nimport json\ns = input().strip()\nword_dict = json.loads(input())\nprint(word_break(s, word_dict))",
      testCases: JSON.stringify([
        { input: 'leetcode\n["leet","code"]', expected: "True" },
        { input: 'applepenapple\n["apple","pen"]', expected: "True" },
        { input: 'catsandog\n["cats","dog","sand","and","cat"]', expected: "False" }
      ]),
      solutionApproach: "DP: dp[i] = True if s[:i] can be segmented. For each position, check all words. O(n² * k).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      description: "Given array `nums`, return the length of the longest strictly increasing subsequence.\n\n**Example:**\n```\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4 ([2,3,7,101])\n```",
      difficulty: "medium",
      category: "dynamic-programming",
      starterCode: "def length_of_lis(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(length_of_lis(nums))",
      testCases: JSON.stringify([
        { input: "[10,9,2,5,3,7,101,18]", expected: "4" },
        { input: "[0,1,0,3,2,3]", expected: "4" },
        { input: "[7,7,7,7,7,7,7]", expected: "1" }
      ]),
      solutionApproach: "DP: O(n²) naive. Optimal: binary search with patience sorting. O(n log n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },
    {
      slug: "course-schedule",
      title: "Course Schedule",
      description: "There are `numCourses` courses (0 to n-1). Prerequisites are given as pairs `[a, b]` meaning you must take `b` before `a`. Can you finish all courses?\n\n**Example:**\n```\nInput: numCourses = 2, prerequisites = [[1,0]]\nOutput: True\n```",
      difficulty: "medium",
      category: "graphs",
      starterCode: "def can_finish(num_courses, prerequisites):\n    pass\n\nimport json\nn = int(input())\nprereqs = json.loads(input())\nprint(can_finish(n, prereqs))",
      testCases: JSON.stringify([
        { input: "2\n[[1,0]]", expected: "True" },
        { input: "2\n[[1,0],[0,1]]", expected: "False" }
      ]),
      solutionApproach: "Topological sort (Kahn's algorithm) or DFS cycle detection. If cycle exists, can't finish. O(V+E).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "word-search",
      title: "Word Search",
      description: "Given a 2D board and a word, find if the word exists in the grid. The word can be constructed from adjacent cells (horizontal/vertical), same cell can't be used twice.\n\n**Example:**\n```\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\nOutput: True\n```",
      difficulty: "medium",
      category: "backtracking",
      starterCode: "def exist(board, word):\n    pass\n\nimport json\nboard = json.loads(input())\nword = input().strip()\nprint(exist(board, word))",
      testCases: JSON.stringify([
        { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nABCCED', expected: "True" },
        { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nSEE', expected: "True" },
        { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nABCB', expected: "False" }
      ]),
      solutionApproach: "DFS/Backtracking from each cell. Mark visited, explore 4 directions, unmark on backtrack. O(m*n*4^L).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "permutations",
      title: "Permutations",
      description: "Given an array `nums` of distinct integers, return all possible permutations.\n\n**Example:**\n```\nInput: nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n```",
      difficulty: "medium",
      category: "backtracking",
      starterCode: "def permute(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nresult = permute(nums)\nprint(json.dumps(sorted(result)))",
      testCases: JSON.stringify([
        { input: "[1,2,3]", expected: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]" },
        { input: "[0,1]", expected: "[[0, 1], [1, 0]]" },
        { input: "[1]", expected: "[[1]]" }
      ]),
      solutionApproach: "Backtracking: for each position, try each unused number. Swap elements to generate in-place. O(n!).",
      companyTags: JSON.stringify(["Amazon", "Meta", "Microsoft"]),
    },
    {
      slug: "kth-largest-element",
      title: "Kth Largest Element in an Array",
      description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element.\n\n**Example:**\n```\nInput: nums = [3,2,1,5,6,4], k = 2\nOutput: 5\n```",
      difficulty: "medium",
      category: "sorting",
      starterCode: "def find_kth_largest(nums, k):\n    pass\n\nimport json\nnums = json.loads(input())\nk = int(input())\nprint(find_kth_largest(nums, k))",
      testCases: JSON.stringify([
        { input: "[3,2,1,5,6,4]\n2", expected: "5" },
        { input: "[3,2,3,1,2,4,5,5,6]\n4", expected: "4" }
      ]),
      solutionApproach: "Quick select (avg O(n)) or min-heap of size k (O(n log k)). Sorting is O(n log n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "spiral-matrix",
      title: "Spiral Matrix",
      description: "Given an m x n matrix, return all elements in spiral order.\n\n**Example:**\n```\nInput: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]\n```",
      difficulty: "medium",
      category: "arrays",
      starterCode: "def spiral_order(matrix):\n    pass\n\nimport json\nmatrix = json.loads(input())\nprint(json.dumps(spiral_order(matrix)))",
      testCases: JSON.stringify([
        { input: "[[1,2,3],[4,5,6],[7,8,9]]", expected: "[1, 2, 3, 6, 9, 8, 7, 4, 5]" },
        { input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expected: "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]" }
      ]),
      solutionApproach: "Use 4 boundaries (top, bottom, left, right). Traverse in spiral order, shrinking boundaries. O(m*n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },
    {
      slug: "set-matrix-zeroes",
      title: "Set Matrix Zeroes",
      description: "Given an m x n matrix, if an element is 0, set its entire row and column to 0. Do it in-place.\n\n**Example:**\n```\nInput: [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]\n```",
      difficulty: "medium",
      category: "arrays",
      starterCode: "def set_zeroes(matrix):\n    pass\n\nimport json\nmatrix = json.loads(input())\nset_zeroes(matrix)\nprint(json.dumps(matrix))",
      testCases: JSON.stringify([
        { input: "[[1,1,1],[1,0,1],[1,1,1]]", expected: "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]" },
        { input: "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]", expected: "[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]" }
      ]),
      solutionApproach: "Use first row and column as markers. Two passes: mark then set. O(mn) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Microsoft", "Meta"]),
    },

    // ═══════════════════════════════════════
    // HARD (10 problems)
    // ═══════════════════════════════════════
    {
      slug: "trapping-rain-water",
      title: "Trapping Rain Water",
      description: "Given `n` non-negative integers representing elevation map bars of width 1, compute how much water can be trapped.\n\n**Example:**\n```\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\n```",
      difficulty: "hard",
      category: "two-pointers",
      starterCode: "def trap(height):\n    pass\n\nimport json\nheight = json.loads(input())\nprint(trap(height))",
      testCases: JSON.stringify([
        { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
        { input: "[4,2,0,3,2,5]", expected: "9" }
      ]),
      solutionApproach: "Two pointers: track left_max and right_max. Water at position = min(left_max, right_max) - height. O(n) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Goldman Sachs"]),
    },
    {
      slug: "median-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      description: "Given two sorted arrays `nums1` and `nums2`, return the median of the two sorted arrays.\n\nOverall run time must be O(log(m+n)).\n\n**Example:**\n```\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.0\n```",
      difficulty: "hard",
      category: "binary-search",
      starterCode: "def find_median(nums1, nums2):\n    pass\n\nimport json\nnums1 = json.loads(input())\nnums2 = json.loads(input())\nprint(find_median(nums1, nums2))",
      testCases: JSON.stringify([
        { input: "[1,3]\n[2]", expected: "2.0" },
        { input: "[1,2]\n[3,4]", expected: "2.5" }
      ]),
      solutionApproach: "Binary search on shorter array. Partition both arrays such that left half <= right half. O(log(min(m,n))).",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft", "Goldman Sachs", "Apple"]),
    },
    {
      slug: "serialize-deserialize-tree",
      title: "Serialize and Deserialize Binary Tree",
      description: "Design an algorithm to serialize a binary tree to a string and deserialize back.\n\n**Example:**\n```\nInput: [1,2,3,null,null,4,5]\nSerialize → Deserialize back to original tree\n```",
      difficulty: "hard",
      category: "trees",
      starterCode: "def serialize(tree):\n    pass\n\ndef deserialize(data):\n    pass\n\nimport json\ntree = json.loads(input())\nserialized = serialize(tree)\nresult = deserialize(serialized)\nprint(json.dumps(result))",
      testCases: JSON.stringify([
        { input: "[1,2,3,null,null,4,5]", expected: "[1, 2, 3, null, null, 4, 5]" },
        { input: "[]", expected: "[]" }
      ]),
      solutionApproach: "Pre-order traversal with null markers for serialization. Queue-based reconstruction for deserialization. O(n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "lru-cache",
      title: "LRU Cache",
      description: "Design a Least Recently Used (LRU) cache with `get(key)` and `put(key, value)` in O(1) time.\n\n**Example:**\n```\nLRUCache(2)  capacity = 2\nput(1,1), put(2,2), get(1) → 1\nput(3,3) → evicts key 2\nget(2) → -1\n```",
      difficulty: "hard",
      category: "design",
      starterCode: "class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass\n\nimport json\nops = json.loads(input())\nargs = json.loads(input())\ncache = LRUCache(args[0][0])\nresults = [None]\nfor i in range(1, len(ops)):\n    if ops[i] == 'get':\n        results.append(cache.get(args[i][0]))\n    else:\n        cache.put(args[i][0], args[i][1])\n        results.append(None)\nprint(json.dumps(results))",
      testCases: JSON.stringify([
        { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', expected: "[null, null, null, 1, null, -1, null, -1, 3, 4]" }
      ]),
      solutionApproach: "Hash map + doubly linked list. Map stores key → node. DLL maintains access order. O(1) for both operations.",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft", "Apple"]),
    },
    {
      slug: "minimum-window-substring",
      title: "Minimum Window Substring",
      description: "Given two strings `s` and `t`, return the minimum window substring of `s` that contains all characters of `t`.\n\n**Example:**\n```\nInput: s = \"ADOBECODEBANC\", t = \"ABC\"\nOutput: \"BANC\"\n```",
      difficulty: "hard",
      category: "sliding-window",
      starterCode: "def min_window(s, t):\n    pass\n\ns = input().strip()\nt = input().strip()\nprint(min_window(s, t))",
      testCases: JSON.stringify([
        { input: "ADOBECODEBANC\nABC", expected: "BANC" },
        { input: "a\na", expected: "a" },
        { input: "a\naa", expected: "" }
      ]),
      solutionApproach: "Sliding window with two pointers and frequency counter. Expand right to include, shrink left to minimize. O(n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "merge-k-sorted-lists",
      title: "Merge k Sorted Lists",
      description: "Merge `k` sorted linked lists and return one sorted list.\n\nFor simplicity, use arrays:\n\n**Example:**\n```\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\n```",
      difficulty: "hard",
      category: "heaps",
      starterCode: "def merge_k_lists(lists):\n    pass\n\nimport json\nlists = json.loads(input())\nprint(json.dumps(merge_k_lists(lists)))",
      testCases: JSON.stringify([
        { input: "[[1,4,5],[1,3,4],[2,6]]", expected: "[1, 1, 2, 3, 4, 4, 5, 6]" },
        { input: "[]", expected: "[]" },
        { input: "[[]]", expected: "[]" }
      ]),
      solutionApproach: "Min-heap: push first element of each list. Pop min, push next from same list. O(n log k).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta", "Microsoft"]),
    },
    {
      slug: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      description: "Given a string `s`, return the longest palindromic substring.\n\n**Example:**\n```\nInput: s = \"babad\"\nOutput: \"bab\" (or \"aba\")\n```",
      difficulty: "medium",
      category: "strings",
      starterCode: "def longest_palindrome(s):\n    pass\n\ns = input().strip()\nprint(longest_palindrome(s))",
      testCases: JSON.stringify([
        { input: "babad", expected: "bab" },
        { input: "cbbd", expected: "bb" },
        { input: "a", expected: "a" }
      ]),
      solutionApproach: "Expand around center for each character (and each pair). O(n²) time, O(1) space.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },
    {
      slug: "implement-trie",
      title: "Implement Trie (Prefix Tree)",
      description: "Implement a trie with insert, search, and startsWith methods.\n\n**Example:**\n```\ninsert(\"apple\")\nsearch(\"apple\")   → True\nsearch(\"app\")     → False\nstartsWith(\"app\") → True\n```",
      difficulty: "medium",
      category: "trees",
      starterCode: "class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word):\n        pass\n    def search(self, word):\n        pass\n    def starts_with(self, prefix):\n        pass\n\nimport json\nops = json.loads(input())\nargs = json.loads(input())\ntrie = Trie()\nresults = [None]\nfor i in range(1, len(ops)):\n    if ops[i] == 'insert':\n        trie.insert(args[i][0])\n        results.append(None)\n    elif ops[i] == 'search':\n        results.append(trie.search(args[i][0]))\n    elif ops[i] == 'startsWith':\n        results.append(trie.starts_with(args[i][0]))\nprint(json.dumps(results))",
      testCases: JSON.stringify([
        { input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', expected: "[null, null, true, false, true, null, true]" }
      ]),
      solutionApproach: "Hash map of children at each node, with end-of-word marker. O(m) for each operation where m is word length.",
      companyTags: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    },
    {
      slug: "clone-graph",
      title: "Clone Graph",
      description: "Given a reference of a node in a connected undirected graph (as adjacency list), return a deep copy.\n\n**Example:**\n```\nInput: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: [[2,4],[1,3],[2,4],[1,3]]\n```",
      difficulty: "medium",
      category: "graphs",
      starterCode: "def clone_graph(adj_list):\n    pass\n\nimport json\nadj_list = json.loads(input())\nprint(json.dumps(clone_graph(adj_list)))",
      testCases: JSON.stringify([
        { input: "[[2,4],[1,3],[2,4],[1,3]]", expected: "[[2, 4], [1, 3], [2, 4], [1, 3]]" },
        { input: "[[]]", expected: "[[]]" }
      ]),
      solutionApproach: "BFS/DFS with hash map of old node → new node. Visit each node once. O(V+E).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta"]),
    },
    {
      slug: "longest-consecutive-sequence",
      title: "Longest Consecutive Sequence",
      description: "Given an unsorted array of integers, return the length of the longest consecutive elements sequence.\n\nMust run in O(n) time.\n\n**Example:**\n```\nInput: nums = [100,4,200,1,3,2]\nOutput: 4 (The sequence [1,2,3,4])\n```",
      difficulty: "medium",
      category: "hash-maps",
      starterCode: "def longest_consecutive(nums):\n    pass\n\nimport json\nnums = json.loads(input())\nprint(longest_consecutive(nums))",
      testCases: JSON.stringify([
        { input: "[100,4,200,1,3,2]", expected: "4" },
        { input: "[0,3,7,2,5,8,4,6,0,1]", expected: "9" }
      ]),
      solutionApproach: "Put all numbers in a set. For each number that is the START of a sequence (n-1 not in set), count consecutive. O(n).",
      companyTags: JSON.stringify(["Amazon", "Google", "Meta"]),
    },
  ];

  let created = 0;
  for (const problem of problems) {
    try {
      await prisma.problem.upsert({
        where: { slug: problem.slug },
        update: {},
        create: {
          slug: problem.slug,
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          category: problem.category,
          starterCode: problem.starterCode,
          testCases: problem.testCases,
          solutionApproach: problem.solutionApproach,
          companyTags: problem.companyTags,
        },
      });
      created++;
      console.log(`  ✓ ${problem.title} (${problem.difficulty})`);
    } catch (e) {
      console.log(`  ⚠ Skipped ${problem.slug}: ${(e as Error).message?.slice(0, 60)}`);
    }
  }

  console.log(`\n✅ Seeded ${created}/${problems.length} problems`);
  console.log(`   Total problems in DB: ${await prisma.problem.count()}`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
