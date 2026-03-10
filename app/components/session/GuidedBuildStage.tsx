"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GuidedBuildConfig } from "@/lib/sessionDefinitions";
import type { StageResult } from "@/app/dashboard/session/[sessionSlug]/SessionPlayer";
import {
  insertBST,
  computeLayout,
  collectNodes,
  resetIdCounter,
  type TreeNode,
} from "@/lib/treeEngine";

interface Props {
  config: GuidedBuildConfig;
  onComplete: (result: StageResult) => void;
}

// ─── Phase 1: Simple Steps Wizard ─────────────────────────────────────────────
function SimpleStepsWizard({ config, onComplete }: Props) {
  const steps = config.steps!;
  const [stepIndex, setStepIndex] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const step = steps[stepIndex];

  function handleRun() {
    // Simulate running — show the expected output
    const simulated = step.expectedOutput ?? "Done!";
    setOutput(simulated);
    if (step.celebration) {
      setShowCelebration(true);
    }
  }

  function handleNext() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      setCode("");
      setOutput(null);
      setShowCelebration(false);
    } else {
      onComplete({ score: 10, timeSpent: 0 });
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Stage label */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">Practice</p>
        <p className="text-sm text-white/40">{config.instructions || "Follow the steps below"}</p>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === stepIndex ? "w-8 bg-primary" : i < stepIndex ? "w-4 bg-primary/40" : "w-4 bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Instruction card */}
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2"
      >
        <p className="text-sm font-medium text-white/90 leading-relaxed">{step.instruction}</p>
        {step.hint && !output && (
          <p className="text-xs text-white/40 italic">💡 {step.hint}</p>
        )}
      </motion.div>

      {/* Code editor */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d1117] overflow-hidden">
        <div className="px-4 py-2 border-b border-white/[0.04] flex items-center justify-between">
          <span className="text-[11px] text-white/30 uppercase">Python</span>
          <span className="text-[10px] text-white/15">editor</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-transparent p-4 text-sm font-mono text-white/80
                     resize-none focus:outline-none placeholder-white/20 min-h-[100px]"
          placeholder="Type your code here..."
          spellCheck={false}
        />
      </div>

      {/* Terminal output */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-white/[0.04]">
              <span className="text-[11px] text-emerald-400/60 uppercase">Output</span>
            </div>
            <pre className="p-4 text-sm font-mono text-emerald-300">{output}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && step.celebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-2xl"
          >
            {step.celebration}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        {!output ? (
          <button
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30
                       text-sm text-emerald-400 hover:bg-emerald-500/30 transition-colors cursor-pointer font-medium"
          >
            ▶ Run Code
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-primary/20 border border-primary/30
                       text-sm text-primary hover:bg-primary/30 transition-colors cursor-pointer font-medium"
          >
            {stepIndex < steps.length - 1 ? "Next Step →" : "Complete ✓"}
          </button>
        )}
      </div>
    </div>
  );
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 350;

// ─── BST Builder (original behavior) ─────────────────────────────────────────
function BSTBuilderStage({ config, onComplete }: Props) {
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [insertedValues, setInsertedValues] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusInserted, setBonusInserted] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const expectedValue = config.valuesToInsert![currentValueIndex];
  const allMainInserted = currentValueIndex >= config.valuesToInsert!.length;

  // Build the tree from current inserted values using the real engine
  const treeRoot = useMemo(() => {
    if (insertedValues.length === 0) return null;
    resetIdCounter();
    let root: TreeNode | null = null;
    for (const v of insertedValues) {
      if (!root) {
        root = insertBST(null, v);
      } else {
        insertBST(root, v);
      }
    }
    if (root) computeLayout(root, CANVAS_WIDTH);
    return root;
  }, [insertedValues]);

  const nodes = useMemo(() => {
    if (!treeRoot) return [];
    return collectNodes(treeRoot);
  }, [treeRoot]);

  const edges = useMemo(() => {
    const result: {
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
    }[] = [];
    function walk(node: TreeNode | null) {
      if (!node) return;
      if (node.left) {
        result.push({
          fromX: node.x,
          fromY: node.y,
          toX: node.left.x,
          toY: node.left.y,
        });
        walk(node.left);
      }
      if (node.right) {
        result.push({
          fromX: node.x,
          fromY: node.y,
          toX: node.right.x,
          toY: node.right.y,
        });
        walk(node.right);
      }
    }
    walk(treeRoot);
    return result;
  }, [treeRoot]);

  const clearFeedbackTimer = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }, []);

  function handleInsert() {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    clearFeedbackTimer();

    if (!allMainInserted) {
      // Main sequence — must insert in order
      if (val === expectedValue) {
        const newValues = [...insertedValues, val];
        setInsertedValues(newValues);
        setFeedback({
          text: config.validationMessages?.[val] || `✓ ${val} placed correctly!`,
          type: "success",
        });
        setCurrentValueIndex((prev) => prev + 1);
        setInputValue("");

        // Check if main sequence is complete
        if (currentValueIndex + 1 >= config.valuesToInsert!.length) {
          if (config.bonusChallenge) {
            feedbackTimerRef.current = setTimeout(
              () => setShowBonus(true),
              1500
            );
          } else {
            feedbackTimerRef.current = setTimeout(
              () => setComplete(true),
              1500
            );
          }
        }
      } else {
        setFeedback({
          text: `Insert ${expectedValue} first`,
          type: "error",
        });
        setInputValue("");
      }
    } else if (showBonus && config.bonusChallenge) {
      // Bonus round — free insert
      const newValues = [...insertedValues, val];
      setInsertedValues(newValues);
      const newBonus = [...bonusInserted, val];
      setBonusInserted(newBonus);
      setInputValue("");

      if (newBonus.length >= (config.bonusChallenge.values?.length || 3)) {
        setFeedback({
          text: config.bonusChallenge.insightMessage,
          type: "success",
        });
        feedbackTimerRef.current = setTimeout(
          () => setComplete(true),
          4000
        );
      }
    }

    // Clear error feedback after 2s (success stays longer)
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback((prev) => (prev?.type === "error" ? null : prev));
    }, 2000);

    inputRef.current?.focus();
  }

  const latestValue =
    insertedValues.length > 0
      ? insertedValues[insertedValues.length - 1]
      : null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">
          Build
        </p>
        <p className="text-sm text-white/40">{config.instructions}</p>
      </div>

      {/* Tree visualization using tree engine */}
      <div
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
        style={{ height: CANVAS_HEIGHT }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          {/* Edges */}
          {edges.map((edge, i) => (
            <motion.line
              key={`edge-${i}`}
              x1={edge.fromX}
              y1={edge.fromY}
              x2={edge.toX}
              y2={edge.toY}
              stroke="rgba(148,163,184,0.2)"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}

          {/* Nodes */}
          {nodes.map((node) => {
            const isLatest = node.value === latestValue;
            return (
              <motion.g key={node.id}>
                {isLatest && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={30}
                    fill="rgba(34,211,238,0.12)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill="#1e293b"
                  stroke={isLatest ? "#22d3ee" : "#334155"}
                  strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                />
                <motion.text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={15}
                  fontWeight={700}
                  fontFamily="monospace"
                  style={{ pointerEvents: "none" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {node.value}
                </motion.text>
              </motion.g>
            );
          })}

          {/* Empty state */}
          {nodes.length === 0 && (
            <text
              x={CANVAS_WIDTH / 2}
              y={CANVAS_HEIGHT / 2}
              textAnchor="middle"
              fill="rgba(255,255,255,0.1)"
              fontSize={14}
            >
              Insert your first value to start building
            </text>
          )}
        </svg>
      </div>

      {/* Input + instruction */}
      {!complete && (
        <div className="flex flex-col items-center gap-3">
          {!allMainInserted && (
            <p className="text-sm text-white/50">
              Insert:{" "}
              <span className="text-primary font-mono font-bold">
                {expectedValue}
              </span>
              <span className="text-white/20 ml-2">
                ({currentValueIndex + 1}/{config.valuesToInsert!.length})
              </span>
            </p>
          )}

          {showBonus && !complete && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-purple-400"
            >
              {config.bonusChallenge?.instruction}
            </motion.p>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              placeholder="Type a number..."
              autoFocus
              className="w-44 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5
                         text-white placeholder-white/20 text-sm text-center font-mono
                         focus:border-primary/40 focus:outline-none transition-colors"
            />
            <button
              onClick={handleInsert}
              className="rounded-lg bg-primary/20 border border-primary/30 px-4 py-2.5
                         text-sm text-primary hover:bg-primary/30 transition-colors cursor-pointer"
            >
              Insert ↵
            </button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm ${
                  feedback.type === "success"
                    ? "text-emerald-400"
                    : "text-orange-400"
                }`}
              >
                {feedback.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Completion */}
      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <p className="text-emerald-400 font-medium">
            {config.completionMessage ?? "Well done!"}
          </p>
          <button
            onClick={() => onComplete({ score: 15, timeSpent: 0 })}
            className="rounded-xl bg-white/[0.06] border border-white/[0.06] px-6 py-2.5
                       text-sm text-white/60 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Continue →
          </button>
        </motion.div>
      )}
    </div>
  );
}
// ─── Router ───────────────────────────────────────────────────────────────────
export default function GuidedBuildStage({ config, onComplete }: Props) {
  if (config.steps && config.steps.length > 0) {
    return <SimpleStepsWizard config={config} onComplete={onComplete} />;
  }
  return <BSTBuilderStage config={config} onComplete={onComplete} />;
}