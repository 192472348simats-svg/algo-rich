const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const problems = [
  {
    title: "Print Hello World",
    description:
      "Write a program that prints `Hello, World!` to the console.\n\nThis is the classic first program in any language!",
    difficulty: "Easy",
    category: "Python Basics",
    starterCode: "# Write your code here\n",
    testCases: [{ input: "", expectedOutput: "Hello, World!" }],
  },
  {
    title: "Sum Two Numbers",
    description:
      "Write a function `add_numbers(a, b)` that takes two integers and returns their sum.\n\n**Function signature:** `def add_numbers(a, b):`\n\n**Example:**\n- `add_numbers(5, 3)` → `8`\n- `add_numbers(-1, 1)` → `0`",
    difficulty: "Easy",
    category: "Python Basics",
    starterCode:
      "def add_numbers(a, b):\n    # Your code here\n    pass\n\n# Test your function\nprint(add_numbers(5, 3))",
    testCases: [
      { input: "5, 3", expectedOutput: "8" },
      { input: "10, -5", expectedOutput: "5" },
      { input: "0, 0", expectedOutput: "0" },
    ],
  },
  {
    title: "Check Even or Odd",
    description:
      "Write a function `check_even_odd(num)` that determines if a number is even or odd.\n\nReturn the string `'Even'` if the number is even, or `'Odd'` if it's odd.\n\n**Example:**\n- `check_even_odd(4)` → `'Even'`\n- `check_even_odd(7)` → `'Odd'`",
    difficulty: "Easy",
    category: "Python Basics",
    starterCode:
      "def check_even_odd(num):\n    # Your code here\n    pass\n\nprint(check_even_odd(4))",
    testCases: [
      { input: "4", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" },
      { input: "0", expectedOutput: "Even" },
    ],
  },
  {
    title: "Reverse a String",
    description:
      "Write a function `reverse_string(s)` that reverses a given string.\n\n**Example:**\n- Input: `'hello'` → Output: `'olleh'`\n- Input: `'Python'` → Output: `'nohtyP'`",
    difficulty: "Easy",
    category: "Strings",
    starterCode:
      "def reverse_string(s):\n    # Your code here\n    pass\n\nprint(reverse_string('hello'))",
    testCases: [
      { input: "'hello'", expectedOutput: "olleh" },
      { input: "'python'", expectedOutput: "nohtyp" },
      { input: "'a'", expectedOutput: "a" },
    ],
  },
  {
    title: "Find Maximum in List",
    description:
      "Write a function `find_max(numbers)` that finds the maximum number in a list.\n\nDo **not** use the built-in `max()` function. You can assume the list has at least one number.\n\n**Example:**\n- `find_max([3, 7, 2, 9, 1])` → `9`",
    difficulty: "Easy",
    category: "Arrays",
    starterCode:
      "def find_max(numbers):\n    # Your code here\n    pass\n\nprint(find_max([3, 7, 2, 9, 1]))",
    testCases: [
      { input: "[3, 7, 2, 9, 1]", expectedOutput: "9" },
      { input: "[5]", expectedOutput: "5" },
      { input: "[-10, -5, -20]", expectedOutput: "-5" },
    ],
  },
  {
    title: "Count Vowels",
    description:
      "Write a function `count_vowels(s)` that counts the number of vowels (a, e, i, o, u) in a string. Count both uppercase and lowercase vowels.\n\n**Example:**\n- `count_vowels('hello')` → `2`\n- `count_vowels('AEIOU')` → `5`",
    difficulty: "Easy",
    category: "Strings",
    starterCode:
      "def count_vowels(s):\n    # Your code here\n    pass\n\nprint(count_vowels('hello'))",
    testCases: [
      { input: "'hello'", expectedOutput: "2" },
      { input: "'AEIOU'", expectedOutput: "5" },
      { input: "'rhythm'", expectedOutput: "0" },
    ],
  },
  {
    title: "Palindrome Check",
    description:
      "Write a function `is_palindrome(s)` that checks whether a given string is a palindrome (reads the same forwards and backwards).\n\nReturn `True` if it is, `False` otherwise. Ignore case.\n\n**Example:**\n- `is_palindrome('racecar')` → `True`\n- `is_palindrome('hello')` → `False`",
    difficulty: "Easy",
    category: "Strings",
    starterCode:
      "def is_palindrome(s):\n    # Your code here\n    pass\n\nprint(is_palindrome('racecar'))",
    testCases: [
      { input: "'racecar'", expectedOutput: "True" },
      { input: "'hello'", expectedOutput: "False" },
      { input: "'Madam'", expectedOutput: "True" },
    ],
  },
  {
    title: "FizzBuzz",
    description:
      "Write a function `fizzbuzz(n)` that returns:\n- `'FizzBuzz'` if `n` is divisible by both 3 and 5\n- `'Fizz'` if `n` is divisible by 3 only\n- `'Buzz'` if `n` is divisible by 5 only\n- The number as a string otherwise\n\n**Example:**\n- `fizzbuzz(15)` → `'FizzBuzz'`\n- `fizzbuzz(9)` → `'Fizz'`\n- `fizzbuzz(10)` → `'Buzz'`\n- `fizzbuzz(7)` → `'7'`",
    difficulty: "Easy",
    category: "Python Basics",
    starterCode:
      "def fizzbuzz(n):\n    # Your code here\n    pass\n\nprint(fizzbuzz(15))",
    testCases: [
      { input: "15", expectedOutput: "FizzBuzz" },
      { input: "9", expectedOutput: "Fizz" },
      { input: "10", expectedOutput: "Buzz" },
      { input: "7", expectedOutput: "7" },
    ],
  },
  {
    title: "Sum of List",
    description:
      "Write a function `sum_list(numbers)` that returns the sum of all numbers in a list.\n\nDo **not** use the built-in `sum()` function.\n\n**Example:**\n- `sum_list([1, 2, 3, 4, 5])` → `15`\n- `sum_list([])` → `0`",
    difficulty: "Easy",
    category: "Arrays",
    starterCode:
      "def sum_list(numbers):\n    # Your code here\n    pass\n\nprint(sum_list([1, 2, 3, 4, 5]))",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "15" },
      { input: "[]", expectedOutput: "0" },
      { input: "[-1, 1, -1, 1]", expectedOutput: "0" },
    ],
  },
  {
    title: "Find Duplicates",
    description:
      "Write a function `find_duplicates(numbers)` that returns a sorted list of all duplicate values in the input list.\n\nEach duplicate should appear only once in the result.\n\n**Example:**\n- `find_duplicates([1, 2, 3, 2, 4, 3])` → `[2, 3]`\n- `find_duplicates([1, 2, 3])` → `[]`",
    difficulty: "Medium",
    category: "Arrays",
    starterCode:
      "def find_duplicates(numbers):\n    # Your code here\n    pass\n\nprint(find_duplicates([1, 2, 3, 2, 4, 3]))",
    testCases: [
      { input: "[1, 2, 3, 2, 4, 3]", expectedOutput: "[2, 3]" },
      { input: "[1, 2, 3]", expectedOutput: "[]" },
      { input: "[5, 5, 5, 5]", expectedOutput: "[5]" },
    ],
  },
];

async function seedProblems() {
  console.log("🧩 Seeding practice problems...\n");

  // Clear existing problems and submissions
  await prisma.submission.deleteMany();
  await prisma.problem.deleteMany();

  for (const p of problems) {
    const created = await prisma.problem.create({
      data: {
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        category: p.category,
        starterCode: p.starterCode,
        testCases: JSON.stringify(p.testCases),
      },
    });
    console.log(
      `  ✅ ${created.difficulty.padEnd(6)} | ${created.category.padEnd(14)} | ${created.title}`
    );
  }

  console.log(`\n🎉 Seeded ${problems.length} practice problems!`);
}

seedProblems()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
