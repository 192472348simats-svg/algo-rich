"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Constants ────────────────────────────── */
const BLOCK_W = 52;
const BLOCK_H = 44;
const GAP = 4;
const MAX_LEN = 12;

type Op = "idle" | "inserting" | "deleting" | "searching" | "sorting" | "swapping";
type Highlight = { index: number; color: string };

interface ArrayState {
  arr: number[];
  highlights: Highlight[];
  op: Op;
  message: string;
  comparisons: number;
  swaps: number;
}

/* ── helpers ───────────────────────────────── */
function randomArray(len = 8): number[] {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 99) + 1);
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ──────────────────────────────────────────── */
/*  ArrayPlayground                             */
/* ──────────────────────────────────────────── */
export default function ArrayPlayground() {
  const [state, setState] = useState<ArrayState>({
    arr: randomArray(),
    highlights: [],
    op: "idle",
    message: "Array ready. Try inserting, deleting, or sorting.",
    comparisons: 0,
    swaps: 0,
  });

  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState(400);
  const cancelRef = useRef(false);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const busy = state.op !== "idle";

  /* ---- helpers ---- */
  const msg = (m: string) => setState((s) => ({ ...s, message: m }));
  const hl = (indices: Highlight[]) => setState((s) => ({ ...s, highlights: indices }));
  const idle = () => setState((s) => ({ ...s, op: "idle", highlights: [] }));

  /* ---- Insert ---- */
  const handleInsert = useCallback(async () => {
    const val = Number(input);
    if (isNaN(val)) return;
    if (state.arr.length >= MAX_LEN) { msg("Array is full (max 12)."); return; }
    setInput("");
    setState((s) => ({ ...s, op: "inserting" }));
    // highlight end position
    const idx = state.arr.length;
    msg(`Inserting ${val} at index ${idx}…`);
    await sleep(speedRef.current);
    setState((s) => ({
      ...s,
      arr: [...s.arr, val],
      highlights: [{ index: idx, color: "rgba(139,92,246,0.5)" }],
      message: `Inserted ${val} at index ${idx}.`,
    }));
    await sleep(speedRef.current);
    idle();
  }, [input, state.arr]);

  /* ---- Delete ---- */
  const handleDelete = useCallback(async () => {
    const val = Number(input);
    if (isNaN(val)) return;
    setInput("");
    const idx = state.arr.indexOf(val);
    if (idx === -1) { msg(`${val} not found.`); return; }

    setState((s) => ({ ...s, op: "deleting" }));
    msg(`Found ${val} at index ${idx}. Removing…`);
    hl([{ index: idx, color: "rgba(248,113,113,0.5)" }]);
    await sleep(speedRef.current);

    // shift left visualisation
    const newArr = [...state.arr];
    newArr.splice(idx, 1);
    setState((s) => ({
      ...s,
      arr: newArr,
      highlights: [],
      message: `Deleted ${val}. Array shifted.`,
    }));
    await sleep(speedRef.current);
    idle();
  }, [input, state.arr]);

  /* ---- Search ---- */
  const handleSearch = useCallback(async () => {
    const val = Number(input);
    if (isNaN(val)) return;
    setInput("");
    setState((s) => ({ ...s, op: "searching", comparisons: 0 }));
    cancelRef.current = false;
    let comps = 0;

    for (let i = 0; i < state.arr.length; i++) {
      if (cancelRef.current) break;
      comps++;
      setState((s) => ({
        ...s,
        highlights: [{ index: i, color: "rgba(250,204,21,0.4)" }],
        comparisons: comps,
        message: `Comparing index ${i} (${state.arr[i]}) with ${val}…`,
      }));
      await sleep(speedRef.current);
      if (state.arr[i] === val) {
        setState((s) => ({
          ...s,
          highlights: [{ index: i, color: "rgba(52,211,153,0.5)" }],
          message: `Found ${val} at index ${i} after ${comps} comparison(s).`,
        }));
        await sleep(speedRef.current * 2);
        idle();
        return;
      }
    }
    msg(`${val} not found after ${comps} comparison(s).`);
    idle();
  }, [input, state.arr]);

  /* ---- Bubble Sort ---- */
  const handleBubbleSort = useCallback(async () => {
    cancelRef.current = false;
    const arr = [...state.arr];
    setState((s) => ({ ...s, op: "sorting", comparisons: 0, swaps: 0 }));
    let c = 0, sw = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (cancelRef.current) { idle(); return; }
        c++;
        setState((s) => ({
          ...s,
          arr: [...arr],
          highlights: [
            { index: j, color: "rgba(34,211,238,0.4)" },
            { index: j + 1, color: "rgba(34,211,238,0.4)" },
          ],
          comparisons: c,
          message: `Comparing index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`,
        }));
        await sleep(speedRef.current);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          sw++;
          setState((s) => ({
            ...s,
            arr: [...arr],
            highlights: [
              { index: j, color: "rgba(139,92,246,0.5)" },
              { index: j + 1, color: "rgba(139,92,246,0.5)" },
            ],
            swaps: sw,
            message: `Swapped index ${j} ↔ ${j + 1}`,
          }));
          await sleep(speedRef.current);
        }
      }
    }
    setState((s) => ({ ...s, arr: [...arr], message: `Sorted! ${c} comparisons, ${sw} swaps.`, highlights: [] }));
    await sleep(speedRef.current);
    idle();
  }, [state.arr]);

  /* ---- Selection Sort ---- */
  const handleSelectionSort = useCallback(async () => {
    cancelRef.current = false;
    const arr = [...state.arr];
    setState((s) => ({ ...s, op: "sorting", comparisons: 0, swaps: 0 }));
    let c = 0, sw = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (cancelRef.current) { idle(); return; }
        c++;
        setState((s) => ({
          ...s,
          arr: [...arr],
          highlights: [
            { index: minIdx, color: "rgba(52,211,153,0.4)" },
            { index: j, color: "rgba(250,204,21,0.4)" },
          ],
          comparisons: c,
          message: `Min so far: index ${minIdx} (${arr[minIdx]}). Checking index ${j} (${arr[j]})`,
        }));
        await sleep(speedRef.current);
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        sw++;
        setState((s) => ({
          ...s,
          arr: [...arr],
          highlights: [
            { index: i, color: "rgba(139,92,246,0.5)" },
            { index: minIdx, color: "rgba(139,92,246,0.5)" },
          ],
          swaps: sw,
          message: `Swapped index ${i} ↔ ${minIdx}`,
        }));
        await sleep(speedRef.current);
      }
    }
    setState((s) => ({ ...s, arr: [...arr], message: `Sorted! ${c} comparisons, ${sw} swaps.`, highlights: [] }));
    await sleep(speedRef.current);
    idle();
  }, [state.arr]);

  /* ---- Insertion Sort ---- */
  const handleInsertionSort = useCallback(async () => {
    cancelRef.current = false;
    const arr = [...state.arr];
    setState((s) => ({ ...s, op: "sorting", comparisons: 0, swaps: 0 }));
    let c = 0, sw = 0;

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      setState((s) => ({
        ...s,
        arr: [...arr],
        highlights: [{ index: i, color: "rgba(250,204,21,0.5)" }],
        message: `Key: ${key} at index ${i}. Shifting larger elements right…`,
      }));
      await sleep(speedRef.current);
      while (j >= 0 && arr[j] > key) {
        if (cancelRef.current) { idle(); return; }
        c++;
        arr[j + 1] = arr[j];
        sw++;
        setState((s) => ({
          ...s,
          arr: [...arr],
          highlights: [
            { index: j, color: "rgba(34,211,238,0.4)" },
            { index: j + 1, color: "rgba(139,92,246,0.4)" },
          ],
          comparisons: c,
          swaps: sw,
          message: `Shifted ${arr[j + 1]} right to index ${j + 1}`,
        }));
        await sleep(speedRef.current);
        j--;
      }
      arr[j + 1] = key;
      setState((s) => ({ ...s, arr: [...arr] }));
    }
    setState((s) => ({ ...s, arr: [...arr], message: `Sorted! ${c} comparisons, ${sw} shifts.`, highlights: [] }));
    await sleep(speedRef.current);
    idle();
  }, [state.arr]);

  /* ---- Reset / Cancel ---- */
  const handleRandom = () => {
    cancelRef.current = true;
    setState({ arr: randomArray(), highlights: [], op: "idle", message: "New random array.", comparisons: 0, swaps: 0 });
  };

  const handleClear = () => {
    cancelRef.current = true;
    setState({ arr: [], highlights: [], op: "idle", message: "Array cleared.", comparisons: 0, swaps: 0 });
  };

  /* ── render ──────────────────────────────── */
  const totalW = state.arr.length * (BLOCK_W + GAP);
  const svgW = Math.max(totalW + 24, 200);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Value"
          disabled={busy}
          className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50"
        />
        <ActionBtn label="Insert" color="purple" onClick={handleInsert} disabled={busy} />
        <ActionBtn label="Delete" color="red" onClick={handleDelete} disabled={busy} />
        <ActionBtn label="Search" color="cyan" onClick={handleSearch} disabled={busy} />
        <span className="w-px h-6 bg-white/10" />
        <ActionBtn label="Bubble" color="amber" onClick={handleBubbleSort} disabled={busy} />
        <ActionBtn label="Selection" color="amber" onClick={handleSelectionSort} disabled={busy} />
        <ActionBtn label="Insertion" color="amber" onClick={handleInsertionSort} disabled={busy} />
        <span className="w-px h-6 bg-white/10" />
        <ActionBtn label="Random" color="gray" onClick={handleRandom} disabled={false} />
        <ActionBtn label="Clear" color="gray" onClick={handleClear} disabled={false} />
      </div>

      {/* speed */}
      <div className="flex items-center gap-2 text-xs text-white/50">
        <span>🐢</span>
        <input
          type="range"
          min={50}
          max={800}
          step={50}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-28 accent-primary"
        />
        <span>🐇</span>
        <span className="ml-1">{speed}ms</span>
      </div>

      {/* array visualisation */}
      <div className="rounded-xl bg-background border border-white/10 overflow-x-auto p-4 flex items-end justify-center min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {state.arr.map((val, i) => {
            const h = state.highlights.find((hl) => hl.index === i);
            return (
              <motion.div
                key={`${i}-${val}`}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col items-center mx-0.5"
              >
                <div
                  className="flex items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors"
                  style={{
                    width: BLOCK_W,
                    height: BLOCK_H,
                    background: h ? h.color : "rgba(30, 58, 95, 0.8)",
                    borderColor: h ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  {val}
                </div>
                <span className="text-[10px] text-white/30 mt-1">{i}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {state.arr.length === 0 && (
          <span className="text-white/30 text-sm">Empty array</span>
        )}
      </div>

      {/* stats bar */}
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{state.message}</span>
        <div className="flex gap-3">
          <span>Comparisons: <span className="text-primary">{state.comparisons}</span></span>
          <span>Swaps: <span className="text-purple-300">{state.swaps}</span></span>
          <span>Length: <span className="text-white/70">{state.arr.length}</span></span>
        </div>
      </div>
    </div>
  );
}

/* ── small button component ───────────────── */
const colorMap: Record<string, string> = {
  purple: "bg-purple-600/20 text-purple-300 hover:bg-purple-600/40",
  red: "bg-red-600/20 text-red-300 hover:bg-red-600/40",
  cyan: "bg-cyan-600/20 text-primary hover:bg-cyan-600/40",
  amber: "bg-amber-600/20 text-amber-300 hover:bg-amber-600/40",
  gray: "bg-white/5 text-white/60 hover:bg-white/15",
};

function ActionBtn({ label, color, onClick, disabled }: { label: string; color: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 ${colorMap[color] ?? colorMap.gray}`}
    >
      {label}
    </button>
  );
}
