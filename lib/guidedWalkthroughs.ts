// ── Guided Walkthrough Definitions ──────────────────────
// Step-by-step interactive walkthroughs for data structure visualizers
// Used by GuidedMode to walk users through operations with predictions

export type StepType =
  | "instruction"
  | "predict"
  | "insight"
  | "experiment"
  | "observe"
  | "auto-play";

export interface WalkthroughStep {
  id: string;
  type: StepType;
  narration: string;
  action?: "insert" | "delete" | "search";
  value?: number;
  expectedValue?: number;
  options?: string[];
  correctOption?: number; // index into options[]
  highlightNodes?: number[];
  config?: Record<string, unknown>;
}

export interface Walkthrough {
  id: string;
  slug: string;
  title: string;
  description: string;
  visualizerType: "tree" | "array" | "stack" | "linked-list";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  steps: WalkthroughStep[];
}

// ── Registry ──────────────────────────────────────────

const walkthroughRegistry = new Map<string, Walkthrough>();

function register(w: Walkthrough) {
  walkthroughRegistry.set(w.slug, w);
}

export function getWalkthrough(slug: string): Walkthrough | undefined {
  return walkthroughRegistry.get(slug);
}

export function getAllWalkthroughs(): Walkthrough[] {
  return Array.from(walkthroughRegistry.values());
}

export function getWalkthroughsByType(type: string): Walkthrough[] {
  return Array.from(walkthroughRegistry.values()).filter(
    (w) => w.visualizerType === type
  );
}

// ──────────────────────────────────────────────────────
// 1. BST Basics
// ──────────────────────────────────────────────────────
register({
  id: "wt-bst-basics",
  slug: "bst-basics",
  title: "BST Basics: Insert & Search",
  description: "Learn how Binary Search Trees organize data through insertion and searching.",
  visualizerType: "tree",
  difficulty: "beginner",
  estimatedMinutes: 8,
  steps: [
    {
      id: "bst-b-1",
      type: "instruction",
      narration: "A Binary Search Tree (BST) keeps smaller values on the left and larger values on the right. Let's build one step by step.",
    },
    {
      id: "bst-b-2",
      type: "auto-play",
      narration: "We start by inserting 50. It becomes the root — the first node in our tree.",
      action: "insert",
      value: 50,
    },
    {
      id: "bst-b-3",
      type: "predict",
      narration: "Now we insert 30. Since 30 < 50, where will it go?",
      options: ["Left of 50", "Right of 50", "Replace 50"],
      correctOption: 0,
      action: "insert",
      value: 30,
    },
    {
      id: "bst-b-4",
      type: "auto-play",
      narration: "Correct! 30 goes to the left of 50 because 30 < 50.",
      action: "insert",
      value: 30,
      highlightNodes: [50, 30],
    },
    {
      id: "bst-b-5",
      type: "predict",
      narration: "Next: insert 70. Where does it go?",
      options: ["Left of 50", "Right of 50", "Left of 30"],
      correctOption: 1,
      action: "insert",
      value: 70,
    },
    {
      id: "bst-b-6",
      type: "auto-play",
      narration: "70 > 50, so it goes right. Now we have a balanced little tree!",
      action: "insert",
      value: 70,
      highlightNodes: [50, 70],
    },
    {
      id: "bst-b-7",
      type: "predict",
      narration: "Insert 20. It's less than 50, so we go left to 30. Then 20 < 30, so where does it land?",
      options: ["Left of 30", "Right of 30", "Right of 50"],
      correctOption: 0,
      action: "insert",
      value: 20,
    },
    {
      id: "bst-b-8",
      type: "auto-play",
      narration: "20 goes to the left of 30. We always compare at each node until we find an empty spot.",
      action: "insert",
      value: 20,
      highlightNodes: [50, 30, 20],
    },
    {
      id: "bst-b-9",
      type: "experiment",
      narration: "Now try inserting 60 yourself. Think about the path: 60 > 50, so go right. Then 60 < 70, so...",
      action: "insert",
      expectedValue: 60,
    },
    {
      id: "bst-b-10",
      type: "insight",
      narration: "Key insight: BST search is O(log n) on average because each comparison eliminates half the remaining tree — just like binary search on a sorted array!",
    },
    {
      id: "bst-b-11",
      type: "predict",
      narration: "To search for 20, how many nodes do we visit?",
      options: ["1 (root only)", "2 (50 → 30)", "3 (50 → 30 → 20)"],
      correctOption: 2,
      action: "search",
      value: 20,
      highlightNodes: [50, 30, 20],
    },
    {
      id: "bst-b-12",
      type: "instruction",
      narration: "That's BST basics! The tree property (left < parent < right) makes searching, inserting, and deleting efficient — O(log n) on average.",
    },
  ],
});

// ──────────────────────────────────────────────────────
// 2. BST Deletion
// ──────────────────────────────────────────────────────
register({
  id: "wt-bst-deletion",
  slug: "bst-deletion",
  title: "BST Deletion: The Three Cases",
  description: "Master the three cases of deleting nodes from a BST.",
  visualizerType: "tree",
  difficulty: "intermediate",
  estimatedMinutes: 10,
  steps: [
    {
      id: "del-1",
      type: "instruction",
      narration: "Deleting from a BST has three cases: leaf node, one child, and two children. Let's build a tree first, then practice all three.",
    },
    {
      id: "del-2",
      type: "auto-play",
      narration: "Building our tree: inserting 50, 30, 70, 20, 40, 60, 80.",
      action: "insert",
      value: 50,
    },
    {
      id: "del-3",
      type: "auto-play",
      narration: "Adding left subtree...",
      action: "insert",
      value: 30,
    },
    {
      id: "del-4",
      type: "auto-play",
      action: "insert",
      value: 70,
      narration: "Adding right subtree...",
    },
    {
      id: "del-5",
      type: "auto-play",
      action: "insert",
      value: 20,
      narration: "Filling in the leaves...",
    },
    {
      id: "del-6",
      type: "auto-play",
      action: "insert",
      value: 40,
      narration: "Almost done building...",
    },
    {
      id: "del-7",
      type: "auto-play",
      action: "insert",
      value: 60,
      narration: "One more...",
    },
    {
      id: "del-8",
      type: "auto-play",
      action: "insert",
      value: 80,
      narration: "Tree built! Now let's practice deletion.",
    },
    {
      id: "del-9",
      type: "predict",
      narration: "Case 1 — Leaf node. Delete 20. Since 20 has no children, what happens?",
      options: ["Just remove it", "Replace with parent", "Swap with sibling"],
      correctOption: 0,
      action: "delete",
      value: 20,
      highlightNodes: [20],
    },
    {
      id: "del-10",
      type: "observe",
      narration: "Simple! A leaf node is just removed. The parent's pointer becomes null.",
      action: "delete",
      value: 20,
    },
    {
      id: "del-11",
      type: "insight",
      narration: "Case 2 — One child. If we delete 30 (which now has only child 40), what replaces 30?",
    },
    {
      id: "del-12",
      type: "predict",
      narration: "Delete node 30 which has one child (40). What happens?",
      options: ["40 takes 30's place", "The whole subtree is removed", "30 becomes a leaf"],
      correctOption: 0,
      action: "delete",
      value: 30,
      highlightNodes: [30, 40],
    },
    {
      id: "del-13",
      type: "insight",
      narration: "Case 3 — Two children is the tricky one. To delete a node with two children, we find its in-order successor (smallest value in right subtree) and swap.",
    },
    {
      id: "del-14",
      type: "instruction",
      narration: "Congratulations! You now understand all three BST deletion cases. This is frequently asked in interviews at Google and Amazon.",
    },
  ],
});

// ──────────────────────────────────────────────────────
// 3. Array Two Pointers
// ──────────────────────────────────────────────────────
register({
  id: "wt-array-two-pointers",
  slug: "array-two-pointers",
  title: "Two Pointers on Arrays",
  description: "See how the two-pointer technique efficiently processes sorted arrays.",
  visualizerType: "array",
  difficulty: "beginner",
  estimatedMinutes: 7,
  steps: [
    {
      id: "tp-1",
      type: "instruction",
      narration: "The two-pointer technique uses two indices that move toward each other. It's perfect for sorted arrays — turning O(n²) into O(n).",
    },
    {
      id: "tp-2",
      type: "auto-play",
      narration: "Let's find two numbers in [2, 7, 11, 15] that sum to 18. Left pointer starts at index 0, right at index 3.",
      action: "insert",
      value: 2,
    },
    {
      id: "tp-3",
      type: "predict",
      narration: "arr[left]=2, arr[right]=15. Sum = 17. That's less than 18. Which pointer should we move?",
      options: ["Move left pointer right (increase sum)", "Move right pointer left (decrease sum)", "Move both"],
      correctOption: 0,
    },
    {
      id: "tp-4",
      type: "auto-play",
      narration: "We move left pointer right to increase the sum. Now left=1 (arr[1]=7), right=3 (arr[3]=15). Sum = 22.",
      action: "insert",
      value: 7,
    },
    {
      id: "tp-5",
      type: "predict",
      narration: "Sum 22 > 18. Now which pointer moves?",
      options: ["Move left right", "Move right left", "Found it!"],
      correctOption: 1,
    },
    {
      id: "tp-6",
      type: "auto-play",
      narration: "Move right pointer left: now right=2 (arr[2]=11). Sum = 7 + 11 = 18. Found it!",
      action: "insert",
      value: 11,
    },
    {
      id: "tp-7",
      type: "insight",
      narration: "Two pointers work because the array is sorted. Moving left increases the sum, moving right decreases it. We converge on the answer in O(n) time.",
    },
    {
      id: "tp-8",
      type: "instruction",
      narration: "Two pointers is one of the most common interview patterns. It applies to: palindrome check, container with most water, 3Sum, and more.",
    },
  ],
});

// ──────────────────────────────────────────────────────
// 4. Stack Parentheses
// ──────────────────────────────────────────────────────
register({
  id: "wt-stack-parentheses",
  slug: "stack-parentheses",
  title: "Stack: Valid Parentheses",
  description: "Use a stack to validate matching brackets — a classic interview problem.",
  visualizerType: "stack",
  difficulty: "beginner",
  estimatedMinutes: 7,
  steps: [
    {
      id: "sp-1",
      type: "instruction",
      narration: "A stack is perfect for matching parentheses: push opening brackets, pop for closing ones. If the stack is empty at the end, the string is valid!",
    },
    {
      id: "sp-2",
      type: "auto-play",
      narration: "Let's check if '( [ { } ] )' is valid. First character '(' — it's an opener, push 1 onto the stack (representing '(').",
      action: "insert",
      value: 1,
    },
    {
      id: "sp-3",
      type: "auto-play",
      narration: "Next: '[' — another opener. Push 2 onto the stack.",
      action: "insert",
      value: 2,
    },
    {
      id: "sp-4",
      type: "auto-play",
      narration: "Next: '{' — push 3.",
      action: "insert",
      value: 3,
    },
    {
      id: "sp-5",
      type: "predict",
      narration: "Now we see '}'. What should happen with the stack?",
      options: ["Push 3 again", "Pop the top (3) — it matches!", "Return invalid"],
      correctOption: 1,
    },
    {
      id: "sp-6",
      type: "auto-play",
      narration: "Pop! Top was 3 ('{'), and we got '}'. They match! Stack now has [1, 2].",
      action: "delete",
      value: 3,
    },
    {
      id: "sp-7",
      type: "predict",
      narration: "Next: ']'. Stack top is 2 ('[').",
      options: ["Pop — they match", "Push new value", "Mismatch — invalid!"],
      correctOption: 0,
    },
    {
      id: "sp-8",
      type: "auto-play",
      narration: "Pop! ']' matches '['. Stack now has [1].",
      action: "delete",
      value: 2,
    },
    {
      id: "sp-9",
      type: "auto-play",
      narration: "Last: ')'. Pop 1 ('('). Match! Stack is empty.",
      action: "delete",
      value: 1,
    },
    {
      id: "sp-10",
      type: "insight",
      narration: "Stack is empty at the end → the string is VALID! If anything was left, or we tried to pop from an empty stack, it would be invalid.",
    },
    {
      id: "sp-11",
      type: "instruction",
      narration: "This exact problem (Valid Parentheses) appears in interviews at Amazon, Google, and Meta. Time: O(n), Space: O(n).",
    },
  ],
});

// ──────────────────────────────────────────────────────
// 5. Linked List Reversal
// ──────────────────────────────────────────────────────
register({
  id: "wt-linked-list-reverse",
  slug: "linked-list-reverse",
  title: "Reversing a Linked List",
  description: "The classic three-pointer technique for in-place linked list reversal.",
  visualizerType: "linked-list",
  difficulty: "beginner",
  estimatedMinutes: 8,
  steps: [
    {
      id: "ll-1",
      type: "instruction",
      narration: "Reversing a linked list uses three pointers: prev, current, and next. We flip each arrow one by one. Let's build a list first.",
    },
    {
      id: "ll-2",
      type: "auto-play",
      narration: "Building list: 10 → 20 → 30 → 40",
      action: "insert",
      value: 10,
    },
    {
      id: "ll-3",
      type: "auto-play",
      action: "insert",
      value: 20,
      narration: "Adding 20...",
    },
    {
      id: "ll-4",
      type: "auto-play",
      action: "insert",
      value: 30,
      narration: "Adding 30...",
    },
    {
      id: "ll-5",
      type: "auto-play",
      action: "insert",
      value: 40,
      narration: "List built: 10 → 20 → 30 → 40. Now let's reverse it.",
    },
    {
      id: "ll-6",
      type: "observe",
      narration: "Step 1: prev=None, current=10. Save next=20. Point 10's next to prev (None). Move prev=10, current=20.",
      highlightNodes: [10],
    },
    {
      id: "ll-7",
      type: "predict",
      narration: "Step 2: prev=10, current=20. After this step, where does 20 point?",
      options: ["Forward to 30", "Back to 10", "To None"],
      correctOption: 1,
      highlightNodes: [10, 20],
    },
    {
      id: "ll-8",
      type: "observe",
      narration: "Correct! 20 now points back to 10. We move: prev=20, current=30.",
      highlightNodes: [20, 30],
    },
    {
      id: "ll-9",
      type: "observe",
      narration: "Step 3: 30 points back to 20. Step 4: 40 points back to 30. Done! The reversed list: 40 → 30 → 20 → 10.",
      highlightNodes: [30, 40],
    },
    {
      id: "ll-10",
      type: "insight",
      narration: "Time O(n), Space O(1). No extra data structure needed — we just redirect pointers. This is the foundation for many linked list problems.",
    },
  ],
});

// ──────────────────────────────────────────────────────
// 6. Binary Search
// ──────────────────────────────────────────────────────
register({
  id: "wt-binary-search",
  slug: "array-binary-search",
  title: "Binary Search Step-by-Step",
  description: "Watch how binary search eliminates half the array at every step.",
  visualizerType: "array",
  difficulty: "beginner",
  estimatedMinutes: 7,
  steps: [
    {
      id: "bs-1",
      type: "instruction",
      narration: "Binary search finds a target in a sorted array by repeatedly halving the search space. O(log n) — incredibly efficient!",
    },
    {
      id: "bs-2",
      type: "auto-play",
      narration: "Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]. Target: 23. low=0, high=9, mid=4.",
      action: "insert",
      value: 16,
    },
    {
      id: "bs-3",
      type: "predict",
      narration: "arr[mid=4] = 16. Target is 23. What do we do?",
      options: ["Search left half (low to mid-1)", "Search right half (mid+1 to high)", "Found it!"],
      correctOption: 1,
    },
    {
      id: "bs-4",
      type: "auto-play",
      narration: "23 > 16, so low = mid + 1 = 5. Now low=5, high=9, mid=7.",
      action: "insert",
      value: 56,
    },
    {
      id: "bs-5",
      type: "predict",
      narration: "arr[mid=7] = 56. Target is 23. Which half?",
      options: ["Left half", "Right half", "Found!"],
      correctOption: 0,
    },
    {
      id: "bs-6",
      type: "auto-play",
      narration: "23 < 56, so high = mid - 1 = 6. Now low=5, high=6, mid=5.",
      action: "insert",
      value: 23,
    },
    {
      id: "bs-7",
      type: "observe",
      narration: "arr[mid=5] = 23 = target. Found it in just 3 steps! With 10 elements, that's way better than scanning all 10.",
    },
    {
      id: "bs-8",
      type: "insight",
      narration: "Binary search: O(log n). For 1 million elements, that's only ~20 comparisons instead of 1,000,000. This is why sorted data + binary search is so powerful.",
    },
    {
      id: "bs-9",
      type: "instruction",
      narration: "Binary search is foundational. Variations include: search insert position, search in rotated array, find peak element, and more.",
    },
  ],
});
