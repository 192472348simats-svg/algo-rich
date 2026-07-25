"use client";

import { useState, useCallback } from "react";

export interface TestCase {
  input: Record<string, unknown> | string;
  expectedOutput: unknown;
  functionCall?: string;
}

export interface TestResult {
  index: number;
  passed: boolean;
  input: Record<string, unknown> | string;
  expectedOutput: unknown;
  actualOutput: unknown;
}

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
  testResults: TestResult[] | null;
}

type PyodideStatus = "idle" | "loading" | "ready" | "running" | "error";

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

async function pistonRun(code: string): Promise<{ stdout: string; stderr: string; code: number }> {
  const res = await fetch(PISTON_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "python",
      version: "3.10",
      files: [{ content: code }],
    }),
  });
  if (!res.ok) throw new Error(`Piston API error: ${res.status}`);
  const data = await res.json();
  return {
    stdout: data.run?.stdout ?? "",
    stderr: data.run?.stderr ?? "",
    code: data.run?.code ?? 0,
  };
}

export function usePyodide() {
  const [status, setStatus] = useState<PyodideStatus>("ready");
  // Keep these props for API compatibility with existing components
  const pyodideProgress = 100;
  const pyodideMessage = "Python ready (Piston)";

  const runCode = useCallback(
    async (
      code: string,
      testCases?: TestCase[],
      functionName?: string
    ): Promise<ExecutionResult> => {
      setStatus("running");
      const startTime = performance.now();

      try {
        // ── 1. Run the user's code (plain stdout capture) ──────────────
        const { stdout, stderr, code: exitCode } = await pistonRun(code);
        const elapsed = Math.round(performance.now() - startTime);

        const output = stdout.trimEnd();
        const error = exitCode !== 0 ? (stderr || "Runtime error").trim() : (stderr.trim() || null);

        // ── 2. Run test cases if provided ──────────────────────────────
        let testResults: TestResult[] | null = null;

        if (testCases && testCases.length > 0) {
          testResults = [];

          // Resolve function name from code
          const funcMatch = code.match(/def\s+(\w+)\s*\(/);
          const funcName = functionName ?? (funcMatch ? funcMatch[1] : "solve");

          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            let testCode = "";

            if (typeof tc.input === "object" && tc.input !== null) {
              const args = Object.values(tc.input)
                .map((v) => JSON.stringify(v))
                .join(", ");
              testCode = `${code}\nimport json\n__result = ${funcName}(${args})\nprint(json.dumps(__result))`;
            } else if (tc.input) {
              testCode = `${code}\n${tc.functionCall ?? `print(${tc.input})`}`;
            }

            if (!testCode) {
              testResults.push({
                index: i + 1,
                passed: false,
                input: typeof tc.input === "object" ? JSON.stringify(tc.input) : (tc.input || ""),
                expectedOutput: String(tc.expectedOutput),
                actualOutput: "",
              });
              continue;
            }

            try {
              const { stdout: tOut, stderr: tErr, code: tCode } = await pistonRun(testCode);
              const testOutput = tOut.trim();
              const expectedVal = tc.expectedOutput;

              let passed = false;
              try {
                const actualParsed = JSON.parse(testOutput);
                const expectedParsed =
                  typeof expectedVal === "string" ? JSON.parse(expectedVal) : expectedVal;
                passed = JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
              } catch {
                passed =
                  testOutput ===
                  (typeof expectedVal === "string"
                    ? expectedVal.trim()
                    : JSON.stringify(expectedVal));
              }

              testResults.push({
                index: i + 1,
                passed,
                input:
                  typeof tc.input === "object"
                    ? JSON.stringify(tc.input)
                    : (tc.input || ""),
                expectedOutput:
                  typeof expectedVal === "object"
                    ? JSON.stringify(expectedVal)
                    : String(expectedVal),
                actualOutput: tCode !== 0 ? `Error: ${tErr}` : testOutput,
              });
            } catch (e) {
              testResults.push({
                index: i + 1,
                passed: false,
                input:
                  typeof tc.input === "object"
                    ? JSON.stringify(tc.input)
                    : (tc.input || ""),
                expectedOutput: String(tc.expectedOutput),
                actualOutput: `Error: ${(e as Error).message}`,
              });
            }
          }
        }

        setStatus("ready");
        return { output, error, executionTime: elapsed, testResults };
      } catch (e) {
        setStatus("ready");
        return {
          output: "",
          error: `Execution failed: ${(e as Error).message}`,
          executionTime: Math.round(performance.now() - startTime),
          testResults: null,
        };
      }
    },
    []
  );

  return { status, runCode, pyodideProgress, pyodideMessage };
}
