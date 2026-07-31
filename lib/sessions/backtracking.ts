// lib/sessions/backtracking.ts
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
// Session — Backtracking
// ──────────────────────────────────────────────────────
{
  id: "session-backtracking-intro",
  slug: "backtracking",
  title: "Backtracking: Explore, Fail Fast, Recover",
  topic: "backtracking",
  description:
    "Learn the systematic technique for exploring all possibilities while pruning dead ends — the foundation of subsets, permutations, and N-Queens.",
  estimatedMinutes: 30,
  xpTotal: 160,
  prerequisiteSessionSlug: "dynamic-programming-intro",

  stages: [
    /* ── 1. HOOK ── */
    {
      id: "backtracking-hook",
      type: "hook",
      config: {
        headline:
          "A Sudoku solver, a chess engine, a maze pathfinder.\nAll built on one technique: backtracking.",
        subtext:
          "Backtracking is structured brute-force: explore every option, but stop early when you know a path is wrong. It's the foundation of constraint-satisfaction problems in every tech interview.",
        backgroundEmoji: "🧩",
      } satisfies HookConfig,
    },

    /* ── 2. WATCH ── */
    {
      id: "backtracking-watch",
      type: "watch",
      config: {
        visualizerType: "graph",
        narration:
          "Generating all subsets of [1,2,3] via backtracking: at each step, choose to INCLUDE or EXCLUDE the current element. Build the recursion tree — it has 2^n leaves.",
        autoPlaySteps: [
          {
            action: "insert",
            value: "[]",
            narration: "Start: empty subset at the root.",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: "[1]",
            narration: "Include 1 → recurse on remaining [2,3].",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: "[1,2]",
            narration: "Include 2 → recurse on [3].",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: "[1,2,3]",
            narration: "Include 3 → leaf node, record [1,2,3].",
            delayAfterMs: 1800,
          },
          {
            action: "traverse",
            value: "backtrack",
            narration: "Backtrack to [1,2]. Exclude 3 → record [1,2]. Backtrack to [1]. Exclude 2...",
            delayAfterMs: 2500,
          },
          {
            action: "search",
            value: "complete",
            narration: "All 8 subsets found: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3].",
            delayAfterMs: 2000,
          },
        ],
      } satisfies WatchConfig,
    },

    /* ── 3. PREDICT ── */
    {
      id: "backtracking-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "bt-pred-1",
            question:
              "How many subsets does a set of n elements have? (This is also the number of leaves in the backtracking tree.)",
            answerType: "multiple-choice",
            options: ["n!", "n²", "2ⁿ", "n log n"],
            correctAnswer: "2ⁿ",
            feedbackCorrect:
              "For each element, we make a binary choice: include or exclude. So there are 2 × 2 × ... × 2 (n times) = 2ⁿ subsets. The backtracking tree has 2ⁿ leaves.",
            feedbackWrong:
              "Each of the n elements has 2 choices (include/exclude). So total subsets = 2^n. For [1,2,3]: 2³=8 subsets.",
            xp: 10,
          },
          {
            id: "bt-pred-2",
            question:
              "How many permutations of n distinct elements are there?",
            answerType: "multiple-choice",
            options: ["2ⁿ", "n!", "n²", "n × (n-1)"],
            correctAnswer: "n!",
            feedbackCorrect:
              "For permutations: n choices for position 1, n-1 for position 2, ... 1 for position n → n! total.",
            feedbackWrong:
              "Permutations: n choices × (n-1) choices × ... × 1 choice = n! (n factorial). For [1,2,3]: 3! = 6 permutations.",
            xp: 10,
          },
          {
            id: "bt-pred-3",
            question:
              "In backtracking, 'pruning' means:",
            answerType: "multiple-choice",
            options: [
              "Removing duplicate elements before recursing",
              "Stopping exploration early when the current path cannot lead to a valid solution",
              "Sorting the input array",
              "Using memoization to avoid recomputation",
            ],
            correctAnswer: "Stopping exploration early when the current path cannot lead to a valid solution",
            feedbackCorrect:
              "Pruning cuts branches from the search tree that are guaranteed to not yield solutions. In N-Queens: if a queen threatens a position, skip it entirely — don't recurse further.",
            feedbackWrong:
              "Pruning = early termination of branches that can't lead to a valid answer. This is what makes backtracking efficient vs pure brute force — we don't explore dead ends.",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },

    /* ── 4. LEARN ── */
    {
      id: "backtracking-learn",
      type: "learn",
      config: {
        title: "The Backtracking Template",
        keyRule: {
          emoji: "🔄",
          text: "Backtracking = Choose → Explore → Unchoose. Always undo your choice after recursing.",
        },
        content: `## The Universal Backtracking Template

\`\`\`python
def backtrack(state, choices):
    if is_solution(state):
        record(state)
        return

    for choice in choices:
        if is_valid(state, choice):
            make_choice(state, choice)    # CHOOSE
            backtrack(state, next_choices)  # EXPLORE
            undo_choice(state, choice)    # UNCHOOSE
\`\`\`

**The "undo" step is what makes it backtracking** — you restore state after exploring each branch.

## Subsets

\`\`\`python
def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(list(current))  # every state is a valid subset
        for i in range(start, len(nums)):
            current.append(nums[i])   # CHOOSE
            backtrack(i + 1, current) # EXPLORE
            current.pop()             # UNCHOOSE
    backtrack(0, [])
    return result
\`\`\`

## Permutations

\`\`\`python
def permutations(nums):
    result = []
    def backtrack(current, remaining):
        if not remaining:
            result.append(list(current))
            return
        for i, num in enumerate(remaining):
            current.append(num)                        # CHOOSE
            backtrack(current, remaining[:i] + remaining[i+1:])  # EXPLORE
            current.pop()                              # UNCHOOSE
    backtrack([], nums)
    return result
\`\`\`

## N-Queens (with pruning)

\`\`\`python
def solve_n_queens(n):
    result = []
    cols, diag1, diag2 = set(), set(), set()

    def backtrack(row, board):
        if row == n:
            result.append(["".join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue  # PRUNE — queen threatens this cell
            cols.add(col); diag1.add(row-col); diag2.add(row+col)
            board[row][col] = 'Q'
            backtrack(row + 1, board)
            board[row][col] = '.'
            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)

    board = [['.']*n for _ in range(n)]
    backtrack(0, board)
    return result
\`\`\`

## Complexity

| Problem | Time | Space |
|---------|------|-------|
| Subsets | O(2ⁿ × n) | O(n) |
| Permutations | O(n! × n) | O(n) |
| N-Queens | O(n!) | O(n) |
`,
        codeSnippet: {
          language: "python",
          code: `# Combination Sum — reuse elements, find all combos summing to target
def combination_sum(candidates, target):
    result = []
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break  # PRUNE (sort first)
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    candidates.sort()  # Enable pruning
    backtrack(0, [], target)
    return result`,
          caption: "Combination Sum — classic backtracking with pruning",
        },
      } satisfies LearnConfig,
    },

    /* ── 5. GUIDED BUILD ── */
    {
      id: "backtracking-guided-build",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Write the subsets function shell: result=[], define backtrack(start, current).",
            hint: "The outer function collects results; the inner recursive function builds subsets.",
            celebration: false,
          },
          {
            instruction: "Record result: append list(current) at the START of backtrack — every partial set is a valid subset.",
            hint: "Unlike permutations where we only record complete results, ALL states are valid subsets.",
            celebration: false,
          },
          {
            instruction: "Loop from start to len(nums): append nums[i], recurse with start=i+1, then pop.",
            hint: "i+1 (not i) ensures we don't reuse the same element. pop() is the UNCHOOSE step.",
            celebration: false,
          },
          {
            instruction: "Call backtrack(0, []) and return result. Verify: for [1,2,3] you get 8 subsets.",
            hint: "Expected: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]",
            celebration: true,
            expectedOutput: "8 subsets generated correctly",
          },
        ],
        completionMessage:
          "You built the subsets generator! The same Choose→Explore→Unchoose pattern solves Permutations, Combinations, N-Queens, Word Search, and Sudoku Solver.",
      } satisfies GuidedBuildConfig,
    },

    /* ── 6. CODE ── */
    {
      id: "backtracking-code",
      type: "code",
      config: {
        problemSlug: "subsets",
        contextHint:
          "Use backtrack(start, current). Record list(current) at the start. Loop i from start: append nums[i], recurse(i+1, current), pop. No base case needed beyond the loop ending.",
        hintAfterMinutes: 5,
        approachAfterMinutes: 10,
      } satisfies CodeConfig,
    },

    /* ── 7. REFLECT ── */
    {
      id: "backtracking-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why must we 'undo' (pop/remove) after each recursive call in backtracking?",
            options: [
              "To save memory",
              "To restore the state for the next sibling branch — backtracking reuses the same data structure",
              "To avoid infinite recursion",
              "Because Python lists require it",
            ],
            correctIndex: 1,
            explanation:
              "Backtracking explores one branch, records results, then backtracks (undoes the choice) to explore sibling branches. Without the undo step, choices from one branch would pollute others.",
          },
          {
            question: "What is the key difference between Subsets and Permutations backtracking?",
            options: [
              "Subsets allows duplicate elements; permutations don't",
              "Subsets uses a 'start' index to avoid revisiting elements; permutations use a 'used' set to track which elements are in the current permutation",
              "Subsets is O(n!) and permutations is O(2ⁿ)",
              "There is no difference — same code",
            ],
            correctIndex: 1,
            explanation:
              "Subsets: 'start' index ensures each element is considered only once per path. Permutations: need ALL elements exactly once, so track 'used' or pass remaining elements.",
          },
          {
            question: "Pruning in N-Queens works because:",
            options: [
              "Queens can only move horizontally",
              "If a queen threatens a cell, no valid solution can have a queen there — we skip the entire subtree",
              "We can always find a solution without pruning",
              "The board is symmetric",
            ],
            correctIndex: 1,
            explanation:
              "Constraint propagation: if placing a queen at (row, col) creates a conflict, no extension of this partial solution can be valid. We skip the entire subtree rooted at this choice.",
          },
        ],
      } satisfies ReflectConfig,
    },

    /* ── 8. SUMMARY ── */
    {
      id: "backtracking-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
},

];
