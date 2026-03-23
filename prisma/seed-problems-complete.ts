import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProblemSeed {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  pattern: string;
  category: string;
  phase: number;
  weekNumber: number;
  timeComplexity: string;
  spaceComplexity: string;
  correctPattern: string;
  starterCode: string;
  solutionCode: string;
  testCases: string;
  hiddenTestCases: string;
  hints: string;
}

const problems: ProblemSeed[] = [
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 1 â€” WEEK 1: Arrays & Hashing (Problems 1-5)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "two-sum",
    title: "Two Sum",
    description: "Given a list of numbers and a target number, find the indices of the two numbers that add up to the target. Each input has exactly one solution. You cannot use the same element twice. Return the indices in any order.",
    difficulty: "easy",
    pattern: "hash-map",
    category: "arrays",
    phase: 1,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "HashMap",
    starterCode: `def two_sum(nums: list, target: int) -> list:
    """
    Find two numbers that add up to target.
    
    Args:
        nums: list of integers
        target: target sum
    Returns:
        list of two indices
    
    Example:
        two_sum([2, 7, 11, 15], 9) -> [0, 1]
        two_sum([3, 2, 4], 6) -> [1, 2]
    """
    pass

import json, sys
data = json.loads(input())
print(json.dumps(two_sum(data["nums"], data["target"])))`,
    solutionCode: `def two_sum(nums: list, target: int) -> list:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

import json, sys
data = json.loads(input())
print(json.dumps(two_sum(data["nums"], data["target"])))`,
    testCases: JSON.stringify([
      { input: '{"nums": [2, 7, 11, 15], "target": 9}', expected: "[0, 1]" },
      { input: '{"nums": [3, 2, 4], "target": 6}', expected: "[1, 2]" },
      { input: '{"nums": [3, 3], "target": 6}', expected: "[0, 1]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums": [1, 2, 3, 4, 5], "target": 9}', expected: "[3, 4]" },
      { input: '{"nums": [-1, -2, -3, -4, -5], "target": -8}', expected: "[2, 4]" },
    ]),
    hints: JSON.stringify([
      "Think about what value you are looking for when you are at index i. If the current number is 3 and target is 9, what number do you need?",
      "Use a dictionary to store numbers you have already seen. For each number, check if its complement (target - num) already exists in the dictionary.",
      "Loop through the array. For each num, compute complement = target - num. If complement is in your dict, return [dict[complement], current_index]. Otherwise add num: current_index to dict.",
    ]),
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    description: "Given a list of integers, return True if any value appears at least twice, and False if every element is distinct.",
    difficulty: "easy",
    pattern: "hash-set",
    category: "arrays",
    phase: 1,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "HashSet",
    starterCode: `def contains_duplicate(nums: list) -> bool:
    """
    Return True if any value appears at least twice.
    
    Example:
        contains_duplicate([1, 2, 3, 1]) -> True
        contains_duplicate([1, 2, 3, 4]) -> False
    """
    pass

import json
nums = json.loads(input())
print(contains_duplicate(nums))`,
    solutionCode: `def contains_duplicate(nums: list) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False

import json
nums = json.loads(input())
print(contains_duplicate(nums))`,
    testCases: JSON.stringify([
      { input: "[1,2,3,1]", expected: "True" },
      { input: "[1,2,3,4]", expected: "False" },
      { input: "[1,1,1,3,3,4,3,2,4,2]", expected: "True" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[]", expected: "False" },
      { input: "[5]", expected: "False" },
    ]),
    hints: JSON.stringify([
      "What data structure lets you check if you've seen something before in O(1) time?",
      "Use a set. As you iterate through the list, check if the current number is already in the set.",
      "For each num: if num in seen return True, else seen.add(num). If you finish the loop, return False.",
    ]),
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    description: "Given two strings s and t, return True if t is an anagram of s, and False otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    difficulty: "easy",
    pattern: "sorting",
    category: "strings",
    phase: 1,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "HashMap",
    starterCode: `def is_anagram(s: str, t: str) -> bool:
    """
    Return True if t is an anagram of s.
    
    Example:
        is_anagram("anagram", "nagaram") -> True
        is_anagram("rat", "car") -> False
    """
    pass

import json
data = json.loads(input())
print(is_anagram(data["s"], data["t"]))`,
    solutionCode: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    for c in t:
        if c not in freq or freq[c] == 0:
            return False
        freq[c] -= 1
    return True

import json
data = json.loads(input())
print(is_anagram(data["s"], data["t"]))`,
    testCases: JSON.stringify([
      { input: '{"s": "anagram", "t": "nagaram"}', expected: "True" },
      { input: '{"s": "rat", "t": "car"}', expected: "False" },
      { input: '{"s": "listen", "t": "silent"}', expected: "True" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"s": "", "t": ""}', expected: "True" },
      { input: '{"s": "a", "t": "ab"}', expected: "False" },
    ]),
    hints: JSON.stringify([
      "Anagrams have the same characters with the same frequencies. How can you count character frequencies?",
      "Use a dictionary to count each character in s, then subtract counts for each character in t.",
      "Count freq of each char in s with a dict. Then for each char in t, decrement. If any char is missing or count goes below 0, return False.",
    ]),
  },
  {
    slug: "best-time-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    description: "You have a list where prices[i] is the price of a stock on day i. Find the maximum profit by buying on one day and selling on a later day. If no profit is possible, return 0.",
    difficulty: "easy",
    pattern: "sliding-window",
    category: "arrays",
    phase: 1,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Sliding Window",
    starterCode: `def max_profit(prices: list) -> int:
    """
    Find max profit from one buy and one sell.
    
    Example:
        max_profit([7, 1, 5, 3, 6, 4]) -> 5
        max_profit([7, 6, 4, 3, 1]) -> 0
    """
    pass

import json
prices = json.loads(input())
print(max_profit(prices))`,
    solutionCode: `def max_profit(prices: list) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit

import json
prices = json.loads(input())
print(max_profit(prices))`,
    testCases: JSON.stringify([
      { input: "[7,1,5,3,6,4]", expected: "5" },
      { input: "[7,6,4,3,1]", expected: "0" },
      { input: "[2,4,1]", expected: "2" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1]", expected: "0" },
      { input: "[1,2]", expected: "1" },
    ]),
    hints: JSON.stringify([
      "You want to buy low and sell high. What if you tracked the lowest price seen so far?",
      "Keep a variable min_price. For each price, calculate profit = price - min_price and track the maximum profit.",
      "Initialize min_price = infinity, max_profit = 0. For each price: min_price = min(min_price, price), max_profit = max(max_profit, price - min_price).",
    ]),
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the subarray with the largest sum and return that sum. A subarray is a contiguous part of the array.",
    difficulty: "easy",
    pattern: "dynamic-programming",
    category: "arrays",
    phase: 1,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def max_subarray(nums: list) -> int:
    """
    Find the contiguous subarray with the largest sum.
    
    Example:
        max_subarray([-2,1,-3,4,-1,2,1,-5,4]) -> 6
        max_subarray([1]) -> 1
    """
    pass

import json
nums = json.loads(input())
print(max_subarray(nums))`,
    solutionCode: `def max_subarray(nums: list) -> int:
    current_sum = nums[0]
    max_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum

import json
nums = json.loads(input())
print(max_subarray(nums))`,
    testCases: JSON.stringify([
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "[1]", expected: "1" },
      { input: "[5,4,-1,7,8]", expected: "23" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[-1]", expected: "-1" },
      { input: "[-2,-1]", expected: "-1" },
    ]),
    hints: JSON.stringify([
      "At each position, you have a choice: start a new subarray here, or extend the previous one. Which gives a larger sum?",
      "This is Kadane's Algorithm. Track current_sum and max_sum. At each element: current_sum = max(num, current_sum + num).",
      "Initialize current_sum = max_sum = nums[0]. For each num in nums[1:]: current_sum = max(num, current_sum + num), max_sum = max(max_sum, current_sum).",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 1 â€” WEEK 2: Arrays & Hashing (Problems 6-10)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    description: "Given an array nums, move all zeros to the end while maintaining the relative order of non-zero elements. Do this in-place without making a copy.",
    difficulty: "easy",
    pattern: "two-pointers",
    category: "arrays",
    phase: 1,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def move_zeroes(nums: list) -> list:
    """
    Move all zeros to end, maintain order of non-zeros.
    
    Example:
        move_zeroes([0,1,0,3,12]) -> [1,3,12,0,0]
        move_zeroes([0]) -> [0]
    """
    pass

import json
nums = json.loads(input())
print(json.dumps(move_zeroes(nums)))`,
    solutionCode: `def move_zeroes(nums: list) -> list:
    insert_pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos] = nums[i]
            insert_pos += 1
    while insert_pos < len(nums):
        nums[insert_pos] = 0
        insert_pos += 1
    return nums

import json
nums = json.loads(input())
print(json.dumps(move_zeroes(nums)))`,
    testCases: JSON.stringify([
      { input: "[0,1,0,3,12]", expected: "[1, 3, 12, 0, 0]" },
      { input: "[0]", expected: "[0]" },
      { input: "[1,2,3]", expected: "[1, 2, 3]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[0,0,0]", expected: "[0, 0, 0]" },
      { input: "[4,0,5,0,6]", expected: "[4, 5, 6, 0, 0]" },
    ]),
    hints: JSON.stringify([
      "Can you use a pointer to track where the next non-zero element should go?",
      "Use insert_pos to track the write position. Move all non-zeros to the front, then fill the rest with zeros.",
      "For i in range(len(nums)): if nums[i] != 0, write it at insert_pos and increment. After the loop, fill remaining positions with 0.",
    ]),
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    description: "Given an integer array nums, return an array answer where answer[i] equals the product of all elements of nums except nums[i]. Solve it without using division and in O(n) time.",
    difficulty: "medium",
    pattern: "prefix-product",
    category: "arrays",
    phase: 1,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Prefix Product",
    starterCode: `def product_except_self(nums: list) -> list:
    """
    Product of all elements except self, no division.
    
    Example:
        product_except_self([1,2,3,4]) -> [24,12,8,6]
        product_except_self([-1,1,0,-3,3]) -> [0,0,9,0,0]
    """
    pass

import json
nums = json.loads(input())
print(json.dumps(product_except_self(nums)))`,
    solutionCode: `def product_except_self(nums: list) -> list:
    n = len(nums)
    answer = [1] * n
    # Left pass: prefix products
    prefix = 1
    for i in range(n):
        answer[i] = prefix
        prefix *= nums[i]
    # Right pass: suffix products
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer

import json
nums = json.loads(input())
print(json.dumps(product_except_self(nums)))`,
    testCases: JSON.stringify([
      { input: "[1,2,3,4]", expected: "[24, 12, 8, 6]" },
      { input: "[-1,1,0,-3,3]", expected: "[0, 0, 9, 0, 0]" },
      { input: "[2,3]", expected: "[3, 2]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[0,0]", expected: "[0, 0]" },
      { input: "[1,1,1,1]", expected: "[1, 1, 1, 1]" },
    ]),
    hints: JSON.stringify([
      "Think about prefix and suffix products. For each position, the answer is the product of everything to its left times everything to its right.",
      "First pass: build prefix products from left. Second pass: multiply by suffix products from right.",
      "Create answer array. Left pass: answer[i] = running prefix, then prefix *= nums[i]. Right pass: answer[i] *= running suffix, then suffix *= nums[i].",
    ]),
  },
  {
    slug: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring that contains no repeating characters.",
    difficulty: "medium",
    pattern: "sliding-window",
    category: "strings",
    phase: 1,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, 26))",
    correctPattern: "Sliding Window",
    starterCode: `def length_of_longest_substring(s: str) -> int:
    """
    Length of longest substring without repeating chars.
    
    Example:
        length_of_longest_substring("abcabcbb") -> 3
        length_of_longest_substring("bbbbb") -> 1
    """
    pass

s = input()
print(length_of_longest_substring(s))`,
    solutionCode: `def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    max_length = 0
    for right in range(len(s)):
        if s[right] in char_index and char_index[s[right]] >= left:
            left = char_index[s[right]] + 1
        char_index[s[right]] = right
        max_length = max(max_length, right - left + 1)
    return max_length

s = input()
print(length_of_longest_substring(s))`,
    testCases: JSON.stringify([
      { input: "abcabcbb", expected: "3" },
      { input: "bbbbb", expected: "1" },
      { input: "pwwkew", expected: "3" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "", expected: "0" },
      { input: "au", expected: "2" },
    ]),
    hints: JSON.stringify([
      "Use a sliding window that expands to the right. When do you need to shrink from the left?",
      "Track the last index of each character. When you see a repeat inside the window, move left past the previous occurrence.",
      "Use char_index dict. For each right: if s[right] in char_index and >= left, set left = char_index[s[right]] + 1. Update char_index and max_length.",
    ]),
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    description: "Given a string containing only the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    pattern: "stack",
    category: "stacks",
    phase: 1,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def is_valid(s: str) -> bool:
    """
    Check if brackets are valid.
    
    Example:
        is_valid("()[]{}") -> True
        is_valid("(]") -> False
    """
    pass

s = input().strip()
print(is_valid(s))`,
    solutionCode: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return len(stack) == 0

s = input().strip()
print(is_valid(s))`,
    testCases: JSON.stringify([
      { input: "()[]{}", expected: "True" },
      { input: "(]", expected: "False" },
      { input: "{[]}", expected: "True" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "", expected: "True" },
      { input: "((", expected: "False" },
    ]),
    hints: JSON.stringify([
      "What data structure follows Last-In-First-Out? The most recent opening bracket should match the next closing bracket.",
      "Use a stack. Push opening brackets. When you see a closing bracket, pop from the stack and check if it matches.",
      "Create a mapping of closing->opening. For each char: if closing, check stack top matches. If opening, push. At end, stack should be empty.",
    ]),
  },
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    description: "Given an array of strings, group the anagrams together. You can return the answer in any order.",
    difficulty: "medium",
    pattern: "hash-map",
    category: "strings",
    phase: 1,
    weekNumber: 2,
    timeComplexity: "O(n * k log k)",
    spaceComplexity: "O(n * k)",
    correctPattern: "HashMap",
    starterCode: `def group_anagrams(strs: list) -> list:
    """
    Group strings that are anagrams of each other.
    
    Example:
        group_anagrams(["eat","tea","tan","ate","nat","bat"])
        -> [["eat","tea","ate"],["tan","nat"],["bat"]]
    """
    pass

import json
strs = json.loads(input())
print(json.dumps(group_anagrams(strs)))`,
    solutionCode: `def group_anagrams(strs: list) -> list:
    groups = {}
    for word in strs:
        key = ''.join(sorted(word))
        if key not in groups:
            groups[key] = []
        groups[key].append(word)
    return list(groups.values())

import json
strs = json.loads(input())
print(json.dumps(group_anagrams(strs)))`,
    testCases: JSON.stringify([
      { input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
      { input: '[""]', expected: '[[""]]' },
      { input: '["a"]', expected: '[["a"]]' },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '["abc","bca","cab","xyz","zyx"]', expected: '[["abc","bca","cab"],["xyz","zyx"]]' },
      { input: '["",""]', expected: '[["",""]]' },
    ]),
    hints: JSON.stringify([
      "How can you create a canonical form for anagrams so they map to the same key?",
      "Sort each word alphabetically â€” all anagrams will have the same sorted form. Use this as a dictionary key.",
      "For each word: key = ''.join(sorted(word)). Group words by key in a dict. Return list(dict.values()).",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 2 â€” WEEK 3: Core Data Structures (Problems 11-15)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list represented as an array, reverse the list and return the reversed array. For example, [1,2,3,4,5] becomes [5,4,3,2,1].",
    difficulty: "easy",
    pattern: "linked-list",
    category: "linked-lists",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "LinkedList",
    starterCode: `def reverse_list(head: list) -> list:
    """
    Reverse a linked list (represented as array).
    
    Example:
        reverse_list([1,2,3,4,5]) -> [5,4,3,2,1]
        reverse_list([1,2]) -> [2,1]
    """
    pass

import json
head = json.loads(input())
print(json.dumps(reverse_list(head)))`,
    solutionCode: `def reverse_list(head: list) -> list:
    # Simulate linked list reversal with iterative approach
    prev = []
    for val in head:
        prev = [val] + prev
    return prev

import json
head = json.loads(input())
print(json.dumps(reverse_list(head)))`,
    testCases: JSON.stringify([
      { input: "[1,2,3,4,5]", expected: "[5, 4, 3, 2, 1]" },
      { input: "[1,2]", expected: "[2, 1]" },
      { input: "[1]", expected: "[1]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[]", expected: "[]" },
      { input: "[10,20,30]", expected: "[30, 20, 10]" },
    ]),
    hints: JSON.stringify([
      "Think about reversing the direction of each pointer. What three variables do you need?",
      "Use prev, current, and next_node. At each step: save next, point current to prev, advance both.",
      "prev=None, curr=head. While curr: next_node=curr.next, curr.next=prev, prev=curr, curr=next_node. Return prev.",
    ]),
  },
  {
    slug: "linked-list-cycle",
    title: "Linked List Cycle",
    description: "Given a linked list represented as an array and a pos indicating where the tail connects back to (forming a cycle), return True if there is a cycle, False otherwise. pos = -1 means no cycle.",
    difficulty: "easy",
    pattern: "fast-slow-pointers",
    category: "linked-lists",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Fast Slow Pointers",
    starterCode: `def has_cycle(head: list, pos: int) -> bool:
    """
    Detect if linked list has a cycle.
    
    Example:
        has_cycle([3,2,0,-4], 1) -> True
        has_cycle([1], -1) -> False
    """
    pass

import json
data = json.loads(input())
print(has_cycle(data["head"], data["pos"]))`,
    solutionCode: `def has_cycle(head: list, pos: int) -> bool:
    # In array simulation, pos >= 0 means cycle exists
    return pos >= 0

import json
data = json.loads(input())
print(has_cycle(data["head"], data["pos"]))`,
    testCases: JSON.stringify([
      { input: '{"head": [3,2,0,-4], "pos": 1}', expected: "True" },
      { input: '{"head": [1,2], "pos": 0}', expected: "True" },
      { input: '{"head": [1], "pos": -1}', expected: "False" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"head": [1,2,3,4], "pos": -1}', expected: "False" },
      { input: '{"head": [1], "pos": 0}', expected: "True" },
    ]),
    hints: JSON.stringify([
      "Can you use two pointers moving at different speeds? If there's a cycle, will they ever meet?",
      "Floyd's algorithm: slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle.",
      "slow=head, fast=head. While fast and fast.next: slow=slow.next, fast=fast.next.next. If slow==fast, return True. Return False.",
    ]),
  },
  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists (represented as sorted arrays) into one sorted list. Return the merged sorted array.",
    difficulty: "easy",
    pattern: "linked-list",
    category: "linked-lists",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n + m)",
    correctPattern: "LinkedList",
    starterCode: `def merge_lists(list1: list, list2: list) -> list:
    """
    Merge two sorted lists into one sorted list.
    
    Example:
        merge_lists([1,2,4], [1,3,4]) -> [1,1,2,3,4,4]
        merge_lists([], [0]) -> [0]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(merge_lists(data["list1"], data["list2"])))`,
    solutionCode: `def merge_lists(list1: list, list2: list) -> list:
    result = []
    i, j = 0, 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1
    result.extend(list1[i:])
    result.extend(list2[j:])
    return result

import json
data = json.loads(input())
print(json.dumps(merge_lists(data["list1"], data["list2"])))`,
    testCases: JSON.stringify([
      { input: '{"list1": [1,2,4], "list2": [1,3,4]}', expected: "[1, 1, 2, 3, 4, 4]" },
      { input: '{"list1": [], "list2": [0]}', expected: "[0]" },
      { input: '{"list1": [], "list2": []}', expected: "[]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"list1": [1], "list2": [2]}', expected: "[1, 2]" },
      { input: '{"list1": [5,10,15], "list2": [1,2,20]}', expected: "[1, 2, 5, 10, 15, 20]" },
    ]),
    hints: JSON.stringify([
      "Compare the heads of both lists. Which one is smaller? That goes first in the merged result.",
      "Use two pointers i and j. Compare list1[i] and list2[j], append the smaller one. When one list is exhausted, append the rest of the other.",
      "While both have elements: append min of list1[i], list2[j] and advance that pointer. Then extend with remaining elements.",
    ]),
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    description: "Given a sorted array of integers nums and a target value, return the index if found, otherwise return -1. You must write an algorithm with O(log n) runtime.",
    difficulty: "easy",
    pattern: "binary-search",
    category: "binary-search",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def search(nums: list, target: int) -> int:
    """
    Binary search for target in sorted array.
    
    Example:
        search([-1,0,3,5,9,12], 9) -> 4
        search([-1,0,3,5,9,12], 2) -> -1
    """
    pass

import json
data = json.loads(input())
print(search(data["nums"], data["target"]))`,
    solutionCode: `def search(nums: list, target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

import json
data = json.loads(input())
print(search(data["nums"], data["target"]))`,
    testCases: JSON.stringify([
      { input: '{"nums": [-1,0,3,5,9,12], "target": 9}', expected: "4" },
      { input: '{"nums": [-1,0,3,5,9,12], "target": 2}', expected: "-1" },
      { input: '{"nums": [5], "target": 5}', expected: "0" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums": [1,2,3,4,5], "target": 1}', expected: "0" },
      { input: '{"nums": [1,2,3,4,5], "target": 6}', expected: "-1" },
    ]),
    hints: JSON.stringify([
      "The array is sorted. Can you eliminate half the array with each comparison?",
      "Use left and right pointers. Calculate mid. If mid value is too small, search right half. If too big, search left half.",
      "left=0, right=len-1. While left<=right: mid=(left+right)//2. If nums[mid]==target return mid. If < target: left=mid+1. Else: right=mid-1.",
    ]),
  },
  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    description: "Given a sorted array that has been rotated at some pivot, and a target value, return the index of the target or -1 if not found. The array was originally sorted in ascending order, then rotated. You must achieve O(log n) time.",
    difficulty: "medium",
    pattern: "binary-search",
    category: "binary-search",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def search(nums: list, target: int) -> int:
    """
    Search in a rotated sorted array.
    
    Example:
        search([4,5,6,7,0,1,2], 0) -> 4
        search([4,5,6,7,0,1,2], 3) -> -1
    """
    pass

import json
data = json.loads(input())
print(search(data["nums"], data["target"]))`,
    solutionCode: `def search(nums: list, target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

import json
data = json.loads(input())
print(search(data["nums"], data["target"]))`,
    testCases: JSON.stringify([
      { input: '{"nums": [4,5,6,7,0,1,2], "target": 0}', expected: "4" },
      { input: '{"nums": [4,5,6,7,0,1,2], "target": 3}', expected: "-1" },
      { input: '{"nums": [1], "target": 0}', expected: "-1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums": [3,1], "target": 1}', expected: "1" },
      { input: '{"nums": [5,1,3], "target": 5}', expected: "0" },
    ]),
    hints: JSON.stringify([
      "One half of the array is always sorted. Can you figure out which half and whether the target is in it?",
      "At each step, determine which half is sorted. If target falls in the sorted range, search there. Otherwise search the other half.",
      "If nums[left]<=nums[mid], left half is sorted. Check if target is in [left,mid). If yes, go left. Else go right. Mirror for right half sorted.",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 2 â€” WEEK 4: Trees & More DS (Problems 16-20)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    description: "Given a binary tree represented as an array (level-order), find its maximum depth. The maximum depth is the number of nodes along the longest path from root to leaf.",
    difficulty: "easy",
    pattern: "dfs",
    category: "trees",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    correctPattern: "DFS",
    starterCode: `def max_depth(tree: list) -> int:
    """
    Find maximum depth of binary tree (array representation).
    
    Example:
        max_depth([3,9,20,null,null,15,7]) -> 3
        max_depth([1,null,2]) -> 2
    """
    pass

import json
tree = json.loads(input())
print(max_depth(tree))`,
    solutionCode: `def max_depth(tree: list) -> int:
    if not tree:
        return 0
    def dfs(i):
        if i >= len(tree) or tree[i] is None:
            return 0
        return 1 + max(dfs(2*i + 1), dfs(2*i + 2))
    return dfs(0)

import json
tree = json.loads(input())
print(max_depth(tree))`,
    testCases: JSON.stringify([
      { input: "[3,9,20,null,null,15,7]", expected: "3" },
      { input: "[1,null,2]", expected: "2" },
      { input: "[]", expected: "0" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1]", expected: "1" },
      { input: "[1,2,3,4,5]", expected: "3" },
    ]),
    hints: JSON.stringify([
      "The depth of a tree is 1 + max depth of its subtrees. What's the base case?",
      "Recursively compute depth of left and right subtrees. Return 1 + max(left_depth, right_depth). Base case: null node has depth 0.",
      "def maxDepth(root): if not root: return 0. Return 1 + max(maxDepth(root.left), maxDepth(root.right)).",
    ]),
  },
  {
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    description: "Given the root of a binary tree represented as an array, invert the tree (swap every left child with right child) and return the result as an array.",
    difficulty: "easy",
    pattern: "dfs",
    category: "trees",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    correctPattern: "DFS",
    starterCode: `def invert_tree(tree: list) -> list:
    """
    Invert a binary tree (swap left and right children).
    
    Example:
        invert_tree([4,2,7,1,3,6,9]) -> [4,7,2,9,6,3,1]
    """
    pass

import json
tree = json.loads(input())
print(json.dumps(invert_tree(tree)))`,
    solutionCode: `def invert_tree(tree: list) -> list:
    if not tree:
        return []
    result = tree[:]
    def dfs(i):
        if i >= len(result) or result[i] is None:
            return
        left = 2*i + 1
        right = 2*i + 2
        # Swap children
        if left < len(result) and right < len(result):
            result[left], result[right] = result[right], result[left]
        dfs(left)
        dfs(right)
    dfs(0)
    return result

import json
tree = json.loads(input())
print(json.dumps(invert_tree(tree)))`,
    testCases: JSON.stringify([
      { input: "[4,2,7,1,3,6,9]", expected: "[4, 7, 2, 9, 6, 3, 1]" },
      { input: "[2,1,3]", expected: "[2, 3, 1]" },
      { input: "[]", expected: "[]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1]", expected: "[1]" },
      { input: "[1,2]", expected: "[1, 2]" },
    ]),
    hints: JSON.stringify([
      "At each node, what simple operation do you need to do? Then trust recursion for the subtrees.",
      "Swap the left and right children of each node, then recursively invert both subtrees.",
      "def invert(root): if not root: return None. root.left, root.right = root.right, root.left. invert(root.left). invert(root.right). return root.",
    ]),
  },
  {
    slug: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    description: "Given a binary tree represented as an array, determine if it is a valid binary search tree (BST). A valid BST has: left subtree values < node value, right subtree values > node value, and both subtrees are also valid BSTs.",
    difficulty: "medium",
    pattern: "dfs",
    category: "trees",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    correctPattern: "DFS",
    starterCode: `def is_valid_bst(tree: list) -> bool:
    """
    Check if binary tree is a valid BST.
    
    Example:
        is_valid_bst([2,1,3]) -> True
        is_valid_bst([5,1,4,null,null,3,6]) -> False
    """
    pass

import json
tree = json.loads(input())
print(is_valid_bst(tree))`,
    solutionCode: `def is_valid_bst(tree: list) -> bool:
    if not tree:
        return True
    def dfs(i, min_val, max_val):
        if i >= len(tree) or tree[i] is None:
            return True
        if tree[i] <= min_val or tree[i] >= max_val:
            return False
        return dfs(2*i+1, min_val, tree[i]) and dfs(2*i+2, tree[i], max_val)
    return dfs(0, float('-inf'), float('inf'))

import json
tree = json.loads(input())
print(is_valid_bst(tree))`,
    testCases: JSON.stringify([
      { input: "[2,1,3]", expected: "True" },
      { input: "[5,1,4,null,null,3,6]", expected: "False" },
      { input: "[1]", expected: "True" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[]", expected: "True" },
      { input: "[5,4,6,null,null,3,7]", expected: "False" },
    ]),
    hints: JSON.stringify([
      "Just checking left < root < right at each node isn't enough. You need to check against the entire valid range.",
      "Pass min and max bounds down the recursion. Left child must be less than current node, right must be greater.",
      "dfs(node, min_val, max_val): if node.val <= min_val or >= max_val: False. Return dfs(left, min_val, node.val) and dfs(right, node.val, max_val).",
    ]),
  },
  {
    slug: "min-stack",
    title: "Min Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element, all in O(1) time. Implement the MinStack class with: push(val), pop(), top(), getMin(). Given a list of operations, return the results.",
    difficulty: "easy",
    pattern: "stack",
    category: "stacks",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def min_stack_operations(operations: list) -> list:
    """
    Simulate MinStack operations.
    operations: list of [op, val] pairs
    
    Example:
        min_stack_operations([["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]])
        -> [null,null,null,-3,null,0,-2]
    """
    pass

import json
ops = json.loads(input())
print(json.dumps(min_stack_operations(ops)))`,
    solutionCode: `def min_stack_operations(operations: list) -> list:
    stack = []
    min_stack = []
    results = []
    for op in operations:
        if op[0] == "push":
            val = op[1]
            stack.append(val)
            if not min_stack or val <= min_stack[-1]:
                min_stack.append(val)
            results.append(None)
        elif op[0] == "pop":
            val = stack.pop()
            if val == min_stack[-1]:
                min_stack.pop()
            results.append(None)
        elif op[0] == "top":
            results.append(stack[-1])
        elif op[0] == "getMin":
            results.append(min_stack[-1])
    return results

import json
ops = json.loads(input())
print(json.dumps(min_stack_operations(ops)))`,
    testCases: JSON.stringify([
      { input: '[["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]]', expected: "[null, null, null, -3, null, 0, -2]" },
      { input: '[["push",1],["push",2],["top"],["getMin"]]', expected: "[null, null, 2, 1]" },
      { input: '[["push",0],["getMin"],["pop"]]', expected: "[null, 0, null]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '[["push",5],["push",3],["push",7],["getMin"],["pop"],["getMin"]]', expected: "[null, null, null, 3, null, 3]" },
      { input: '[["push",1],["push",1],["pop"],["getMin"]]', expected: "[null, null, null, 1]" },
    ]),
    hints: JSON.stringify([
      "How can you know the minimum at any point? What if you kept track of minimums as they change?",
      "Use two stacks: one for values, one for tracking the running minimum. Push to min_stack when value <= current min.",
      "Main stack: normal push/pop. Min stack: push when val <= min_stack[-1]. Pop from min_stack when popped value == min_stack[-1]. getMin returns min_stack[-1].",
    ]),
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    description: 'Given a 2D grid of \'1\'s (land) and \'0\'s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    difficulty: "medium",
    pattern: "bfs-dfs",
    category: "graphs",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n)",
    correctPattern: "BFS/DFS",
    starterCode: `def num_islands(grid: list) -> int:
    """
    Count number of islands in the grid.
    
    Example:
        num_islands([["1","1","0"],["1","1","0"],["0","0","1"]]) -> 2
    """
    pass

import json
grid = json.loads(input())
print(num_islands(grid))`,
    solutionCode: `def num_islands(grid: list) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"  # mark visited
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count

import json
grid = json.loads(input())
print(num_islands(grid))`,
    testCases: JSON.stringify([
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expected: "1" },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: "3" },
      { input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', expected: "5" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '[["0"]]', expected: "0" },
      { input: '[["1"]]', expected: "1" },
    ]),
    hints: JSON.stringify([
      "When you find a '1', you've found an island. How do you avoid counting the same island twice?",
      "Use DFS or BFS from each '1' to mark all connected land as visited. Each new unvisited '1' starts a new island.",
      "For each cell: if '1', increment count and DFS to mark all connected '1's as '0' (visited). DFS visits 4 neighbors (up/down/left/right).",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 3 â€” WEEK 5: Patterns (Problems 21-24)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "3sum",
    title: "3Sum",
    description: "Given an integer array nums, find all unique triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
    difficulty: "medium",
    pattern: "two-pointers",
    category: "arrays",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(nÂ²)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def three_sum(nums: list) -> list:
    """
    Find all unique triplets that sum to zero.
    
    Example:
        three_sum([-1,0,1,2,-1,-4]) -> [[-1,-1,2],[-1,0,1]]
        three_sum([0,1,1]) -> []
    """
    pass

import json
nums = json.loads(input())
print(json.dumps(three_sum(nums)))`,
    solutionCode: `def three_sum(nums: list) -> list:
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue  # skip duplicates
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result

import json
nums = json.loads(input())
print(json.dumps(three_sum(nums)))`,
    testCases: JSON.stringify([
      { input: "[-1,0,1,2,-1,-4]", expected: "[[-1, -1, 2], [-1, 0, 1]]" },
      { input: "[0,1,1]", expected: "[]" },
      { input: "[0,0,0]", expected: "[[0, 0, 0]]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[-2,0,1,1,2]", expected: "[[-2, 0, 2], [-2, 1, 1]]" },
      { input: "[]", expected: "[]" },
    ]),
    hints: JSON.stringify([
      "Sort the array first. Then for each element, can you reduce it to a Two Sum problem?",
      "Fix one element, then use two pointers on the remaining sorted portion to find pairs that sum to -fixed.",
      "Sort nums. For each i: skip duplicates, then left=i+1, right=end. Two pointer: if sum<0 left++, if sum>0 right--, if sum==0 record and skip dupes.",
    ]),
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    description: "Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.",
    difficulty: "medium",
    pattern: "two-pointers",
    category: "arrays",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def max_area(height: list) -> int:
    """
    Find two lines forming container with most water.
    
    Example:
        max_area([1,8,6,2,5,4,8,3,7]) -> 49
        max_area([1,1]) -> 1
    """
    pass

import json
height = json.loads(input())
print(max_area(height))`,
    solutionCode: `def max_area(height: list) -> int:
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
    return max_water

import json
height = json.loads(input())
print(max_area(height))`,
    testCases: JSON.stringify([
      { input: "[1,8,6,2,5,4,8,3,7]", expected: "49" },
      { input: "[1,1]", expected: "1" },
      { input: "[4,3,2,1,4]", expected: "16" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1,2,1]", expected: "2" },
      { input: "[2,3,10,5,7,8,9]", expected: "36" },
    ]),
    hints: JSON.stringify([
      "Start with the widest container. When should you move each pointer?",
      "Two pointers at both ends. Move the pointer with the shorter height inward, because width decreases anyway.",
      "left=0, right=end. While left<right: area = min(h[left],h[right]) * (right-left). Update max. Move the shorter side inward.",
    ]),
  },
  {
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    description: "Given a sorted array of unique elements that has been rotated, find the minimum element. You must write an O(log n) algorithm.",
    difficulty: "medium",
    pattern: "binary-search",
    category: "binary-search",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def find_min(nums: list) -> int:
    """
    Find minimum in rotated sorted array.
    
    Example:
        find_min([3,4,5,1,2]) -> 1
        find_min([4,5,6,7,0,1,2]) -> 0
    """
    pass

import json
nums = json.loads(input())
print(find_min(nums))`,
    solutionCode: `def find_min(nums: list) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]

import json
nums = json.loads(input())
print(find_min(nums))`,
    testCases: JSON.stringify([
      { input: "[3,4,5,1,2]", expected: "1" },
      { input: "[4,5,6,7,0,1,2]", expected: "0" },
      { input: "[11,13,15,17]", expected: "11" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[2,1]", expected: "1" },
      { input: "[1]", expected: "1" },
    ]),
    hints: JSON.stringify([
      "Binary search still works here. Compare mid with right to determine which half contains the minimum.",
      "If nums[mid] > nums[right], the minimum is in the right half. Otherwise it's in the left half (including mid).",
      "left=0, right=len-1. While left<right: mid=(left+right)//2. If nums[mid]>nums[right]: left=mid+1. Else: right=mid. Return nums[left].",
    ]),
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    description: "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "easy",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def climb_stairs(n: int) -> int:
    """
    Number of distinct ways to climb n stairs (1 or 2 steps at a time).
    
    Example:
        climb_stairs(2) -> 2
        climb_stairs(3) -> 3
    """
    pass

n = int(input())
print(climb_stairs(n))`,
    solutionCode: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    return prev1

n = int(input())
print(climb_stairs(n))`,
    testCases: JSON.stringify([
      { input: "2", expected: "2" },
      { input: "3", expected: "3" },
      { input: "5", expected: "8" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "1", expected: "1" },
      { input: "10", expected: "89" },
    ]),
    hints: JSON.stringify([
      "To reach step n, you came from step n-1 or step n-2. How many ways to reach those?",
      "This is the Fibonacci pattern: ways(n) = ways(n-1) + ways(n-2). Base cases: ways(1)=1, ways(2)=2.",
      "Use two variables prev2, prev1. For i from 3 to n: current = prev1 + prev2, shift variables. Return prev1.",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 3 â€” WEEK 6: DP & Intervals (Problems 25-27)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "coin-change",
    title: "Coin Change",
    description: "Given an array of coin denominations and a total amount, find the fewest number of coins needed to make up that amount. If it cannot be made up, return -1. You have infinite coins of each denomination.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 3,
    weekNumber: 6,
    timeComplexity: "O(amount * n)",
    spaceComplexity: "O(amount)",
    correctPattern: "Dynamic Programming",
    starterCode: `def coin_change(coins: list, amount: int) -> int:
    """
    Fewest coins to make amount. Return -1 if impossible.
    
    Example:
        coin_change([1,5,10], 11) -> 2
        coin_change([2], 3) -> -1
    """
    pass

import json
data = json.loads(input())
print(coin_change(data["coins"], data["amount"]))`,
    solutionCode: `def coin_change(coins: list, amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

import json
data = json.loads(input())
print(coin_change(data["coins"], data["amount"]))`,
    testCases: JSON.stringify([
      { input: '{"coins": [1, 5, 10], "amount": 11}', expected: "2" },
      { input: '{"coins": [2], "amount": 3}', expected: "-1" },
      { input: '{"coins": [1], "amount": 0}', expected: "0" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"coins": [1, 2, 5], "amount": 100}', expected: "20" },
      { input: '{"coins": [3, 7], "amount": 1}', expected: "-1" },
    ]),
    hints: JSON.stringify([
      "For each amount, what's the minimum coins if you use each available coin? Think recursively.",
      "DP: dp[a] = min coins for amount a. dp[a] = min(dp[a - coin] + 1) for each coin <= a.",
      "Init dp = [inf] * (amount+1), dp[0]=0. For each a from 1 to amount: for each coin: if coin<=a, dp[a] = min(dp[a], dp[a-coin]+1). Return dp[amount] or -1.",
    ]),
  },
  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    description: "Given an integer array nums, find the length of the longest strictly increasing subsequence. A subsequence is derived by deleting some or no elements without changing the order.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 3,
    weekNumber: 6,
    timeComplexity: "O(nÂ²)",
    spaceComplexity: "O(n)",
    correctPattern: "Dynamic Programming",
    starterCode: `def length_of_lis(nums: list) -> int:
    """
    Length of longest strictly increasing subsequence.
    
    Example:
        length_of_lis([10,9,2,5,3,7,101,18]) -> 4
        length_of_lis([0,1,0,3,2,3]) -> 4
    """
    pass

import json
nums = json.loads(input())
print(length_of_lis(nums))`,
    solutionCode: `def length_of_lis(nums: list) -> int:
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

import json
nums = json.loads(input())
print(length_of_lis(nums))`,
    testCases: JSON.stringify([
      { input: "[10,9,2,5,3,7,101,18]", expected: "4" },
      { input: "[0,1,0,3,2,3]", expected: "4" },
      { input: "[7,7,7,7,7]", expected: "1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1]", expected: "1" },
      { input: "[1,2,3,4,5]", expected: "5" },
    ]),
    hints: JSON.stringify([
      "For each element, the LIS ending at that element depends on all previous elements that are smaller.",
      "dp[i] = length of LIS ending at index i. For each j < i where nums[j] < nums[i]: dp[i] = max(dp[i], dp[j]+1).",
      "Init dp = [1]*n. For i from 1 to n-1: for j from 0 to i-1: if nums[j]<nums[i]: dp[i] = max(dp[i], dp[j]+1). Return max(dp).",
    ]),
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "medium",
    pattern: "merge-intervals",
    category: "intervals",
    phase: 3,
    weekNumber: 6,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctPattern: "Merge Intervals",
    starterCode: `def merge(intervals: list) -> list:
    """
    Merge overlapping intervals.
    
    Example:
        merge([[1,3],[2,6],[8,10],[15,18]]) -> [[1,6],[8,10],[15,18]]
        merge([[1,4],[4,5]]) -> [[1,5]]
    """
    pass

import json
intervals = json.loads(input())
print(json.dumps(merge(intervals)))`,
    solutionCode: `def merge(intervals: list) -> list:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

import json
intervals = json.loads(input())
print(json.dumps(merge(intervals)))`,
    testCases: JSON.stringify([
      { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1, 6], [8, 10], [15, 18]]" },
      { input: "[[1,4],[4,5]]", expected: "[[1, 5]]" },
      { input: "[[1,4],[0,4]]", expected: "[[0, 4]]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[[1,4],[2,3]]", expected: "[[1, 4]]" },
      { input: "[[1,2]]", expected: "[[1, 2]]" },
    ]),
    hints: JSON.stringify([
      "Sort intervals by start time first. Then how do you know if two intervals overlap?",
      "Two intervals overlap if the second starts before the first ends. Merge by extending the end time.",
      "Sort by start. Init merged with first interval. For each: if start <= merged[-1][1], extend end. Else append new interval.",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 3 â€” WEEK 7: Heap & Backtracking (Problems 28-30)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "kth-largest-element",
    title: "Kth Largest Element in Array",
    description: "Given an integer array nums and an integer k, return the kth largest element. Note that it is the kth largest in sorted order, not the kth distinct element.",
    difficulty: "medium",
    pattern: "heap",
    category: "heaps",
    phase: 3,
    weekNumber: 7,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    correctPattern: "Heap",
    starterCode: `def find_kth_largest(nums: list, k: int) -> int:
    """
    Find kth largest element.
    
    Example:
        find_kth_largest([3,2,1,5,6,4], 2) -> 5
        find_kth_largest([3,2,3,1,2,4,5,5,6], 4) -> 4
    """
    pass

import json
data = json.loads(input())
print(find_kth_largest(data["nums"], data["k"]))`,
    solutionCode: `import heapq

def find_kth_largest(nums: list, k: int) -> int:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

import json
data = json.loads(input())
print(find_kth_largest(data["nums"], data["k"]))`,
    testCases: JSON.stringify([
      { input: '{"nums": [3,2,1,5,6,4], "k": 2}', expected: "5" },
      { input: '{"nums": [3,2,3,1,2,4,5,5,6], "k": 4}', expected: "4" },
      { input: '{"nums": [1], "k": 1}', expected: "1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums": [7,6,5,4,3,2,1], "k": 5}', expected: "3" },
      { input: '{"nums": [1,1,1,1], "k": 2}', expected: "1" },
    ]),
    hints: JSON.stringify([
      "You don't need to sort the entire array. What data structure efficiently gives you the smallest/largest?",
      "Use a min-heap of size k. After processing all elements, the top of the heap is the kth largest.",
      "For each num: heappush(heap, num). If len(heap) > k: heappop(heap). At end, heap[0] is the kth largest.",
    ]),
  },
  {
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    difficulty: "medium",
    pattern: "heap",
    category: "heaps",
    phase: 3,
    weekNumber: 7,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(n)",
    correctPattern: "Heap/HashMap",
    starterCode: `def top_k_frequent(nums: list, k: int) -> list:
    """
    Return k most frequent elements.
    
    Example:
        top_k_frequent([1,1,1,2,2,3], 2) -> [1, 2]
        top_k_frequent([1], 1) -> [1]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(top_k_frequent(data["nums"], data["k"])))`,
    solutionCode: `from collections import Counter
import heapq

def top_k_frequent(nums: list, k: int) -> list:
    freq = Counter(nums)
    return [num for num, count in freq.most_common(k)]

import json
data = json.loads(input())
print(json.dumps(top_k_frequent(data["nums"], data["k"])))`,
    testCases: JSON.stringify([
      { input: '{"nums": [1,1,1,2,2,3], "k": 2}', expected: "[1, 2]" },
      { input: '{"nums": [1], "k": 1}', expected: "[1]" },
      { input: '{"nums": [4,4,4,3,3,2], "k": 1}', expected: "[4]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums": [1,2], "k": 2}', expected: "[1, 2]" },
      { input: '{"nums": [5,5,5,5], "k": 1}', expected: "[5]" },
    ]),
    hints: JSON.stringify([
      "First count frequencies. Then how do you efficiently find the top k?",
      "Count with a hash map, then use a heap or Counter.most_common(k) to get the top k.",
      "freq = Counter(nums). Return [num for num, count in freq.most_common(k)]. Or use a min-heap of size k on (count, num) pairs.",
    ]),
  },
  {
    slug: "generate-parentheses",
    title: "Generate Parentheses",
    description: "Given n pairs of parentheses, generate all combinations of well-formed parentheses.",
    difficulty: "medium",
    pattern: "backtracking",
    category: "backtracking",
    phase: 3,
    weekNumber: 7,
    timeComplexity: "O(4^n / sqrt(n))",
    spaceComplexity: "O(n)",
    correctPattern: "Backtracking",
    starterCode: `def generate_parenthesis(n: int) -> list:
    """
    Generate all valid combinations of n pairs of parentheses.
    
    Example:
        generate_parenthesis(3) -> ["((()))","(()())","(())()","()(())","()()()"]
        generate_parenthesis(1) -> ["()"]
    """
    pass

import json
n = int(input())
print(json.dumps(generate_parenthesis(n)))`,
    solutionCode: `def generate_parenthesis(n: int) -> list:
    result = []
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + "(", open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ")", open_count, close_count + 1)
    backtrack("", 0, 0)
    return result

import json
n = int(input())
print(json.dumps(generate_parenthesis(n)))`,
    testCases: JSON.stringify([
      { input: "3", expected: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: "1", expected: '["()"]' },
      { input: "2", expected: '["(())","()()"]' },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "0", expected: '[""]' },
      { input: "4", expected: '["(((())))","((()()))","((())())","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((()))","()(()())","()(())()","()()(())","()()()()"]' },
    ]),
    hints: JSON.stringify([
      "Build the string character by character. When can you add '(' and when can you add ')'?",
      "You can add '(' if open_count < n. You can add ')' if close_count < open_count. Backtrack when length == 2n.",
      "backtrack(current, open, close): if len==2n: add to result. If open<n: backtrack(current+'(', open+1, close). If close<open: backtrack(current+')', open, close+1).",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 4 â€” WEEK 8: Backtracking (Problems 31-33)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "word-search",
    title: "Word Search",
    description: "Given a 2D grid of characters and a word, return true if the word exists in the grid. The word can be constructed from adjacent cells (horizontally or vertically). Each cell may only be used once.",
    difficulty: "medium",
    pattern: "backtracking",
    category: "backtracking",
    phase: 4,
    weekNumber: 8,
    timeComplexity: "O(m * n * 4^L)",
    spaceComplexity: "O(L)",
    correctPattern: "Backtracking/DFS",
    starterCode: `def exist(board: list, word: str) -> bool:
    """
    Check if word exists in the grid via adjacent cells.
    
    Example:
        exist([["A","B"],["C","D"]], "ABDC") -> True
    """
    pass

import json
data = json.loads(input())
print(exist(data["board"], data["word"]))`,
    solutionCode: `def exist(board: list, word: str) -> bool:
    rows, cols = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]:
            return False
        temp = board[r][c]
        board[r][c] = "#"  # mark visited
        found = (dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1) or
                 dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1))
        board[r][c] = temp  # backtrack
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False

import json
data = json.loads(input())
print(exist(data["board"], data["word"]))`,
    testCases: JSON.stringify([
      { input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCCED"}', expected: "True" },
      { input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "SEE"}', expected: "True" },
      { input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCB"}', expected: "False" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"board": [["a"]], "word": "a"}', expected: "True" },
      { input: '{"board": [["a","b"],["c","d"]], "word": "abdc"}', expected: "True" },
    ]),
    hints: JSON.stringify([
      "Start DFS from each cell matching the first character. How do you avoid revisiting cells?",
      "Mark cells as visited during DFS, then unmark (backtrack) when returning. Check all 4 directions.",
      "For each cell matching word[0]: DFS with index. Mark visited with '#', explore 4 dirs for next char, restore on backtrack.",
    ]),
  },
  {
    slug: "subsets",
    title: "Subsets",
    description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution must not contain duplicate subsets.",
    difficulty: "medium",
    pattern: "backtracking",
    category: "backtracking",
    phase: 4,
    weekNumber: 8,
    timeComplexity: "O(2^n)",
    spaceComplexity: "O(n)",
    correctPattern: "Backtracking",
    starterCode: `def subsets(nums: list) -> list:
    """
    Generate all subsets of nums.
    
    Example:
        subsets([1,2,3]) -> [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
    """
    pass

import json
nums = json.loads(input())
print(json.dumps(subsets(nums)))`,
    solutionCode: `def subsets(nums: list) -> list:
    result = []
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result

import json
nums = json.loads(input())
print(json.dumps(subsets(nums)))`,
    testCases: JSON.stringify([
      { input: "[1,2,3]", expected: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]" },
      { input: "[0]", expected: "[[],[0]]" },
      { input: "[1,2]", expected: "[[],[1],[1,2],[2]]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[]", expected: "[[]]" },
      { input: "[5,10]", expected: "[[],[5],[5,10],[10]]" },
    ]),
    hints: JSON.stringify([
      "At each element, you have two choices: include it or skip it. How does this build all subsets?",
      "Backtracking: at each index, add current element, recurse, then remove (backtrack). Start from index to avoid duplicates.",
      "backtrack(start, current): add current[:] to result. For i from start to end: append nums[i], backtrack(current, remaining without i), pop().",
    ]),
  },
  {
    slug: "permutations",
    title: "Permutations",
    description: "Given an array nums of distinct integers, return all possible permutations in any order.",
    difficulty: "medium",
    pattern: "backtracking",
    category: "backtracking",
    phase: 4,
    weekNumber: 8,
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n)",
    correctPattern: "Backtracking",
    starterCode: `def permute(nums: list) -> list:
    """
    Generate all permutations of nums.
    
    Example:
        permute([1,2,3]) -> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
    """
    pass

import json
nums = json.loads(input())
print(json.dumps(permute(nums)))`,
    solutionCode: `def permute(nums: list) -> list:
    result = []
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()
    backtrack([], nums)
    return result

import json
nums = json.loads(input())
print(json.dumps(permute(nums)))`,
    testCases: JSON.stringify([
      { input: "[1,2,3]", expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { input: "[0,1]", expected: "[[0,1],[1,0]]" },
      { input: "[1]", expected: "[[1]]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1,2]", expected: "[[1,2],[2,1]]" },
      { input: "[3,2,1]", expected: "[[3,2,1],[3,1,2],[2,3,1],[2,1,3],[1,3,2],[1,2,3]]" },
    ]),
    hints: JSON.stringify([
      "For each position, pick one of the remaining unused elements. How do you track which are used?",
      "Backtracking: for each unused element, add it to current permutation, recurse with remaining, then remove it.",
      "backtrack(current, remaining): if remaining empty, add current[:]. For each i in remaining: append, backtrack(current, remaining without i), pop.",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 4 â€” WEEK 9: Graphs & Trees (Problems 34-37)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "course-schedule",
    title: "Course Schedule",
    description: "There are numCourses courses labeled 0 to numCourses-1. You are given prerequisites where prerequisites[i] = [a, b] means you must take course b before course a. Return true if you can finish all courses (no cycles in the dependency graph).",
    difficulty: "medium",
    pattern: "topological-sort",
    category: "graphs",
    phase: 4,
    weekNumber: 9,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    correctPattern: "Topological Sort/DFS",
    starterCode: `def can_finish(numCourses: int, prerequisites: list) -> bool:
    """
    Can all courses be completed (no cycles)?
    
    Example:
        can_finish(2, [[1,0]]) -> True
        can_finish(2, [[1,0],[0,1]]) -> False
    """
    pass

import json
data = json.loads(input())
print(can_finish(data["numCourses"], data["prerequisites"]))`,
    solutionCode: `def can_finish(numCourses: int, prerequisites: list) -> bool:
    graph = {i: [] for i in range(numCourses)}
    for a, b in prerequisites:
        graph[b].append(a)
    # 0=unvisited, 1=visiting, 2=visited
    state = [0] * numCourses
    def has_cycle(node):
        if state[node] == 1:
            return True  # cycle
        if state[node] == 2:
            return False  # already processed
        state[node] = 1
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        state[node] = 2
        return False
    for i in range(numCourses):
        if has_cycle(i):
            return False
    return True

import json
data = json.loads(input())
print(can_finish(data["numCourses"], data["prerequisites"]))`,
    testCases: JSON.stringify([
      { input: '{"numCourses": 2, "prerequisites": [[1,0]]}', expected: "True" },
      { input: '{"numCourses": 2, "prerequisites": [[1,0],[0,1]]}', expected: "False" },
      { input: '{"numCourses": 3, "prerequisites": [[1,0],[2,1]]}', expected: "True" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"numCourses": 1, "prerequisites": []}', expected: "True" },
      { input: '{"numCourses": 4, "prerequisites": [[1,0],[2,1],[3,2],[1,3]]}', expected: "False" },
    ]),
    hints: JSON.stringify([
      "This is a cycle detection problem on a directed graph. If there's a cycle, you can't finish all courses.",
      "Build adjacency list. Use DFS with 3 states: unvisited, visiting, visited. If you reach a 'visiting' node, there's a cycle.",
      "state[node]=1 (visiting). For each neighbor: if state==1, cycle. If state==0, recurse. After all neighbors: state[node]=2 (done).",
    ]),
  },
  {
    slug: "number-of-connected-components",
    title: "Number of Connected Components",
    description: "Given n nodes labeled 0 to n-1 and a list of undirected edges, find the number of connected components in the graph.",
    difficulty: "medium",
    pattern: "union-find",
    category: "graphs",
    phase: 4,
    weekNumber: 9,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    correctPattern: "Union Find/DFS",
    starterCode: `def count_components(n: int, edges: list) -> int:
    """
    Count connected components in undirected graph.
    
    Example:
        count_components(5, [[0,1],[1,2],[3,4]]) -> 2
        count_components(5, [[0,1],[1,2],[2,3],[3,4]]) -> 1
    """
    pass

import json
data = json.loads(input())
print(count_components(data["n"], data["edges"]))`,
    solutionCode: `def count_components(n: int, edges: list) -> int:
    graph = {i: [] for i in range(n)}
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)
    visited = set()
    count = 0
    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
    for i in range(n):
        if i not in visited:
            dfs(i)
            count += 1
    return count

import json
data = json.loads(input())
print(count_components(data["n"], data["edges"]))`,
    testCases: JSON.stringify([
      { input: '{"n": 5, "edges": [[0,1],[1,2],[3,4]]}', expected: "2" },
      { input: '{"n": 5, "edges": [[0,1],[1,2],[2,3],[3,4]]}', expected: "1" },
      { input: '{"n": 3, "edges": []}', expected: "3" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"n": 1, "edges": []}', expected: "1" },
      { input: '{"n": 4, "edges": [[0,1],[2,3]]}', expected: "2" },
    ]),
    hints: JSON.stringify([
      "Each connected component is a group of nodes reachable from each other. How many groups are there?",
      "DFS/BFS from each unvisited node. Each time you start a new traversal, that's a new component.",
      "Build adjacency list. For each unvisited node: increment count, DFS to mark all reachable nodes as visited.",
    ]),
  },
  {
    slug: "lowest-common-ancestor-bst",
    title: "Lowest Common Ancestor of BST",
    description: "Given a binary search tree (BST) as an array and two node values p and q, find their lowest common ancestor (LCA). The LCA is the deepest node that has both p and q as descendants.",
    difficulty: "easy",
    pattern: "bst",
    category: "trees",
    phase: 4,
    weekNumber: 9,
    timeComplexity: "O(h)",
    spaceComplexity: "O(1)",
    correctPattern: "BST",
    starterCode: `def lca_bst(tree: list, p: int, q: int) -> int:
    """
    Find lowest common ancestor of p and q in BST.
    
    Example:
        lca_bst([6,2,8,0,4,7,9], 2, 8) -> 6
        lca_bst([6,2,8,0,4,7,9], 2, 4) -> 2
    """
    pass

import json
data = json.loads(input())
print(lca_bst(data["tree"], data["p"], data["q"]))`,
    solutionCode: `def lca_bst(tree: list, p: int, q: int) -> int:
    idx = 0
    while idx < len(tree) and tree[idx] is not None:
        if p < tree[idx] and q < tree[idx]:
            idx = 2 * idx + 1  # go left
        elif p > tree[idx] and q > tree[idx]:
            idx = 2 * idx + 2  # go right
        else:
            return tree[idx]
    return -1

import json
data = json.loads(input())
print(lca_bst(data["tree"], data["p"], data["q"]))`,
    testCases: JSON.stringify([
      { input: '{"tree": [6,2,8,0,4,7,9], "p": 2, "q": 8}', expected: "6" },
      { input: '{"tree": [6,2,8,0,4,7,9], "p": 2, "q": 4}', expected: "2" },
      { input: '{"tree": [2,1], "p": 2, "q": 1}', expected: "2" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"tree": [3,1,5], "p": 1, "q": 5}', expected: "3" },
      { input: '{"tree": [5,3,8,1,4,7,9], "p": 1, "q": 4}', expected: "3" },
    ]),
    hints: JSON.stringify([
      "In a BST, the LCA is where the paths to p and q diverge. Use the BST property to decide direction.",
      "If both p and q are smaller than current node, go left. Both bigger, go right. Otherwise, current node is the LCA.",
      "Start at root. While true: if p,q < node: go left. If p,q > node: go right. Else return node (it's the split point).",
    ]),
  },
  {
    slug: "binary-tree-level-order",
    title: "Binary Tree Level Order Traversal",
    description: "Given a binary tree represented as an array, return its level order traversal as a list of lists â€” each inner list contains the values at that level.",
    difficulty: "medium",
    pattern: "bfs",
    category: "trees",
    phase: 4,
    weekNumber: 9,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "BFS",
    starterCode: `def level_order(tree: list) -> list:
    """
    Level order traversal of binary tree.
    
    Example:
        level_order([3,9,20,null,null,15,7]) -> [[3],[9,20],[15,7]]
    """
    pass

import json
tree = json.loads(input())
print(json.dumps(level_order(tree)))`,
    solutionCode: `from collections import deque

def level_order(tree: list) -> list:
    if not tree or tree[0] is None:
        return []
    result = []
    queue = deque([0])
    while queue:
        level = []
        for _ in range(len(queue)):
            idx = queue.popleft()
            if idx < len(tree) and tree[idx] is not None:
                level.append(tree[idx])
                left = 2 * idx + 1
                right = 2 * idx + 2
                if left < len(tree) and tree[left] is not None:
                    queue.append(left)
                if right < len(tree) and tree[right] is not None:
                    queue.append(right)
        if level:
            result.append(level)
    return result

import json
tree = json.loads(input())
print(json.dumps(level_order(tree)))`,
    testCases: JSON.stringify([
      { input: "[3,9,20,null,null,15,7]", expected: "[[3], [9, 20], [15, 7]]" },
      { input: "[1]", expected: "[[1]]" },
      { input: "[]", expected: "[]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1,2,3,4,5]", expected: "[[1], [2, 3], [4, 5]]" },
      { input: "[1,null,2]", expected: "[[1], [2]]" },
    ]),
    hints: JSON.stringify([
      "Process nodes level by level. What data structure processes elements in order?",
      "Use a queue (BFS). Process all nodes at the current level before moving to the next.",
      "queue = deque([root]). While queue: level=[]. For _ in range(len(queue)): node=popleft(), add to level, enqueue children. Append level to result.",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 4 â€” WEEK 10: Advanced (Problems 38-40)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "design-add-search-words",
    title: "Design Add and Search Words Data Structure",
    description: "Design a data structure that supports adding words and searching for words with '.' wildcard (matches any single character). Implement addWord(word) and search(word). Given a list of operations, return the results.",
    difficulty: "medium",
    pattern: "trie",
    category: "trie",
    phase: 4,
    weekNumber: 10,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Trie",
    starterCode: `def word_dictionary_ops(operations: list) -> list:
    """
    Simulate WordDictionary operations.
    operations: list of [op, word] pairs
    
    Example:
        word_dictionary_ops([["add","bad"],["add","dad"],["search","pad"],["search",".ad"]])
        -> [null, null, False, True]
    """
    pass

import json
ops = json.loads(input())
print(json.dumps(word_dictionary_ops(ops)))`,
    solutionCode: `def word_dictionary_ops(operations: list) -> list:
    trie = {}
    def add_word(word):
        node = trie
        for c in word:
            if c not in node:
                node[c] = {}
            node = node[c]
        node['#'] = True
    def search(word):
        def dfs(node, i):
            if i == len(word):
                return '#' in node
            if word[i] == '.':
                for child in node:
                    if child != '#' and dfs(node[child], i + 1):
                        return True
                return False
            if word[i] not in node:
                return False
            return dfs(node[word[i]], i + 1)
        return dfs(trie, 0)
    results = []
    for op in operations:
        if op[0] == "add":
            add_word(op[1])
            results.append(None)
        elif op[0] == "search":
            results.append(search(op[1]))
    return results

import json
ops = json.loads(input())
print(json.dumps(word_dictionary_ops(ops)))`,
    testCases: JSON.stringify([
      { input: '[["add","bad"],["add","dad"],["add","mad"],["search","pad"],["search","bad"],["search",".ad"],["search","b.."]]', expected: "[null, null, null, false, true, true, true]" },
      { input: '[["add","a"],["search","a"],["search","."]]', expected: "[null, true, true]" },
      { input: '[["search","a"]]', expected: "[false]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '[["add","hello"],["search","hell."],["search","hel.."],["search","....o"]]', expected: "[null, true, true, true]" },
      { input: '[["add","ab"],["search","a."]]', expected: "[null, true]" },
    ]),
    hints: JSON.stringify([
      "A Trie stores words character by character. How do you handle the '.' wildcard during search?",
      "For '.', you need to try all children at that level. Use DFS/recursion for the search.",
      "Build a trie (nested dicts). addWord: traverse/create nodes. search with DFS: for '.', try all children. For letter, follow that child. End marker '#'.",
    ]),
  },
  {
    slug: "find-median-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2, return the median of the combined sorted array. The overall run time complexity should be O(log(m+n)).",
    difficulty: "hard",
    pattern: "binary-search",
    category: "binary-search",
    phase: 4,
    weekNumber: 10,
    timeComplexity: "O(log(min(m,n)))",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def find_median(nums1: list, nums2: list) -> float:
    """
    Find median of two sorted arrays.
    
    Example:
        find_median([1,3], [2]) -> 2.0
        find_median([1,2], [3,4]) -> 2.5
    """
    pass

import json
data = json.loads(input())
print(find_median(data["nums1"], data["nums2"]))`,
    solutionCode: `def find_median(nums1: list, nums2: list) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    while left <= right:
        i = (left + right) // 2
        j = (m + n + 1) // 2 - i
        left1 = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < m else float('inf')
        left2 = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < n else float('inf')
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 0:
                return (max(left1, left2) + min(right1, right2)) / 2
            return float(max(left1, left2))
        elif left1 > right2:
            right = i - 1
        else:
            left = i + 1
    return 0.0

import json
data = json.loads(input())
print(find_median(data["nums1"], data["nums2"]))`,
    testCases: JSON.stringify([
      { input: '{"nums1": [1,3], "nums2": [2]}', expected: "2.0" },
      { input: '{"nums1": [1,2], "nums2": [3,4]}', expected: "2.5" },
      { input: '{"nums1": [0,0], "nums2": [0,0]}', expected: "0.0" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums1": [], "nums2": [1]}', expected: "1.0" },
      { input: '{"nums1": [2], "nums2": []}', expected: "2.0" },
    ]),
    hints: JSON.stringify([
      "Binary search on the smaller array to find the correct partition of both arrays.",
      "Partition both arrays such that left halves combined have (m+n+1)//2 elements. Check cross-boundary conditions.",
      "Binary search on smaller array. i = partition in nums1, j = half - i. Valid if left1<=right2 and left2<=right1. Adjust bounds otherwise.",
    ]),
  },
  {
    slug: "serialize-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    description: "Design functions to serialize a binary tree to a string and deserialize the string back to the tree. Use level-order (BFS) format with 'null' for missing nodes. Given a tree as array, serialize then deserialize and return the result.",
    difficulty: "hard",
    pattern: "bfs",
    category: "trees",
    phase: 4,
    weekNumber: 10,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "BFS/DFS",
    starterCode: `def serialize_deserialize(tree: list) -> list:
    """
    Serialize tree to string, deserialize back, return as array.
    
    Example:
        serialize_deserialize([1,2,3,null,null,4,5]) -> [1,2,3,null,null,4,5]
    """
    pass

import json
tree = json.loads(input())
print(json.dumps(serialize_deserialize(tree)))`,
    solutionCode: `from collections import deque

def serialize_deserialize(tree: list) -> list:
    # Serialize: convert array to string
    if not tree:
        return []
    serialized = ','.join('null' if x is None else str(x) for x in tree)
    # Deserialize: convert string back to array
    values = serialized.split(',')
    result = []
    for v in values:
        result.append(None if v == 'null' else int(v))
    # Trim trailing nulls
    while result and result[-1] is None:
        result.pop()
    return result

import json
tree = json.loads(input())
print(json.dumps(serialize_deserialize(tree)))`,
    testCases: JSON.stringify([
      { input: "[1,2,3,null,null,4,5]", expected: "[1, 2, 3, null, null, 4, 5]" },
      { input: "[]", expected: "[]" },
      { input: "[1]", expected: "[1]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1,2]", expected: "[1, 2]" },
      { input: "[1,null,2,null,3]", expected: "[1, null, 2, null, 3]" },
    ]),
    hints: JSON.stringify([
      "BFS is natural for level-order serialization. How do you handle null children?",
      "Serialize: BFS, output node value or 'null'. Deserialize: split string, rebuild tree with BFS queue.",
      "Serialize with BFS queue, output each node. Deserialize: split by comma, use queue to assign children left then right.",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 5 â€” WEEK 11: Interview Hard (Problems 41-44)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "hard",
    pattern: "two-pointers",
    category: "arrays",
    phase: 5,
    weekNumber: 11,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def trap(height: list) -> int:
    """
    Calculate trapped rain water.
    
    Example:
        trap([0,1,0,2,1,0,1,3,2,1,2,1]) -> 6
        trap([4,2,0,3,2,5]) -> 9
    """
    pass

import json
height = json.loads(input())
print(trap(height))`,
    solutionCode: `def trap(height: list) -> int:
    if not height:
        return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water

import json
height = json.loads(input())
print(trap(height))`,
    testCases: JSON.stringify([
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
      { input: "[4,2,0,3,2,5]", expected: "9" },
      { input: "[1,0,1]", expected: "1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[]", expected: "0" },
      { input: "[3,0,0,2,0,4]", expected: "10" },
    ]),
    hints: JSON.stringify([
      "Water at each position depends on the max height to its left and right. Water = min(left_max, right_max) - height.",
      "Two pointers from both ends. Track left_max and right_max. Process the side with the smaller max first.",
      "left=0, right=end. While left<right: if left_max<right_max: left++, update left_max, water += left_max - height[left]. Else: mirror for right.",
    ]),
  },
  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an O(n) solution.",
    difficulty: "medium",
    pattern: "hash-set",
    category: "arrays",
    phase: 5,
    weekNumber: 11,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "HashSet",
    starterCode: `def longest_consecutive(nums: list) -> int:
    """
    Length of longest consecutive sequence.
    
    Example:
        longest_consecutive([100,4,200,1,3,2]) -> 4
        longest_consecutive([0,1,0,3,2,3]) -> 4
    """
    pass

import json
nums = json.loads(input())
print(longest_consecutive(nums))`,
    solutionCode: `def longest_consecutive(nums: list) -> int:
    num_set = set(nums)
    longest = 0
    for num in num_set:
        if num - 1 not in num_set:  # start of a sequence
            current = num
            streak = 1
            while current + 1 in num_set:
                current += 1
                streak += 1
            longest = max(longest, streak)
    return longest

import json
nums = json.loads(input())
print(longest_consecutive(nums))`,
    testCases: JSON.stringify([
      { input: "[100,4,200,1,3,2]", expected: "4" },
      { input: "[0,1,0,3,2,3]", expected: "4" },
      { input: "[7,7,7,7,7]", expected: "1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1]", expected: "1" },
      { input: "[1,2,3,4,5]", expected: "5" },
    ]),
    hints: JSON.stringify([
      "Sorting would give O(n log n). Can you do better with a set?",
      "Put all numbers in a set. Only start counting from the beginning of a sequence (num-1 not in set).",
      "num_set = set(nums). For each num: if num-1 not in set (it's a start), count consecutive nums. Track max streak.",
    ]),
  },
  {
    slug: "word-ladder",
    title: "Word Ladder",
    description: "Given two words (beginWord and endWord) and a dictionary wordList, find the length of the shortest transformation sequence from beginWord to endWord, where each step changes exactly one letter and each intermediate word must be in wordList. Return 0 if no such sequence exists.",
    difficulty: "hard",
    pattern: "bfs",
    category: "graphs",
    phase: 5,
    weekNumber: 11,
    timeComplexity: "O(n * mÂ²)",
    spaceComplexity: "O(n * m)",
    correctPattern: "BFS",
    starterCode: `def ladder_length(beginWord: str, endWord: str, wordList: list) -> int:
    """
    Shortest transformation sequence length.
    
    Example:
        ladder_length("hit", "cog", ["hot","dot","dog","lot","log","cog"]) -> 5
    """
    pass

import json
data = json.loads(input())
print(ladder_length(data["beginWord"], data["endWord"], data["wordList"]))`,
    solutionCode: `from collections import deque

def ladder_length(beginWord: str, endWord: str, wordList: list) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    while queue:
        word, steps = queue.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                if next_word == endWord:
                    return steps + 1
                if next_word in word_set and next_word not in visited:
                    visited.add(next_word)
                    queue.append((next_word, steps + 1))
    return 0

import json
data = json.loads(input())
print(ladder_length(data["beginWord"], data["endWord"], data["wordList"]))`,
    testCases: JSON.stringify([
      { input: '{"beginWord": "hit", "endWord": "cog", "wordList": ["hot","dot","dog","lot","log","cog"]}', expected: "5" },
      { input: '{"beginWord": "hit", "endWord": "cog", "wordList": ["hot","dot","dog","lot","log"]}', expected: "0" },
      { input: '{"beginWord": "a", "endWord": "c", "wordList": ["a","b","c"]}', expected: "2" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"beginWord": "hot", "endWord": "dog", "wordList": ["hot","dog","dot"]}', expected: "3" },
      { input: '{"beginWord": "ab", "endWord": "cd", "wordList": ["ab","cd"]}', expected: "0" },
    ]),
    hints: JSON.stringify([
      "Think of words as nodes in a graph where edges connect words differing by one letter. Shortest path means BFS.",
      "BFS from beginWord. For each word, try changing each character to a-z. If the new word is in wordList and unvisited, add to queue.",
      "BFS with queue of (word, steps). For each position, try all 26 chars. If next_word == endWord, return steps+1. If in wordList and not visited, enqueue.",
    ]),
  },
  {
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    description: "Given a sorted list of words in an alien language, derive the order of characters. Return a string of the unique characters in the alien alphabet sorted in lexicographically increasing order. If no valid ordering exists, return empty string.",
    difficulty: "hard",
    pattern: "topological-sort",
    category: "graphs",
    phase: 5,
    weekNumber: 11,
    timeComplexity: "O(C)",
    spaceComplexity: "O(1)",
    correctPattern: "Topological Sort",
    starterCode: `def alien_order(words: list) -> str:
    """
    Derive character order from sorted alien words.
    
    Example:
        alien_order(["wrt","wrf","er","ett","rftt"]) -> "wertf"
    """
    pass

import json
words = json.loads(input())
print(alien_order(words))`,
    solutionCode: `from collections import deque

def alien_order(words: list) -> str:
    # Build graph
    graph = {c: set() for word in words for c in word}
    in_degree = {c: 0 for c in graph}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""  # invalid: longer word before prefix
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
    # Topological sort (BFS)
    queue = deque([c for c in in_degree if in_degree[c] == 0])
    result = []
    while queue:
        c = queue.popleft()
        result.append(c)
        for neighbor in graph[c]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    if len(result) != len(graph):
        return ""  # cycle detected
    return ''.join(result)

import json
words = json.loads(input())
print(alien_order(words))`,
    testCases: JSON.stringify([
      { input: '["wrt","wrf","er","ett","rftt"]', expected: "wertf" },
      { input: '["z","x"]', expected: "zx" },
      { input: '["z","x","z"]', expected: "" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '["abc","ab"]', expected: "" },
      { input: '["a"]', expected: "a" },
    ]),
    hints: JSON.stringify([
      "Compare adjacent words to find character ordering constraints. This forms a directed graph.",
      "Build a graph of char -> chars that come after. Then topological sort. If cycle exists, return empty.",
      "Compare adjacent word pairs: find first differing char, add edge. BFS topological sort. If result length != num chars, there's a cycle.",
    ]),
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHASE 5 â€” WEEK 12: Interview Hard (Problems 45-50)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    description: "Given an integer array nums, find a contiguous subarray that has the largest product, and return that product.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 5,
    weekNumber: 12,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def max_product(nums: list) -> int:
    """
    Find contiguous subarray with largest product.
    
    Example:
        max_product([2,3,-2,4]) -> 6
        max_product([-2,0,-1]) -> 0
    """
    pass

import json
nums = json.loads(input())
print(max_product(nums))`,
    solutionCode: `def max_product(nums: list) -> int:
    max_so_far = nums[0]
    min_so_far = nums[0]
    result = nums[0]
    for num in nums[1:]:
        candidates = (num, max_so_far * num, min_so_far * num)
        max_so_far = max(candidates)
        min_so_far = min(candidates)
        result = max(result, max_so_far)
    return result

import json
nums = json.loads(input())
print(max_product(nums))`,
    testCases: JSON.stringify([
      { input: "[2,3,-2,4]", expected: "6" },
      { input: "[-2,0,-1]", expected: "0" },
      { input: "[-2,3,-4]", expected: "24" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[-2]", expected: "-2" },
      { input: "[0,2]", expected: "2" },
    ]),
    hints: JSON.stringify([
      "Unlike max sum, negatives can become positives when multiplied. You need to track both max AND min.",
      "Track current max and current min at each position. A negative times a min can become the new max.",
      "For each num: candidates = (num, max*num, min*num). max_so_far = max(candidates). min_so_far = min(candidates). Track global max.",
    ]),
  },
  {
    slug: "edit-distance",
    title: "Edit Distance",
    description: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace a character) required to convert word1 into word2.",
    difficulty: "hard",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 5,
    weekNumber: 12,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n)",
    correctPattern: "Dynamic Programming",
    starterCode: `def min_distance(word1: str, word2: str) -> int:
    """
    Minimum edit operations to convert word1 to word2.
    
    Example:
        min_distance("horse", "ros") -> 3
        min_distance("intention", "execution") -> 5
    """
    pass

import json
data = json.loads(input())
print(min_distance(data["word1"], data["word2"]))`,
    solutionCode: `def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]

import json
data = json.loads(input())
print(min_distance(data["word1"], data["word2"]))`,
    testCases: JSON.stringify([
      { input: '{"word1": "horse", "word2": "ros"}', expected: "3" },
      { input: '{"word1": "intention", "word2": "execution"}', expected: "5" },
      { input: '{"word1": "", "word2": "abc"}', expected: "3" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"word1": "abc", "word2": "abc"}', expected: "0" },
      { input: '{"word1": "a", "word2": "b"}', expected: "1" },
    ]),
    hints: JSON.stringify([
      "Define dp[i][j] as the minimum edits to convert word1[:i] to word2[:j]. What are the transitions?",
      "If chars match: dp[i][j] = dp[i-1][j-1]. Otherwise: 1 + min(insert, delete, replace) = 1 + min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]).",
      "Fill a (m+1)x(n+1) table. Base: dp[i][0]=i, dp[0][j]=j. For each cell: if match, take diagonal. Else 1 + min of three neighbors.",
    ]),
  },
  {
    slug: "burst-balloons",
    title: "Burst Balloons",
    description: "Given n balloons with numbers on them, burst them to collect maximum coins. When you burst balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins. After bursting, i-1 and i+1 become adjacent. Find the maximum coins you can collect.",
    difficulty: "hard",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 5,
    weekNumber: 12,
    timeComplexity: "O(nÂ³)",
    spaceComplexity: "O(nÂ²)",
    correctPattern: "Dynamic Programming",
    starterCode: `def max_coins(nums: list) -> int:
    """
    Maximum coins from bursting balloons.
    
    Example:
        max_coins([3,1,5,8]) -> 167
        max_coins([1,5]) -> 10
    """
    pass

import json
nums = json.loads(input())
print(max_coins(nums))`,
    solutionCode: `def max_coins(nums: list) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for left in range(0, n - length):
            right = left + length
            for k in range(left + 1, right):
                dp[left][right] = max(
                    dp[left][right],
                    dp[left][k] + dp[k][right] + nums[left] * nums[k] * nums[right]
                )
    return dp[0][n - 1]

import json
nums = json.loads(input())
print(max_coins(nums))`,
    testCases: JSON.stringify([
      { input: "[3,1,5,8]", expected: "167" },
      { input: "[1,5]", expected: "10" },
      { input: "[1]", expected: "1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[9,76,64,21]", expected: "116718" },
      { input: "[5,1,3]", expected: "175" },
    ]),
    hints: JSON.stringify([
      "Think about which balloon to burst LAST in a range, not first. This makes the subproblems independent.",
      "Interval DP: dp[left][right] = max coins from bursting all balloons between left and right (exclusive). Try each k as the last to burst.",
      "Pad with [1]. dp[left][right] = max over k in (left+1,right) of dp[left][k] + dp[k][right] + nums[left]*nums[k]*nums[right]. Iterate by interval length.",
    ]),
  },
  {
    slug: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    description: "Given an array nums and a sliding window of size k that moves from left to right, return the maximum value in each window position.",
    difficulty: "hard",
    pattern: "monotonic-deque",
    category: "arrays",
    phase: 5,
    weekNumber: 12,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    correctPattern: "Monotonic Deque",
    starterCode: `def max_sliding_window(nums: list, k: int) -> list:
    """
    Maximum value in each sliding window of size k.
    
    Example:
        max_sliding_window([1,3,-1,-3,5,3,6,7], 3) -> [3,3,5,5,6,7]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(max_sliding_window(data["nums"], data["k"])))`,
    solutionCode: `from collections import deque

def max_sliding_window(nums: list, k: int) -> list:
    dq = deque()  # stores indices
    result = []
    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements from back
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result

import json
data = json.loads(input())
print(json.dumps(max_sliding_window(data["nums"], data["k"])))`,
    testCases: JSON.stringify([
      { input: '{"nums": [1,3,-1,-3,5,3,6,7], "k": 3}', expected: "[3, 3, 5, 5, 6, 7]" },
      { input: '{"nums": [1], "k": 1}', expected: "[1]" },
      { input: '{"nums": [9,11], "k": 2}', expected: "[11]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums": [4,3,2,1], "k": 2}', expected: "[4, 3, 2]" },
      { input: '{"nums": [1,2,3,4,5], "k": 3}', expected: "[3, 4, 5]" },
    ]),
    hints: JSON.stringify([
      "A deque can help you efficiently track the maximum. What elements are never useful to keep?",
      "Monotonic decreasing deque: remove elements smaller than current from back. Remove expired indices from front.",
      "Deque stores indices in decreasing value order. For each i: remove front if outside window, remove back if value < nums[i], append i. Output dq[0] when i >= k-1.",
    ]),
  },
  {
    slug: "find-duplicate-number",
    title: "Find the Duplicate Number",
    description: "Given an array of n + 1 integers where each integer is in the range [1, n], find the one repeated number. You must solve it without modifying the array and using only O(1) extra space.",
    difficulty: "medium",
    pattern: "fast-slow-pointers",
    category: "arrays",
    phase: 5,
    weekNumber: 12,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Fast Slow Pointers",
    starterCode: `def find_duplicate(nums: list) -> int:
    """
    Find the duplicate number without extra space.
    
    Example:
        find_duplicate([1,3,4,2,2]) -> 2
        find_duplicate([3,1,3,4,2]) -> 3
    """
    pass

import json
nums = json.loads(input())
print(find_duplicate(nums))`,
    solutionCode: `def find_duplicate(nums: list) -> int:
    # Floyd's cycle detection
    slow = nums[0]
    fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    # Find entrance to cycle
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow

import json
nums = json.loads(input())
print(find_duplicate(nums))`,
    testCases: JSON.stringify([
      { input: "[1,3,4,2,2]", expected: "2" },
      { input: "[3,1,3,4,2]", expected: "3" },
      { input: "[2,2,2,2,2]", expected: "2" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1,1]", expected: "1" },
      { input: "[1,4,4,2,4]", expected: "4" },
    ]),
    hints: JSON.stringify([
      "Treat the array as a linked list where nums[i] points to the next node. The duplicate creates a cycle.",
      "Use Floyd's cycle detection: slow moves one step (nums[slow]), fast moves two steps (nums[nums[fast]]). They'll meet in the cycle.",
      "Phase 1: slow=fast=nums[0]. Move slow=nums[slow], fast=nums[nums[fast]] until they meet. Phase 2: reset slow=nums[0], move both one step until they meet. That's the duplicate.",
    ]),
  },
  {
    slug: "lru-cache",
    title: "LRU Cache",
    description: "Design a Least Recently Used (LRU) cache with a given capacity. Implement get(key) and put(key, value). get returns the value or -1 if not found. put inserts/updates and evicts the least recently used item if over capacity. Both operations should be O(1).",
    difficulty: "medium",
    pattern: "design",
    category: "design",
    phase: 5,
    weekNumber: 12,
    timeComplexity: "O(1)",
    spaceComplexity: "O(capacity)",
    correctPattern: "Design/HashMap+LinkedList",
    starterCode: `def lru_cache_ops(capacity: int, operations: list) -> list:
    """
    Simulate LRU Cache operations.
    
    Example:
        lru_cache_ops(2, [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]])
        -> [null, null, 1, null, -1]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(lru_cache_ops(data["capacity"], data["operations"])))`,
    solutionCode: `from collections import OrderedDict

def lru_cache_ops(capacity: int, operations: list) -> list:
    cache = OrderedDict()
    results = []
    for op in operations:
        if op[0] == "get":
            key = op[1]
            if key in cache:
                cache.move_to_end(key)
                results.append(cache[key])
            else:
                results.append(-1)
        elif op[0] == "put":
            key, value = op[1], op[2]
            if key in cache:
                cache.move_to_end(key)
            cache[key] = value
            if len(cache) > capacity:
                cache.popitem(last=False)
            results.append(None)
    return results

import json
data = json.loads(input())
print(json.dumps(lru_cache_ops(data["capacity"], data["operations"])))`,
    testCases: JSON.stringify([
      { input: '{"capacity": 2, "operations": [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]]}', expected: "[null, null, 1, null, -1]" },
      { input: '{"capacity": 1, "operations": [["put",1,1],["put",2,2],["get",1]]}', expected: "[null, null, -1]" },
      { input: '{"capacity": 2, "operations": [["get",1]]}', expected: "[-1]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"capacity": 2, "operations": [["put",1,1],["get",1],["put",2,2],["put",3,3],["get",1]]}', expected: "[null, 1, null, null, -1]" },
      { input: '{"capacity": 3, "operations": [["put",1,10],["put",2,20],["put",3,30],["get",2],["put",4,40],["get",1]]}', expected: "[null, null, null, 20, null, -1]" },
    ]),
    hints: JSON.stringify([
      "You need O(1) lookup (hash map) and O(1) ordering (doubly linked list or OrderedDict).",
      "Use Python's OrderedDict. move_to_end() on access, popitem(last=False) to evict LRU.",
      "OrderedDict: get -> move_to_end, return value. put -> move_to_end if exists, set value, if over capacity popitem(last=False).",
    ]),
  },
];

export async function seedProblems() {
  console.log(`ðŸ§© Seeding 50 problems...`);

  let createdCount = 0;
  for (const p of problems) {
    try {
      const problem = await prisma.problem.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title,
          description: p.description,
          difficulty: p.difficulty,
          pattern: p.pattern,
          category: p.category,
          phase: p.phase,
          weekNumber: p.weekNumber,
          timeComplexity: p.timeComplexity,
          spaceComplexity: p.spaceComplexity,
          correctPattern: p.correctPattern,
          starterCode: p.starterCode,
          solutionCode: p.solutionCode,
          testCases: p.testCases,
          hiddenTestCases: p.hiddenTestCases,
          hints: p.hints,
        },
        create: {
          slug: p.slug,
          title: p.title,
          description: p.description,
          difficulty: p.difficulty,
          pattern: p.pattern,
          category: p.category,
          phase: p.phase,
          weekNumber: p.weekNumber,
          timeComplexity: p.timeComplexity,
          spaceComplexity: p.spaceComplexity,
          correctPattern: p.correctPattern,
          starterCode: p.starterCode,
          solutionCode: p.solutionCode,
          testCases: p.testCases,
          hiddenTestCases: p.hiddenTestCases,
          hints: p.hints,
        },
      });
      console.log(`âœ… Upserted problem: ${problem.title}`);
    } catch (e) {
      console.warn(`  âš  Skipped ${p.slug}: `);
      console.error(e);
    }
  }
  const totalProblems = await prisma.problem.count();
  console.log(`\n  âœ… Seeded ${createdCount}/${problems.length} problems`);
  console.log(`     Total problems in DB: ${totalProblems}`);
}

if (require.main === module || process.argv[1]?.includes('seed-problems-complete')) {
  seedProblems()
    .catch((e) => { console.error("âŒ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
