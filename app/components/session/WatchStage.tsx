// REDESIGNED: Manual step-by-step watch stage — user clicks Next, big narration, slow and clear
"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  WatchConfig,
  TextFlowStep,
  BoxAnimationStep,
  CounterAnimationStep,
} from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";
import {
  insertBST,
  computeLayout,
  collectNodes,
  resetIdCounter,
  type TreeNode,
} from "@/lib/treeEngine";

interface Props {
  config: WatchConfig;
  onComplete: (result: StageResult) => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 380;

// ─── Shared Next Button ──────────────────────────────────────────────────────

function StepControls({
  stepIdx,
  total,
  onNext,
  onComplete,
}: {
  stepIdx: number;
  total: number;
  onNext: () => void;
  onComplete: () => void;
}) {
  const isLast = stepIdx >= total - 1;
  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === stepIdx ? "24px" : "8px",
              background: i <= stepIdx ? "#E5A829" : "#1E3A5F",
            }}
          />
        ))}
      </div>
      <button
        onClick={isLast ? onComplete : onNext}
        className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
        style={{ background: "#E5A829", color: "#0a0f24" }}
      >
        {isLast ? "Got it — continue →" : "Next step →"}
      </button>
      <p className="text-xs" style={{ color: "#6b7a99" }}>
        Step {stepIdx + 1} of {total}
      </p>
    </div>
  );
}

// ─── Narration Card ──────────────────────────────────────────────────────────

function NarrationCard({ text }: { text: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl p-4 text-center"
        style={{ background: "#0f1629", border: "1px solid #E5A82940" }}
      >
        <p className="text-sm leading-relaxed text-white">{text}</p>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Tree Visualizer (manual) ────────────────────────────────────────────────

function TreeVisualizer({
  config,
  onComplete,
}: {
  config: WatchConfig;
  onComplete: (r: StageResult) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
  const [latestValue, setLatestValue] = useState<number | null>(null);
  const steps = config.autoPlaySteps ?? [];

  useEffect(() => {
    resetIdCounter();
    const step = steps[stepIdx];
    if (!step) return;
    if (step.action === "insert" && step.value !== undefined) {
      resetIdCounter();
      const values = steps
        .slice(0, stepIdx + 1)
        .filter((s) => s.action === "insert" && s.value !== undefined)
        .map((s) => s.value as number);
      let root: TreeNode | null = null;
      for (const v of values) root = insertBST(root, v);
      if (root) computeLayout(root, CANVAS_WIDTH);
      setTreeRoot(root ? { ...root } : null);
      setLatestValue(step.value);
    }
  }, [stepIdx]);

  const nodes = useMemo(() => (treeRoot ? collectNodes(treeRoot) : []), [treeRoot]);
  const edges = useMemo(() => {
    const result: { fromX: number; fromY: number; toX: number; toY: number }[] = [];
    function walk(node: TreeNode | null) {
      if (!node) return;
      if (node.left) {
        result.push({ fromX: node.x, fromY: node.y, toX: node.left.x, toY: node.left.y });
        walk(node.left);
      }
      if (node.right) {
        result.push({ fromX: node.x, fromY: node.y, toX: node.right.x, toY: node.right.y });
        walk(node.right);
      }
    }
    walk(treeRoot);
    return result;
  }, [treeRoot]);

  const currentStep = steps[stepIdx];

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1E3A5F", background: "#0a0f24" }}>
        <svg width="100%" height={CANVAS_HEIGHT} viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}>
          {edges.map((edge, i) => (
            <motion.line
              key={`edge-${i}`}
              x1={edge.fromX} y1={edge.fromY} x2={edge.toX} y2={edge.toY}
              stroke="#1E3A5F" strokeWidth={2}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            />
          ))}
          {nodes.map((node) => {
            const isLatest = node.value === latestValue;
            return (
              <motion.g key={node.id}>
                {isLatest && (
                  <motion.circle cx={node.x} cy={node.y} r={32}
                    fill="rgba(229,168,41,0.12)"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}
                  />
                )}
                <motion.circle cx={node.x} cy={node.y} r={22}
                  fill="#0f1629"
                  stroke={isLatest ? "#E5A829" : "#1E3A5F"}
                  strokeWidth={isLatest ? 2 : 1.5}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.text
                  x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isLatest ? "#E5A829" : "#c8d0e0"}
                  fontSize={14} fontWeight={700} fontFamily="monospace"
                  style={{ pointerEvents: "none" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                >
                  {node.value}
                </motion.text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      {currentStep && <NarrationCard text={currentStep.narration} />}
      <StepControls
        stepIdx={stepIdx}
        total={steps.length}
        onNext={() => setStepIdx((p) => p + 1)}
        onComplete={() => onComplete({ score: 0, timeSpent: 0 })}
      />
    </div>
  );
}

// ─── Box Animation Visualizer (manual) ──────────────────────────────────────

function BoxAnimationVisualizer({
  steps,
  onComplete,
}: {
  steps: BoxAnimationStep[];
  onComplete: (r: StageResult) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);

  // Build box state up to current step
  const boxes = useMemo(() => {
    const map: Record<string, {
      value: string | null;
      state: "empty" | "filled" | "glowing" | "updating";
      oldValue?: string;
      output?: string;
    }> = {};
    for (let i = 0; i <= stepIdx && i < steps.length; i++) {
      const s = steps[i];
      const key = s.label.split("=")[0].trim().split("(")[0].trim();
      if (s.action === "create") {
        map[key] = { value: s.value ?? null, state: "filled", output: s.output };
      } else if (s.action === "fill") {
        map[key] = { value: s.value ?? null, state: "filled", output: s.output };
      } else if (s.action === "read") {
        Object.keys(map).forEach((k) => { map[k] = { ...map[k], state: "filled" }; });
        map[key] = { ...(map[key] ?? { value: null }), state: "glowing", output: s.output };
      } else if (s.action === "update") {
        map[key] = { value: s.newValue ?? null, state: "updating", oldValue: s.oldValue ?? map[key]?.value ?? "", output: s.output };
      }
    }
    return map;
  }, [stepIdx, steps]);

  const currentStep = steps[stepIdx];

  return (
    <div className="space-y-4">
      {/* Current code line */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep?.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-lg px-4 py-2.5 font-mono text-sm"
          style={{ background: "#0a0f24", border: "1px solid #E5A82940", color: "#E5A829" }}
        >
          → {currentStep?.label}
        </motion.div>
      </AnimatePresence>

      {/* Memory boxes */}
      <div className="flex flex-wrap justify-center gap-6 min-h-[120px] items-center p-4 rounded-xl"
        style={{ background: "#0a0f24", border: "1px solid #1E3A5F" }}>
        {Object.entries(boxes).map(([label, box]) => (
          <motion.div key={label} layout
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}>
            <div className="text-center">
              <p className="text-xs font-mono mb-2" style={{ color: "#E5A829" }}>{label}</p>
              <motion.div
                className="w-28 h-16 rounded-xl flex items-center justify-center"
                animate={{
                  boxShadow: box.state === "glowing" ? "0 0 20px rgba(229,168,41,0.4)" : "none",
                  borderColor: box.state === "glowing" ? "#E5A829" : box.state === "filled" ? "#E5A82950" : "#1E3A5F",
                }}
                style={{ background: "#0f1629", border: "1px solid #1E3A5F" }}
                transition={{ duration: 0.3 }}
              >
                {box.state === "updating" ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.span key={`old-${box.oldValue}`}
                      initial={{ opacity: 1 }} animate={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute font-mono text-sm" style={{ color: "#ef4444" }}>
                      {box.oldValue}
                    </motion.span>
                    <motion.span key={`new-${box.value}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="absolute font-mono text-sm" style={{ color: "#10b981" }}>
                      {box.value}
                    </motion.span>
                  </div>
                ) : box.value == null ? (
                  <span className="text-xs" style={{ color: "#1E3A5F" }}>empty</span>
                ) : (
                  <motion.span key={box.value}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="font-mono text-sm text-white">
                    {box.value}
                  </motion.span>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
        {Object.keys(boxes).length === 0 && (
          <p className="text-sm" style={{ color: "#6b7a99" }}>Memory is empty — press Next to start</p>
        )}
      </div>

      {/* Output / explanation */}
      {currentStep?.output && (
        <NarrationCard text={currentStep.output} />
      )}

      <StepControls
        stepIdx={stepIdx}
        total={steps.length}
        onNext={() => setStepIdx((p) => p + 1)}
        onComplete={() => onComplete({ score: 0, timeSpent: 0 })}
      />
    </div>
  );
}

// ─── Counter / Loop Visualizer (manual) ─────────────────────────────────────

function CounterAnimationVisualizer({
  steps,
  onComplete,
}: {
  steps: CounterAnimationStep[];
  onComplete: (r: StageResult) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];

  // Collect all unique code lines for the code panel
  const codeLines = Array.from(new Set(steps.map((s) => s.code)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Code panel */}
        <div className="rounded-xl p-4" style={{ background: "#0a0f24", border: "1px solid #1E3A5F" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#E5A829" }}>Code</p>
          {codeLines.map((line, i) => (
            <motion.div key={i}
              animate={{ background: line === step.code ? "rgba(229,168,41,0.12)" : "transparent" }}
              className="rounded px-2 py-1 mb-0.5 transition-colors"
            >
              <code className="font-mono text-xs text-white whitespace-pre">{line}</code>
            </motion.div>
          ))}
        </div>

        {/* Counter */}
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-xs" style={{ color: "#6b7a99" }}>Variable value</p>
          <motion.div
            key={String(step.counter)}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#1a1400", border: "2px solid #E5A829" }}
          >
            <span className="font-mono text-2xl font-bold" style={{ color: "#E5A829" }}>
              {step.counter === null ? "?" : step.counter}
            </span>
          </motion.div>
        </div>

        {/* Output */}
        <div className="rounded-xl p-4" style={{ background: "#0a0f24", border: "1px solid #1E3A5F" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#10b981" }}>Output</p>
          <AnimatePresence mode="wait">
            <motion.p key={`${stepIdx}-output`}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="font-mono text-xs" style={{ color: "#10b981" }}>
              {step.output || "—"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {step.narration && <NarrationCard text={step.narration} />}

      <StepControls
        stepIdx={stepIdx}
        total={steps.length}
        onNext={() => setStepIdx((p) => p + 1)}
        onComplete={() => onComplete({ score: 0, timeSpent: 0 })}
      />
    </div>
  );
}

// ─── Text Flow Visualizer (manual) ──────────────────────────────────────────

function TextFlowVisualizer({
  steps,
  onComplete,
}: {
  steps: TextFlowStep[];
  onComplete: (r: StageResult) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[stepIdx];

  return (
    <div className="space-y-4">
      {/* Show all revealed steps */}
      <div className="space-y-2">
        {steps.slice(0, stepIdx + 1).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl p-4"
            style={{
              background: i === stepIdx ? "#0f1629" : "#0a0f24",
              border: `1px solid ${i === stepIdx ? "#E5A82950" : "#1E3A5F"}`,
            }}
          >
            <p className="text-xs mb-1.5" style={{ color: "#E5A829" }}>{step.label}</p>
            <code className="font-mono text-sm text-white whitespace-pre-wrap">{step.text}</code>
          </motion.div>
        ))}
      </div>

      <StepControls
        stepIdx={stepIdx}
        total={steps.length}
        onNext={() => setStepIdx((p) => p + 1)}
        onComplete={() => onComplete({ score: 0, timeSpent: 0 })}
      />
    </div>
  );
}

// ─── Array Visualizer (manual) ───────────────────────────────────────────────

function ArrayVisualizer({
  config,
  onComplete,
}: {
  config: WatchConfig;
  onComplete: (r: StageResult) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = config.autoPlaySteps ?? [];
  const [items, setItems] = useState<{ value: number; highlight: boolean }[]>([]);

  useEffect(() => {
    const step = steps[stepIdx];
    if (!step) return;
    if (step.action === "insert" && step.value !== undefined) {
      setItems((prev) => [
        ...prev.map((x) => ({ ...x, highlight: false })),
        { value: step.value!, highlight: true },
      ]);
    } else if (step.action === "delete" && step.value !== undefined) {
      setItems((prev) =>
        prev.filter((x) => x.value !== step.value).map((x) => ({ ...x, highlight: false }))
      );
    } else if (step.action === "search" && step.value !== undefined) {
      setItems((prev) =>
        prev.map((x) => ({ ...x, highlight: x.value === step.value }))
      );
    }
  }, [stepIdx]);

  const currentStep = steps[stepIdx];

  return (
    <div className="space-y-4">
      {/* Array display */}
      <div className="flex items-end justify-center gap-2 p-6 rounded-xl min-h-[120px]"
        style={{ background: "#0a0f24", border: "1px solid #1E3A5F" }}>
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: "#6b7a99" }}>Array is empty — press Next to start</p>
        ) : (
          items.map((item, i) => (
            <motion.div key={`${i}-${item.value}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all"
                style={{
                  background: item.highlight ? "#1a1400" : "#0f1629",
                  border: `1px solid ${item.highlight ? "#E5A829" : "#1E3A5F"}`,
                  color: item.highlight ? "#E5A829" : "#c8d0e0",
                  boxShadow: item.highlight ? "0 0 12px rgba(229,168,41,0.3)" : "none",
                }}>
                {item.value}
              </div>
              <span className="text-xs" style={{ color: "#6b7a99" }}>[{i}]</span>
            </motion.div>
          ))
        )}
      </div>

      {currentStep && <NarrationCard text={currentStep.narration} />}

      <StepControls
        stepIdx={stepIdx}
        total={steps.length}
        onNext={() => setStepIdx((p) => p + 1)}
        onComplete={() => onComplete({ score: 0, timeSpent: 0 })}
      />
    </div>
  );
}

// ─── Main Dispatcher ─────────────────────────────────────────────────────────

export default function WatchStage({ config, onComplete }: Props) {
  const { visualizerType, steps } = config;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#E5A829" }}>
          Watch & Understand
        </p>
        <p className="text-sm" style={{ color: "#6b7a99" }}>
          Go at your own pace — press Next when you're ready
        </p>
      </div>

      {visualizerType === "box-animation" && (
        <BoxAnimationVisualizer steps={steps as BoxAnimationStep[]} onComplete={onComplete} />
      )}
      {visualizerType === "counter-animation" && (
        <CounterAnimationVisualizer steps={steps as CounterAnimationStep[]} onComplete={onComplete} />
      )}
      {visualizerType === "text-flow" && (
        <TextFlowVisualizer steps={steps as TextFlowStep[]} onComplete={onComplete} />
      )}
      {visualizerType === "array" && (
        <ArrayVisualizer config={config} onComplete={onComplete} />
      )}
      {(visualizerType === "tree" || visualizerType === "linked-list" || visualizerType === "stack-queue" || visualizerType === "graph" || !visualizerType) && (
        <TreeVisualizer config={config} onComplete={onComplete} />
      )}
    </div>
  );
}
