// d:/Projects/DSA/algo-rich/lib/sessions/two-pointers.ts
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
  id: "session-two-pointers",
  slug: "two-pointers",
  title: "Two Pointers",
  topic: "two-pointers",
  description: "Eliminate brute force O(n²) solutions with a simple left-right pointer technique.",
  estimatedMinutes: 20,
  xpTotal: 100,
  prerequisiteSessionSlug: "sorting-algorithms",
  nextSessionSlug: "sliding-window",
  stages: [
    {
      id: "tp-hook",
      type: "hook",
      config: {
        headline: "Two Sum on a sorted array. Palindrome check. Container with most water.\nOne pattern solves all three and cuts O(n²) to O(n).",
        subtext: "Two pointers is the first pattern interviewers look for when they see an array problem.",
        backgroundEmoji: "👆",
      }
    },
    {
      id: "tp-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 1, narration: "Sorted array. Left pointer starts at index 0.", delayAfterMs: 1600 },
          { action: "insert", value: 3, narration: "Right pointer starts at the last index.", delayAfterMs: 1600 },
          { action: "insert", value: 5, narration: "Sum < target? Move left pointer right.", delayAfterMs: 1800 },
          { action: "insert", value: 7, narration: "Sum > target? Move right pointer left.", delayAfterMs: 1800 },
          { action: "insert", value: 9, narration: "Sum == target? Found it. O(n) — one pass.", delayAfterMs: 2000 },
        ],
      }
    },
    {
      id: "tp-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "tp-pred-1",
            question: "Two pointers requires the array to be _____ for the sum pattern to work.",
            answerType: "multiple-choice",
            options: ["Random", "Sorted", "Unique elements only", "Even length"],
            correctAnswer: "Sorted",
            feedbackCorrect: "Sorting lets us make decisions: too small means move left pointer right, too large means move right pointer left.",
            feedbackWrong: "Without sorting, we can't decide which pointer to move. The array must be sorted.",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "tp-learn",
      type: "learn",
      config: {
        title: "Two Pointers: Start Opposite Ends, Move Inward",
        keyRule: {
          emoji: "👆",
          text: "Left pointer starts at 0, right at n-1. Move them based on a condition. They meet in the middle — O(n).",
        },
        content: "Two pointers works on sorted arrays or problems with a shrinkable search space. The key insight: you never need to go backwards. Each pointer only moves in one direction, so total moves are at most n — making the whole algorithm O(n).",
        codeSnippet: {
          language: "python",
          code: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []

def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
          caption: "Two Sum (sorted) and palindrome check — both O(n) with two pointers",
        },
      }
    },
    {
      id: "tp-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Write is_palindrome(s) using two pointers. Test with 'racecar' and print True.",
            expectedOutput: "True",
            hint: "left=0, right=len(s)-1. While left<right: compare s[left] and s[right].",
            celebration: true,
          },
          {
            instruction: "Now test is_palindrome('hello') and print the result.",
            expectedOutput: "False",
            hint: "Same function. Just call it with 'hello'.",
            celebration: false,
          }
        ]
      }
    },
    {
      id: "tp-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why does two pointers reduce O(n²) brute force to O(n)?",
            options: [
              "It uses binary search internally",
              "Each pointer only moves in one direction — total moves bounded by n",
              "It skips duplicate elements",
              "It uses extra memory to cache results",
            ],
            correctIndex: 1,
            explanation: "Each pointer moves at most n times total. No nested loops. The whole scan is O(n).",
          }
        ]
      }
    },
    { id: "tp-summary", type: "summary", config: {} }
  ],
}

// ============================================================
// SESSION 10: SLIDING WINDOW
// ============================================================

];