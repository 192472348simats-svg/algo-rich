"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  WatchConfig,
  TextFlowStep,
  BoxAnimationStep,
  CounterAnimationStep,
  MachineAnimationStep,
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
const CANVAS_HEIGHT = 400;

// ─── Legacy Tree Visualizer ─────────────────────────────────────────────────

function TreeVisualizer({ config, onComplete }: { config: WatchConfig; onComplete: (r: StageResult) => void }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [narration, setNarration] = useState("");
  const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [latestValue, setLatestValue] = useState<number | null>(null);
  const playingRef = useRef(true);
  const hasStarted = useRef(false);

  useEffect(() => { resetIdCounter(); }, []);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    async function autoPlay() {
      await new Promise((r) => setTimeout(r, 800));
      let root: TreeNode | null = null;
      const steps = config.autoPlaySteps ?? [];
      for (let i = 0; i < steps.length; i++) {
        if (!playingRef.current) break;
        const step = steps[i];
        setCurrentStep(i);
        setNarration(step.narration);
        if (step.action === "insert" && step.value !== undefined) {
          resetIdCounter();
          const values = steps.slice(0, i + 1)
            .filter((s) => s.action === "insert" && s.value !== undefined)
            .map((s) => s.value as number);
          root = null;
          for (const v of values) root = insertBST(root, v);
          if (root) computeLayout(root, CANVAS_WIDTH);
          setTreeRoot(root ? { ...root } : null);
          setLatestValue(step.value);
        }
        await new Promise((r) => setTimeout(r, step.delayAfterMs));
      }
      setIsComplete(true);
    }
    autoPlay();
    return () => { playingRef.current = false; };
  }, [config]);

  const nodes = useMemo(() => (treeRoot ? collectNodes(treeRoot) : []), [treeRoot]);
  const edges = useMemo(() => {
    const result: { fromX: number; fromY: number; toX: number; toY: number }[] = [];
    function walk(node: TreeNode | null) {
      if (!node) return;
      if (node.left) { result.push({ fromX: node.x, fromY: node.y, toX: node.left.x, toY: node.left.y }); walk(node.left); }
      if (node.right) { result.push({ fromX: node.x, fromY: node.y, toX: node.right.x, toY: node.right.y }); walk(node.right); }
    }
    walk(treeRoot);
    return result;
  }, [treeRoot]);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => onComplete({ score: 0, timeSpent: 0 }), 2500);
      return () => clearTimeout(t);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/20 mb-1">Watch &amp; Observe</p>
        <p className="text-sm text-white/40">See how the data structure builds itself</p>
      </div>
      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden" style={{ height: CANVAS_HEIGHT }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}>
          {edges.map((edge, i) => (
            <motion.line key={`edge-${i}`} x1={edge.fromX} y1={edge.fromY} x2={edge.toX} y2={edge.toY}
              stroke="rgba(148,163,184,0.2)" strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
          ))}
          {nodes.map((node) => {
            const isLatest = node.value === latestValue;
            return (
              <motion.g key={node.id}>
                {isLatest && <motion.circle cx={node.x} cy={node.y} r={30} fill="hsl(43 96% 56% / 0.12)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} />}
                <motion.circle cx={node.x} cy={node.y} r={22} fill="#1e293b" stroke={isLatest ? "hsl(43 96% 56%)" : "#334155"} strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                <motion.text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={15} fontWeight={700}
                  fontFamily="monospace" style={{ pointerEvents: "none" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  {node.value}
                </motion.text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <AnimatePresence mode="wait">
        {narration && (
          <motion.div key={narration} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center">
            <p className="text-sm text-white/60 italic">&ldquo;{narration}&rdquo;</p>
            <p className="text-xs text-white/20 mt-2">Step {currentStep + 1} of {(config.autoPlaySteps ?? []).length}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {isComplete && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-white/20">Continuing...</motion.p>}
    </div>
  );
}

// ─── Text-Flow Visualizer ────────────────────────────────────────────────────

function TextFlowVisualizer({ steps, onComplete }: { steps: TextFlowStep[]; onComplete: (r: StageResult) => void }) {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i < steps.length; i++) {
      timers.push(setTimeout(() => setVisible(i + 1), i * 2200));
    }
    timers.push(setTimeout(() => onComplete({ score: 0, timeSpent: 0 }), steps.length * 2200 + 1000));
    return () => timers.forEach(clearTimeout);
  }, [steps, onComplete]);

  return (
    <div className="space-y-4">
      <p className="text-center text-xs uppercase tracking-widest text-white/20">How Code Runs</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center gap-3">
            <AnimatePresence>
              {i < visible && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="glass rounded-xl px-5 py-4 min-w-[140px] text-center border border-primary/20"
                >
                  <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-1">{step.label}</p>
                  <p className="text-sm font-mono text-white/80 break-all">{step.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {i < steps.length - 1 && i < visible - 1 && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-primary text-xl hidden sm:inline">→</motion.span>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-white/30">Each arrow shows how Python processes your code</p>
    </div>
  );
}

// ─── Box Animation Visualizer ────────────────────────────────────────────────

function BoxAnimationVisualizer({ steps, onComplete }: { steps: BoxAnimationStep[]; onComplete: (r: StageResult) => void }) {
  const [stepIdx, setStepIdx] = useState(0);

  const boxes = useMemo(() => {
    const map: Record<string, { value: string | null; state: "empty" | "filled" | "glowing" | "updating"; oldValue?: string }> = {};
    for (let i = 0; i <= stepIdx && i < steps.length; i++) {
      const s = steps[i];
      if (s.action === "create") map[s.label] = { value: null, state: "empty" };
      else if (s.action === "fill") map[s.label] = { value: s.value ?? null, state: "filled" };
      else if (s.action === "read") map[s.label] = { ...(map[s.label] ?? { value: null }), state: "glowing" };
      else if (s.action === "update") map[s.label] = { value: s.newValue ?? null, state: "updating", oldValue: s.oldValue };
    }
    return map;
  }, [stepIdx, steps]);

  const currentStep = steps[stepIdx];

  useEffect(() => {
    if (stepIdx >= steps.length - 1) {
      const t = setTimeout(() => onComplete({ score: 0, timeSpent: 0 }), 1500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIdx((p) => p + 1), 2000);
    return () => clearTimeout(t);
  }, [stepIdx, steps.length, onComplete]);

  return (
    <div className="space-y-6">
      <p className="text-center text-xs uppercase tracking-widest text-white/20">Variables in Memory</p>
      <div className="flex flex-wrap justify-center gap-8 min-h-[120px] items-center">
        {Object.entries(boxes).map(([label, box]) => (
          <motion.div key={label} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 250, damping: 22 }}>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-primary mb-1">{label}</p>
              <motion.div
                className="w-28 h-16 rounded-xl flex items-center justify-center"
                animate={{
                  boxShadow: box.state === "glowing" ? "0 0 20px hsl(43 96% 56% / 0.5)" : "0 0 0px transparent",
                  borderColor: box.state === "empty" ? "hsl(228 30% 22% / 0.4)" : "hsl(43 96% 56% / 0.5)",
                  borderStyle: box.state === "empty" ? "dashed" : "solid",
                  borderWidth: "1px",
                }}
                style={{ background: "hsl(228 40% 12% / 0.6)" }}
                transition={{ duration: 0.4 }}
              >
                {box.state === "updating" ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.span key={`old-${box.oldValue}`} initial={{ opacity: 1 }} animate={{ opacity: 0, color: "#ef4444" }} transition={{ duration: 0.4 }} className="absolute font-mono text-sm">{box.oldValue}</motion.span>
                    <motion.span key={`new-${box.value}`} initial={{ opacity: 0 }} animate={{ opacity: 1, color: "#34d399" }} transition={{ duration: 0.4, delay: 0.4 }} className="absolute font-mono text-sm">{box.value}</motion.span>
                  </div>
                ) : box.value == null ? (
                  <span className="text-white/20 text-xs">empty</span>
                ) : (
                  <motion.span key={box.value} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="font-mono text-sm text-white/80">{box.value}</motion.span>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-white/30">Step {stepIdx + 1} of {steps.length}</p>
        {currentStep && <p className="text-[10px] text-white/20 mt-1 capitalize">{currentStep.action} → {currentStep.label}</p>}
      </div>
    </div>
  );
}

// ─── Counter Animation Visualizer ───────────────────────────────────────────

function CounterAnimationVisualizer({ steps, onComplete }: { steps: CounterAnimationStep[]; onComplete: (r: StageResult) => void }) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (stepIdx >= steps.length - 1) {
      const t = setTimeout(() => onComplete({ score: 0, timeSpent: 0 }), 1500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIdx((p) => p + 1), 1800);
    return () => clearTimeout(t);
  }, [stepIdx, steps.length, onComplete]);

  const step = steps[stepIdx];
  const outputLines = step.output?.split("\n").filter(Boolean) ?? [];
  const codeLines = Array.from(new Set(steps.map((s) => s.code)));

  return (
    <div className="space-y-4">
      <p className="text-center text-xs uppercase tracking-widest text-white/20">Loop Execution</p>
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-2">CODE</p>
          {codeLines.map((line, i) => (
            <motion.p key={i}
              animate={{ backgroundColor: line === step.code ? "hsl(43 96% 56% / 0.12)" : "transparent" }}
              className="rounded px-1 font-mono text-xs text-white/70 whitespace-pre leading-5 transition-colors"
            >{line}</motion.p>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-2">i =</p>
          <motion.div key={String(step.counter)} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center"
            style={{ background: "hsl(43 96% 56% / 0.08)" }}>
            <span className="font-mono text-xl font-bold text-primary">{step.counter === null ? "?" : step.counter}</span>
          </motion.div>
        </div>
        <div className="glass rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-2">OUTPUT</p>
          <div className="space-y-0.5">
            {outputLines.map((line, i) => (
              <motion.p key={`${stepIdx}-${i}`}
                initial={i === outputLines.length - 1 ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
                className="font-mono text-xs text-green-400">{line}</motion.p>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {step.narration && (
          <motion.p key={step.narration} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-sm text-white/50 italic">{step.narration}</motion.p>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-white/20">Step {stepIdx + 1} of {steps.length}</p>
    </div>
  );
}

// ─── Machine Animation Visualizer ───────────────────────────────────────────

function MachineAnimationVisualizer({ steps, onComplete }: { steps: MachineAnimationStep[]; onComplete: (r: StageResult) => void }) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (stepIdx >= steps.length - 1) {
      const t = setTimeout(() => onComplete({ score: 0, timeSpent: 0 }), 1500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIdx((p) => p + 1), 2500);
    return () => clearTimeout(t);
  }, [stepIdx, steps.length, onComplete]);

  const step = steps[stepIdx];

  return (
    <div className="space-y-4">
      <p className="text-center text-xs uppercase tracking-widest text-white/20">Function Machine</p>
      {step.action === "compare" ? (
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="glass rounded-xl p-4 border border-red-500/20">
            <p className="text-[10px] text-red-400 uppercase tracking-widest mb-2">❌ print — shows only</p>
            <code className="font-mono text-sm text-white/60">{step.print_ver}</code>
            <p className="text-[10px] text-white/30 mt-2">Can&apos;t capture result</p>
          </div>
          <div className="glass rounded-xl p-4 border border-green-500/20">
            <p className="text-[10px] text-green-400 uppercase tracking-widest mb-2">✅ return — sends back</p>
            <code className="font-mono text-sm text-white/60">{step.return_ver}</code>
            <p className="text-[10px] text-white/30 mt-2">result = add(3,4) ✓</p>
          </div>
        </div>
      ) : step.action === "code" ? (
        <div className="glass rounded-xl p-5 max-w-sm mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-2">Python Code</p>
          <pre className="font-mono text-sm text-white/80 whitespace-pre">{step.code}</pre>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col gap-2">
            {(step.inputs ?? []).map((inp, i) => (
              <motion.div key={`inp-${stepIdx}-${i}`} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
                className="px-3 py-1.5 rounded-full text-sm font-mono font-bold"
                style={{ background: "hsl(43 96% 56% / 0.15)", color: "hsl(43 96% 56%)", border: "1px solid hsl(43 96% 56% / 0.3)" }}>
                {inp}
              </motion.div>
            ))}
          </div>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: 2 }}
            className="glass rounded-2xl w-24 h-24 flex flex-col items-center justify-center border border-primary/20">
            <span className="text-3xl">⚙️</span>
            <p className="text-[10px] text-primary/60 mt-1 font-mono">{step.name ?? "fn"}</p>
          </motion.div>
          {step.output !== undefined && (
            <motion.div key={`out-${stepIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="px-3 py-1.5 rounded-full text-sm font-mono font-bold"
              style={{ background: "hsl(142 76% 36% / 0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
              {String(step.output)}
            </motion.div>
          )}
        </div>
      )}
      {step.narration && <p className="text-center text-sm text-white/50 italic">{step.narration}</p>}
      <p className="text-center text-xs text-white/20">Step {stepIdx + 1} of {steps.length}</p>
    </div>
  );
}

// ─── Main Dispatcher ─────────────────────────────────────────────────────────

export default function WatchStage({ config, onComplete }: Props) {
  const { visualizerType, steps } = config;

  const BeginnerHeader = () => (
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest text-white/20 mb-1">Watch &amp; Observe</p>
      <p className="text-sm text-white/40">Follow along step by step</p>
    </div>
  );

  switch (visualizerType) {
    case "text-flow":
      return (
        <div className="space-y-6">
          <BeginnerHeader />
          <TextFlowVisualizer steps={steps as TextFlowStep[]} onComplete={onComplete} />
        </div>
      );
    case "box-animation":
      return (
        <div className="space-y-6">
          <BeginnerHeader />
          <BoxAnimationVisualizer steps={steps as BoxAnimationStep[]} onComplete={onComplete} />
        </div>
      );
    case "counter-animation":
      return (
        <div className="space-y-6">
          <BeginnerHeader />
          <CounterAnimationVisualizer steps={steps as CounterAnimationStep[]} onComplete={onComplete} />
        </div>
      );
    case "machine-animation":
      return (
        <div className="space-y-6">
          <BeginnerHeader />
          <MachineAnimationVisualizer steps={steps as MachineAnimationStep[]} onComplete={onComplete} />
        </div>
      );
    default:
      return <TreeVisualizer config={config} onComplete={onComplete} />;
  }
}
