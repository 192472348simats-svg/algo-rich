// d:/Projects/DSA/algo-rich/lib/sessions/hashmaps.ts
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
  id: "session-hashmaps",
  slug: "hashmaps",
  title: "Hash Maps",
  topic: "hashmaps",
  description: "Understand why hash maps give O(1) lookup and how to use them to solve problems in one pass.",
  estimatedMinutes: 25,
  xpTotal: 120,
  prerequisiteSessionSlug: "stacks-and-queues",
  nextSessionSlug: "recursion",
  stages: [
    {
      id: "hm-hook",
      type: "hook",
      config: {
        headline: "Two Sum. Frequency count. Anagram detection.\nEvery one of these problems becomes trivial with one data structure.",
        subtext: "Hash maps trade memory for speed. Once you internalize this, you'll spot the pattern in every interview problem.",
        backgroundEmoji: "🗂️",
      }
    },
    {
      id: "hm-watch",
      type: "watch",
      config: {
        visualizerType: "hashmap",
        autoPlaySteps: [
          { action: "insert", value: "name:Alice", narration: "Insert key 'name', value 'Alice'. Hash function maps it to a bucket.", delayAfterMs: 2000 },
          { action: "insert", value: "age:25", narration: "Insert key 'age', value 25. Different bucket.", delayAfterMs: 1800 },
          { action: "lookup", value: "name", narration: "Lookup 'name' — hash function goes directly to the bucket. O(1).", delayAfterMs: 2000 },
          { action: "delete", value: "age", narration: "Delete 'age' — find bucket, remove. O(1).", delayAfterMs: 1800 },
        ],
      }
    },
    {
      id: "hm-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "hm-pred-1",
            question: "What is the average time complexity of a hash map lookup?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
            correctAnswer: "O(1)",
            feedbackCorrect: "The hash function computes the bucket directly — no searching needed.",
            feedbackWrong: "Hash maps compute the storage location directly. Average case is O(1).",
            xp: 10,
          },
          {
            id: "hm-pred-2",
            question: "You need to count how many times each word appears in a list. Best data structure?",
            answerType: "multiple-choice",
            options: ["Array", "Stack", "Hash Map", "Binary Search Tree"],
            correctAnswer: "Hash Map",
            feedbackCorrect: "Hash map gives O(1) insert and lookup — perfect for frequency counting.",
            feedbackWrong: "Frequency counting needs fast key-based access. Hash map is the answer.",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "hm-learn",
      type: "learn",
      config: {
        title: "Hash Maps: O(1) Everywhere",
        keyRule: {
          emoji: "🗂️",
          text: "Hash maps give O(1) average insert, lookup, and delete. The pattern: store what you've seen, look up in O(1).",
        },
        content: "A hash map stores key-value pairs. A hash function converts the key into a bucket index. In Python, dict is a hash map. The most common interview pattern: iterate once, store in a dict, check dict for complement or count.",
        codeSnippet: {
          language: "python",
          code: `# Two Sum in O(n) using hash map
def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Frequency count
def count_freq(arr):
    freq = {}
    for item in arr:
        freq[item] = freq.get(item, 0) + 1
    return freq`,
          caption: "Two Sum O(n) and frequency counting — the two most common hash map patterns",
        },
      }
    },
    {
      id: "hm-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Create a dictionary and store three key-value pairs: 'a':1, 'b':2, 'c':3. Print the dictionary.",
            expectedOutput: "{'a': 1, 'b': 2, 'c': 3}",
            hint: "d = {'a': 1, 'b': 2, 'c': 3} then print(d)",
            celebration: false,
          },
          {
            instruction: "Write a function count_chars(s) that counts how many times each character appears in string s. Call it with 'hello' and print the result.",
            expectedOutput: "{'h': 1, 'e': 1, 'l': 2, 'o': 1}",
            hint: "Use a dict. For each char in s, do freq[char] = freq.get(char, 0) + 1",
            celebration: true,
          }
        ]
      }
    },
    {
      id: "hm-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "In Two Sum, why do we store num in the hash map instead of the complement?",
            options: [
              "To avoid using extra memory",
              "So we can look up the complement for future numbers in O(1)",
              "Because complements are always negative",
              "Python dicts only store integers",
            ],
            correctIndex: 1,
            explanation: "We store what we've seen so far. For each new number, we check if its complement was already seen — one pass, O(n) total.",
          }
        ]
      }
    },
    { id: "hm-summary", type: "summary", config: {} }
  ],
}

// ============================================================
// SESSION 7: RECURSION
// ============================================================

];