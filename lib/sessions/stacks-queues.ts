// d:/Projects/DSA/algo-rich/lib/sessions/stacks-queues.ts
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
  id: "session-stacks-queues",
  slug: "stacks-and-queues",
  title: "Stacks & Queues",
  topic: "stacks-queues",
  description: "Master LIFO and FIFO — the two access patterns that power undo, BFS, and call stacks.",
  estimatedMinutes: 20,
  xpTotal: 100,
  prerequisiteSessionSlug: "linked-lists",
  nextSessionSlug: "hashmaps",
  stages: [
    {
      id: "sq-hook",
      type: "hook",
      config: {
        headline: "Undo in VS Code. Breadth-first search. Your browser's back button.\nAll three use exactly one of these two structures.",
        subtext: "Stacks and Queues are constraints, not data structures. Learn when each one is the answer.",
        backgroundEmoji: "📚",
      }
    },
    {
      id: "sq-watch",
      type: "watch",
      config: {
        visualizerType: "stack-queue",
        autoPlaySteps: [
          { action: "push", value: 1, narration: "Push 1 onto the stack. Last in, first out.", delayAfterMs: 1600 },
          { action: "push", value: 2, narration: "Push 2. It sits on top of 1.", delayAfterMs: 1600 },
          { action: "push", value: 3, narration: "Push 3. Stack top is now 3.", delayAfterMs: 1600 },
          { action: "pop", narration: "Pop — 3 comes off first. LIFO.", delayAfterMs: 1800 },
          { action: "enqueue", value: 10, narration: "Switch to queue. Enqueue 10 at the back.", delayAfterMs: 1800 },
          { action: "enqueue", value: 20, narration: "Enqueue 20. It waits behind 10.", delayAfterMs: 1600 },
          { action: "dequeue", narration: "Dequeue — 10 leaves first. FIFO.", delayAfterMs: 1800 },
        ],
      }
    },
    {
      id: "sq-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "sq-pred-1",
            question: "Which data structure would you use to implement an undo feature?",
            answerType: "multiple-choice",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correctAnswer: "Stack",
            feedbackCorrect: "Undo reverses the most recent action first — that's LIFO, a stack.",
            feedbackWrong: "Undo needs the most recent action first. That's LIFO — a stack.",
            xp: 10,
          },
          {
            id: "sq-pred-2",
            question: "What is the time complexity of push and pop on a stack?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctAnswer: "O(1)",
            feedbackCorrect: "Both push and pop only touch the top element — always O(1).",
            feedbackWrong: "Stack operations only touch the top. No traversal needed — O(1).",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "sq-learn",
      type: "learn",
      config: {
        title: "Stack: LIFO — Queue: FIFO",
        keyRule: {
          emoji: "📚",
          text: "Stack = Last In First Out. Queue = First In First Out. Both are O(1) for their core operations.",
        },
        content: "A stack only allows access at one end (the top). A queue adds at the back and removes from the front. Python lists work as stacks. Use collections.deque for efficient queues.",
        codeSnippet: {
          language: "python",
          code: `from collections import deque

# Stack using list
stack = []
stack.append(1)   # push
stack.append(2)
stack.pop()       # pop → 2 (LIFO)

# Queue using deque
queue = deque()
queue.append(1)    # enqueue
queue.append(2)
queue.popleft()    # dequeue → 1 (FIFO)`,
          caption: "Stack with list, Queue with deque — both O(1)",
        },
      }
    },
    {
      id: "sq-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Create an empty stack as a Python list and push the values 10, 20, 30 onto it. Print the stack.",
            expectedOutput: "[10, 20, 30]",
            hint: "Use list.append() to push. Print the list directly.",
            celebration: false,
          },
          {
            instruction: "Pop the top value and print it. Then print the remaining stack.",
            expectedOutput: "30\n[10, 20]",
            hint: "stack.pop() returns the removed value. Print it, then print the stack.",
            celebration: true,
          },
          {
            instruction: "Now create a deque queue. Enqueue 'a', 'b', 'c'. Dequeue one item and print it.",
            expectedOutput: "a",
            hint: "from collections import deque. Use .append() to enqueue and .popleft() to dequeue.",
            celebration: true,
          }
        ]
      }
    },
    {
      id: "sq-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why is collections.deque preferred over a list for queues in Python?",
            options: [
              "Deque uses less memory",
              "list.pop(0) is O(n) but deque.popleft() is O(1)",
              "Deque is sorted automatically",
              "Lists cannot store strings",
            ],
            correctIndex: 1,
            explanation: "Removing from the front of a list shifts every element — O(n). Deque is optimized for both ends — O(1).",
          }
        ]
      }
    },
    { id: "sq-summary", type: "summary", config: {} }
  ],
}

// ============================================================
// SESSION 6: HASHMAPS
// ============================================================

];