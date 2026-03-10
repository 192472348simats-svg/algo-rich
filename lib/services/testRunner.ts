// Test runner service for executing user code against structured test cases
// Uses the Pyodide web worker for Python execution

import type { TestCase, TestResult, SubmissionResult } from "@/lib/types/problem";

/**
 * Build Python code that calls the user's function with test case inputs
 * and prints the result as JSON for comparison.
 */
export function buildTestCode(
  userCode: string,
  functionName: string,
  testCase: TestCase
): string {
  // Build argument string from input object
  const args = Object.entries(testCase.input)
    .map(([, value]) => JSON.stringify(value))
    .join(", ");

  return `
import json

# ──── User Code ────
${userCode}

# ──── Test Execution ────
try:
    __result = ${functionName}(${args})
    # Normalize output to JSON string for comparison
    print(json.dumps(__result))
except Exception as __e:
    print(f"__ERROR__:{type(__e).__name__}: {__e}")
`;
}

/**
 * Compare actual output to expected output with deep equality.
 * Handles arrays, numbers, strings, booleans, and nested structures.
 */
export function validateOutput(actual: unknown, expected: unknown): boolean {
  // Exact match
  if (actual === expected) return true;

  // Handle null/undefined
  if (actual == null || expected == null) return actual == expected;

  // Numeric comparison with epsilon for floats
  if (typeof actual === "number" && typeof expected === "number") {
    if (Number.isInteger(actual) && Number.isInteger(expected)) {
      return actual === expected;
    }
    return Math.abs(actual - expected) < 1e-6;
  }

  // Boolean comparison
  if (typeof actual === "boolean" && typeof expected === "boolean") {
    return actual === expected;
  }

  // String comparison
  if (typeof actual === "string" && typeof expected === "string") {
    return actual.trim() === expected.trim();
  }

  // Array comparison (order matters)
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    return actual.every((val, idx) => validateOutput(val, expected[idx]));
  }

  // Object comparison
  if (typeof actual === "object" && typeof expected === "object") {
    const actualObj = actual as Record<string, unknown>;
    const expectedObj = expected as Record<string, unknown>;
    const keys1 = Object.keys(actualObj);
    const keys2 = Object.keys(expectedObj);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(
      (key) => key in expectedObj && validateOutput(actualObj[key], expectedObj[key])
    );
  }

  return false;
}

/**
 * Parse the raw output from Pyodide execution.
 * Returns the parsed value or an error string.
 */
export function parseOutput(raw: string): { value: unknown; error?: string } {
  const trimmed = raw.trim();

  // Check for runtime error
  if (trimmed.startsWith("__ERROR__:")) {
    return { value: null, error: trimmed.replace("__ERROR__:", "") };
  }

  // Empty output means the function returned None
  if (!trimmed) {
    return { value: null };
  }

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(trimmed);
    return { value: parsed };
  } catch {
    // If it's not valid JSON, return as string
    // Handle Python-specific outputs
    const normalized = trimmed
      .replace(/^True$/i, "true")
      .replace(/^False$/i, "false")
      .replace(/^None$/i, "null")
      .replace(/'/g, '"');

    try {
      return { value: JSON.parse(normalized) };
    } catch {
      return { value: trimmed };
    }
  }
}

/**
 * Process a single test result from Pyodide output.
 */
export function processTestResult(
  index: number,
  rawOutput: string,
  testCase: TestCase,
  executionTime: number
): TestResult {
  const { value: actualOutput, error } = parseOutput(rawOutput);

  if (error) {
    return {
      testCaseIndex: index,
      passed: false,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      executionTime,
      error,
    };
  }

  const passed = validateOutput(actualOutput, testCase.expectedOutput);

  return {
    testCaseIndex: index,
    passed,
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput,
    executionTime,
    error: undefined,
  };
}

/**
 * Aggregate individual test results into a submission result.
 */
export function aggregateResults(results: TestResult[]): SubmissionResult {
  const passedTests = results.filter((r) => r.passed).length;
  const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0);

  return {
    success: passedTests === results.length,
    totalTests: results.length,
    passedTests,
    failedTests: results.length - passedTests,
    results,
    executionTime: totalTime,
  };
}

/**
 * Detect the main function name from user code.
 * Looks for `def function_name(` pattern.
 */
export function detectFunctionName(code: string): string | null {
  // Match the last top-level def (skip helpers)
  const matches = code.match(/^def\s+(\w+)\s*\(/gm);
  if (!matches || matches.length === 0) return null;

  // Return first def found (most likely the main function)
  const firstMatch = matches[0].match(/^def\s+(\w+)/);
  return firstMatch ? firstMatch[1] : null;
}

/**
 * Build test cases in the old format for backward compatibility with
 * the existing Pyodide worker's test case runner.
 */
export function buildLegacyTestCases(
  userCode: string,
  functionName: string,
  testCases: TestCase[]
): { input: string; expectedOutput: string; functionCall: string }[] {
  return testCases.map((tc) => {
    const args = Object.entries(tc.input)
      .map(([, value]) => JSON.stringify(value))
      .join(", ");

    return {
      input: args,
      expectedOutput: JSON.stringify(tc.expectedOutput),
      functionCall: `print(json.dumps(${functionName}(${args})))`,
    };
  });
}
