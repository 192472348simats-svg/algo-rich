/**
 * Tree Engine — BST data structures, operations with animation steps,
 * and Reingold-Tilford–inspired layout.
 */

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

export type HighlightType =
  | "none"
  | "visiting"
  | "found"
  | "inserting"
  | "deleting"
  | "comparing"
  | "path";

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  depth: number;
  highlight: HighlightType;
}

export interface AnimationStep {
  type:
    | "highlight"
    | "move"
    | "insert"
    | "delete"
    | "compare"
    | "swap"
    | "visit";
  nodeId: string;
  targetNodeId?: string;
  description: string;
  highlightType?: HighlightType;
}

export interface TreeState {
  root: TreeNode | null;
  nodeCount: number;
  height: number;
  animationQueue: AnimationStep[];
  currentStep: number;
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

let idCounter = 0;
function nextId(): string {
  return `node-${++idCounter}`;
}
export function resetIdCounter(): void {
  idCounter = 0;
}

function createNode(value: number, depth: number): TreeNode {
  return {
    id: nextId(),
    value,
    left: null,
    right: null,
    x: 0,
    y: 0,
    depth,
    highlight: "none",
  };
}

export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export function getHeight(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

export function countNodes(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

export function clearHighlights(node: TreeNode | null): void {
  if (!node) return;
  node.highlight = "none";
  clearHighlights(node.left);
  clearHighlights(node.right);
}

function findNode(root: TreeNode | null, id: string): TreeNode | null {
  if (!root) return null;
  if (root.id === id) return root;
  return findNode(root.left, id) || findNode(root.right, id);
}

export function setHighlight(
  root: TreeNode | null,
  nodeId: string,
  hl: HighlightType
): void {
  const n = findNode(root, nodeId);
  if (n) n.highlight = hl;
}

export function collectNodes(node: TreeNode | null): TreeNode[] {
  if (!node) return [];
  return [node, ...collectNodes(node.left), ...collectNodes(node.right)];
}

/* ──────────────────────────────────────────────
   BST Insert (plain — no animation)
   ────────────────────────────────────────────── */

export function insertBST(root: TreeNode | null, value: number): TreeNode {
  if (!root) return createNode(value, 0);

  function _insert(node: TreeNode, val: number, depth: number): TreeNode {
    if (val < node.value) {
      if (!node.left) {
        node.left = createNode(val, depth + 1);
      } else {
        _insert(node.left, val, depth + 1);
      }
    } else if (val > node.value) {
      if (!node.right) {
        node.right = createNode(val, depth + 1);
      } else {
        _insert(node.right, val, depth + 1);
      }
    }
    return node;
  }

  return _insert(root, value, root.depth);
}

/**
 * Build a BST from an array of values (insert order matters).
 */
export function buildTree(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of values) {
    root = root ? insertBST(root, v) : createNode(v, 0);
  }
  return root;
}

/* ──────────────────────────────────────────────
   Insert with animation
   ────────────────────────────────────────────── */

export function insertWithAnimation(
  root: TreeNode | null,
  value: number
): { newRoot: TreeNode; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];

  if (!root) {
    const newNode = createNode(value, 0);
    steps.push({
      type: "insert",
      nodeId: newNode.id,
      description: `Insert ${value} as root node`,
      highlightType: "inserting",
    });
    return { newRoot: newNode, steps };
  }

  let current: TreeNode | null = root;
  while (current) {
    steps.push({
      type: "compare",
      nodeId: current.id,
      description: `Comparing ${value} with ${current.value}: ${
        value < current.value
          ? `${value} < ${current.value}, go left`
          : value > current.value
          ? `${value} > ${current.value}, go right`
          : `${value} = ${current.value}, duplicate — skip`
      }`,
      highlightType: "comparing",
    });

    if (value === current.value) {
      return { newRoot: root, steps };
    }

    if (value < current.value) {
      if (!current.left) {
        const newNode = createNode(value, current.depth + 1);
        current.left = newNode;
        steps.push({
          type: "insert",
          nodeId: newNode.id,
          description: `Insert ${value} as left child of ${current.value}`,
          highlightType: "inserting",
        });
        return { newRoot: root, steps };
      }
      current = current.left;
    } else {
      if (!current.right) {
        const newNode = createNode(value, current.depth + 1);
        current.right = newNode;
        steps.push({
          type: "insert",
          nodeId: newNode.id,
          description: `Insert ${value} as right child of ${current.value}`,
          highlightType: "inserting",
        });
        return { newRoot: root, steps };
      }
      current = current.right;
    }
  }

  return { newRoot: root, steps };
}

/* ──────────────────────────────────────────────
   Search with animation
   ────────────────────────────────────────────── */

export function searchWithAnimation(
  root: TreeNode | null,
  value: number
): { found: boolean; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];
  let current = root;

  while (current) {
    steps.push({
      type: "compare",
      nodeId: current.id,
      description:
        value === current.value
          ? `Found ${value}!`
          : `Comparing ${value} with ${current.value}: ${
              value < current.value ? "go left" : "go right"
            }`,
      highlightType: value === current.value ? "found" : "comparing",
    });

    if (value === current.value) return { found: true, steps };
    current = value < current.value ? current.left : current.right;
  }

  steps.push({
    type: "highlight",
    nodeId: "",
    description: `${value} not found in the tree`,
  });

  return { found: false, steps };
}

/* ──────────────────────────────────────────────
   Delete with animation
   ────────────────────────────────────────────── */

function findMin(node: TreeNode): TreeNode {
  let cur = node;
  while (cur.left) cur = cur.left;
  return cur;
}

export function deleteWithAnimation(
  root: TreeNode | null,
  value: number
): { newRoot: TreeNode | null; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];

  function _delete(node: TreeNode | null, val: number): TreeNode | null {
    if (!node) {
      steps.push({
        type: "highlight",
        nodeId: "",
        description: `${val} not found in the tree`,
      });
      return null;
    }

    steps.push({
      type: "compare",
      nodeId: node.id,
      description:
        val === node.value
          ? `Found node ${val} to delete`
          : `Comparing ${val} with ${node.value}: ${
              val < node.value ? "go left" : "go right"
            }`,
      highlightType: val === node.value ? "deleting" : "comparing",
    });

    if (val < node.value) {
      node.left = _delete(node.left, val);
      return node;
    }
    if (val > node.value) {
      node.right = _delete(node.right, val);
      return node;
    }

    // Found — 3 cases
    if (!node.left && !node.right) {
      steps.push({
        type: "delete",
        nodeId: node.id,
        description: `Delete leaf node ${val} (no children)`,
        highlightType: "deleting",
      });
      return null;
    }
    if (!node.left) {
      steps.push({
        type: "delete",
        nodeId: node.id,
        description: `Delete ${val} — replace with right child ${node.right!.value}`,
        highlightType: "deleting",
      });
      return node.right;
    }
    if (!node.right) {
      steps.push({
        type: "delete",
        nodeId: node.id,
        description: `Delete ${val} — replace with left child ${node.left!.value}`,
        highlightType: "deleting",
      });
      return node.left;
    }

    // Two children — in-order successor
    const successor = findMin(node.right);
    steps.push({
      type: "swap",
      nodeId: node.id,
      targetNodeId: successor.id,
      description: `Replace ${val} with in-order successor ${successor.value}`,
      highlightType: "inserting",
    });
    node.value = successor.value;
    node.right = _delete(node.right, successor.value);
    return node;
  }

  const newRoot = _delete(cloneTree(root), value);
  return { newRoot, steps };
}

/* ──────────────────────────────────────────────
   Traversals with animation
   ────────────────────────────────────────────── */

export function traverseWithAnimation(
  root: TreeNode | null,
  order: "inorder" | "preorder" | "postorder" | "bfs"
): { result: number[]; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];
  const result: number[] = [];

  if (!root) return { result, steps };

  if (order === "bfs") {
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      steps.push({
        type: "visit",
        nodeId: node.id,
        description: `Visit ${node.value} (BFS level ${node.depth})`,
        highlightType: "visiting",
      });
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return { result, steps };
  }

  function inorder(node: TreeNode | null) {
    if (!node) return;
    inorder(node.left);
    steps.push({
      type: "visit",
      nodeId: node.id,
      description: `Visit ${node.value} (in-order)`,
      highlightType: "visiting",
    });
    result.push(node.value);
    inorder(node.right);
  }

  function preorder(node: TreeNode | null) {
    if (!node) return;
    steps.push({
      type: "visit",
      nodeId: node.id,
      description: `Visit ${node.value} (pre-order)`,
      highlightType: "visiting",
    });
    result.push(node.value);
    preorder(node.left);
    preorder(node.right);
  }

  function postorder(node: TreeNode | null) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    steps.push({
      type: "visit",
      nodeId: node.id,
      description: `Visit ${node.value} (post-order)`,
      highlightType: "visiting",
    });
    result.push(node.value);
  }

  if (order === "inorder") inorder(root);
  else if (order === "preorder") preorder(root);
  else postorder(root);

  return { result, steps };
}

/* ──────────────────────────────────────────────
   Layout — modified Reingold-Tilford
   ────────────────────────────────────────────── */

const LEVEL_HEIGHT = 70;
const MIN_SPACING = 50;
const NODE_RADIUS = 22;

/**
 * Compute (x, y) positions for every node in the tree.
 * Root is centred horizontally at the top of the canvas.
 */
export function computeLayout(root: TreeNode | null, canvasWidth: number): void {
  if (!root) return;

  // 1. Assign depth values + count subtree widths
  function setDepth(node: TreeNode | null, d: number) {
    if (!node) return;
    node.depth = d;
    setDepth(node.left, d + 1);
    setDepth(node.right, d + 1);
  }
  setDepth(root, 0);

  // 2. Compute subtree width (number of leaf-level slots)
  function subtreeWidth(node: TreeNode | null): number {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return subtreeWidth(node.left) + subtreeWidth(node.right);
  }

  // 3. Assign x positions
  function assignX(
    node: TreeNode | null,
    leftBound: number,
    rightBound: number
  ) {
    if (!node) return;
    const mid = (leftBound + rightBound) / 2;
    node.x = mid;
    node.y = NODE_RADIUS + 20 + node.depth * LEVEL_HEIGHT;

    const leftWidth = subtreeWidth(node.left);
    const rightWidth = subtreeWidth(node.right);
    const totalWidth = leftWidth + rightWidth || 1;

    const leftRight = leftBound + ((rightBound - leftBound) * leftWidth) / totalWidth;
    assignX(node.left, leftBound, leftRight);
    assignX(node.right, leftRight, rightBound);
  }

  // Scale canvas to fit — ensure minimumSpacing
  const totalLeaves = subtreeWidth(root) || 1;
  const neededWidth = totalLeaves * MIN_SPACING;
  const effectiveWidth = Math.max(canvasWidth, neededWidth);

  const pad = NODE_RADIUS + 10;
  assignX(root, pad, effectiveWidth - pad);

  // If we had to expand, shift everything so it's centred
  if (effectiveWidth > canvasWidth) {
    const shift = (effectiveWidth - canvasWidth) / 2;
    function shiftX(n: TreeNode | null) {
      if (!n) return;
      n.x -= shift;
      shiftX(n.left);
      shiftX(n.right);
    }
    shiftX(root);
  }
}

/**
 * Validate whether a tree is a valid BST.
 */
export function isValidBST(
  node: TreeNode | null,
  min = -Infinity,
  max = Infinity
): { valid: boolean; violatingNodeId?: string } {
  if (!node) return { valid: true };
  if (node.value <= min || node.value >= max) {
    return { valid: false, violatingNodeId: node.id };
  }
  const leftCheck = isValidBST(node.left, min, node.value);
  if (!leftCheck.valid) return leftCheck;
  return isValidBST(node.right, node.value, max);
}

/**
 * Inorder traversal returning values only.
 */
export function inorderValues(node: TreeNode | null): number[] {
  if (!node) return [];
  return [...inorderValues(node.left), node.value, ...inorderValues(node.right)];
}

/**
 * Get depth of a specific value.
 */
export function getDepthOfValue(
  node: TreeNode | null,
  value: number,
  depth = 0
): number {
  if (!node) return -1;
  if (node.value === value) return depth;
  if (value < node.value) return getDepthOfValue(node.left, value, depth + 1);
  return getDepthOfValue(node.right, value, depth + 1);
}

/**
 * Find which node would be the parent of a newly inserted value.
 */
export function findInsertParent(
  root: TreeNode | null,
  value: number
): number | null {
  if (!root) return null;
  let current = root;
  while (current) {
    if (value === current.value) return null; // duplicate
    if (value < current.value) {
      if (!current.left) return current.value;
      current = current.left;
    } else {
      if (!current.right) return current.value;
      current = current.right;
    }
  }
  return null;
}

/**
 * After deleting a value, determine which node takes its place.
 * Returns null if not found, undefined if leaf (no replacement).
 */
export function findDeleteReplacement(
  root: TreeNode | null,
  value: number
): number | null | undefined {
  function find(node: TreeNode | null): TreeNode | null {
    if (!node) return null;
    if (node.value === value) return node;
    return value < node.value ? find(node.left) : find(node.right);
  }
  const target = find(root);
  if (!target) return null; // not found

  if (!target.left && !target.right) return undefined; // leaf
  if (!target.left) return target.right!.value;
  if (!target.right) return target.left!.value;
  // Two children — in-order successor
  return findMin(target.right).value;
}
