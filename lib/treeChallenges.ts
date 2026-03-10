/**
 * 30 Tree Prediction Challenges:
 *   10 beginner · 10 intermediate · 10 advanced
 */

export interface TreeChallenge {
  id: string;
  type:
    | "insert-parent"
    | "traversal-order"
    | "deletion-result"
    | "height"
    | "valid-bst";
  difficulty: "beginner" | "intermediate" | "advanced";
  treeValues: number[]; // insertion order to build tree
  question: string;
  operand?: number;
  correctAnswer: number | number[] | boolean;
  explanation: string;
  xpReward: number;
}

export const treeChallenges: TreeChallenge[] = [
  /* ========== BEGINNER (10) ========== */
  {
    id: "b1",
    type: "insert-parent",
    difficulty: "beginner",
    treeValues: [20, 10, 30],
    question: "If we insert 5, which node will be its parent?",
    operand: 5,
    correctAnswer: 10,
    explanation:
      "5 < 20 → go left to 10. 5 < 10 → go left, but 10 has no left child, so 10 becomes the parent.",
    xpReward: 10,
  },
  {
    id: "b2",
    type: "insert-parent",
    difficulty: "beginner",
    treeValues: [20, 10, 30],
    question: "If we insert 25, which node will be its parent?",
    operand: 25,
    correctAnswer: 30,
    explanation:
      "25 > 20 → go right to 30. 25 < 30 → go left, but 30 has no left child, so 30 becomes the parent.",
    xpReward: 10,
  },
  {
    id: "b3",
    type: "traversal-order",
    difficulty: "beginner",
    treeValues: [10, 5, 15],
    question: "What is the in-order traversal of this tree?",
    correctAnswer: [5, 10, 15],
    explanation:
      "In-order visits left → root → right: left subtree (5), root (10), right subtree (15).",
    xpReward: 10,
  },
  {
    id: "b4",
    type: "traversal-order",
    difficulty: "beginner",
    treeValues: [20, 10, 30],
    question: "What is the pre-order traversal of this tree?",
    correctAnswer: [20, 10, 30],
    explanation:
      "Pre-order visits root → left → right: root (20), left (10), right (30).",
    xpReward: 10,
  },
  {
    id: "b5",
    type: "height",
    difficulty: "beginner",
    treeValues: [10, 5, 15],
    question: "What is the height of this tree?",
    correctAnswer: 2,
    explanation:
      "The root is at depth 0, its children at depth 1. Height = 1 + max depth from root = 2 levels.",
    xpReward: 10,
  },
  {
    id: "b6",
    type: "insert-parent",
    difficulty: "beginner",
    treeValues: [15, 10, 20, 5],
    question: "If we insert 12, which node will be its parent?",
    operand: 12,
    correctAnswer: 10,
    explanation:
      "12 < 15 → go left to 10. 12 > 10 → go right, but 10 has no right child, so 10 becomes the parent.",
    xpReward: 10,
  },
  {
    id: "b7",
    type: "height",
    difficulty: "beginner",
    treeValues: [10],
    question: "What is the height of a single-node tree?",
    correctAnswer: 1,
    explanation:
      "A tree with just the root has height 1 (one level).",
    xpReward: 10,
  },
  {
    id: "b8",
    type: "traversal-order",
    difficulty: "beginner",
    treeValues: [20, 10, 30],
    question: "What is the post-order traversal of this tree?",
    correctAnswer: [10, 30, 20],
    explanation:
      "Post-order visits left → right → root: left (10), right (30), root (20).",
    xpReward: 10,
  },
  {
    id: "b9",
    type: "valid-bst",
    difficulty: "beginner",
    treeValues: [10, 5, 15],
    question: "Is this a valid Binary Search Tree?",
    correctAnswer: true,
    explanation:
      "5 < 10 < 15 — left child is less than root, right child is greater. Valid BST.",
    xpReward: 10,
  },
  {
    id: "b10",
    type: "insert-parent",
    difficulty: "beginner",
    treeValues: [20, 10, 30, 5, 15],
    question: "If we insert 35, which node will be its parent?",
    operand: 35,
    correctAnswer: 30,
    explanation:
      "35 > 20 → go right to 30. 35 > 30 → go right, but 30 has no right child, so 30 becomes the parent.",
    xpReward: 10,
  },

  /* ========== INTERMEDIATE (10) ========== */
  {
    id: "i1",
    type: "deletion-result",
    difficulty: "intermediate",
    treeValues: [20, 10, 30, 5, 15],
    question: "After deleting node 10, which node will take its place?",
    operand: 10,
    correctAnswer: 15,
    explanation:
      "Node 10 has two children (5 and 15). The in-order successor is 15 (smallest in right subtree), which replaces 10.",
    xpReward: 15,
  },
  {
    id: "i2",
    type: "deletion-result",
    difficulty: "intermediate",
    treeValues: [20, 10, 30, 25, 35],
    question: "After deleting node 30, which node will take its place?",
    operand: 30,
    correctAnswer: 35,
    explanation:
      "Node 30 has two children (25 and 35). The in-order successor is 35 (wait — no, smallest in right subtree of 30 is 35). Actually 30's right child is 35 and left child is 25. In-order successor = 35. But really we need the minimum of right subtree = 35.",
    xpReward: 15,
  },
  {
    id: "i3",
    type: "height",
    difficulty: "intermediate",
    treeValues: [20, 10, 30, 5, 15, 25, 35],
    question: "What is the height of this tree?",
    correctAnswer: 3,
    explanation:
      "Root (20) at level 1, children (10,30) at level 2, grandchildren (5,15,25,35) at level 3. Height = 3.",
    xpReward: 15,
  },
  {
    id: "i4",
    type: "traversal-order",
    difficulty: "intermediate",
    treeValues: [20, 10, 30, 5, 15, 25, 35],
    question: "What is the in-order traversal of this tree?",
    correctAnswer: [5, 10, 15, 20, 25, 30, 35],
    explanation:
      "In-order traversal of a BST always produces values in sorted order.",
    xpReward: 15,
  },
  {
    id: "i5",
    type: "height",
    difficulty: "intermediate",
    treeValues: [50, 30, 70, 20, 40, 60, 80, 10],
    question: "What is the depth of node 10?",
    correctAnswer: 3,
    explanation:
      "Path: 50 → 30 → 20 → 10. Node 10 is at depth 3 (root is depth 0).",
    xpReward: 15,
  },
  {
    id: "i6",
    type: "insert-parent",
    difficulty: "intermediate",
    treeValues: [50, 30, 70, 20, 40, 60, 80],
    question: "If we insert 45, which node will be its parent?",
    operand: 45,
    correctAnswer: 40,
    explanation:
      "45 < 50 → left to 30. 45 > 30 → right to 40. 45 > 40 → right, 40 has no right child → parent is 40.",
    xpReward: 15,
  },
  {
    id: "i7",
    type: "deletion-result",
    difficulty: "intermediate",
    treeValues: [20, 10, 30, 5],
    question: "After deleting leaf node 5, which node takes its place?",
    operand: 5,
    correctAnswer: -1,
    explanation:
      "Node 5 is a leaf (no children). When deleted, nothing takes its place — the position simply becomes empty.",
    xpReward: 15,
  },
  {
    id: "i8",
    type: "traversal-order",
    difficulty: "intermediate",
    treeValues: [15, 10, 20, 5, 12, 18, 25],
    question: "What is the BFS (level-order) traversal?",
    correctAnswer: [15, 10, 20, 5, 12, 18, 25],
    explanation:
      "BFS visits level by level: root (15), level 1 (10, 20), level 2 (5, 12, 18, 25).",
    xpReward: 15,
  },
  {
    id: "i9",
    type: "valid-bst",
    difficulty: "intermediate",
    treeValues: [20, 10, 30, 5, 15],
    question: "Is this a valid BST?",
    correctAnswer: true,
    explanation:
      "All left descendants < parent, all right descendants > parent. Valid BST.",
    xpReward: 15,
  },
  {
    id: "i10",
    type: "deletion-result",
    difficulty: "intermediate",
    treeValues: [20, 10, 30],
    question: "After deleting root node 20 (which has two children), which node takes its place?",
    operand: 20,
    correctAnswer: 30,
    explanation:
      "Node 20 has two children (10 and 30). The in-order successor (smallest in right subtree) is 30, which replaces 20.",
    xpReward: 15,
  },

  /* ========== ADVANCED (10) ========== */
  {
    id: "a1",
    type: "deletion-result",
    difficulty: "advanced",
    treeValues: [50, 30, 70, 20, 40, 60, 80, 35, 45],
    question: "After deleting node 30 (two children: 20 and 40), which node takes its place?",
    operand: 30,
    correctAnswer: 35,
    explanation:
      "Node 30 has two children. In-order successor = smallest in right subtree of 30 = smallest in subtree rooted at 40. Going left from 40 gives 35. So 35 replaces 30.",
    xpReward: 20,
  },
  {
    id: "a2",
    type: "traversal-order",
    difficulty: "advanced",
    treeValues: [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45],
    question: "What is the pre-order traversal of this tree?",
    correctAnswer: [50, 30, 20, 10, 25, 40, 35, 45, 70, 60, 80],
    explanation:
      "Pre-order: visit root, then left subtree, then right subtree — recursively.",
    xpReward: 20,
  },
  {
    id: "a3",
    type: "height",
    difficulty: "advanced",
    treeValues: [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45],
    question: "What is the height of this tree?",
    correctAnswer: 4,
    explanation:
      "Deepest nodes (10, 25, 35, 45) are at depth 3. Height = max depth + 1 = 4.",
    xpReward: 20,
  },
  {
    id: "a4",
    type: "valid-bst",
    difficulty: "advanced",
    treeValues: [50, 30, 70, 20, 40, 60, 80],
    question:
      "If we manually placed 65 as the LEFT child of 60 and 55 as the RIGHT child of 60, would the tree still be a valid BST?",
    correctAnswer: false,
    explanation:
      "If 55 is the right child of 60, then 55 > 60 must hold. But 55 < 60, violating the BST property.",
    xpReward: 20,
  },
  {
    id: "a5",
    type: "insert-parent",
    difficulty: "advanced",
    treeValues: [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43],
    question: "If we insert 28, which node will be its parent?",
    operand: 28,
    correctAnswer: 31,
    explanation:
      "28 < 50 → 25 → 28 > 25 → 37 → 28 < 37 → 31 → 28 < 31 → go left, no left child → parent is 31.",
    xpReward: 20,
  },
  {
    id: "a6",
    type: "traversal-order",
    difficulty: "advanced",
    treeValues: [40, 20, 60, 10, 30, 50, 70, 5, 15, 25, 35],
    question: "What is the post-order traversal of this tree?",
    correctAnswer: [5, 15, 10, 25, 35, 30, 20, 50, 70, 60, 40],
    explanation:
      "Post-order: left subtree → right subtree → root, applied recursively.",
    xpReward: 20,
  },
  {
    id: "a7",
    type: "deletion-result",
    difficulty: "advanced",
    treeValues: [50, 30, 70, 20, 40, 60, 80, 55, 65],
    question: "After deleting node 70 (children: 60 and 80), which node takes its place?",
    operand: 70,
    correctAnswer: 80,
    explanation:
      "In-order successor of 70 is the smallest in its right subtree. Right child is 80 with no left child, so 80 replaces 70.",
    xpReward: 20,
  },
  {
    id: "a8",
    type: "height",
    difficulty: "advanced",
    treeValues: [100, 50, 150, 25, 75, 125, 175, 12, 37, 62, 87],
    question: "What is the depth of node 87?",
    correctAnswer: 3,
    explanation:
      "Path: 100 → 50 → 75 → 87. Starting from root at depth 0, node 87 is at depth 3.",
    xpReward: 20,
  },
  {
    id: "a9",
    type: "valid-bst",
    difficulty: "advanced",
    treeValues: [50, 30, 70, 20, 40, 60, 80],
    question: "Is this 7-node complete BST valid?",
    correctAnswer: true,
    explanation:
      "Every node satisfies left < parent < right recursively. Valid BST.",
    xpReward: 20,
  },
  {
    id: "a10",
    type: "deletion-result",
    difficulty: "advanced",
    treeValues: [50, 30, 70, 20, 40, 60, 80, 35, 45, 55, 65, 75, 85],
    question: "After deleting root 50 (two children), which node takes its place?",
    operand: 50,
    correctAnswer: 55,
    explanation:
      "In-order successor of 50 = smallest in right subtree. Right subtree root is 70 → 60 → 55. Node 55 is the smallest and replaces 50.",
    xpReward: 20,
  },
];

/**
 * Get challenges filtered by difficulty.
 */
export function getChallengesByDifficulty(
  difficulty?: "beginner" | "intermediate" | "advanced"
): TreeChallenge[] {
  if (!difficulty) return treeChallenges;
  return treeChallenges.filter((c) => c.difficulty === difficulty);
}
