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
  // ─── Phase 0: Absolute Beginner (used by python-foundations sessions) ─────────
  {
    slug: "hello-world",
    title: "Hello World",
    description:
      "Write a function `say_hello()` that returns the string `'Hello, World!'`.\n\nThis is your very first function — the tradition every programmer follows!",
    difficulty: "easy",
    pattern: "basic-io",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Basic IO",
    starterCode: `def say_hello() -> str:
    # Return the string 'Hello, World!'
    pass

print(say_hello())`,
    solutionCode: `def say_hello() -> str:
    return 'Hello, World!'

print(say_hello())`,
    testCases: JSON.stringify([
      { input: {}, expectedOutput: "Hello, World!" },
    ]),
    hiddenTestCases: JSON.stringify([]),
    hints: JSON.stringify([
      "Use the return keyword to send back a value from the function.",
      "Text in Python is wrapped in quotes: 'Hello, World!'",
    ]),
  },
  {
    slug: "sum-two-numbers",
    title: "Sum Two Numbers",
    description:
      "Write a function `add(a, b)` that takes two numbers and returns their sum.\n\nExample:\n- add(2, 3) → 5\n- add(-1, 1) → 0",
    difficulty: "easy",
    pattern: "basic-io",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Basic IO",
    starterCode: `def add(a: int, b: int) -> int:
    # Return a + b
    pass

import json, sys
data = json.loads(sys.stdin.read().strip())
print(add(data['a'], data['b']))`,
    solutionCode: `def add(a: int, b: int) -> int:
    return a + b

import json, sys
data = json.loads(sys.stdin.read().strip())
print(add(data['a'], data['b']))`,
    testCases: JSON.stringify([
      { input: { a: 2, b: 3 }, expectedOutput: 5 },
      { input: { a: -1, b: 1 }, expectedOutput: 0 },
      { input: { a: 0, b: 0 }, expectedOutput: 0 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { a: 100, b: 200 }, expectedOutput: 300 },
    ]),
    hints: JSON.stringify([
      "Use the + operator to add two numbers.",
      "The return keyword sends the result back to the caller.",
    ]),
  },
  {
    slug: "is-prime",
    title: "Is Prime?",
    description:
      "Write a function `is_prime(n)` that returns `True` if `n` is a prime number, and `False` otherwise.\n\nA prime number is a number greater than 1 that has no divisors other than 1 and itself.\n\nExamples:\n- is_prime(2) → True\n- is_prime(4) → False\n- is_prime(13) → True",
    difficulty: "easy",
    pattern: "loops",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(√n)",
    spaceComplexity: "O(1)",
    correctPattern: "Loops",
    starterCode: `def is_prime(n: int) -> bool:
    # Return True if n is prime, False otherwise
    pass

import sys
n = int(sys.stdin.read().strip())
print(is_prime(n))`,
    solutionCode: `def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

import sys
n = int(sys.stdin.read().strip())
print(is_prime(n))`,
    testCases: JSON.stringify([
      { input: { n: 2 }, expectedOutput: true },
      { input: { n: 4 }, expectedOutput: false },
      { input: { n: 13 }, expectedOutput: true },
      { input: { n: 1 }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { n: 0 }, expectedOutput: false },
      { input: { n: 97 }, expectedOutput: true },
    ]),
    hints: JSON.stringify([
      "Any number less than 2 is not prime.",
      "Check divisibility from 2 up to the square root of n using a for loop.",
      "If n % i == 0 for any i in that range, it's not prime.",
    ]),
  },
  {
    slug: "validate-bst",
    title: "Validate Binary Search Tree",
    description:
      "Given a Binary Search Tree represented as a list of values inserted in order, write a function `is_valid_bst(values)` that verifies the BST property holds.\n\nBST property: for every node, LEFT < PARENT < RIGHT.\n\nReturn `True` if valid, `False` otherwise.\n\nHint: Check that the in-order traversal of the BST gives a strictly increasing sequence.\n\nExample:\n- is_valid_bst([50, 25, 75, 10, 30]) → True\n- is_valid_bst([50, 25, 75, 80]) → False (80 > 75 but was inserted left)",
    difficulty: "medium",
    pattern: "tree",
    category: "trees",
    phase: 1,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "DFS",
    starterCode: `def is_valid_bst(values: list) -> bool:
    """
    Build a BST from the values list and verify it satisfies
    the BST property at every node.
    
    Example:
        is_valid_bst([50, 25, 75]) -> True
    """
    pass

import json, sys
values = json.loads(sys.stdin.read().strip())
print(is_valid_bst(values))`,
    solutionCode: `def is_valid_bst(values: list) -> bool:
    class Node:
        def __init__(self, val):
            self.val = val
            self.left = None
            self.right = None

    def insert(root, val):
        if root is None:
            return Node(val)
        if val < root.val:
            root.left = insert(root.left, val)
        else:
            root.right = insert(root.right, val)
        return root

    def inorder(root, result):
        if root is None:
            return
        inorder(root.left, result)
        result.append(root.val)
        inorder(root.right, result)

    if not values:
        return True
    root = None
    for v in values:
        root = insert(root, v)
    result = []
    inorder(root, result)
    return result == sorted(set(result)) and len(result) == len(set(result))

import json, sys
values = json.loads(sys.stdin.read().strip())
print(is_valid_bst(values))`,
    testCases: JSON.stringify([
      { input: { values: [50, 25, 75, 10, 30] }, expectedOutput: true },
      { input: { values: [1, 2, 3] }, expectedOutput: true },
      { input: { values: [5] }, expectedOutput: true },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { values: [] }, expectedOutput: true },
      { input: { values: [10, 5, 15, 3, 7] }, expectedOutput: true },
    ]),
    hints: JSON.stringify([
      "Build the BST first by inserting each value using the BST rule (smaller goes left, larger goes right).",
      "In-order traversal of a valid BST always gives values in strictly ascending order.",
      "Check that your in-order result is sorted and has no duplicates.",
    ]),
  },
  {
    slug: "hello-world-personalized",
    title: "Personalized Hello World",
    description: "Write a function `greet(name)` that returns a personalized greeting in the format: 'Hello, [name]!'.",
    difficulty: "easy",
    pattern: "basic-io",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Basic IO",
    starterCode: `def greet(name: str) -> str:
    # Return "Hello, [name]!"
    pass

import sys
name = sys.stdin.read().strip()
print(greet(name))`,
    solutionCode: `def greet(name: str) -> str:
    return f"Hello, {name}!"

import sys
name = sys.stdin.read().strip()
print(greet(name))`,
    testCases: JSON.stringify([
      { input: "Vani", expected: "Hello, Vani!" },
      { input: "Python", expected: "Hello, Python!" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "AlgoRich", expected: "Hello, AlgoRich!" },
    ]),
    hints: JSON.stringify(["Use an f-string to combine 'Hello, ', the name, and '!'."]),
  },
  {
    slug: "type-converter",
    title: "The Type Converter",
    description: "Write a function `get_types(val)` that returns the string representation of the type of the given value (e.g., \"<class 'int'>\").",
    difficulty: "easy",
    pattern: "data-types",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Data Types",
    starterCode: `def get_types(val) -> str:
    # Return str(type(val))
    pass

import json, sys
val = json.loads(sys.stdin.read().strip())
print(get_types(val))`,
    solutionCode: `def get_types(val) -> str:
    return str(type(val))

import json, sys
val = json.loads(sys.stdin.read().strip())
print(get_types(val))`,
    testCases: JSON.stringify([
      { input: '"Vani"', expected: "<class 'str'>" },
      { input: "20", expected: "<class 'int'>" },
      { input: "3.9", expected: "<class 'float'>" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "True", expected: "<class 'bool'>" },
    ]),
    hints: JSON.stringify(["The type() function returns a type object; use str() to convert it to a string for comparison."]),
  },
  {
    slug: "reverse-string",
    title: "Reverse a String",
    description: "Given a string, return the reversed version of that string.",
    difficulty: "easy",
    pattern: "strings",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Slicing",
    starterCode: `def reverse_string(s: str) -> str:
    pass

import sys
s = sys.stdin.read().strip()
print(reverse_string(s))`,
    solutionCode: `def reverse_string(s: str) -> str:
    return s[::-1]

import sys
s = sys.stdin.read().strip()
print(reverse_string(s))`,
    testCases: JSON.stringify([
      { input: "hello", expected: "olleh" },
      { input: "Python", expected: "nohtyP" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "a", expected: "a" },
    ]),
    hints: JSON.stringify(["Python's slicing syntax [start:stop:step] with a step of -1 reverses the sequence."]),
  },
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    description: "Return 'Fizz' if a number is divisible by 3, 'Buzz' if divisible by 5, and 'FizzBuzz' if divisible by both. Otherwise, return the number as a string.",
    difficulty: "easy",
    pattern: "conditionals",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Conditionals",
    starterCode: `def fizzbuzz(n: int) -> str:
    pass

import sys
n = int(sys.stdin.read().strip())
print(fizzbuzz(n))`,
    solutionCode: `def fizzbuzz(n: int) -> str:
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return str(n)

import sys
n = int(sys.stdin.read().strip())
print(fizzbuzz(n))`,
    testCases: JSON.stringify([
      { input: "3", expected: "Fizz" },
      { input: "5", expected: "Buzz" },
      { input: "15", expected: "FizzBuzz" },
      { input: "7", expected: "7" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "30", expected: "FizzBuzz" },
    ]),
    hints: JSON.stringify(["Use the modulo operator (%) to check for divisibility.", "Order matters: check for 15 (both) first!"]),
  },
  {
    slug: "sum-of-digits",
    title: "Sum of Digits",
    description: "Given a positive integer, return the sum of its digits using a while loop.",
    difficulty: "easy",
    pattern: "loops",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    correctPattern: "While Loop",
    starterCode: `def sum_digits(n: int) -> int:
    pass

import sys
n = int(sys.stdin.read().strip())
print(sum_digits(n))`,
    solutionCode: `def sum_digits(n: int) -> int:
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

import sys
n = int(sys.stdin.read().strip())
print(sum_digits(n))`,
    testCases: JSON.stringify([
      { input: "123", expected: "6" },
      { input: "456", expected: "15" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "1001", expected: "2" },
    ]),
    hints: JSON.stringify(["Use n % 10 to get the last digit.", "Use n //= 10 to remove the last digit."]),
  },
  {
    slug: "count-vowels",
    title: "Count Vowels",
    description: "Count the number of vowels (a, e, i, o, u) in a given string. Ignore case.",
    difficulty: "easy",
    pattern: "loops",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "For Loop",
    starterCode: `def count_vowels(s: str) -> int:
    pass

import sys
s = sys.stdin.read().strip()
print(count_vowels(s))`,
    solutionCode: `def count_vowels(s: str) -> int:
    count = 0
    vowels = "aeiou"
    for char in s.lower():
        if char in vowels:
            count += 1
    return count

import sys
s = sys.stdin.read().strip()
print(count_vowels(s))`,
    testCases: JSON.stringify([
      { input: "hello", expected: "2" },
      { input: "Python", expected: "1" },
      { input: "AEIOU", expected: "5" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "xyz", expected: "0" },
    ]),
    hints: JSON.stringify(["Convert the string to lowercase first using .lower() then iterate through it."]),
  },
  {
    slug: "two-sum-hashmap",
    title: "Two Sum (Optimized)",
    description: "Given an array of integers and a target, find the indices of the two numbers that add up to the target using a dictionary for O(n) time.",
    difficulty: "easy",
    pattern: "hash-map",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "HashMap",
    starterCode: `def two_sum(nums: list, target: int) -> list:
    pass

import json, sys
data = json.loads(sys.stdin.read().strip())
print(json.dumps(two_sum(data['nums'], data['target'])))`,
    solutionCode: `def two_sum(nums: list, target: int) -> list:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

import json, sys
data = json.loads(sys.stdin.read().strip())
print(json.dumps(two_sum(data['nums'], data['target'])))`,
    testCases: JSON.stringify([
      { input: '{"nums": [2, 7, 11, 15], "target": 9}', expected: "[0, 1]" },
      { input: '{"nums": [3, 2, 4], "target": 6}', expected: "[1, 2]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"nums": [3, 3], "target": 6}', expected: "[0, 1]" },
    ]),
    hints: JSON.stringify(["Use a dictionary to store the values you've already seen as keys and their indices as values."]),
  },
  {
    slug: "palindrome-check",
    title: "Palindrome Check",
    description: "Check if a given string is a palindrome. Ignore case and non-alphanumeric characters.",
    difficulty: "easy",
    pattern: "strings",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Two Pointers",
    starterCode: `def is_palindrome(s: str) -> bool:
    pass

import sys
s = sys.stdin.read().strip()
print(is_palindrome(s))`,
    solutionCode: `def is_palindrome(s: str) -> bool:
    s = "".join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]

import sys
s = sys.stdin.read().strip()
print(is_palindrome(s))`,
    testCases: JSON.stringify([
      { input: "racecar", expected: "True" },
      { input: '"A man, a plan, a canal: Panama"', expected: "True" },
      { input: "hello", expected: "False" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '""', expected: "True" },
    ]),
    hints: JSON.stringify(["Filter the string using .isalnum() and .lower() before checking the reverse."]),
  },
  {
    slug: "find-second-largest",
    title: "Find Second Largest",
    description: "Given a list of numbers, find the second largest unique number. Return None if it doesn't exist.",
    difficulty: "easy",
    pattern: "arrays",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctPattern: "Sorting",
    starterCode: `def second_largest(nums: list):
    pass

import json, sys
nums = json.loads(sys.stdin.read().strip())
print(second_largest(nums))`,
    solutionCode: `def second_largest(nums: list):
    unique_nums = list(set(nums))
    if len(unique_nums) < 2: return None
    unique_nums.sort(reverse=True)
    return unique_nums[1]

import json, sys
nums = json.loads(sys.stdin.read().strip())
print(second_largest(nums))`,
    testCases: JSON.stringify([
      { input: "[10, 5, 20, 20, 8]", expected: "10" },
      { input: "[1, 2, 3]", expected: "2" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: "[1]", expected: "None" },
    ]),
    hints: JSON.stringify(["Use set() to remove duplicates, then sort in descending order and pick the second element."]),
  },
  {
    slug: "safe-list-access",
    title: "Safe List Access",
    description: "Write a function `safe_get(lst, index)` that returns the element at a given index. If the index is out of range, return 'Out of Bounds' using try-except.",
    difficulty: "easy",
    pattern: "error-handling",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Error Handling",
    starterCode: `def safe_get(lst: list, index: int):
    pass

import json, sys
data = json.loads(sys.stdin.read().strip())
print(safe_get(data['lst'], data['index']))`,
    solutionCode: `def safe_get(lst: list, index: int):
    try:
        return lst[index]
    except IndexError:
        return "Out of Bounds"

import json, sys
data = json.loads(sys.stdin.read().strip())
print(safe_get(data['lst'], data['index']))`,
    testCases: JSON.stringify([
      { input: '{"lst": [1, 2, 3], "index": 1}', expected: "2" },
      { input: '{"lst": [1, 2, 3], "index": 5}', expected: '"Out of Bounds"' },
    ]),
    hiddenTestCases: JSON.stringify([]),
    hints: JSON.stringify(["Wrap the list access in a try block and catch IndexError."]),
  },
  {
    slug: "word-count-from-string",
    title: "Word Count",
    description: "Count the occurrences of each word in a string and return a dictionary.",
    difficulty: "easy",
    pattern: "hash-map",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "HashMap",
    starterCode: `def word_count(s: str) -> dict:
    pass

import json, sys
s = sys.stdin.read().strip()
print(json.dumps(word_count(s), sort_keys=True))`,
    solutionCode: `def word_count(s: str) -> dict:
    counts = {}
    for word in s.split():
        counts[word] = counts.get(word, 0) + 1
    return counts

import json, sys
s = sys.stdin.read().strip()
print(json.dumps(word_count(s), sort_keys=True))`,
    testCases: JSON.stringify([
      { input: "hello world hello", expected: '{"hello": 2, "world": 1}' },
      { input: "apple banana apple", expected: '{"apple": 2, "banana": 1}' },
    ]),
    hiddenTestCases: JSON.stringify([]),
    hints: JSON.stringify(["Use .split() to get a list of words, then iterate and update count in a dict."]),
  },
  {
    slug: "todo-cli-app",
    title: "To-Do CLI Logic",
    description: "Implement core logic for a To-Do list: add tasks and mark as done.",
    difficulty: "medium",
    pattern: "foundations",
    category: "foundations",
    phase: 0,
    weekNumber: 0,
    timeComplexity: "O(k)",
    spaceComplexity: "O(n)",
    correctPattern: "Mini-Project",
    starterCode: `def manage_todo(actions: list) -> list:
    # actions: [{"type": "add", "task": str}, {"type": "done", "id": int}]
    pass

import json, sys
actions = json.loads(sys.stdin.read().strip())
print(json.dumps(manage_todo(actions)))`,
    solutionCode: `def manage_todo(actions: list) -> list:
    tasks = []
    for action in actions:
        if action['type'] == 'add':
            tasks.append({"id": len(tasks) + 1, "task": action['task'], "done": False})
        elif action['type'] == 'done':
            for t in tasks:
                if t['id'] == action['id']:
                    t['done'] = True
    return tasks

import json, sys
actions = json.loads(sys.stdin.read().strip())
print(json.dumps(manage_todo(actions)))`,
    testCases: JSON.stringify([
      { input: '[{"type": "add", "task": "Buy milk"}, {"type": "done", "id": 1}]', expected: '[{"done": true, "id": 1, "task": "Buy milk"}]' },
    ]),
    hiddenTestCases: JSON.stringify([]),
    hints: JSON.stringify(["Iterate through actions. For 'add', append a new dict. For 'done', find the dict with matching id."]),
  },
];

export async function seedFoundations() {
  console.log("🌱 Seeding foundations...");
  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: {
        ...problem,
      },
      create: {
        ...problem,
      },
    });
  }
}

if (require.main === module) {
  seedFoundations()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
