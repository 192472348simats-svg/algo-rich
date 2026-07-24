// d:/Projects/DSA/algo-rich/lib/sessions/trees.ts
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
// BST Session — "Binary Search Trees"
// ──────────────────────────────────────────────────────

{
  id: "session-bst-intro",
  slug: "binary-search-trees",
  title: "Binary Search Trees",
  topic: "trees",
  description:
    "Build, visualise, and code your first Binary Search Tree from scratch.",
  estimatedMinutes: 25,
  xpTotal: 120,
  nextSessionSlug: "bst-deletion",

  stages: [
    /* ── 1. HOOK ── */
    {
      id: "bst-hook",
      type: "hook",
      config: {
        headline:
          "Google handles 8.5 billion searches per day.\nThe data structure behind it? The one you're about to learn.",
        subtext:
          "In the next 25 minutes you'll go from zero to confidently building and querying Binary Search Trees.",
        backgroundEmoji: "🌳",
      } satisfies HookConfig,
    },

    /* ── 2. WATCH ── */
    {
      id: "bst-watch",
      type: "watch",
      config: {
        visualizerType: "tree",
        autoPlaySteps: [
          {
            action: "insert",
            value: 50,
            narration: "50 becomes the root — the first node in our tree.",
            delayAfterMs: 2200,
          },
          {
            action: "insert",
            value: 25,
            narration: "25 < 50 → it goes to the left.",
            delayAfterMs: 2000,
          },
          {
            action: "insert",
            value: 75,
            narration: "75 > 50 → it goes to the right.",
            delayAfterMs: 2000,
          },
          {
            action: "insert",
            value: 10,
            narration: "10 < 50 → left. 10 < 25 → left again.",
            delayAfterMs: 2000,
          },
          {
            action: "insert",
            value: 30,
            narration: "30 < 50 → left. 30 > 25 → right of 25.",
            delayAfterMs: 2000,
          },
          {
            action: "insert",
            value: 60,
            narration: "60 > 50 → right. 60 < 75 → left of 75.",
            delayAfterMs: 2000,
          },
          {
            action: "insert",
            value: 90,
            narration: "90 > 50 → right. 90 > 75 → right of 75.",
            delayAfterMs: 2000,
          },
        ],
      } satisfies WatchConfig,
    },

    /* ── 3. PREDICT ── */
    {
      id: "bst-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "pred-1",
            question:
              "If we insert 15, which node will be its parent?",
            answerType: "multiple-choice",
            options: ["50", "25", "10", "30"],
            correctAnswer: "10",
            feedbackCorrect:
              "15 < 50 → left, 15 < 25 → left, 15 > 10 → right of 10. Correct!",
            feedbackWrong:
              "Trace the path: 15 < 50 → left, 15 < 25 → left, 15 > 10 → 10 is the parent.",
            xp: 10,
          },
          {
            id: "pred-2",
            question:
              'If we insert 80, will it go left or right of 90?',
            answerType: "multiple-choice",
            options: ["Left of 90", "Right of 90"],
            correctAnswer: "Left of 90",
            feedbackCorrect:
              "80 < 90 → left. Well done!",
            feedbackWrong:
              "80 is less than 90, so by the BST rule it goes to the left.",
            xp: 10,
          },
          {
            id: "pred-3",
            question:
              "What is the in-order traversal of the tree [50, 25, 75, 10, 30, 60, 90]?",
            answerType: "multiple-choice",
            options: [
              "10, 25, 30, 50, 60, 75, 90",
              "50, 25, 10, 30, 75, 60, 90",
              "10, 30, 25, 60, 90, 75, 50",
              "50, 25, 75, 10, 30, 60, 90",
            ],
            correctAnswer: "10, 25, 30, 50, 60, 75, 90",
            feedbackCorrect:
              "In-order traversal of a BST always gives values in sorted order!",
            feedbackWrong:
              "Remember: in-order = LEFT → ROOT → RIGHT. For a BST that produces sorted output.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },

    /* ── 4. LEARN ── */
    {
      id: "bst-learn",
      type: "learn",
      config: {
        title: "The BST Property",
        keyRule: {
          emoji: "📏",
          text: "LEFT < PARENT < RIGHT — always, at every node.",
        },
        content: `A **Binary Search Tree** is a binary tree where every node follows one simple rule:

- Everything in the **left** subtree is **smaller** than the node.
- Everything in the **right** subtree is **larger** than the node.

This single constraint makes search incredibly fast. Instead of checking every element (like in a list), you eliminate **half** the remaining tree at each step — just like binary search on a sorted array.

### Why does this matter?

| Operation | Sorted Array | BST (balanced) |
|-----------|:------------:|:--------------:|
| Search    | O(log n)     | O(log n)       |
| Insert    | **O(n)**     | **O(log n)**   |
| Delete    | **O(n)**     | **O(log n)**   |

Arrays are great for searching, but inserting or deleting forces you to shift elements. A BST gives you **O(log n)** for all three — as long as it stays balanced.

### The catch

If you insert already-sorted values (1, 2, 3, 4, 5…) the tree becomes a **linked list** and performance drops to O(n). In a later session we'll learn how self-balancing trees (AVL, Red-Black) solve this.`,
        codeSnippet: {
          language: "python",
          code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root`,
          caption: "BST Node class and recursive insert",
        },
      } satisfies LearnConfig,
    },

    /* ── 5. GUIDED BUILD ── */
    {
      id: "bst-guided-build",
      type: "guided-build",
      config: {
        visualizerType: "tree",
        instructions:
          "Build a balanced BST yourself. Insert these values in order:",
        valuesToInsert: [40, 20, 60, 10, 30, 50, 70],
        validationMessages: {
          40: "40 is the root — great start!",
          20: "20 < 40 → left child. Nice.",
          60: "60 > 40 → right child. Balanced so far!",
          10: "10 < 40 → left, 10 < 20 → left of 20.",
          30: "30 < 40 → left, 30 > 20 → right of 20.",
          50: "50 > 40 → right, 50 < 60 → left of 60.",
          70: "70 > 40 → right, 70 > 60 → right of 60.",
        },
        completionMessage:
          "You built a perfectly balanced BST! Every level is full.",
        bonusChallenge: {
          instruction:
            "Now insert 5, 3, 1 and watch what happens to the shape.",
          values: [5, 3, 1],
          insightMessage:
            "See how the tree became lopsided? Sorted insertions create a degenerate tree — essentially a linked list. This is why balancing matters!",
        },
      } satisfies GuidedBuildConfig,
    },

    /* ── 6. CODE ── */
    {
      id: "bst-code",
      type: "code",
      config: {
        problemSlug: "validate-bst",
        contextHint:
          "Use what you just learned. Remember: LEFT < PARENT < RIGHT — at every node.",
        hintAfterMinutes: 5,
        approachAfterMinutes: 10,
      } satisfies CodeConfig,
    },

    /* ── 7. REFLECT ── */
    {
      id: "bst-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What property defines a Binary Search Tree?",
            options: [
              "Every node has exactly two children",
              "Left < Parent < Right at every node",
              "The tree is always balanced",
              "Nodes are stored in an array",
            ],
            correctIndex: 1,
            explanation:
              "The BST property is LEFT < PARENT < RIGHT. Not all nodes need two children, and BSTs aren't always balanced.",
          },
          {
            question:
              "What is the time complexity of BST search in a balanced tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctIndex: 1,
            explanation:
              "Each comparison eliminates half the tree, just like binary search → O(log n).",
          },
          {
            question: "When does BST insert become O(n)?",
            options: [
              "When the tree is balanced",
              "When values are inserted in sorted order",
              "Always",
              "When the tree has more than 100 nodes",
            ],
            correctIndex: 1,
            explanation:
              "Sorted insertions create a skewed tree (like a linked list), so you traverse all n nodes.",
          },
        ],
      } satisfies ReflectConfig,
    },

    /* ── 8. SUMMARY ── */
    {
      id: "bst-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
}

// ──────────────────────────────────────────────────────
// Arrays Session — "Arrays & Big-O"
// ──────────────────────────────────────────────────────


];