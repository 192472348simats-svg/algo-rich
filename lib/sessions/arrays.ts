// d:/Projects/DSA/algo-rich/lib/sessions/arrays.ts
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
  id: "session-arrays-intro",
  slug: "arrays-and-big-o",
  title: "Arrays & Big-O",
  topic: "arrays",
  description:
    "Understand how arrays work in memory and why Big-O matters for every operation.",
  estimatedMinutes: 20,
  xpTotal: 100,
  nextSessionSlug: "two-pointers",

  stages: [
    {
      id: "arr-hook",
      type: "hook",
      config: {
        headline:
          "Your phone's contact list, Spotify's queue, every spreadsheet ever.\nThey all start with one data structure: the Array.",
        subtext:
          "In 20 minutes you'll understand why some operations are instant and others are painfully slow.",
        backgroundEmoji: "📊",
      } satisfies HookConfig,
    },
    {
      id: "arr-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 10, narration: "We create an array and add 10 at index 0.", delayAfterMs: 1800 },
          { action: "insert", value: 20, narration: "Append 20 at the end — O(1), instant.", delayAfterMs: 1800 },
          { action: "insert", value: 30, narration: "Append 30 — still O(1).", delayAfterMs: 1800 },
          { action: "insert", value: 40, narration: "Append 40. Arrays grow at the tail for free.", delayAfterMs: 1800 },
          { action: "insert", value: 5, narration: "Now insert 5 at the FRONT — every element must shift right. O(n)!", delayAfterMs: 2500 },
          { action: "search", value: 30, narration: "Search for 30 — we scan left to right: O(n) in the worst case.", delayAfterMs: 2500 },
          { action: "delete", value: 20, narration: "Delete 20 — elements after it shift left to fill the gap. O(n).", delayAfterMs: 2500 },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "arr-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "arr-pred-1",
            question: "What is the time complexity of appending to the end of a Python list?",
            answerType: "multiple-choice",
            options: ["O(1) amortized", "O(n)", "O(log n)", "O(n²)"],
            correctAnswer: "O(1) amortized",
            feedbackCorrect: "Appending to the end is O(1) amortized because the array occasionally resizes.",
            feedbackWrong: "Appending at the end doesn't shift elements, so it's O(1) amortized.",
            xp: 10,
          },
          {
            id: "arr-pred-2",
            question: "If arr = [10, 20, 30, 40, 50], what is arr[3]?",
            answerType: "multiple-choice",
            options: ["30", "40", "50", "20"],
            correctAnswer: "40",
            feedbackCorrect: "0-based indexing: arr[3] is the 4th element = 40.",
            feedbackWrong: "Remember: Python uses 0-based indexing. arr[0]=10, arr[1]=20, arr[2]=30, arr[3]=40.",
            xp: 10,
          },
          {
            id: "arr-pred-3",
            question: "What is the time complexity of inserting at the beginning of an array?",
            answerType: "multiple-choice",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correctAnswer: "O(n)",
            feedbackCorrect: "All existing elements must shift right to make room — O(n).",
            feedbackWrong: "Inserting at index 0 requires shifting every element one position right → O(n).",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "arr-learn",
      type: "learn",
      config: {
        title: "Arrays: Contiguous Memory",
        keyRule: {
          emoji: "🧱",
          text: "Arrays store elements side-by-side in memory — that's why index access is O(1).",
        },
        content: `An **array** (Python \`list\`) is a block of contiguous memory. Each slot holds a reference to an object.

### Why indexing is O(1)
The computer calculates the memory address directly: \`base_address + index × slot_size\`. No scanning needed.

### Why insert/delete at the front is O(n)
Every element after the insertion point must shift one position. For an array of 1 million items, that's 1 million moves.

### Big-O Cheat Sheet

| Operation            | Time     |
|----------------------|----------|
| Access by index      | O(1)     |
| Append (end)         | O(1)*    |
| Insert (beginning)   | O(n)     |
| Delete (beginning)   | O(n)     |
| Search (unsorted)    | O(n)     |
| Search (sorted)      | O(log n) |

*amortized — occasionally the array resizes which is O(n), but averaged over many operations it's O(1).`,
        codeSnippet: {
          language: "python",
          code: `# O(1) — index access
arr = [10, 20, 30, 40, 50]
print(arr[2])  # 30

# O(1) amortized — append
arr.append(60)

# O(n) — insert at beginning
arr.insert(0, 5)  # shifts everything right`,
          caption: "Array operations and their time complexities",
        },
      } satisfies LearnConfig,
    },
    {
      id: "arr-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why is array index access O(1)?",
            options: [
              "The computer searches linearly",
              "Direct memory address calculation",
              "Arrays are always sorted",
              "Python caches the result",
            ],
            correctIndex: 1,
            explanation: "The address is computed as base + index × size — no scanning required.",
          },
          {
            question: "What makes inserting at the beginning of an array slow?",
            options: [
              "Memory allocation",
              "Shifting all elements to the right",
              "Sorting the array",
              "Hash table lookup",
            ],
            correctIndex: 1,
            explanation: "Every element after index 0 must move one position right — O(n) shifts.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "arr-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
}

// ──────────────────────────────────────────────────────
// PHASE 1 — Python Foundations
// ──────────────────────────────────────────────────────


];