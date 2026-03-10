"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ─────────────────────────────────── */
type Mode = "stack" | "queue";
type Op = "idle" | "pushing" | "popping" | "peeking" | "matching";

interface DSState {
  items: { id: number; value: string }[];
  highlights: number[]; // indices currently highlighted
  highlightColor: string;
  op: Op;
  message: string;
  operations: number;
}

/* ── helpers ───────────────────────────────── */
let nid = 1;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ──────────────────────────────────────────── */
/*  StackQueuePlayground                        */
/* ──────────────────────────────────────────── */
export default function StackQueuePlayground() {
  const [mode, setMode] = useState<Mode>("stack");
  const [state, setState] = useState<DSState>({
    items: [],
    highlights: [],
    highlightColor: "",
    op: "idle",
    message: "Stack mode — push and pop values to explore LIFO behaviour.",
    operations: 0,
  });
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(400);
  const cancelRef = useRef(false);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const busy = state.op !== "idle";

  /* ---- Mode switch ---- */
  const switchMode = (m: Mode) => {
    cancelRef.current = true;
    setMode(m);
    nid = 1;
    setState({
      items: [],
      highlights: [],
      highlightColor: "",
      op: "idle",
      message: m === "stack"
        ? "Stack mode — push and pop values to explore LIFO behaviour."
        : "Queue mode — enqueue and dequeue to explore FIFO behaviour.",
      operations: 0,
    });
  };

  /* ---- Push / Enqueue ---- */
  const handlePush = useCallback(async () => {
    const val = input.trim();
    if (!val) return;
    if (state.items.length >= 10) { setState(s => ({...s, message: "Max 10 items."})); return; }
    setInput("");
    const item = { id: nid++, value: val };
    setState(s => ({
      ...s,
      op: "pushing",
      message: mode === "stack" ? `Pushing "${val}" onto stack…` : `Enqueueing "${val}"…`,
    }));
    await sleep(speedRef.current);

    if (mode === "stack") {
      // push to top (front of visual array)
      setState(s => ({
        ...s,
        items: [item, ...s.items],
        highlights: [0],
        highlightColor: "rgba(139,92,246,0.5)",
        message: `Pushed "${val}". Stack size: ${s.items.length + 1}`,
        operations: s.operations + 1,
      }));
    } else {
      // enqueue to back
      setState(s => ({
        ...s,
        items: [...s.items, item],
        highlights: [s.items.length],
        highlightColor: "rgba(139,92,246,0.5)",
        message: `Enqueued "${val}". Queue size: ${s.items.length + 1}`,
        operations: s.operations + 1,
      }));
    }
    await sleep(speedRef.current);
    setState(s => ({...s, op: "idle", highlights: []}));
  }, [input, mode, state.items.length]);

  /* ---- Pop / Dequeue ---- */
  const handlePop = useCallback(async () => {
    if (state.items.length === 0) { setState(s => ({...s, message: `${mode === "stack" ? "Stack" : "Queue"} is empty!`})); return; }
    const rmIdx = 0; // stack pops from top (index 0), queue dequeues from front (index 0)
    setState(s => ({
      ...s,
      op: "popping",
      highlights: [rmIdx],
      highlightColor: "rgba(248,113,113,0.5)",
      message: mode === "stack"
        ? `Popping "${s.items[rmIdx].value}" (LIFO)…`
        : `Dequeueing "${s.items[rmIdx].value}" (FIFO)…`,
    }));
    await sleep(speedRef.current);

    setState(s => {
      const removed = s.items[rmIdx];
      const newItems = s.items.filter((_, i) => i !== rmIdx);
      return {
        ...s,
        items: newItems,
        highlights: [],
        message: `${mode === "stack" ? "Popped" : "Dequeued"} "${removed.value}". Size: ${newItems.length}`,
        operations: s.operations + 1,
      };
    });
    await sleep(speedRef.current);
    setState(s => ({...s, op: "idle"}));
  }, [mode, state.items]);

  /* ---- Peek / Front ---- */
  const handlePeek = useCallback(async () => {
    if (state.items.length === 0) { setState(s => ({...s, message: "Nothing to peek — empty!"})); return; }
    const peekIdx = 0;
    setState(s => ({
      ...s,
      op: "peeking",
      highlights: [peekIdx],
      highlightColor: "rgba(52,211,153,0.5)",
      message: `${mode === "stack" ? "Top" : "Front"}: "${s.items[peekIdx].value}"`,
    }));
    await sleep(speedRef.current * 2);
    setState(s => ({...s, op: "idle", highlights: []}));
  }, [mode, state.items]);

  /* ---- Parentheses Matcher (Stack challenge) ---- */
  const [parenInput, setParenInput] = useState("");
  const handleMatchParens = useCallback(async () => {
    if (!parenInput.trim()) return;
    const expr = parenInput.trim();
    setParenInput("");
    cancelRef.current = false;
    nid = 1;
    setState(s => ({
      ...s,
      items: [],
      op: "matching",
      highlights: [],
      message: `Checking "${expr}" for balanced parentheses…`,
      operations: 0,
    }));
    await sleep(speedRef.current);

    const matchMap: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
    const opening = new Set(["(", "[", "{"]);
    const closing = new Set([")", "]", "}"]);
    let stack: { id: number; value: string }[] = [];
    let balanced = true;

    for (const ch of expr) {
      if (cancelRef.current) break;
      if (opening.has(ch)) {
        const item = { id: nid++, value: ch };
        stack = [item, ...stack];
        setState(s => ({
          ...s,
          items: [...stack],
          highlights: [0],
          highlightColor: "rgba(139,92,246,0.5)",
          message: `Push "${ch}"`,
          operations: s.operations + 1,
        }));
        await sleep(speedRef.current);
      } else if (closing.has(ch)) {
        if (stack.length === 0 || stack[0].value !== matchMap[ch]) {
          balanced = false;
          setState(s => ({
            ...s,
            highlights: stack.length > 0 ? [0] : [],
            highlightColor: "rgba(248,113,113,0.5)",
            message: `Mismatch! "${ch}" has no matching opening bracket.`,
          }));
          await sleep(speedRef.current * 2);
          break;
        }
        setState(s => ({
          ...s,
          highlights: [0],
          highlightColor: "rgba(52,211,153,0.5)",
          message: `Match! "${stack[0].value}" ↔ "${ch}"`,
          operations: s.operations + 1,
        }));
        await sleep(speedRef.current);
        stack = stack.slice(1);
        setState(s => ({ ...s, items: [...stack], highlights: [] }));
        await sleep(speedRef.current / 2);
      }
    }

    if (balanced && stack.length > 0) balanced = false;
    setState(s => ({
      ...s,
      items: [...stack],
      op: "idle",
      highlights: [],
      message: balanced
        ? `✅ "${expr}" is balanced!`
        : `❌ "${expr}" is NOT balanced.`,
    }));
  }, [parenInput]);

  /* ---- Reset ---- */
  const handleClear = () => {
    cancelRef.current = true;
    nid = 1;
    setState({
      items: [],
      highlights: [],
      highlightColor: "",
      op: "idle",
      message: mode === "stack" ? "Stack cleared." : "Queue cleared.",
      operations: 0,
    });
  };

  /* ── render ──────────────────────────────── */
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mode tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 w-fit">
        {(["stack", "queue"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
              mode === m ? "bg-primary text-background" : "text-white/60 hover:text-white"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePush()}
          placeholder="Value"
          disabled={busy}
          className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50"
        />
        <Btn label={mode === "stack" ? "Push" : "Enqueue"} color="purple" onClick={handlePush} disabled={busy} />
        <Btn label={mode === "stack" ? "Pop" : "Dequeue"} color="red" onClick={handlePop} disabled={busy} />
        <Btn label={mode === "stack" ? "Peek" : "Front"} color="cyan" onClick={handlePeek} disabled={busy} />
        <span className="w-px h-6 bg-white/10" />
        <Btn label="Clear" color="gray" onClick={handleClear} disabled={false} />
      </div>

      {/* Speed */}
      <div className="flex items-center gap-2 text-xs text-white/50">
        <span>🐢</span>
        <input type="range" min={100} max={800} step={50} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-28 accent-primary" />
        <span>🐇</span>
        <span className="ml-1">{speed}ms</span>
      </div>

      {/* Visualisation */}
      <div className="rounded-xl bg-background border border-white/10 overflow-hidden p-4 min-h-[160px]">
        {mode === "stack" ? (
          /* ---- Stack: vertical, top to bottom ---- */
          <div className="flex flex-col items-center gap-1">
            {state.items.length > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold mb-1">← TOP</span>
            )}
            <AnimatePresence mode="popLayout">
              {state.items.map((item, i) => {
                const isHl = state.highlights.includes(i);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -40, scale: 0.7 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors"
                    style={{
                      width: 120,
                      height: 36,
                      background: isHl ? state.highlightColor : "rgba(30, 58, 95, 0.8)",
                      borderColor: isHl ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  >
                    {item.value}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {state.items.length > 0 && (
              <span className="text-[10px] text-white/30 mt-1">BOTTOM</span>
            )}
            {state.items.length === 0 && (
              <span className="text-white/30 text-sm py-8">Empty stack</span>
            )}
          </div>
        ) : (
          /* ---- Queue: horizontal left (front) to right (back) ---- */
          <div className="flex items-center gap-1 overflow-x-auto">
            {state.items.length > 0 && (
              <div className="flex flex-col items-center mr-1 shrink-0">
                <span className="text-[10px] text-emerald-400 font-bold">FRONT</span>
                <span className="text-emerald-400 text-xs">→</span>
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {state.items.map((item, i) => {
                const isHl = state.highlights.includes(i);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.7, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -30 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex items-center justify-center rounded-lg border font-mono text-sm font-bold shrink-0 transition-colors"
                    style={{
                      width: 64,
                      height: 40,
                      background: isHl ? state.highlightColor : "rgba(30, 58, 95, 0.8)",
                      borderColor: isHl ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  >
                    {item.value}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {state.items.length > 0 && (
              <div className="flex flex-col items-center ml-1 shrink-0">
                <span className="text-[10px] text-amber-400 font-bold">BACK</span>
              </div>
            )}
            {state.items.length === 0 && (
              <span className="text-white/30 text-sm py-8 mx-auto">Empty queue</span>
            )}
          </div>
        )}
      </div>

      {/* Parentheses matcher (stack mode only) */}
      {mode === "stack" && (
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3">
          <p className="text-xs text-white/50 mb-2 font-medium">🧩 Balanced Parentheses Challenge</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={parenInput}
              onChange={(e) => setParenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMatchParens()}
              placeholder="e.g. ({[]})"
              disabled={busy}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50"
            />
            <Btn label="Check" color="amber" onClick={handleMatchParens} disabled={busy} />
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{state.message}</span>
        <div className="flex gap-3">
          <span>Size: <span className="text-white/70">{state.items.length}</span></span>
          <span>Ops: <span className="text-purple-300">{state.operations}</span></span>
        </div>
      </div>
    </div>
  );
}

/* ── button ────────────────────────────────── */
const cMap: Record<string, string> = {
  purple: "bg-purple-600/20 text-purple-300 hover:bg-purple-600/40",
  red: "bg-red-600/20 text-red-300 hover:bg-red-600/40",
  cyan: "bg-cyan-600/20 text-primary hover:bg-cyan-600/40",
  amber: "bg-amber-600/20 text-amber-300 hover:bg-amber-600/40",
  gray: "bg-white/5 text-white/60 hover:bg-white/15",
};
function Btn({ label, color, onClick, disabled }: { label: string; color: string; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 ${cMap[color] ?? cMap.gray}`}>
      {label}
    </button>
  );
}
