"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";

interface MemoryPlaygroundProps {
  gridSize?: number;
  className?: string;
}

type CellState = "free" | "allocated";

interface MemoryBlock {
  id: string;
  type: "array" | "linked_list" | "variable" | "struct";
  label: string;
  color: string;
  startIdx: number;
  size: number;
}

const COLORS = [
  "#06b6d4", // cyan
  "#d4af37", // gold
  "#10b981", // emerald
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ec4899", // pink
  "#ef4444", // red
  "#6366f1", // indigo
];

const BASE_ADDRESS = 0x1000;

export default function MemoryPlayground({
  gridSize = 64,
  className = "",
}: MemoryPlaygroundProps) {
  const [blocks, setBlocks] = useState<MemoryBlock[]>([]);
  const [allocType, setAllocType] = useState<MemoryBlock["type"]>("array");
  const [allocSize, setAllocSize] = useState(4);
  const [allocLabel, setAllocLabel] = useState("");
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [showAddressCalc, setShowAddressCalc] = useState(false);

  // Build cell map
  const cellMap = useMemo(() => {
    const map = new Array<{ state: CellState; block?: MemoryBlock }>(gridSize).fill({ state: "free" });
    const result = map.map(() => ({ state: "free" as CellState, block: undefined as MemoryBlock | undefined }));
    blocks.forEach((block) => {
      for (let i = block.startIdx; i < block.startIdx + block.size && i < gridSize; i++) {
        result[i] = { state: "allocated", block };
      }
    });
    return result;
  }, [blocks, gridSize]);

  const usedCells = cellMap.filter((c) => c.state === "allocated").length;
  const freePercent = Math.round(((gridSize - usedCells) / gridSize) * 100);

  // Find first fit for allocation
  const findFreeSlot = useCallback(
    (size: number): number | null => {
      for (let i = 0; i <= gridSize - size; i++) {
        let fits = true;
        for (let j = i; j < i + size; j++) {
          if (cellMap[j].state === "allocated") {
            fits = false;
            break;
          }
        }
        if (fits) return i;
      }
      return null;
    },
    [cellMap, gridSize]
  );

  const allocate = useCallback(() => {
    const slot = findFreeSlot(allocSize);
    if (slot === null) return;

    const colorIdx = blocks.length % COLORS.length;
    const label = allocLabel || `${allocType}_${blocks.length}`;

    setBlocks((prev) => [
      ...prev,
      {
        id: `block-${Date.now()}`,
        type: allocType,
        label,
        color: COLORS[colorIdx],
        startIdx: slot,
        size: allocSize,
      },
    ]);
    setAllocLabel("");
  }, [allocSize, allocType, allocLabel, blocks.length, findFreeSlot]);

  const freeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const freeAll = useCallback(() => {
    setBlocks([]);
    setSelectedCell(null);
    setHoveredBlock(null);
  }, []);

  // Address calculator
  const calcAddress = useMemo(() => {
    const hex = addressInput.trim();
    if (!hex) return null;
    const addr = parseInt(hex, 16);
    if (isNaN(addr)) return null;
    const offset = addr - BASE_ADDRESS;
    if (offset < 0 || offset >= gridSize) return null;
    return { addr, offset, cell: cellMap[offset] };
  }, [addressInput, cellMap, gridSize]);

  const typeSizes: Record<MemoryBlock["type"], string> = {
    array: "Contiguous block",
    linked_list: "Scattered nodes",
    variable: "Single value",
    struct: "Grouped fields",
  };

  return (
    <div className={`p-6 rounded-2xl bg-background/80/50 backdrop-blur-xl border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Memory Playground</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/30">
            {usedCells}/{gridSize} used ({freePercent}% free)
          </span>
        </div>
      </div>

      {/* Allocation controls */}
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-4">
        <p className="text-xs font-mono text-white/40 mb-2">Allocate memory:</p>
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={allocType}
            onChange={(e) => setAllocType(e.target.value as MemoryBlock["type"])}
            className="px-2 py-1.5 text-xs font-mono rounded bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none"
          >
            <option value="array">Array</option>
            <option value="linked_list">Linked List Node</option>
            <option value="variable">Variable</option>
            <option value="struct">Struct</option>
          </select>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-white/30">Size:</span>
            <input
              type="number"
              min={1}
              max={gridSize}
              value={allocSize}
              onChange={(e) => setAllocSize(Math.max(1, Math.min(gridSize, parseInt(e.target.value) || 1)))}
              className="w-14 px-2 py-1.5 text-xs font-mono rounded bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none"
            />
          </div>

          <input
            type="text"
            value={allocLabel}
            onChange={(e) => setAllocLabel(e.target.value)}
            placeholder="Label"
            className="w-24 px-2 py-1.5 text-xs font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/15 focus:border-primary/50 focus:outline-none"
          />

          <button
            onClick={allocate}
            disabled={findFreeSlot(allocSize) === null}
            className="px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-30 transition-colors"
          >
            malloc()
          </button>

          <button
            onClick={freeAll}
            className="px-3 py-1.5 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Free All
          </button>
        </div>
        <p className="text-[10px] text-white/20 font-mono mt-1">
          {typeSizes[allocType]} — {allocSize} byte(s) — First-fit allocation
        </p>
      </div>

      {/* Memory grid */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-white/40">Virtual Memory (0x{BASE_ADDRESS.toString(16)} – 0x{(BASE_ADDRESS + gridSize - 1).toString(16)}):</span>
        </div>
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(16, minmax(0, 1fr))` }}>
          {cellMap.map((cell, i) => {
            const isHovered = cell.block && hoveredBlock === cell.block.id;
            const isSelected = selectedCell === i;
            const addr = (BASE_ADDRESS + i).toString(16).toUpperCase();

            return (
              <motion.div
                key={i}
                onClick={() => setSelectedCell(isSelected ? null : i)}
                onMouseEnter={() => cell.block && setHoveredBlock(cell.block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  scale: isHovered ? 1.1 : isSelected ? 1.15 : 1,
                }}
                className={`aspect-square rounded-sm cursor-pointer transition-colors relative group ${
                  cell.state === "allocated"
                    ? isHovered
                      ? "shadow-lg"
                      : ""
                    : "bg-white/[0.03] hover:bg-white/[0.06]"
                } ${isSelected ? "ring-1 ring-white/60" : ""}`}
                style={
                  cell.state === "allocated" && cell.block
                    ? {
                        backgroundColor: cell.block.color + (isHovered ? "50" : "25"),
                        borderColor: cell.block.color + "40",
                        border: "1px solid",
                      }
                    : undefined
                }
              >
                {/* Address tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="px-1.5 py-0.5 rounded bg-black/90 text-[8px] font-mono text-white whitespace-nowrap">
                    0x{addr}
                    {cell.block && ` | ${cell.block.label}`}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Row addresses */}
        <div className="flex justify-between mt-1">
          {[0, 16, 32, 48].filter(r => r < gridSize).map((row) => (
            <span key={row} className="text-[8px] font-mono text-white/15">
              0x{(BASE_ADDRESS + row).toString(16)}
            </span>
          ))}
        </div>
      </div>

      {/* Address calculator */}
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-4">
        <button
          onClick={() => setShowAddressCalc(!showAddressCalc)}
          className="flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white/60 transition-colors w-full"
        >
          <span>{showAddressCalc ? "▾" : "▸"}</span>
          Address Lookup
        </button>
        <AnimatePresence>
          {showAddressCalc && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono text-white/30">0x</span>
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder={BASE_ADDRESS.toString(16)}
                  className="w-20 px-2 py-1 text-xs font-mono rounded bg-white/5 border border-white/10 text-white placeholder-white/15 focus:border-primary/50 focus:outline-none"
                />
                {calcAddress && (
                  <span className="text-xs font-mono text-primary">
                    → offset {calcAddress.offset} →{" "}
                    {calcAddress.cell.block ? (
                      <span style={{ color: calcAddress.cell.block.color }}>
                        {calcAddress.cell.block.label}
                      </span>
                    ) : (
                      <span className="text-white/20">free</span>
                    )}
                  </span>
                )}
                {addressInput && !calcAddress && (
                  <span className="text-xs font-mono text-red-400">Out of range</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Allocated blocks list */}
      {blocks.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-mono text-white/40 mb-2 block">Allocations:</span>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {blocks.map((block) => (
              <motion.div
                key={block.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
                className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-mono transition-colors ${
                  hoveredBlock === block.id ? "bg-white/[0.06]" : "bg-white/[0.02]"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: block.color + "60" }}
                />
                <span className="text-white/60">{block.label}</span>
                <span className="text-white/20">
                  [{block.type}] {block.size}B @ 0x{(BASE_ADDRESS + block.startIdx).toString(16)}
                </span>
                <button
                  onClick={() => freeBlock(block.id)}
                  className="ml-auto text-red-400/50 hover:text-red-400 transition-colors"
                >
                  free()
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Selected cell detail */}
      <AnimatePresence>
        {selectedCell !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4 font-mono text-xs"
          >
            <p className="text-primary mb-1">
              Cell {selectedCell} — Address: 0x{(BASE_ADDRESS + selectedCell).toString(16).toUpperCase()}
            </p>
            <p className="text-white/40">
              Row: {Math.floor(selectedCell / 16)} | Col: {selectedCell % 16} |{" "}
              {cellMap[selectedCell].block
                ? `Belongs to: ${cellMap[selectedCell].block!.label} (${cellMap[selectedCell].block!.type})`
                : "Status: FREE"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage bar */}
      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500/40 to-emerald-500/40"
          animate={{ width: `${((usedCells / gridSize) * 100)}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] font-mono text-white/20">0%</span>
        <span className="text-[10px] font-mono text-white/30">{100 - freePercent}% used</span>
        <span className="text-[10px] font-mono text-white/20">100%</span>
      </div>

    </div>
  );
}
