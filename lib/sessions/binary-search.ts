// d:/Projects/DSA/algo-rich/lib/sessions/binary-search.ts
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
  id: "session-binary-search",
  slug: "binary-search",
  title: "Binary Search",
  topic: "binary-search",
  description: "Cut your search space in half every step. Understand why O(log n) dominates O(n) at scale.",
  estimatedMinutes: 20,
  xpTotal: 100,
  prerequisiteSessionSlug: "sliding-window",
  nextSessionSlug: "binary-search-trees",
  stages: [
    {
      id: "bs-hook",
      type: "hook",
      config: {
        headline: "1 billion elements. Linear search: 1 billion steps.\nBinary search: 30 steps. That's the power of O(log n).",
        subtext: "Binary search is the foundation of every efficient lookup system ever built.",
        backgroundEmoji: "🎯",
      }
    },
    {
      id: "bs-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 1, narration: "Sorted array. Target = 7. Left=0, Right=8.", delayAfterMs: 1600 },
          { action: "insert", value: 3, narration: "Mid = 4. arr[mid]=5 < 7. Move left to mid+1.", delayAfterMs: 1800 },
          { action: "insert", value: 5, narration: "Mid = 6. arr[mid]=8 > 7. Move right to mid-1.", delayAfterMs: 1800 },
          { action: "insert", value: 7, narration: "Mid = 5. arr[mid]=7 == target. Found! O(log n).", delayAfterMs: 2000 },
        ],
      }
    },
    {
      id: "bs-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bs-pred-1",
            question: "How many steps does binary search take on an array of 1,024 elements?",
            answerType: "multiple-choice",
            options: ["1024", "512", "10", "1"],
            correctAnswer: "10",
            feedbackCorrect: "log₂(1024) = 10. Binary search halves the search space each step.",
            feedbackWrong: "Binary search halves the space each step. log₂(1024) = 10 steps maximum.",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "bs-learn",
      type: "learn",
      config: {
        title: "Binary Search: Eliminate Half Each Step",
        keyRule: {
          emoji: "🎯",
          text: "Requires sorted input. Each step eliminates half the remaining elements. O(log n) time, O(1) space.",
        },
        content: "Binary search maintains a left and right boundary. Each step checks the midpoint. If too small, move left boundary up. If too large, move right boundary down. The boundaries converge — at most log₂(n) steps.",
        codeSnippet: {
          language: "python",
          code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2  # avoids overflow
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1  # not found

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))   # 3
print(binary_search(arr, 6))   # -1`,
          caption: "Classic binary search — memorize this template",
        },
      }
    },
    {
      id: "bs-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Implement binary_search(arr, target) and find 11 in [1,3,5,7,9,11,13]. Print the index.",
            expectedOutput: "5",
            hint: "left=0, right=len-1. mid = (left+right)//2. Compare arr[mid] to target.",
            celebration: true,
          }
        ]
      }
    },
    {
      id: "bs-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why do we use mid = left + (right - left) // 2 instead of (left + right) // 2?",
            options: [
              "It's faster",
              "It prevents integer overflow when left + right exceeds max int",
              "It gives a different result",
              "It handles negative numbers better",
            ],
            correctIndex: 1,
            explanation: "In languages with fixed integer size, left + right can overflow. The subtraction form is safe. Good habit even in Python.",
          }
        ]
      }
    },
    { id: "bs-summary", type: "summary", config: {} }
  ],
}


];