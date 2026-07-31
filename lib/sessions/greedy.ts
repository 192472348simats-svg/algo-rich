// lib/sessions/greedy.ts
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
// Session — Greedy Algorithms
// ──────────────────────────────────────────────────────
{
  id: "session-greedy-intro",
  slug: "greedy-algorithms",
  title: "Greedy Algorithms: Local Choices, Global Wins",
  topic: "greedy",
  description:
    "Learn when making the locally optimal choice at each step leads to a globally optimal solution — and when it doesn't.",
  estimatedMinutes: 28,
  xpTotal: 140,
  prerequisiteSessionSlug: "dynamic-programming-intro",

  stages: [
    /* ── 1. HOOK ── */
    {
      id: "greedy-hook",
      type: "hook",
      config: {
        headline:
          "Every time you choose the shortest checkout line at the supermarket,\nyou're running a greedy algorithm.",
        subtext:
          "Greedy algorithms make the locally best choice at every step. When provably correct, they're faster and simpler than DP. The skill is knowing WHEN greedy works.",
        backgroundEmoji: "💰",
      } satisfies HookConfig,
    },

    /* ── 2. WATCH ── */
    {
      id: "greedy-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        narration:
          "Activity Selection: given intervals, pick the maximum number of non-overlapping activities. Greedy choice: always pick the activity that ends EARLIEST.",
        autoPlaySteps: [
          {
            action: "insert",
            value: 1,
            narration: "Sort activities by end time.",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: 3,
            narration: "Activity [1,3] ends at 3 — select it. last_end = 3.",
            delayAfterMs: 1800,
          },
          {
            action: "traverse",
            value: "skip",
            narration: "Activity [2,5] starts at 2 < last_end=3 — SKIP (overlaps).",
            delayAfterMs: 1800,
          },
          {
            action: "insert",
            value: 5,
            narration: "Activity [3,6] starts at 3 >= last_end=3 — select it! last_end = 6.",
            delayAfterMs: 2000,
          },
          {
            action: "insert",
            value: 7,
            narration: "Activity [6,8] starts at 6 >= last_end=6 — select it! Maximum 3 activities.",
            delayAfterMs: 2000,
          },
        ],
      } satisfies WatchConfig,
    },

    /* ── 3. PREDICT ── */
    {
      id: "greedy-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "greedy-pred-1",
            question:
              "For making change with coins [1, 5, 10, 25] cents, the greedy approach (largest coin first) always gives the minimum coins. This works because:",
            answerType: "multiple-choice",
            options: [
              "Greedy always works for coin change",
              "These coin denominations have the 'greedy property' — each larger coin evenly divides the next",
              "The problem has no overlapping subproblems",
              "There are exactly 4 coin types",
            ],
            correctAnswer: "These coin denominations have the 'greedy property' — each larger coin evenly divides the next",
            feedbackCorrect:
              "For US coins (1,5,10,25), greedy works because of their specific structure. For arbitrary coins like [1,3,4], greedy fails — use DP instead.",
            feedbackWrong:
              "Greedy only works for coin change with specific denominations. For coins=[1,3,4] and target=6: greedy picks 4+1+1=3 coins, but optimal is 3+3=2 coins. Always verify greedy works!",
            xp: 15,
          },
          {
            id: "greedy-pred-2",
            question:
              "Jump Game: array [2,3,1,1,4]. Can you reach the last index? Greedy approach: track max_reach. What's the key insight?",
            answerType: "multiple-choice",
            options: [
              "Find the path with fewest jumps",
              "At each index i, if i > max_reach you're stuck. Otherwise update max_reach = max(max_reach, i+nums[i])",
              "Try all possible jump sequences",
              "Always jump the maximum possible distance",
            ],
            correctAnswer: "At each index i, if i > max_reach you're stuck. Otherwise update max_reach = max(max_reach, i+nums[i])",
            feedbackCorrect:
              "max_reach is the furthest index reachable so far. If you're at index i > max_reach, no previous jump could have reached you → trapped. Otherwise, greedily extend your reach.",
            feedbackWrong:
              "Track max_reach = furthest reachable index. For each i: if i > max_reach → impossible. Else max_reach = max(max_reach, i+nums[i]). If max_reach >= n-1 → reachable.",
            xp: 15,
          },
          {
            id: "greedy-pred-3",
            question:
              "Which greedy choice property must hold for greedy to give a globally optimal solution?",
            answerType: "multiple-choice",
            options: [
              "The problem must have overlapping subproblems",
              "A globally optimal solution can always be obtained by making a locally optimal (greedy) choice",
              "All possible choices must be tried",
              "The input must be sorted",
            ],
            correctAnswer: "A globally optimal solution can always be obtained by making a locally optimal (greedy) choice",
            feedbackCorrect:
              "The 'greedy choice property' guarantees that the locally optimal choice leads to a globally optimal solution. Proving this (often via exchange argument) is key to greedy algorithm design.",
            feedbackWrong:
              "The Greedy Choice Property: a globally optimal solution can be assembled from locally optimal choices. If this holds, greedy works. If not (like arbitrary coin change), use DP.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },

    /* ── 4. LEARN ── */
    {
      id: "greedy-learn",
      type: "learn",
      config: {
        title: "Greedy: When and How",
        keyRule: {
          emoji: "✅",
          text: "Greedy works when: making the locally optimal choice never forecloses the globally optimal solution. Prove it with an exchange argument.",
        },
        content: `## Greedy vs. DP

| | Greedy | Dynamic Programming |
|---|---|---|
| **Approach** | One pass, locally optimal choice | All subproblems, combine results |
| **When** | Greedy choice property holds | Optimal substructure + overlapping |
| **Speed** | Usually O(n) or O(n log n) | Usually O(n²) or O(n×W) |
| **Risk** | Fails without proof | Always correct if recurrence is right |

## Activity Selection (Classic Greedy)

Sort by end time. Always pick earliest-ending non-overlapping activity:

\`\`\`python
def activity_selection(intervals):
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = float('-inf')
    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end
    return count
\`\`\`

## Jump Game I

\`\`\`python
def can_jump(nums):
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False  # Can't reach index i
        max_reach = max(max_reach, i + jump)
    return True
\`\`\`

## Interval Scheduling Patterns

Many greedy problems involve intervals. Key strategies:

- **Maximum non-overlapping**: Sort by end time, greedily select
- **Minimum intervals to remove**: Sort by end, count overlaps
- **Meeting rooms**: Sort by start, check overlap with last end

\`\`\`python
def min_meeting_rooms(intervals):
    import heapq
    intervals.sort()
    heap = []  # min-heap of end times
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)
        else:
            heapq.heappush(heap, end)
    return len(heap)
\`\`\`
`,
        codeSnippet: {
          language: "python",
          code: `# Fractional Knapsack — greedy works (vs 0/1 where it doesn't)
def fractional_knapsack(weights, values, W):
    # Sort by value/weight ratio descending
    items = sorted(zip(weights, values),
                   key=lambda x: x[1]/x[0], reverse=True)
    total_value = 0.0
    for weight, value in items:
        if W >= weight:
            total_value += value
            W -= weight
        else:
            total_value += value * (W / weight)
            break
    return total_value`,
          caption: "Fractional Knapsack — greedy by value/weight ratio",
        },
      } satisfies LearnConfig,
    },

    /* ── 5. GUIDED BUILD ── */
    {
      id: "greedy-guided-build",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "Activity Selection: sort intervals by end time.",
            hint: "intervals.sort(key=lambda x: x[1])",
            celebration: false,
          },
          {
            instruction: "Initialize count=0 and last_end = -infinity.",
            hint: "last_end tracks when the last selected activity ends.",
            celebration: false,
          },
          {
            instruction: "For each (start, end): if start >= last_end, select it. Update last_end=end.",
            hint: "Non-overlapping condition: new activity starts after or at when last one ended.",
            celebration: true,
            expectedOutput: "Maximum non-overlapping activities selected.",
          },
        ],
        completionMessage:
          "Activity selection solved! This same pattern underlies interval scheduling, meeting rooms, and non-overlapping intervals — some of the most common graph-adjacent interview problems.",
      } satisfies GuidedBuildConfig,
    },

    /* ── 6. CODE ── */
    {
      id: "greedy-code",
      type: "code",
      config: {
        problemSlug: "jump-game",
        contextHint:
          "Track max_reach. For each index i: if i > max_reach, return False. Else update max_reach = max(max_reach, i + nums[i]). Return True at the end.",
        hintAfterMinutes: 4,
        approachAfterMinutes: 8,
      } satisfies CodeConfig,
    },

    /* ── 7. REFLECT ── */
    {
      id: "greedy-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "Why does greedy fail for 0/1 Knapsack but work for Fractional Knapsack?",
            options: [
              "0/1 has more items",
              "In Fractional Knapsack you can take partial items, so the greedy ratio selection is always valid. In 0/1, taking a high-ratio item may use capacity that could fit multiple small items with higher total value.",
              "They use different sorting keys",
              "Greedy actually works for both",
            ],
            correctIndex: 1,
            explanation:
              "In Fractional Knapsack, you can always 'fill the gap' with a fraction of the next best item. In 0/1, a high-ratio item might block a combination of items with better total value.",
          },
          {
            question: "What's the time complexity of greedy Activity Selection (after sorting)?",
            options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
            correctIndex: 1,
            explanation:
              "Sorting takes O(n log n). The selection pass is O(n). Total: O(n log n), dominated by sorting.",
          },
          {
            question: "The greedy algorithm for Jump Game runs in what time/space complexity?",
            options: [
              "O(n²) time, O(n) space",
              "O(n) time, O(1) space",
              "O(n log n) time, O(1) space",
              "O(n) time, O(n) space",
            ],
            correctIndex: 1,
            explanation:
              "Single pass through the array — O(n) time. Only one variable (max_reach) needed — O(1) space. This is the beauty of greedy: simple and efficient.",
          },
        ],
      } satisfies ReflectConfig,
    },

    /* ── 8. SUMMARY ── */
    {
      id: "greedy-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
},

];
