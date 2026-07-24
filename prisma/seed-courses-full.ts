import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCoursesAndLessons() {
  console.log("📚 Seeding 3 courses with 15 lessons...\n");

  // ═══════════════════════════════════════════════════════
  // COURSE 1: Python & Arrays Fundamentals
  // ═══════════════════════════════════════════════════════
  const course1 = await prisma.course.upsert({
    where: { slug: "python-arrays-fundamentals" },
    update: {},
    create: {
      slug: "python-arrays-fundamentals",
      title: "Python & Arrays Fundamentals",
      description:
        "Master Python basics, array manipulation, and string operations. The foundation of all DSA work.",
      category: "fundamentals",
      difficulty: "beginner",
      icon: "🐍",
      order: 1,
    },
  });
  console.log(`  ✓ Course: ${course1.title}`);

  // ═══════════════════════════════════════════════════════
  // COURSE 2: Core Data Structures
  // ═══════════════════════════════════════════════════════
  const course2 = await prisma.course.upsert({
    where: { slug: "core-data-structures" },
    update: {},
    create: {
      slug: "core-data-structures",
      title: "Core Data Structures",
      description:
        "Master Stacks, Queues, Linked Lists, and Binary Search. The building blocks every engineer must know.",
      category: "data-structures",
      difficulty: "beginner",
      icon: "🏗️",
      order: 2,
    },
  });
  console.log(`  ✓ Course: ${course2.title}`);

  // ═══════════════════════════════════════════════════════
  // COURSE 3: DSA Patterns for Interviews
  // ═══════════════════════════════════════════════════════
  const course3 = await prisma.course.upsert({
    where: { slug: "dsa-patterns-interviews" },
    update: {},
    create: {
      slug: "dsa-patterns-interviews",
      title: "DSA Patterns for Interviews",
      description:
        "Learn the 8 core patterns that appear in 90% of coding interviews. Think in patterns, not problems.",
      category: "patterns",
      difficulty: "intermediate",
      icon: "🧩",
      order: 3,
    },
  });
  console.log(`  ✓ Course: ${course3.title}`);

  // ─────────────────────────────────────────────────────
  // COURSE 1 LESSONS
  // ─────────────────────────────────────────────────────

  const course1Lessons = [
    {
      slug: "python-basics-review",
      title: "Python Basics Review",
      order: 1,
      difficulty: "beginner",
      estimatedTime: 20,
      content: `# Python Basics Review

Before diving into DSA, let's make sure your Python fundamentals are sharp. Every DSA solution you write will use these building blocks.

## Variables and Types

Python is dynamically typed — you don't declare types, but you must understand them:

\`\`\`python
# Numbers
x = 5          # int
y = 3.14       # float
z = -100       # negative int

# Strings
name = "Alice"
greeting = f"Hello, {name}"   # f-string (use this pattern constantly)

# Booleans
is_valid = True
is_empty = False

# None (like null in other languages)
result = None
\`\`\`

## Lists (Arrays in Python)

In Python, arrays are called **lists**. Lists are ordered, mutable, and allow duplicates.

\`\`\`python
# Creating lists
nums = [1, 2, 3, 4, 5]
empty = []
mixed = [1, "hello", True]   # Python allows mixed types (avoid in DSA)

# Accessing elements
first = nums[0]       # 1  (zero-indexed)
last = nums[-1]       # 5  (negative index from end)
second_last = nums[-2]  # 4

# Slicing
first_three = nums[0:3]   # [1, 2, 3]  (start inclusive, end exclusive)
last_two = nums[-2:]      # [4, 5]
copy = nums[:]            # [1, 2, 3, 4, 5]  full copy

# Length
size = len(nums)    # 5
\`\`\`

## List Operations

\`\`\`python
nums = [3, 1, 4, 1, 5]

# Add elements
nums.append(9)        # adds to end: [3, 1, 4, 1, 5, 9]
nums.insert(0, 0)     # insert at index: [0, 3, 1, 4, 1, 5, 9]

# Remove elements
nums.pop()            # removes last, returns it: 9
nums.pop(0)           # removes at index 0: returns 0
nums.remove(1)        # removes FIRST occurrence of value 1

# Search
idx = nums.index(4)   # returns index of first 4
exists = 4 in nums    # True/False membership check

# Sort
nums.sort()           # in-place ascending
nums.sort(reverse=True)  # in-place descending
sorted_copy = sorted(nums)  # returns new sorted list, original unchanged
\`\`\`

## Dictionaries (Hash Maps)

Dictionaries are your most powerful tool in DSA. Learn them deeply.

\`\`\`python
# Creating
freq = {}
freq = {"a": 1, "b": 2}
freq = dict()

# Reading
val = freq["a"]          # KeyError if missing!
val = freq.get("a", 0)   # safe: returns 0 if "a" not found

# Writing
freq["c"] = 3
freq["a"] += 1           # increment

# Checking existence
if "a" in freq:
    print("found")

# Iterating
for key in freq:          # iterate keys
    print(key)

for key, val in freq.items():   # iterate key-value pairs
    print(key, val)
\`\`\`

## Sets

Sets are unordered collections with no duplicates. Perfect for checking "have I seen this before?"

\`\`\`python
seen = set()
seen.add(5)
seen.add(5)    # duplicate — ignored
print(seen)    # {5}

# Membership check is O(1) — much faster than list search
if 5 in seen:
    print("seen before")

# Convert list to set to remove duplicates
unique = set([1, 2, 2, 3])   # {1, 2, 3}
\`\`\`

## Key Takeaway

> In DSA: lists for ordered sequences, dicts for frequency/lookup, sets for "seen" tracking. These three structures solve 70% of problems.`,
      codeExample: `# Practice: Count character frequency
def char_frequency(s: str) -> dict:
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    return freq

print(char_frequency("hello"))   # {'h': 1, 'e': 1, 'l': 2, 'o': 1}`,
    },
    {
      slug: "time-space-complexity",
      title: "Time & Space Complexity",
      order: 2,
      difficulty: "beginner",
      estimatedTime: 25,
      content: `# Time & Space Complexity

Every solution you write has a cost. Interviewers ALWAYS ask: "What is the time and space complexity?" Learn to answer this confidently.

## Why It Matters

\`\`\`python
# Solution A: O(n²) time
def find_duplicate_slow(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False

# Solution B: O(n) time, O(n) space
def find_duplicate_fast(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False
\`\`\`

For 1 million numbers: Solution A does 1 trillion operations. Solution B does 1 million. This is why complexity matters.

## Big O Notation

Big O describes how runtime grows as input size n grows. We always care about the **worst case**.

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array index access, hash map lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Single loop through array |
| O(n log n) | Log-linear | Efficient sorting (merge sort) |
| O(n²) | Quadratic | Nested loops |
| O(2ⁿ) | Exponential | Recursive subsets |

## How to Calculate Time Complexity

**Rule 1: Count loops**
\`\`\`python
def sum_array(nums):      # O(n) — one loop
    total = 0
    for n in nums:
        total += n
    return total
\`\`\`

**Rule 2: Nested loops multiply**
\`\`\`python
def print_pairs(nums):    # O(n²) — nested loops
    for i in nums:
        for j in nums:
            print(i, j)
\`\`\`

**Rule 3: Drop constants and lower-order terms**
\`\`\`python
# O(2n) → O(n)
# O(n² + n) → O(n²)
# O(n + 500) → O(n)
\`\`\`

**Rule 4: Built-in operation costs**
\`\`\`python
len(nums)        # O(1)  — Python stores length
nums.append(x)   # O(1)  amortized
nums.insert(0,x) # O(n)  — shifts all elements
sorted(nums)     # O(n log n)
x in nums        # O(n)  — list scan
x in my_set      # O(1)  — hash lookup
x in my_dict     # O(1)  — hash lookup
\`\`\`

## Space Complexity

Space complexity counts extra memory your algorithm uses (not counting the input).

\`\`\`python
def two_sum(nums, target):
    seen = {}           # O(n) extra space — grows with input
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []
# Time: O(n), Space: O(n)
\`\`\`

\`\`\`python
def reverse_in_place(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
# Time: O(n), Space: O(1) — no extra memory used
\`\`\`

## What Interviewers Expect

Always state both: **"Time complexity is O(n), space complexity is O(n) because I'm using a hash map."**

If you optimize: **"I can reduce space to O(1) by using two pointers instead, but time stays O(n)."**`,
      codeExample: `# What is the time and space complexity?
def find_two_sum(nums: list, target: int) -> list:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
# Answer: Time O(n), Space O(n)`,
    },
    {
      slug: "array-two-pointers",
      title: "Two Pointers Pattern",
      order: 3,
      difficulty: "beginner",
      estimatedTime: 30,
      content: `# Two Pointers Pattern

Two Pointers is one of the most important patterns in DSA. Master this and you can solve dozens of interview problems.

## Why Brute Force Fails First

Before learning Two Pointers, let's **feel** why the obvious approach breaks.

### Try This (Mental Simulation)

You're given 10,000 sorted numbers and a target sum. You need to find if any two numbers add to the target.

**Your instinct:** Check every pair.
- Number 1 vs Number 2, 3, 4... 10,000
- Number 2 vs Number 3, 4, 5... 10,000
- ... repeat 10,000 times

**The math:** ~50 million comparisons.

**On your laptop:** 2-3 seconds.
**On LeetCode:** "Time Limit Exceeded."
**In an interview:** You just failed.

### The Moment of Failure

\`\`\`python
def two_sum_brute(nums, target):
    for i in range(len(nums)):           # 10,000 iterations
        for j in range(i + 1, len(nums)): # 9,999 + 9,998 + ... iterations
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
# Time: O(n²) — for n=10⁴: 10⁸ operations
\`\`\`

> 💡 **The Pattern Recognition Moment:**  
> The problem isn't the code. It's that we're **ignoring the sorted property**.  
> If nums[i] + nums[j] is too small, we need a larger sum.  
> Since the array is sorted... which number should we increase?

**Stop here. Actually think for 30 seconds.**  
Then scroll to see how Two Pointers uses this insight.

<details>
<summary>Click to reveal the insight (only after thinking)</summary>

Since the array is sorted:
- If sum is too small: move left pointer right (increase sum)
- If sum is too large: move right pointer left (decrease sum)
- We eliminate one element per step → O(n) instead of O(n²)

</details>

## The Core Idea

Instead of using nested loops (O(n²)), use two variables pointing to positions in the array and move them strategically.

\`\`\`
[1, 2, 3, 4, 5, 6, 7]
 ↑                 ↑
left             right
\`\`\`

## When to Use Two Pointers

Ask yourself:
- Is the array sorted (or can I sort it)?
- Am I looking for a pair or group of elements?
- Am I shrinking/expanding a range?

If yes to any → think Two Pointers.

## Pattern 1: Opposite Direction (Sorted Array)

Both pointers start at opposite ends and move toward each other.

\`\`\`python
def two_sum_sorted(nums, target):
    """Find two numbers that sum to target in a sorted array."""
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1     # need bigger sum → move left pointer right
        else:
            right -= 1    # need smaller sum → move right pointer left

    return []
# Time: O(n), Space: O(1)
\`\`\`

## Pattern 2: Same Direction (Fast/Slow)

Both pointers start at the beginning, one moves faster than the other.

\`\`\`python
def remove_duplicates(nums):
    """Remove duplicates in-place from sorted array. Return new length."""
    if not nums:
        return 0

    slow = 0   # slow pointer: position to write next unique element

    for fast in range(1, len(nums)):   # fast scans ahead
        if nums[fast] != nums[slow]:   # found a new unique element
            slow += 1
            nums[slow] = nums[fast]    # write it at slow position

    return slow + 1
# Time: O(n), Space: O(1)
\`\`\`

## Pattern 3: Partition (Two sides of a condition)

\`\`\`python
def move_zeroes(nums):
    """Move all zeros to end while maintaining relative order."""
    insert_pos = 0    # where to insert next non-zero

    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos] = nums[i]
            insert_pos += 1

    # Fill remaining positions with zeros
    while insert_pos < len(nums):
        nums[insert_pos] = 0
        insert_pos += 1
# Time: O(n), Space: O(1)
\`\`\`

## The Mental Model

> "I have two variables pointing at positions. Based on some condition, I decide which one to move. I stop when they meet or cross."

This eliminates the inner loop completely, taking O(n²) → O(n).

## Common Mistakes

\`\`\`python
# WRONG: forgetting the loop condition
while left < right:   # NOT while left <= right (they'd compare same element)

# WRONG: moving the wrong pointer
# If sum is too small, we need larger numbers → move LEFT forward (not right)

# RIGHT: always ask "what does moving this pointer do to my answer?"
\`\`\`

> [!NOTE]
> ### 💡 This Is The Hard Part
> The syntax of Two Pointers is simple. The intuition is not.
>
> Right now, you might be thinking: "How would I ever think to move pointers like this?"
> **This is completely normal.** Every developer thinks this at first.
>
> After solving 3-4 Two Pointer problems, the pattern becomes automatic.
> You haven't failed if it doesn't click immediately—you're just in the first hour of a 10-hour skill acquisition.`,
      codeExample: `def is_palindrome(s: str) -> bool:
    """Check if string is a palindrome using two pointers."""
    # Clean: lowercase, alphanumeric only
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True`,
    },
    {
      slug: "sliding-window-pattern",
      title: "Sliding Window Pattern",
      order: 4,
      difficulty: "beginner",
      estimatedTime: 30,
      content: `# Sliding Window Pattern

Sliding Window solves problems about contiguous subarrays or substrings efficiently. It is the second most common pattern after Two Pointers.

## The Core Idea

Instead of recomputing the sum/state of every possible subarray (O(n²)), maintain a "window" and slide it forward — adding one element and removing one element at a time (O(n)).

\`\`\`
[1, 3, 5, 2, 4, 6, 8]
 |_______|
 window of size 3
       |_______|
       slide →
\`\`\`

## When to Use Sliding Window

- "Find max/min sum of subarray of size k"
- "Longest substring with condition X"
- "Minimum window containing all characters"
- Keywords: **contiguous**, **subarray**, **substring**, **window**

## Pattern 1: Fixed Size Window

\`\`\`python
def max_sum_subarray(nums, k):
    """Find maximum sum of any subarray of size k."""
    if len(nums) < k:
        return 0

    # Build first window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide the window
    for i in range(k, len(nums)):
        window_sum += nums[i]        # add new element (right side)
        window_sum -= nums[i - k]    # remove old element (left side)
        max_sum = max(max_sum, window_sum)

    return max_sum
# Time: O(n), Space: O(1)
\`\`\`

## Pattern 2: Variable Size Window (Expand/Shrink)

\`\`\`python
def longest_substring_no_repeat(s):
    """Longest substring without repeating characters."""
    char_index = {}    # char → last seen index
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If char is in window, shrink from left
        if s[right] in char_index and char_index[s[right]] >= left:
            left = char_index[s[right]] + 1

        char_index[s[right]] = right    # update last seen position
        max_length = max(max_length, right - left + 1)

    return max_length
# Time: O(n), Space: O(min(n, alphabet_size))
\`\`\`

## The Template (Variable Window)

\`\`\`python
def sliding_window_template(arr):
    left = 0
    result = 0
    window_state = {}   # track what's in current window

    for right in range(len(arr)):
        # 1. Expand window: add arr[right] to window_state

        # 2. Check if window is invalid
        while window_is_invalid(window_state):
            # Shrink window: remove arr[left] from window_state
            left += 1

        # 3. Update result with current valid window
        result = max(result, right - left + 1)

    return result
\`\`\`

## Key Insight

> "Fixed window: add one, remove one. Variable window: expand until invalid, then shrink until valid again."

The window size changes, but the pointer only moves **forward** — this guarantees O(n).

> [!NOTE]
> ### 🧠 Pattern Recognition Takes Repetition
> Sliding Window problems look completely different on the surface:
> - "Longest substring without repeating characters"
> - "Max sum of subarray of size k"
> - "Min window substring"
>
> But they share the same skeleton: expand → contract → track state.
>
> If you can't see the similarity yet, that's expected. The pattern recognition develops problem-by-problem, not lesson-by-lesson.

> [!TIP]
> 🔗 **Connection to previous lessons:** Sliding Window often uses a Hash Map (from Lesson 5) to track window state (character counts, sum values). If Hash Maps felt abstract in Lesson 5, this is where they become concrete.`,
      codeExample: `def max_sum_subarray_k(nums: list, k: int) -> int:
    """Maximum sum subarray of exactly size k."""
    window_sum = sum(nums[:k])
    best = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        best = max(best, window_sum)
    return best`,
    },
    {
      slug: "hashmaps-and-sets",
      title: "Hash Maps & Sets for DSA",
      order: 5,
      difficulty: "beginner",
      estimatedTime: 25,
      content: `# Hash Maps & Sets for DSA

Hash maps (dicts) and sets solve problems that would otherwise require O(n²) nested loops. Understanding them deeply is non-negotiable for interviews.

## How Hash Maps Work

A hash map converts a key into an array index using a hash function. This gives O(1) average-case lookup, insert, and delete.

\`\`\`
key "apple" → hash function → index 47 → value stored at index 47
\`\`\`

## The 3 Core Patterns

### Pattern 1: Frequency Count

\`\`\`python
def is_anagram(s, t):
    """Are two strings anagrams of each other?"""
    if len(s) != len(t):
        return False

    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    for char in t:
        if char not in freq or freq[char] == 0:
            return False
        freq[char] -= 1

    return True
# Time: O(n), Space: O(1) — at most 26 keys (letters)
\`\`\`

### Pattern 2: Complement / Lookup

\`\`\`python
def two_sum(nums, target):
    """Classic Two Sum — find indices of two numbers summing to target."""
    seen = {}   # value → index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []
# Key insight: store what you've SEEN, look for what you NEED
# Time: O(n), Space: O(n)
\`\`\`

### Pattern 3: Grouping / Bucketing

\`\`\`python
def group_anagrams(words):
    """Group words that are anagrams of each other."""
    groups = {}   # sorted_word → [original words]

    for word in words:
        key = ''.join(sorted(word))   # canonical form
        if key not in groups:
            groups[key] = []
        groups[key].append(word)

    return list(groups.values())
# Time: O(n * k log k) where k = avg word length
\`\`\`

## Sets for "Have I Seen This?"

\`\`\`python
def contains_duplicate(nums):
    """Does the array have any duplicates?"""
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False
# Time: O(n), Space: O(n)
# vs naive O(n²) nested loop approach
\`\`\`

## Using defaultdict and Counter

Python has powerful built-in tools — use them:

\`\`\`python
from collections import defaultdict, Counter

# defaultdict: no KeyError, sets default value automatically
freq = defaultdict(int)    # default 0
freq['a'] += 1             # no need to check if 'a' exists

# Counter: instantly count frequencies
from collections import Counter
freq = Counter("banana")   # Counter({'a': 3, 'n': 2, 'b': 1})
most_common = freq.most_common(2)   # [('a', 3), ('n', 2)]
\`\`\`

## Interview Tip

When you see: "find pair", "find duplicate", "group by", "frequency of" — your first thought should be: **hash map**.

When you see: "have I seen X before", "unique elements" — your first thought should be: **set**.`,
      codeExample: `from collections import Counter

def top_k_frequent(nums: list, k: int) -> list:
    """Return k most frequent elements."""
    freq = Counter(nums)
    # Sort by frequency descending, take top k
    return [num for num, count in freq.most_common(k)]

print(top_k_frequent([1,1,1,2,2,3], 2))  # [1, 2]`,
    },
  ];

  for (const l of course1Lessons) {
    await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {},
      create: { ...l, courseId: course1.id },
    });
    console.log(`    ✓ Lesson: ${l.title}`);
  }

  // ─────────────────────────────────────────────────────
  // COURSE 2 LESSONS
  // ─────────────────────────────────────────────────────

  const course2Lessons = [
    {
      slug: "stacks-and-queues",
      title: "Stacks & Queues",
      order: 1,
      difficulty: "beginner",
      estimatedTime: 25,
      content: `# Stacks & Queues

Stacks and Queues are the simplest data structures beyond arrays — but they appear in a shocking number of interview problems.

## Stack — Last In, First Out (LIFO)

Think of a stack of plates: the last plate you put on top is the first one you take off.

\`\`\`python
# Python list as a stack
stack = []

stack.append(1)    # push: [1]
stack.append(2)    # push: [1, 2]
stack.append(3)    # push: [1, 2, 3]

top = stack[-1]    # peek: 3 (don't remove)
val = stack.pop()  # pop: 3, stack is now [1, 2]

# All operations are O(1)
\`\`\`

## When to Use a Stack

- **Matching brackets / parentheses** — push opens, pop and match on close
- **Undo operations** — push each action, pop to undo
- **DFS traversal** — explicit stack instead of recursion
- **Monotonic stack** — next greater/smaller element problems

## The Canonical Stack Problem: Valid Parentheses

\`\`\`python
def is_valid(s: str) -> bool:
    """Check if parentheses string is valid."""
    stack = []
    matching = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in '({[':
            stack.append(char)      # push opening bracket
        elif char in ')}]':
            if not stack or stack[-1] != matching[char]:
                return False        # no match or stack empty
            stack.pop()             # matched — pop

    return len(stack) == 0          # valid if stack is empty
\`\`\`

## Queue — First In, First Out (FIFO)

Think of a line at a store: first person in line is the first served.

\`\`\`python
from collections import deque

queue = deque()

queue.append(1)       # enqueue: deque([1])
queue.append(2)       # enqueue: deque([1, 2])
queue.append(3)       # enqueue: deque([1, 2, 3])

val = queue.popleft() # dequeue: 1, deque([2, 3])

# All operations are O(1) with deque
# WARNING: list.pop(0) is O(n) — always use deque for queues!
\`\`\`

## When to Use a Queue

- **BFS traversal** — process nodes level by level
- **Scheduling / ordering** — process tasks in arrival order
- **Sliding window problems** — deque as a monotonic queue

## Why deque, Not list?

\`\`\`python
# list.pop(0) is O(n) — it shifts every element left
# deque.popleft() is O(1) — it maintains head/tail pointers

# ALWAYS use collections.deque for queue operations
from collections import deque
\`\`\`

## Key Takeaway

> Stack = LIFO (undo, matching, DFS). Queue = FIFO (BFS, scheduling). Use \`deque\` for O(1) queue operations.`,
      codeExample: `def is_valid(s: str) -> bool:
    """Valid parentheses using a stack."""
    stack = []
    matching = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif char in ')}]':
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
    return len(stack) == 0

print(is_valid("()[]{}"))   # True
print(is_valid("([)]"))     # False`,
    },
    {
      slug: "linked-lists-fundamentals",
      title: "Linked Lists",
      order: 2,
      difficulty: "beginner",
      estimatedTime: 30,
      content: `# Linked Lists

A linked list is a linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, elements aren't stored contiguously in memory.

## Building Blocks

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Create: 1 → 2 → 3
head = ListNode(1, ListNode(2, ListNode(3)))
\`\`\`

## Traversal

\`\`\`python
def print_list(head):
    """Walk through the linked list and print each value."""
    current = head
    while current:
        print(current.val, end=" → ")
        current = current.next
    print("None")
# Time: O(n), Space: O(1)
\`\`\`

## Why Linked Lists Exist

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert at head | O(n) | **O(1)** |
| Insert at tail | O(1) amortized | O(n) or O(1) with tail |
| Delete known node | O(n) | **O(1)** |

Linked lists win when you need frequent insertions/deletions and don't need random access.

## Key Operations

### Insert at Head — O(1)
\`\`\`python
def insert_head(head, val):
    new_node = ListNode(val)
    new_node.next = head
    return new_node    # new_node is the new head
\`\`\`

### Delete a Node — O(n)
\`\`\`python
def delete_node(head, val):
    dummy = ListNode(0, head)    # dummy node trick
    prev = dummy
    curr = head
    while curr:
        if curr.val == val:
            prev.next = curr.next    # skip the node
            break
        prev = curr
        curr = curr.next
    return dummy.next
\`\`\`

## The Reverse Linked List Pattern

This is THE most important linked list operation. You will use it everywhere.

\`\`\`python
def reverse_list(head):
    """Reverse a linked list iteratively."""
    prev = None
    curr = head
    while curr:
        next_node = curr.next    # save next
        curr.next = prev         # reverse pointer
        prev = curr              # advance prev
        curr = next_node         # advance curr
    return prev                  # prev is the new head
# Time: O(n), Space: O(1)
\`\`\`

**Visualize it:**
\`\`\`
Step 1: None ← 1    2 → 3 → None
Step 2: None ← 1 ← 2    3 → None
Step 3: None ← 1 ← 2 ← 3
Return: 3 → 2 → 1 → None
\`\`\`

## Fast/Slow Pointer (Runner Technique)

Use two pointers moving at different speeds to find the middle or detect cycles.

\`\`\`python
def find_middle(head):
    """Find the middle node of a linked list."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next          # moves 1 step
        fast = fast.next.next     # moves 2 steps
    return slow                   # slow is at the middle
# Time: O(n), Space: O(1)
\`\`\`

## Interview Tip

> Most linked list problems use one of three techniques: **reversal**, **fast/slow pointers**, or **dummy node**. Master all three.`,
      codeExample: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    """Reverse a linked list iteratively."""
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
    },
    {
      slug: "binary-search",
      title: "Binary Search",
      order: 3,
      difficulty: "beginner",
      estimatedTime: 25,
      content: `# Binary Search

Binary Search is the most efficient way to find an element in a sorted array: O(log n) instead of O(n).

## The Core Idea: Divide and Conquer

Instead of checking every element, cut the search space in half each step.

\`\`\`
Array: [1, 3, 5, 7, 9, 11, 13, 15]
Target: 9

Step 1: mid=7 → 9 > 7 → search right half [9, 11, 13, 15]
Step 2: mid=11 → 9 < 11 → search left half [9]
Step 3: mid=9 → found!
\`\`\`

3 steps instead of 5. For 1 million elements: 20 steps instead of 1 million.

## The Standard Template

\`\`\`python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2    # or: left + (right - left) // 2

        if nums[mid] == target:
            return mid               # found it
        elif nums[mid] < target:
            left = mid + 1           # target is in right half
        else:
            right = mid - 1          # target is in left half

    return -1                        # not found
# Time: O(log n), Space: O(1)
\`\`\`

## The Off-By-One Danger

Binary search bugs come from incorrect boundary handling:

\`\`\`python
# Common mistakes:
# 1. while left < right   (misses case when left == right)
# 2. left = mid           (infinite loop when left == mid)
# 3. right = mid          (can work, but changes the template)

# Safe template: while left <= right, left = mid + 1, right = mid - 1
\`\`\`

## Modified Binary Search: Rotated Array

\`\`\`python
def search_rotated(nums, target):
    """Search in a rotated sorted array."""
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Determine which half is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1    # target in sorted left half
            else:
                left = mid + 1     # target in right half
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1     # target in sorted right half
            else:
                right = mid - 1    # target in left half

    return -1
\`\`\`

## When to Use Binary Search

- **Sorted array** — classic binary search
- **"Find minimum/maximum that satisfies condition"** — binary search on answer
- **Rotated sorted array** — modified binary search
- **Search space can be halved** — binary search pattern

## Key Takeaway

> If the array is sorted, your first thought should be binary search. O(log n) is extremely fast — it handles billions of elements in ~30 steps.

> [!TIP]
> 🔗 **Binary Search vs Two Pointers:** Both exploit sorted arrays. Two Pointers scans from both ends for pairs. Binary Search jumps to the middle for single values. Choosing wrong = TLE.`,
      codeExample: `def binary_search(nums: list, target: int) -> int:
    """Classic binary search on sorted array."""
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

print(binary_search([1, 3, 5, 7, 9, 11], 7))  # 3`,
    },
    {
      slug: "trees-and-bst",
      title: "Trees & Binary Search Trees",
      order: 4,
      difficulty: "beginner",
      estimatedTime: 35,
      content: `# Trees & Binary Search Trees

Trees are hierarchical data structures. They appear in roughly 30% of interview problems.

## Tree Terminology

\`\`\`
        1          ← root (depth 0)
       / \\
      2   3        ← depth 1
     / \\
    4   5          ← depth 2 (leaves — no children)
\`\`\`

- **Root**: top node (no parent)
- **Leaf**: node with no children
- **Height**: longest path from root to a leaf (this tree: height 2)
- **Depth**: distance from root to a node

## Building a Tree Node

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Build the tree above
root = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3)
)
\`\`\`

## DFS Traversals (Depth-First Search)

Three ways to visit every node:

\`\`\`python
def inorder(root):
    """Left → Root → Right (gives sorted order for BST)"""
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def preorder(root):
    """Root → Left → Right (good for copying/serializing)"""
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def postorder(root):
    """Left → Right → Root (good for deletion)"""
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]
\`\`\`

## BFS Traversal (Level-Order)

\`\`\`python
from collections import deque

def level_order(root):
    """Visit nodes level by level using a queue."""
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
\`\`\`

## Binary Search Tree (BST)

A BST has a special property: **left < root < right** for every node.

\`\`\`python
def search_bst(root, target):
    """Search for a value in BST — O(log n) average."""
    if not root:
        return None
    if target == root.val:
        return root
    elif target < root.val:
        return search_bst(root.left, target)
    else:
        return search_bst(root.right, target)
\`\`\`

## Validate BST

\`\`\`python
def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')):
    """Every node must be within (min_val, max_val) range."""
    if not root:
        return True
    if root.val <= min_val or root.val >= max_val:
        return False
    return (is_valid_bst(root.left, min_val, root.val) and
            is_valid_bst(root.right, root.val, max_val))
\`\`\`

## The Recursion Pattern for Trees

> "Trust the recursion": solve for the current node, trust that recursion handles subtrees correctly.

\`\`\`python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
\`\`\`

## Key Takeaway

> For trees: think recursion first. Base case = null node. Recursive case = process current node + recurse on children.`,
      codeExample: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def is_valid_bst(root, lo=float('-inf'), hi=float('inf')):
    if not root:
        return True
    if root.val <= lo or root.val >= hi:
        return False
    return is_valid_bst(root.left, lo, root.val) and is_valid_bst(root.right, root.val, hi)`,
    },
    {
      slug: "recursion-and-backtracking",
      title: "Recursion & Backtracking",
      order: 5,
      difficulty: "beginner",
      estimatedTime: 35,
      content: `# Recursion & Backtracking

Recursion is when a function calls itself. Backtracking uses recursion to explore all possibilities and undo bad choices.

## How Recursion Works

Every recursive function has two parts:
1. **Base case** — when to stop
2. **Recursive case** — the function calls itself with a smaller problem

\`\`\`python
def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case

# Call stack visualization:
# factorial(4)
#   → 4 * factorial(3)
#     → 3 * factorial(2)
#       → 2 * factorial(1)
#         → 1 (base case!)
#       → 2 * 1 = 2
#     → 3 * 2 = 6
#   → 4 * 6 = 24
\`\`\`

## The Leap of Faith

> Don't trace every recursive call. Instead, trust that if your function works for smaller inputs, it works for the current input too.

\`\`\`python
def sum_list(nums):
    if not nums:                    # base case: empty list
        return 0
    return nums[0] + sum_list(nums[1:])   # first + sum of rest
# Trust: sum_list(nums[1:]) correctly sums the rest
\`\`\`

## Memoization (Top-Down DP)

When recursion recomputes the same subproblems, cache results:

\`\`\`python
# Fibonacci without memo: O(2^n) — exponentially slow
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

# Fibonacci with memo: O(n) — each subproblem computed once
def fib_memo(n, memo={}):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]
\`\`\`

## Backtracking Template

Backtracking = **choose → explore → unchoose**

\`\`\`python
def backtrack(choices, path, results):
    if is_solution(path):
        results.append(path[:])    # found a valid solution
        return

    for choice in choices:
        if is_valid(choice):
            path.append(choice)         # 1. Choose
            backtrack(remaining, path, results)  # 2. Explore
            path.pop()                  # 3. Unchoose (backtrack!)
\`\`\`

## Generate All Subsets

\`\`\`python
def subsets(nums):
    """Generate all subsets of a list."""
    result = []

    def backtrack(start, current):
        result.append(current[:])       # every state is a valid subset

        for i in range(start, len(nums)):
            current.append(nums[i])     # choose
            backtrack(i + 1, current)   # explore (start from i+1 to avoid duplicates)
            current.pop()               # unchoose

    backtrack(0, [])
    return result
# subsets([1,2,3]) → [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
\`\`\`

## Generate All Permutations

\`\`\`python
def permutations(nums):
    """Generate all permutations of a list."""
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
\`\`\`

## Key Takeaway

> Recursion: trust it works for smaller inputs. Backtracking: choose, explore, unchoose. These two tools unlock tree problems, subset problems, and combinatorial search.`,
      codeExample: `def subsets(nums: list) -> list:
    """Generate all subsets using backtracking."""
    result = []
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result

print(subsets([1, 2, 3]))`,
    },
  ];

  for (const l of course2Lessons) {
    await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {},
      create: { ...l, courseId: course2.id },
    });
    console.log(`    ✓ Lesson: ${l.title}`);
  }

  // ─────────────────────────────────────────────────────
  // COURSE 3 LESSONS
  // ─────────────────────────────────────────────────────

  const course3Lessons = [
    {
      slug: "fast-slow-pointers",
      title: "Fast & Slow Pointers",
      order: 1,
      difficulty: "intermediate",
      estimatedTime: 25,
      content: `# Fast & Slow Pointers

Also known as Floyd's Tortoise and Hare algorithm. This pattern detects cycles and finds midpoints using two pointers moving at different speeds.

## The Core Idea

- **Slow pointer** moves 1 step at a time
- **Fast pointer** moves 2 steps at a time
- If there's a cycle, they MUST meet
- If no cycle, fast reaches the end

## Why They Must Meet (The Math)

When both pointers enter the cycle, fast gains 1 step per iteration. Since the cycle has finite length, fast will eventually lap slow — like a runner on a track.

\`\`\`
Step 0: slow at A, fast at A
Step 1: slow moves 1, fast moves 2 (gap: 1)
Step 2: slow moves 1, fast moves 2 (gap: 2)
...
In a cycle of length L, they meet in at most L steps
\`\`\`

## Detect Cycle in Linked List

\`\`\`python
def has_cycle(head):
    """Return True if linked list has a cycle."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True     # they met — cycle exists
    return False            # fast reached end — no cycle
# Time: O(n), Space: O(1)
\`\`\`

## Find Middle of Linked List

\`\`\`python
def find_middle(head):
    """When fast reaches end, slow is at middle."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
# Time: O(n), Space: O(1)
\`\`\`

## Find Start of Cycle

After detecting a cycle (slow == fast), reset one pointer to head. Move both at speed 1. They meet at the cycle start.

\`\`\`python
def detect_cycle_start(head):
    """Return the node where cycle starts, or None."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Reset one pointer to head
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow     # cycle start
    return None
\`\`\`

## When to Use Fast/Slow Pointers

- Detect if a linked list has a cycle
- Find the middle of a linked list
- Find the start of a cycle
- Happy number problem (cycle in number sequence)
- Find duplicate in array (treat as linked list)

## Key Takeaway

> Two pointers at different speeds solve cycle detection in O(1) space. If you see "cycle" or "middle" — think fast/slow pointers.`,
      codeExample: `def has_cycle(head) -> bool:
    """Detect cycle using Floyd's algorithm."""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    },
    {
      slug: "merge-intervals",
      title: "Merge Intervals",
      order: 2,
      difficulty: "intermediate",
      estimatedTime: 25,
      content: `# Merge Intervals

Interval problems appear frequently in interviews. The pattern is always the same: sort first, then merge.

## Interval Representation

An interval is a pair [start, end]. Examples: [1, 3] means from 1 to 3.

## The Core Algorithm

1. **Sort** intervals by start time
2. **Iterate** through sorted intervals
3. **Merge** if the current interval overlaps with the previous one

## Overlap Condition

Two intervals overlap when: \`b.start <= a.end\`

\`\`\`
[1,   5]
   [3,    7]    → overlap! (3 <= 5)  → merge to [1, 7]

[1, 3]
       [5, 7]   → no overlap (5 > 3) → keep separate
\`\`\`

## Merge Intervals

\`\`\`python
def merge_intervals(intervals):
    """Merge all overlapping intervals."""
    if not intervals:
        return []

    # Step 1: Sort by start time
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for start, end in intervals[1:]:
        # Step 2: Check overlap with last merged interval
        if start <= merged[-1][1]:
            # Overlapping — extend the end
            merged[-1][1] = max(merged[-1][1], end)
        else:
            # Not overlapping — add as new interval
            merged.append([start, end])

    return merged
# Time: O(n log n) for sort, Space: O(n) for result
\`\`\`

## Insert Interval

\`\`\`python
def insert_interval(intervals, new_interval):
    """Insert a new interval and merge if necessary."""
    result = []
    i = 0
    n = len(intervals)

    # Add all intervals that end before new_interval starts
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    # Merge overlapping intervals with new_interval
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    result.append(new_interval)

    # Add remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1

    return result
\`\`\`

## Meeting Rooms (Can Attend All?)

\`\`\`python
def can_attend_meetings(intervals):
    """Return True if no meetings overlap."""
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False    # overlap found
    return True
\`\`\`

## Key Takeaway

> Sort by start time first. Then compare each interval's start with the previous interval's end. If they overlap, extend; if not, add new.`,
      codeExample: `def merge_intervals(intervals: list) -> list:
    """Merge overlapping intervals."""
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

print(merge_intervals([[1,3],[2,6],[8,10],[15,18]]))
# [[1, 6], [8, 10], [15, 18]]`,
    },
    {
      slug: "bfs-and-dfs-graphs",
      title: "BFS & DFS on Graphs",
      order: 3,
      difficulty: "intermediate",
      estimatedTime: 35,
      content: `# BFS & DFS on Graphs

Graphs are collections of nodes connected by edges. BFS and DFS are the two fundamental ways to explore them.

## Graph Representation: Adjacency List

\`\`\`python
# Graph with nodes 0-4
# 0 -- 1 -- 3
# |    |
# 2    4
graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0],
    3: [1],
    4: [1],
}
\`\`\`

## BFS — Breadth-First Search

Explore level by level, like ripples in water. Uses a **queue**.

\`\`\`python
from collections import deque

def bfs(graph, start):
    """Visit all reachable nodes level by level."""
    visited = set([start])
    queue = deque([start])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result
# Time: O(V + E), Space: O(V)
\`\`\`

**Use BFS for**: shortest path (unweighted), level-order, minimum steps.

## DFS — Depth-First Search

Explore as deep as possible, then backtrack. Uses **recursion** or a stack.

\`\`\`python
def dfs(graph, start, visited=None):
    """Visit all reachable nodes, going deep first."""
    if visited is None:
        visited = set()
    visited.add(start)
    result = [start]

    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs(graph, neighbor, visited))

    return result
# Time: O(V + E), Space: O(V)
\`\`\`

**Use DFS for**: path existence, connected components, cycle detection, topological sort.

## Preventing Cycles: The Visited Set

Graphs can have cycles (unlike trees). ALWAYS track visited nodes:

\`\`\`python
visited = set()
# Before processing a node:
if node in visited:
    continue
visited.add(node)
\`\`\`

## Number of Islands (Canonical Example)

\`\`\`python
from collections import deque

def num_islands(grid):
    """Count islands in a 2D grid of '1' (land) and '0' (water)."""
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'    # mark visited
        while queue:
            row, col = queue.popleft()
            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr, nc = row + dr, col + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                bfs(r, c)
                count += 1

    return count
# Time: O(m * n), Space: O(m * n) for queue
\`\`\`

## BFS vs DFS Quick Reference

| | BFS | DFS |
|---|-----|-----|
| Data structure | Queue | Stack / Recursion |
| Explores | Level by level | Deep then backtrack |
| Best for | Shortest path | Path existence, components |
| Space | O(width) | O(depth) |

## Key Takeaway

> BFS for shortest path, DFS for exploring all paths. Always use a visited set for graphs.`,
      codeExample: `from collections import deque

def num_islands(grid: list) -> int:
    """Count connected components of '1's in a grid."""
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'
        while queue:
            row, col = queue.popleft()
            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr, nc = row + dr, col + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                bfs(r, c)
                count += 1
    return count`,
    },
    {
      slug: "dynamic-programming-intro",
      title: "Dynamic Programming Introduction",
      order: 4,
      difficulty: "intermediate",
      estimatedTime: 40,
      content: `# Dynamic Programming Introduction

Dynamic Programming (DP) is the most feared interview topic. But it follows a clear pattern once you understand it.

> [!WARNING]
> ### ⚠️ The 'Wall' Is Real
> Dynamic Programming is where 60% of self-taught learners quit DSA.
>
> Not because it's intellectually impossible, but because it **feels** like magic until it doesn't.
>
> You will stare at the Fibonacci memoization solution and think: "I would never think of that."
> Then you'll solve 5 problems. Then 10. Then suddenly, you see the subproblems everywhere.
>
> The wall is at problem 3-5. Push through it.

> [!TIP]
> 🔗 **Connection to previous lessons:** DP is memoized recursion. If you skipped the Recursion lesson, go back. DP without understanding recursion is like calculus without algebra—technically possible, unnecessarily painful.

## What is DP?

DP = **memoized recursion**. If a problem has overlapping subproblems (same computation repeated), save results to avoid recomputation.

## Fibonacci: The Classic Example

\`\`\`python
# Naive recursion: O(2^n) — exponentially slow
def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n-1) + fib_naive(n-2)

# Top-down (memoization): O(n)
def fib_memo(n, memo={}):
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Bottom-up (tabulation): O(n) time, O(1) space
def fib_tab(n):
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1
\`\`\`

## Top-Down vs Bottom-Up

| Approach | How | Pros | Cons |
|----------|-----|------|------|
| Top-down | Recursion + memo dict | Intuitive, only solves needed subproblems | Stack overflow risk |
| Bottom-up | Iterative + table | No recursion overhead, easy to optimize space | Must figure out order |

## The DP Pattern

1. **Define state**: What variable(s) represent a subproblem?
2. **Write recurrence**: How does the current state relate to smaller states?
3. **Add base cases**: Where does the recursion stop?
4. **Optimize**: Can you reduce space?

## Climbing Stairs

\`\`\`python
def climb_stairs(n):
    """How many ways to climb n stairs (1 or 2 steps at a time)?"""
    # State: dp[i] = number of ways to reach step i
    # Recurrence: dp[i] = dp[i-1] + dp[i-2]
    # Base: dp[0] = 1, dp[1] = 1

    if n <= 1:
        return 1
    prev2, prev1 = 1, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1
# Time: O(n), Space: O(1)
\`\`\`

## Coin Change

\`\`\`python
def coin_change(coins, amount):
    """Minimum coins needed to make amount. -1 if impossible."""
    # State: dp[i] = min coins for amount i
    # Recurrence: dp[i] = min(dp[i - coin] + 1) for each coin
    # Base: dp[0] = 0

    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
# Time: O(amount * len(coins)), Space: O(amount)
\`\`\`

## How to Recognize DP Problems

Ask yourself:
1. Can the problem be broken into smaller subproblems?
2. Do subproblems overlap (same computation repeated)?
3. Keywords: "minimum", "maximum", "number of ways", "can you reach"

If yes → think DP.

## Key Takeaway

> DP is not magic — it's just caching. Define your state, write the recurrence, handle base cases. Start top-down (easier), optimize to bottom-up later.`,
      codeExample: `def climb_stairs(n: int) -> int:
    """Climbing stairs: 1 or 2 steps at a time."""
    if n <= 1:
        return 1
    prev2, prev1 = 1, 1
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1

def coin_change(coins: list, amount: int) -> int:
    """Minimum coins to make amount."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    },
    {
      slug: "heap-priority-queue",
      title: "Heaps & Priority Queues",
      order: 5,
      difficulty: "intermediate",
      estimatedTime: 30,
      content: `# Heaps & Priority Queues

A heap gives you the smallest (or largest) element in O(1) and insert/remove in O(log n). Python's \`heapq\` module implements a min-heap.

## Min-Heap Property

The root is always the smallest element. Every parent is smaller than its children.

\`\`\`
       1
      / \\
     3   2
    / \\
   7   4
\`\`\`

## Python's heapq Module

\`\`\`python
import heapq

# Create a heap
heap = []
heapq.heappush(heap, 5)     # [5]
heapq.heappush(heap, 2)     # [2, 5]
heapq.heappush(heap, 8)     # [2, 5, 8]
heapq.heappush(heap, 1)     # [1, 2, 8, 5]

# Peek at smallest
smallest = heap[0]           # 1 — O(1)

# Pop smallest
val = heapq.heappop(heap)   # 1, heap is now [2, 5, 8]

# Heapify an existing list
nums = [5, 3, 1, 4, 2]
heapq.heapify(nums)         # O(n) — much faster than n pushes
\`\`\`

| Operation | Time |
|-----------|------|
| heappush | O(log n) |
| heappop | O(log n) |
| heap[0] (peek) | O(1) |
| heapify | O(n) |

## Max-Heap Trick

Python only has min-heap. For max-heap, negate the values:

\`\`\`python
import heapq
max_heap = []
heapq.heappush(max_heap, -5)    # store negative
heapq.heappush(max_heap, -2)
heapq.heappush(max_heap, -8)

largest = -heapq.heappop(max_heap)   # negate back: 8
\`\`\`

## K Largest Elements

\`\`\`python
import heapq

def k_largest(nums, k):
    """Return k largest elements using a min-heap of size k."""
    # Maintain a min-heap of size k
    # After processing: heap contains k largest elements
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)    # remove smallest
    return sorted(heap, reverse=True)
# Time: O(n log k), Space: O(k)
\`\`\`

Why min-heap for K largest? Because we keep the K largest by evicting the smallest of our candidates.

## Merge K Sorted Lists

\`\`\`python
import heapq

def merge_k_sorted(lists):
    """Merge k sorted lists into one sorted list."""
    heap = []
    # Push first element of each list: (value, list_index, element_index)
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))

    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        # Push next element from same list
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))

    return result
# Time: O(n log k), Space: O(k)
\`\`\`

## When to Use a Heap

- "K largest / K smallest" → heap
- "Continuously find min/max" → heap
- "Merge K sorted things" → heap
- "Scheduling by priority" → heap

## Heap vs Sorted: When Which?

- Need min/max **once**? → just use \`min()\`/\`max()\` — O(n)
- Need min/max **repeatedly** after insertions? → **heap** — O(log n) per operation
- Need all elements sorted? → \`sorted()\` — O(n log n) once

## Key Takeaway

> Heap = efficient repeated min/max access. Use Python's \`heapq\` (min-heap). Negate values for max-heap. K largest = min-heap of size K.`,
      codeExample: `import heapq

def k_largest(nums: list, k: int) -> list:
    """Return k largest elements using a min-heap."""
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(heap, reverse=True)

print(k_largest([3, 1, 5, 12, 2, 11], 3))  # [12, 11, 5]`,
    },
  ];

  for (const l of course3Lessons) {
    await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {},
      create: { ...l, courseId: course3.id },
    });
    console.log(`    ✓ Lesson: ${l.title}`);
  }

  console.log("\n  ✅ Seeded 3 courses with 15 lessons");
}

// Allow running standalone
if (require.main === module) {
  seedCoursesAndLessons()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
