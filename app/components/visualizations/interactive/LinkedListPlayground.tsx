"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ─────────────────────────────────── */
interface LLNode {
  id: number;
  value: number;
}

type Op = "idle" | "inserting" | "deleting" | "searching" | "reversing";

interface LLState {
  nodes: LLNode[];
  headIdx: number; // visual pointer
  highlightIdx: number; // currently highlighted node
  highlightColor: string;
  op: Op;
  message: string;
  operations: number;
}

/* ── helpers ───────────────────────────────── */
let nextId = 1;
function makeNode(v: number): LLNode { return { id: nextId++, value: v }; }
function randomLL(len = 6): LLNode[] {
  return Array.from({ length: len }, () => makeNode(Math.floor(Math.random() * 99) + 1));
}
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ── Constants ─────────────────────────────── */
const NODE_W = 64;
const NODE_H = 36;
const ARROW_W = 28;
const MAX_LEN = 10;

/* ──────────────────────────────────────────── */
/*  LinkedListPlayground                        */
/* ──────────────────────────────────────────── */
export default function LinkedListPlayground() {
  const [state, setState] = useState<LLState>({
    nodes: randomLL(),
    headIdx: 0,
    highlightIdx: -1,
    highlightColor: "",
    op: "idle",
    message: "Linked list ready. Insert, delete, search, or reverse.",
    operations: 0,
  });
  const [input, setInput] = useState("");
  const [posInput, setPosInput] = useState("");
  const [speed, setSpeed] = useState(500);
  const cancelRef = useRef(false);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const busy = state.op !== "idle";

  /* ---- Insert Head ---- */
  const insertHead = useCallback(async () => {
    const val = Number(input);
    if (isNaN(val)) return;
    if (state.nodes.length >= MAX_LEN) { setState(s => ({...s, message: "Max 10 nodes."})); return; }
    setInput("");
    setState(s => ({...s, op: "inserting", message: `Inserting ${val} at head…`}));
    await sleep(speedRef.current);
    setState(s => ({
      ...s,
      nodes: [makeNode(val), ...s.nodes],
      highlightIdx: 0,
      highlightColor: "rgba(139,92,246,0.5)",
      message: `Inserted ${val} at head.`,
      operations: s.operations + 1,
    }));
    await sleep(speedRef.current);
    setState(s => ({...s, op: "idle", highlightIdx: -1}));
  }, [input, state.nodes.length]);

  /* ---- Insert Tail ---- */
  const insertTail = useCallback(async () => {
    const val = Number(input);
    if (isNaN(val)) return;
    if (state.nodes.length >= MAX_LEN) { setState(s => ({...s, message: "Max 10 nodes."})); return; }
    setInput("");
    setState(s => ({...s, op: "inserting"}));

    // walk to tail
    cancelRef.current = false;
    for (let i = 0; i < state.nodes.length; i++) {
      if (cancelRef.current) break;
      setState(s => ({
        ...s,
        highlightIdx: i,
        highlightColor: "rgba(34,211,238,0.3)",
        message: `Traversing… node ${i} (${s.nodes[i].value})`,
      }));
      await sleep(speedRef.current);
    }

    setState(s => ({
      ...s,
      nodes: [...s.nodes, makeNode(val)],
      highlightIdx: s.nodes.length,
      highlightColor: "rgba(139,92,246,0.5)",
      message: `Inserted ${val} at tail.`,
      operations: s.operations + 1,
    }));
    await sleep(speedRef.current);
    setState(s => ({...s, op: "idle", highlightIdx: -1}));
  }, [input, state.nodes]);

  /* ---- Insert at Index ---- */
  const insertAt = useCallback(async () => {
    const val = Number(input);
    const pos = Number(posInput);
    if (isNaN(val) || isNaN(pos) || pos < 0) return;
    if (state.nodes.length >= MAX_LEN) { setState(s => ({...s, message: "Max 10 nodes."})); return; }
    const idx = Math.min(pos, state.nodes.length);
    setInput(""); setPosInput("");
    setState(s => ({...s, op: "inserting"}));
    cancelRef.current = false;

    for (let i = 0; i < idx; i++) {
      if (cancelRef.current) break;
      setState(s => ({
        ...s,
        highlightIdx: i,
        highlightColor: "rgba(34,211,238,0.3)",
        message: `Walking to index ${idx}… at ${i}`,
      }));
      await sleep(speedRef.current);
    }

    const newNodes = [...state.nodes];
    newNodes.splice(idx, 0, makeNode(val));
    setState(s => ({
      ...s,
      nodes: newNodes,
      highlightIdx: idx,
      highlightColor: "rgba(139,92,246,0.5)",
      message: `Inserted ${val} at index ${idx}.`,
      operations: s.operations + 1,
    }));
    await sleep(speedRef.current);
    setState(s => ({...s, op: "idle", highlightIdx: -1}));
  }, [input, posInput, state.nodes]);

  /* ---- Delete ---- */
  const handleDelete = useCallback(async () => {
    const val = Number(input);
    if (isNaN(val)) return;
    setInput("");
    setState(s => ({...s, op: "deleting"}));
    cancelRef.current = false;

    for (let i = 0; i < state.nodes.length; i++) {
      if (cancelRef.current) break;
      setState(s => ({
        ...s,
        highlightIdx: i,
        highlightColor: "rgba(250,204,21,0.4)",
        message: `Searching… node ${i} (${s.nodes[i].value})`,
      }));
      await sleep(speedRef.current);
      if (state.nodes[i].value === val) {
        setState(s => ({
          ...s,
          highlightIdx: i,
          highlightColor: "rgba(248,113,113,0.5)",
          message: `Found ${val} at index ${i}. Removing…`,
        }));
        await sleep(speedRef.current);
        const newNodes = [...state.nodes];
        newNodes.splice(i, 1);
        setState(s => ({
          ...s,
          nodes: newNodes,
          highlightIdx: -1,
          message: `Deleted ${val}. Pointers re-linked.`,
          operations: s.operations + 1,
        }));
        await sleep(speedRef.current);
        setState(s => ({...s, op: "idle"}));
        return;
      }
    }
    setState(s => ({...s, op: "idle", highlightIdx: -1, message: `${val} not found.`}));
  }, [input, state.nodes]);

  /* ---- Search ---- */
  const handleSearch = useCallback(async () => {
    const val = Number(input);
    if (isNaN(val)) return;
    setInput("");
    setState(s => ({...s, op: "searching"}));
    cancelRef.current = false;
    let hops = 0;

    for (let i = 0; i < state.nodes.length; i++) {
      if (cancelRef.current) break;
      hops++;
      setState(s => ({
        ...s,
        highlightIdx: i,
        highlightColor: "rgba(250,204,21,0.4)",
        message: `Hop ${hops}: checking node ${i} (${s.nodes[i].value})`,
      }));
      await sleep(speedRef.current);
      if (state.nodes[i].value === val) {
        setState(s => ({
          ...s,
          highlightIdx: i,
          highlightColor: "rgba(52,211,153,0.5)",
          message: `Found ${val} at index ${i} after ${hops} hop(s).`,
        }));
        await sleep(speedRef.current * 2);
        setState(s => ({...s, op: "idle", highlightIdx: -1}));
        return;
      }
    }
    setState(s => ({...s, op: "idle", highlightIdx: -1, message: `${val} not found after ${hops} hop(s).`}));
  }, [input, state.nodes]);

  /* ---- Reverse ---- */
  const handleReverse = useCallback(async () => {
    if (state.nodes.length < 2) return;
    setState(s => ({...s, op: "reversing", message: "Reversing linked list…"}));
    cancelRef.current = false;

    const arr = [...state.nodes];
    for (let i = 0; i < Math.floor(arr.length / 2); i++) {
      if (cancelRef.current) break;
      const j = arr.length - 1 - i;
      setState(s => ({
        ...s,
        highlightIdx: i,
        highlightColor: "rgba(34,211,238,0.4)",
        message: `Swapping nodes ${i} ↔ ${j}`,
      }));
      await sleep(speedRef.current);
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setState(s => ({...s, nodes: [...arr]}));
      await sleep(speedRef.current);
    }
    setState(s => ({
      ...s,
      nodes: [...arr],
      op: "idle",
      highlightIdx: -1,
      message: "List reversed!",
      operations: s.operations + 1,
    }));
  }, [state.nodes]);

  /* ---- Reset ---- */
  const handleRandom = () => {
    cancelRef.current = true;
    nextId = 1;
    setState({ nodes: randomLL(), headIdx: 0, highlightIdx: -1, highlightColor: "", op: "idle", message: "New random list.", operations: 0 });
  };
  const handleClear = () => {
    cancelRef.current = true;
    setState({ nodes: [], headIdx: 0, highlightIdx: -1, highlightColor: "", op: "idle", message: "List cleared.", operations: 0 });
  };

  /* ── render ──────────────────────────────── */
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* controls row */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Value"
          disabled={busy}
          className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50"
        />
        <input
          type="text"
          value={posInput}
          onChange={(e) => setPosInput(e.target.value)}
          placeholder="Idx"
          disabled={busy}
          className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50"
        />
        <Btn label="Head+" color="purple" onClick={insertHead} disabled={busy} />
        <Btn label="Tail+" color="purple" onClick={insertTail} disabled={busy} />
        <Btn label="At Idx" color="purple" onClick={insertAt} disabled={busy} />
        <Btn label="Delete" color="red" onClick={handleDelete} disabled={busy} />
        <Btn label="Search" color="cyan" onClick={handleSearch} disabled={busy} />
        <Btn label="Reverse" color="amber" onClick={handleReverse} disabled={busy} />
        <span className="w-px h-6 bg-white/10" />
        <Btn label="Random" color="gray" onClick={handleRandom} disabled={false} />
        <Btn label="Clear" color="gray" onClick={handleClear} disabled={false} />
      </div>

      {/* speed */}
      <div className="flex items-center gap-2 text-xs text-white/50">
        <span>🐢</span>
        <input type="range" min={100} max={1000} step={50} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-28 accent-primary" />
        <span>🐇</span>
        <span className="ml-1">{speed}ms</span>
      </div>

      {/* linked list visualisation */}
      <div className="rounded-xl bg-background border border-white/10 overflow-x-auto p-6 flex items-center min-h-[100px]">
        {/* HEAD pointer */}
        {state.nodes.length > 0 && (
          <div className="flex flex-col items-center mr-2 shrink-0">
            <span className="text-[10px] text-emerald-400 font-bold">HEAD</span>
            <span className="text-emerald-400">→</span>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {state.nodes.map((node, i) => {
            const isHl = state.highlightIdx === i;
            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.7, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -20 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex items-center shrink-0"
              >
                {/* node box */}
                <div
                  className="flex items-center rounded-lg border transition-colors"
                  style={{
                    background: isHl ? state.highlightColor : "rgba(30, 58, 95, 0.8)",
                    borderColor: isHl ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)",
                    minWidth: NODE_W,
                    height: NODE_H,
                  }}
                >
                  {/* data */}
                  <div className="flex-1 text-center font-mono text-sm font-bold text-white px-2">
                    {node.value}
                  </div>
                  {/* next pointer cell */}
                  <div className="w-5 h-full border-l border-white/10 flex items-center justify-center">
                    {i < state.nodes.length - 1 ? (
                      <span className="text-[10px] text-white/40">•</span>
                    ) : (
                      <span className="text-[10px] text-red-400">∅</span>
                    )}
                  </div>
                </div>
                {/* arrow */}
                {i < state.nodes.length - 1 && (
                  <span className="text-white/30 mx-1 text-sm">→</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {state.nodes.length === 0 && (
          <span className="text-white/30 text-sm">Empty list (NULL)</span>
        )}
      </div>

      {/* status */}
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{state.message}</span>
        <div className="flex gap-3">
          <span>Nodes: <span className="text-white/70">{state.nodes.length}</span></span>
          <span>Operations: <span className="text-purple-300">{state.operations}</span></span>
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
