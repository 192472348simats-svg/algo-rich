// ═══════════════════════════════════════════
// FAILURE ANALYSIS ENGINE
// Examines test results and produces human-readable
// diagnostic feedback WITHOUT giving away the solution.
// ═══════════════════════════════════════════

export interface TestResultInput {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
  errorType?: "runtime" | "timeout" | "syntax" | "memory";
  executionTimeMs?: number;
}

export interface FailureAnalysis {
  type: FailureType;
  severity: "minor" | "moderate" | "major";
  title: string;
  explanation: string;
  hint: string;
  debugTip?: string;
  conceptGap?: string;
  commonFix?: string;
}

export type FailureType =
  | "returns-none"
  | "print-not-return"
  | "off-by-one"
  | "wrong-type"
  | "wrong-order"
  | "wrong-sign"
  | "missing-edge-case-empty"
  | "missing-edge-case-single"
  | "missing-edge-case-duplicate"
  | "missing-edge-case-negative"
  | "partial-correct"
  | "timeout"
  | "infinite-loop"
  | "infinite-recursion"
  | "index-out-of-range"
  | "null-reference"
  | "syntax-error"
  | "type-error"
  | "division-by-zero"
  | "wrong-approach"
  | "almost-correct"
  | "reversed-output"
  | "unknown";

export function analyzeFailure(
  results: TestResultInput[],
  problemDifficulty: string,
  problemCategory: string,
): FailureAnalysis {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const failedResults = results.filter((r) => !r.passed);
  const firstFail = failedResults[0];

  // ── CHECK FOR ERRORS FIRST ──
  const errorResult = results.find((r) => r.error);
  if (errorResult) {
    return analyzeError(errorResult, problemDifficulty, problemCategory);
  }

  // ── NO ERRORS — ANALYZE WRONG ANSWERS ──

  // Pattern: All outputs are None/null/empty
  if (failedResults.length > 0 && failedResults.every((r) => isNoneOrEmpty(r.actual))) {
    return analyzeReturnsNone();
  }

  // Pattern: Output looks like print() was used
  if (failedResults.some((r) => r.actual === "" || r.actual === "undefined")) {
    return {
      type: "print-not-return",
      severity: "major",
      title: "Function not returning a value",
      explanation:
        "Your function prints the answer but doesn't return it. The test system captures what your function returns, not what it prints.",
      hint: 'Replace `print(result)` with `return result` at the end of your function.',
      debugTip:
        "Search your code for `print(` — each one should probably be `return`.",
      commonFix:
        "def solve(...):\n    # your logic\n    return result  # ← not print(result)",
    };
  }

  // Pattern: Off-by-one (numeric answer differs by exactly 1)
  const offByOneCheck = checkOffByOne(failedResults);
  if (offByOneCheck) return offByOneCheck;

  // Pattern: Wrong sign (positive vs negative)
  const wrongSignCheck = checkWrongSign(failedResults);
  if (wrongSignCheck) return wrongSignCheck;

  // Pattern: Wrong type (returning int when list expected, etc.)
  const wrongTypeCheck = checkWrongType(failedResults);
  if (wrongTypeCheck) return wrongTypeCheck;

  // Pattern: Correct values but wrong order
  const wrongOrderCheck = checkWrongOrder(failedResults);
  if (wrongOrderCheck) return wrongOrderCheck;

  // Pattern: Output is reversed
  const reversedCheck = checkReversedOutput(failedResults);
  if (reversedCheck) return reversedCheck;

  // Pattern: First test passes, later ones fail → edge case
  if (passed > 0 && failed > 0) {
    return analyzePartialSuccess(
      results,
      passed,
      total,
      problemCategory,
      problemDifficulty,
    );
  }

  // Pattern: All tests fail → fundamentally wrong approach
  if (passed === 0 && firstFail) {
    return analyzeWrongApproach(
      failedResults,
      problemDifficulty,
      problemCategory,
    );
  }

  // Fallback
  return {
    type: "unknown",
    severity: "moderate",
    title: "Incorrect output",
    explanation: `${failed} of ${total} tests failed. Your output doesn't match the expected result.`,
    hint: "Trace through the first failing test case by hand. Write down what your code does at each step and compare with what you expect.",
    debugTip:
      "Add print statements inside your function to see intermediate values.",
  };
}

// ═══════════════════════════════════════════
// ERROR ANALYSIS
// ═══════════════════════════════════════════

function analyzeError(
  result: TestResultInput,
  difficulty: string,
  category: string,
): FailureAnalysis {
  const err = (result.error || "").toLowerCase();
  const errorText = result.error || "";

  // Index out of range
  if (
    err.includes("index") ||
    err.includes("out of bounds") ||
    err.includes("list index")
  ) {
    const lineMatch = errorText.match(/line (\d+)/i);
    const lineInfo = lineMatch ? ` (line ${lineMatch[1]})` : "";

    return {
      type: "index-out-of-range",
      severity: "major",
      title: `Index out of range${lineInfo}`,
      explanation:
        "You're trying to access an element at a position that doesn't exist. For example, accessing arr[5] when the array only has 5 elements (valid indices: 0-4).",
      hint: "Check your loop conditions. If you use `for i in range(len(arr))`, make sure you don't also access `arr[i+1]` without checking bounds.",
      debugTip:
        'Before the crashing line, add: `print(f"accessing index {i}, array length {len(arr)}")`',
      conceptGap:
        "Arrays are zero-indexed. An array of length n has valid indices 0 to n-1.",
      commonFix:
        "# Before accessing arr[i+1], check:\nif i + 1 < len(arr):\n    # safe to access arr[i+1]",
    };
  }

  // Null/None reference
  if (
    err.includes("nonetype") ||
    err.includes("'nonetype' object")
  ) {
    return {
      type: "null-reference",
      severity: "major",
      title: "NoneType error — accessing property on None",
      explanation:
        "A variable that should have a value is actually None. This usually happens when: a function returns None unexpectedly, you go past the end of a linked list, or a dictionary lookup finds no key.",
      hint: "Add a None check before the crashing line: `if node is not None:` or `if value is not None:`",
      debugTip:
        'Print the variable just before the crash: `print(f"variable = {variable}, type = {type(variable)}")`',
      conceptGap:
        category === "trees" || category === "linked-lists"
          ? "When traversing trees/linked lists, always check if the current node is None before accessing .left, .right, .val, or .next."
          : "Make sure your function returns a value on all code paths, including edge cases like empty input.",
    };
  }

  // Stack overflow / infinite recursion
  if (
    err.includes("recursion") ||
    err.includes("maximum recursion") ||
    err.includes("stack overflow") ||
    err.includes("call stack")
  ) {
    return {
      type: "infinite-recursion",
      severity: "major",
      title: "Infinite recursion — stack overflow",
      explanation:
        "Your recursive function calls itself forever without stopping. Every recursive function needs a base case that stops the recursion.",
      hint: "Check two things: (1) Do you have a base case? (2) Does each recursive call make the problem SMALLER? If not, you'll recurse forever.",
      debugTip:
        'Add at the top of your function:\n`print(f"called with: {args}")`\nSee if the arguments change between calls.',
      conceptGap:
        "Recursion requires: (1) a base case that returns without recursing, (2) recursive calls that reduce the problem toward the base case.",
      commonFix:
        "def solve(n):\n    if n <= 0:        # ← base case\n        return 0\n    return solve(n-1)  # ← n gets smaller each call",
    };
  }

  // Timeout
  if (
    err.includes("timeout") ||
    err.includes("time limit") ||
    err.includes("timed out") ||
    result.errorType === "timeout"
  ) {
    const categoryHints: Record<string, string> = {
      arrays:
        "Look for nested loops. Can you replace the inner loop with a hash map (O(1) lookup)?",
      strings:
        "Are you creating new strings in a loop? String concatenation in a loop is O(n²). Use a list and join at the end.",
      "hash-maps":
        "You might be using a list where a set/dict would give O(1) lookups.",
      "binary-search":
        "If the array is sorted, you don't need to scan linearly. Use binary search to cut the search space in half.",
      "two-pointers":
        "Instead of checking all pairs (O(n²)), try two pointers converging from both ends (O(n)).",
      "sliding-window":
        "Instead of checking all subarrays (O(n²)), maintain a window that expands and contracts (O(n)).",
      "dynamic-programming":
        "You might be recalculating the same subproblems. Use memoization or a DP table.",
      trees:
        "Are you visiting the same nodes multiple times? Each node should be visited at most once for O(n).",
      graphs:
        "Make sure you're marking nodes as visited to avoid revisiting them.",
    };

    return {
      type: "timeout",
      severity: "major",
      title: "Time limit exceeded — solution too slow",
      explanation: `Your code produces correct results but takes too long. ${
        difficulty === "easy"
          ? "Easy problems typically need O(n) or O(n log n) solutions."
          : difficulty === "medium"
            ? "Medium problems usually need O(n) or O(n log n). Brute force O(n²) won't pass."
            : "Hard problems often need clever O(n) or O(n log n) approaches. Think about which pattern applies."
      }`,
      hint:
        categoryHints[category] ||
        'Look for nested loops or repeated work. Ask: "Am I doing the same comparison/calculation more than once?"',
      debugTip:
        "Count your operations: if you have a loop inside a loop, and both go up to n, that's n² operations. For n=10,000, that's 100,000,000 — too slow.",
      conceptGap:
        "The key to optimization is eliminating redundant work. Hash maps, sorting, two pointers, and binary search are the most common tools.",
      commonFix:
        difficulty === "easy"
          ? "# Instead of:\nfor i in range(n):\n    for j in range(n):  # O(n²)\n        if arr[j] == target - arr[i]:\n\n# Use a hash map:\nseen = {}\nfor i in range(n):  # O(n)\n    if target - arr[i] in seen:"
          : undefined,
    };
  }

  // Syntax error
  if (
    err.includes("syntax") ||
    err.includes("unexpected") ||
    err.includes("invalid syntax")
  ) {
    const lineMatch = errorText.match(/line (\d+)/i);
    const lineInfo = lineMatch ? ` on line ${lineMatch[1]}` : "";

    return {
      type: "syntax-error",
      severity: "minor",
      title: `Syntax error${lineInfo}`,
      explanation:
        "Python couldn't parse your code. There's a typo or structural issue.",
      hint: "Common Python syntax errors:\n• Missing colon after if/for/while/def\n• Unmatched parentheses or brackets\n• Wrong indentation\n• Using = instead of == in conditions",
      debugTip: lineMatch
        ? `Look at line ${lineMatch[1]} and the line above it. The error is often on the line BEFORE where Python reports it.`
        : "Look at the error message carefully — it usually points to the exact location.",
    };
  }

  // Type error
  if (
    err.includes("typeerror") ||
    err.includes("type error") ||
    err.includes("unsupported operand")
  ) {
    return {
      type: "type-error",
      severity: "moderate",
      title: "Type error — wrong data type",
      explanation:
        "You're performing an operation on incompatible types. For example: adding a string to an integer, or comparing a list with a number.",
      hint: "Use `type(variable)` to check what type your variables actually are. The error message tells you which types collided.",
      debugTip:
        'Before the failing operation, add:\n`print(type(a), type(b))` to see what types you\'re working with.',
    };
  }

  // Division by zero
  if (
    err.includes("division by zero") ||
    err.includes("zerodivisionerror")
  ) {
    return {
      type: "division-by-zero",
      severity: "moderate",
      title: "Division by zero",
      explanation:
        "You're dividing by a value that's zero. This usually happens with empty arrays (length 0) or when a counter/accumulator hasn't been initialized.",
      hint: "Add a check before dividing: `if denominator != 0:` or handle the empty input case separately at the start of your function.",
      debugTip:
        "Find every `/` and `//` in your code. For each one, ask: \"Can the right side ever be zero?\"",
    };
  }

  // Key error
  if (err.includes("keyerror") || err.includes("key error")) {
    return {
      type: "null-reference",
      severity: "moderate",
      title: "Key not found in dictionary",
      explanation:
        "You're trying to access a dictionary key that doesn't exist.",
      hint: "Use `dict.get(key, default_value)` instead of `dict[key]` to safely handle missing keys. Or check with `if key in dict:` first.",
      debugTip:
        'Print the dictionary contents and the key you\'re looking up:\n`print(f"looking for {key} in {dict.keys()}")`',
      commonFix:
        "# Instead of:\nvalue = my_dict[key]  # crashes if key missing\n\n# Use:\nvalue = my_dict.get(key, 0)  # returns 0 if missing",
    };
  }

  // Generic error fallback
  return {
    type: "unknown",
    severity: "moderate",
    title: "Runtime error",
    explanation: `Your code crashed: ${errorText.slice(0, 150)}`,
    hint: "Check edge cases: empty input, single element, negative numbers, very large values.",
    debugTip:
      'Add try/except around suspicious code to catch the error:\n`try:\n    # your code\nexcept Exception as e:\n    print(f"Error: {e}")`',
  };
}

// ═══════════════════════════════════════════
// PATTERN CHECKS
// ═══════════════════════════════════════════

function isNoneOrEmpty(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    v === "none" ||
    v === "null" ||
    v === "" ||
    v === "undefined" ||
    v === "nan"
  );
}

function analyzeReturnsNone(): FailureAnalysis {
  return {
    type: "returns-none",
    severity: "major",
    title: "Function returns None for all inputs",
    explanation:
      "Your function doesn't return anything (or returns None). In Python, a function without a return statement automatically returns None.",
    hint: "Make sure your function has a `return` statement that returns the computed result. Check that the return is NOT inside a loop or condition that might never execute.",
    debugTip:
      'Add `print("about to return:", result)` just before your return statement. If you never see this print, your return is unreachable.',
    conceptGap:
      "Every function that computes a value must explicitly `return` it. `print()` displays to console but doesn't give the value back to the caller.",
    commonFix:
      "def solve(nums, target):\n    result = ...  # your logic\n    return result  # ← THIS IS REQUIRED",
  };
}

function checkOffByOne(results: TestResultInput[]): FailureAnalysis | null {
  for (const r of results) {
    try {
      const actual = parseFloat(r.actual);
      const expected = parseFloat(r.expected);
      if (
        !isNaN(actual) &&
        !isNaN(expected) &&
        Math.abs(actual - expected) === 1
      ) {
        return {
          type: "off-by-one",
          severity: "minor",
          title: `Off by one: got ${r.actual}, expected ${r.expected}`,
          explanation:
            "Your answer is exactly 1 away from correct. This is the most common bug in programming — off-by-one errors happen in loop boundaries, array indexing, and range calculations.",
          hint: "Check these in your code:\n• `< n` vs `<= n` in loops\n• `range(n)` goes 0 to n-1, not 0 to n\n• Starting from index 0 vs 1\n• Counting elements vs counting gaps between elements",
          debugTip:
            "Trace the failing test case by hand. Write down each iteration: what is i? What does arr[i] equal? Where does the loop stop? Should it go one more step?",
          conceptGap:
            "In Python, `range(5)` gives [0,1,2,3,4] not [0,1,2,3,4,5]. And `arr[-1]` gives the last element.",
        };
      }
    } catch {
      // skip
    }
  }
  return null;
}

function checkWrongSign(results: TestResultInput[]): FailureAnalysis | null {
  for (const r of results) {
    try {
      const actual = parseFloat(r.actual);
      const expected = parseFloat(r.expected);
      if (
        !isNaN(actual) &&
        !isNaN(expected) &&
        actual === -expected &&
        actual !== 0
      ) {
        return {
          type: "wrong-sign",
          severity: "minor",
          title: `Wrong sign: got ${r.actual}, expected ${r.expected}`,
          explanation:
            "Your answer has the right magnitude but wrong sign (positive vs negative).",
          hint: "Check: are you subtracting in the wrong order? (a - b vs b - a). Or returning a negative when it should be the absolute value?",
          debugTip:
            "Look for subtraction operations and verify which value comes first.",
        };
      }
    } catch {
      // skip
    }
  }
  return null;
}

function checkWrongType(results: TestResultInput[]): FailureAnalysis | null {
  for (const r of results) {
    if (r.expected.startsWith("[") && !r.actual.startsWith("[")) {
      return {
        type: "wrong-type",
        severity: "moderate",
        title: "Wrong return type",
        explanation: `Expected a list (${r.expected}) but your function returned a single value (${r.actual}).`,
        hint: "Make sure you're returning a list, not a single element. For example, `return [a, b]` not `return a`.",
        debugTip:
          "Add `print(type(result))` before returning to verify you're returning the right type.",
      };
    }
    if (!r.expected.startsWith("[") && r.actual.startsWith("[")) {
      return {
        type: "wrong-type",
        severity: "moderate",
        title: "Wrong return type",
        explanation: `Expected a single value (${r.expected}) but your function returned a list (${r.actual}).`,
        hint: "The problem expects a single number/string, not a list. Return just the value, not wrapped in brackets.",
        debugTip:
          "Check if you're returning `[result]` when you should return `result`.",
      };
    }
    if (
      (r.expected === "True" || r.expected === "False") &&
      r.actual !== "True" &&
      r.actual !== "False"
    ) {
      return {
        type: "wrong-type",
        severity: "moderate",
        title: "Expected True/False, got something else",
        explanation: `Expected ${r.expected} but got ${r.actual}. The function should return a boolean.`,
        hint: "Make sure you're returning `True` or `False` (Python booleans), not a string or number.",
        debugTip:
          "Add `print(type(result), result)` to see what you're actually returning.",
      };
    }
  }
  return null;
}

function checkWrongOrder(results: TestResultInput[]): FailureAnalysis | null {
  for (const r of results) {
    if (r.expected.startsWith("[") && r.actual.startsWith("[")) {
      try {
        const expected = JSON.parse(r.expected.replace(/'/g, '"'));
        const actual = JSON.parse(r.actual.replace(/'/g, '"'));
        if (
          Array.isArray(expected) &&
          Array.isArray(actual) &&
          expected.length === actual.length
        ) {
          const sortedExpected = [...expected].sort();
          const sortedActual = [...actual].sort();
          if (
            JSON.stringify(sortedExpected) === JSON.stringify(sortedActual) &&
            JSON.stringify(expected) !== JSON.stringify(actual)
          ) {
            return {
              type: "wrong-order",
              severity: "minor",
              title: "Right values, wrong order",
              explanation:
                "Your output has the correct elements but in the wrong order.",
              hint: "Check: should the output be sorted? Are you processing elements in the right sequence? Try sorting your result before returning if the problem expects sorted output.",
              debugTip:
                "Compare your output with the expected output side by side. Which elements are swapped?",
            };
          }
        }
      } catch {
        // skip
      }
    }
  }
  return null;
}

function checkReversedOutput(
  results: TestResultInput[],
): FailureAnalysis | null {
  for (const r of results) {
    if (r.expected.startsWith("[") && r.actual.startsWith("[")) {
      try {
        const expected = JSON.parse(r.expected.replace(/'/g, '"'));
        const actual = JSON.parse(r.actual.replace(/'/g, '"'));
        if (
          Array.isArray(expected) &&
          Array.isArray(actual) &&
          JSON.stringify(expected) === JSON.stringify([...actual].reverse())
        ) {
          return {
            type: "reversed-output",
            severity: "minor",
            title: "Output is reversed",
            explanation:
              "Your output is the exact reverse of the expected output.",
            hint: "You might be iterating in the wrong direction, or building the result array by prepending instead of appending (or vice versa).",
            debugTip:
              "Check if you need to reverse your result at the end, or if you're iterating backwards when you should go forward.",
          };
        }
      } catch {
        // skip
      }
    }
  }
  return null;
}

function analyzePartialSuccess(
  results: TestResultInput[],
  passed: number,
  total: number,
  category: string,
  _difficulty: string,
): FailureAnalysis {
  const failedResults = results.filter((r) => !r.passed);
  const failingInputs = failedResults.map((r) => r.input.toLowerCase());

  // Check for empty input edge case
  if (
    failingInputs.some(
      (i) =>
        i.includes("[]") || i.includes('""') || i === "" || i === "0",
    )
  ) {
    return {
      type: "missing-edge-case-empty",
      severity: "moderate",
      title: `${passed}/${total} passed — missing empty/zero edge case`,
      explanation:
        "Your logic works for normal cases but fails when the input is empty, zero, or a single element.",
      hint: "Add a check at the start of your function:\n`if not nums: return ...`\nor `if len(nums) == 0: return ...`",
      debugTip:
        "Test your function with these inputs: [], [1], \"\", 0. Do they all return something reasonable?",
      conceptGap:
        "Always handle edge cases FIRST in your function. It makes the main logic cleaner and prevents crashes.",
    };
  }

  // Check for single element
  if (
    failingInputs.some((i) => {
      try {
        const parsed = JSON.parse(i.split("\n")[0]);
        return Array.isArray(parsed) && parsed.length === 1;
      } catch {
        return false;
      }
    })
  ) {
    return {
      type: "missing-edge-case-single",
      severity: "moderate",
      title: `${passed}/${total} passed — single element case fails`,
      explanation:
        "Your code fails when the input has just one element. This often happens when your logic assumes at least 2 elements exist.",
      hint: "Check: do you access `arr[1]` without verifying the array has at least 2 elements? Do you initialize with `arr[0]` and loop from index 1?",
      debugTip:
        "Walk through your code with input `[5]`. Does every array access stay in bounds?",
    };
  }

  // Check for negative numbers
  if (failingInputs.some((i) => i.includes("-"))) {
    return {
      type: "missing-edge-case-negative",
      severity: "moderate",
      title: `${passed}/${total} passed — negative numbers cause issues`,
      explanation:
        "Your logic works for positive numbers but fails with negatives. This is a very common interview gotcha.",
      hint: 'Think about: does your comparison logic still work when values are negative? Are you using `abs()` when you should? Is your initial value (like `max_val = 0`) too high or too low?',
      debugTip:
        'Initialize max values to `-float("inf")` and min values to `float("inf")` instead of 0.',
    };
  }

  // Check for duplicate values
  if (
    failingInputs.some((i) => {
      try {
        const parsed = JSON.parse(i.split("\n")[0]);
        return Array.isArray(parsed) && new Set(parsed).size < parsed.length;
      } catch {
        return false;
      }
    })
  ) {
    return {
      type: "missing-edge-case-duplicate",
      severity: "moderate",
      title: `${passed}/${total} passed — duplicate values cause issues`,
      explanation:
        "Your code fails when the input contains duplicate values. This might mean your deduplication or comparison logic isn't handling repeats correctly.",
      hint: "Are you using a set where you should use a dict (to track counts)? Or skipping duplicates when you shouldn't?",
      debugTip:
        "Test with inputs like [1,1,1], [2,2,3,3]. Does your code handle them correctly?",
    };
  }

  // Generic partial success
  return {
    type: "partial-correct",
    severity: "moderate",
    title: `${passed}/${total} test cases passed`,
    explanation:
      "Your core logic is working but it doesn't handle all cases. Look at the failing test — what makes its input different from the passing tests?",
    hint: 'Common edge cases to check:\n• Empty input: [], ""\n• Single element: [5]\n• All same values: [1,1,1,1]\n• Negative numbers: [-1, -2, 3]\n• Already sorted / reverse sorted\n• Very large values',
    debugTip:
      "Compare a passing test input with the failing one. What's different? That difference is your clue.",
    conceptGap:
      'Good solutions handle ALL inputs — not just the "normal" ones. In interviews, edge cases are where points are won or lost.',
  };
}

function analyzeWrongApproach(
  failedResults: TestResultInput[],
  difficulty: string,
  category: string,
): FailureAnalysis {
  const firstFail = failedResults[0];

  // Check if they got the right values but wrong format
  if (firstFail.actual && firstFail.expected) {
    const actualClean = firstFail.actual.replace(/\s/g, "");
    const expectedClean = firstFail.expected.replace(/\s/g, "");
    if (actualClean.replace(/"/g, "'") === expectedClean.replace(/"/g, "'")) {
      return {
        type: "almost-correct",
        severity: "minor",
        title: "Almost correct — formatting mismatch",
        explanation:
          "Your answer has the right content but slightly different formatting (quotes, spaces, brackets).",
        hint: "Check: are you using `json.dumps()` when you should use `str()`? Or printing with extra quotes/spaces?",
        debugTip:
          "Print `repr(result)` to see exact formatting including hidden characters.",
      };
    }
  }

  // Category-specific wrong approach hints
  const categoryHints: Record<string, string> = {
    arrays:
      'For array problems, start by asking: "Do I need to sort first? Can I use a hash map to avoid nested loops? Would two pointers work?"',
    strings:
      "String problems often use: hash maps for character counting, sliding window for substrings, or two pointers for palindromes.",
    "linked-lists":
      "Linked list problems usually need: two pointers (fast/slow), dummy head node, or careful pointer manipulation. Draw the nodes on paper first.",
    trees:
      "Tree problems almost always use recursion. Start with: base case (null node), then think about what to do with the current node + left subtree + right subtree.",
    graphs:
      "Graph problems need BFS or DFS. Start by building an adjacency list, then traverse with a visited set.",
    "dynamic-programming":
      "DP problems need you to: (1) define the subproblem, (2) find the recurrence relation, (3) identify base cases. Start with brute force recursion, then add memoization.",
    "hash-maps":
      "If you're iterating through the same data multiple times, a hash map can probably help you look things up in O(1) instead.",
    "binary-search":
      "If the data is sorted (or the answer space is monotonic), binary search can find the answer in O(log n). Set lo and hi, check the middle, eliminate half.",
    stacks:
      'Stack problems involve matching/nesting (parentheses, HTML tags) or maintaining a monotonic sequence. If you see "nearest greater/smaller", think stack.',
    "two-pointers":
      "Two pointers work when you can make a decision about which pointer to move based on the current state. Usually requires sorted data.",
    "sliding-window":
      'Sliding window works for "contiguous subarray/substring" problems. Maintain a window, expand right, shrink left when constraint is violated.',
    backtracking:
      "Backtracking = make a choice, recurse, undo the choice. Used for: combinations, permutations, subsets, grid paths.",
  };

  return {
    type: "wrong-approach",
    severity: "major",
    title: "All test cases failed",
    explanation:
      "Your current approach isn't producing correct results. Don't worry — this is normal. Many problems require a specific technique.",
    hint:
      categoryHints[category] ||
      "Re-read the problem. Work through the first example by hand. What steps do YOU take mentally to solve it? That's your algorithm.",
    debugTip:
      "Before coding, solve the first example on paper. Write down every step. Then translate those steps into code.",
    conceptGap:
      difficulty === "easy"
        ? "Easy problems usually have a straightforward solution. Make sure you understand what the problem is actually asking."
        : "This problem likely requires a specific pattern or technique. Check the problem's category and study that pattern first.",
  };
}

// ─── Beginner-Friendly Error Translations ─────────────────────────────────────

export interface BeginnerMessage {
  plain: string;       // simple sentence a non-programmer understands
  checkList: string;   // one actionable fix
  example: string;     // concrete 1-line example
}

const BEGINNER_MESSAGES: Partial<Record<FailureType, BeginnerMessage>> = {
  "returns-none": {
    plain: "Your function is not sending back an answer — it's returning nothing.",
    checkList: "Add `return` before the value you want to give back at the end of your function.",
    example: "def add(a, b):\n    return a + b  # ← this sends the answer back",
  },
  "print-not-return": {
    plain: "You used `print()` to show the answer on screen, but the program needs you to `return` it instead.",
    checkList: "Replace `print(answer)` with `return answer` at the end of your function.",
    example: "# Wrong:   print(a + b)\n# Correct: return a + b",
  },
  "off-by-one": {
    plain: "Your answer is almost right — it's off by exactly 1 (one too many or one too few).",
    checkList: "Check where your loop starts and ends. Does it need `range(n)` or `range(n+1)`?",
    example: "# To include both ends: range(0, n+1)\n# To exclude last: range(0, n)",
  },
  "wrong-type": {
    plain: "Your answer is the right idea but the wrong type — for example, you returned a string instead of a number.",
    checkList: "Use `int()`, `str()`, or `list()` to convert your result to the correct type.",
    example: "return int(result)  # convert to integer\nreturn str(result)  # convert to text",
  },
  "wrong-order": {
    plain: "Your output has the right items but in the wrong order.",
    checkList: "Check if sorting is needed. Try `sorted(your_list)` or reverse with `your_list[::-1]`.",
    example: "return sorted(result)         # smallest first\nreturn sorted(result, reverse=True)  # largest first",
  },
  "wrong-sign": {
    plain: "Your numbers are correct but have the wrong positive/negative sign.",
    checkList: "Double-check whether to add or subtract. Try multiplying by -1 to flip the sign.",
    example: "return -result  # flip positive to negative (or vice versa)",
  },
  "missing-edge-case-empty": {
    plain: "Your code crashes or gives a wrong answer when given an empty list or empty string.",
    checkList: "Add a check at the top: `if not items: return []` (or 0, or whatever makes sense).",
    example: "def my_func(items):\n    if not items:\n        return []  # handle empty list\n    ...",
  },
  "missing-edge-case-single": {
    plain: "Your code doesn't handle a list with just one item correctly.",
    checkList: "Add a check: `if len(items) == 1: return items[0]`.",
    example: "if len(items) == 1:\n    return items[0]",
  },
  "missing-edge-case-negative": {
    plain: "Your code gives wrong results when numbers are negative.",
    checkList: "Test your code with negative numbers like -1 or -5. Use `abs()` for absolute value if needed.",
    example: "abs(-5) == 5  # True — abs() gives the positive version",
  },
  "timeout": {
    plain: "Your code is taking too long to finish — it might be looping too many times.",
    checkList: "Look for a loop inside another loop. Can you solve it with just one loop instead?",
    example: "# Slow (O(n²)): for i in list: for j in list: ...\n# Fast (O(n)):  for i in list: ...",
  },
  "infinite-loop": {
    plain: "Your loop never stops! The program ran forever and had to be shut down.",
    checkList: "Make sure your loop condition eventually becomes False, or use `break` when the goal is reached.",
    example: "while count < 10:\n    count += 1  # ← must change count so loop ends",
  },
  "index-out-of-range": {
    plain: "You tried to access a list position that doesn't exist — like asking for item 5 in a 3-item list.",
    checkList: "Valid positions in a list of length n are 0 to n-1. Check your index isn't too large.",
    example: "items = [10, 20, 30]  # valid indexes: 0, 1, 2\nitems[3]  # ❌ Index out of range!",
  },
  "syntax-error": {
    plain: "Python couldn't understand your code because of a typo or missing symbol.",
    checkList: "Look for missing colons `:`, unmatched brackets `()[]{}`, or wrong indentation.",
    example: "def greet():    # ← colon is required\n    print('Hi')  # ← indentation is required",
  },
  "type-error": {
    plain: "You tried to do something impossible — like adding a number to text.",
    checkList: "Check that you're using the right variable types. Use `type(variable)` to see what type it is.",
    example: "# Error: 5 + 'hello'\n# Fix:   5 + int('3')  or  str(5) + 'hello'",
  },
  "division-by-zero": {
    plain: "Your code tried to divide by zero, which is mathematically impossible.",
    checkList: "Add a check before dividing: `if divisor != 0:` to protect against zero.",
    example: "if b != 0:\n    result = a / b\nelse:\n    result = 0  # or handle it another way",
  },
};

/**
 * Returns a plain-English explanation for a given failure type.
 * Designed for Phase 1 beginners with zero programming experience.
 */
export function getBeginnerMessage(type: FailureType): BeginnerMessage | null {
  return BEGINNER_MESSAGES[type] ?? null;
}
