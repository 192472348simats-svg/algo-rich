const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const lessons = [
  {
    title: "Variables & Data Types",
    order: 1,
    difficulty: "Beginner",
    estimatedTime: 15,
    codeExample: `# Variables in Python
name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Is student: {is_student}")
print(f"Type of name: {type(name)}")
print(f"Type of age: {type(age)}")`,
    content: `# Variables & Data Types in Python

Welcome to your first Python lesson! In this lesson, you'll learn how to store and work with data using **variables** and understand the fundamental **data types** that Python offers.

## What Are Variables?

A **variable** is a named container that stores a value in memory. Think of it like a labeled box — you give it a name and put something inside.

In Python, you create a variable simply by assigning a value:

\`\`\`python
message = "Hello, World!"
count = 42
temperature = 98.6
\`\`\`

Unlike many other languages, Python does **not** require you to declare the type of a variable. The type is automatically inferred from the value you assign.

> **Key Insight:** Python is *dynamically typed* — the type of a variable is determined at runtime, not at compile time.

## Python's Core Data Types

Python has several built-in data types. The most important ones for beginners are:

### Strings (\`str\`)

Strings represent text and are enclosed in quotes (single or double):

\`\`\`python
first_name = "Alice"
last_name = 'Smith'
greeting = f"Hello, {first_name} {last_name}!"
\`\`\`

### Integers (\`int\`)

Integers are whole numbers without a decimal point:

\`\`\`python
age = 25
negative = -10
big_number = 1_000_000   # underscores for readability
\`\`\`

### Floats (\`float\`)

Floats are numbers with a decimal point:

\`\`\`python
pi = 3.14159
temperature = -40.0
tiny = 0.001
\`\`\`

### Booleans (\`bool\`)

Booleans represent \`True\` or \`False\`:

\`\`\`python
is_active = True
has_permission = False
\`\`\`

## Checking Types

Use the built-in \`type()\` function to inspect a variable's type:

\`\`\`python
x = 42
print(type(x))       # <class 'int'>

y = "hello"
print(type(y))       # <class 'str'>
\`\`\`

## Type Conversion

You can convert between types using built-in functions:

\`\`\`python
# String to integer
num_str = "100"
num = int(num_str)      # 100

# Integer to string
age = 25
age_str = str(age)      # "25"

# String to float
price = float("19.99")  # 19.99
\`\`\`

> **Warning:** Not all conversions are valid. \`int("hello")\` will raise a \`ValueError\`.

## Variable Naming Rules

Follow these rules when naming variables:

- Must start with a letter or underscore (\`_\`)
- Can contain letters, digits, and underscores
- Are **case-sensitive** (\`name\` and \`Name\` are different)
- Cannot be a Python keyword (\`if\`, \`for\`, \`class\`, etc.)

Use **snake_case** for Python variables:

\`\`\`python
# Good
user_name = "alice"
total_count = 0

# Bad
userName = "alice"    # camelCase (not Pythonic)
TotalCount = 0        # PascalCase (reserved for classes)
\`\`\`

## Summary

- Variables store data and don't need type declarations
- Python's core types: \`str\`, \`int\`, \`float\`, \`bool\`
- Use \`type()\` to check a variable's type
- Convert between types with \`int()\`, \`str()\`, \`float()\`
- Follow snake_case naming conventions
`,
  },
  {
    title: "Operators & Expressions",
    order: 2,
    difficulty: "Beginner",
    estimatedTime: 20,
    codeExample: `# Operators in Python
a = 15
b = 4

# Arithmetic
print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b}")
print(f"{a} // {b} = {a // b}")
print(f"{a} % {b} = {a % b}")
print(f"{a} ** {b} = {a ** b}")

# Comparison
print(f"{a} > {b}: {a > b}")
print(f"{a} == {b}: {a == b}")`,
    content: `# Operators & Expressions

In this lesson, you'll learn how to perform calculations and make comparisons using Python's operators. Operators are the building blocks of any program's logic.

## Arithmetic Operators

Python supports all standard mathematical operations:

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| \`+\` | Addition | \`5 + 3\` | \`8\` |
| \`-\` | Subtraction | \`10 - 4\` | \`6\` |
| \`*\` | Multiplication | \`3 * 7\` | \`21\` |
| \`/\` | Division | \`15 / 4\` | \`3.75\` |
| \`//\` | Floor Division | \`15 // 4\` | \`3\` |
| \`%\` | Modulus | \`15 % 4\` | \`3\` |
| \`**\` | Exponent | \`2 ** 10\` | \`1024\` |

\`\`\`python
total = 100 + 25
remainder = 17 % 5      # 2
squared = 6 ** 2         # 36
half = 99 // 2           # 49 (rounded down)
\`\`\`

> **Note:** Division (\`/\`) always returns a float, even if the result is a whole number. Use \`//\` for integer division.

## Comparison Operators

Comparison operators return a Boolean (\`True\` or \`False\`):

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`==\` | Equal to | \`5 == 5\` | \`True\` |
| \`!=\` | Not equal | \`5 != 3\` | \`True\` |
| \`>\` | Greater than | \`10 > 3\` | \`True\` |
| \`<\` | Less than | \`2 < 8\` | \`True\` |
| \`>=\` | Greater or equal | \`5 >= 5\` | \`True\` |
| \`<=\` | Less or equal | \`3 <= 2\` | \`False\` |

\`\`\`python
age = 18
can_vote = age >= 18     # True
is_teenager = 13 <= age < 20  # True (chaining!)
\`\`\`

## Logical Operators

Combine multiple conditions with \`and\`, \`or\`, and \`not\`:

\`\`\`python
age = 25
has_id = True

# Both must be True
can_enter = age >= 21 and has_id    # True

# At least one must be True
is_special = age > 30 or has_id     # True

# Negation
is_minor = not (age >= 18)          # False
\`\`\`

## Assignment Operators

Shorthand operators for updating variables:

\`\`\`python
score = 100
score += 10     # score = score + 10  → 110
score -= 5      # score = score - 5   → 105
score *= 2      # score = score * 2   → 210
score //= 3     # score = score // 3  → 70
\`\`\`

## String Operators

Operators work on strings too:

\`\`\`python
# Concatenation
first = "Hello"
last = "World"
full = first + " " + last     # "Hello World"

# Repetition
line = "-" * 30                # "------------------------------"

# Membership
has_py = "Py" in "Python"      # True
\`\`\`

## Operator Precedence

Python follows standard math precedence (PEMDAS):

1. \`**\` (exponent)
2. \`*\`, \`/\`, \`//\`, \`%\`
3. \`+\`, \`-\`
4. Comparisons (\`<\`, \`>\`, \`==\`, etc.)
5. \`not\`, \`and\`, \`or\`

Use parentheses to make order explicit:

\`\`\`python
result = 2 + 3 * 4       # 14 (not 20)
result = (2 + 3) * 4     # 20
\`\`\`

## Summary

- Arithmetic: \`+\`, \`-\`, \`*\`, \`/\`, \`//\`, \`%\`, \`**\`
- Comparison: \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`
- Logical: \`and\`, \`or\`, \`not\`
- Assignment: \`+=\`, \`-=\`, \`*=\`, etc.
- Operators work on strings: \`+\` concatenation, \`*\` repetition, \`in\` membership
- Use parentheses to clarify precedence
`,
  },
  {
    title: "Control Flow: if, elif, else",
    order: 3,
    difficulty: "Beginner",
    estimatedTime: 20,
    codeExample: `# Control Flow in Python
score = 85

if score >= 90:
    grade = "A"
    print("Excellent!")
elif score >= 80:
    grade = "B"
    print("Great job!")
elif score >= 70:
    grade = "C"
    print("Good effort!")
else:
    grade = "F"
    print("Keep trying!")

print(f"Score: {score}, Grade: {grade}")

# Ternary
status = "pass" if score >= 60 else "fail"
print(f"Status: {status}")`,
    content: `# Control Flow: if, elif, else

Control flow lets your program make decisions. Instead of running every line top to bottom, your code can choose different paths based on conditions.

## The if Statement

The simplest form of control flow:

\`\`\`python
temperature = 35

if temperature > 30:
    print("It's hot outside!")
    print("Remember to stay hydrated.")
\`\`\`

> **Important:** Python uses **indentation** (4 spaces) to define code blocks, not curly braces like other languages.

## if-else

Provide an alternative path when the condition is \`False\`:

\`\`\`python
age = 16

if age >= 18:
    print("You can vote!")
else:
    print("You're not old enough to vote yet.")
    years_left = 18 - age
    print(f"Wait {years_left} more year(s).")
\`\`\`

## if-elif-else

Handle multiple conditions with \`elif\` (short for "else if"):

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade: {grade}")
\`\`\`

Python evaluates conditions **top to bottom** and stops at the first \`True\` condition. This means order matters!

## Nested Conditions

You can nest \`if\` statements inside each other:

\`\`\`python
has_ticket = True
age = 15

if has_ticket:
    if age >= 18:
        print("Welcome to the show!")
    else:
        print("You need a guardian.")
else:
    print("Please buy a ticket first.")
\`\`\`

> **Tip:** If nesting gets too deep (more than 2-3 levels), consider restructuring with logical operators or by extracting functions.

## Combining Conditions

Use logical operators for complex decisions:

\`\`\`python
username = "admin"
password = "secret123"
is_active = True

if username == "admin" and password == "secret123" and is_active:
    print("Login successful!")
elif username == "admin" and password != "secret123":
    print("Wrong password!")
else:
    print("User not found.")
\`\`\`

## Ternary Expression

A one-line conditional for simple cases:

\`\`\`python
age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # "adult"

# Can be used in f-strings too
print(f"You are {'eligible' if age >= 18 else 'not eligible'}.")
\`\`\`

## Truthy and Falsy Values

Python considers these values as \`False\` (falsy):
- \`False\`, \`None\`, \`0\`, \`0.0\`
- Empty sequences: \`""\`, \`[]\`, \`()\`, \`{}\`

Everything else is \`True\` (truthy):

\`\`\`python
name = ""
if name:
    print(f"Hello, {name}!")
else:
    print("Name is empty.")    # This runs

items = [1, 2, 3]
if items:
    print(f"Found {len(items)} items.")  # This runs
\`\`\`

## Summary

- \`if\` executes code when a condition is \`True\`
- \`elif\` checks additional conditions
- \`else\` provides a fallback path
- Python uses indentation for code blocks
- Ternary: \`value_if_true if condition else value_if_false\`
- Understand truthy/falsy values for cleaner conditions
`,
  },
  {
    title: "Loops: for and while",
    order: 4,
    difficulty: "Beginner",
    estimatedTime: 25,
    codeExample: `# Loops in Python

# For loop with range
for i in range(5):
    print(f"Count: {i}")

# Iterating over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# While loop
countdown = 5
while countdown > 0:
    print(f"T-minus {countdown}...")
    countdown -= 1
print("Liftoff! 🚀")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"Squares: {squares}")`,
    content: `# Loops: for and while

Loops let you repeat code automatically. Instead of writing the same code over and over, loops execute a block of code multiple times — each time with different data.

## The for Loop

The \`for\` loop iterates over a sequence (list, string, range, etc.):

\`\`\`python
# Iterating over a list
colors = ["red", "green", "blue"]
for color in colors:
    print(color)
\`\`\`

### Using range()

\`range()\` generates a sequence of numbers:

\`\`\`python
# range(stop) — 0 to stop-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop)
for i in range(2, 6):
    print(i)  # 2, 3, 4, 5

# range(start, stop, step)
for i in range(0, 20, 5):
    print(i)  # 0, 5, 10, 15
\`\`\`

### Iterating Over Strings

Strings are sequences too:

\`\`\`python
word = "Python"
for letter in word:
    print(letter)  # P, y, t, h, o, n
\`\`\`

### enumerate() — Index + Value

When you need both the index and the value:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry
\`\`\`

## The while Loop

\`while\` repeats as long as a condition is \`True\`:

\`\`\`python
count = 0
while count < 5:
    print(f"Count is {count}")
    count += 1
\`\`\`

> **Warning:** Always make sure the condition will eventually become \`False\`, or you'll create an **infinite loop**!

### User Input with while

A common pattern for input validation:

\`\`\`python
while True:
    answer = input("Enter 'quit' to exit: ")
    if answer == "quit":
        break
    print(f"You said: {answer}")
\`\`\`

## Loop Control Statements

### break — Exit the Loop

\`\`\`python
for num in range(100):
    if num > 5:
        break
    print(num)  # 0, 1, 2, 3, 4, 5
\`\`\`

### continue — Skip to Next Iteration

\`\`\`python
for num in range(10):
    if num % 2 == 0:
        continue  # Skip even numbers
    print(num)  # 1, 3, 5, 7, 9
\`\`\`

### else Clause on Loops

The \`else\` block runs when the loop completes without \`break\`:

\`\`\`python
for n in range(2, 10):
    for x in range(2, n):
        if n % x == 0:
            break
    else:
        print(f"{n} is prime")
\`\`\`

## Nested Loops

Loops inside loops:

\`\`\`python
for row in range(3):
    for col in range(4):
        print(f"({row},{col})", end=" ")
    print()  # New line after each row
\`\`\`

## List Comprehensions

A powerful Pythonic way to create lists from loops:

\`\`\`python
# Traditional way
squares = []
for x in range(1, 6):
    squares.append(x ** 2)

# List comprehension (one line!)
squares = [x ** 2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

# With condition
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

## Summary

- \`for\` loops iterate over sequences (lists, strings, ranges)
- \`range(start, stop, step)\` generates number sequences
- \`enumerate()\` gives you index + value pairs
- \`while\` loops repeat while a condition is \`True\`
- \`break\` exits a loop; \`continue\` skips to the next iteration
- List comprehensions are a concise way to build lists
`,
  },
  {
    title: "Functions & Parameters",
    order: 5,
    difficulty: "Beginner",
    estimatedTime: 25,
    codeExample: `# Functions in Python

def greet(name, greeting="Hello"):
    """Return a greeting message."""
    return f"{greeting}, {name}!"

print(greet("Alice"))
print(greet("Bob", "Hey"))

def calculate_stats(*numbers):
    """Calculate sum, average, min, max."""
    total = sum(numbers)
    avg = total / len(numbers)
    return {
        "sum": total,
        "average": round(avg, 2),
        "min": min(numbers),
        "max": max(numbers),
    }

stats = calculate_stats(10, 20, 30, 40, 50)
for key, value in stats.items():
    print(f"{key}: {value}")`,
    content: `# Functions & Parameters

Functions are reusable blocks of code that perform a specific task. They are one of the most important concepts in programming — they help you organize code, avoid repetition, and make programs easier to understand.

## Defining a Function

Use the \`def\` keyword to create a function:

\`\`\`python
def say_hello():
    print("Hello, World!")

# Call the function
say_hello()  # Hello, World!
\`\`\`

## Parameters and Arguments

Functions can accept input values called **parameters**:

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")   # Hello, Alice!
greet("Bob")     # Hello, Bob!
\`\`\`

### Multiple Parameters

\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8
\`\`\`

## Return Values

Use \`return\` to send a value back to the caller:

\`\`\`python
def square(n):
    return n ** 2

result = square(7)
print(result)  # 49
\`\`\`

A function without \`return\` automatically returns \`None\`:

\`\`\`python
def say_hi():
    print("Hi!")

value = say_hi()
print(value)  # None
\`\`\`

## Default Parameter Values

Provide defaults for optional parameters:

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))            # Hello, Alice!
print(greet("Bob", "Hey"))       # Hey, Bob!
\`\`\`

> **Rule:** Default parameters must come **after** non-default parameters.

## Keyword Arguments

Call functions with named arguments for clarity:

\`\`\`python
def create_profile(name, age, city):
    return f"{name}, {age}, from {city}"

# Using keyword arguments (order doesn't matter)
profile = create_profile(city="NYC", name="Alice", age=25)
\`\`\`

## *args and **kwargs

### *args — Variable Positional Arguments

\`\`\`python
def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3))          # 6
print(total(10, 20, 30, 40))   # 100
\`\`\`

### **kwargs — Variable Keyword Arguments

\`\`\`python
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")
\`\`\`

## Docstrings

Document your functions with docstrings:

\`\`\`python
def calculate_area(length, width):
    """
    Calculate the area of a rectangle.

    Args:
        length: The length of the rectangle.
        width: The width of the rectangle.

    Returns:
        The area as a float.
    """
    return length * width
\`\`\`

## Scope

Variables inside a function are **local** — they don't exist outside:

\`\`\`python
def my_function():
    x = 10   # Local variable
    print(x)

my_function()
# print(x)  # NameError: x is not defined
\`\`\`

### Global Variables

Access global variables with the \`global\` keyword:

\`\`\`python
counter = 0

def increment():
    global counter
    counter += 1

increment()
print(counter)  # 1
\`\`\`

> **Best Practice:** Avoid using \`global\`. Pass values as parameters and return results instead.

## Lambda Functions

Small anonymous functions for simple operations:

\`\`\`python
# Regular function
def double(x):
    return x * 2

# Lambda equivalent
double = lambda x: x * 2

# Common use: sorting
students = [("Alice", 90), ("Bob", 75), ("Charlie", 85)]
students.sort(key=lambda s: s[1])
# [('Bob', 75), ('Charlie', 85), ('Alice', 90)]
\`\`\`

## Summary

- Define functions with \`def\`, call them by name
- Parameters accept input; \`return\` sends output back
- Use default values for optional parameters
- Use \`*args\` for variable positional, \`**kwargs\` for keyword arguments
- Write docstrings to document your functions
- Variables inside functions are local (scoped)
- Use lambda for small, one-expression functions
`,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.progress.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.course.deleteMany();

  // Create the Python Foundations course
  const course = await prisma.course.create({
    data: {
      title: "Python Foundations",
      description:
        "Master the fundamentals of Python programming. From variables and data types to functions, this course builds a solid foundation for your coding journey.",
      category: "python",
      order: 1,
    },
  });

  console.log(`📚 Created course: ${course.title}`);

  // Create lessons
  for (const lessonData of lessons) {
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: lessonData.title,
        content: lessonData.content,
        codeExample: lessonData.codeExample,
        order: lessonData.order,
        difficulty: lessonData.difficulty,
        estimatedTime: lessonData.estimatedTime,
      },
    });
    console.log(`  📝 Lesson ${lesson.order}: ${lesson.title}`);
  }

  console.log("\n✅ Seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
