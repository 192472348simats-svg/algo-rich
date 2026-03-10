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
  action: "insert" | "delete" | "search" | "traverse";
  value?: number;
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
    | "text-flow" | "box-animation" | "counter-animation" | "machine-animation";
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
  celebration?: string;
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
