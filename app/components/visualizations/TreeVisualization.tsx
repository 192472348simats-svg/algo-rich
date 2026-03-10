"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

interface TreeNode {
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
}

interface TreeVisualizationProps {
  root: TreeNode;
  highlightPath?: number[];
  currentNode?: number;
  operation?: "inorder" | "preorder" | "postorder" | "bfs" | "search" | "insert";
  mode: "explanation" | "interactive";
  className?: string;
}

interface FlatNode {
  value: number;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
  depth: number;
}

function flattenTree(
  node: TreeNode | null | undefined,
  x: number,
  y: number,
  depth: number,
  spread: number
): FlatNode[] {
  if (!node) return [];

  const leftNodes = flattenTree(node.left, x - spread, y + 70, depth + 1, spread / 2);
  const rightNodes = flattenTree(node.right, x + spread, y + 70, depth + 1, spread / 2);

  return [
    { value: node.value, x, y, depth },
    ...leftNodes.map((n) => ({
      ...n,
      parentX: n.parentX ?? x,
      parentY: n.parentY ?? y,
    })),
    ...rightNodes.map((n) => ({
      ...n,
      parentX: n.parentX ?? x,
      parentY: n.parentY ?? y,
    })),
  ];
}

export default function TreeVisualization({
  root,
  highlightPath = [],
  currentNode,
  operation,
  mode,
  className = "",
}: TreeVisualizationProps) {
  const flatNodes = useMemo(
    () => flattenTree(root, 400, 40, 0, 160),
    [root]
  );

  // Fix parent references
  const nodesWithEdges = useMemo(() => {
    function traverse(
      node: TreeNode | null | undefined,
      x: number,
      y: number,
      spread: number,
      parentX?: number,
      parentY?: number
    ): FlatNode[] {
      if (!node) return [];
      const current: FlatNode = { value: node.value, x, y, parentX, parentY, depth: 0 };
      return [
        current,
        ...traverse(node.left, x - spread, y + 70, spread / 2, x, y),
        ...traverse(node.right, x + spread, y + 70, spread / 2, x, y),
      ];
    }
    return traverse(root, 400, 50, 160);
  }, [root]);

  const isHighlighted = useCallback(
    (value: number) => highlightPath.includes(value),
    [highlightPath]
  );

  const isCurrent = useCallback(
    (value: number) => currentNode === value,
    [currentNode]
  );

  const svgWidth = 800;
  const svgHeight = Math.max(300, nodesWithEdges.length * 25 + 100);

  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            Binary Tree{operation ? ` — ${operation}` : ""}
          </h3>
          <p className="text-xs text-muted-foreground">
            {nodesWithEdges.length} nodes
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-h-[300px]"
        >
          <defs>
            <filter id="treeNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="currentNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.7" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {nodesWithEdges.map((node, i) => {
            if (node.parentX === undefined || node.parentY === undefined) return null;

            const edgeHighlighted =
              isHighlighted(node.value) &&
              nodesWithEdges.some(
                (n) =>
                  n.x === node.parentX &&
                  n.y === node.parentY &&
                  isHighlighted(n.value)
              );

            return (
              <motion.line
                key={`edge-${i}`}
                x1={node.parentX}
                y1={node.parentY}
                x2={node.x}
                y2={node.y}
                stroke={
                  edgeHighlighted ? "hsl(var(--primary))" : "hsl(228 40% 25%)"
                }
                strokeWidth={edgeHighlighted ? 2.5 : 1.5}
                opacity={edgeHighlighted ? 1 : 0.4}
                animate={{
                  stroke: edgeHighlighted ? "hsl(var(--primary))" : "hsl(228 40% 25%)",
                  strokeWidth: edgeHighlighted ? 2.5 : 1.5,
                }}
                transition={{ duration: 0.4 }}
              />
            );
          })}

          {/* Nodes */}
          {nodesWithEdges.map((node, i) => {
            const highlighted = isHighlighted(node.value);
            const current = isCurrent(node.value);
            const radius = 22;

            return (
              <g key={`node-${i}`}>
                {/* Glow */}
                {(highlighted || current) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 6}
                    fill={
                      current ? "hsl(var(--primary))" : "hsl(var(--primary))"
                    }
                    opacity="0.15"
                  />
                )}

                {/* Circle */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={
                    current
                      ? "hsl(var(--primary))"
                      : highlighted
                      ? "hsl(var(--primary))"
                      : "hsl(228 40% 20%)"
                  }
                  stroke={
                    current
                      ? "hsl(var(--primary))"
                      : highlighted
                      ? "hsl(var(--primary))"
                      : "hsl(228 40% 25%)"
                  }
                  strokeWidth={highlighted || current ? 2 : 1}
                  filter={
                    current
                      ? "url(#currentNodeGlow)"
                      : highlighted
                      ? "url(#treeNodeGlow)"
                      : ""
                  }
                  animate={{
                    scale: current ? 1.15 : highlighted ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Value */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="13"
                  fontWeight="bold"
                  fill={
                    current || highlighted ? "white" : "hsl(var(--foreground))"
                  }
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
