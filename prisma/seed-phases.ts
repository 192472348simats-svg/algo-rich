import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════
// PHASE 1: Python Foundations (12 problems)
// ═══════════════════════════════════════════════════════════

const phase1Problems = [
  {
    slug: "hello-world",
    title: "Your First Python Program",
    description:
      "**Print \"Hello, World!\" to the screen.**\n\nThis is the classic first program every developer writes. Your function should return the string `\"Hello, World!\"`.",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 1,
    starterCode: 'def hello_world():\n    # Return the greeting "Hello, World!"\n    pass',
    solutionCode: 'def hello_world():\n    return "Hello, World!"',
    testCases: JSON.stringify([
      { input: {}, expectedOutput: "Hello, World!" },
    ]),
    solutionApproach: 'Return the string "Hello, World!" directly.',
    conceptTaught: "print, strings, return",
    order: 1,
    topicOrder: 1,
  },
  {
    slug: "sum-two-numbers",
    title: "Sum Two Numbers",
    description:
      "**Given two numbers `a` and `b`, return their sum.**\n\nThis teaches you that functions receive inputs (parameters) and produce outputs (return values).\n\n**Examples:**\n- `sum_two(3, 5)` → `8`\n- `sum_two(-1, 1)` → `0`",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 1,
    starterCode: "def sum_two(a, b):\n    # Return the sum of a and b\n    pass",
    solutionCode: "def sum_two(a, b):\n    return a + b",
    testCases: JSON.stringify([
      { input: { a: 3, b: 5 }, expectedOutput: 8 },
      { input: { a: -1, b: 1 }, expectedOutput: 0 },
      { input: { a: 0, b: 0 }, expectedOutput: 0 },
    ]),
    solutionApproach: "Return a + b directly.",
    conceptTaught: "variables, arithmetic, return",
    order: 2,
    topicOrder: 2,
  },
  {
    slug: "even-or-odd",
    title: "Even or Odd",
    description:
      '**Given a number `n`, return `"Even"` if it is even, `"Odd"` if it is odd.**\n\nUse the modulo operator `%` — it gives the remainder of a division.\n\n**Examples:**\n- `even_or_odd(4)` → `"Even"`\n- `even_or_odd(7)` → `"Odd"`',
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 1,
    starterCode:
      'def even_or_odd(n):\n    # Return "Even" or "Odd"\n    pass',
    solutionCode:
      'def even_or_odd(n):\n    if n % 2 == 0:\n        return "Even"\n    return "Odd"',
    testCases: JSON.stringify([
      { input: { n: 4 }, expectedOutput: "Even" },
      { input: { n: 7 }, expectedOutput: "Odd" },
      { input: { n: 0 }, expectedOutput: "Even" },
    ]),
    solutionApproach:
      "Use the modulo operator (%). If n % 2 == 0, it's even, otherwise odd.",
    conceptTaught: "if/else, modulo operator",
    order: 3,
    topicOrder: 3,
  },
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    description:
      '**Given a number `n`, return:**\n- `"FizzBuzz"` if divisible by both 3 and 5\n- `"Fizz"` if only divisible by 3\n- `"Buzz"` if only divisible by 5\n- The number as a string otherwise\n\n**Tip:** Check FizzBuzz FIRST (both conditions), then Fizz, then Buzz.',
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 1,
    starterCode: "def fizzbuzz(n):\n    # Your logic here\n    pass",
    solutionCode:
      'def fizzbuzz(n):\n    if n % 15 == 0:\n        return "FizzBuzz"\n    if n % 3 == 0:\n        return "Fizz"\n    if n % 5 == 0:\n        return "Buzz"\n    return str(n)',
    testCases: JSON.stringify([
      { input: { n: 3 }, expectedOutput: "Fizz" },
      { input: { n: 5 }, expectedOutput: "Buzz" },
      { input: { n: 15 }, expectedOutput: "FizzBuzz" },
      { input: { n: 7 }, expectedOutput: "7" },
    ]),
    solutionApproach:
      "Check FizzBuzz FIRST (both conditions), then Fizz, then Buzz, then default.",
    conceptTaught: "if/elif/else, order of conditions, modulo",
    order: 4,
    topicOrder: 4,
  },
  {
    slug: "celsius-to-fahrenheit",
    title: "Temperature Converter",
    description:
      "**Convert a list of Celsius temperatures to Fahrenheit.**\n\nFormula: `F = C * 9/5 + 32`\n\nReturn a list of the converted temperatures.\n\n**Examples:**\n- `convert_temps([0, 100])` → `[32.0, 212.0]`\n- `convert_temps([-40])` → `[-40.0]`",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 1,
    starterCode:
      "def convert_temps(celsius_list):\n    # Return list of Fahrenheit temperatures\n    pass",
    solutionCode:
      "def convert_temps(celsius_list):\n    return [c * 9/5 + 32 for c in celsius_list]",
    testCases: JSON.stringify([
      { input: { celsius_list: [0, 100] }, expectedOutput: [32.0, 212.0] },
      { input: { celsius_list: [-40] }, expectedOutput: [-40.0] },
      { input: { celsius_list: [] }, expectedOutput: [] },
    ]),
    solutionApproach:
      "Loop through list, apply formula to each. Append to result list or use list comprehension.",
    conceptTaught: "list building, arithmetic, list comprehension",
    order: 5,
    topicOrder: 5,
  },
  {
    slug: "sum-list",
    title: "Sum of a List",
    description:
      "**Given a list of numbers, return the sum WITHOUT using the built-in `sum()` function.**\n\nThis teaches the **accumulator pattern** — a core building block you'll use everywhere.\n\n**Examples:**\n- `sum_list([1, 2, 3, 4, 5])` → `15`\n- `sum_list([])` → `0`",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 2,
    starterCode:
      "def sum_list(nums):\n    # Add up all numbers without using sum()\n    pass",
    solutionCode:
      "def sum_list(nums):\n    total = 0\n    for num in nums:\n        total += num\n    return total",
    testCases: JSON.stringify([
      { input: { nums: [1, 2, 3, 4, 5] }, expectedOutput: 15 },
      { input: { nums: [] }, expectedOutput: 0 },
      { input: { nums: [-1, 1] }, expectedOutput: 0 },
    ]),
    solutionApproach:
      "Initialize total = 0. Loop through each number, add it to total. Return total.",
    conceptTaught: "for loops, accumulator pattern",
    order: 6,
    topicOrder: 6,
  },
  {
    slug: "count-vowels",
    title: "Count Vowels",
    description:
      '**Given a string, count how many vowels (a, e, i, o, u) it contains.**\n\nVowels are case-insensitive — count both uppercase and lowercase.\n\n**Examples:**\n- `count_vowels("hello")` → `2`\n- `count_vowels("aeiou")` → `5`',
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 2,
    starterCode:
      "def count_vowels(s):\n    # Count the vowels in string s\n    pass",
    solutionCode:
      'def count_vowels(s):\n    count = 0\n    for char in s.lower():\n        if char in "aeiou":\n            count += 1\n    return count',
    testCases: JSON.stringify([
      { input: { s: "hello" }, expectedOutput: 2 },
      { input: { s: "python" }, expectedOutput: 1 },
      { input: { s: "aeiou" }, expectedOutput: 5 },
      { input: { s: "xyz" }, expectedOutput: 0 },
    ]),
    solutionApproach:
      'Loop through each character. If it\'s in "aeiou", increment counter.',
    conceptTaught: "string iteration, in operator, counter",
    order: 7,
    topicOrder: 7,
  },
  {
    slug: "reverse-string-basic",
    title: "Reverse a String",
    description:
      '**Given a string, return it reversed.**\n\nYou can use Python slicing `[::-1]` or build the result manually.\n\n**Examples:**\n- `reverse_string("hello")` → `"olleh"`\n- `reverse_string("a")` → `"a"`',
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 2,
    starterCode:
      "def reverse_string(s):\n    # Return the reversed string\n    pass",
    solutionCode: "def reverse_string(s):\n    return s[::-1]",
    testCases: JSON.stringify([
      { input: { s: "hello" }, expectedOutput: "olleh" },
      { input: { s: "python" }, expectedOutput: "nohtyp" },
      { input: { s: "a" }, expectedOutput: "a" },
      { input: { s: "" }, expectedOutput: "" },
    ]),
    solutionApproach:
      "Build result from end to start using a loop, or use s[::-1] slicing.",
    conceptTaught: "string slicing, reverse iteration",
    order: 8,
    topicOrder: 8,
  },
  {
    slug: "find-maximum",
    title: "Find the Maximum",
    description:
      "**Given a list of numbers, return the largest one WITHOUT using `max()`.**\n\nThis teaches the **\"best so far\" pattern** — track the current best as you scan.\n\n**Examples:**\n- `find_maximum([3, 1, 4, 1, 5, 9, 2])` → `9`\n- `find_maximum([-1, -5, -2])` → `-1`",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 2,
    starterCode:
      "def find_maximum(nums):\n    # Return the largest number\n    pass",
    solutionCode:
      "def find_maximum(nums):\n    best = nums[0]\n    for num in nums[1:]:\n        if num > best:\n            best = num\n    return best",
    testCases: JSON.stringify([
      { input: { nums: [3, 1, 4, 1, 5, 9, 2] }, expectedOutput: 9 },
      { input: { nums: [-1, -5, -2] }, expectedOutput: -1 },
      { input: { nums: [42] }, expectedOutput: 42 },
    ]),
    solutionApproach:
      'Initialize max_val = nums[0]. Loop through rest, update if current > max_val.',
    conceptTaught: '"best so far" pattern, initializing from first element',
    order: 9,
    topicOrder: 9,
  },
  {
    slug: "count-occurrences",
    title: "Count Occurrences",
    description:
      "**Given a list and a target value, count how many times the target appears.**\n\nDo NOT use the built-in `.count()` method.\n\n**Examples:**\n- `count_occurrences([1, 2, 3, 2, 1, 2], 2)` → `3`\n- `count_occurrences([1, 2, 3], 4)` → `0`",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 2,
    starterCode:
      "def count_occurrences(arr, target):\n    # Count how many times target appears in arr\n    pass",
    solutionCode:
      "def count_occurrences(arr, target):\n    count = 0\n    for item in arr:\n        if item == target:\n            count += 1\n    return count",
    testCases: JSON.stringify([
      { input: { arr: [1, 2, 3, 2, 1, 2], target: 2 }, expectedOutput: 3 },
      { input: { arr: [1, 1, 1], target: 1 }, expectedOutput: 3 },
      { input: { arr: [1, 2, 3], target: 4 }, expectedOutput: 0 },
    ]),
    solutionApproach:
      "Counter variable. Loop through array. If element equals target, increment counter.",
    conceptTaught: "counter pattern, equality check",
    order: 10,
    topicOrder: 10,
  },
  {
    slug: "is-prime",
    title: "Is Prime?",
    description:
      "**Given a number `n`, return `True` if it is prime, `False` otherwise.**\n\nA prime number is only divisible by 1 and itself. Note: 1 is NOT prime.\n\n**Examples:**\n- `is_prime(7)` → `True`\n- `is_prime(10)` → `False`\n- `is_prime(1)` → `False`",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 3,
    starterCode:
      "def is_prime(n):\n    # Return True if n is prime, False otherwise\n    pass",
    solutionCode:
      "def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True",
    testCases: JSON.stringify([
      { input: { n: 7 }, expectedOutput: true },
      { input: { n: 10 }, expectedOutput: false },
      { input: { n: 1 }, expectedOutput: false },
      { input: { n: 2 }, expectedOutput: true },
    ]),
    solutionApproach:
      "Check if any number from 2 to sqrt(n) divides n evenly. If yes, not prime.",
    conceptTaught: "loops, early return, math (sqrt)",
    order: 11,
    topicOrder: 11,
  },
  {
    slug: "word-frequency",
    title: "Word Frequency Counter",
    description:
      "**Given a list of words, return a dictionary with each word's count.**\n\nThis teaches the **frequency counting pattern** — a fundamental technique used everywhere in DSA.\n\n**Examples:**\n- `word_frequency([\"apple\", \"banana\", \"apple\"])` → `{\"apple\": 2, \"banana\": 1}`",
    difficulty: "easy",
    category: "python-basics",
    phase: 1,
    weekNumber: 4,
    starterCode:
      "def word_frequency(words):\n    # Count how many times each word appears\n    pass",
    solutionCode:
      "def word_frequency(words):\n    freq = {}\n    for word in words:\n        freq[word] = freq.get(word, 0) + 1\n    return freq",
    testCases: JSON.stringify([
      {
        input: { words: ["apple", "banana", "apple"] },
        expectedOutput: { apple: 2, banana: 1 },
      },
      { input: { words: ["hi", "hi", "hi"] }, expectedOutput: { hi: 3 } },
      { input: { words: [] }, expectedOutput: {} },
    ]),
    solutionApproach:
      "Create empty dict. For each word, use dict.get(word, 0) + 1 to increment.",
    conceptTaught: "dictionary, get() with default, frequency counting",
    order: 12,
    topicOrder: 12,
  },
];

// ═══════════════════════════════════════════════════════════
// PHASE 2: Logic Building (6 problems)
// ═══════════════════════════════════════════════════════════

const phase2Problems = [
  {
    slug: "two-sum-brute",
    title: "Two Sum — Find the Logic",
    description:
      "**Given an array of integers and a target, find two numbers that add up to the target. Return their indices.**\n\nDon't worry about speed — try every possible pair! This is called the **brute force** approach.\n\n**The 5-Step Framework:**\n1. UNDERSTAND: We need two numbers whose sum equals target\n2. EXAMPLES: Work through [2,7,11,15] target=9 by hand\n3. APPROACH: Compare every pair\n4. CODE: Two nested loops\n5. TEST: What if no pair exists?\n\n**Examples:**\n- `two_sum([2, 7, 11, 15], 9)` → `[0, 1]`",
    difficulty: "easy",
    category: "logic-building",
    phase: 2,
    weekNumber: 5,
    starterCode:
      "def two_sum(nums, target):\n    # Try every possible pair\n    # For each number, check if there's another that adds to target\n    pass",
    solutionCode:
      "def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []",
    testCases: JSON.stringify([
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
    ]),
    solutionApproach:
      "Use two nested loops. For each pair (i, j) where j > i, check if nums[i] + nums[j] == target.",
    conceptTaught: "nested loops, all-pairs pattern, returning early",
    order: 13,
    topicOrder: 101,
  },
  {
    slug: "find-missing-basic",
    title: "Find the Missing Number",
    description:
      "**Given a list containing n numbers from 0 to n with one number missing, find the missing number.**\n\nThink mathematically: what *should* the total sum be vs what it actually is?\n\n**Examples:**\n- `find_missing([3, 0, 1])` → `2` (numbers 0-3, missing 2)\n- `find_missing([0, 1])` → `2`",
    difficulty: "easy",
    category: "logic-building",
    phase: 2,
    weekNumber: 5,
    starterCode:
      "def find_missing(nums):\n    # Step 1: What should the total sum be?\n    # Step 2: What is the actual sum?\n    # Step 3: The difference is the missing number\n    pass",
    solutionCode:
      "def find_missing(nums):\n    n = len(nums)\n    expected = n * (n + 1) // 2\n    actual = sum(nums)\n    return expected - actual",
    testCases: JSON.stringify([
      { input: { nums: [3, 0, 1] }, expectedOutput: 2 },
      { input: { nums: [0, 1] }, expectedOutput: 2 },
      { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, expectedOutput: 8 },
    ]),
    solutionApproach:
      "Expected sum = n*(n+1)/2. Subtract actual sum. The difference is the missing number.",
    conceptTaught: "math reasoning, sum formula, problem decomposition",
    order: 14,
    topicOrder: 102,
  },
  {
    slug: "remove-duplicates-basic",
    title: "Remove Duplicates",
    description:
      "**Given a list, return a new list with all duplicates removed, keeping first occurrence.**\n\nDon't use `set()` — practice the logic of tracking what you've seen.\n\n**Examples:**\n- `remove_duplicates([1, 2, 2, 3, 3, 3])` → `[1, 2, 3]`\n- `remove_duplicates([4, 4, 4, 4])` → `[4]`",
    difficulty: "easy",
    category: "logic-building",
    phase: 2,
    weekNumber: 6,
    starterCode:
      "def remove_duplicates(nums):\n    # Build a result list\n    # Only add a number if you haven't seen it before\n    pass",
    solutionCode:
      "def remove_duplicates(nums):\n    seen = []\n    result = []\n    for num in nums:\n        if num not in seen:\n            seen.append(num)\n            result.append(num)\n    return result",
    testCases: JSON.stringify([
      { input: { nums: [1, 2, 2, 3, 3, 3] }, expectedOutput: [1, 2, 3] },
      { input: { nums: [4, 4, 4, 4] }, expectedOutput: [4] },
      { input: { nums: [1, 2, 3] }, expectedOutput: [1, 2, 3] },
    ]),
    solutionApproach:
      'Keep a "seen" list. For each element, add to result only if not already in seen.',
    conceptTaught: "tracking seen elements, in operator, building result",
    order: 15,
    topicOrder: 103,
  },
  {
    slug: "anagram-check-basic",
    title: "Are They Anagrams?",
    description:
      '**Given two strings, return True if one is an anagram of the other** (same characters, different order).\n\nBreak this into sub-problems:\n1. Are the lengths equal?\n2. Does each character appear the same number of times?\n\n**Examples:**\n- `is_anagram("listen", "silent")` → `True`\n- `is_anagram("hello", "world")` → `False`',
    difficulty: "easy",
    category: "logic-building",
    phase: 2,
    weekNumber: 6,
    starterCode:
      "def is_anagram(s1, s2):\n    # Step 1: Check lengths\n    # Step 2: Count characters in each\n    # Step 3: Compare the counts\n    pass",
    solutionCode:
      "def is_anagram(s1, s2):\n    if len(s1) != len(s2):\n        return False\n    count1 = {}\n    count2 = {}\n    for c in s1:\n        count1[c] = count1.get(c, 0) + 1\n    for c in s2:\n        count2[c] = count2.get(c, 0) + 1\n    return count1 == count2",
    testCases: JSON.stringify([
      { input: { s1: "listen", s2: "silent" }, expectedOutput: true },
      { input: { s1: "hello", s2: "world" }, expectedOutput: false },
      { input: { s1: "rat", s2: "tar" }, expectedOutput: true },
    ]),
    solutionApproach:
      "Count character frequencies in both strings using dicts. Compare the dicts.",
    conceptTaught: "dict comparison, character counting, problem decomposition",
    order: 16,
    topicOrder: 104,
  },
  {
    slug: "matrix-diagonal-sum",
    title: "Matrix Diagonal Sum",
    description:
      "**Given a square matrix (list of lists), return the sum of its main diagonal elements.**\n\nThe main diagonal is where row index equals column index: `matrix[0][0]`, `matrix[1][1]`, `matrix[2][2]`, etc.\n\n**Examples:**\n- `diagonal_sum([[1,2,3],[4,5,6],[7,8,9]])` → `15` (1+5+9)",
    difficulty: "easy",
    category: "logic-building",
    phase: 2,
    weekNumber: 7,
    starterCode:
      "def diagonal_sum(matrix):\n    # The main diagonal is where row index == column index\n    pass",
    solutionCode:
      "def diagonal_sum(matrix):\n    total = 0\n    for i in range(len(matrix)):\n        total += matrix[i][i]\n    return total",
    testCases: JSON.stringify([
      {
        input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
        expectedOutput: 15,
      },
      { input: { matrix: [[1, 2], [3, 4]] }, expectedOutput: 5 },
      { input: { matrix: [[5]] }, expectedOutput: 5 },
    ]),
    solutionApproach:
      "Loop with index i from 0 to n. Add matrix[i][i] to total.",
    conceptTaught: "2D lists, nested indexing, loop with index",
    order: 17,
    topicOrder: 105,
  },
  {
    slug: "flatten-list",
    title: "Flatten a List",
    description:
      "**Given a list that may contain nested lists, return a flattened version with all elements at one level.**\n\nHint: Use `isinstance(element, list)` to check if something is a list.\n\n**Examples:**\n- `flatten([[1, 2], [3, 4], [5]])` → `[1, 2, 3, 4, 5]`",
    difficulty: "easy",
    category: "logic-building",
    phase: 2,
    weekNumber: 7,
    starterCode:
      "def flatten(lst):\n    # Build a result list\n    # For each element: if it is a list, add its elements; otherwise add the element\n    pass",
    solutionCode:
      "def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(item)\n        else:\n            result.append(item)\n    return result",
    testCases: JSON.stringify([
      {
        input: { lst: [[1, 2], [3, 4], [5]] },
        expectedOutput: [1, 2, 3, 4, 5],
      },
      { input: { lst: [[1], [2], [3]] }, expectedOutput: [1, 2, 3] },
      { input: { lst: [] }, expectedOutput: [] },
    ]),
    solutionApproach:
      "Loop through outer list. If element is a list, extend result with it. Otherwise append.",
    conceptTaught: "isinstance(), extend vs append, nested iteration",
    order: 18,
    topicOrder: 106,
  },
];

// ═══════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log("🌱 Seeding Phase 1 & 2 problems...\n");

  const allProblems = [...phase1Problems, ...phase2Problems];
  let created = 0;
  let skipped = 0;

  for (const problem of allProblems) {
    const existing = await prisma.problem.findUnique({
      where: { slug: problem.slug },
    });

    if (existing) {
      // Update phase/week fields on existing problems
      await prisma.problem.update({
        where: { slug: problem.slug },
        data: {
          phase: problem.phase,
          weekNumber: problem.weekNumber,
          conceptTaught: problem.conceptTaught,
        },
      });
      skipped++;
      console.log(`  ⏭  ${problem.slug} (already exists — updated phase metadata)`);
    } else {
      await prisma.problem.create({ data: problem });
      created++;
      console.log(`  ✅ ${problem.slug} (Phase ${problem.phase}, Week ${problem.weekNumber})`);
    }
  }

  // Tag existing problems with Phase 3+ metadata
  const existingDSA = await prisma.problem.findMany({
    where: { phase: 3, category: { not: { in: ["python-basics", "logic-building"] } } },
  });
  const updated = await prisma.problem.updateMany({
    where: {
      phase: 3,
      category: { notIn: ["python-basics", "logic-building"] },
    },
    data: { phase: 3 },
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Existing DSA problems tagged as Phase 3: ${updated.count}`);
  console.log(`\n✨ Phase seeding complete!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { main as seedPhases };
