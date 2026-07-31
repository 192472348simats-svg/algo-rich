// lib/sessions/graphs.ts
import type {
  SessionDefinition,
  HookConfig,
  WatchConfig,
  PredictConfig,
  LearnConfig,
  GuidedBuildConfig,
  CodeConfig,
  ReflectConfig,
  SummaryConfig,
} from "../sessionDefinitions";

export const sessions: SessionDefinition[] = [

// ──────────────────────────────────────────────────────
// Session 1 — Graph Fundamentals: BFS & DFS
// ──────────────────────────────────────────────────────
{
  id: "session-graphs-intro",
  slug: "graph-fundamentals",
  title: "Graph Fundamentals: BFS & DFS",
  topic: "graphs",
  description:
    "Learn how graphs model real-world networks and master the two core traversal algorithms that power 80% of graph problems.",
  estimatedMinutes: 30,
  xpTotal: 150,
  nextSessionSlug: "graph-advanced",

  stages: [
    /* ── 1. HOOK ── */
    {
      id: "graphs-hook",
      type: "hook",
      config: {
        headline:
          "Google Maps, LinkedIn, Facebook — all built on one data structure.\nIn 30 minutes, you'll understand how they work.",
        subtext:
          "Graphs are everywhere: social networks, GPS routing, dependency managers, recommendation engines. Master BFS and DFS and you unlock them all.",
        backgroundEmoji: "🗺️",
      } satisfies HookConfig,
    },

    /* ── 2. WATCH ── */
    {
      id: "graphs-watch",
      type: "watch",
      config: {
        visualizerType: "graph",
        narration:
          "A graph is a set of nodes (vertices) connected by edges. We'll build one and traverse it two ways: BFS explores level by level (like ripples in water), DFS dives deep before backtracking.",
        autoPlaySteps: [
          {
            action: "insert",
            value: "A",
            narration: "Node A — our starting point (source).",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: "B",
            narration: "Add B, connected to A.",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: "C",
            narration: "Add C, also connected to A.",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: "D",
            narration: "Add D, connected to B.",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: "E",
            narration: "Add E, connected to C and D.",
            delayAfterMs: 1800,
          },
          {
            action: "traverse",
            value: "BFS",
            narration: "BFS from A: visit A → enqueue B,C → visit B,C → enqueue D,E → visit D,E. Level by level.",
            delayAfterMs: 2500,
          },
          {
            action: "traverse",
            value: "DFS",
            narration: "DFS from A: visit A → go deep to B → D → backtrack → C → E. Depth first.",
            delayAfterMs: 2500,
          },
        ],
      } satisfies WatchConfig,
    },

    /* ── 3. PREDICT ── */
    {
      id: "graphs-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "graph-pred-1",
            question:
              "You need to find the SHORTEST path between two nodes in an unweighted graph. Which algorithm do you use?",
            answerType: "multiple-choice",
            options: ["DFS", "BFS", "Both work equally", "Neither"],
            correctAnswer: "BFS",
            feedbackCorrect:
              "BFS always finds the shortest path in unweighted graphs because it explores level by level — it reaches a node via the fewest edges possible.",
            feedbackWrong:
              "BFS is the right choice. It explores all nodes at distance 1, then distance 2, etc., guaranteeing the shortest path is found first.",
            xp: 10,
          },
          {
            id: "graph-pred-2",
            question:
              "An adjacency list for graph with edges A-B, A-C, B-D would look like: adj = {'A': ['B','C'], 'B': ['A','D'], ...}. How many entries does 'B' have?",
            answerType: "multiple-choice",
            options: ["1", "2", "3", "4"],
            correctAnswer: "2",
            feedbackCorrect:
              "B connects to A (back edge) and D (forward edge) → 2 neighbors.",
            feedbackWrong:
              "B connects to A (the edge A-B) and D (the edge B-D). For an undirected graph, both directions are stored → 2 entries.",
            xp: 10,
          },
          {
            id: "graph-pred-3",
            question:
              "DFS uses a _____ (explicitly or via call stack), BFS uses a _____.",
            answerType: "multiple-choice",
            options: [
              "Queue, Stack",
              "Stack, Queue",
              "Queue, Queue",
              "Stack, Stack",
            ],
            correctAnswer: "Stack, Queue",
            feedbackCorrect:
              "DFS uses a stack (LIFO) — recursion IS a call stack. BFS uses a queue (FIFO) to process level by level.",
            feedbackWrong:
              "DFS goes deep first → stack (LIFO). BFS explores breadth-first → queue (FIFO). This is a classic interview question.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },

    /* ── 4. LEARN ── */
    {
      id: "graphs-learn",
      type: "learn",
      config: {
        title: "Graphs: Representation & Traversal",
        keyRule: {
          emoji: "🔑",
          text: "BFS = shortest path (unweighted). DFS = cycle detection, topological sort, connected components.",
        },
        content: `## Graph Representation

**Adjacency List** (most common — use this by default):
\`\`\`python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'E'],
    'D': ['B', 'E'],
    'E': ['C', 'D']
}
\`\`\`
Space: O(V + E). Efficient for sparse graphs.

**Adjacency Matrix**: O(V²) space. Use only when checking edge existence must be O(1).

## BFS — Breadth-First Search

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result
\`\`\`

## DFS — Depth-First Search

\`\`\`python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    result = [start]
    for neighbor in graph[start]:
        if neighbor not in visited:
            result += dfs(graph, neighbor, visited)
    return result
\`\`\`

## When to Use Which?

| Goal | Algorithm |
|------|-----------|
| Shortest path (unweighted) | BFS |
| Detect cycle | DFS |
| Connected components | Either |
| Topological sort | DFS |
| Level-order processing | BFS |
`,
        codeSnippet: {
          language: "python",
          code: `# Iterative DFS (avoids Python recursion limit)
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            result.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)
    return result`,
          caption: "Iterative DFS — safer for large graphs",
        },
      } satisfies LearnConfig,
    },

    /* ── 5. GUIDED BUILD ── */
    {
      id: "graphs-guided-build",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Create an empty adjacency list dictionary.",
            hint: "graph = {}",
            celebration: false,
          },
          {
            instruction: "Add edges: 1-2, 1-3, 2-4, 3-4, 4-5",
            hint: "For each edge (u,v), append v to graph[u] and u to graph[v].",
            celebration: false,
          },
          {
            instruction: "Initialize BFS: visited = {1}, queue = deque([1])",
            hint: "Import deque from collections. Mark the start node as visited immediately.",
            celebration: false,
          },
          {
            instruction: "Run BFS loop — dequeue, process, enqueue unvisited neighbors.",
            hint: "node = queue.popleft(); for each neighbor not in visited: add to visited and queue.",
            celebration: true,
            expectedOutput: "BFS order: 1 → 2 → 3 → 4 → 5",
          },
        ],
        completionMessage:
          "You built BFS from scratch! This same pattern solves shortest path, level order traversal, and flood fill.",
      } satisfies GuidedBuildConfig,
    },

    /* ── 6. CODE ── */
    {
      id: "graphs-code",
      type: "code",
      config: {
        problemSlug: "number-of-islands",
        contextHint:
          "Treat each cell as a node. Connected land cells are edges. Use BFS or DFS to explore each island.",
        hintAfterMinutes: 5,
        approachAfterMinutes: 10,
      } satisfies CodeConfig,
    },

    /* ── 7. REFLECT ── */
    {
      id: "graphs-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What data structure does BFS use internally?",
            options: ["Stack", "Queue", "Heap", "Tree"],
            correctIndex: 1,
            explanation:
              "BFS uses a queue (FIFO). This ensures nodes are processed level by level — closest nodes first.",
          },
          {
            question: "Which representation is generally preferred for sparse graphs?",
            options: [
              "Adjacency Matrix",
              "Adjacency List",
              "Edge List",
              "Incidence Matrix",
            ],
            correctIndex: 1,
            explanation:
              "Adjacency List uses O(V + E) space vs O(V²) for matrix. Sparse graphs have E << V², so the list is far more efficient.",
          },
          {
            question: "Time complexity of BFS/DFS on a graph with V vertices and E edges?",
            options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
            correctIndex: 2,
            explanation:
              "Every vertex is visited once (O(V)) and every edge is examined once (O(E)), giving O(V + E) total.",
          },
        ],
      } satisfies ReflectConfig,
    },

    /* ── 8. SUMMARY ── */
    {
      id: "graphs-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// Session 2 — Advanced Graphs: Cycle Detection & Dijkstra
// ──────────────────────────────────────────────────────
{
  id: "session-graphs-advanced",
  slug: "graph-advanced",
  title: "Advanced Graphs: Cycles & Shortest Paths",
  topic: "graphs",
  description:
    "Detect cycles in directed and undirected graphs, understand Dijkstra's algorithm, and tackle the graph problems that appear in every FAANG interview.",
  estimatedMinutes: 35,
  xpTotal: 180,
  prerequisiteSessionSlug: "graph-fundamentals",
  nextSessionSlug: "dynamic-programming-intro",

  stages: [
    /* ── 1. HOOK ── */
    {
      id: "graphs-adv-hook",
      type: "hook",
      config: {
        headline:
          "Your GPS finds the fastest route in milliseconds.\nDijkstra's algorithm does the heavy lifting.",
        subtext:
          "You know BFS and DFS. Now learn cycle detection and weighted shortest paths — the two graph techniques every senior engineer must know.",
        backgroundEmoji: "🛣️",
      } satisfies HookConfig,
    },

    /* ── 2. WATCH ── */
    {
      id: "graphs-adv-watch",
      type: "watch",
      config: {
        visualizerType: "graph",
        narration:
          "Cycle detection uses DFS with a 'recursion stack' to find back-edges in directed graphs. Dijkstra's uses a min-heap to greedily pick the shortest-so-far unvisited node.",
        autoPlaySteps: [
          {
            action: "insert",
            value: "0",
            narration: "Node 0 — source for Dijkstra.",
            delayAfterMs: 1600,
          },
          {
            action: "insert",
            value: "1",
            narration: "Node 1, edge weight 4 from 0.",
            delayAfterMs: 1600,
          },
          {
            action: "insert",
            value: "2",
            narration: "Node 2, edge weight 1 from 0, weight 2 from 1.",
            delayAfterMs: 1600,
          },
          {
            action: "traverse",
            value: "Dijkstra",
            narration: "Heap: [(0,0)]. Pop 0 → relax neighbors: dist[1]=4, dist[2]=1. Pop 2 (dist=1) → relax: dist[1]=min(4,3)=3. Pop 1 → done.",
            delayAfterMs: 3000,
          },
          {
            action: "traverse",
            value: "CycleDetect",
            narration: "DFS cycle detection: track rec_stack. If we visit a node already in rec_stack → CYCLE found.",
            delayAfterMs: 2500,
          },
        ],
      } satisfies WatchConfig,
    },

    /* ── 3. PREDICT ── */
    {
      id: "graphs-adv-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "graph-adv-pred-1",
            question:
              "Dijkstra's algorithm fails when edges have _____ weights.",
            answerType: "multiple-choice",
            options: [
              "Large positive weights",
              "Negative weights",
              "Decimal/float weights",
              "Equal weights",
            ],
            correctAnswer: "Negative weights",
            feedbackCorrect:
              "Dijkstra's greedy assumption breaks with negative edges — a 'longer' path could be shorter due to a negative edge encountered later. Use Bellman-Ford for negative weights.",
            feedbackWrong:
              "Negative weights break Dijkstra's greedy assumption. Once a node is marked 'settled', it won't be revisited — but a negative edge could have made a different path shorter.",
            xp: 10,
          },
          {
            id: "graph-adv-pred-2",
            question:
              "To detect a cycle in an UNDIRECTED graph using DFS, you check if a neighbor is visited AND _____.",
            answerType: "multiple-choice",
            options: [
              "Is not the parent node",
              "Has a smaller index",
              "Was visited in the same DFS call",
              "Is a leaf node",
            ],
            correctAnswer: "Is not the parent node",
            feedbackCorrect:
              "In an undirected graph, every edge appears in both directions. The parent of the current node will always be 'visited' — we must skip it to avoid false cycle detection.",
            feedbackWrong:
              "In undirected graphs, edge u-v is stored as both u→v and v→u. When DFS is at v coming from u, u appears as a visited neighbor — but that's not a cycle. We skip the parent.",
            xp: 15,
          },
          {
            id: "graph-adv-pred-3",
            question:
              "What is Dijkstra's time complexity using a binary min-heap (heapq)?",
            answerType: "multiple-choice",
            options: [
              "O(V²)",
              "O(E log V)",
              "O(V log E)",
              "O(E + V)",
            ],
            correctAnswer: "O(E log V)",
            feedbackCorrect:
              "Each edge relaxation may push to the heap (O(log V)), and we do this for all E edges → O(E log V).",
            feedbackWrong:
              "With a binary heap: each edge triggers at most one heap push O(log V), and there are E edges → O(E log V). The naive version without heap is O(V²).",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },

    /* ── 4. LEARN ── */
    {
      id: "graphs-adv-learn",
      type: "learn",
      config: {
        title: "Cycle Detection & Dijkstra's Algorithm",
        keyRule: {
          emoji: "⚠️",
          text: "Directed cycle: DFS + recursion stack. Undirected cycle: DFS + parent tracking. Dijkstra: greedy min-heap.",
        },
        content: `## Cycle Detection in Directed Graphs

\`\`\`python
def has_cycle_directed(graph, n):
    visited = [False] * n
    rec_stack = [False] * n  # nodes in current DFS path

    def dfs(node):
        visited[node] = True
        rec_stack[node] = True
        for neighbor in graph.get(node, []):
            if not visited[neighbor]:
                if dfs(neighbor):
                    return True
            elif rec_stack[neighbor]:
                return True  # back edge → cycle!
        rec_stack[node] = False
        return False

    return any(dfs(i) for i in range(n) if not visited[i])
\`\`\`

## Dijkstra's Algorithm

\`\`\`python
import heapq

def dijkstra(graph, src, n):
    # graph[u] = [(weight, v), ...]
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]  # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue  # stale entry
        for w, v in graph.get(u, []):
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))

    return dist
\`\`\`

## Interview Pattern Recognition

| Problem says... | Think... |
|----------------|---------|
| "Shortest path, unweighted" | BFS |
| "Shortest path, weighted, non-negative" | Dijkstra |
| "Shortest path, negative weights" | Bellman-Ford |
| "Detect cycle" | DFS + tracking |
| "All-pairs shortest path" | Floyd-Warshall |
`,
        codeSnippet: {
          language: "python",
          code: `# Cycle detection in undirected graph
def has_cycle_undirected(graph, n):
    visited = [False] * n

    def dfs(node, parent):
        visited[node] = True
        for neighbor in graph.get(node, []):
            if not visited[neighbor]:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                return True  # visited non-parent → cycle
        return False

    return any(dfs(i, -1) for i in range(n) if not visited[i])`,
          caption: "Cycle detection in undirected graphs — skip the parent edge",
        },
      } satisfies LearnConfig,
    },

    /* ── 5. GUIDED BUILD ── */
    {
      id: "graphs-adv-guided-build",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Set up Dijkstra: dist[] = inf for all nodes, dist[src] = 0, heap = [(0, src)]",
            hint: "import heapq; dist = [float('inf')] * n; dist[src] = 0",
            celebration: false,
          },
          {
            instruction: "Pop from heap: (d, u). If d > dist[u], skip (stale entry).",
            hint: "The 'if d > dist[u]: continue' check is crucial for correctness with lazy deletion.",
            celebration: false,
          },
          {
            instruction: "For each neighbor v of u with weight w: if dist[u]+w < dist[v], update and push.",
            hint: "This is the 'relaxation' step — the heart of Dijkstra.",
            celebration: true,
            expectedOutput: "Shortest distances from source computed correctly.",
          },
        ],
        completionMessage:
          "You implemented Dijkstra! This exact pattern solves Network Delay Time, Cheapest Flights, and Path with Minimum Effort.",
      } satisfies GuidedBuildConfig,
    },

    /* ── 6. CODE ── */
    {
      id: "graphs-adv-code",
      type: "code",
      config: {
        problemSlug: "course-schedule",
        contextHint:
          "Model prerequisites as a directed graph. Use DFS with a recursion stack to detect cycles — a cycle means it's impossible to finish all courses.",
        hintAfterMinutes: 5,
        approachAfterMinutes: 12,
      } satisfies CodeConfig,
    },

    /* ── 7. REFLECT ── */
    {
      id: "graphs-adv-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why does Dijkstra fail with negative edge weights?",
            options: [
              "It can't handle more than V nodes",
              "Its greedy assumption breaks — a later negative edge could create a shorter path",
              "It uses too much memory",
              "It doesn't track visited nodes",
            ],
            correctIndex: 1,
            explanation:
              "Once Dijkstra marks a node as 'settled' (popped from heap), it won't revisit it. A negative edge discovered later could have produced a shorter path, but Dijkstra misses this.",
          },
          {
            question: "In directed cycle detection, what does the recursion stack track?",
            options: [
              "All visited nodes ever",
              "Nodes in the current active DFS path",
              "Nodes with no outgoing edges",
              "The shortest path so far",
            ],
            correctIndex: 1,
            explanation:
              "The rec_stack contains nodes currently on the DFS call stack. A back edge (to a node in rec_stack) means there's a cycle in the current path.",
          },
          {
            question: "What is topological sort used for?",
            options: [
              "Finding shortest paths",
              "Ordering tasks with dependencies (DAGs only)",
              "Detecting negative cycles",
              "Balancing a binary tree",
            ],
            correctIndex: 1,
            explanation:
              "Topological sort orders nodes of a DAG so all edges point forward. It's used for build systems, course scheduling, and dependency resolution.",
          },
        ],
      } satisfies ReflectConfig,
    },

    /* ── 8. SUMMARY ── */
    {
      id: "graphs-adv-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
},

];
