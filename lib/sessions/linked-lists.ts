// d:/Projects/DSA/algo-rich/lib/sessions/linked-lists.ts
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
  id: "session-linked-lists",
  slug: "linked-lists",
  title: "Linked Lists",
  topic: "linked-lists",
  description: "Understand how nodes chain together and why linked lists beat arrays at insertions.",
  estimatedMinutes: 20,
  xpTotal: 100,
  prerequisiteSessionSlug: "arrays-and-big-o",
  nextSessionSlug: "stacks-and-queues",
  stages: [
    {
      id: "ll-hook",
      type: "hook",
      config: {
        headline: "What if each element knew where the next one lived?\nNo contiguous memory. No shifting. Just pointers.",
        subtext: "In 20 minutes you'll understand the data structure behind music playlists, browser history, and undo/redo.",
        backgroundEmoji: "🔗",
      }
    },
    {
      id: "ll-watch",
      type: "watch",
      config: {
        visualizerType: "linked-list",
        autoPlaySteps: [
          { action: "insert", value: 10, narration: "Create the head node with value 10.", delayAfterMs: 1800 },
          { action: "insert", value: 20, narration: "Append 20 — head.next now points to this node.", delayAfterMs: 1800 },
          { action: "insert", value: 30, narration: "Append 30. Each node holds a value and a next pointer.", delayAfterMs: 1800 },
          { action: "delete", value: 20, narration: "Delete 20 — we just rewire the pointer. O(1) once found.", delayAfterMs: 2000 },
        ],
      }
    },
    {
      id: "ll-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "ll-pred-1",
            question: "What is the time complexity of inserting at the HEAD of a linked list?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctAnswer: "O(1)",
            feedbackCorrect: "Inserting at the head only rewires one pointer — no shifting needed.",
            feedbackWrong: "Unlike arrays, linked lists don't shift elements. Head insertion is O(1).",
            xp: 10,
          },
          {
            id: "ll-pred-2",
            question: "What is the time complexity of accessing the 5th element in a linked list?",
            answerType: "multiple-choice",
            options: ["O(1)", "O(log n)", "O(n)", "O(5)"],
            correctAnswer: "O(n)",
            feedbackCorrect: "You must traverse from head — no direct index access.",
            feedbackWrong: "Unlike arrays, linked lists have no index. You walk node by node — O(n).",
            xp: 10,
          }
        ]
      }
    },
    {
      id: "ll-learn",
      type: "learn",
      config: {
        title: "Linked Lists: Nodes and Pointers",
        keyRule: {
          emoji: "🔗",
          text: "Each node stores a value and a pointer to the next node. Insertions are O(1). Access is O(n).",
        },
        content: "A linked list is a chain of nodes. Each node has two things: a value and a next pointer. The last node points to None. There is no index — to reach element 5 you walk from the head.",
        codeSnippet: {
          language: "python",
          code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, val):
        new_node = Node(val)
        if not self.head:
            self.head = new_node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node

    def prepend(self, val):        # O(1)
        new_node = Node(val)
        new_node.next = self.head
        self.head = new_node`,
          caption: "Basic linked list with O(1) prepend and O(n) append",
        },
      }
    },
    {
      id: "ll-guided",
      type: "guided-build",
      config: {
        visualizerType: "linked-list",
        instructions: "Build a linked list by inserting values one at a time. Watch how the pointers connect.",
        valuesToInsert: [5, 15, 25, 35],
        completionMessage: "You built a 4-node linked list. Every node knows exactly where the next one lives.",
        bonusChallenge: {
          instruction: "Now delete the middle node (15). What happens to the pointers?",
          values: [15],
          insightMessage: "The previous node's pointer jumps over the deleted node. The chain stays intact.",
        }
      }
    },
    {
      id: "ll-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why is inserting at the middle of a linked list O(n)?",
            options: [
              "Because nodes need to be copied",
              "Because you must traverse to find the position first",
              "Because memory needs to be reallocated",
              "Because linked lists are sorted",
            ],
            correctIndex: 1,
            explanation: "The pointer rewire is O(1), but finding the insertion point requires O(n) traversal.",
          }
        ]
      }
    },
    { id: "ll-summary", type: "summary", config: {} }
  ],
}

// ============================================================
// SESSION 5: STACKS AND QUEUES
// ============================================================

];