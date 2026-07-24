// d:/Projects/DSA/algo-rich/lib/sessions/sliding-window.ts
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
  id: "session-sliding-window",
  slug: "sliding-window",
  title: "Sliding Window",
  topic: "sliding-window",
  description: "Find subarrays and substrings in O(n) by maintaining a moving window instead of recomputing.",
  estimatedMinutes: 20,
  xpTotal: 100,
  prerequisiteSessionSlug: "two-pointers",
  nextSessionSlug: "binary-search",
  stages: [
    {
      id: "sw-hook",
      type: "hook",
      config: {
        headline: "Maximum sum subarray. Longest substring without repeating chars.\nBoth solved in O(n) with one elegant trick.",
        subtext: "Sliding window is the pattern that separates candidates who passed from those who didn't.",
        backgroundEmoji: "🪟",
      }
    },
    {
      id: "sw-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 2, narration: "Window starts at index 0-2. Sum = 2+1+5 = 8.", delayAfterMs: 1800 },
          { action: "insert", value: 1, narration: "Slide right: subtract left element, add new right element.", delayAfterMs: 1800 },
          { action: "insert", value: 5, narration: "No recomputation — just add and subtract. O(1) per slide.", delayAfterMs: 1800 },
          { action: "insert", value: 3, narration: "Track the maximum sum seen. One pass — O(n).", delayAfterMs: 2000 },
        ],
      }
    },
    {
      id: "sw-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "sw-pred-1",
            question: "What makes sliding window O(n) instead of O(n²)?",
            answerType: "multiple-choice",
            options: [
              "It sorts the array first",
              "It reuses the previous window's computation instead of starting over",
              "It uses binary search to find boundaries",
              "It only works on sorted arrays",
            ],
            correctAnswer: "It reuses the previous window's computation instead of starting over",
            feedbackCorrect: "Each slide adds one element and removes one — O(1) per step, O(n) total.",
            feedbackWrong: "The key is reuse: add the new element, subtract the old one. No inner loop needed.",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "sw-learn",
      type: "learn",
      config: {
        title: "Sliding Window: Add Right, Remove Left",
        keyRule: {
          emoji: "🪟",
          text: "Fixed window: move both pointers together. Variable window: expand right, shrink left when condition breaks.",
        },
        content: "Fixed window: you know the size k. Slide by adding arr[right] and subtracting arr[left]. Variable window: expand until a condition breaks, then shrink from the left until it's satisfied again. Both are O(n).",
        codeSnippet: {
          language: "python",
          code: `# Fixed window — max sum of k consecutive elements
def max_sum_window(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i-k]
        max_sum = max(max_sum, window_sum)
    return max_sum

# Variable window — longest substring without repeating chars
def length_of_longest_substring(s):
    seen = set()
    left = max_len = 0
    for right in range(len(s)):
        while s[right] in seen:
            seen.remove(s[left]); left += 1
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`,
          caption: "Fixed and variable sliding window — both O(n)",
        },
      }
    },
    {
      id: "sw-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Find the maximum sum of any 3 consecutive elements in [2,1,5,1,3,2]. Print the result.",
            expectedOutput: "9",
            hint: "Start with sum of first 3. Slide: add arr[i], subtract arr[i-3]. Track max.",
            celebration: true,
          }
        ]
      }
    },
    {
      id: "sw-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "When do you use a variable-size sliding window instead of fixed?",
            options: [
              "When the array is unsorted",
              "When you're looking for a subarray satisfying a condition, not a fixed length",
              "When k is larger than n",
              "When elements are negative",
            ],
            correctIndex: 1,
            explanation: "Variable window expands and contracts based on a condition. Fixed window has a known size k.",
          }
        ]
      }
    },
    { id: "sw-summary", type: "summary", config: {} }
  ],
}

// ============================================================
// SESSION 11: BINARY SEARCH
// ============================================================

];