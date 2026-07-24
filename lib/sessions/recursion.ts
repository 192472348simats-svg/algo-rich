// d:/Projects/DSA/algo-rich/lib/sessions/recursion.ts
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
} from "../sessionDefinitions";

export const sessions: SessionDefinition[] = [
{
  id: "session-recursion",
  slug: "recursion",
  title: "Recursion",
  topic: "recursion",
  description: "Break problems into smaller versions of themselves. Understand the call stack, base cases, and recursive thinking.",
  estimatedMinutes: 25,
  xpTotal: 120,
  prerequisiteSessionSlug: "hashmaps",
  nextSessionSlug: "sorting-algorithms",
  stages: [
    {
      id: "rec-hook",
      type: "hook",
      config: {
        headline: "What if a function could call itself?\nThat's not infinite loops — that's the most elegant problem-solving tool in CS.",
        subtext: "Tree traversal, merge sort, DFS, dynamic programming — they all start here.",
        backgroundEmoji: "🔄",
      }
    },
    {
      id: "rec-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 5, narration: "factorial(5) calls factorial(4). Frame pushed onto call stack.", delayAfterMs: 1800 },
          { action: "insert", value: 4, narration: "factorial(4) calls factorial(3). Stack grows.", delayAfterMs: 1800 },
          { action: "insert", value: 3, narration: "factorial(3) calls factorial(2). Stack grows.", delayAfterMs: 1800 },
          { action: "insert", value: 1, narration: "Base case hit: factorial(1) = 1. Stack unwinds.", delayAfterMs: 2000 },
          { action: "delete", value: 1, narration: "Returns 1. Frame popped.", delayAfterMs: 1600 },
          { action: "delete", value: 3, narration: "Returns 2. Frame popped.", delayAfterMs: 1600 },
          { action: "delete", value: 4, narration: "Returns 6. Frame popped.", delayAfterMs: 1600 },
          { action: "delete", value: 5, narration: "Returns 24. Final answer.", delayAfterMs: 1800 },
        ],
      }
    },
    {
      id: "rec-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "rec-pred-1",
            question: "What happens if a recursive function has no base case?",
            answerType: "multiple-choice",
            options: ["It returns None", "It runs once", "Stack overflow — infinite recursion", "It compiles but doesn't run"],
            correctAnswer: "Stack overflow — infinite recursion",
            feedbackCorrect: "Without a base case, the function calls itself forever until the call stack runs out of memory.",
            feedbackWrong: "Every recursive call adds a frame to the call stack. Without a base case it never stops — stack overflow.",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "rec-learn",
      type: "learn",
      config: {
        title: "Recursion: Base Case + Recursive Case",
        keyRule: {
          emoji: "🔄",
          text: "Every recursive function needs: (1) a base case that stops it, (2) a recursive call that moves toward the base case.",
        },
        content: "Recursion works by pushing frames onto the call stack. Each call is a smaller version of the same problem. The base case is where it stops. Without it you get a stack overflow. With it, the stack unwinds and results bubble back up.",
        codeSnippet: {
          language: "python",
          code: `def factorial(n):
    # Base case — stops recursion
    if n <= 1:
        return 1
    # Recursive case — smaller problem
    return n * factorial(n - 1)

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(factorial(5))   # 120
print(fibonacci(6))   # 8`,
          caption: "Factorial and Fibonacci — the two canonical recursion examples",
        },
      }
    },
    {
      id: "rec-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Write a recursive function sum_list(arr) that returns the sum of all elements. Call sum_list([1,2,3,4,5]) and print the result.",
            expectedOutput: "15",
            hint: "Base case: empty list returns 0. Recursive case: arr[0] + sum_list(arr[1:])",
            celebration: false,
          },
          {
            instruction: "Write a recursive function power(base, exp) that computes base^exp. Print power(2, 8).",
            expectedOutput: "256",
            hint: "Base case: exp == 0 returns 1. Recursive case: base * power(base, exp-1)",
            celebration: true,
          }
        ]
      }
    },
    {
      id: "rec-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is the space complexity of a recursive function with depth n?",
            options: ["O(1)", "O(log n)", "O(n) — one stack frame per call", "O(n²)"],
            correctIndex: 2,
            explanation: "Each recursive call adds a frame to the call stack. n levels deep means O(n) space.",
          }
        ]
      }
    },
    { id: "rec-summary", type: "summary", config: {} }
  ],
}

// ============================================================
// SESSION 8: SORTING ALGORITHMS
// ============================================================

];