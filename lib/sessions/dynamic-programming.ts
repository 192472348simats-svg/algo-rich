// lib/sessions/dynamic-programming.ts
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
// Session 1 — DP Foundations: Memoization & Tabulation
// ──────────────────────────────────────────────────────
{
  id: "session-dp-intro",
  slug: "dynamic-programming-intro",
  title: "Dynamic Programming: Memoization & Tabulation",
  topic: "dynamic-programming",
  description:
    "Stop re-solving the same subproblems. Learn the two DP techniques that turn exponential brute-force into elegant O(n) solutions.",
  estimatedMinutes: 30,
  xpTotal: 150,
  nextSessionSlug: "dynamic-programming-advanced",

  stages: [
    /* ── 1. HOOK ── */
    {
      id: "dp-hook",
      type: "hook",
      config: {
        headline:
          "A naive Fibonacci call for fib(50) makes 2²⁵ recursive calls.\nWith DP, it makes exactly 50.",
        subtext:
          "Dynamic Programming is the most feared topic in interviews — and the most rewarding to master. It's not magic. It's just smart caching.",
        backgroundEmoji: "🧠",
      } satisfies HookConfig,
    },

    /* ── 2. WATCH ── */
    {
      id: "dp-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        narration:
          "We'll compute Fibonacci two ways: memoization (top-down, cache results) and tabulation (bottom-up, fill a table). Both give O(n) time but different call patterns.",
        autoPlaySteps: [
          {
            action: "insert",
            value: 0,
            narration: "dp[0] = 0 — base case.",
            delayAfterMs: 1500,
          },
          {
            action: "insert",
            value: 1,
            narration: "dp[1] = 1 — base case.",
            delayAfterMs: 1500,
          },
          {
            action: "insert",
            value: 1,
            narration: "dp[2] = dp[1] + dp[0] = 1",
            delayAfterMs: 1500,
          },
          {
            action: "insert",
            value: 2,
            narration: "dp[3] = dp[2] + dp[1] = 2",
            delayAfterMs: 1500,
          },
          {
            action: "insert",
            value: 3,
            narration: "dp[4] = dp[3] + dp[2] = 3",
            delayAfterMs: 1500,
          },
          {
            action: "insert",
            value: 5,
            narration: "dp[5] = dp[4] + dp[3] = 5. Each value computed once — O(n)!",
            delayAfterMs: 2000,
          },
        ],
      } satisfies WatchConfig,
    },

    /* ── 3. PREDICT ── */
    {
      id: "dp-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "dp-pred-1",
            question:
              "Which TWO conditions must hold for DP to be applicable to a problem?",
            answerType: "multiple-choice",
            options: [
              "Optimal substructure + Overlapping subproblems",
              "Greedy choice + Optimal substructure",
              "Divide & Conquer + No overlapping subproblems",
              "Recursion + Large input size",
            ],
            correctAnswer: "Optimal substructure + Overlapping subproblems",
            feedbackCorrect:
              "Optimal substructure means the global solution can be built from optimal sub-solutions. Overlapping subproblems means the same subproblem recurs — so caching pays off.",
            feedbackWrong:
              "DP requires: (1) Optimal substructure — can we build the answer from smaller answers? (2) Overlapping subproblems — do we solve the same sub-problem more than once?",
            xp: 10,
          },
          {
            id: "dp-pred-2",
            question:
              "For Climbing Stairs (n steps, can take 1 or 2 at a time), the recurrence is: ways(n) = ?",
            answerType: "multiple-choice",
            options: [
              "ways(n-1) * ways(n-2)",
              "ways(n-1) + ways(n-2)",
              "2 * ways(n-1)",
              "ways(n/2) + 1",
            ],
            correctAnswer: "ways(n-1) + ways(n-2)",
            feedbackCorrect:
              "To reach step n, you either came from step n-1 (took 1 step) or step n-2 (took 2 steps). The number of ways is the sum of both — exactly Fibonacci!",
            feedbackWrong:
              "Think about where you were before the last step: either at n-1 (1-step) or n-2 (2-step). So ways(n) = ways(n-1) + ways(n-2). Sound familiar? It's Fibonacci!",
            xp: 15,
          },
          {
            id: "dp-pred-3",
            question:
              "Memoization is _____ (stores results of subproblems in a cache). Tabulation is _____ (fills a DP table from base cases up).",
            answerType: "multiple-choice",
            options: [
              "Bottom-up, Top-down",
              "Top-down, Bottom-up",
              "Recursive, Iterative — but both are top-down",
              "Iterative, Recursive",
            ],
            correctAnswer: "Top-down, Bottom-up",
            feedbackCorrect:
              "Memoization: start from the original problem, recurse down, cache results (top-down). Tabulation: start from base cases, build up to the answer (bottom-up).",
            feedbackWrong:
              "Memoization starts at the top (the full problem) and recurses down — top-down. Tabulation starts at the bottom (base cases) and builds up — bottom-up.",
            xp: 10,
          },
        ],
      } satisfies PredictConfig,
    },

    /* ── 4. LEARN ── */
    {
      id: "dp-learn",
      type: "learn",
      config: {
        title: "The Two DP Techniques",
        keyRule: {
          emoji: "💡",
          text: "Every DP problem: (1) define the subproblem, (2) write the recurrence, (3) identify base cases, (4) choose memo or tabulation.",
        },
        content: `## Memoization (Top-Down)

Start with recursion. Add a cache.

\`\`\`python
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
\`\`\`

**Pros:** Natural to write. Only computes needed subproblems.  
**Cons:** Recursion overhead, risk of stack overflow for large n.

## Tabulation (Bottom-Up)

Fill a table from the smallest subproblem up.

\`\`\`python
def fib(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

**Pros:** No recursion, O(1) space possible (just keep last 2 values).  
**Cons:** Must compute all subproblems even if not all are needed.

## Space Optimization

Often dp[i] only depends on dp[i-1] and dp[i-2]. Save space:

\`\`\`python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`
O(n) time, **O(1) space**.

## The DP Framework

1. **Define state**: What does dp[i] represent?
2. **Recurrence**: How does dp[i] relate to smaller states?
3. **Base case**: What are the smallest valid states?
4. **Order**: Which direction to fill the table?
`,
        codeSnippet: {
          language: "python",
          code: `# Climbing Stairs — classic DP
def climb_stairs(n):
    if n <= 2: return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    return prev1
# dp[i] = ways to reach step i
# dp[i] = dp[i-1] + dp[i-2]  (same as Fibonacci!)`,
          caption: "Climbing Stairs — O(n) time, O(1) space",
        },
      } satisfies LearnConfig,
    },

    /* ── 5. GUIDED BUILD ── */
    {
      id: "dp-guided-build",
      type: "guided-build",
      config: {
        visualizerType: "array",
        instructions:
          "Build the tabulation solution for Climbing Stairs step by step.",
        steps: [
          {
            instruction: "Define what dp[i] means: number of ways to reach step i.",
            hint: "This is the most important step — the state definition drives everything else.",
            celebration: false,
          },
          {
            instruction: "Write base cases: dp[1] = 1, dp[2] = 2.",
            hint: "1 step: only one way (take 1). 2 steps: two ways (1+1 or 2).",
            celebration: false,
          },
          {
            instruction: "Write the recurrence: dp[i] = dp[i-1] + dp[i-2] for i from 3 to n.",
            hint: "From step i, you could have come from i-1 (1 step) or i-2 (2 steps).",
            celebration: false,
          },
          {
            instruction: "Return dp[n]. Trace through n=5: dp = [_,1,2,3,5,8].",
            hint: "dp[5] = dp[4]+dp[3] = 5+3 = 8. For n=5 there are 8 ways.",
            celebration: true,
            expectedOutput: "dp[5] = 8",
          },
        ],
        completionMessage:
          "You just solved a DP problem systematically! State definition → recurrence → base cases → fill. This pattern works for 90% of DP problems.",
      } satisfies GuidedBuildConfig,
    },

    /* ── 6. CODE ── */
    {
      id: "dp-code",
      type: "code",
      config: {
        problemSlug: "climbing-stairs",
        contextHint:
          "This IS Fibonacci in disguise. Define dp[i] = ways to reach step i. dp[i] = dp[i-1] + dp[i-2]. Base: dp[1]=1, dp[2]=2.",
        hintAfterMinutes: 4,
        approachAfterMinutes: 8,
      } satisfies CodeConfig,
    },

    /* ── 7. REFLECT ── */
    {
      id: "dp-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "What is 'optimal substructure' in DP?",
            options: [
              "The problem can be split into independent subproblems",
              "The optimal solution contains optimal solutions to its subproblems",
              "The problem has a greedy solution",
              "Subproblems don't overlap",
            ],
            correctIndex: 1,
            explanation:
              "Optimal substructure means: if you know the optimal solution to all subproblems, you can combine them to find the optimal global solution. This is what makes DP work.",
          },
          {
            question: "What is the space-optimized time complexity of computing fib(n)?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctIndex: 2,
            explanation:
              "We still need O(n) iterations to compute fib(n). The space optimization reduces space from O(n) to O(1) by only keeping the last two values.",
          },
          {
            question: "When should you prefer memoization over tabulation?",
            options: [
              "Always — memoization is always better",
              "When not all subproblems are needed or the recursion is more natural",
              "When memory is limited",
              "Tabulation is always preferred",
            ],
            correctIndex: 1,
            explanation:
              "Memoization shines when only a fraction of subproblems are actually needed (sparse recursion tree) or when the recursive formulation is much clearer. Tabulation avoids recursion overhead.",
          },
        ],
      } satisfies ReflectConfig,
    },

    /* ── 8. SUMMARY ── */
    {
      id: "dp-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
},

// ──────────────────────────────────────────────────────
// Session 2 — Advanced DP: Knapsack & LCS
// ──────────────────────────────────────────────────────
{
  id: "session-dp-advanced",
  slug: "dynamic-programming-advanced",
  title: "Advanced DP: Knapsack & Longest Common Subsequence",
  topic: "dynamic-programming",
  description:
    "Master the 0/1 Knapsack and Longest Common Subsequence — two 2D DP templates that unlock dozens of interview problems.",
  estimatedMinutes: 35,
  xpTotal: 200,
  prerequisiteSessionSlug: "dynamic-programming-intro",

  stages: [
    /* ── 1. HOOK ── */
    {
      id: "dp-adv-hook",
      type: "hook",
      config: {
        headline:
          "Git diff, DNA sequencing, spell-checkers — all use LCS.\nThe 0/1 Knapsack is in every resource allocation system.",
        subtext:
          "2D DP tables feel intimidating. After this session, you'll see the pattern in every problem and fill tables confidently under time pressure.",
        backgroundEmoji: "🎒",
      } satisfies HookConfig,
    },

    /* ── 2. WATCH ── */
    {
      id: "dp-adv-watch",
      type: "watch",
      config: {
        visualizerType: "array",
        narration:
          "0/1 Knapsack: dp[i][w] = max value using first i items with capacity w. For each item: either skip it or take it (if it fits). LCS: dp[i][j] = length of LCS of first i chars of s1 and first j chars of s2.",
        autoPlaySteps: [
          {
            action: "insert",
            value: 0,
            narration: "dp[0][w] = 0 for all w — zero items, zero value.",
            delayAfterMs: 2000,
          },
          {
            action: "insert",
            value: 0,
            narration: "dp[i][0] = 0 for all i — zero capacity, zero value.",
            delayAfterMs: 2000,
          },
          {
            action: "traverse",
            value: "fill",
            narration: "For item i (weight w_i, value v_i): dp[i][w] = max(dp[i-1][w], dp[i-1][w-w_i] + v_i) if w >= w_i.",
            delayAfterMs: 3000,
          },
          {
            action: "search",
            value: "LCS",
            narration: "LCS: if s1[i]==s2[j]: dp[i][j] = dp[i-1][j-1]+1. Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
            delayAfterMs: 2500,
          },
        ],
      } satisfies WatchConfig,
    },

    /* ── 3. PREDICT ── */
    {
      id: "dp-adv-predict",
      type: "predict",
      config: {
        questions: [
          {
            id: "dp-adv-pred-1",
            question:
              "In 0/1 Knapsack, item i has weight=3, value=5. Capacity w=7. What are the TWO choices?",
            answerType: "multiple-choice",
            options: [
              "Take it (dp[i-1][4]+5) or skip it (dp[i-1][7])",
              "Take it twice or skip it",
              "Split it or take it whole",
              "Take it (dp[i][7]) or skip it (dp[i-1][7])",
            ],
            correctAnswer: "Take it (dp[i-1][4]+5) or skip it (dp[i-1][7])",
            feedbackCorrect:
              "Skip: dp[i-1][7] (pretend item doesn't exist). Take: dp[i-1][7-3] + 5 = dp[i-1][4] + 5. The 0/1 means you either take the whole item or leave it.",
            feedbackWrong:
              "The 0/1 means: include (whole item, reduce capacity: dp[i-1][w-weight]+value) or exclude (dp[i-1][w]).",
            xp: 15,
          },
          {
            id: "dp-adv-pred-2",
            question:
              'LCS of "ABCDE" and "ACE" — what is the length?',
            answerType: "multiple-choice",
            options: ["2", "3", "4", "5"],
            correctAnswer: "3",
            feedbackCorrect:
              'LCS = "ACE" — length 3. Subsequences don\'t need to be contiguous.',
            feedbackWrong:
              'Trace: A matches A, C matches C, E matches E → "ACE" → length 3. Remember: subsequences don\'t need to be contiguous.',
            xp: 10,
          },
          {
            id: "dp-adv-pred-3",
            question:
              "Edit Distance (Levenshtein) is a variation of LCS. What's the recurrence when characters match?",
            answerType: "multiple-choice",
            options: [
              "dp[i][j] = dp[i-1][j-1] + 1",
              "dp[i][j] = dp[i-1][j-1]",
              "dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + 1",
              "dp[i][j] = 0",
            ],
            correctAnswer: "dp[i][j] = dp[i-1][j-1]",
            feedbackCorrect:
              "When characters match, no edit is needed — we inherit the edit distance from dp[i-1][j-1] (both strings shortened by one character each).",
            feedbackWrong:
              "When s1[i]==s2[j]: characters match, no operation needed. dp[i][j] = dp[i-1][j-1] (no edit cost). When they differ: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
            xp: 15,
          },
        ],
      } satisfies PredictConfig,
    },

    /* ── 4. LEARN ── */
    {
      id: "dp-adv-learn",
      type: "learn",
      config: {
        title: "0/1 Knapsack & Longest Common Subsequence",
        keyRule: {
          emoji: "📐",
          text: "2D DP: define dp[i][j], write the recurrence for match/no-match or take/skip. Fill row by row.",
        },
        content: `## 0/1 Knapsack

**Problem**: n items, each with weight and value. Knapsack capacity W. Maximize value without exceeding capacity.

\`\`\`python
def knapsack(weights, values, W):
    n = len(weights)
    # dp[i][w] = max value using items 0..i-1 with capacity w
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(W + 1):
            # Skip item i
            dp[i][w] = dp[i-1][w]
            # Take item i (if it fits)
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                               dp[i-1][w - weights[i-1]] + values[i-1])

    return dp[n][W]
\`\`\`

Time: O(n×W), Space: O(n×W) or O(W) with 1D optimization.

## Longest Common Subsequence

**Problem**: Length of longest sequence that appears in both strings (not necessarily contiguous).

\`\`\`python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1  # chars match
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # skip one

    return dp[m][n]
\`\`\`

## Problems that use these templates

| Problem | Template |
|---------|---------|
| Partition Equal Subset Sum | Knapsack (find if sum=W/2 achievable) |
| Coin Change | Unbounded Knapsack variant |
| Edit Distance | LCS variant |
| Longest Palindromic Subsequence | LCS(s, reverse(s)) |
| Minimum Insertions to Make Palindrome | LCS variant |
`,
        codeSnippet: {
          language: "python",
          code: `# Space-optimized 0/1 Knapsack (1D dp)
def knapsack_1d(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        # Traverse RIGHT TO LEFT to avoid using item twice
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[W]`,
          caption: "1D Knapsack — O(W) space. MUST traverse right-to-left!",
        },
      } satisfies LearnConfig,
    },

    /* ── 5. GUIDED BUILD ── */
    {
      id: "dp-adv-guided-build",
      type: "guided-build",
      config: {
        steps: [
          {
            instruction: "For LCS: create dp table of size (m+1) x (n+1), initialize all zeros.",
            hint: "The +1 handles the empty string base case. dp[0][j]=0 and dp[i][0]=0.",
            celebration: false,
          },
          {
            instruction: "Fill: if s1[i-1]==s2[j-1]: dp[i][j] = dp[i-1][j-1]+1",
            hint: "Characters match → extend the LCS found so far by 1.",
            celebration: false,
          },
          {
            instruction: "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
            hint: "Characters don't match → best LCS from either skipping s1's current char or s2's current char.",
            celebration: false,
          },
          {
            instruction: "Return dp[m][n]. For 'ABCDE' and 'ACE', answer should be 3.",
            hint: "The bottom-right cell always holds the final answer.",
            celebration: true,
            expectedOutput: "LCS length = 3",
          },
        ],
        completionMessage:
          "You built LCS! Now you can solve Edit Distance, Longest Palindromic Subsequence, and Minimum Insertions using the same 2D table approach.",
      } satisfies GuidedBuildConfig,
    },

    /* ── 6. CODE ── */
    {
      id: "dp-adv-code",
      type: "code",
      config: {
        problemSlug: "coin-change",
        contextHint:
          "This is an unbounded knapsack. dp[i] = minimum coins to make amount i. For each coin c: dp[i] = min(dp[i], dp[i-c]+1) if i>=c. Base: dp[0]=0, rest=infinity.",
        hintAfterMinutes: 5,
        approachAfterMinutes: 12,
      } satisfies CodeConfig,
    },

    /* ── 7. REFLECT ── */
    {
      id: "dp-adv-reflect",
      type: "reflect",
      config: {
        questions: [
          {
            question: "In 0/1 Knapsack, why must the 1D space-optimized version traverse RIGHT to LEFT?",
            options: [
              "To avoid integer overflow",
              "To prevent an item from being used more than once in the same iteration",
              "For better cache performance",
              "It doesn't matter — either direction works",
            ],
            correctIndex: 1,
            explanation:
              "If we went left-to-right, dp[w-weight] would already reflect the current item being added, allowing us to take it multiple times. Right-to-left ensures we only see the previous iteration's values.",
          },
          {
            question: "What does dp[i][j] represent in the LCS recurrence?",
            options: [
              "The edit distance between s1[0..i] and s2[0..j]",
              "The length of LCS of the first i characters of s1 and first j characters of s2",
              "Whether characters s1[i] and s2[j] match",
              "The number of common characters",
            ],
            correctIndex: 1,
            explanation:
              "dp[i][j] = length of the LCS of s1[0..i-1] and s2[0..j-1]. This state definition is what makes the recurrence possible.",
          },
          {
            question: "Partition Equal Subset Sum uses which DP template?",
            options: [
              "LCS",
              "0/1 Knapsack",
              "Fibonacci",
              "Coin Change (unbounded)",
            ],
            correctIndex: 1,
            explanation:
              "Find if any subset sums to total/2. dp[i][s] = can we achieve sum s using first i elements. If dp[n][total/2] is True, partition is possible. Classic 0/1 Knapsack.",
          },
        ],
      } satisfies ReflectConfig,
    },

    /* ── 8. SUMMARY ── */
    {
      id: "dp-adv-summary",
      type: "summary",
      config: {} satisfies SummaryConfig,
    },
  ],
},

];
