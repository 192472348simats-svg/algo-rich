"use client";

import { useReducer, useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type TreeNode,
  type TreeState,
  type AnimationStep,
  type HighlightType,
  buildTree,
  insertWithAnimation,
  deleteWithAnimation,
  searchWithAnimation,
  traverseWithAnimation,
  computeLayout,
  clearHighlights,
  setHighlight,
  cloneTree,
  getHeight,
  countNodes,
  collectNodes,
} from "@/lib/treeEngine";

/* ──────────────────────────────────────────────
   Constants & colour helpers
   ────────────────────────────────────────────── */

const CANVAS_W = 800;
const CANVAS_H = 500;
const NODE_R = 22;

function highlightColor(type: HighlightType): string {
  switch (type) {
    case "visiting":
      return "rgba(34,211,238,0.35)";
    case "found":
      return "rgba(52,211,153,0.45)";
    case "inserting":
      return "rgba(139,92,246,0.45)";
    case "deleting":
      return "rgba(248,113,113,0.45)";
    case "comparing":
      return "rgba(250,204,21,0.35)";
    case "path":
      return "rgba(34,211,238,0.2)";
    default:
      return "rgba(15,35,65,0.95)";
  }
}

function highlightBorder(type: HighlightType): string {
  switch (type) {
    case "visiting":
      return "rgba(34,211,238,0.8)";
    case "found":
      return "rgba(52,211,153,0.9)";
    case "inserting":
      return "rgba(139,92,246,0.8)";
    case "deleting":
      return "rgba(248,113,113,0.8)";
    case "comparing":
      return "rgba(250,204,21,0.8)";
    case "path":
      return "rgba(34,211,238,0.5)";
    default:
      return "rgba(212,175,55,0.35)";
  }
}

/* ──────────────────────────────────────────────
   Reducer
   ────────────────────────────────────────────── */

type Action =
  | { type: "SET_TREE"; root: TreeNode | null }
  | { type: "SET_QUEUE"; steps: AnimationStep[] }
  | { type: "STEP_FORWARD" }
  | { type: "STEP_BACK" }
  | { type: "RESET_STEP" }
  | { type: "CLEAR" };

function reducer(state: TreeState, action: Action): TreeState {
  switch (action.type) {
    case "SET_TREE":
      return {
        ...state,
        root: action.root,
        nodeCount: countNodes(action.root),
        height: getHeight(action.root),
      };
    case "SET_QUEUE":
      return { ...state, animationQueue: action.steps, currentStep: -1 };
    case "STEP_FORWARD":
      return {
        ...state,
        currentStep: Math.min(
          state.currentStep + 1,
          state.animationQueue.length - 1
        ),
      };
    case "STEP_BACK":
      return { ...state, currentStep: Math.max(state.currentStep - 1, -1) };
    case "RESET_STEP":
      return { ...state, currentStep: -1, animationQueue: [] };
    case "CLEAR":
      return {
        root: null,
        nodeCount: 0,
        height: 0,
        animationQueue: [],
        currentStep: -1,
      };
    default:
      return state;
  }
}

const initialState: TreeState = {
  root: null,
  nodeCount: 0,
  height: 0,
  animationQueue: [],
  currentStep: -1,
};

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function TreePlayground() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [insertVal, setInsertVal] = useState("");
  const [deleteVal, setDeleteVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [speed, setSpeed] = useState(600); // ms per step
  const [playing, setPlaying] = useState(false);
  const [traversalOutput, setTraversalOutput] = useState<number[]>([]);
  const [opCount, setOpCount] = useState(0);

  const [pendingRoot, setPendingRoot] = useState<TreeNode | null>(null);
  const [opType, setOpType] = useState<"insert" | "delete" | "search" | "traverse" | null>(null);

  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Compute layout whenever tree changes
  useEffect(() => {
    if (state.root) {
      computeLayout(state.root, CANVAS_W);
    }
  }, [state.root]);

  // When delete animation completes, smoothly swap to the target tree missing the deleted node
  useEffect(() => {
    if (opType === "delete" && pendingRoot !== null && state.animationQueue.length > 0) {
      if (state.currentStep >= state.animationQueue.length - 1) {
        dispatch({ type: "SET_TREE", root: pendingRoot });
        setPendingRoot(null);
        setOpType(null); // finish op
      }
    }
  }, [state.currentStep, state.animationQueue.length, opType, pendingRoot]);

  // Auto-play logic
  useEffect(() => {
    if (!playing) return;
    if (state.currentStep >= state.animationQueue.length - 1) {
      // Defer to avoid setState in effect body triggering cascading renders
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    playTimerRef.current = setTimeout(() => {
      dispatch({ type: "STEP_FORWARD" });
    }, speed);
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [playing, state.currentStep, state.animationQueue.length, speed]);

  /* ── Operations ── */

  const runSteps = useCallback(
    (steps: AnimationStep[]) => {
      dispatch({ type: "SET_QUEUE", steps });
      setOpCount((c) => c + 1);
    },
    []
  );

  const handleInsert = useCallback(() => {
    const val = parseInt(insertVal, 10);
    if (isNaN(val)) return;
    const root = cloneTree(state.root);
    const { newRoot, steps } = insertWithAnimation(root, val);
    computeLayout(newRoot, CANVAS_W);
    setOpType("insert");
    dispatch({ type: "SET_TREE", root: newRoot });
    runSteps(steps);
    setInsertVal("");
  }, [insertVal, state.root, runSteps]);

  const handleDelete = useCallback(() => {
    const val = parseInt(deleteVal, 10);
    if (isNaN(val)) return;
    const { newRoot, steps } = deleteWithAnimation(state.root, val);
    if (newRoot) computeLayout(newRoot, CANVAS_W);
    
    // Hold the new tree in pending until animation completes so nodes don't vanish instantly!
    setOpType("delete");
    setPendingRoot(newRoot);
    runSteps(steps);
    setDeleteVal("");
  }, [deleteVal, state.root, runSteps]);

  const handleSearch = useCallback(() => {
    const val = parseInt(searchVal, 10);
    if (isNaN(val)) return;
    const { steps } = searchWithAnimation(state.root, val);
    setOpType("search");
    runSteps(steps);
    setSearchVal("");
  }, [searchVal, state.root, runSteps]);

  const handleTraverse = useCallback(
    (order: "inorder" | "preorder" | "postorder" | "bfs") => {
      const { result, steps } = traverseWithAnimation(state.root, order);
      setOpType("traverse");
      runSteps(steps);
      setTraversalOutput(result);
    },
    [state.root, runSteps]
  );

  const handleRandom = useCallback(() => {
    const count = 7 + Math.floor(Math.random() * 6); // 7-12
    const values = new Set<number>();
    while (values.size < count) values.add(Math.floor(Math.random() * 99) + 1);
    const root = buildTree(Array.from(values));
    if (root) computeLayout(root, CANVAS_W);
    setOpType(null);
    dispatch({ type: "SET_TREE", root });
    dispatch({ type: "RESET_STEP" });
    setTraversalOutput([]);
    setOpCount(0);
  }, []);

  const handleClear = useCallback(() => {
    setOpType(null);
    dispatch({ type: "CLEAR" });
    setTraversalOutput([]);
    setOpCount(0);
  }, []);

  /* ── Render helpers ── */

  const nodes = state.root ? collectNodes(state.root) : [];
  
  // Reactively derive highlights from history instead of mutating tree nodes
  const activeHighlights = new Map<string, HighlightType>();
  if (state.currentStep >= 0) {
    for (let i = 0; i <= state.currentStep; i++) {
      const step = state.animationQueue[i];
      if (step?.nodeId && step.highlightType) {
        if (step.highlightType === "none" || (step.type as string) === "clear") {
          activeHighlights.delete(step.nodeId);
        } else {
          activeHighlights.set(step.nodeId, step.highlightType);
        }
      }
    }
  }

  // Prevent newly inserted nodes from spoiling the animation by appearing early
  const hiddenNodeIds = new Set<string>();
  if (opType === "insert" && state.animationQueue.length > 0) {
    const insertStepIndex = state.animationQueue.findIndex(s => s.type === "insert");
    if (insertStepIndex > -1 && state.currentStep < insertStepIndex) {
      hiddenNodeIds.add(state.animationQueue[insertStepIndex].nodeId);
    }
  }

  const currentStepInfo =
    state.currentStep >= 0 && state.currentStep < state.animationQueue.length
      ? state.animationQueue[state.currentStep]
      : null;

  // Build parent map for edges
  const parentMap = new Map<string, TreeNode>();
  function buildParentMap(node: TreeNode | null, parent: TreeNode | null) {
    if (!node) return;
    if (parent) parentMap.set(node.id, parent);
    buildParentMap(node.left, node);
    buildParentMap(node.right, node);
  }
  buildParentMap(state.root, null);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="bg-[var(--glass-bg)] border border-border rounded-xl p-4 mb-4 space-y-3">
        {/* Row 1: Insert / Delete / Search */}
        <div className="flex flex-wrap gap-2">
          <InputAction
            label="Insert"
            value={insertVal}
            onChange={setInsertVal}
            onSubmit={handleInsert}
            accent="purple"
          />
          <InputAction
            label="Delete"
            value={deleteVal}
            onChange={setDeleteVal}
            onSubmit={handleDelete}
            accent="red"
          />
          <InputAction
            label="Search"
            value={searchVal}
            onChange={setSearchVal}
            onSubmit={handleSearch}
            accent="cyan"
          />
        </div>

        {/* Row 2: Traversals */}
        <div className="flex flex-wrap gap-2">
          {(
            ["inorder", "preorder", "postorder", "bfs"] as const
          ).map((o) => (
            <button
              key={o}
              onClick={() => handleTraverse(o)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-foreground/70 hover:text-white hover:border-primary/40 hover:bg-primary/10 transition-all"
            >
              {o === "bfs" ? "BFS" : o.charAt(0).toUpperCase() + o.slice(1)}
            </button>
          ))}
          <button
            onClick={handleRandom}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all"
          >
            🎲 Random
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
          >
            ✕ Clear
          </button>
        </div>

        {/* Row 3: Playback */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs text-muted-foreground flex items-center gap-2">
            Speed
            <input
              type="range"
              min={100}
              max={1500}
              step={100}
              value={1600 - speed}
              onChange={(e) => setSpeed(1600 - parseInt(e.target.value, 10))}
              className="w-24 accent-primary"
            />
          </label>

          <div className="flex gap-1">
            <PlaybackBtn
              label="⏮"
              onClick={() => dispatch({ type: "STEP_BACK" })}
              disabled={state.currentStep <= -1}
            />
            <PlaybackBtn
              label={playing ? "⏸" : "▶"}
              onClick={() => setPlaying((p) => !p)}
              disabled={state.animationQueue.length === 0}
              primary
            />
            <PlaybackBtn
              label="⏭"
              onClick={() => dispatch({ type: "STEP_FORWARD" })}
              disabled={
                state.currentStep >= state.animationQueue.length - 1
              }
            />
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-[var(--glass-bg)] border border-border rounded-xl overflow-hidden relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="w-full"
          style={{ maxHeight: 500 }}
        >
          {/* Edges */}
          {nodes.map((node) => {
            const parent = parentMap.get(node.id);
            if (!parent || hiddenNodeIds.has(node.id) || hiddenNodeIds.has(parent.id)) return null;
            return (
              <motion.line
                key={`edge-${node.id}`}
                x1={parent.x}
                y1={parent.y + NODE_R}
                x2={node.x}
                y2={node.y - NODE_R}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            );
          })}

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node) => {
              if (hiddenNodeIds.has(node.id)) return null;
              const hl = activeHighlights.get(node.id) || "none";
              return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {/* Circle */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R}
                  fill={highlightColor(hl)}
                  stroke={highlightBorder(hl)}
                  strokeWidth={2}
                  animate={{ cx: node.x, cy: node.y }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  style={{ cursor: "pointer" }}
                />
                {/* Value text */}
                <motion.text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={16}
                  fontWeight={700}
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  animate={{ x: node.x, y: node.y }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  {node.value}
                </motion.text>
              </motion.g>
            )})}
          </AnimatePresence>

          {/* Empty state */}
          {!state.root && (
            <g>
              <motion.text
                x={CANVAS_W / 2}
                y={CANVAS_H / 2 - 40}
                textAnchor="middle"
                fill="rgba(255,255,255,0.15)"
                fontSize={48}
                animate={{ y: [CANVAS_H / 2 - 40, CANVAS_H / 2 - 52, CANVAS_H / 2 - 40] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                🌳
              </motion.text>
              <text
                x={CANVAS_W / 2}
                y={CANVAS_H / 2 + 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize={15}
                fontWeight={500}
              >
                Insert a value or click 🎲 Random to start
              </text>
              <text
                x={CANVAS_W / 2}
                y={CANVAS_H / 2 + 46}
                textAnchor="middle"
                fill="rgba(212,175,55,0.35)"
                fontSize={12}
              >
                Try: 50, 25, 75, 12, 37 — watch the BST build step by step
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Status Bar */}
      <div className="bg-[var(--glass-bg)] border border-border rounded-xl p-4 mt-4 space-y-2 text-sm">
        {currentStepInfo && (
          <p className="text-primary font-medium">
            Step {state.currentStep + 1}/{state.animationQueue.length}:{" "}
            <span className="text-white/80">{currentStepInfo.description}</span>
          </p>
        )}

        {traversalOutput.length > 0 && (
          <p className="text-muted-foreground">
            Traversal:{" "}
            <span className="text-primary font-mono">
              [{traversalOutput.join(", ")}]
            </span>
          </p>
        )}

        <div className="flex gap-6 text-muted-foreground text-xs">
          <span>
            Height: <strong className="text-white/80">{state.height}</strong>
          </span>
          <span>
            Nodes: <strong className="text-white/80">{state.nodeCount}</strong>
          </span>
          <span>
            Operations: <strong className="text-white/80">{opCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

function InputAction({
  label,
  value,
  onChange,
  onSubmit,
  accent,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  accent: "purple" | "red" | "cyan";
}) {
  const colors = {
    purple: "border-purple-500/30 text-purple-400 hover:bg-purple-500/10",
    red: "border-red-500/30 text-red-400 hover:bg-red-500/10",
    cyan: "border-primary/30 text-primary hover:bg-primary/10",
  };
  return (
    <div className="flex gap-1">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder={`${label} #`}
        className="w-24 px-3 py-1.5 text-xs rounded-lg bg-card border border-border text-white placeholder-white/30 focus:border-primary/40 focus:bg-card/80 outline-none transition-all"
      />
      <button
        onClick={onSubmit}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${colors[accent]}`}
      >
        {label}
      </button>
    </div>
  );
}

function PlaybackBtn({
  label,
  onClick,
  disabled,
  primary,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-primary/15"
      } ${
        primary
          ? "bg-primary/20 text-primary border border-primary/30"
          : "text-muted-foreground border border-border"
      }`}
    >
      {label}
    </button>
  );
}
