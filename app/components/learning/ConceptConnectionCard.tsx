"use client";

import { motion } from "framer-motion";
import { Lightbulb, Building2 } from "lucide-react";

/**
 * Maps lesson/course topics to real-world company connections.
 * Shows "Why this matters" context before a lesson.
 */

interface ConceptConnectionProps {
  courseTitle: string;
  lessonTitle: string;
}

interface Connection {
  hook: string;
  companies: string[];
  interviewTip: string;
}

const connectionMap: Record<string, Connection> = {
  // Python Foundations
  variables: {
    hook: "Every program you'll ever write starts with storing and naming data.",
    companies: ["All companies"],
    interviewTip:
      "Interviewers expect clean variable naming — it shows code maturity.",
  },
  "data types": {
    hook: "Knowing when to use int vs string vs list is the difference between clean code and bugs.",
    companies: ["Google", "Meta"],
    interviewTip:
      "Type errors account for ~20% of coding interview failures.",
  },
  loops: {
    hook: "Loops let you process millions of records — how Netflix recommends shows, how Spotify builds playlists.",
    companies: ["Netflix", "Spotify", "Amazon"],
    interviewTip:
      "90%+ of interview problems need at least one loop. Master this.",
  },
  functions: {
    hook: "Functions are how real teams build software — each person writes a piece, and the pieces connect.",
    companies: ["All companies"],
    interviewTip:
      "Interviewers want to see you break problems into functions — not one giant block.",
  },
  "list comprehension": {
    hook: "List comprehensions make Python code 3-5x more concise. It's what separates Python beginners from competent developers.",
    companies: ["Google", "Dropbox"],
    interviewTip:
      "Using list comprehension shows Pythonic thinking — interviewers love it.",
  },
  dictionaries: {
    hook: "Dictionaries power 80% of real-world data processing — APIs, databases, caches all use key-value pairs.",
    companies: ["Amazon", "Google", "Microsoft"],
    interviewTip:
      "Hash maps (dicts) appear in 60%+ of coding interviews at top companies.",
  },
  strings: {
    hook: "Text processing is everywhere — search engines, chatbots, document analysis all manipulate strings.",
    companies: ["Google", "Microsoft"],
    interviewTip:
      "String manipulation questions are among the most common 'warm-up' problems.",
  },

  // Data Structures
  arrays: {
    hook: "Arrays are the #1 data structure in interviews. Master this, and you solve 40% of all problems.",
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    interviewTip:
      "Know: two-pointer, sliding window, prefix sum — these cover most array questions.",
  },
  "linked list": {
    hook: "Linked lists teach pointer manipulation — the foundation for trees, graphs, and OS internals.",
    companies: ["Microsoft", "Amazon"],
    interviewTip:
      "Common patterns: fast/slow pointer, reverse, merge. Practice these.",
  },
  stacks: {
    hook: "Stacks power undo/redo, expression parsing, and browser back buttons — simple but everywhere.",
    companies: ["Amazon", "Bloomberg"],
    interviewTip:
      "Monotonic stack problems are a favorite at Amazon and Google.",
  },
  queues: {
    hook: "Queues handle task scheduling, message systems (Kafka, RabbitMQ), and BFS traversal.",
    companies: ["Amazon", "Microsoft"],
    interviewTip:
      "BFS uses a queue — know this cold for any graph or tree level-order question.",
  },
  trees: {
    hook: "Trees structure file systems, HTML/DOM, and databases. They're how computers organize everything.",
    companies: ["Google", "Amazon", "Meta"],
    interviewTip:
      "Tree problems appear in 30%+ of interviews. Know DFS, BFS, and recursion.",
  },
  graphs: {
    hook: "Social networks, maps, recommendation engines — graphs model relationships between anything.",
    companies: ["Google", "Meta", "Uber", "LinkedIn"],
    interviewTip:
      "BFS for shortest path, DFS for exploring, topological sort for dependencies.",
  },
  "hash tables": {
    hook: "Hash tables make lookups instant. Redis, database indexes, and browser caches all use them.",
    companies: ["Google", "Amazon", "Meta"],
    interviewTip:
      "When an O(n²) brute force needs optimizing, a hash table usually gets you to O(n).",
  },
  heaps: {
    hook: "Heaps find the best/worst item instantly — priority queues, scheduling, median finding.",
    companies: ["Google", "Amazon"],
    interviewTip:
      "Top-K problems (top K frequent, Kth largest) almost always use heaps.",
  },

  // Patterns
  "two pointers": {
    hook: "Two pointers eliminate nested loops — turning O(n²) into O(n). Used constantly in sorted data.",
    companies: ["Google", "Meta", "Amazon"],
    interviewTip:
      "Start/end pointers for sorted arrays, fast/slow for cycles.",
  },
  "sliding window": {
    hook: "Sliding window processes subarrays efficiently — network throughput, stock prices, substring search.",
    companies: ["Amazon", "Microsoft", "Google"],
    interviewTip:
      "Variable-width window: expand right, shrink left. Fixed-width: just slide.",
  },
  "dynamic programming": {
    hook: "DP solves optimization problems by remembering past work — route planning, text diffing, game theory.",
    companies: ["Google", "Amazon", "Goldman Sachs"],
    interviewTip:
      "Start with recursion, add memoization, then try bottom-up tabulation.",
  },
  recursion: {
    hook: "Recursion teaches you to think in smaller sub-problems — the key insight for most complex algorithms.",
    companies: ["All companies"],
    interviewTip:
      "Base case + recursive case. Trust the recursion — don't trace every call.",
  },
  backtracking: {
    hook: "Backtracking solves puzzles (Sudoku), generates combinations, and powers constraint solvers.",
    companies: ["Google", "Amazon"],
    interviewTip:
      "Template: choose → explore → un-choose. Know permutations and subsets.",
  },
  sorting: {
    hook: "Sorting is the preprocessing step for countless algorithms — binary search, merge, grouping.",
    companies: ["All companies"],
    interviewTip:
      "Know merge sort (O(n log n) stable) and quick sort (in-place). Know trade-offs.",
  },
};

function findConnection(
  courseTitle: string,
  lessonTitle: string
): Connection | null {
  const combined = `${courseTitle} ${lessonTitle}`.toLowerCase();

  for (const [keyword, connection] of Object.entries(connectionMap)) {
    if (combined.includes(keyword.toLowerCase())) {
      return connection;
    }
  }

  return null;
}

export default function ConceptConnectionCard({
  courseTitle,
  lessonTitle,
}: ConceptConnectionProps) {
  const connection = findConnection(courseTitle, lessonTitle);

  if (!connection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
      className="mb-6 p-4 sm:p-5 rounded-xl border border-primary/20 bg-primary/5"
    >
      <div className="flex items-start gap-3">
        <Lightbulb size={20} className="text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary mb-1">
            Why This Matters
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            {connection.hook}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Building2 size={13} className="text-white/30" />
            {connection.companies.map((company) => (
              <span
                key={company}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.06] text-white/40 uppercase tracking-wider"
              >
                {company}
              </span>
            ))}
          </div>

          <p className="mt-2 text-xs text-gold-primary/70 italic">
            💡 {connection.interviewTip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
