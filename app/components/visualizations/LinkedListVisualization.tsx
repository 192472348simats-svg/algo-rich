"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LinkedListNode {
  value: number | string;
  next: number | null;
}

interface Pointer {
  name: string;
  nodeIndex: number;
  color: string;
}

interface LinkedListVisualizationProps {
  nodes: LinkedListNode[];
  pointers?: Pointer[];
  highlightedNodes?: number[];
  operation?: "traverse" | "insert" | "delete" | "reverse" | "cycle";
  mode: "explanation" | "interactive";
  className?: string;
}

const NODE_RADIUS = 24;
const NODE_GAP = 80;
const ARROW_LENGTH = 32;

export default function LinkedListVisualization({
  nodes,
  pointers = [],
  highlightedNodes = [],
  operation,
  mode,
  className = "",
}: LinkedListVisualizationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatingNode, setAnimatingNode] = useState<number | null>(null);

  const svgWidth = nodes.length * (NODE_RADIUS * 2 + NODE_GAP) + 60;
  const svgHeight = 160;

  const getNodeX = (index: number) => 40 + index * (NODE_RADIUS * 2 + NODE_GAP);
  const nodeY = 80;

  const isHighlighted = useCallback(
    (index: number) => highlightedNodes.includes(index),
    [highlightedNodes]
  );

  const getPointerForNode = useCallback(
    (index: number) => pointers.filter((p) => p.nodeIndex === index),
    [pointers]
  );

  return (
    <div className={`card-shiny p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h3 className="font-bold text-foreground">
            Linked List{operation ? ` — ${operation}` : ""}
          </h3>
          <p className="text-xs text-muted-foreground">
            {nodes.length} nodes
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="min-w-full"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill="hsl(var(--foreground))"
                opacity="0.5"
              />
            </marker>
            <marker
              id="arrowheadHighlight"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--primary))" />
            </marker>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Head label */}
          <text
            x={getNodeX(0)}
            y={30}
            textAnchor="middle"
            fontSize="11"
            fill="hsl(var(--primary))"
            fontWeight="bold"
          >
            HEAD
          </text>
          <line
            x1={getNodeX(0)}
            y1={35}
            x2={getNodeX(0)}
            y2={nodeY - NODE_RADIUS - 4}
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />

          {/* Arrows between nodes */}
          {nodes.map((node, index) => {
            if (node.next === null) return null;
            const nextIndex = node.next;
            if (nextIndex >= nodes.length) return null;

            const x1 = getNodeX(index) + NODE_RADIUS;
            const x2 = getNodeX(nextIndex) - NODE_RADIUS;
            const highlighted =
              isHighlighted(index) && isHighlighted(nextIndex);

            return (
              <motion.line
                key={`arrow-${index}`}
                x1={x1}
                y1={nodeY}
                x2={x2}
                y2={nodeY}
                stroke={
                  highlighted ? "hsl(var(--primary))" : "hsl(var(--foreground))"
                }
                strokeWidth={highlighted ? 2 : 1.5}
                opacity={highlighted ? 1 : 0.4}
                markerEnd={
                  highlighted
                    ? "url(#arrowheadHighlight)"
                    : "url(#arrowhead)"
                }
                animate={{
                  opacity: highlighted ? 1 : 0.4,
                  strokeWidth: highlighted ? 2 : 1.5,
                }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, index) => {
            const x = getNodeX(index);
            const highlighted = isHighlighted(index);
            const nodePointers = getPointerForNode(index);

            return (
              <g key={`node-${index}`}>
                {/* Node circle */}
                <motion.circle
                  cx={x}
                  cy={nodeY}
                  r={NODE_RADIUS}
                  fill={
                    highlighted
                      ? "hsl(var(--primary))"
                      : "hsl(228 40% 20%)"
                  }
                  stroke={
                    highlighted
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))"
                  }
                  strokeWidth={highlighted ? 2 : 1}
                  filter={highlighted ? "url(#nodeGlow)" : ""}
                  animate={{
                    scale: highlighted ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Value */}
                <text
                  x={x}
                  y={nodeY + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="bold"
                  fill={
                    highlighted ? "white" : "hsl(var(--foreground))"
                  }
                >
                  {node.value}
                </text>

                {/* Pointer labels */}
                {nodePointers.map((ptr, i) => (
                  <g key={ptr.name}>
                    <text
                      x={x}
                      y={nodeY + NODE_RADIUS + 18 + i * 18}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill={ptr.color}
                    >
                      {ptr.name}
                    </text>
                  </g>
                ))}

                {/* Null marker for last node */}
                {node.next === null && (
                  <g>
                    <line
                      x1={x + NODE_RADIUS + 10}
                      y1={nodeY - 8}
                      x2={x + NODE_RADIUS + 10}
                      y2={nodeY + 8}
                      stroke="hsl(var(--foreground))"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                    <text
                      x={x + NODE_RADIUS + 24}
                      y={nodeY + 1}
                      dominantBaseline="central"
                      fontSize="10"
                      fill="hsl(var(--foreground))"
                      opacity="0.4"
                    >
                      null
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
