// d:/Projects/DSA/algo-rich/lib/sessions/sorting.ts
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
  id: "session-sorting",
  slug: "sorting-algorithms",
  title: "Sorting Algorithms",
  topic: "sorting",
  description: "Understand bubble, merge, and quick sort. Know which to use and why O(n log n) is the target.",
  estimatedMinutes: 25,
  xpTotal: 120,
  prerequisiteSessionSlug: "recursion",
  nextSessionSlug: "two-pointers",
  stages: [
    {
      id: "sort-hook",
      type: "hook",
      config: {
        headline: "Sorting is everywhere. But not all sorts are equal.\nOne runs in O(n²). Another in O(n log n). The difference at scale is enormous.",
        subtext: "By the end you'll know which algorithm Python actually uses and why bubble sort is never the answer.",
        backgroundEmoji: "🔢",
      }
    },
    {
      id: "sort-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 64, narration: "Start with unsorted array: [64, 34, 25, 12]", delayAfterMs: 1600 },
          { action: "insert", value: 34, narration: "Bubble sort: compare adjacent pairs.", delayAfterMs: 1600 },
          { action: "insert", value: 25, narration: "Swap if left > right. Largest bubbles to end.", delayAfterMs: 1800 },
          { action: "insert", value: 12, narration: "After n passes, fully sorted. O(n²) — slow.", delayAfterMs: 2000 },
        ],
      }
    },
    {
      id: "sort-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "sort-pred-1",
            question: "What is the time complexity of merge sort?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correctAnswer: "O(n log n)",
            feedbackCorrect: "Merge sort divides in half (log n levels) and merges each level in O(n) — total O(n log n).",
            feedbackWrong: "Merge sort splits the array log n times and each merge is O(n) — total O(n log n).",
            xp: 10,
          },
          {
            id: "sort-pred-2",
            question: "Python's built-in sort uses which algorithm?",
            answerType: "multiple-choice",
            options: ["Bubble Sort", "Quick Sort", "Timsort (merge + insertion)", "Heap Sort"],
            correctAnswer: "Timsort (merge + insertion)",
            feedbackCorrect: "Timsort is a hybrid of merge sort and insertion sort — O(n log n) worst case.",
            feedbackWrong: "Python uses Timsort — a hybrid designed for real-world data patterns.",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "sort-learn",
      type: "learn",
      config: {
        title: "Bubble O(n²) → Merge O(n log n) → Built-in",
        keyRule: {
          emoji: "🔢",
          text: "Never implement bubble sort in interviews. Use merge sort to show recursion understanding. Use Python's sorted() in production.",
        },
        content: "Bubble sort compares adjacent pairs repeatedly — O(n²). Merge sort divides the array in half recursively then merges — O(n log n). Quick sort partitions around a pivot — O(n log n) average, O(n²) worst. Python's sorted() is Timsort — always O(n log n).",
        codeSnippet: {
          language: "python",
          code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

print(merge_sort([64, 34, 25, 12, 22, 11, 90]))`,
          caption: "Merge sort — the recursive sort you should know for interviews",
        },
      }
    },
    {
      id: "sort-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Sort this list using Python's built-in sorted(): [5, 2, 8, 1, 9, 3]. Print the result.",
            expectedOutput: "[1, 2, 3, 5, 8, 9]",
            hint: "print(sorted([5, 2, 8, 1, 9, 3]))",
            celebration: false,
          },
          {
            instruction: "Sort the same list in descending order and print it.",
            expectedOutput: "[9, 8, 5, 3, 2, 1]",
            hint: "sorted(arr, reverse=True)",
            celebration: false,
          },
          {
            instruction: "Write bubble_sort(arr) that sorts in-place. Call it on [64, 34, 25, 12] and print.",
            expectedOutput: "[12, 25, 34, 64]",
            hint: "Nested loops. Compare arr[j] and arr[j+1], swap if out of order.",
            celebration: true,
          }
        ]
      }
    },
    {
      id: "sort-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why is merge sort preferred over quick sort in practice for interview answers?",
            options: [
              "Merge sort is faster on average",
              "Merge sort has guaranteed O(n log n) worst case; quick sort degrades to O(n²)",
              "Merge sort uses less memory",
              "Quick sort cannot handle duplicates",
            ],
            correctIndex: 1,
            explanation: "Quick sort's worst case is O(n²) on already-sorted or all-duplicate arrays. Merge sort is always O(n log n).",
          }
        ]
      }
    },
    { id: "sort-summary", type: "summary", config: {} }
  ],
}

// ============================================================
// SESSION 9: TWO POINTERS
// ============================================================

];