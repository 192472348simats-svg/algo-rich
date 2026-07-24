// d:/Projects/DSA/algo-rich/lib/sessions/python-foundations.ts
import type {
  SessionDefinition,
  HookConfig,
  WatchConfig,
  PredictConfig,
  LearnConfig,
  GuidedBuildConfig,
  CodeConfig,
  ReflectConfig,
  SummaryConfig,
  TextFlowStep,
  BoxAnimationStep,
  CounterAnimationStep,
  MachineAnimationStep,
} from "../sessionDefinitions";

export const sessions: SessionDefinition[] = [
{
  id: "session-first-python-program",
  slug: "first-python-program",
  title: "Your First Python Program",
  topic: "python-foundations",
  description: "Write your very first line of code and understand how Python works.",
  estimatedMinutes: 15,
  xpTotal: 20,
  nextSessionSlug: "variables-basics",

  stages: [
    {
      id: "fpp-hook",
      type: "hook",
      config: {
        headline: "Your First Line of Code 🚀",
        subtext:
          "Every app — Instagram, Google, Spotify — started with one line of code. In 15 minutes, you write yours.",
        backgroundEmoji: "🚀",
      } satisfies HookConfig,
    },
    {
      id: "fpp-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "print('Hello!')", label: "YOUR CODE" },
          { text: "Python reads your instruction", label: "PYTHON ENGINE" },
          { text: "Hello!", label: "OUTPUT" },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "fpp-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "fpp-pred-1",
            question: "What will print(2 + 3) show on screen?",
            answerType: "multiple-choice",
            options: ["5", "2+3", "23", "Error"],
            correctAnswer: "5",
            feedbackCorrect:
              "✅ Python does the math first (2+3=5), then shows the result.",
            feedbackWrong:
              "Python calculates 2+3=5 first, then prints the number 5.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "fpp-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "What is print()?",
            content:
              "print() shows things on screen. It's like telling the computer: 'Hey, display this!' Everything inside the brackets gets shown.",
            example: "print('Hello!') → shows: Hello!",
          },
          {
            title: "Text vs Numbers",
            content:
              "Text needs quotes: print('hello'). Numbers don't: print(42). Quotes tell Python 'this is text, not a command.'",
            example:
              "print('5')  → shows text: 5\nprint(5)    → shows number: 5\nprint(2+3)  → shows: 5 (does math!)",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "fpp-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Type: print('Hello, World!')",
            expectedOutput: "Hello, World!",
            hint: "Include the quotes and brackets exactly",
            celebration: "🎉 You just wrote your first program!",
          },
          {
            instruction: "Now try: print(10 + 5)",
            expectedOutput: "15",
            hint: "No quotes — Python will calculate it",
            celebration: "Python can do math! 🧮",
          },
          {
            instruction: "Print your own name using print()",
            expectedOutput: null,
            hint: "print('YourName') — with quotes!",
            celebration: "The computer knows you now! 🙌",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "fpp-code",
      type: "code",
      config: {
        problemSlug: "hello-world",
        contextHint: "Use print() to show text on screen",
        hintAfterMinutes: 2,
        approachAfterMinutes: 5,
      } satisfies CodeConfig,
    },
    {
      id: "fpp-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What does print() do?",
            options: [
              "Shows on screen",
              "Saves to file",
              "Creates variable",
              "Sends to internet",
            ],
            correctIndex: 0,
            explanation: "print() displays output on your screen.",
          },
          {
            question: "print('5') vs print(5) — what's different?",
            options: [
              "Nothing",
              "First is text, second is number",
              "First gives error",
              "Second gives error",
            ],
            correctIndex: 1,
            explanation:
              "Quotes make it text (a string). Without quotes, Python treats it as a number.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "fpp-summary",
      type: "summary",
      config: {
        xpEarned: 20,
        title: "You're a Programmer Now! 🎊",
        message:
          "You told a computer what to do and it listened. Tomorrow: variables — teaching computers to remember things.",
        nextSession: "variables-basics",
      } satisfies SummaryConfig,
    },
  ],
}
,
// ──────────────────────────────────────────────────────

{
  id: "session-variables-basics",
  slug: "variables-basics",
  title: "Variables — Teaching Computers to Remember",
  topic: "python-foundations",
  prerequisiteSessionSlug: "first-python-program",
  description: "Learn to store and reuse values with variables.",
  estimatedMinutes: 15,
  xpTotal: 20,
  nextSessionSlug: "loops-basics",

  stages: [
    {
      id: "vb-hook",
      type: "hook",
      config: {
        headline: "Your phone stores your name, contacts, scores. How? Variables. 📱",
        subtext:
          "In the next few minutes you'll learn how to make the computer remember anything you tell it.",
        backgroundEmoji: "📦",
      } satisfies HookConfig,
    },
    {
      id: "vb-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "name", value: null },
          { action: "fill", label: "name", value: "'Alice'" },
          { action: "create", label: "age", value: null },
          { action: "fill", label: "age", value: "25" },
          { action: "read", label: "name", output: "Alice" },
          { action: "update", label: "age", oldValue: "25", newValue: "26" },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "vb-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "vb-pred-1",
            question: "x = 5, then x = 10. What is x?",
            answerType: "multiple-choice",
            options: ["5", "10", "15", "Error"],
            correctAnswer: "10",
            feedbackCorrect:
              "✅ Variables hold ONE value. x = 10 replaces the 5.",
            feedbackWrong:
              "Variables hold one value at a time. x = 10 replaces the old value 5.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "vb-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "What is a variable?",
            content:
              "A labeled box that stores one value. name = 'Alice' creates a box labeled 'name' with 'Alice' inside.",
            example: "name = 'Alice'\nprint(name)  # Alice",
          },
          {
            title: "= means STORE, not EQUALS",
            content:
              "x = 5 means 'put 5 into x'. Think of it as an arrow: x ← 5. It's not saying they're equal!",
            example: "score = 0\nscore = score + 10  # now score = 10",
          },
          {
            title: "Naming rules",
            content:
              "Start with letter/underscore. No spaces (use snake_case: my_name). Can't use Python keywords (if, for, print).",
            example: "my_name = 'Bob'  ✅\n2fast = 'no'    ❌ (starts with number)",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "vb-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Create a variable: name = 'your name here' (replace with your name)",
            hint: "Keep the quotes around your name",
            celebration: "Variable created! 📦",
          },
          {
            instruction: "Print it: print(name)",
            hint: "No quotes around name — you want the VALUE",
            celebration: "You're reading a variable! 🎯",
          },
          {
            instruction: "Create age, then print: print(name, 'is', age, 'years old')",
            hint: "Commas separate multiple things in print",
            celebration: "Two variables in one print! 🌟",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "vb-code",
      type: "code",
      config: {
        problemSlug: "sum-two-numbers",
        contextHint: "Create two variables and add them together",
        hintAfterMinutes: 2,
        approachAfterMinutes: 5,
      } satisfies CodeConfig,
    },
    {
      id: "vb-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Can you change a variable after creating it?",
            options: ["Yes", "No", "Only numbers", "Only strings"],
            correctIndex: 0,
            explanation: "Variables can be reassigned at any time.",
          },
          {
            question: "What happens to the old value after reassignment?",
            options: [
              "Saved somewhere",
              "Gone forever",
              "Becomes None",
              "Error",
            ],
            correctIndex: 1,
            explanation:
              "The old value is simply replaced. Python doesn't save it.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "vb-summary",
      type: "summary",
      config: {
        xpEarned: 20,
        title: "Memory Unlocked! 🧠",
        message:
          "Variables = foundation of everything. Next: loops — making computers repeat.",
        nextSession: "loops-basics",
      } satisfies SummaryConfig,
    },
  ],
}
,
// ──────────────────────────────────────────────────────

{
  id: "session-loops-basics",
  slug: "loops-basics",
  title: "Loops — Making Computers Repeat",
  topic: "python-foundations",
  prerequisiteSessionSlug: "if-else-basics",
  description: "Use for loops to make Python do repetitive work in seconds.",
  estimatedMinutes: 18,
  xpTotal: 25,
  nextSessionSlug: "functions-basics",

  stages: [
    {
      id: "lb-hook",
      type: "hook",
      config: {
        headline: "Writing 'Happy Birthday' 500 times by hand? 2 hours. With a loop? 0.001 seconds. ⚡",
        subtext:
          "Loops are how computers do in a blink what would take humans hours. Let's learn them.",
        backgroundEmoji: "🔄",
      } satisfies HookConfig,
    },
    {
      id: "lb-watch",
      type: "watch",
      config: {
        visualizerType: "counter-animation",
        steps: [
          { code: "for i in range(5):", counter: null, narration: "Python creates a counter i" },
          { code: "  print(i)", counter: 0, output: "0" },
          { code: "  print(i)", counter: 1, output: "0\n1" },
          { code: "  print(i)", counter: 2, output: "0\n1\n2" },
          { code: "  print(i)", counter: 3, output: "0\n1\n2\n3" },
          { code: "  print(i)", counter: 4, output: "0\n1\n2\n3\n4" },
          { code: "# done!", counter: "✓", narration: "5 outputs from 2 lines of code!" },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "lb-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "lb-pred-1",
            question: "for i in range(3): print('Hi') — How many times does it print?",
            answerType: "multiple-choice",
            options: ["2", "3", "4", "1"],
            correctAnswer: "3",
            feedbackCorrect: "✅ range(3) = 0, 1, 2 — three numbers, three prints.",
            feedbackWrong: "range(3) generates 0, 1, 2 — that's 3 values, so it prints 3 times.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "lb-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "What is a for loop?",
            content:
              "Repeats code N times. 'for i in range(10):' = do this 10 times. The indented code below runs every time.",
            example: "for i in range(3):\n    print('Hello')  # prints Hello 3 times",
          },
          {
            title: "range() explained",
            content: "range(5) = 0,1,2,3,4. Starts at 0, stops BEFORE 5. range(1,6) = 1,2,3,4,5.",
            example: "for i in range(1, 4):\n    print(i)  # 1, 2, 3",
          },
          {
            title: "Indentation = belonging",
            content:
              "Indented code is INSIDE the loop. Un-indented code runs AFTER the loop finishes.",
            example:
              "for i in range(3):\n    print(i)     # inside loop\nprint('done')    # outside loop",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "lb-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Print numbers 1 to 5 with a loop",
            hint: "for i in range(1, 6): print(i)",
            celebration: "Counting with code! 🎯",
          },
          {
            instruction: "Print 'Hello' exactly 3 times using a loop",
            hint: "for i in range(3): print('Hello')",
            celebration: "Loops save SO much time! ⚡",
          },
          {
            instruction: "Print each letter of the word 'Python' on its own line",
            hint: "for letter in 'Python': print(letter)",
            celebration: "You can loop over text too! 🐍",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "lb-code",
      type: "code",
      config: {
        problemSlug: "fizzbuzz",
        contextHint: "Use a for loop with range(). Check conditions with if/elif.",
        hintAfterMinutes: 3,
        approachAfterMinutes: 6,
      } satisfies CodeConfig,
    },
    {
      id: "lb-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "range(5) generates how many numbers?",
            options: ["4", "5", "6", "Depends"],
            correctIndex: 1,
            explanation: "range(5) = 0,1,2,3,4 — exactly 5 numbers.",
          },
          {
            question: "Indentation in Python tells Python:",
            options: [
              "What's inside the loop",
              "How fast to run",
              "Nothing special",
              "The variable type",
            ],
            correctIndex: 0,
            explanation:
              "Indentation defines code blocks — what's inside versus outside a loop or function.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "lb-summary",
      type: "summary",
      config: {
        xpEarned: 25,
        title: "Automation Unlocked! ⚡",
        message: "Loops turn seconds of code into millions of actions. Next: functions — building your own tools.",
        nextSession: "functions-basics",
      } satisfies SummaryConfig,
    },
  ],
}
,
// ──────────────────────────────────────────────────────

{
  id: "session-functions-basics",
  slug: "functions-basics",
  title: "Functions — Building Your Own Tools",
  topic: "python-foundations",
  description: "Create reusable functions to organize and power your code.",
  estimatedMinutes: 20,
  xpTotal: 25,

  stages: [
    {
      id: "fb-hook",
      type: "hook",
      config: {
        headline: "You used print() and range(). Someone BUILT those. Now YOU build your own. 🛠️",
        subtext:
          "Functions let you name and reuse pieces of code. Build once, use anywhere.",
        backgroundEmoji: "⚙️",
      } satisfies HookConfig,
    },
    {
      id: "fb-watch",
      type: "watch",
      config: {
        visualizerType: "machine-animation",
        steps: [
          { action: "show", name: "add", inputs: ["a", "b"], output: "a + b" },
          { action: "run", inputs: [3, 4], output: 7 },
          { action: "run", inputs: [10, 20], output: 30 },
          { action: "code", code: "def add(a, b):\n    return a + b" },
          {
            action: "compare",
            print_ver: "print(a+b)",
            return_ver: "return a+b",
            narration: "print shows it, return gives it back",
          },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "fb-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "fb-pred-1",
            question: "def double(x): return x * 2 — What does double(7) give?",
            answerType: "multiple-choice",
            options: ["7", "14", "72", "Error"],
            correctAnswer: "14",
            feedbackCorrect: "✅ double(7) = 7 × 2 = 14. The function multiplies by 2.",
            feedbackWrong: "double(x) returns x * 2. double(7) = 7 * 2 = 14.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "fb-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "def = define",
            content:
              "def greet(name): tells Python 'remember this recipe, I'll use it later'. The code inside only runs when you call it.",
            example: "def greet(name):\n    return 'Hello, ' + name\n\nprint(greet('Alice'))  # Hello, Alice",
          },
          {
            title: "Parameters vs Arguments",
            content:
              "Parameters: the names in the definition (a, b). Arguments: the actual values you pass in (3, 4). Python substitutes one for the other.",
            example: "def add(a, b):   # a, b are parameters\n    return a + b\n\nadd(3, 4)    # 3, 4 are arguments",
          },
          {
            title: "return ≠ print",
            content:
              "return sends a value BACK to the caller. print just shows it on screen. result = add(3,4) only works if add uses return.",
            example:
              "def add(a, b):  return a+b  # ✅\n# result = add(3,4)  → result = 7\n\ndef add(a, b):  print(a+b)  # ❌ for capturing\n# result = add(3,4)  → result = None",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "fb-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Write a function greet(name) that returns 'Hello, ' + name",
            hint: "def greet(name): then return 'Hello, ' + name",
            celebration: "You built a function! 🛠️",
          },
          {
            instruction: "Write square(n) that returns n * n",
            hint: "def square(n): return n * n",
            celebration: "Math tool created! 🔢",
          },
          {
            instruction: "Write is_even(n) that returns True if n is even, False otherwise",
            hint: "def is_even(n): return n % 2 == 0",
            celebration: "Logic in a function! 🧠",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "fb-code",
      type: "code",
      config: {
        problemSlug: "is-prime",
        contextHint: "Define a function. Use a loop to check divisibility. Return True/False.",
        hintAfterMinutes: 3,
        approachAfterMinutes: 7,
      } satisfies CodeConfig,
    },
    {
      id: "fb-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What's the difference between return and print?",
            options: [
              "return sends value back; print shows on screen",
              "They're the same thing",
              "print is better for functions",
              "return only works with numbers",
            ],
            correctIndex: 0,
            explanation:
              "return gives a value back to whoever called the function. print only displays it.",
          },
          {
            question: "Can functions call other functions?",
            options: [
              "Yes — that's how programs are built",
              "No",
              "Only built-in functions",
              "Only in Phase 3",
            ],
            correctIndex: 0,
            explanation: "Functions can call each other freely. This is how large programs are organized.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "fb-summary",
      type: "summary",
      config: {
        xpEarned: 25,
        title: "Tool Builder! 🛠️",
        message:
          "You can now create your own reusable tools. Functions are the foundation of every program ever written.",
      } satisfies SummaryConfig,
    },
  ],
}

// ──────────────────────────────────────────────────────
// DATA TYPES SESSION
// ──────────────────────────────────────────────────────
,

{
  id: "session-data-types",
  slug: "data-types",
  title: "Data Types — What Kind of Thing Is It?",
  topic: "python-foundations",
  description: "Integers, floats, strings, booleans — Python's 4 basic building blocks explained with real-life examples.",
  estimatedMinutes: 12,
  xpTotal: 80,
  prerequisiteSessionSlug: "variables-basics",
  nextSessionSlug: "if-else-basics",
  stages: [
    {
      id: "dt-hook",
      type: "hook",
      config: {
        headline: "Your phone knows the difference between your name and your age.\nSo does Python.",
        subtext: "In 12 minutes you'll understand why '5' + '3' = '53' but 5 + 3 = 8 — and why that matters forever.",
        backgroundEmoji: "🗂️",
      } satisfies HookConfig,
    },
    {
      id: "dt-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "age = 17", value: "17", output: "int — whole number, no decimal" } as BoxAnimationStep,
          { action: "create", label: "height = 5.6", value: "5.6", output: "float — number with decimal" } as BoxAnimationStep,
          { action: "create", label: "name = 'Vani'", value: "'Vani'", output: "str — text inside quotes" } as BoxAnimationStep,
          { action: "create", label: "is_student = True", value: "True", output: "bool — only True or False" } as BoxAnimationStep,
          { action: "read", label: "type(age)", value: "17", output: "<class 'int'>" } as BoxAnimationStep,
          { action: "read", label: "type(name)", value: "'Vani'", output: "<class 'str'>" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "dt-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "dt-p1",
            question: "What is the type of: score = 99.5",
            answerType: "multiple-choice",
            options: ["int", "float", "str", "bool"],
            correctAnswer: "float",
            feedbackCorrect: "99.5 has a decimal point → float. int would be 99 with no decimal.",
            feedbackWrong: "Any number with a decimal point is a float. 99 (no decimal) would be int.",
            xp: 10,
          },
          {
            id: "dt-p2",
            question: "What does '5' + '3' give you in Python?",
            answerType: "multiple-choice",
            options: ["8", "'53'", "Error", "53"],
            correctAnswer: "'53'",
            feedbackCorrect: "Strings join end-to-end (concatenation). '5' + '3' = '53', not 8!",
            feedbackWrong: "When both values are strings, + means join them together, not add. '5'+'3' = '53'.",
            xp: 15,
          },
          {
            id: "dt-p3",
            question: "Which of these is a boolean?",
            answerType: "multiple-choice",
            options: ["'True'", "1", "True", "yes"],
            correctAnswer: "True",
            feedbackCorrect: "True (capital T, no quotes) is a boolean. 'True' with quotes is a string.",
            feedbackWrong: "Boolean is exactly True or False — capital T/F, no quotes. 'True' with quotes is just text.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "dt-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The 4 basic types",
            content: "Python has 4 types you'll use every single day:\n\n**int** → whole numbers: 1, 42, -7\n**float** → decimals: 3.14, 0.5, -2.7\n**str** → text in quotes: 'hello', \"world\"\n**bool** → only True or False",
            example: "age = 17          # int\nheight = 5.6      # float\nname = 'Vani'     # str\npassed = True     # bool",
          },
          {
            title: "type() tells you what it is",
            content: "Not sure what type something is? Ask Python directly with type().\n\nThis is like asking 'what kind of thing is this?' and Python answers honestly.",
            example: "print(type(42))      # <class 'int'>\nprint(type(3.14))    # <class 'float'>\nprint(type('hi'))    # <class 'str'>\nprint(type(True))    # <class 'bool'>",
          },
          {
            title: "Mixing types causes bugs",
            content: "This is where beginners get confused most.\n\n'5' looks like a number but it's text. Python will not add it like a number — it joins it like text.\n\nRule: numbers without quotes are real numbers. Numbers inside quotes are just text that looks like numbers.",
            example: "print(5 + 3)       # 8  ✓ math\nprint('5' + '3')   # '53'  ✗ joined\nprint(int('5') + 3) # 8  ✓ convert first",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "dt-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What type is the value 3.14?",
            options: ["int", "float", "str", "bool"],
            correctIndex: 1,
            explanation: "Any number with a decimal point is a float. int only stores whole numbers.",
          },
          {
            question: "What does '10' + '20' return?",
            options: ["30", "'1020'", "Error", "10 + 20"],
            correctIndex: 1,
            explanation: "String + string means concatenation (joining). '10' + '20' = '1020', not 30.",
          },
          {
            question: "How do you check the type of a variable x?",
            options: ["x.type()", "type(x)", "typeof(x)", "x.getType()"],
            correctIndex: 1,
            explanation: "type(x) is a built-in Python function that returns the type of any value.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "dt-summary",
      type: "summary",
      config: {
        xpEarned: 80,
        title: "Type Detective! 🔍",
        message: "You now know Python's 4 basic types. This knowledge will save you from the most common beginner bugs forever.",
        nextSession: "if-else-basics",
      } satisfies SummaryConfig,
    },
  ],
}

// ──────────────────────────────────────────────────────
// IF/ELSE SESSION
// ──────────────────────────────────────────────────────
,

{
  id: "session-if-else",
  slug: "if-else-basics",
  title: "If / Else — Teaching Computers to Decide",
  topic: "python-foundations",
  description: "Make your programs smart. if, elif, else — the decision-making trio that powers every app ever built.",
  estimatedMinutes: 14,
  xpTotal: 90,
  prerequisiteSessionSlug: "data-types",
  nextSessionSlug: "lists-basics",
  stages: [
    {
      id: "ie-hook",
      type: "hook",
      config: {
        headline: "Netflix decides what to show you.\nInstagram decides what post comes next.\nBoth use the exact same Python code you're about to learn.",
        subtext: "In 14 minutes you'll make programs that think — deciding what to do based on conditions.",
        backgroundEmoji: "🤔",
      } satisfies HookConfig,
    },
    {
      id: "ie-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "age = 17", value: "17", output: "Store the age" } as BoxAnimationStep,
          { action: "read", label: "if age >= 18:", value: "17 >= 18?", output: "False — skip the if block" } as BoxAnimationStep,
          { action: "read", label: "else:", value: "condition was False", output: "Run the else block instead" } as BoxAnimationStep,
          { action: "read", label: "print('Minor')", value: "Minor", output: "Output: Minor" } as BoxAnimationStep,
          { action: "update", label: "age = 20", value: "17", newValue: "20", output: "Change age to 20" } as BoxAnimationStep,
          { action: "read", label: "if age >= 18:", value: "20 >= 18?", output: "True — run the if block" } as BoxAnimationStep,
          { action: "read", label: "print('Adult')", value: "Adult", output: "Output: Adult" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "ie-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "ie-p1",
            question: "score = 45. What prints?\nif score >= 50:\n    print('Pass')\nelse:\n    print('Fail')",
            answerType: "multiple-choice",
            options: ["Pass", "Fail", "Nothing", "Error"],
            correctAnswer: "Fail",
            feedbackCorrect: "45 >= 50 is False, so we skip to else and print 'Fail'.",
            feedbackWrong: "45 is less than 50, so the if condition is False and we run the else block.",
            xp: 15,
          },
          {
            id: "ie-p2",
            question: "How many elif blocks can you have?",
            answerType: "multiple-choice",
            options: ["Only 1", "Only 2", "As many as you need", "None"],
            correctAnswer: "As many as you need",
            feedbackCorrect: "You can chain as many elif conditions as you want. Only the first True one runs.",
            feedbackWrong: "elif can be repeated as many times as needed. Only the first matching condition runs.",
            xp: 10,
          },
          {
            id: "ie-p3",
            question: "x = 10. What prints?\nif x > 10:\n    print('A')\nelif x == 10:\n    print('B')\nelse:\n    print('C')",
            answerType: "multiple-choice",
            options: ["A", "B", "C", "A and B"],
            correctAnswer: "B",
            feedbackCorrect: "x > 10 is False. x == 10 is True → print B. Once a condition matches, the rest are skipped.",
            feedbackWrong: "Python checks each condition top to bottom. x > 10 fails, x == 10 succeeds → B.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "ie-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "if / elif / else — the decision tree",
            content: "Think of it like a bouncer at a club:\n\n**if** — check first condition. If True, do this.\n**elif** — check next condition. If True, do this instead.\n**else** — if nothing above matched, do this.\n\nOnly ONE block ever runs — the first one that's True.",
            example: "grade = 75\n\nif grade >= 90:\n    print('A')\nelif grade >= 75:\n    print('B')   # ← this runs\nelif grade >= 60:\n    print('C')\nelse:\n    print('Fail')",
          },
          {
            title: "Comparison operators",
            content: "These are the building blocks of every condition:\n\n== equals | != not equals\n> greater | < less\n>= greater or equal | <= less or equal\n\nRemember: = stores a value. == checks if two things are equal.",
            example: "x = 5\nprint(x == 5)   # True\nprint(x != 3)   # True\nprint(x > 10)   # False\nprint(x >= 5)   # True",
          },
          {
            title: "and / or / not",
            content: "You can combine conditions:\n\n**and** — both must be True\n**or** — at least one must be True\n**not** — flip True to False\n\nReal life: 'You can watch the movie IF you finished homework AND it's not past 10pm.'",
            example: "age = 17\nhas_id = True\n\nif age >= 18 and has_id:\n    print('Enter')\nelif age >= 16 or has_id:\n    print('Maybe')\nelse:\n    print('No entry')",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "ie-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is the difference between = and == in Python?",
            options: [
              "They are the same thing",
              "= stores a value, == checks if two values are equal",
              "== stores a value, = checks equality",
              "= is for numbers, == is for strings",
            ],
            correctIndex: 1,
            explanation: "= is assignment (storing). == is comparison (checking). Mixing them up is the most common Python bug.",
          },
          {
            question: "In an if/elif/else chain, how many blocks run?",
            options: ["All of them", "None of them", "Only the first True one", "The last one always"],
            correctIndex: 2,
            explanation: "Python checks from top to bottom. The first condition that is True runs its block, then Python skips the rest.",
          },
          {
            question: "score = 85. Which prints?\nif score >= 90: print('A')\nelif score >= 80: print('B')\nelif score >= 70: print('C')",
            options: ["A", "B", "C", "Nothing"],
            correctIndex: 1,
            explanation: "score >= 90 is False. score >= 80 is True → print B. C is never checked.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "ie-summary",
      type: "summary",
      config: {
        xpEarned: 90,
        title: "Decision Maker! 🤔",
        message: "Your programs can now think and decide. Every app, game, and website uses exactly what you just learned.",
        nextSession: "lists-basics",
      } satisfies SummaryConfig,
    },
  ],
}

// ──────────────────────────────────────────────────────
// LISTS SESSION
// ──────────────────────────────────────────────────────
,

{
  id: "session-lists",
  slug: "lists-basics",
  title: "Lists — Your First Data Structure",
  topic: "python-foundations",
  description: "Store many things in one place. Lists are Python's most-used data structure and the gateway to DSA.",
  estimatedMinutes: 15,
  xpTotal: 100,
  prerequisiteSessionSlug: "if-else-basics",
  nextSessionSlug: "strings-basics",
  stages: [
    {
      id: "ls-hook",
      type: "hook",
      config: {
        headline: "Your Spotify playlist. Your WhatsApp messages. Your Instagram feed.\nAll of them are lists.",
        subtext: "Lists are your first real data structure. Master this and the rest of DSA becomes 10x easier.",
        backgroundEmoji: "📋",
      } satisfies HookConfig,
    },
    {
      id: "ls-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 10, narration: "Create a list and add 10. It goes to index 0.", delayAfterMs: 1800 },
          { action: "insert", value: 20, narration: "Append 20. It goes to index 1. List grows from the right.", delayAfterMs: 1800 },
          { action: "insert", value: 30, narration: "Append 30 at index 2. O(1) — instant.", delayAfterMs: 1800 },
          { action: "insert", value: 40, narration: "Append 40. Index 3. Still O(1).", delayAfterMs: 1800 },
          { action: "search", value: 20, narration: "Access index 1 directly → 20. O(1) — no scanning needed!", delayAfterMs: 2200 },
          { action: "delete", value: 10, narration: "Remove 10 from front. Everything shifts left. O(n).", delayAfterMs: 2200 },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "ls-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "ls-p1",
            question: "fruits = ['apple', 'mango', 'banana']\nWhat is fruits[1]?",
            answerType: "multiple-choice",
            options: ["apple", "mango", "banana", "Error"],
            correctAnswer: "mango",
            feedbackCorrect: "Index 0 = apple, index 1 = mango, index 2 = banana. 0-based indexing!",
            feedbackWrong: "Python starts counting from 0. Index 1 is the second item = mango.",
            xp: 10,
          },
          {
            id: "ls-p2",
            question: "nums = [5, 10, 15]\nnums.append(20)\nWhat is len(nums)?",
            answerType: "multiple-choice",
            options: ["3", "4", "20", "Error"],
            correctAnswer: "4",
            feedbackCorrect: "append() adds one item. 3 items + 1 = 4. len() counts all items.",
            feedbackWrong: "append() adds 20 to the end. Now the list has 4 items: [5, 10, 15, 20].",
            xp: 10,
          },
          {
            id: "ls-p3",
            question: "nums = [1, 2, 3, 4, 5]\nWhat is nums[-1]?",
            answerType: "multiple-choice",
            options: ["1", "5", "Error", "-1"],
            correctAnswer: "5",
            feedbackCorrect: "Negative indexing: -1 is always the last item. Super useful!",
            feedbackWrong: "In Python, negative indices count from the end. -1 = last item = 5.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "ls-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Creating and accessing lists",
            content: "A list holds multiple values in order. Think of it as a numbered shelf — each slot has an index starting from 0.\n\n**Access:** list[index]\n**Negative index:** list[-1] is last item, list[-2] is second to last.\n**Length:** len(list) counts all items.",
            example: "shelf = ['book', 'pen', 'phone']\nprint(shelf[0])    # 'book'\nprint(shelf[-1])   # 'phone'\nprint(len(shelf))  # 3",
          },
          {
            title: "The 4 operations you'll use daily",
            content: "**append(x)** — add to end, O(1)\n**pop()** — remove from end, O(1)\n**insert(i, x)** — add at position i, O(n)\n**remove(x)** — remove first match, O(n)\n\nAppend and pop are fast. Insert and remove are slow because they shift elements.",
            example: "cart = ['rice', 'eggs']\ncart.append('milk')     # add to end\ncart.pop()              # remove last\ncart.insert(0, 'bread') # slow!\ncart.remove('eggs')     # slow!",
          },
          {
            title: "Looping through a list",
            content: "The most common thing you'll do with lists is loop through them. Two ways:\n\n**for item in list** — gives you each value\n**for i in range(len(list))** — gives you each index\n\nUse the first when you only need values. Use the second when you need to know the position.",
            example: "scores = [85, 92, 78, 95]\n\n# Print each score\nfor score in scores:\n    print(score)\n\n# Print with position\nfor i in range(len(scores)):\n    print(f'Student {i}: {scores[i]}')",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "ls-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "arr = [10, 20, 30]. What is arr[-1]?",
            options: ["10", "20", "30", "Error"],
            correctIndex: 2,
            explanation: "-1 always refers to the last element. arr[-1] = 30.",
          },
          {
            question: "Which operation is O(1) on a list?",
            options: ["insert at index 0", "remove a value", "append to end", "search for a value"],
            correctIndex: 2,
            explanation: "append() adds to the end without shifting anything — O(1). All others are O(n).",
          },
          {
            question: "How do you get the number of items in a list called data?",
            options: ["data.count()", "count(data)", "len(data)", "data.length"],
            correctIndex: 2,
            explanation: "len() is Python's built-in function to count items. It works on lists, strings, and more.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "ls-summary",
      type: "summary",
      config: {
        xpEarned: 100,
        title: "Data Structure Unlocked! 🗂️",
        message: "You just learned your first real data structure. Arrays/lists are the foundation of almost every DSA problem you'll ever solve.",
        nextSession: "strings-basics",
      } satisfies SummaryConfig,
    },
  ],
}

// ──────────────────────────────────────────────────────
// STRINGS SESSION
// ──────────────────────────────────────────────────────
,

{
  id: "session-strings",
  slug: "strings-basics",
  title: "Strings — Text Is Just a List of Letters",
  topic: "python-foundations",
  description: "Master Python strings — indexing, slicing, f-strings, and the methods that show up in every DSA problem.",
  estimatedMinutes: 13,
  xpTotal: 85,
  prerequisiteSessionSlug: "lists-basics",
  stages: [
    {
      id: "st-hook",
      type: "hook",
      config: {
        headline: "Every username, every password, every message you've ever sent.\nAll stored as strings.",
        subtext: "Strings are secretly just lists of characters. Master them and half of all Easy DSA problems become straightforward.",
        backgroundEmoji: "✍️",
      } satisfies HookConfig,
    },
    {
      id: "st-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "name = 'AlgoRich'", label: "Each character has an index: A=0, l=1, g=2..." } as TextFlowStep,
          { text: "name[0]  → 'A'", label: "Index 0 = first character, just like a list" } as TextFlowStep,
          { text: "name[-1] → 'h'", label: "Negative index: -1 = last character" } as TextFlowStep,
          { text: "name[0:4] → 'Algo'", label: "Slicing: start:end (end not included)" } as TextFlowStep,
          { text: "name.upper() → 'ALGORICH'", label: ".upper() makes all letters capital" } as TextFlowStep,
          { text: "len(name) → 8", label: "len() counts characters, same as with lists" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "st-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "st-p1",
            question: "s = 'Python'\nWhat is s[1:4]?",
            answerType: "multiple-choice",
            options: ["Pyt", "yth", "ytho", "ython"],
            correctAnswer: "yth",
            feedbackCorrect: "s[1:4] means index 1 up to (not including) index 4: y, t, h → 'yth'",
            feedbackWrong: "Slicing s[start:end] includes start, excludes end. s[1:4] = characters at 1, 2, 3 = 'yth'.",
            xp: 15,
          },
          {
            id: "st-p2",
            question: "What does 'hello'.upper() return?",
            answerType: "multiple-choice",
            options: ["hello", "Hello", "HELLO", "Error"],
            correctAnswer: "HELLO",
            feedbackCorrect: ".upper() converts every character to uppercase.",
            feedbackWrong: ".upper() makes all letters uppercase. 'hello'.upper() = 'HELLO'.",
            xp: 10,
          },
          {
            id: "st-p3",
            question: "name = 'Vani'\nWhat does f'Hello {name}!' print?",
            answerType: "multiple-choice",
            options: ["Hello {name}!", "Hello Vani!", "Hello name!", "Error"],
            correctAnswer: "Hello Vani!",
            feedbackCorrect: "f-strings replace {variable} with its value. f'Hello {name}!' → 'Hello Vani!'",
            feedbackWrong: "f-strings (f'...') replace anything inside {} with the variable's actual value.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "st-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Strings are lists of characters",
            content: "A string behaves just like a list. You can use index access, negative indexing, slicing — all the same rules.\n\n**s[i]** — character at index i\n**s[-1]** — last character\n**s[start:end]** — slice from start to end (not including end)\n**len(s)** — number of characters",
            example: "s = 'hello'\nprint(s[0])     # 'h'\nprint(s[-1])    # 'o'\nprint(s[1:4])   # 'ell'\nprint(len(s))   # 5",
          },
          {
            title: "The methods every DSA solver uses",
            content: "These 6 string methods appear in DSA problems constantly:\n\n**.lower()** / **.upper()** — change case\n**.strip()** — remove whitespace from ends\n**.split()** — split into a list of words\n**.replace(a,b)** — swap a for b\n**.count(x)** — count occurrences of x\n**x in s** — check if x is inside s",
            example: "s = '  Hello World  '\nprint(s.strip())          # 'Hello World'\nprint(s.lower())          # '  hello world  '\nprint(s.split())          # ['Hello', 'World']\nprint('ell' in 'hello')   # True",
          },
          {
            title: "f-strings — the modern way to format",
            content: "f-strings let you embed variables directly inside text. Put f before the quote, then {variable} wherever you want the value.\n\nThis replaces the old % formatting and .format() method. Use f-strings always.",
            example: "name = 'Vani'\nage = 19\nscore = 9.04\n\nprint(f'Name: {name}')\nprint(f'Age: {age}')\nprint(f'CGPA: {score:.2f}')  # 2 decimal places",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "st-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "s = 'coding'. What is s[2:5]?",
            options: ["cod", "din", "odi", "ding"],
            correctIndex: 1,
            explanation: "s[2:5] = characters at index 2, 3, 4 = d, i, n → 'din'",
          },
          {
            question: "How do you check if 'cat' is inside 'concatenate'?",
            options: ["'cat'.in('concatenate')", "'cat' in 'concatenate'", "contains('cat', 'concatenate')", "'concatenate'.find('cat') == True"],
            correctIndex: 1,
            explanation: "'cat' in 'concatenate' returns True. The in operator works on strings just like lists.",
          },
          {
            question: "What does 'hello world'.split() return?",
            options: ["'hello', 'world'", "['hello', 'world']", "['h','e','l','l','o',' ','w','o','r','l','d']", "Error"],
            correctIndex: 1,
            explanation: ".split() splits on whitespace by default and returns a list of words: ['hello', 'world'].",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "st-summary",
      type: "summary",
      config: {
        xpEarned: 85,
        title: "String Master! ✍️",
        message: "Strings unlocked. You now have all Python foundations needed to start solving real DSA problems.",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// WHILE LOOPS SESSION
// ──────────────────────────────────────────────────────

{
  id: "session-while-loops",
  slug: "while-loops",
  title: "While Loops — Repeat Until You Say Stop",
  topic: "python-foundations",
  description: "while loops keep running as long as a condition is true. Master this and you can automate anything.",
  estimatedMinutes: 12,
  xpTotal: 85,
  prerequisiteSessionSlug: "if-else-basics",
  nextSessionSlug: "functions-basics",
  stages: [
    {
      id: "wl-hook",
      type: "hook",
      config: {
        headline: "Your phone keeps checking for new messages until you put it down.\nThat's a while loop.",
        subtext: "In 12 minutes you'll understand the most powerful loop in programming — and when it can go wrong.",
        backgroundEmoji: "🔄",
      } satisfies HookConfig,
    },
    {
      id: "wl-watch",
      type: "watch",
      config: {
        visualizerType: "counter-animation",
        steps: [
          { code: "count = 1", counter: 1, narration: "Start: count is 1" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 1, output: "1 <= 3 is True → enter loop" } as CounterAnimationStep,
          { code: "    print(count)", counter: 1, output: "Prints: 1" } as CounterAnimationStep,
          { code: "    count += 1", counter: 2, output: "count is now 2" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 2, output: "2 <= 3 is True → loop again" } as CounterAnimationStep,
          { code: "    print(count)", counter: 2, output: "Prints: 2" } as CounterAnimationStep,
          { code: "    count += 1", counter: 3, output: "count is now 3" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 3, output: "3 <= 3 is True → loop again" } as CounterAnimationStep,
          { code: "    print(count)", counter: 3, output: "Prints: 3" } as CounterAnimationStep,
          { code: "    count += 1", counter: 4, output: "count is now 4" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 4, output: "4 <= 3 is False → EXIT loop" } as CounterAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "wl-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "wl-p1",
            question: "x = 10\nwhile x > 0:\n    x -= 3\nWhat is x when the loop ends?",
            answerType: "multiple-choice",
            options: ["-2", "0", "1", "-3"],
            correctAnswer: "-2",
            feedbackCorrect: "10→7→4→1→-2. At -2, condition x>0 is False and loop stops.",
            feedbackWrong: "Trace it: 10-3=7, 7-3=4, 4-3=1, 1-3=-2. Now -2>0 is False so loop stops at -2.",
            xp: 15,
          },
          {
            id: "wl-p2",
            question: "What is an infinite loop?",
            answerType: "multiple-choice",
            options: [
              "A loop that runs exactly 10 times",
              "A loop whose condition never becomes False",
              "A loop inside another loop",
              "A loop with no body",
            ],
            correctAnswer: "A loop whose condition never becomes False",
            feedbackCorrect: "If the condition stays True forever, the loop never stops — infinite loop!",
            feedbackWrong: "An infinite loop happens when the condition is always True and never changes.",
            xp: 10,
          },
          {
            id: "wl-p3",
            question: "When should you use while instead of for?",
            answerType: "multiple-choice",
            options: [
              "When you know exactly how many times to loop",
              "When you don't know how many times to loop",
              "When looping over a list",
              "When looping over a string",
            ],
            correctAnswer: "When you don't know how many times to loop",
            feedbackCorrect: "Use while when the number of iterations depends on a condition, not a count.",
            feedbackWrong: "for is for known counts. while is for 'keep going until something happens'.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "wl-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "while vs for — when to use each",
            content: "**for loop** — use when you know how many times:\n• Loop through a list\n• Count from 1 to 10\n• Repeat exactly N times\n\n**while loop** — use when you don't know how many times:\n• Keep asking for input until valid\n• Keep retrying until success\n• Game loop: play until player quits",
            example: "# for: known count\nfor i in range(5):\n    print(i)\n\n# while: unknown count\npassword = ''\nwhile password != 'secret':\n    password = input('Enter password: ')",
          },
          {
            title: "break and continue",
            content: "**break** — exit the loop immediately, even if condition is still True\n**continue** — skip the rest of this iteration, go to next\n\nThink of break as an emergency exit. Think of continue as 'skip this one, keep going'.",
            example: "# break: stop when found\nfor num in [1, 2, 3, 4, 5]:\n    if num == 3:\n        break\n    print(num)   # prints 1, 2\n\n# continue: skip evens\nfor num in range(6):\n    if num % 2 == 0:\n        continue\n    print(num)   # prints 1, 3, 5",
          },
          {
            title: "Always have an exit condition",
            content: "Every while loop MUST eventually become False or have a break. Forgetting this creates an infinite loop — your program freezes forever.\n\nRule: every time you write while, immediately ask yourself: 'What makes this stop?'",
            example: "# DANGEROUS — infinite loop!\ncount = 0\nwhile count < 10:\n    print(count)\n    # forgot count += 1 !\n\n# SAFE\ncount = 0\nwhile count < 10:\n    print(count)\n    count += 1  # ← always update!",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "wl-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "n = 5. How many times does this loop run?\nwhile n > 0:\n    n -= 2",
            options: ["2", "3", "5", "infinite"],
            correctIndex: 1,
            explanation: "5→3→1→-1. Loop runs 3 times: n=5(True), n=3(True), n=1(True), n=-1(False, stop).",
          },
          {
            question: "What does break do inside a loop?",
            options: [
              "Skips current iteration",
              "Exits the loop immediately",
              "Restarts the loop",
              "Pauses the loop",
            ],
            correctIndex: 1,
            explanation: "break immediately exits the loop, regardless of whether the condition is still True.",
          },
          {
            question: "Which is better for looping through a list?",
            options: ["while", "for", "They are identical", "Neither works"],
            correctIndex: 1,
            explanation: "for is designed for iterating over sequences. while is for condition-based repetition.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "wl-summary",
      type: "summary",
      config: {
        xpEarned: 85,
        title: "Loop Master! 🔄",
        message: "You now control both types of loops. For loops for counting, while loops for conditions. This is the foundation of every algorithm.",
        nextSession: "functions-basics",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// TYPE CONVERSION SESSION
// ──────────────────────────────────────────────────────

{
  id: "session-type-conversion",
  slug: "type-conversion",
  title: "Type Conversion — Changing What Things Are",
  topic: "python-foundations",
  description: "Convert between int, float, str, and bool. The skill that prevents 90% of beginner bugs.",
  estimatedMinutes: 10,
  xpTotal: 75,
  prerequisiteSessionSlug: "data-types",
  nextSessionSlug: "if-else-basics",
  stages: [
    {
      id: "tc-hook",
      type: "hook",
      config: {
        headline: "Your app asks for a user's age. They type '17'.\nBut '17' is text — you can't do math with it yet.",
        subtext: "Type conversion is how you turn text into numbers and back. Every real app uses this constantly.",
        backgroundEmoji: "🔄",
      } satisfies HookConfig,
    },
    {
      id: "tc-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "age_text = '17'", value: "'17'", output: "This is a string — can't do math!" } as BoxAnimationStep,
          { action: "update", label: "age = int('17')", value: "'17'", newValue: "17", output: "int() converts string → integer" } as BoxAnimationStep,
          { action: "read", label: "age + 1", value: "17", output: "18 ✓ Now we can do math" } as BoxAnimationStep,
          { action: "create", label: "price = 9.99", value: "9.99", output: "This is a float" } as BoxAnimationStep,
          { action: "update", label: "int(price)", value: "9.99", newValue: "9", output: "int() cuts the decimal — no rounding!" } as BoxAnimationStep,
          { action: "create", label: "score = 100", value: "100", output: "This is an int" } as BoxAnimationStep,
          { action: "update", label: "str(score)", value: "100", newValue: "'100'", output: "str() converts to text for printing" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "tc-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "tc-p1",
            question: "What does int(3.9) return?",
            answerType: "multiple-choice",
            options: ["4", "3", "3.9", "Error"],
            correctAnswer: "3",
            feedbackCorrect: "int() truncates (cuts off) the decimal — it does NOT round. 3.9 → 3.",
            feedbackWrong: "int() cuts the decimal part, it doesn't round. 3.9 becomes 3, not 4.",
            xp: 10,
          },
          {
            id: "tc-p2",
            question: "x = input('Enter age: ')  # user types 20\nWhat type is x?",
            answerType: "multiple-choice",
            options: ["int", "float", "str", "bool"],
            correctAnswer: "str",
            feedbackCorrect: "input() ALWAYS returns a string, even if the user types a number. Always convert!",
            feedbackWrong: "input() always returns str. Even if user types 20, x is '20' not 20. Use int(input()) to get a number.",
            xp: 15,
          },
          {
            id: "tc-p3",
            question: "What does bool(0) return?",
            answerType: "multiple-choice",
            options: ["True", "False", "0", "Error"],
            correctAnswer: "False",
            feedbackCorrect: "0 is falsy in Python. bool(0) = False. Any non-zero number is True.",
            feedbackWrong: "In Python: 0, '', [], None are all falsy (convert to False). Everything else is True.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "tc-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The 4 conversion functions",
            content: "**int(x)** — convert to whole number (cuts decimals)\n**float(x)** — convert to decimal number\n**str(x)** — convert to text\n**bool(x)** — convert to True/False\n\nThese are the most used functions in every Python program.",
            example: "int('42')      # 42\nint(3.9)       # 3  (truncates!)\nfloat('3.14')  # 3.14\nstr(100)       # '100'\nbool(0)        # False\nbool('hello')  # True",
          },
          {
            title: "input() always gives you a string",
            content: "This catches every beginner. input() returns str no matter what the user types.\n\nIf you need a number from input, wrap it: int(input()) or float(input()).\n\nThis is the number 1 source of TypeError bugs in beginner code.",
            example: "# WRONG — x is a string!\nage = input('Age: ')\nif age > 18:  # TypeError!\n    print('Adult')\n\n# CORRECT\nage = int(input('Age: '))\nif age > 18:\n    print('Adult')",
          },
          {
            title: "Truthiness — every value has a bool",
            content: "Python evaluates any value as True or False in an if statement.\n\n**Falsy** (become False): 0, 0.0, '', [], {}, None\n**Truthy** (become True): everything else\n\nThis is used constantly in DSA problems.",
            example: "# These all count as False:\nif 0: print('no')\nif '': print('no')\nif []: print('no')\n\n# These are True:\nif 1: print('yes')\nif 'hi': print('yes')\nif [1,2]: print('yes')",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "tc-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What does int('7.5') return?",
            options: ["7", "8", "7.5", "Error"],
            correctIndex: 3,
            explanation: "int() cannot convert a float-string directly. You'd need int(float('7.5')). int('7.5') raises a ValueError.",
          },
          {
            question: "name = input('Name: ')  — what type is name?",
            options: ["int", "float", "str", "depends on what user types"],
            correctIndex: 2,
            explanation: "input() always returns str, regardless of what the user types. Always.",
          },
          {
            question: "Which values are falsy in Python?",
            options: [
              "Only False",
              "False, 0, '', [], None",
              "False and None only",
              "Only 0 and False",
            ],
            correctIndex: 1,
            explanation: "Falsy values: False, 0, 0.0, '', [], {}, set(), None. All others are truthy.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "tc-summary",
      type: "summary",
      config: {
        xpEarned: 75,
        title: "Type Converter! 🔄",
        message: "You can now safely convert between types. This eliminates the most common beginner bugs instantly.",
        nextSession: "if-else-basics",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// FUNCTIONS SCOPE SESSION
// ──────────────────────────────────────────────────────

{
  id: "session-functions-scope",
  slug: "functions-scope",
  title: "Scope & Built-ins — Where Variables Live",
  topic: "python-foundations",
  description: "Why can't you use a variable from inside a function outside it? Scope explains everything.",
  estimatedMinutes: 11,
  xpTotal: 80,
  prerequisiteSessionSlug: "functions-basics",
  nextSessionSlug: "lists-basics",
  stages: [
    {
      id: "fs-hook",
      type: "hook",
      config: {
        headline: "Imagine every classroom has its own whiteboard.\nWhat's written in Room A doesn't exist in Room B.",
        subtext: "That's scope. In 11 minutes you'll understand why variables disappear and how to use Python's built-in tools.",
        backgroundEmoji: "🏫",
      } satisfies HookConfig,
    },
    {
      id: "fs-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "name = 'Vani'  # global", value: "'Vani'", output: "Global scope — visible everywhere" } as BoxAnimationStep,
          { action: "create", label: "def greet():", value: "function", output: "Function creates its own scope (room)" } as BoxAnimationStep,
          { action: "create", label: "    message = 'Hello'", value: "'Hello'", output: "Local variable — only lives inside greet()" } as BoxAnimationStep,
          { action: "read", label: "    print(name)", value: "'Vani'", output: "Can READ global variables from inside" } as BoxAnimationStep,
          { action: "read", label: "greet()", value: "Hello Vani", output: "Function runs fine" } as BoxAnimationStep,
          { action: "read", label: "print(message)", value: "ERROR", output: "NameError: message only existed inside greet!" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "fs-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "fs-p1",
            question: "x = 10\ndef double():\n    x = x * 2\n    return x\ndouble()\nWhat is the global x after calling double()?",
            answerType: "multiple-choice",
            options: ["20", "10", "Error", "None"],
            correctAnswer: "10",
            feedbackCorrect: "The function creates its own local x = 20. The global x is untouched — still 10.",
            feedbackWrong: "Functions work on their own copy. The global x stays 10 unless you use global keyword.",
            xp: 15,
          },
          {
            id: "fs-p2",
            question: "What does max([3, 1, 4, 1, 5, 9]) return?",
            answerType: "multiple-choice",
            options: ["3", "1", "9", "5"],
            correctAnswer: "9",
            feedbackCorrect: "max() is a Python built-in that returns the largest value in a list.",
            feedbackWrong: "max() scans the entire list and returns the maximum value = 9.",
            xp: 10,
          },
          {
            id: "fs-p3",
            question: "Which built-in sorts a list in place?",
            answerType: "multiple-choice",
            options: ["sorted(list)", "list.sort()", "sort(list)", "list.sorted()"],
            correctAnswer: "list.sort()",
            feedbackCorrect: "list.sort() modifies the list directly. sorted(list) returns a new sorted list.",
            feedbackWrong: "list.sort() modifies in place (no return value). sorted(list) creates a new sorted list.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "fs-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Local vs Global scope",
            content: "**Global** — variables defined outside all functions. Visible everywhere.\n**Local** — variables defined inside a function. Disappear when function ends.\n\nFunctions can READ globals but cannot MODIFY them (without the global keyword).\n\nThis is by design — it prevents functions from accidentally breaking each other.",
            example: "total = 0  # global\n\ndef add(n):\n    result = n + 1  # local\n    return result\n\nprint(total)   # 0 ✓\nprint(result)  # NameError! result is gone",
          },
          {
            title: "Built-in functions you need daily",
            content: "Python ships with powerful tools. Stop writing these yourself:\n\n**len(x)** — length of list/string\n**max(x)** / **min(x)** — largest/smallest\n**sum(x)** — total of all numbers\n**sorted(x)** — new sorted list\n**range(n)** — generate numbers 0 to n-1\n**abs(x)** — absolute value\n**round(x, n)** — round to n decimals",
            example: "nums = [3, 1, 4, 1, 5, 9]\nprint(len(nums))      # 6\nprint(max(nums))      # 9\nprint(min(nums))      # 1\nprint(sum(nums))      # 23\nprint(sorted(nums))   # [1,1,3,4,5,9]",
          },
          {
            title: "Parameters are local variables",
            content: "When you pass a value into a function, Python creates a local copy. Changing it inside the function does NOT affect the original.\n\nException: if you pass a list and MODIFY it (not reassign), the change IS visible outside. This trips up everyone — remember it.",
            example: "def double(n):    # n is a local copy\n    n = n * 2\n    return n\n\nx = 5\ndouble(x)\nprint(x)   # still 5! original unchanged\n\n# But lists are different:\ndef add_item(lst):\n    lst.append(99)  # modifies original!\n\nnums = [1, 2]\nadd_item(nums)\nprint(nums)  # [1, 2, 99]",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "fs-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "A variable defined inside a function is called:",
            options: ["global", "local", "private", "inner"],
            correctIndex: 1,
            explanation: "Variables inside functions are local — they exist only during the function's execution.",
          },
          {
            question: "What does sum([1, 2, 3, 4]) return?",
            options: ["4", "10", "24", "Error"],
            correctIndex: 1,
            explanation: "sum() adds all elements: 1+2+3+4 = 10.",
          },
          {
            question: "After calling a function with a list argument, can the list be modified?",
            options: [
              "No, functions always get a copy",
              "Yes, if the function uses .append() or .remove()",
              "Only if you use return",
              "Only with global keyword",
            ],
            correctIndex: 1,
            explanation: "Lists are passed by reference. If the function calls .append()/.remove(), the original list changes. Reassigning the parameter (lst = []) does not.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "fs-summary",
      type: "summary",
      config: {
        xpEarned: 80,
        title: "Scope Expert! 🏫",
        message: "You now understand where variables live and die. This prevents some of the most confusing bugs in Python.",
        nextSession: "lists-basics",
      } satisfies SummaryConfig,
    },
  ],
}

// ══════════════════════════════════════════════════════
// PHASE 2 — LOGIC BUILDING
// ══════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────
// S1: Breaking Problems Into Steps
// ──────────────────────────────────────────────────────

];