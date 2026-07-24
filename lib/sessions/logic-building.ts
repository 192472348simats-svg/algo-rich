// d:/Projects/DSA/algo-rich/lib/sessions/logic-building.ts
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
  id: "session-problem-thinking",
  slug: "problem-thinking",
  title: "Thinking Like a Programmer — Break It Down",
  topic: "logic-building",
  description: "Every hard problem is just several easy problems stacked. Learn the 5-step framework used by every software engineer.",
  estimatedMinutes: 13,
  xpTotal: 90,
  nextSessionSlug: "brute-force-first",
  stages: [
    {
      id: "pt-hook",
      type: "hook",
      config: {
        headline: "Nobody sits down and writes a perfect solution in one go.\nNot even senior engineers at Google.",
        subtext: "They use a framework. In 13 minutes you'll have the same framework — and it works on every problem forever.",
        backgroundEmoji: "🧠",
      } satisfies HookConfig,
    },
    {
      id: "pt-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "Problem: Find the largest number in a list", label: "Step 1 — UNDERSTAND: What are the inputs? What should come out?" } as TextFlowStep,
          { text: "Input: [3, 7, 1, 9, 4] → Output: 9", label: "Step 2 — EXAMPLE: Write a small example by hand first" } as TextFlowStep,
          { text: "Start with first number. Compare each next number.", label: "Step 3 — PLAN: Describe the steps in plain English" } as TextFlowStep,
          { text: "largest = nums[0]\nfor num in nums:\n    if num > largest:\n        largest = num", label: "Step 4 — CODE: Translate your plan into Python" } as TextFlowStep,
          { text: "Test with [3,7,1,9,4] → 9 ✓\nTest with [1] → 1 ✓\nTest with [] → crash! Fix needed", label: "Step 5 — TEST: Try normal cases AND edge cases" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "pt-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "pt-p1",
            question: "What should you do BEFORE writing any code?",
            answerType: "multiple-choice",
            options: [
              "Open your editor and start typing",
              "Understand the problem and write an example by hand",
              "Search Stack Overflow",
              "Memorize the solution",
            ],
            correctAnswer: "Understand the problem and write an example by hand",
            feedbackCorrect: "Always understand + example first. Code written without a plan is almost always wrong.",
            feedbackWrong: "Jumping to code is the #1 reason beginners get stuck. Understand → Example → Plan → Code → Test.",
            xp: 15,
          },
          {
            id: "pt-p2",
            question: "What is an edge case?",
            answerType: "multiple-choice",
            options: [
              "A case that happens most often",
              "An unusual input that can break your solution",
              "A case at the edge of the screen",
              "The last test case",
            ],
            correctAnswer: "An unusual input that can break your solution",
            feedbackCorrect: "Edge cases: empty list, single element, all negatives, duplicates. Always test these!",
            feedbackWrong: "Edge cases are unusual inputs like empty lists, negative numbers, or duplicates that break naive solutions.",
            xp: 10,
          },
          {
            id: "pt-p3",
            question: "You need to count vowels in a string. What's your FIRST step?",
            answerType: "multiple-choice",
            options: [
              "Write a for loop",
              "Import a library",
              "Write down what vowels are and try an example by hand",
              "Google the answer",
            ],
            correctAnswer: "Write down what vowels are and try an example by hand",
            feedbackCorrect: "Step 1 always: understand + example. For 'hello' → e, o → count is 2.",
            feedbackWrong: "Always start with understanding. What are vowels? Write 'hello' → find e, o → that's 2. NOW write code.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "pt-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The 5-step framework",
            content: "Use this on every single problem:\n\n1. **Understand** — What goes in? What comes out? Any constraints?\n2. **Example** — Work through a small example by hand\n3. **Plan** — Write steps in plain English (no code yet)\n4. **Code** — Translate your plan line by line\n5. **Test** — Try normal cases, then edge cases\n\nThis framework is used by engineers at every level.",
            example: "Problem: Sum all even numbers in a list\n\n1. Input: list of ints → Output: one int\n2. [1,2,3,4] → 2+4 = 6\n3. Loop through list. If number is even, add to total.\n4. total = 0\n   for n in nums:\n       if n % 2 == 0:\n           total += n\n5. Test [1,2,3,4]→6 ✓, []→0 ✓",
          },
          {
            title: "% (modulo) — the most useful operator",
            content: "The % operator gives you the remainder after division.\n\n5 % 2 = 1 (5 divided by 2 leaves remainder 1)\n6 % 2 = 0 (6 divided by 2 leaves no remainder)\n\n**Key insight**: if n % 2 == 0, the number is even. This pattern appears in hundreds of DSA problems.",
            example: "# Check even/odd\nfor n in range(10):\n    if n % 2 == 0:\n        print(f'{n} is even')\n    else:\n        print(f'{n} is odd')\n\n# Every 3rd item\nfor i in range(9):\n    if i % 3 == 0:\n        print(f'index {i}')",
          },
          {
            title: "Talking through your thinking",
            content: "In interviews, thinking out loud IS the skill being tested — not the final answer.\n\nPractice saying:\n• 'My inputs are X, my output should be Y'\n• 'Let me try an example: if input is..., then...'\n• 'My approach is to..., which would be O(n)'\n• 'Edge cases I should check: empty input, negatives'\n\nStart doing this now, even when alone.",
            example: "# Instead of staring blankly, say out loud:\n# 'OK so I need to find duplicates in a list.'\n# 'Example: [1,2,2,3] → True (2 is duplicate)'\n# 'Plan: use a set. If I see a number already\n#  in the set, it is a duplicate.'\n# 'Time: O(n), Space: O(n)'\n# THEN write the code.",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "pt-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What does n % 2 == 0 check?",
            options: ["n is odd", "n is even", "n is positive", "n is divisible by 3"],
            correctIndex: 1,
            explanation: "% gives the remainder. n % 2 == 0 means no remainder when divided by 2 → even number.",
          },
          {
            question: "In the 5-step framework, what comes AFTER writing an example?",
            options: ["Write code", "Plan in plain English", "Test edge cases", "Search online"],
            correctIndex: 1,
            explanation: "Understand → Example → Plan (English) → Code → Test. Planning before coding saves hours.",
          },
          {
            question: "Which is an edge case for a function that finds the minimum of a list?",
            options: ["[3, 1, 4]", "[1, 2, 3, 4, 5]", "[]", "[100, 200]"],
            correctIndex: 2,
            explanation: "An empty list [] is an edge case — your function would crash without handling it.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "pt-summary",
      type: "summary",
      config: {
        xpEarned: 90,
        title: "Framework Unlocked! 🧠",
        message: "You now have the same problem-solving framework senior engineers use. Apply it to every problem from here on.",
        nextSession: "brute-force-first",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// S2: Brute Force First
// ──────────────────────────────────────────────────────

{
  id: "session-brute-force",
  slug: "brute-force-first",
  title: "Brute Force First — Then Optimize",
  topic: "logic-building",
  description: "The secret every good programmer knows: always start with the slow solution. Then make it fast.",
  estimatedMinutes: 14,
  xpTotal: 95,
  prerequisiteSessionSlug: "problem-thinking",
  nextSessionSlug: "big-o-basics",
  stages: [
    {
      id: "bf-hook",
      type: "hook",
      config: {
        headline: "Interviewers don't expect perfection immediately.\nThey want to see your thinking process.",
        subtext: "A working slow solution beats a broken fast one every time. In 14 minutes you'll learn why — and how to improve from there.",
        backgroundEmoji: "⚡",
      } satisfies HookConfig,
    },
    {
      id: "bf-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "Problem: Find two numbers that add up to target", label: "Two Sum — one of the most common interview problems" } as TextFlowStep,
          { text: "BRUTE FORCE:\nfor i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:", label: "Check every pair. Simple to understand. O(n²) — slow for large inputs." } as TextFlowStep,
          { text: "[2,7,11,15] target=9\nCheck 2+7=9 ✓ → found at index 0,1", label: "Works correctly — just not efficiently" } as TextFlowStep,
          { text: "OPTIMIZED:\nseen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:", label: "Use a hash map. One pass. O(n) — much faster." } as TextFlowStep,
          { text: "Brute: O(n²)\nOptimized: O(n)\nFor n=1,000,000: 1 trillion ops vs 1 million ops", label: "This is why optimization matters at scale" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "bf-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bf-p1",
            question: "You have a working O(n²) solution. What should you do?",
            answerType: "multiple-choice",
            options: [
              "Throw it away and start over",
              "Submit it, then explain how you'd optimize",
              "Never submit it",
              "Optimize before writing anything",
            ],
            correctAnswer: "Submit it, then explain how you'd optimize",
            feedbackCorrect: "A working solution + optimization plan beats a broken optimal solution every time.",
            feedbackWrong: "Working brute force + explaining optimizations is the correct interview approach.",
            xp: 15,
          },
          {
            id: "bf-p2",
            question: "A nested loop (loop inside loop) usually has what complexity?",
            answerType: "multiple-choice",
            options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
            correctAnswer: "O(n²)",
            feedbackCorrect: "For each of n elements, you loop n times again → n × n = O(n²).",
            feedbackWrong: "Two nested loops = O(n²). For n=1000: 1,000,000 operations. Gets slow fast.",
            xp: 10,
          },
          {
            id: "bf-p3",
            question: "What data structure makes 'have I seen this before?' O(1)?",
            answerType: "multiple-choice",
            options: ["List", "Set or Dictionary", "Tuple", "String"],
            correctAnswer: "Set or Dictionary",
            feedbackCorrect: "set and dict use hash tables. Checking 'x in my_set' is O(1) — instant lookup.",
            feedbackWrong: "Sets and dicts use hashing. 'x in my_set' is O(1). 'x in my_list' is O(n).",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "bf-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The brute force → optimize pattern",
            content: "For every problem:\n\n1. Write the simplest solution first (usually nested loops)\n2. Make sure it's correct\n3. Ask: 'What's slow here? What's being repeated?'\n4. Find the right data structure to eliminate the repetition\n\nThis is how 90% of optimization works in DSA.",
            example: "# Brute: O(n²) — check every pair\ndef has_duplicate_slow(nums):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False\n\n# Optimized: O(n) — use a set\ndef has_duplicate_fast(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False",
          },
          {
            title: "Sets — the brute force killer",
            content: "A set stores unique values and answers 'is X in here?' in O(1).\n\nWhenever your brute force is checking 'did I see this before?' or 'does this exist somewhere?', a set turns that O(n) scan into O(1).\n\nThis single insight solves hundreds of DSA problems.",
            example: "# Without set: O(n) scan each time\nif target in my_list:  # O(n)\n\n# With set: O(1) lookup\nmy_set = set(my_list)   # O(n) to build\nif target in my_set:    # O(1) !\n\n# Set operations\ns = {1, 2, 3}\ns.add(4)        # O(1)\n4 in s          # O(1)\ns.remove(2)     # O(1)",
          },
          {
            title: "Dictionaries — sets with values attached",
            content: "A dict is like a set but each key has a value attached.\n\nUse a dict when you need to remember not just 'did I see X' but also 'where/how many times did I see X'.\n\nThis pattern — counting, indexing, mapping — appears constantly in DSA.",
            example: "# Count frequency: O(n)\ndef count_chars(s):\n    freq = {}\n    for char in s:\n        if char in freq:\n            freq[char] += 1\n        else:\n            freq[char] = 1\n    return freq\n\n# Shorter with .get()\ndef count_chars(s):\n    freq = {}\n    for char in s:\n        freq[char] = freq.get(char, 0) + 1\n    return freq",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "bf-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is the time complexity of checking 'x in my_set'?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctIndex: 2,
            explanation: "Set lookup uses hashing — direct access, no scanning. Always O(1).",
          },
          {
            question: "You need to count how many times each number appears in a list. Best data structure?",
            options: ["List", "Set", "Dictionary", "Tuple"],
            correctIndex: 2,
            explanation: "Dict maps each number (key) to its count (value). Perfect for frequency counting.",
          },
          {
            question: "Your nested loop solution is O(n²). What's the first question to ask to optimize?",
            options: [
              "How do I sort this?",
              "What am I repeatedly looking up that a set/dict could answer in O(1)?",
              "Should I use recursion?",
              "Can I use a library?",
            ],
            correctIndex: 1,
            explanation: "Most O(n²) → O(n) optimizations come from replacing a repeated lookup with a set or dict.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "bf-summary",
      type: "summary",
      config: {
        xpEarned: 95,
        title: "Optimizer Unlocked! ⚡",
        message: "Brute force first, then optimize. This mindset separates problem solvers from code memorizers.",
        nextSession: "big-o-basics",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// S3: Big-O Basics
// ──────────────────────────────────────────────────────

{
  id: "session-big-o",
  slug: "big-o-basics",
  title: "Big-O — How Fast Is Your Code?",
  topic: "logic-building",
  description: "Big-O tells you how your code slows down as input grows. Every interviewer asks this. Understand it forever in 15 minutes.",
  estimatedMinutes: 15,
  xpTotal: 100,
  prerequisiteSessionSlug: "brute-force-first",
  nextSessionSlug: "big-o-reading",
  stages: [
    {
      id: "bo-hook",
      type: "hook",
      config: {
        headline: "Your solution works on 10 items.\nWill it still work on 10 million?",
        subtext: "Big-O is how you answer that question. Every single interview asks it. In 15 minutes you'll speak it fluently.",
        backgroundEmoji: "📈",
      } satisfies HookConfig,
    },
    {
      id: "bo-watch",
      type: "watch",
      config: {
        visualizerType: "counter-animation",
        steps: [
          { code: "# O(1) — constant", counter: 1, output: "Always 1 operation. Doesn't matter if list has 10 or 10M items." } as CounterAnimationStep,
          { code: "nums[0]  # index access", counter: 1, output: "Direct memory access → O(1)" } as CounterAnimationStep,
          { code: "# O(n) — linear", counter: "n", output: "Operations grow with input size." } as CounterAnimationStep,
          { code: "for num in nums:", counter: "n", output: "Visit each element once → O(n)" } as CounterAnimationStep,
          { code: "# O(n²) — quadratic", counter: "n²", output: "For n=1000: 1,000,000 operations!" } as CounterAnimationStep,
          { code: "for i in nums:\n    for j in nums:", counter: "n²", output: "Nested loops → O(n²)" } as CounterAnimationStep,
          { code: "# O(log n) — logarithmic", counter: "log n", output: "Halves the problem each step. Super fast!" } as CounterAnimationStep,
          { code: "# Binary search", counter: "log n", output: "For n=1,000,000: only ~20 operations!" } as CounterAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "bo-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bo-p1",
            question: "What is the Big-O of accessing nums[5]?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctAnswer: "O(1)",
            feedbackCorrect: "Index access calculates memory address directly — no scanning. Always O(1).",
            feedbackWrong: "Array index access is O(1). The computer knows exactly where index 5 is in memory.",
            xp: 10,
          },
          {
            id: "bo-p2",
            question: "n = 1000. Roughly how many operations does O(n²) do?",
            answerType: "multiple-choice",
            options: ["1,000", "10,000", "1,000,000", "1,000,000,000"],
            correctAnswer: "1,000,000",
            feedbackCorrect: "n² = 1000² = 1,000,000. This is why nested loops on large inputs are slow.",
            feedbackWrong: "O(n²) means n × n operations. 1000 × 1000 = 1,000,000.",
            xp: 15,
          },
          {
            id: "bo-p3",
            question: "Which grows SLOWEST as n increases?",
            answerType: "multiple-choice",
            options: ["O(n²)", "O(n)", "O(log n)", "O(1)"],
            correctAnswer: "O(1)",
            feedbackCorrect: "O(1) never grows — constant time regardless of input size. Best possible.",
            feedbackWrong: "From best to worst: O(1) < O(log n) < O(n) < O(n²). O(1) is always fastest.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "bo-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The Big-O hierarchy — memorize this",
            content: "From fastest to slowest:\n\n**O(1)** — constant: index access, dict lookup\n**O(log n)** — logarithmic: binary search\n**O(n)** — linear: one loop through n items\n**O(n log n)** — sort algorithms\n**O(n²)** — quadratic: nested loops\n**O(2ⁿ)** — exponential: avoid at all costs\n\nFor n = 1 million: O(1)=instant, O(n)=fast, O(n²)=crash",
            example: "n = 1_000_000\n\nO(1):     1 operation\nO(log n): ~20 operations\nO(n):     1,000,000 ops\nO(n²):    1,000,000,000,000 ops\n# O(n²) would take ~16 minutes!\n# O(n) takes milliseconds",
          },
          {
            title: "How to calculate Big-O",
            content: "Rules:\n1. Drop constants: O(2n) → O(n)\n2. Drop smaller terms: O(n² + n) → O(n²)\n3. One loop = O(n)\n4. Nested loops = O(n²)\n5. Halving each step = O(log n)\n\nYou only care about what happens when n gets HUGE.",
            example: "# Count operations, then simplify:\n\ndef example(nums):\n    x = nums[0]          # O(1)\n    for n in nums:       # O(n)\n        print(n)         # O(1) each\n    for i in nums:       # O(n)\n        for j in nums:   # O(n)\n            pass         # O(n²) total\n# Total: O(1 + n + n²) → O(n²)",
          },
          {
            title: "Space complexity",
            content: "Big-O also applies to memory, not just time.\n\n**O(1) space** — fixed memory regardless of input\n**O(n) space** — memory grows with input (e.g. creating a new list)\n\nInterviewers ask both. 'What's the time and space complexity?' is the most common follow-up question.",
            example: "# O(1) space — no extra memory\ndef sum_list(nums):\n    total = 0           # 1 variable\n    for n in nums:\n        total += n\n    return total\n\n# O(n) space — creates new list\ndef double_all(nums):\n    result = []         # grows with input\n    for n in nums:\n        result.append(n * 2)\n    return result",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "bo-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "A function has two separate loops (not nested). What is its Big-O?",
            options: ["O(1)", "O(n²)", "O(n)", "O(2n)"],
            correctIndex: 2,
            explanation: "Two separate loops = O(n) + O(n) = O(2n) → drop constant → O(n).",
          },
          {
            question: "What is the time complexity of Python's sorted() function?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correctIndex: 1,
            explanation: "Python's sort uses Timsort which is O(n log n). This is the theoretical best for comparison-based sorting.",
          },
          {
            question: "Your solution uses O(1) time but O(n) space. Is this better or worse than O(n) time O(1) space?",
            options: [
              "Always better",
              "Always worse",
              "Depends on whether time or memory is the bottleneck",
              "They are identical",
            ],
            correctIndex: 2,
            explanation: "This is a trade-off. In interviews, mention both and explain the context. Neither is universally better.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "bo-summary",
      type: "summary",
      config: {
        xpEarned: 100,
        title: "Complexity Analyst! 📈",
        message: "You can now read and write Big-O. Every DSA problem from here asks for this — you're ready.",
        nextSession: "big-o-reading",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// S4: Reading & Writing Big-O
// ──────────────────────────────────────────────────────

{
  id: "session-big-o-reading",
  slug: "big-o-reading",
  title: "Reading Code Like a Pro — Spot the Complexity",
  topic: "logic-building",
  description: "Look at any code and immediately know its Big-O. This is the skill that impresses interviewers most.",
  estimatedMinutes: 12,
  xpTotal: 90,
  prerequisiteSessionSlug: "big-o-basics",
  nextSessionSlug: "arrays-and-big-o",
  stages: [
    {
      id: "bor-hook",
      type: "hook",
      config: {
        headline: "In an interview, you'll be shown code you've never seen.\nYou'll have 30 seconds to say its complexity.",
        subtext: "This session is pure practice. By the end you'll read Big-O as fast as you read English.",
        backgroundEmoji: "👁️",
      } satisfies HookConfig,
    },
    {
      id: "bor-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "def find_max(nums):\n    best = nums[0]\n    for n in nums:\n        if n > best:\n            best = n\n    return best", label: "One loop, no nesting → O(n) time, O(1) space" } as TextFlowStep,
          { text: "def has_pair(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i]+nums[j]==target:\n                return True", label: "Nested loops → O(n²) time, O(1) space" } as TextFlowStep,
          { text: "def binary_search(nums, target):\n    lo, hi = 0, len(nums)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if nums[mid]==target: return mid\n        elif nums[mid]<target: lo=mid+1\n        else: hi=mid-1", label: "Halves search space each step → O(log n) time O(1) space" } as TextFlowStep,
          { text: "def unique(nums):\n    seen = set()\n    for n in nums:\n        if n in seen: return False\n        seen.add(n)\n    return True", label: "One loop + set → O(n) time, O(n) space (set grows with input)" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "bor-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bor-p1",
            question: "def f(n):\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                print(i,j,k)\n\nWhat is the Big-O?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(n²)", "O(n³)", "O(3n)"],
            correctAnswer: "O(n³)",
            feedbackCorrect: "Three nested loops = n × n × n = O(n³). Avoid this at all costs.",
            feedbackWrong: "Each nested loop multiplies the complexity. 3 nested loops = O(n³).",
            xp: 15,
          },
          {
            id: "bor-p2",
            question: "result = [n*2 for n in nums]\nWhat is the space complexity?",
            answerType: "multiple-choice",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: "O(n)",
            feedbackCorrect: "List comprehension creates a new list of the same size as nums → O(n) space.",
            feedbackWrong: "A new list is created with one item per input item → O(n) space.",
            xp: 10,
          },
          {
            id: "bor-p3",
            question: "def f(nums):\n    nums.sort()\n    seen = set()\n    for n in nums:\n        seen.add(n)\n\nWhat is the time complexity?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correctAnswer: "O(n log n)",
            feedbackCorrect: "sort() is O(n log n). The loop is O(n). Total: O(n log n + n) = O(n log n).",
            feedbackWrong: "sort() dominates at O(n log n). The loop is O(n). Keep the largest term: O(n log n).",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "bor-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Quick recognition rules",
            content: "Scan any function with these rules:\n\n• **Return/assign without loop** → O(1)\n• **One loop** → O(n)\n• **Loop + halving** → O(log n)\n• **Two nested loops** → O(n²)\n• **Sort call** → at least O(n log n)\n• **Set/dict built from input** → O(n) space\n• **Recursion** → analyze depth × work per call",
            example: "# Identify these:\ndef a(nums): return nums[0]        # O(1)\ndef b(nums):\n    for n in nums: print(n)        # O(n)\ndef c(nums):\n    nums.sort()                    # O(n log n)\ndef d(nums):\n    for i in nums:\n        for j in nums: pass        # O(n²)",
          },
          {
            title: "Common Python operations and their complexity",
            content: "Know these by heart:\n\n**O(1):** dict[key], set lookup, list append, list[-1]\n**O(n):** list search, list insert at 0, ' '.join(list)\n**O(n log n):** list.sort(), sorted()\n**O(n):** len(), max(), min(), sum()\n\nThe tricky ones: len() is O(1) (Python caches it), but max() is O(n) (must scan all).",
            example: "nums = [1, 2, 3, 4, 5]\n\nlen(nums)      # O(1) — cached\nnums[-1]       # O(1) — direct index\nmax(nums)      # O(n) — scans all\nnum in nums    # O(n) — scans all\nnum in my_set  # O(1) — hash lookup\nnums.sort()    # O(n log n)",
          },
          {
            title: "Amortized complexity",
            content: "Python list.append() is 'amortized O(1)'.\n\nMost of the time it's O(1). Occasionally (when the list needs to resize) it's O(n). But averaged over many appends, each one costs O(1).\n\nYou'll see 'amortized O(1)' in interviews. It means: fast on average, even if occasionally slow.",
            example: "# append() is amortized O(1)\nresult = []\nfor i in range(1_000_000):\n    result.append(i)    # amortized O(1) each\n# Total: O(n) — not O(n²)\n\n# vs insert at beginning — always O(n)\nfor i in range(1_000_000):\n    result.insert(0, i)  # O(n) each\n# Total: O(n²) — MUCH slower",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "bor-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is the time complexity of 'target in my_list'?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctIndex: 2,
            explanation: "List search scans from left to right — worst case checks all n elements → O(n).",
          },
          {
            question: "def f(nums): return sorted(nums)[0]\nWhat is the time complexity?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correctIndex: 2,
            explanation: "sorted() is O(n log n). Indexing [0] is O(1). Dominant term: O(n log n).",
          },
          {
            question: "list.append() is described as 'amortized O(1)'. What does amortized mean?",
            options: [
              "Always exactly 1 operation",
              "Fast on average even if occasionally slow",
              "Slower than O(1)",
              "Only works on small lists",
            ],
            correctIndex: 1,
            explanation: "Amortized means averaged over many operations. append() is usually O(1), occasionally O(n) for resize, but averages to O(1).",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "bor-summary",
      type: "summary",
      config: {
        xpEarned: 90,
        title: "Complexity Reader! 👁️",
        message: "You can now glance at any code and know its complexity. This is one of the most valuable skills in interviews.",
        nextSession: "arrays-and-big-o",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// S5: Two Pointers
// ──────────────────────────────────────────────────────

{
  id: "session-logic-two-pointers",
  slug: "logic-two-pointers",
  title: "Two Pointers — The Pattern That Kills O(n²)",
  topic: "logic-building",
  description: "One of the 15 core DSA patterns. Two pointers turns brute force O(n²) solutions into O(n) elegantly.",
  estimatedMinutes: 16,
  xpTotal: 110,
  prerequisiteSessionSlug: "arrays-and-big-o",
  nextSessionSlug: "logic-sliding-window",
  stages: [
    {
      id: "tp-hook",
      type: "hook",
      config: {
        headline: "Imagine searching for two people in a line who together weigh exactly 100kg.\nYou could check every pair — or you could be smart.",
        subtext: "Two pointers is the smart way. It appears in 30+ LeetCode problems and every company interview.",
        backgroundEmoji: "👆👆",
      } satisfies HookConfig,
    },
    {
      id: "tp-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 1, narration: "Sorted array: [1, 2, 3, 4, 6]. Target sum = 6.", delayAfterMs: 1500 },
          { action: "insert", value: 2, narration: "Left pointer starts at index 0 (value 1).", delayAfterMs: 1500 },
          { action: "insert", value: 3, narration: "Right pointer starts at last index (value 6).", delayAfterMs: 1500 },
          { action: "search", value: 1, narration: "1 + 6 = 7. Too big. Move right pointer left.", delayAfterMs: 2000 },
          { action: "search", value: 2, narration: "1 + 4 = 5. Too small. Move left pointer right.", delayAfterMs: 2000 },
          { action: "search", value: 3, narration: "2 + 4 = 6. Found it! Return indices [1, 3].", delayAfterMs: 2000 },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "tp-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "tp-p1",
            question: "Two pointers requires the array to be:",
            answerType: "multiple-choice",
            options: ["Unsorted", "Sorted", "Contains only positives", "Has no duplicates"],
            correctAnswer: "Sorted",
            feedbackCorrect: "Two pointers works by using sort order to decide which pointer to move. Unsorted arrays need other approaches.",
            feedbackWrong: "Two pointers relies on the array being sorted so you can logically move pointers.",
            xp: 10,
          },
          {
            id: "tp-p2",
            question: "arr = [1,3,5,7,9], target = 10\nLeft=0(1), Right=4(9). 1+9=10. What do you do?",
            answerType: "multiple-choice",
            options: ["Move left right", "Move right left", "Return the answer", "Start over"],
            correctAnswer: "Return the answer",
            feedbackCorrect: "1 + 9 = 10 = target. You found the pair. Return indices [0, 4].",
            feedbackWrong: "When left + right = target, you've found your answer. Return immediately.",
            xp: 15,
          },
          {
            id: "tp-p3",
            question: "Why is two pointers O(n) instead of O(n²)?",
            answerType: "multiple-choice",
            options: [
              "It uses recursion",
              "Each pointer moves at most n times — total moves ≤ 2n",
              "It sorts the array first",
              "It uses a hash map",
            ],
            correctAnswer: "Each pointer moves at most n times — total moves ≤ 2n",
            feedbackCorrect: "Left can move right at most n times. Right can move left at most n times. Total: 2n = O(n).",
            feedbackWrong: "Left moves right, right moves left. Together they traverse the array at most once each → O(n) total.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "tp-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The two pointers template",
            content: "This template works for dozens of problems:\n\n1. Sort the array (if needed)\n2. left = 0, right = len(arr) - 1\n3. While left < right:\n   - Check the condition\n   - If too small: left += 1\n   - If too big: right -= 1\n   - If found: return/record\n\nThe key insight: sorted order lets you eliminate half the remaining possibilities with each move.",
            example: "def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        current = nums[left] + nums[right]\n        if current == target:\n            return [left, right]\n        elif current < target:\n            left += 1   # need bigger sum\n        else:\n            right -= 1  # need smaller sum\n    return []",
          },
          {
            title: "Two pointers — same direction variant",
            content: "Two pointers can also move in the SAME direction (fast & slow).\n\nUse case: remove duplicates, find middle of linked list, detect cycles.\n\nFast pointer races ahead. Slow pointer marks the 'write position'. Classic pattern for in-place array modification.",
            example: "# Remove duplicates in-place — O(n) time O(1) space\ndef remove_duplicates(nums):\n    if not nums:\n        return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1",
          },
          {
            title: "When to use two pointers",
            content: "Look for these signals in a problem:\n\n✓ Sorted array or can be sorted\n✓ Find pair/triplet with target sum\n✓ Check if palindrome\n✓ Remove duplicates in-place\n✓ Merge two sorted arrays\n✓ 'Minimum difference between two elements'\n\nWhenever you see 'find two elements that...' in a sorted context — think two pointers first.",
            example: "# Is this string a palindrome?\ndef is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True\n\n# 'racecar' → True\n# 'hello'   → False",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "tp-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Two pointers converts O(n²) to O(n) because:",
            options: [
              "It uses less memory",
              "Each pointer traverses the array at most once",
              "It sorts the array",
              "It uses recursion",
            ],
            correctIndex: 1,
            explanation: "Left moves right at most n times, right moves left at most n times. Total: O(2n) = O(n).",
          },
          {
            question: "arr = [2, 4, 6, 8], target = 10. Left=0(2), Right=3(8). 2+8=10. Next step?",
            options: ["Move left right", "Move right left", "Return [0, 3]", "Sort again"],
            correctIndex: 2,
            explanation: "2 + 8 = 10 = target. Return the indices [0, 3] immediately.",
          },
          {
            question: "Which problem is NOT a good fit for two pointers?",
            options: [
              "Is a string a palindrome?",
              "Find two numbers summing to target in sorted array",
              "Find the most frequent element in an unsorted array",
              "Remove duplicates from sorted array",
            ],
            correctIndex: 2,
            explanation: "Finding most frequent element requires counting → use a dict/Counter. Two pointers needs sorted order or sequential comparison.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "tp-summary",
      type: "summary",
      config: {
        xpEarned: 110,
        title: "Pattern Unlocked: Two Pointers! 👆👆",
        message: "You now know your first DSA pattern. Two pointers appears in 30+ LeetCode problems. Recognize it and you'll solve them instantly.",
        nextSession: "logic-sliding-window",
      } satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// S6: Sliding Window
// ──────────────────────────────────────────────────────

{
  id: "session-logic-sliding-window",
  slug: "logic-sliding-window",
  title: "Sliding Window — Subarray Problems Made Easy",
  topic: "logic-building",
  description: "The pattern behind 'maximum sum subarray', 'longest substring without repeats', and dozens more.",
  estimatedMinutes: 15,
  xpTotal: 110,
  prerequisiteSessionSlug: "logic-two-pointers",
  stages: [
    {
      id: "sw-hook",
      type: "hook",
      config: {
        headline: "Your phone shows 5 notifications at a time.\nAs new ones come, old ones slide off.",
        subtext: "That's a sliding window. It solves an entire category of subarray problems that would otherwise be O(n²).",
        backgroundEmoji: "🪟",
      } satisfies HookConfig,
    },
    {
      id: "sw-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 2, narration: "Array: [2,1,5,1,3,2]. Find max sum subarray of size 3.", delayAfterMs: 1500 },
          { action: "insert", value: 1, narration: "Window [2,1,5]: sum = 8. This is our first window.", delayAfterMs: 2000 },
          { action: "insert", value: 5, narration: "Slide: remove 2, add 1. Window [1,5,1]: sum = 7.", delayAfterMs: 2000 },
          { action: "search", value: 5, narration: "Slide: remove 1, add 3. Window [5,1,3]: sum = 9. New max!", delayAfterMs: 2000 },
          { action: "search", value: 3, narration: "Slide: remove 5, add 2. Window [1,3,2]: sum = 6.", delayAfterMs: 2000 },
          { action: "insert", value: 3, narration: "Done. Maximum sum = 9 from window [5,1,3]. O(n) total.", delayAfterMs: 2000 },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "sw-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "sw-p1",
            question: "arr=[1,2,3,4,5], k=2. First window sum?",
            answerType: "multiple-choice",
            options: ["1", "3", "6", "2"],
            correctAnswer: "3",
            feedbackCorrect: "First window is arr[0:2] = [1,2]. Sum = 3.",
            feedbackWrong: "First window covers the first k=2 elements: arr[0]+arr[1] = 1+2 = 3.",
            xp: 10,
          },
          {
            id: "sw-p2",
            question: "Why is sliding window O(n) instead of O(n²)?",
            answerType: "multiple-choice",
            options: [
              "It sorts the array",
              "It reuses previous window sum — add one, remove one",
              "It uses recursion",
              "It skips elements",
            ],
            correctAnswer: "It reuses previous window sum — add one, remove one",
            feedbackCorrect: "Instead of summing k elements each time (O(k)), we just subtract left element and add right. O(1) per slide.",
            feedbackWrong: "Key insight: new_sum = old_sum - outgoing_element + incoming_element. One operation instead of k.",
            xp: 15,
          },
          {
            id: "sw-p3",
            question: "Variable window vs fixed window — when do you use variable?",
            answerType: "multiple-choice",
            options: [
              "Always use fixed window",
              "When the window size changes based on a condition",
              "When the array is sorted",
              "Variable is never used",
            ],
            correctAnswer: "When the window size changes based on a condition",
            feedbackCorrect: "Fixed: 'subarray of size k'. Variable: 'longest subarray where sum ≤ target'.",
            feedbackWrong: "Variable window expands/shrinks based on a condition. 'Longest substring without repeat' uses variable window.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "sw-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Fixed window template",
            content: "When the window size k is given:\n\n1. Build first window (sum first k elements)\n2. Slide: for each new element, add it and remove the leftmost\n3. Track max/min as you go\n\nThis is O(n) because each element enters and leaves the window exactly once.",
            example: "def max_sum_subarray(nums, k):\n    # Build first window\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    \n    # Slide\n    for i in range(k, len(nums)):\n        window_sum += nums[i]        # add right\n        window_sum -= nums[i - k]    # remove left\n        max_sum = max(max_sum, window_sum)\n    \n    return max_sum",
          },
          {
            title: "Variable window template",
            content: "When you need to find the longest/shortest subarray satisfying a condition:\n\n1. left = 0, expand right pointer\n2. While condition violated: shrink from left\n3. Update answer at each valid state\n\nThe window expands when valid, shrinks when invalid.",
            example: "# Longest substring without repeating chars\ndef length_of_longest_substring(s):\n    seen = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len",
          },
          {
            title: "When to use sliding window",
            content: "Look for these signals:\n\n✓ 'Subarray' or 'substring'\n✓ 'Of size k' → fixed window\n✓ 'Longest/shortest subarray where...'\n✓ 'Maximum/minimum sum of k elements'\n✓ 'Contains at most k distinct characters'\n\nAny time you're looking at a contiguous portion of an array that moves — sliding window.",
            example: "# Signals in problem statements:\n# 'find max sum of k consecutive' → fixed\n# 'longest substring with no repeat' → variable\n# 'smallest subarray with sum ≥ target' → variable\n# 'number of subarrays of size k with avg ≥ x' → fixed\n\n# Two pointer vs sliding window:\n# Two pointers: pair of ELEMENTS (not subarray)\n# Sliding window: contiguous SUBARRAY",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "sw-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What makes sliding window O(n) instead of O(n*k)?",
            options: [
              "It sorts the array",
              "It adds right element and removes left — O(1) per slide",
              "It uses recursion",
              "It skips k elements",
            ],
            correctIndex: 1,
            explanation: "new_sum = old_sum - nums[left] + nums[right]. One subtraction + one addition = O(1) per slide.",
          },
          {
            question: "Problem: 'Find the longest substring with at most 2 distinct characters.' Which window type?",
            options: ["Fixed window", "Variable window", "Two pointers", "Binary search"],
            correctIndex: 1,
            explanation: "Window size changes based on condition (at most 2 distinct chars) → variable window.",
          },
          {
            question: "In variable window, when do you shrink from the left?",
            options: [
              "When window is too small",
              "When the condition is violated",
              "Every other step",
              "When right reaches end",
            ],
            correctIndex: 1,
            explanation: "Shrink from left when the current window violates the condition (e.g. too many distinct chars, sum too large).",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "sw-summary",
      type: "summary",
      config: {
        xpEarned: 110,
        title: "Pattern Unlocked: Sliding Window! 🪟",
        message: "Two patterns down. Two pointers + sliding window covers a massive chunk of Easy and Medium LeetCode. You're building real DSA fluency.",
      } satisfies SummaryConfig,
    },
  ],
}

// ============================================================
// SESSION 4: LINKED LISTS
// ============================================================

];
