// ──────────────────────────────────────────────────────
// Session Definitions — type system + registry
// ──────────────────────────────────────────────────────

/* ---- Stage configs ---- */

export interface HookConfig {
  headline: string;
  subtext: string;
  backgroundEmoji?: string;
}

export interface WatchAutoPlayStep {
  action: "insert" | "delete" | "search" | "traverse" | "lookup" | "push" | "pop" | "enqueue" | "dequeue";
  value?: number | string;
  narration: string;
  delayAfterMs: number;
}

// Phase 1 beginner visualizer step types
export interface TextFlowStep {
  text: string;
  label: string;
}
export interface BoxAnimationStep {
  action: "create" | "fill" | "read" | "update";
  label: string;
  value?: string | null;
  oldValue?: string;
  newValue?: string;
  output?: string;
}
export interface CounterAnimationStep {
  code: string;
  counter: number | string | null;
  output?: string;
  narration?: string;
}
export interface MachineAnimationStep {
  action: "show" | "run" | "code" | "compare";
  name?: string;
  inputs?: (string | number)[];
  output?: number | string;
  code?: string;
  print_ver?: string;
  return_ver?: string;
  narration?: string;
}

export interface WatchConfig {
  visualizerType:
    | "tree" | "array" | "linked-list" | "stack-queue" | "graph"
    | "text-flow" | "box-animation" | "counter-animation" | "machine-animation" | "hashmap";
  // Legacy tree/array steps
  autoPlaySteps?: WatchAutoPlayStep[];
  // Phase 1 beginner steps (typed loosely, each visualizer handles its own step shape)
  steps?: (TextFlowStep | BoxAnimationStep | CounterAnimationStep | MachineAnimationStep)[];
  narration?: string;
}

export interface PredictConfig {
  questions: {
    id: string;
    question: string;
    visualState?: unknown;
    answerType:
      | "click-node"
      | "click-direction"
      | "drag-order"
      | "multiple-choice"
      | "type-number";
    options?: string[];
    correctAnswer: string | number | number[];
    feedbackCorrect: string;
    feedbackWrong: string;
    xp: number;
  }[];
}

export interface LearnCard {
  title: string;
  content: string;
  example?: string;
}

export interface LearnConfig {
  title?: string;
  content?: string; // short markdown — MAX ~500 words
  keyRule?: {
    text: string;
    emoji: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
    caption: string;
  };
  // Phase 1: multi-card format
  cards?: LearnCard[];
}

export interface GuidedBuildStep {
  instruction: string;
  hint?: string;
  celebration?: string | boolean;
  expectedOutput?: string | null;
}

export interface GuidedBuildConfig {
  // Legacy tree visualizer fields
  visualizerType?: "tree" | "array" | "linked-list";
  instructions?: string;
  valuesToInsert?: number[];
  validationMessages?: Record<number, string>;
  completionMessage?: string;
  bonusChallenge?: {
    instruction: string;
    values: number[];
    insightMessage: string;
  };
  // Phase 1: simple step-by-step code wizard
  steps?: GuidedBuildStep[];
}

export interface CodeConfig {
  problemSlug: string;
  contextHint?: string;
  hintAfterMinutes?: number;
  approachAfterMinutes?: number;
}

export interface ReflectConfig {
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// Summary config — computed from stage results; optional metadata for Phase 1
export interface SummaryConfig {
  xpEarned?: number;
  title?: string;
  message?: string;
  nextSession?: string;
}

/* ---- Discriminated stage union ---- */

export type StageConfig =
  | HookConfig
  | WatchConfig
  | PredictConfig
  | LearnConfig
  | GuidedBuildConfig
  | CodeConfig
  | ReflectConfig
  | SummaryConfig;

export type StageType =
  | "hook"
  | "watch"
  | "predict"
  | "learn"
  | "guided-build"
  | "code"
  | "reflect"
  | "summary";

export interface SessionStage {
  id: string;
  type: StageType;
  config: StageConfig;
}

/* ---- Full session definition ---- */

export interface SessionDefinition {
  id: string;
  slug: string;
  title: string;
  topic: string;
  description: string;
  estimatedMinutes: number;
  prerequisiteSessionSlug?: string;
  stages: SessionStage[];
  nextSessionSlug?: string;
  xpTotal: number;
}

/* ---- Registry ---- */

const sessionRegistry = new Map<string, SessionDefinition>();

export function registerSession(session: SessionDefinition) {
  sessionRegistry.set(session.slug, session);
}

export function getSessionDefinition(
  slug: string
): SessionDefinition | undefined {
  return sessionRegistry.get(slug);
}

export function getAllSessionDefinitions(): SessionDefinition[] {
  return Array.from(sessionRegistry.values());
}

export function getSessionsByTopic(topic: string): SessionDefinition[] {
  return Array.from(sessionRegistry.values()).filter(
    (s) => s.topic === topic
  );
}

// ──────────────────────────────────────────────────────
// BST Session — "Binary Search Trees"
// ──────────────────────────────────────────────────────

registerSession({
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
});

// ──────────────────────────────────────────────────────
// Arrays Session — "Arrays & Big-O"
// ──────────────────────────────────────────────────────

registerSession({
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
});

// ──────────────────────────────────────────────────────
// PHASE 1 — Python Foundations
// ──────────────────────────────────────────────────────

registerSession({
  id: "session-first-python-program",
  slug: "first-python-program",
  title: "Your First Python Program",
  topic: "python-foundations",
  description: "Write your very first line of code and understand how Python works.",
  estimatedMinutes: 15,
  xpTotal: 20,
  nextSessionSlug: "variables-basics",

  stages: [
    {
      id: "fpp-hook",
      type: "hook",
      config: {
        headline: "Your First Line of Code 🚀",
        subtext:
          "Every app — Instagram, Google, Spotify — started with one line of code. In 15 minutes, you write yours.",
        backgroundEmoji: "🚀",
      } satisfies HookConfig,
    },
    {
      id: "fpp-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "print('Hello!')", label: "YOUR CODE" },
          { text: "Python reads your instruction", label: "PYTHON ENGINE" },
          { text: "Hello!", label: "OUTPUT" },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "fpp-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "fpp-pred-1",
            question: "What will print(2 + 3) show on screen?",
            answerType: "multiple-choice",
            options: ["5", "2+3", "23", "Error"],
            correctAnswer: "5",
            feedbackCorrect:
              "✅ Python does the math first (2+3=5), then shows the result.",
            feedbackWrong:
              "Python calculates 2+3=5 first, then prints the number 5.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "fpp-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "What is print()?",
            content:
              "print() shows things on screen. It's like telling the computer: 'Hey, display this!' Everything inside the brackets gets shown.",
            example: "print('Hello!') → shows: Hello!",
          },
          {
            title: "Text vs Numbers",
            content:
              "Text needs quotes: print('hello'). Numbers don't: print(42). Quotes tell Python 'this is text, not a command.'",
            example:
              "print('5')  → shows text: 5\nprint(5)    → shows number: 5\nprint(2+3)  → shows: 5 (does math!)",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "fpp-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Type: print('Hello, World!')",
            expectedOutput: "Hello, World!",
            hint: "Include the quotes and brackets exactly",
            celebration: "🎉 You just wrote your first program!",
          },
          {
            instruction: "Now try: print(10 + 5)",
            expectedOutput: "15",
            hint: "No quotes — Python will calculate it",
            celebration: "Python can do math! 🧮",
          },
          {
            instruction: "Print your own name using print()",
            expectedOutput: null,
            hint: "print('YourName') — with quotes!",
            celebration: "The computer knows you now! 🙌",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "fpp-code",
      type: "code",
      config: {
        problemSlug: "hello-world",
        contextHint: "Use print() to show text on screen",
        hintAfterMinutes: 2,
        approachAfterMinutes: 5,
      } satisfies CodeConfig,
    },
    {
      id: "fpp-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What does print() do?",
            options: [
              "Shows on screen",
              "Saves to file",
              "Creates variable",
              "Sends to internet",
            ],
            correctIndex: 0,
            explanation: "print() displays output on your screen.",
          },
          {
            question: "print('5') vs print(5) — what's different?",
            options: [
              "Nothing",
              "First is text, second is number",
              "First gives error",
              "Second gives error",
            ],
            correctIndex: 1,
            explanation:
              "Quotes make it text (a string). Without quotes, Python treats it as a number.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "fpp-summary",
      type: "summary",
      config: {
        xpEarned: 20,
        title: "You're a Programmer Now! 🎊",
        message:
          "You told a computer what to do and it listened. Tomorrow: variables — teaching computers to remember things.",
        nextSession: "variables-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
registerSession({
  id: "session-variables-basics",
  slug: "variables-basics",
  title: "Variables — Teaching Computers to Remember",
  topic: "python-foundations",
  prerequisiteSessionSlug: "first-python-program",
  description: "Learn to store and reuse values with variables.",
  estimatedMinutes: 15,
  xpTotal: 20,
  nextSessionSlug: "loops-basics",

  stages: [
    {
      id: "vb-hook",
      type: "hook",
      config: {
        headline: "Your phone stores your name, contacts, scores. How? Variables. 📱",
        subtext:
          "In the next few minutes you'll learn how to make the computer remember anything you tell it.",
        backgroundEmoji: "📦",
      } satisfies HookConfig,
    },
    {
      id: "vb-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "name", value: null },
          { action: "fill", label: "name", value: "'Alice'" },
          { action: "create", label: "age", value: null },
          { action: "fill", label: "age", value: "25" },
          { action: "read", label: "name", output: "Alice" },
          { action: "update", label: "age", oldValue: "25", newValue: "26" },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "vb-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "vb-pred-1",
            question: "x = 5, then x = 10. What is x?",
            answerType: "multiple-choice",
            options: ["5", "10", "15", "Error"],
            correctAnswer: "10",
            feedbackCorrect:
              "✅ Variables hold ONE value. x = 10 replaces the 5.",
            feedbackWrong:
              "Variables hold one value at a time. x = 10 replaces the old value 5.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "vb-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "What is a variable?",
            content:
              "A labeled box that stores one value. name = 'Alice' creates a box labeled 'name' with 'Alice' inside.",
            example: "name = 'Alice'\nprint(name)  # Alice",
          },
          {
            title: "= means STORE, not EQUALS",
            content:
              "x = 5 means 'put 5 into x'. Think of it as an arrow: x ← 5. It's not saying they're equal!",
            example: "score = 0\nscore = score + 10  # now score = 10",
          },
          {
            title: "Naming rules",
            content:
              "Start with letter/underscore. No spaces (use snake_case: my_name). Can't use Python keywords (if, for, print).",
            example: "my_name = 'Bob'  ✅\n2fast = 'no'    ❌ (starts with number)",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "vb-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Create a variable: name = 'your name here' (replace with your name)",
            hint: "Keep the quotes around your name",
            celebration: "Variable created! 📦",
          },
          {
            instruction: "Print it: print(name)",
            hint: "No quotes around name — you want the VALUE",
            celebration: "You're reading a variable! 🎯",
          },
          {
            instruction: "Create age, then print: print(name, 'is', age, 'years old')",
            hint: "Commas separate multiple things in print",
            celebration: "Two variables in one print! 🌟",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "vb-code",
      type: "code",
      config: {
        problemSlug: "sum-two-numbers",
        contextHint: "Create two variables and add them together",
        hintAfterMinutes: 2,
        approachAfterMinutes: 5,
      } satisfies CodeConfig,
    },
    {
      id: "vb-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Can you change a variable after creating it?",
            options: ["Yes", "No", "Only numbers", "Only strings"],
            correctIndex: 0,
            explanation: "Variables can be reassigned at any time.",
          },
          {
            question: "What happens to the old value after reassignment?",
            options: [
              "Saved somewhere",
              "Gone forever",
              "Becomes None",
              "Error",
            ],
            correctIndex: 1,
            explanation:
              "The old value is simply replaced. Python doesn't save it.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "vb-summary",
      type: "summary",
      config: {
        xpEarned: 20,
        title: "Memory Unlocked! 🧠",
        message:
          "Variables = foundation of everything. Next: loops — making computers repeat.",
        nextSession: "loops-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
registerSession({
  id: "session-loops-basics",
  slug: "loops-basics",
  title: "Loops — Making Computers Repeat",
  topic: "python-foundations",
  prerequisiteSessionSlug: "if-else-basics",
  description: "Use for loops to make Python do repetitive work in seconds.",
  estimatedMinutes: 18,
  xpTotal: 25,
  nextSessionSlug: "functions-basics",

  stages: [
    {
      id: "lb-hook",
      type: "hook",
      config: {
        headline: "Writing 'Happy Birthday' 500 times by hand? 2 hours. With a loop? 0.001 seconds. ⚡",
        subtext:
          "Loops are how computers do in a blink what would take humans hours. Let's learn them.",
        backgroundEmoji: "🔄",
      } satisfies HookConfig,
    },
    {
      id: "lb-watch",
      type: "watch",
      config: {
        visualizerType: "counter-animation",
        steps: [
          { code: "for i in range(5):", counter: null, narration: "Python creates a counter i" },
          { code: "  print(i)", counter: 0, output: "0" },
          { code: "  print(i)", counter: 1, output: "0\n1" },
          { code: "  print(i)", counter: 2, output: "0\n1\n2" },
          { code: "  print(i)", counter: 3, output: "0\n1\n2\n3" },
          { code: "  print(i)", counter: 4, output: "0\n1\n2\n3\n4" },
          { code: "# done!", counter: "✓", narration: "5 outputs from 2 lines of code!" },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "lb-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "lb-pred-1",
            question: "for i in range(3): print('Hi') — How many times does it print?",
            answerType: "multiple-choice",
            options: ["2", "3", "4", "1"],
            correctAnswer: "3",
            feedbackCorrect: "✅ range(3) = 0, 1, 2 — three numbers, three prints.",
            feedbackWrong: "range(3) generates 0, 1, 2 — that's 3 values, so it prints 3 times.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "lb-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "What is a for loop?",
            content:
              "Repeats code N times. 'for i in range(10):' = do this 10 times. The indented code below runs every time.",
            example: "for i in range(3):\n    print('Hello')  # prints Hello 3 times",
          },
          {
            title: "range() explained",
            content: "range(5) = 0,1,2,3,4. Starts at 0, stops BEFORE 5. range(1,6) = 1,2,3,4,5.",
            example: "for i in range(1, 4):\n    print(i)  # 1, 2, 3",
          },
          {
            title: "Indentation = belonging",
            content:
              "Indented code is INSIDE the loop. Un-indented code runs AFTER the loop finishes.",
            example:
              "for i in range(3):\n    print(i)     # inside loop\nprint('done')    # outside loop",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "lb-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Print numbers 1 to 5 with a loop",
            hint: "for i in range(1, 6): print(i)",
            celebration: "Counting with code! 🎯",
          },
          {
            instruction: "Print 'Hello' exactly 3 times using a loop",
            hint: "for i in range(3): print('Hello')",
            celebration: "Loops save SO much time! ⚡",
          },
          {
            instruction: "Print each letter of the word 'Python' on its own line",
            hint: "for letter in 'Python': print(letter)",
            celebration: "You can loop over text too! 🐍",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "lb-code",
      type: "code",
      config: {
        problemSlug: "fizzbuzz",
        contextHint: "Use a for loop with range(). Check conditions with if/elif.",
        hintAfterMinutes: 3,
        approachAfterMinutes: 6,
      } satisfies CodeConfig,
    },
    {
      id: "lb-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "range(5) generates how many numbers?",
            options: ["4", "5", "6", "Depends"],
            correctIndex: 1,
            explanation: "range(5) = 0,1,2,3,4 — exactly 5 numbers.",
          },
          {
            question: "Indentation in Python tells Python:",
            options: [
              "What's inside the loop",
              "How fast to run",
              "Nothing special",
              "The variable type",
            ],
            correctIndex: 0,
            explanation:
              "Indentation defines code blocks — what's inside versus outside a loop or function.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "lb-summary",
      type: "summary",
      config: {
        xpEarned: 25,
        title: "Automation Unlocked! ⚡",
        message: "Loops turn seconds of code into millions of actions. Next: functions — building your own tools.",
        nextSession: "functions-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
registerSession({
  id: "session-functions-basics",
  slug: "functions-basics",
  title: "Functions — Building Your Own Tools",
  topic: "python-foundations",
  description: "Create reusable functions to organize and power your code.",
  estimatedMinutes: 20,
  xpTotal: 25,

  stages: [
    {
      id: "fb-hook",
      type: "hook",
      config: {
        headline: "You used print() and range(). Someone BUILT those. Now YOU build your own. 🛠️",
        subtext:
          "Functions let you name and reuse pieces of code. Build once, use anywhere.",
        backgroundEmoji: "⚙️",
      } satisfies HookConfig,
    },
    {
      id: "fb-watch",
      type: "watch",
      config: {
        visualizerType: "machine-animation",
        steps: [
          { action: "show", name: "add", inputs: ["a", "b"], output: "a + b" },
          { action: "run", inputs: [3, 4], output: 7 },
          { action: "run", inputs: [10, 20], output: 30 },
          { action: "code", code: "def add(a, b):\n    return a + b" },
          {
            action: "compare",
            print_ver: "print(a+b)",
            return_ver: "return a+b",
            narration: "print shows it, return gives it back",
          },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "fb-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "fb-pred-1",
            question: "def double(x): return x * 2 — What does double(7) give?",
            answerType: "multiple-choice",
            options: ["7", "14", "72", "Error"],
            correctAnswer: "14",
            feedbackCorrect: "✅ double(7) = 7 × 2 = 14. The function multiplies by 2.",
            feedbackWrong: "double(x) returns x * 2. double(7) = 7 * 2 = 14.",
            xp: 5,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "fb-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "def = define",
            content:
              "def greet(name): tells Python 'remember this recipe, I'll use it later'. The code inside only runs when you call it.",
            example: "def greet(name):\n    return 'Hello, ' + name\n\nprint(greet('Alice'))  # Hello, Alice",
          },
          {
            title: "Parameters vs Arguments",
            content:
              "Parameters: the names in the definition (a, b). Arguments: the actual values you pass in (3, 4). Python substitutes one for the other.",
            example: "def add(a, b):   # a, b are parameters\n    return a + b\n\nadd(3, 4)    # 3, 4 are arguments",
          },
          {
            title: "return ≠ print",
            content:
              "return sends a value BACK to the caller. print just shows it on screen. result = add(3,4) only works if add uses return.",
            example:
              "def add(a, b):  return a+b  # ✅\n# result = add(3,4)  → result = 7\n\ndef add(a, b):  print(a+b)  # ❌ for capturing\n# result = add(3,4)  → result = None",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "fb-guided",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Write a function greet(name) that returns 'Hello, ' + name",
            hint: "def greet(name): then return 'Hello, ' + name",
            celebration: "You built a function! 🛠️",
          },
          {
            instruction: "Write square(n) that returns n * n",
            hint: "def square(n): return n * n",
            celebration: "Math tool created! 🔢",
          },
          {
            instruction: "Write is_even(n) that returns True if n is even, False otherwise",
            hint: "def is_even(n): return n % 2 == 0",
            celebration: "Logic in a function! 🧠",
          },
        ],
      } satisfies GuidedBuildConfig,
    },
    {
      id: "fb-code",
      type: "code",
      config: {
        problemSlug: "is-prime",
        contextHint: "Define a function. Use a loop to check divisibility. Return True/False.",
        hintAfterMinutes: 3,
        approachAfterMinutes: 7,
      } satisfies CodeConfig,
    },
    {
      id: "fb-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What's the difference between return and print?",
            options: [
              "return sends value back; print shows on screen",
              "They're the same thing",
              "print is better for functions",
              "return only works with numbers",
            ],
            correctIndex: 0,
            explanation:
              "return gives a value back to whoever called the function. print only displays it.",
          },
          {
            question: "Can functions call other functions?",
            options: [
              "Yes — that's how programs are built",
              "No",
              "Only built-in functions",
              "Only in Phase 3",
            ],
            correctIndex: 0,
            explanation: "Functions can call each other freely. This is how large programs are organized.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "fb-summary",
      type: "summary",
      config: {
        xpEarned: 25,
        title: "Tool Builder! 🛠️",
        message:
          "You can now create your own reusable tools. Functions are the foundation of every program ever written.",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// DATA TYPES SESSION
// ──────────────────────────────────────────────────────

registerSession({
  id: "session-data-types",
  slug: "data-types",
  title: "Data Types — What Kind of Thing Is It?",
  topic: "python-foundations",
  description: "Integers, floats, strings, booleans — Python's 4 basic building blocks explained with real-life examples.",
  estimatedMinutes: 12,
  xpTotal: 80,
  prerequisiteSessionSlug: "variables-basics",
  nextSessionSlug: "if-else-basics",
  stages: [
    {
      id: "dt-hook",
      type: "hook",
      config: {
        headline: "Your phone knows the difference between your name and your age.\nSo does Python.",
        subtext: "In 12 minutes you'll understand why '5' + '3' = '53' but 5 + 3 = 8 — and why that matters forever.",
        backgroundEmoji: "🗂️",
      } satisfies HookConfig,
    },
    {
      id: "dt-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "age = 17", value: "17", output: "int — whole number, no decimal" } as BoxAnimationStep,
          { action: "create", label: "height = 5.6", value: "5.6", output: "float — number with decimal" } as BoxAnimationStep,
          { action: "create", label: "name = 'Vani'", value: "'Vani'", output: "str — text inside quotes" } as BoxAnimationStep,
          { action: "create", label: "is_student = True", value: "True", output: "bool — only True or False" } as BoxAnimationStep,
          { action: "read", label: "type(age)", value: "17", output: "<class 'int'>" } as BoxAnimationStep,
          { action: "read", label: "type(name)", value: "'Vani'", output: "<class 'str'>" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "dt-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "dt-p1",
            question: "What is the type of: score = 99.5",
            answerType: "multiple-choice",
            options: ["int", "float", "str", "bool"],
            correctAnswer: "float",
            feedbackCorrect: "99.5 has a decimal point → float. int would be 99 with no decimal.",
            feedbackWrong: "Any number with a decimal point is a float. 99 (no decimal) would be int.",
            xp: 10,
          },
          {
            id: "dt-p2",
            question: "What does '5' + '3' give you in Python?",
            answerType: "multiple-choice",
            options: ["8", "'53'", "Error", "53"],
            correctAnswer: "'53'",
            feedbackCorrect: "Strings join end-to-end (concatenation). '5' + '3' = '53', not 8!",
            feedbackWrong: "When both values are strings, + means join them together, not add. '5'+'3' = '53'.",
            xp: 15,
          },
          {
            id: "dt-p3",
            question: "Which of these is a boolean?",
            answerType: "multiple-choice",
            options: ["'True'", "1", "True", "yes"],
            correctAnswer: "True",
            feedbackCorrect: "True (capital T, no quotes) is a boolean. 'True' with quotes is a string.",
            feedbackWrong: "Boolean is exactly True or False — capital T/F, no quotes. 'True' with quotes is just text.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "dt-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The 4 basic types",
            content: "Python has 4 types you'll use every single day:\n\n**int** → whole numbers: 1, 42, -7\n**float** → decimals: 3.14, 0.5, -2.7\n**str** → text in quotes: 'hello', \"world\"\n**bool** → only True or False",
            example: "age = 17          # int\nheight = 5.6      # float\nname = 'Vani'     # str\npassed = True     # bool",
          },
          {
            title: "type() tells you what it is",
            content: "Not sure what type something is? Ask Python directly with type().\n\nThis is like asking 'what kind of thing is this?' and Python answers honestly.",
            example: "print(type(42))      # <class 'int'>\nprint(type(3.14))    # <class 'float'>\nprint(type('hi'))    # <class 'str'>\nprint(type(True))    # <class 'bool'>",
          },
          {
            title: "Mixing types causes bugs",
            content: "This is where beginners get confused most.\n\n'5' looks like a number but it's text. Python will not add it like a number — it joins it like text.\n\nRule: numbers without quotes are real numbers. Numbers inside quotes are just text that looks like numbers.",
            example: "print(5 + 3)       # 8  ✓ math\nprint('5' + '3')   # '53'  ✗ joined\nprint(int('5') + 3) # 8  ✓ convert first",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "dt-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What type is the value 3.14?",
            options: ["int", "float", "str", "bool"],
            correctIndex: 1,
            explanation: "Any number with a decimal point is a float. int only stores whole numbers.",
          },
          {
            question: "What does '10' + '20' return?",
            options: ["30", "'1020'", "Error", "10 + 20"],
            correctIndex: 1,
            explanation: "String + string means concatenation (joining). '10' + '20' = '1020', not 30.",
          },
          {
            question: "How do you check the type of a variable x?",
            options: ["x.type()", "type(x)", "typeof(x)", "x.getType()"],
            correctIndex: 1,
            explanation: "type(x) is a built-in Python function that returns the type of any value.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "dt-summary",
      type: "summary",
      config: {
        xpEarned: 80,
        title: "Type Detective! 🔍",
        message: "You now know Python's 4 basic types. This knowledge will save you from the most common beginner bugs forever.",
        nextSession: "if-else-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// IF/ELSE SESSION
// ──────────────────────────────────────────────────────

registerSession({
  id: "session-if-else",
  slug: "if-else-basics",
  title: "If / Else — Teaching Computers to Decide",
  topic: "python-foundations",
  description: "Make your programs smart. if, elif, else — the decision-making trio that powers every app ever built.",
  estimatedMinutes: 14,
  xpTotal: 90,
  prerequisiteSessionSlug: "data-types",
  nextSessionSlug: "lists-basics",
  stages: [
    {
      id: "ie-hook",
      type: "hook",
      config: {
        headline: "Netflix decides what to show you.\nInstagram decides what post comes next.\nBoth use the exact same Python code you're about to learn.",
        subtext: "In 14 minutes you'll make programs that think — deciding what to do based on conditions.",
        backgroundEmoji: "🤔",
      } satisfies HookConfig,
    },
    {
      id: "ie-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "age = 17", value: "17", output: "Store the age" } as BoxAnimationStep,
          { action: "read", label: "if age >= 18:", value: "17 >= 18?", output: "False — skip the if block" } as BoxAnimationStep,
          { action: "read", label: "else:", value: "condition was False", output: "Run the else block instead" } as BoxAnimationStep,
          { action: "read", label: "print('Minor')", value: "Minor", output: "Output: Minor" } as BoxAnimationStep,
          { action: "update", label: "age = 20", value: "17", newValue: "20", output: "Change age to 20" } as BoxAnimationStep,
          { action: "read", label: "if age >= 18:", value: "20 >= 18?", output: "True — run the if block" } as BoxAnimationStep,
          { action: "read", label: "print('Adult')", value: "Adult", output: "Output: Adult" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "ie-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "ie-p1",
            question: "score = 45. What prints?\nif score >= 50:\n    print('Pass')\nelse:\n    print('Fail')",
            answerType: "multiple-choice",
            options: ["Pass", "Fail", "Nothing", "Error"],
            correctAnswer: "Fail",
            feedbackCorrect: "45 >= 50 is False, so we skip to else and print 'Fail'.",
            feedbackWrong: "45 is less than 50, so the if condition is False and we run the else block.",
            xp: 15,
          },
          {
            id: "ie-p2",
            question: "How many elif blocks can you have?",
            answerType: "multiple-choice",
            options: ["Only 1", "Only 2", "As many as you need", "None"],
            correctAnswer: "As many as you need",
            feedbackCorrect: "You can chain as many elif conditions as you want. Only the first True one runs.",
            feedbackWrong: "elif can be repeated as many times as needed. Only the first matching condition runs.",
            xp: 10,
          },
          {
            id: "ie-p3",
            question: "x = 10. What prints?\nif x > 10:\n    print('A')\nelif x == 10:\n    print('B')\nelse:\n    print('C')",
            answerType: "multiple-choice",
            options: ["A", "B", "C", "A and B"],
            correctAnswer: "B",
            feedbackCorrect: "x > 10 is False. x == 10 is True → print B. Once a condition matches, the rest are skipped.",
            feedbackWrong: "Python checks each condition top to bottom. x > 10 fails, x == 10 succeeds → B.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "ie-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "if / elif / else — the decision tree",
            content: "Think of it like a bouncer at a club:\n\n**if** — check first condition. If True, do this.\n**elif** — check next condition. If True, do this instead.\n**else** — if nothing above matched, do this.\n\nOnly ONE block ever runs — the first one that's True.",
            example: "grade = 75\n\nif grade >= 90:\n    print('A')\nelif grade >= 75:\n    print('B')   # ← this runs\nelif grade >= 60:\n    print('C')\nelse:\n    print('Fail')",
          },
          {
            title: "Comparison operators",
            content: "These are the building blocks of every condition:\n\n== equals | != not equals\n> greater | < less\n>= greater or equal | <= less or equal\n\nRemember: = stores a value. == checks if two things are equal.",
            example: "x = 5\nprint(x == 5)   # True\nprint(x != 3)   # True\nprint(x > 10)   # False\nprint(x >= 5)   # True",
          },
          {
            title: "and / or / not",
            content: "You can combine conditions:\n\n**and** — both must be True\n**or** — at least one must be True\n**not** — flip True to False\n\nReal life: 'You can watch the movie IF you finished homework AND it's not past 10pm.'",
            example: "age = 17\nhas_id = True\n\nif age >= 18 and has_id:\n    print('Enter')\nelif age >= 16 or has_id:\n    print('Maybe')\nelse:\n    print('No entry')",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "ie-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is the difference between = and == in Python?",
            options: [
              "They are the same thing",
              "= stores a value, == checks if two values are equal",
              "== stores a value, = checks equality",
              "= is for numbers, == is for strings",
            ],
            correctIndex: 1,
            explanation: "= is assignment (storing). == is comparison (checking). Mixing them up is the most common Python bug.",
          },
          {
            question: "In an if/elif/else chain, how many blocks run?",
            options: ["All of them", "None of them", "Only the first True one", "The last one always"],
            correctIndex: 2,
            explanation: "Python checks from top to bottom. The first condition that is True runs its block, then Python skips the rest.",
          },
          {
            question: "score = 85. Which prints?\nif score >= 90: print('A')\nelif score >= 80: print('B')\nelif score >= 70: print('C')",
            options: ["A", "B", "C", "Nothing"],
            correctIndex: 1,
            explanation: "score >= 90 is False. score >= 80 is True → print B. C is never checked.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "ie-summary",
      type: "summary",
      config: {
        xpEarned: 90,
        title: "Decision Maker! 🤔",
        message: "Your programs can now think and decide. Every app, game, and website uses exactly what you just learned.",
        nextSession: "lists-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// LISTS SESSION
// ──────────────────────────────────────────────────────

registerSession({
  id: "session-lists",
  slug: "lists-basics",
  title: "Lists — Your First Data Structure",
  topic: "python-foundations",
  description: "Store many things in one place. Lists are Python's most-used data structure and the gateway to DSA.",
  estimatedMinutes: 15,
  xpTotal: 100,
  prerequisiteSessionSlug: "if-else-basics",
  nextSessionSlug: "strings-basics",
  stages: [
    {
      id: "ls-hook",
      type: "hook",
      config: {
        headline: "Your Spotify playlist. Your WhatsApp messages. Your Instagram feed.\nAll of them are lists.",
        subtext: "Lists are your first real data structure. Master this and the rest of DSA becomes 10x easier.",
        backgroundEmoji: "📋",
      } satisfies HookConfig,
    },
    {
      id: "ls-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 10, narration: "Create a list and add 10. It goes to index 0.", delayAfterMs: 1800 },
          { action: "insert", value: 20, narration: "Append 20. It goes to index 1. List grows from the right.", delayAfterMs: 1800 },
          { action: "insert", value: 30, narration: "Append 30 at index 2. O(1) — instant.", delayAfterMs: 1800 },
          { action: "insert", value: 40, narration: "Append 40. Index 3. Still O(1).", delayAfterMs: 1800 },
          { action: "search", value: 20, narration: "Access index 1 directly → 20. O(1) — no scanning needed!", delayAfterMs: 2200 },
          { action: "delete", value: 10, narration: "Remove 10 from front. Everything shifts left. O(n).", delayAfterMs: 2200 },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "ls-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "ls-p1",
            question: "fruits = ['apple', 'mango', 'banana']\nWhat is fruits[1]?",
            answerType: "multiple-choice",
            options: ["apple", "mango", "banana", "Error"],
            correctAnswer: "mango",
            feedbackCorrect: "Index 0 = apple, index 1 = mango, index 2 = banana. 0-based indexing!",
            feedbackWrong: "Python starts counting from 0. Index 1 is the second item = mango.",
            xp: 10,
          },
          {
            id: "ls-p2",
            question: "nums = [5, 10, 15]\nnums.append(20)\nWhat is len(nums)?",
            answerType: "multiple-choice",
            options: ["3", "4", "20", "Error"],
            correctAnswer: "4",
            feedbackCorrect: "append() adds one item. 3 items + 1 = 4. len() counts all items.",
            feedbackWrong: "append() adds 20 to the end. Now the list has 4 items: [5, 10, 15, 20].",
            xp: 10,
          },
          {
            id: "ls-p3",
            question: "nums = [1, 2, 3, 4, 5]\nWhat is nums[-1]?",
            answerType: "multiple-choice",
            options: ["1", "5", "Error", "-1"],
            correctAnswer: "5",
            feedbackCorrect: "Negative indexing: -1 is always the last item. Super useful!",
            feedbackWrong: "In Python, negative indices count from the end. -1 = last item = 5.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "ls-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Creating and accessing lists",
            content: "A list holds multiple values in order. Think of it as a numbered shelf — each slot has an index starting from 0.\n\n**Access:** list[index]\n**Negative index:** list[-1] is last item, list[-2] is second to last.\n**Length:** len(list) counts all items.",
            example: "shelf = ['book', 'pen', 'phone']\nprint(shelf[0])    # 'book'\nprint(shelf[-1])   # 'phone'\nprint(len(shelf))  # 3",
          },
          {
            title: "The 4 operations you'll use daily",
            content: "**append(x)** — add to end, O(1)\n**pop()** — remove from end, O(1)\n**insert(i, x)** — add at position i, O(n)\n**remove(x)** — remove first match, O(n)\n\nAppend and pop are fast. Insert and remove are slow because they shift elements.",
            example: "cart = ['rice', 'eggs']\ncart.append('milk')     # add to end\ncart.pop()              # remove last\ncart.insert(0, 'bread') # slow!\ncart.remove('eggs')     # slow!",
          },
          {
            title: "Looping through a list",
            content: "The most common thing you'll do with lists is loop through them. Two ways:\n\n**for item in list** — gives you each value\n**for i in range(len(list))** — gives you each index\n\nUse the first when you only need values. Use the second when you need to know the position.",
            example: "scores = [85, 92, 78, 95]\n\n# Print each score\nfor score in scores:\n    print(score)\n\n# Print with position\nfor i in range(len(scores)):\n    print(f'Student {i}: {scores[i]}')",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "ls-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "arr = [10, 20, 30]. What is arr[-1]?",
            options: ["10", "20", "30", "Error"],
            correctIndex: 2,
            explanation: "-1 always refers to the last element. arr[-1] = 30.",
          },
          {
            question: "Which operation is O(1) on a list?",
            options: ["insert at index 0", "remove a value", "append to end", "search for a value"],
            correctIndex: 2,
            explanation: "append() adds to the end without shifting anything — O(1). All others are O(n).",
          },
          {
            question: "How do you get the number of items in a list called data?",
            options: ["data.count()", "count(data)", "len(data)", "data.length"],
            correctIndex: 2,
            explanation: "len() is Python's built-in function to count items. It works on lists, strings, and more.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "ls-summary",
      type: "summary",
      config: {
        xpEarned: 100,
        title: "Data Structure Unlocked! 🗂️",
        message: "You just learned your first real data structure. Arrays/lists are the foundation of almost every DSA problem you'll ever solve.",
        nextSession: "strings-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// STRINGS SESSION
// ──────────────────────────────────────────────────────

registerSession({
  id: "session-strings",
  slug: "strings-basics",
  title: "Strings — Text Is Just a List of Letters",
  topic: "python-foundations",
  description: "Master Python strings — indexing, slicing, f-strings, and the methods that show up in every DSA problem.",
  estimatedMinutes: 13,
  xpTotal: 85,
  prerequisiteSessionSlug: "lists-basics",
  stages: [
    {
      id: "st-hook",
      type: "hook",
      config: {
        headline: "Every username, every password, every message you've ever sent.\nAll stored as strings.",
        subtext: "Strings are secretly just lists of characters. Master them and half of all Easy DSA problems become straightforward.",
        backgroundEmoji: "✍️",
      } satisfies HookConfig,
    },
    {
      id: "st-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "name = 'AlgoRich'", label: "Each character has an index: A=0, l=1, g=2..." } as TextFlowStep,
          { text: "name[0]  → 'A'", label: "Index 0 = first character, just like a list" } as TextFlowStep,
          { text: "name[-1] → 'h'", label: "Negative index: -1 = last character" } as TextFlowStep,
          { text: "name[0:4] → 'Algo'", label: "Slicing: start:end (end not included)" } as TextFlowStep,
          { text: "name.upper() → 'ALGORICH'", label: ".upper() makes all letters capital" } as TextFlowStep,
          { text: "len(name) → 8", label: "len() counts characters, same as with lists" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "st-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "st-p1",
            question: "s = 'Python'\nWhat is s[1:4]?",
            answerType: "multiple-choice",
            options: ["Pyt", "yth", "ytho", "ython"],
            correctAnswer: "yth",
            feedbackCorrect: "s[1:4] means index 1 up to (not including) index 4: y, t, h → 'yth'",
            feedbackWrong: "Slicing s[start:end] includes start, excludes end. s[1:4] = characters at 1, 2, 3 = 'yth'.",
            xp: 15,
          },
          {
            id: "st-p2",
            question: "What does 'hello'.upper() return?",
            answerType: "multiple-choice",
            options: ["hello", "Hello", "HELLO", "Error"],
            correctAnswer: "HELLO",
            feedbackCorrect: ".upper() converts every character to uppercase.",
            feedbackWrong: ".upper() makes all letters uppercase. 'hello'.upper() = 'HELLO'.",
            xp: 10,
          },
          {
            id: "st-p3",
            question: "name = 'Vani'\nWhat does f'Hello {name}!' print?",
            answerType: "multiple-choice",
            options: ["Hello {name}!", "Hello Vani!", "Hello name!", "Error"],
            correctAnswer: "Hello Vani!",
            feedbackCorrect: "f-strings replace {variable} with its value. f'Hello {name}!' → 'Hello Vani!'",
            feedbackWrong: "f-strings (f'...') replace anything inside {} with the variable's actual value.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "st-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Strings are lists of characters",
            content: "A string behaves just like a list. You can use index access, negative indexing, slicing — all the same rules.\n\n**s[i]** — character at index i\n**s[-1]** — last character\n**s[start:end]** — slice from start to end (not including end)\n**len(s)** — number of characters",
            example: "s = 'hello'\nprint(s[0])     # 'h'\nprint(s[-1])    # 'o'\nprint(s[1:4])   # 'ell'\nprint(len(s))   # 5",
          },
          {
            title: "The methods every DSA solver uses",
            content: "These 6 string methods appear in DSA problems constantly:\n\n**.lower()** / **.upper()** — change case\n**.strip()** — remove whitespace from ends\n**.split()** — split into a list of words\n**.replace(a,b)** — swap a for b\n**.count(x)** — count occurrences of x\n**x in s** — check if x is inside s",
            example: "s = '  Hello World  '\nprint(s.strip())          # 'Hello World'\nprint(s.lower())          # '  hello world  '\nprint(s.split())          # ['Hello', 'World']\nprint('ell' in 'hello')   # True",
          },
          {
            title: "f-strings — the modern way to format",
            content: "f-strings let you embed variables directly inside text. Put f before the quote, then {variable} wherever you want the value.\n\nThis replaces the old % formatting and .format() method. Use f-strings always.",
            example: "name = 'Vani'\nage = 19\nscore = 9.04\n\nprint(f'Name: {name}')\nprint(f'Age: {age}')\nprint(f'CGPA: {score:.2f}')  # 2 decimal places",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "st-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "s = 'coding'. What is s[2:5]?",
            options: ["cod", "din", "odi", "ding"],
            correctIndex: 1,
            explanation: "s[2:5] = characters at index 2, 3, 4 = d, i, n → 'din'",
          },
          {
            question: "How do you check if 'cat' is inside 'concatenate'?",
            options: ["'cat'.in('concatenate')", "'cat' in 'concatenate'", "contains('cat', 'concatenate')", "'concatenate'.find('cat') == True"],
            correctIndex: 1,
            explanation: "'cat' in 'concatenate' returns True. The in operator works on strings just like lists.",
          },
          {
            question: "What does 'hello world'.split() return?",
            options: ["'hello', 'world'", "['hello', 'world']", "['h','e','l','l','o',' ','w','o','r','l','d']", "Error"],
            correctIndex: 1,
            explanation: ".split() splits on whitespace by default and returns a list of words: ['hello', 'world'].",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "st-summary",
      type: "summary",
      config: {
        xpEarned: 85,
        title: "String Master! ✍️",
        message: "Strings unlocked. You now have all Python foundations needed to start solving real DSA problems.",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// WHILE LOOPS SESSION
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-while-loops",
  slug: "while-loops",
  title: "While Loops — Repeat Until You Say Stop",
  topic: "python-foundations",
  description: "while loops keep running as long as a condition is true. Master this and you can automate anything.",
  estimatedMinutes: 12,
  xpTotal: 85,
  prerequisiteSessionSlug: "if-else-basics",
  nextSessionSlug: "functions-basics",
  stages: [
    {
      id: "wl-hook",
      type: "hook",
      config: {
        headline: "Your phone keeps checking for new messages until you put it down.\nThat's a while loop.",
        subtext: "In 12 minutes you'll understand the most powerful loop in programming — and when it can go wrong.",
        backgroundEmoji: "🔄",
      } satisfies HookConfig,
    },
    {
      id: "wl-watch",
      type: "watch",
      config: {
        visualizerType: "counter-animation",
        steps: [
          { code: "count = 1", counter: 1, narration: "Start: count is 1" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 1, output: "1 <= 3 is True → enter loop" } as CounterAnimationStep,
          { code: "    print(count)", counter: 1, output: "Prints: 1" } as CounterAnimationStep,
          { code: "    count += 1", counter: 2, output: "count is now 2" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 2, output: "2 <= 3 is True → loop again" } as CounterAnimationStep,
          { code: "    print(count)", counter: 2, output: "Prints: 2" } as CounterAnimationStep,
          { code: "    count += 1", counter: 3, output: "count is now 3" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 3, output: "3 <= 3 is True → loop again" } as CounterAnimationStep,
          { code: "    print(count)", counter: 3, output: "Prints: 3" } as CounterAnimationStep,
          { code: "    count += 1", counter: 4, output: "count is now 4" } as CounterAnimationStep,
          { code: "while count <= 3:", counter: 4, output: "4 <= 3 is False → EXIT loop" } as CounterAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "wl-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "wl-p1",
            question: "x = 10\nwhile x > 0:\n    x -= 3\nWhat is x when the loop ends?",
            answerType: "multiple-choice",
            options: ["-2", "0", "1", "-3"],
            correctAnswer: "-2",
            feedbackCorrect: "10→7→4→1→-2. At -2, condition x>0 is False and loop stops.",
            feedbackWrong: "Trace it: 10-3=7, 7-3=4, 4-3=1, 1-3=-2. Now -2>0 is False so loop stops at -2.",
            xp: 15,
          },
          {
            id: "wl-p2",
            question: "What is an infinite loop?",
            answerType: "multiple-choice",
            options: [
              "A loop that runs exactly 10 times",
              "A loop whose condition never becomes False",
              "A loop inside another loop",
              "A loop with no body",
            ],
            correctAnswer: "A loop whose condition never becomes False",
            feedbackCorrect: "If the condition stays True forever, the loop never stops — infinite loop!",
            feedbackWrong: "An infinite loop happens when the condition is always True and never changes.",
            xp: 10,
          },
          {
            id: "wl-p3",
            question: "When should you use while instead of for?",
            answerType: "multiple-choice",
            options: [
              "When you know exactly how many times to loop",
              "When you don't know how many times to loop",
              "When looping over a list",
              "When looping over a string",
            ],
            correctAnswer: "When you don't know how many times to loop",
            feedbackCorrect: "Use while when the number of iterations depends on a condition, not a count.",
            feedbackWrong: "for is for known counts. while is for 'keep going until something happens'.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "wl-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "while vs for — when to use each",
            content: "**for loop** — use when you know how many times:\n• Loop through a list\n• Count from 1 to 10\n• Repeat exactly N times\n\n**while loop** — use when you don't know how many times:\n• Keep asking for input until valid\n• Keep retrying until success\n• Game loop: play until player quits",
            example: "# for: known count\nfor i in range(5):\n    print(i)\n\n# while: unknown count\npassword = ''\nwhile password != 'secret':\n    password = input('Enter password: ')",
          },
          {
            title: "break and continue",
            content: "**break** — exit the loop immediately, even if condition is still True\n**continue** — skip the rest of this iteration, go to next\n\nThink of break as an emergency exit. Think of continue as 'skip this one, keep going'.",
            example: "# break: stop when found\nfor num in [1, 2, 3, 4, 5]:\n    if num == 3:\n        break\n    print(num)   # prints 1, 2\n\n# continue: skip evens\nfor num in range(6):\n    if num % 2 == 0:\n        continue\n    print(num)   # prints 1, 3, 5",
          },
          {
            title: "Always have an exit condition",
            content: "Every while loop MUST eventually become False or have a break. Forgetting this creates an infinite loop — your program freezes forever.\n\nRule: every time you write while, immediately ask yourself: 'What makes this stop?'",
            example: "# DANGEROUS — infinite loop!\ncount = 0\nwhile count < 10:\n    print(count)\n    # forgot count += 1 !\n\n# SAFE\ncount = 0\nwhile count < 10:\n    print(count)\n    count += 1  # ← always update!",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "wl-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "n = 5. How many times does this loop run?\nwhile n > 0:\n    n -= 2",
            options: ["2", "3", "5", "infinite"],
            correctIndex: 1,
            explanation: "5→3→1→-1. Loop runs 3 times: n=5(True), n=3(True), n=1(True), n=-1(False, stop).",
          },
          {
            question: "What does break do inside a loop?",
            options: [
              "Skips current iteration",
              "Exits the loop immediately",
              "Restarts the loop",
              "Pauses the loop",
            ],
            correctIndex: 1,
            explanation: "break immediately exits the loop, regardless of whether the condition is still True.",
          },
          {
            question: "Which is better for looping through a list?",
            options: ["while", "for", "They are identical", "Neither works"],
            correctIndex: 1,
            explanation: "for is designed for iterating over sequences. while is for condition-based repetition.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "wl-summary",
      type: "summary",
      config: {
        xpEarned: 85,
        title: "Loop Master! 🔄",
        message: "You now control both types of loops. For loops for counting, while loops for conditions. This is the foundation of every algorithm.",
        nextSession: "functions-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// TYPE CONVERSION SESSION
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-type-conversion",
  slug: "type-conversion",
  title: "Type Conversion — Changing What Things Are",
  topic: "python-foundations",
  description: "Convert between int, float, str, and bool. The skill that prevents 90% of beginner bugs.",
  estimatedMinutes: 10,
  xpTotal: 75,
  prerequisiteSessionSlug: "data-types",
  nextSessionSlug: "if-else-basics",
  stages: [
    {
      id: "tc-hook",
      type: "hook",
      config: {
        headline: "Your app asks for a user's age. They type '17'.\nBut '17' is text — you can't do math with it yet.",
        subtext: "Type conversion is how you turn text into numbers and back. Every real app uses this constantly.",
        backgroundEmoji: "🔄",
      } satisfies HookConfig,
    },
    {
      id: "tc-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "age_text = '17'", value: "'17'", output: "This is a string — can't do math!" } as BoxAnimationStep,
          { action: "update", label: "age = int('17')", value: "'17'", newValue: "17", output: "int() converts string → integer" } as BoxAnimationStep,
          { action: "read", label: "age + 1", value: "17", output: "18 ✓ Now we can do math" } as BoxAnimationStep,
          { action: "create", label: "price = 9.99", value: "9.99", output: "This is a float" } as BoxAnimationStep,
          { action: "update", label: "int(price)", value: "9.99", newValue: "9", output: "int() cuts the decimal — no rounding!" } as BoxAnimationStep,
          { action: "create", label: "score = 100", value: "100", output: "This is an int" } as BoxAnimationStep,
          { action: "update", label: "str(score)", value: "100", newValue: "'100'", output: "str() converts to text for printing" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "tc-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "tc-p1",
            question: "What does int(3.9) return?",
            answerType: "multiple-choice",
            options: ["4", "3", "3.9", "Error"],
            correctAnswer: "3",
            feedbackCorrect: "int() truncates (cuts off) the decimal — it does NOT round. 3.9 → 3.",
            feedbackWrong: "int() cuts the decimal part, it doesn't round. 3.9 becomes 3, not 4.",
            xp: 10,
          },
          {
            id: "tc-p2",
            question: "x = input('Enter age: ')  # user types 20\nWhat type is x?",
            answerType: "multiple-choice",
            options: ["int", "float", "str", "bool"],
            correctAnswer: "str",
            feedbackCorrect: "input() ALWAYS returns a string, even if the user types a number. Always convert!",
            feedbackWrong: "input() always returns str. Even if user types 20, x is '20' not 20. Use int(input()) to get a number.",
            xp: 15,
          },
          {
            id: "tc-p3",
            question: "What does bool(0) return?",
            answerType: "multiple-choice",
            options: ["True", "False", "0", "Error"],
            correctAnswer: "False",
            feedbackCorrect: "0 is falsy in Python. bool(0) = False. Any non-zero number is True.",
            feedbackWrong: "In Python: 0, '', [], None are all falsy (convert to False). Everything else is True.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "tc-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The 4 conversion functions",
            content: "**int(x)** — convert to whole number (cuts decimals)\n**float(x)** — convert to decimal number\n**str(x)** — convert to text\n**bool(x)** — convert to True/False\n\nThese are the most used functions in every Python program.",
            example: "int('42')      # 42\nint(3.9)       # 3  (truncates!)\nfloat('3.14')  # 3.14\nstr(100)       # '100'\nbool(0)        # False\nbool('hello')  # True",
          },
          {
            title: "input() always gives you a string",
            content: "This catches every beginner. input() returns str no matter what the user types.\n\nIf you need a number from input, wrap it: int(input()) or float(input()).\n\nThis is the number 1 source of TypeError bugs in beginner code.",
            example: "# WRONG — x is a string!\nage = input('Age: ')\nif age > 18:  # TypeError!\n    print('Adult')\n\n# CORRECT\nage = int(input('Age: '))\nif age > 18:\n    print('Adult')",
          },
          {
            title: "Truthiness — every value has a bool",
            content: "Python evaluates any value as True or False in an if statement.\n\n**Falsy** (become False): 0, 0.0, '', [], {}, None\n**Truthy** (become True): everything else\n\nThis is used constantly in DSA problems.",
            example: "# These all count as False:\nif 0: print('no')\nif '': print('no')\nif []: print('no')\n\n# These are True:\nif 1: print('yes')\nif 'hi': print('yes')\nif [1,2]: print('yes')",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "tc-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What does int('7.5') return?",
            options: ["7", "8", "7.5", "Error"],
            correctIndex: 3,
            explanation: "int() cannot convert a float-string directly. You'd need int(float('7.5')). int('7.5') raises a ValueError.",
          },
          {
            question: "name = input('Name: ')  — what type is name?",
            options: ["int", "float", "str", "depends on what user types"],
            correctIndex: 2,
            explanation: "input() always returns str, regardless of what the user types. Always.",
          },
          {
            question: "Which values are falsy in Python?",
            options: [
              "Only False",
              "False, 0, '', [], None",
              "False and None only",
              "Only 0 and False",
            ],
            correctIndex: 1,
            explanation: "Falsy values: False, 0, 0.0, '', [], {}, set(), None. All others are truthy.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "tc-summary",
      type: "summary",
      config: {
        xpEarned: 75,
        title: "Type Converter! 🔄",
        message: "You can now safely convert between types. This eliminates the most common beginner bugs instantly.",
        nextSession: "if-else-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// FUNCTIONS SCOPE SESSION
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-functions-scope",
  slug: "functions-scope",
  title: "Scope & Built-ins — Where Variables Live",
  topic: "python-foundations",
  description: "Why can't you use a variable from inside a function outside it? Scope explains everything.",
  estimatedMinutes: 11,
  xpTotal: 80,
  prerequisiteSessionSlug: "functions-basics",
  nextSessionSlug: "lists-basics",
  stages: [
    {
      id: "fs-hook",
      type: "hook",
      config: {
        headline: "Imagine every classroom has its own whiteboard.\nWhat's written in Room A doesn't exist in Room B.",
        subtext: "That's scope. In 11 minutes you'll understand why variables disappear and how to use Python's built-in tools.",
        backgroundEmoji: "🏫",
      } satisfies HookConfig,
    },
    {
      id: "fs-watch",
      type: "watch",
      config: {
        visualizerType: "box-animation",
        steps: [
          { action: "create", label: "name = 'Vani'  # global", value: "'Vani'", output: "Global scope — visible everywhere" } as BoxAnimationStep,
          { action: "create", label: "def greet():", value: "function", output: "Function creates its own scope (room)" } as BoxAnimationStep,
          { action: "create", label: "    message = 'Hello'", value: "'Hello'", output: "Local variable — only lives inside greet()" } as BoxAnimationStep,
          { action: "read", label: "    print(name)", value: "'Vani'", output: "Can READ global variables from inside" } as BoxAnimationStep,
          { action: "read", label: "greet()", value: "Hello Vani", output: "Function runs fine" } as BoxAnimationStep,
          { action: "read", label: "print(message)", value: "ERROR", output: "NameError: message only existed inside greet!" } as BoxAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "fs-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "fs-p1",
            question: "x = 10\ndef double():\n    x = x * 2\n    return x\ndouble()\nWhat is the global x after calling double()?",
            answerType: "multiple-choice",
            options: ["20", "10", "Error", "None"],
            correctAnswer: "10",
            feedbackCorrect: "The function creates its own local x = 20. The global x is untouched — still 10.",
            feedbackWrong: "Functions work on their own copy. The global x stays 10 unless you use global keyword.",
            xp: 15,
          },
          {
            id: "fs-p2",
            question: "What does max([3, 1, 4, 1, 5, 9]) return?",
            answerType: "multiple-choice",
            options: ["3", "1", "9", "5"],
            correctAnswer: "9",
            feedbackCorrect: "max() is a Python built-in that returns the largest value in a list.",
            feedbackWrong: "max() scans the entire list and returns the maximum value = 9.",
            xp: 10,
          },
          {
            id: "fs-p3",
            question: "Which built-in sorts a list in place?",
            answerType: "multiple-choice",
            options: ["sorted(list)", "list.sort()", "sort(list)", "list.sorted()"],
            correctAnswer: "list.sort()",
            feedbackCorrect: "list.sort() modifies the list directly. sorted(list) returns a new sorted list.",
            feedbackWrong: "list.sort() modifies in place (no return value). sorted(list) creates a new sorted list.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "fs-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Local vs Global scope",
            content: "**Global** — variables defined outside all functions. Visible everywhere.\n**Local** — variables defined inside a function. Disappear when function ends.\n\nFunctions can READ globals but cannot MODIFY them (without the global keyword).\n\nThis is by design — it prevents functions from accidentally breaking each other.",
            example: "total = 0  # global\n\ndef add(n):\n    result = n + 1  # local\n    return result\n\nprint(total)   # 0 ✓\nprint(result)  # NameError! result is gone",
          },
          {
            title: "Built-in functions you need daily",
            content: "Python ships with powerful tools. Stop writing these yourself:\n\n**len(x)** — length of list/string\n**max(x)** / **min(x)** — largest/smallest\n**sum(x)** — total of all numbers\n**sorted(x)** — new sorted list\n**range(n)** — generate numbers 0 to n-1\n**abs(x)** — absolute value\n**round(x, n)** — round to n decimals",
            example: "nums = [3, 1, 4, 1, 5, 9]\nprint(len(nums))      # 6\nprint(max(nums))      # 9\nprint(min(nums))      # 1\nprint(sum(nums))      # 23\nprint(sorted(nums))   # [1,1,3,4,5,9]",
          },
          {
            title: "Parameters are local variables",
            content: "When you pass a value into a function, Python creates a local copy. Changing it inside the function does NOT affect the original.\n\nException: if you pass a list and MODIFY it (not reassign), the change IS visible outside. This trips up everyone — remember it.",
            example: "def double(n):    # n is a local copy\n    n = n * 2\n    return n\n\nx = 5\ndouble(x)\nprint(x)   # still 5! original unchanged\n\n# But lists are different:\ndef add_item(lst):\n    lst.append(99)  # modifies original!\n\nnums = [1, 2]\nadd_item(nums)\nprint(nums)  # [1, 2, 99]",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "fs-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "A variable defined inside a function is called:",
            options: ["global", "local", "private", "inner"],
            correctIndex: 1,
            explanation: "Variables inside functions are local — they exist only during the function's execution.",
          },
          {
            question: "What does sum([1, 2, 3, 4]) return?",
            options: ["4", "10", "24", "Error"],
            correctIndex: 1,
            explanation: "sum() adds all elements: 1+2+3+4 = 10.",
          },
          {
            question: "After calling a function with a list argument, can the list be modified?",
            options: [
              "No, functions always get a copy",
              "Yes, if the function uses .append() or .remove()",
              "Only if you use return",
              "Only with global keyword",
            ],
            correctIndex: 1,
            explanation: "Lists are passed by reference. If the function calls .append()/.remove(), the original list changes. Reassigning the parameter (lst = []) does not.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "fs-summary",
      type: "summary",
      config: {
        xpEarned: 80,
        title: "Scope Expert! 🏫",
        message: "You now understand where variables live and die. This prevents some of the most confusing bugs in Python.",
        nextSession: "lists-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ══════════════════════════════════════════════════════
// PHASE 2 — LOGIC BUILDING
// ══════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────
// S1: Breaking Problems Into Steps
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-problem-thinking",
  slug: "problem-thinking",
  title: "Thinking Like a Programmer — Break It Down",
  topic: "logic-building",
  description: "Every hard problem is just several easy problems stacked. Learn the 5-step framework used by every software engineer.",
  estimatedMinutes: 13,
  xpTotal: 90,
  nextSessionSlug: "brute-force-first",
  stages: [
    {
      id: "pt-hook",
      type: "hook",
      config: {
        headline: "Nobody sits down and writes a perfect solution in one go.\nNot even senior engineers at Google.",
        subtext: "They use a framework. In 13 minutes you'll have the same framework — and it works on every problem forever.",
        backgroundEmoji: "🧠",
      } satisfies HookConfig,
    },
    {
      id: "pt-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "Problem: Find the largest number in a list", label: "Step 1 — UNDERSTAND: What are the inputs? What should come out?" } as TextFlowStep,
          { text: "Input: [3, 7, 1, 9, 4] → Output: 9", label: "Step 2 — EXAMPLE: Write a small example by hand first" } as TextFlowStep,
          { text: "Start with first number. Compare each next number.", label: "Step 3 — PLAN: Describe the steps in plain English" } as TextFlowStep,
          { text: "largest = nums[0]\nfor num in nums:\n    if num > largest:\n        largest = num", label: "Step 4 — CODE: Translate your plan into Python" } as TextFlowStep,
          { text: "Test with [3,7,1,9,4] → 9 ✓\nTest with [1] → 1 ✓\nTest with [] → crash! Fix needed", label: "Step 5 — TEST: Try normal cases AND edge cases" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "pt-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "pt-p1",
            question: "What should you do BEFORE writing any code?",
            answerType: "multiple-choice",
            options: [
              "Open your editor and start typing",
              "Understand the problem and write an example by hand",
              "Search Stack Overflow",
              "Memorize the solution",
            ],
            correctAnswer: "Understand the problem and write an example by hand",
            feedbackCorrect: "Always understand + example first. Code written without a plan is almost always wrong.",
            feedbackWrong: "Jumping to code is the #1 reason beginners get stuck. Understand → Example → Plan → Code → Test.",
            xp: 15,
          },
          {
            id: "pt-p2",
            question: "What is an edge case?",
            answerType: "multiple-choice",
            options: [
              "A case that happens most often",
              "An unusual input that can break your solution",
              "A case at the edge of the screen",
              "The last test case",
            ],
            correctAnswer: "An unusual input that can break your solution",
            feedbackCorrect: "Edge cases: empty list, single element, all negatives, duplicates. Always test these!",
            feedbackWrong: "Edge cases are unusual inputs like empty lists, negative numbers, or duplicates that break naive solutions.",
            xp: 10,
          },
          {
            id: "pt-p3",
            question: "You need to count vowels in a string. What's your FIRST step?",
            answerType: "multiple-choice",
            options: [
              "Write a for loop",
              "Import a library",
              "Write down what vowels are and try an example by hand",
              "Google the answer",
            ],
            correctAnswer: "Write down what vowels are and try an example by hand",
            feedbackCorrect: "Step 1 always: understand + example. For 'hello' → e, o → count is 2.",
            feedbackWrong: "Always start with understanding. What are vowels? Write 'hello' → find e, o → that's 2. NOW write code.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "pt-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The 5-step framework",
            content: "Use this on every single problem:\n\n1. **Understand** — What goes in? What comes out? Any constraints?\n2. **Example** — Work through a small example by hand\n3. **Plan** — Write steps in plain English (no code yet)\n4. **Code** — Translate your plan line by line\n5. **Test** — Try normal cases, then edge cases\n\nThis framework is used by engineers at every level.",
            example: "Problem: Sum all even numbers in a list\n\n1. Input: list of ints → Output: one int\n2. [1,2,3,4] → 2+4 = 6\n3. Loop through list. If number is even, add to total.\n4. total = 0\n   for n in nums:\n       if n % 2 == 0:\n           total += n\n5. Test [1,2,3,4]→6 ✓, []→0 ✓",
          },
          {
            title: "% (modulo) — the most useful operator",
            content: "The % operator gives you the remainder after division.\n\n5 % 2 = 1 (5 divided by 2 leaves remainder 1)\n6 % 2 = 0 (6 divided by 2 leaves no remainder)\n\n**Key insight**: if n % 2 == 0, the number is even. This pattern appears in hundreds of DSA problems.",
            example: "# Check even/odd\nfor n in range(10):\n    if n % 2 == 0:\n        print(f'{n} is even')\n    else:\n        print(f'{n} is odd')\n\n# Every 3rd item\nfor i in range(9):\n    if i % 3 == 0:\n        print(f'index {i}')",
          },
          {
            title: "Talking through your thinking",
            content: "In interviews, thinking out loud IS the skill being tested — not the final answer.\n\nPractice saying:\n• 'My inputs are X, my output should be Y'\n• 'Let me try an example: if input is..., then...'\n• 'My approach is to..., which would be O(n)'\n• 'Edge cases I should check: empty input, negatives'\n\nStart doing this now, even when alone.",
            example: "# Instead of staring blankly, say out loud:\n# 'OK so I need to find duplicates in a list.'\n# 'Example: [1,2,2,3] → True (2 is duplicate)'\n# 'Plan: use a set. If I see a number already\n#  in the set, it is a duplicate.'\n# 'Time: O(n), Space: O(n)'\n# THEN write the code.",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "pt-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What does n % 2 == 0 check?",
            options: ["n is odd", "n is even", "n is positive", "n is divisible by 3"],
            correctIndex: 1,
            explanation: "% gives the remainder. n % 2 == 0 means no remainder when divided by 2 → even number.",
          },
          {
            question: "In the 5-step framework, what comes AFTER writing an example?",
            options: ["Write code", "Plan in plain English", "Test edge cases", "Search online"],
            correctIndex: 1,
            explanation: "Understand → Example → Plan (English) → Code → Test. Planning before coding saves hours.",
          },
          {
            question: "Which is an edge case for a function that finds the minimum of a list?",
            options: ["[3, 1, 4]", "[1, 2, 3, 4, 5]", "[]", "[100, 200]"],
            correctIndex: 2,
            explanation: "An empty list [] is an edge case — your function would crash without handling it.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "pt-summary",
      type: "summary",
      config: {
        xpEarned: 90,
        title: "Framework Unlocked! 🧠",
        message: "You now have the same problem-solving framework senior engineers use. Apply it to every problem from here on.",
        nextSession: "brute-force-first",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// S2: Brute Force First
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-brute-force",
  slug: "brute-force-first",
  title: "Brute Force First — Then Optimize",
  topic: "logic-building",
  description: "The secret every good programmer knows: always start with the slow solution. Then make it fast.",
  estimatedMinutes: 14,
  xpTotal: 95,
  prerequisiteSessionSlug: "problem-thinking",
  nextSessionSlug: "big-o-basics",
  stages: [
    {
      id: "bf-hook",
      type: "hook",
      config: {
        headline: "Interviewers don't expect perfection immediately.\nThey want to see your thinking process.",
        subtext: "A working slow solution beats a broken fast one every time. In 14 minutes you'll learn why — and how to improve from there.",
        backgroundEmoji: "⚡",
      } satisfies HookConfig,
    },
    {
      id: "bf-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "Problem: Find two numbers that add up to target", label: "Two Sum — one of the most common interview problems" } as TextFlowStep,
          { text: "BRUTE FORCE:\nfor i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:", label: "Check every pair. Simple to understand. O(n²) — slow for large inputs." } as TextFlowStep,
          { text: "[2,7,11,15] target=9\nCheck 2+7=9 ✓ → found at index 0,1", label: "Works correctly — just not efficiently" } as TextFlowStep,
          { text: "OPTIMIZED:\nseen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:", label: "Use a hash map. One pass. O(n) — much faster." } as TextFlowStep,
          { text: "Brute: O(n²)\nOptimized: O(n)\nFor n=1,000,000: 1 trillion ops vs 1 million ops", label: "This is why optimization matters at scale" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "bf-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bf-p1",
            question: "You have a working O(n²) solution. What should you do?",
            answerType: "multiple-choice",
            options: [
              "Throw it away and start over",
              "Submit it, then explain how you'd optimize",
              "Never submit it",
              "Optimize before writing anything",
            ],
            correctAnswer: "Submit it, then explain how you'd optimize",
            feedbackCorrect: "A working solution + optimization plan beats a broken optimal solution every time.",
            feedbackWrong: "Working brute force + explaining optimizations is the correct interview approach.",
            xp: 15,
          },
          {
            id: "bf-p2",
            question: "A nested loop (loop inside loop) usually has what complexity?",
            answerType: "multiple-choice",
            options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
            correctAnswer: "O(n²)",
            feedbackCorrect: "For each of n elements, you loop n times again → n × n = O(n²).",
            feedbackWrong: "Two nested loops = O(n²). For n=1000: 1,000,000 operations. Gets slow fast.",
            xp: 10,
          },
          {
            id: "bf-p3",
            question: "What data structure makes 'have I seen this before?' O(1)?",
            answerType: "multiple-choice",
            options: ["List", "Set or Dictionary", "Tuple", "String"],
            correctAnswer: "Set or Dictionary",
            feedbackCorrect: "set and dict use hash tables. Checking 'x in my_set' is O(1) — instant lookup.",
            feedbackWrong: "Sets and dicts use hashing. 'x in my_set' is O(1). 'x in my_list' is O(n).",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "bf-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The brute force → optimize pattern",
            content: "For every problem:\n\n1. Write the simplest solution first (usually nested loops)\n2. Make sure it's correct\n3. Ask: 'What's slow here? What's being repeated?'\n4. Find the right data structure to eliminate the repetition\n\nThis is how 90% of optimization works in DSA.",
            example: "# Brute: O(n²) — check every pair\ndef has_duplicate_slow(nums):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False\n\n# Optimized: O(n) — use a set\ndef has_duplicate_fast(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False",
          },
          {
            title: "Sets — the brute force killer",
            content: "A set stores unique values and answers 'is X in here?' in O(1).\n\nWhenever your brute force is checking 'did I see this before?' or 'does this exist somewhere?', a set turns that O(n) scan into O(1).\n\nThis single insight solves hundreds of DSA problems.",
            example: "# Without set: O(n) scan each time\nif target in my_list:  # O(n)\n\n# With set: O(1) lookup\nmy_set = set(my_list)   # O(n) to build\nif target in my_set:    # O(1) !\n\n# Set operations\ns = {1, 2, 3}\ns.add(4)        # O(1)\n4 in s          # O(1)\ns.remove(2)     # O(1)",
          },
          {
            title: "Dictionaries — sets with values attached",
            content: "A dict is like a set but each key has a value attached.\n\nUse a dict when you need to remember not just 'did I see X' but also 'where/how many times did I see X'.\n\nThis pattern — counting, indexing, mapping — appears constantly in DSA.",
            example: "# Count frequency: O(n)\ndef count_chars(s):\n    freq = {}\n    for char in s:\n        if char in freq:\n            freq[char] += 1\n        else:\n            freq[char] = 1\n    return freq\n\n# Shorter with .get()\ndef count_chars(s):\n    freq = {}\n    for char in s:\n        freq[char] = freq.get(char, 0) + 1\n    return freq",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "bf-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is the time complexity of checking 'x in my_set'?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctIndex: 2,
            explanation: "Set lookup uses hashing — direct access, no scanning. Always O(1).",
          },
          {
            question: "You need to count how many times each number appears in a list. Best data structure?",
            options: ["List", "Set", "Dictionary", "Tuple"],
            correctIndex: 2,
            explanation: "Dict maps each number (key) to its count (value). Perfect for frequency counting.",
          },
          {
            question: "Your nested loop solution is O(n²). What's the first question to ask to optimize?",
            options: [
              "How do I sort this?",
              "What am I repeatedly looking up that a set/dict could answer in O(1)?",
              "Should I use recursion?",
              "Can I use a library?",
            ],
            correctIndex: 1,
            explanation: "Most O(n²) → O(n) optimizations come from replacing a repeated lookup with a set or dict.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "bf-summary",
      type: "summary",
      config: {
        xpEarned: 95,
        title: "Optimizer Unlocked! ⚡",
        message: "Brute force first, then optimize. This mindset separates problem solvers from code memorizers.",
        nextSession: "big-o-basics",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// S3: Big-O Basics
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-big-o",
  slug: "big-o-basics",
  title: "Big-O — How Fast Is Your Code?",
  topic: "logic-building",
  description: "Big-O tells you how your code slows down as input grows. Every interviewer asks this. Understand it forever in 15 minutes.",
  estimatedMinutes: 15,
  xpTotal: 100,
  prerequisiteSessionSlug: "brute-force-first",
  nextSessionSlug: "big-o-reading",
  stages: [
    {
      id: "bo-hook",
      type: "hook",
      config: {
        headline: "Your solution works on 10 items.\nWill it still work on 10 million?",
        subtext: "Big-O is how you answer that question. Every single interview asks it. In 15 minutes you'll speak it fluently.",
        backgroundEmoji: "📈",
      } satisfies HookConfig,
    },
    {
      id: "bo-watch",
      type: "watch",
      config: {
        visualizerType: "counter-animation",
        steps: [
          { code: "# O(1) — constant", counter: 1, output: "Always 1 operation. Doesn't matter if list has 10 or 10M items." } as CounterAnimationStep,
          { code: "nums[0]  # index access", counter: 1, output: "Direct memory access → O(1)" } as CounterAnimationStep,
          { code: "# O(n) — linear", counter: "n", output: "Operations grow with input size." } as CounterAnimationStep,
          { code: "for num in nums:", counter: "n", output: "Visit each element once → O(n)" } as CounterAnimationStep,
          { code: "# O(n²) — quadratic", counter: "n²", output: "For n=1000: 1,000,000 operations!" } as CounterAnimationStep,
          { code: "for i in nums:\n    for j in nums:", counter: "n²", output: "Nested loops → O(n²)" } as CounterAnimationStep,
          { code: "# O(log n) — logarithmic", counter: "log n", output: "Halves the problem each step. Super fast!" } as CounterAnimationStep,
          { code: "# Binary search", counter: "log n", output: "For n=1,000,000: only ~20 operations!" } as CounterAnimationStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "bo-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bo-p1",
            question: "What is the Big-O of accessing nums[5]?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctAnswer: "O(1)",
            feedbackCorrect: "Index access calculates memory address directly — no scanning. Always O(1).",
            feedbackWrong: "Array index access is O(1). The computer knows exactly where index 5 is in memory.",
            xp: 10,
          },
          {
            id: "bo-p2",
            question: "n = 1000. Roughly how many operations does O(n²) do?",
            answerType: "multiple-choice",
            options: ["1,000", "10,000", "1,000,000", "1,000,000,000"],
            correctAnswer: "1,000,000",
            feedbackCorrect: "n² = 1000² = 1,000,000. This is why nested loops on large inputs are slow.",
            feedbackWrong: "O(n²) means n × n operations. 1000 × 1000 = 1,000,000.",
            xp: 15,
          },
          {
            id: "bo-p3",
            question: "Which grows SLOWEST as n increases?",
            answerType: "multiple-choice",
            options: ["O(n²)", "O(n)", "O(log n)", "O(1)"],
            correctAnswer: "O(1)",
            feedbackCorrect: "O(1) never grows — constant time regardless of input size. Best possible.",
            feedbackWrong: "From best to worst: O(1) < O(log n) < O(n) < O(n²). O(1) is always fastest.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "bo-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The Big-O hierarchy — memorize this",
            content: "From fastest to slowest:\n\n**O(1)** — constant: index access, dict lookup\n**O(log n)** — logarithmic: binary search\n**O(n)** — linear: one loop through n items\n**O(n log n)** — sort algorithms\n**O(n²)** — quadratic: nested loops\n**O(2ⁿ)** — exponential: avoid at all costs\n\nFor n = 1 million: O(1)=instant, O(n)=fast, O(n²)=crash",
            example: "n = 1_000_000\n\nO(1):     1 operation\nO(log n): ~20 operations\nO(n):     1,000,000 ops\nO(n²):    1,000,000,000,000 ops\n# O(n²) would take ~16 minutes!\n# O(n) takes milliseconds",
          },
          {
            title: "How to calculate Big-O",
            content: "Rules:\n1. Drop constants: O(2n) → O(n)\n2. Drop smaller terms: O(n² + n) → O(n²)\n3. One loop = O(n)\n4. Nested loops = O(n²)\n5. Halving each step = O(log n)\n\nYou only care about what happens when n gets HUGE.",
            example: "# Count operations, then simplify:\n\ndef example(nums):\n    x = nums[0]          # O(1)\n    for n in nums:       # O(n)\n        print(n)         # O(1) each\n    for i in nums:       # O(n)\n        for j in nums:   # O(n)\n            pass         # O(n²) total\n# Total: O(1 + n + n²) → O(n²)",
          },
          {
            title: "Space complexity",
            content: "Big-O also applies to memory, not just time.\n\n**O(1) space** — fixed memory regardless of input\n**O(n) space** — memory grows with input (e.g. creating a new list)\n\nInterviewers ask both. 'What's the time and space complexity?' is the most common follow-up question.",
            example: "# O(1) space — no extra memory\ndef sum_list(nums):\n    total = 0           # 1 variable\n    for n in nums:\n        total += n\n    return total\n\n# O(n) space — creates new list\ndef double_all(nums):\n    result = []         # grows with input\n    for n in nums:\n        result.append(n * 2)\n    return result",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "bo-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "A function has two separate loops (not nested). What is its Big-O?",
            options: ["O(1)", "O(n²)", "O(n)", "O(2n)"],
            correctIndex: 2,
            explanation: "Two separate loops = O(n) + O(n) = O(2n) → drop constant → O(n).",
          },
          {
            question: "What is the time complexity of Python's sorted() function?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correctIndex: 1,
            explanation: "Python's sort uses Timsort which is O(n log n). This is the theoretical best for comparison-based sorting.",
          },
          {
            question: "Your solution uses O(1) time but O(n) space. Is this better or worse than O(n) time O(1) space?",
            options: [
              "Always better",
              "Always worse",
              "Depends on whether time or memory is the bottleneck",
              "They are identical",
            ],
            correctIndex: 2,
            explanation: "This is a trade-off. In interviews, mention both and explain the context. Neither is universally better.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "bo-summary",
      type: "summary",
      config: {
        xpEarned: 100,
        title: "Complexity Analyst! 📈",
        message: "You can now read and write Big-O. Every DSA problem from here asks for this — you're ready.",
        nextSession: "big-o-reading",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// S4: Reading & Writing Big-O
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-big-o-reading",
  slug: "big-o-reading",
  title: "Reading Code Like a Pro — Spot the Complexity",
  topic: "logic-building",
  description: "Look at any code and immediately know its Big-O. This is the skill that impresses interviewers most.",
  estimatedMinutes: 12,
  xpTotal: 90,
  prerequisiteSessionSlug: "big-o-basics",
  nextSessionSlug: "arrays-and-big-o",
  stages: [
    {
      id: "bor-hook",
      type: "hook",
      config: {
        headline: "In an interview, you'll be shown code you've never seen.\nYou'll have 30 seconds to say its complexity.",
        subtext: "This session is pure practice. By the end you'll read Big-O as fast as you read English.",
        backgroundEmoji: "👁️",
      } satisfies HookConfig,
    },
    {
      id: "bor-watch",
      type: "watch",
      config: {
        visualizerType: "text-flow",
        steps: [
          { text: "def find_max(nums):\n    best = nums[0]\n    for n in nums:\n        if n > best:\n            best = n\n    return best", label: "One loop, no nesting → O(n) time, O(1) space" } as TextFlowStep,
          { text: "def has_pair(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i]+nums[j]==target:\n                return True", label: "Nested loops → O(n²) time, O(1) space" } as TextFlowStep,
          { text: "def binary_search(nums, target):\n    lo, hi = 0, len(nums)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if nums[mid]==target: return mid\n        elif nums[mid]<target: lo=mid+1\n        else: hi=mid-1", label: "Halves search space each step → O(log n) time, O(1) space" } as TextFlowStep,
          { text: "def unique(nums):\n    seen = set()\n    for n in nums:\n        if n in seen: return False\n        seen.add(n)\n    return True", label: "One loop + set → O(n) time, O(n) space (set grows with input)" } as TextFlowStep,
        ],
      } satisfies WatchConfig,
    },
    {
      id: "bor-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bor-p1",
            question: "def f(n):\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                print(i,j,k)\n\nWhat is the Big-O?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(n²)", "O(n³)", "O(3n)"],
            correctAnswer: "O(n³)",
            feedbackCorrect: "Three nested loops = n × n × n = O(n³). Avoid this at all costs.",
            feedbackWrong: "Each nested loop multiplies the complexity. 3 nested loops = O(n³).",
            xp: 15,
          },
          {
            id: "bor-p2",
            question: "result = [n*2 for n in nums]\nWhat is the space complexity?",
            answerType: "multiple-choice",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: "O(n)",
            feedbackCorrect: "List comprehension creates a new list of the same size as nums → O(n) space.",
            feedbackWrong: "A new list is created with one item per input item → O(n) space.",
            xp: 10,
          },
          {
            id: "bor-p3",
            question: "def f(nums):\n    nums.sort()\n    seen = set()\n    for n in nums:\n        seen.add(n)\n\nWhat is the time complexity?",
            answerType: "multiple-choice",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correctAnswer: "O(n log n)",
            feedbackCorrect: "sort() is O(n log n). The loop is O(n). Total: O(n log n + n) = O(n log n).",
            feedbackWrong: "sort() dominates at O(n log n). The loop is O(n). Keep the largest term: O(n log n).",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "bor-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Quick recognition rules",
            content: "Scan any function with these rules:\n\n• **Return/assign without loop** → O(1)\n• **One loop** → O(n)\n• **Loop + halving** → O(log n)\n• **Two nested loops** → O(n²)\n• **Sort call** → at least O(n log n)\n• **Set/dict built from input** → O(n) space\n• **Recursion** → analyze depth × work per call",
            example: "# Identify these:\ndef a(nums): return nums[0]        # O(1)\ndef b(nums):\n    for n in nums: print(n)        # O(n)\ndef c(nums):\n    nums.sort()                    # O(n log n)\ndef d(nums):\n    for i in nums:\n        for j in nums: pass        # O(n²)",
          },
          {
            title: "Common Python operations and their complexity",
            content: "Know these by heart:\n\n**O(1):** dict[key], set lookup, list append, list[-1]\n**O(n):** list search, list insert at 0, ' '.join(list)\n**O(n log n):** list.sort(), sorted()\n**O(n):** len(), max(), min(), sum()\n\nThe tricky ones: len() is O(1) (Python caches it), but max() is O(n) (must scan all).",
            example: "nums = [1, 2, 3, 4, 5]\n\nlen(nums)      # O(1) — cached\nnums[-1]       # O(1) — direct index\nmax(nums)      # O(n) — scans all\nnum in nums    # O(n) — scans all\nnum in my_set  # O(1) — hash lookup\nnums.sort()    # O(n log n)",
          },
          {
            title: "Amortized complexity",
            content: "Python list.append() is 'amortized O(1)'.\n\nMost of the time it's O(1). Occasionally (when the list needs to resize) it's O(n). But averaged over many appends, each one costs O(1).\n\nYou'll see 'amortized O(1)' in interviews. It means: fast on average, even if occasionally slow.",
            example: "# append() is amortized O(1)\nresult = []\nfor i in range(1_000_000):\n    result.append(i)    # amortized O(1) each\n# Total: O(n) — not O(n²)\n\n# vs insert at beginning — always O(n)\nfor i in range(1_000_000):\n    result.insert(0, i)  # O(n) each\n# Total: O(n²) — MUCH slower",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "bor-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is the time complexity of 'target in my_list'?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctIndex: 2,
            explanation: "List search scans from left to right — worst case checks all n elements → O(n).",
          },
          {
            question: "def f(nums): return sorted(nums)[0]\nWhat is the time complexity?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correctIndex: 2,
            explanation: "sorted() is O(n log n). Indexing [0] is O(1). Dominant term: O(n log n).",
          },
          {
            question: "list.append() is described as 'amortized O(1)'. What does amortized mean?",
            options: [
              "Always exactly 1 operation",
              "Fast on average even if occasionally slow",
              "Slower than O(1)",
              "Only works on small lists",
            ],
            correctIndex: 1,
            explanation: "Amortized means averaged over many operations. append() is usually O(1), occasionally O(n) for resize, but averages to O(1).",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "bor-summary",
      type: "summary",
      config: {
        xpEarned: 90,
        title: "Complexity Reader! 👁️",
        message: "You can now glance at any code and know its complexity. This is one of the most valuable skills in interviews.",
        nextSession: "arrays-and-big-o",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// S5: Two Pointers
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-two-pointers",
  slug: "two-pointers",
  title: "Two Pointers — The Pattern That Kills O(n²)",
  topic: "logic-building",
  description: "One of the 15 core DSA patterns. Two pointers turns brute force O(n²) solutions into O(n) elegantly.",
  estimatedMinutes: 16,
  xpTotal: 110,
  prerequisiteSessionSlug: "arrays-and-big-o",
  nextSessionSlug: "sliding-window",
  stages: [
    {
      id: "tp-hook",
      type: "hook",
      config: {
        headline: "Imagine searching for two people in a line who together weigh exactly 100kg.\nYou could check every pair — or you could be smart.",
        subtext: "Two pointers is the smart way. It appears in 30+ LeetCode problems and every company interview.",
        backgroundEmoji: "👆👆",
      } satisfies HookConfig,
    },
    {
      id: "tp-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 1, narration: "Sorted array: [1, 2, 3, 4, 6]. Target sum = 6.", delayAfterMs: 1500 },
          { action: "insert", value: 2, narration: "Left pointer starts at index 0 (value 1).", delayAfterMs: 1500 },
          { action: "insert", value: 3, narration: "Right pointer starts at last index (value 6).", delayAfterMs: 1500 },
          { action: "search", value: 1, narration: "1 + 6 = 7. Too big. Move right pointer left.", delayAfterMs: 2000 },
          { action: "search", value: 2, narration: "1 + 4 = 5. Too small. Move left pointer right.", delayAfterMs: 2000 },
          { action: "search", value: 3, narration: "2 + 4 = 6. Found it! Return indices [1, 3].", delayAfterMs: 2000 },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "tp-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "tp-p1",
            question: "Two pointers requires the array to be:",
            answerType: "multiple-choice",
            options: ["Unsorted", "Sorted", "Contains only positives", "Has no duplicates"],
            correctAnswer: "Sorted",
            feedbackCorrect: "Two pointers works by using sort order to decide which pointer to move. Unsorted arrays need other approaches.",
            feedbackWrong: "Two pointers relies on the array being sorted so you can logically move pointers.",
            xp: 10,
          },
          {
            id: "tp-p2",
            question: "arr = [1,3,5,7,9], target = 10\nLeft=0(1), Right=4(9). 1+9=10. What do you do?",
            answerType: "multiple-choice",
            options: ["Move left right", "Move right left", "Return the answer", "Start over"],
            correctAnswer: "Return the answer",
            feedbackCorrect: "1 + 9 = 10 = target. You found the pair. Return indices [0, 4].",
            feedbackWrong: "When left + right = target, you've found your answer. Return immediately.",
            xp: 15,
          },
          {
            id: "tp-p3",
            question: "Why is two pointers O(n) instead of O(n²)?",
            answerType: "multiple-choice",
            options: [
              "It uses recursion",
              "Each pointer moves at most n times — total moves ≤ 2n",
              "It sorts the array first",
              "It uses a hash map",
            ],
            correctAnswer: "Each pointer moves at most n times — total moves ≤ 2n",
            feedbackCorrect: "Left can move right at most n times. Right can move left at most n times. Total: 2n = O(n).",
            feedbackWrong: "Left moves right, right moves left. Together they traverse the array at most once each → O(n) total.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "tp-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "The two pointers template",
            content: "This template works for dozens of problems:\n\n1. Sort the array (if needed)\n2. left = 0, right = len(arr) - 1\n3. While left < right:\n   - Check the condition\n   - If too small: left += 1\n   - If too big: right -= 1\n   - If found: return/record\n\nThe key insight: sorted order lets you eliminate half the remaining possibilities with each move.",
            example: "def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        current = nums[left] + nums[right]\n        if current == target:\n            return [left, right]\n        elif current < target:\n            left += 1   # need bigger sum\n        else:\n            right -= 1  # need smaller sum\n    return []",
          },
          {
            title: "Two pointers — same direction variant",
            content: "Two pointers can also move in the SAME direction (fast & slow).\n\nUse case: remove duplicates, find middle of linked list, detect cycles.\n\nFast pointer races ahead. Slow pointer marks the 'write position'. Classic pattern for in-place array modification.",
            example: "# Remove duplicates in-place — O(n) time O(1) space\ndef remove_duplicates(nums):\n    if not nums:\n        return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1",
          },
          {
            title: "When to use two pointers",
            content: "Look for these signals in a problem:\n\n✓ Sorted array or can be sorted\n✓ Find pair/triplet with target sum\n✓ Check if palindrome\n✓ Remove duplicates in-place\n✓ Merge two sorted arrays\n✓ 'Minimum difference between two elements'\n\nWhenever you see 'find two elements that...' in a sorted context — think two pointers first.",
            example: "# Is this string a palindrome?\ndef is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True\n\n# 'racecar' → True\n# 'hello'   → False",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "tp-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Two pointers converts O(n²) to O(n) because:",
            options: [
              "It uses less memory",
              "Each pointer traverses the array at most once",
              "It sorts the array",
              "It uses recursion",
            ],
            correctIndex: 1,
            explanation: "Left moves right at most n times, right moves left at most n times. Total: O(2n) = O(n).",
          },
          {
            question: "arr = [2, 4, 6, 8], target = 10. Left=0(2), Right=3(8). 2+8=10. Next step?",
            options: ["Move left right", "Move right left", "Return [0, 3]", "Sort again"],
            correctIndex: 2,
            explanation: "2 + 8 = 10 = target. Return the indices [0, 3] immediately.",
          },
          {
            question: "Which problem is NOT a good fit for two pointers?",
            options: [
              "Is a string a palindrome?",
              "Find two numbers summing to target in sorted array",
              "Find the most frequent element in an unsorted array",
              "Remove duplicates from sorted array",
            ],
            correctIndex: 2,
            explanation: "Finding most frequent element requires counting → use a dict/Counter. Two pointers needs sorted order or sequential comparison.",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "tp-summary",
      type: "summary",
      config: {
        xpEarned: 110,
        title: "Pattern Unlocked: Two Pointers! 👆👆",
        message: "You now know your first DSA pattern. Two pointers appears in 30+ LeetCode problems. Recognize it and you'll solve them instantly.",
        nextSession: "sliding-window",
      } satisfies SummaryConfig,
    },
  ],
});

// ──────────────────────────────────────────────────────
// S6: Sliding Window
// ──────────────────────────────────────────────────────
registerSession({
  id: "session-sliding-window",
  slug: "sliding-window",
  title: "Sliding Window — Subarray Problems Made Easy",
  topic: "logic-building",
  description: "The pattern behind 'maximum sum subarray', 'longest substring without repeats', and dozens more.",
  estimatedMinutes: 15,
  xpTotal: 110,
  prerequisiteSessionSlug: "two-pointers",
  stages: [
    {
      id: "sw-hook",
      type: "hook",
      config: {
        headline: "Your phone shows 5 notifications at a time.\nAs new ones come, old ones slide off.",
        subtext: "That's a sliding window. It solves an entire category of subarray problems that would otherwise be O(n²).",
        backgroundEmoji: "🪟",
      } satisfies HookConfig,
    },
    {
      id: "sw-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        autoPlaySteps: [
          { action: "insert", value: 2, narration: "Array: [2,1,5,1,3,2]. Find max sum subarray of size 3.", delayAfterMs: 1500 },
          { action: "insert", value: 1, narration: "Window [2,1,5]: sum = 8. This is our first window.", delayAfterMs: 2000 },
          { action: "insert", value: 5, narration: "Slide: remove 2, add 1. Window [1,5,1]: sum = 7.", delayAfterMs: 2000 },
          { action: "search", value: 5, narration: "Slide: remove 1, add 3. Window [5,1,3]: sum = 9. New max!", delayAfterMs: 2000 },
          { action: "search", value: 3, narration: "Slide: remove 5, add 2. Window [1,3,2]: sum = 6.", delayAfterMs: 2000 },
          { action: "insert", value: 3, narration: "Done. Maximum sum = 9 from window [5,1,3]. O(n) total.", delayAfterMs: 2000 },
        ],
      } satisfies WatchConfig,
    },
    {
      id: "sw-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "sw-p1",
            question: "arr=[1,2,3,4,5], k=2. First window sum?",
            answerType: "multiple-choice",
            options: ["1", "3", "6", "2"],
            correctAnswer: "3",
            feedbackCorrect: "First window is arr[0:2] = [1,2]. Sum = 3.",
            feedbackWrong: "First window covers the first k=2 elements: arr[0]+arr[1] = 1+2 = 3.",
            xp: 10,
          },
          {
            id: "sw-p2",
            question: "Why is sliding window O(n) instead of O(n²)?",
            answerType: "multiple-choice",
            options: [
              "It sorts the array",
              "It reuses previous window sum — add one, remove one",
              "It uses recursion",
              "It skips elements",
            ],
            correctAnswer: "It reuses previous window sum — add one, remove one",
            feedbackCorrect: "Instead of summing k elements each time (O(k)), we just subtract left element and add right. O(1) per slide.",
            feedbackWrong: "Key insight: new_sum = old_sum - outgoing_element + incoming_element. One operation instead of k.",
            xp: 15,
          },
          {
            id: "sw-p3",
            question: "Variable window vs fixed window — when do you use variable?",
            answerType: "multiple-choice",
            options: [
              "Always use fixed window",
              "When the window size changes based on a condition",
              "When the array is sorted",
              "Variable is never used",
            ],
            correctAnswer: "When the window size changes based on a condition",
            feedbackCorrect: "Fixed: 'subarray of size k'. Variable: 'longest subarray where sum ≤ target'.",
            feedbackWrong: "Variable window expands/shrinks based on a condition. 'Longest substring without repeat' uses variable window.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },
    {
      id: "sw-learn",
      type: "learn",
      config: {
        cards: [
          {
            title: "Fixed window template",
            content: "When the window size k is given:\n\n1. Build first window (sum first k elements)\n2. Slide: for each new element, add it and remove the leftmost\n3. Track max/min as you go\n\nThis is O(n) because each element enters and leaves the window exactly once.",
            example: "def max_sum_subarray(nums, k):\n    # Build first window\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    \n    # Slide\n    for i in range(k, len(nums)):\n        window_sum += nums[i]        # add right\n        window_sum -= nums[i - k]    # remove left\n        max_sum = max(max_sum, window_sum)\n    \n    return max_sum",
          },
          {
            title: "Variable window template",
            content: "When you need to find the longest/shortest subarray satisfying a condition:\n\n1. left = 0, expand right pointer\n2. While condition violated: shrink from left\n3. Update answer at each valid state\n\nThe window expands when valid, shrinks when invalid.",
            example: "# Longest substring without repeating chars\ndef length_of_longest_substring(s):\n    seen = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len",
          },
          {
            title: "When to use sliding window",
            content: "Look for these signals:\n\n✓ 'Subarray' or 'substring'\n✓ 'Of size k' → fixed window\n✓ 'Longest/shortest subarray where...'\n✓ 'Maximum/minimum sum of k elements'\n✓ 'Contains at most k distinct characters'\n\nAny time you're looking at a contiguous portion of an array that moves — sliding window.",
            example: "# Signals in problem statements:\n# 'find max sum of k consecutive' → fixed\n# 'longest substring with no repeat' → variable\n# 'smallest subarray with sum ≥ target' → variable\n# 'number of subarrays of size k with avg ≥ x' → fixed\n\n# Two pointer vs sliding window:\n# Two pointers: pair of ELEMENTS (not subarray)\n# Sliding window: contiguous SUBARRAY",
          },
        ],
      } satisfies LearnConfig,
    },
    {
      id: "sw-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What makes sliding window O(n) instead of O(n*k)?",
            options: [
              "It sorts the array",
              "It adds right element and removes left — O(1) per slide",
              "It uses recursion",
              "It skips k elements",
            ],
            correctIndex: 1,
            explanation: "new_sum = old_sum - nums[left] + nums[right]. One subtraction + one addition = O(1) per slide.",
          },
          {
            question: "Problem: 'Find the longest substring with at most 2 distinct characters.' Which window type?",
            options: ["Fixed window", "Variable window", "Two pointers", "Binary search"],
            correctIndex: 1,
            explanation: "Window size changes based on condition (at most 2 distinct chars) → variable window.",
          },
          {
            question: "In variable window, when do you shrink from the left?",
            options: [
              "When window is too small",
              "When the condition is violated",
              "Every other step",
              "When right reaches end",
            ],
            correctIndex: 1,
            explanation: "Shrink from left when the current window violates the condition (e.g. too many distinct chars, sum too large).",
          },
        ],
      } satisfies ReflectConfig,
    },
    {
      id: "sw-summary",
      type: "summary",
      config: {
        xpEarned: 110,
        title: "Pattern Unlocked: Sliding Window! 🪟",
        message: "Two patterns down. Two pointers + sliding window covers a massive chunk of Easy and Medium LeetCode. You're building real DSA fluency.",
      } satisfies SummaryConfig,
    },
  ],
});

// ============================================================
// SESSION 4: LINKED LISTS
// ============================================================
registerSession({
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
});

// ============================================================
// SESSION 5: STACKS AND QUEUES
// ============================================================
registerSession({
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
});

// ============================================================
// SESSION 6: HASHMAPS
// ============================================================
registerSession({
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
});

// ============================================================
// SESSION 7: RECURSION
// ============================================================
registerSession({
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
});

// ============================================================
// SESSION 8: SORTING ALGORITHMS
// ============================================================
registerSession({
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
});

// ============================================================
// SESSION 9: TWO POINTERS
// ============================================================
registerSession({
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
});

// ============================================================
// SESSION 10: SLIDING WINDOW
// ============================================================
registerSession({
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
});

// ============================================================
// SESSION 11: BINARY SEARCH
// ============================================================
registerSession({
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
});
