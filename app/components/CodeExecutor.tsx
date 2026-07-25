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

// Judge0 CE — free, no API key, no signup
// Language ID 71 = Python 3 (CPython 3.11.2)
const JUDGE0_URL = "https://ce.judge0.com/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,status,compile_output,time";
const PYTHON_LANG_ID = 71;

function b64encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function b64decode(str: string): string {
  if (!str) return "";
  return decodeURIComponent(escape(atob(str)));
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
  time: string | null;
}

async function judge0Run(code: string): Promise<{ stdout: string; stderr: string; exitOk: boolean; ms: number }> {
  const res = await fetch(JUDGE0_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_code: b64encode(code),
      language_id: PYTHON_LANG_ID,
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
  });

  if (!res.ok) throw new Error(`Judge0 error: ${res.status} ${res.statusText}`);

  const data: Judge0Result = await res.json();
  const stdout = b64decode(data.stdout ?? "");
  const stderr = b64decode(data.stderr ?? "") || b64decode(data.compile_output ?? "");
  const ms = Math.round(parseFloat(data.time ?? "0") * 1000);
  // Status IDs: 3 = Accepted, anything else = error
  const exitOk = data.status.id === 3;
  return { stdout, stderr, exitOk, ms };
}

export function usePyodide() {
  const [status, setStatus] = useState<PyodideStatus>("ready");
  // Kept for API compatibility with existing components
  const pyodideProgress = 100;
  const pyodideMessage = "Python ready";

  const runCode = useCallback(
    async (
      code: string,
      testCases?: TestCase[],
      functionName?: string
    ): Promise<ExecutionResult> => {
      setStatus("running");
      const startTime = performance.now();

      try {
        // ── 1. Run user code ──────────────────────────────────────────
        const { stdout, stderr, exitOk, ms } = await judge0Run(code);

        const output = stdout.trimEnd();
        const error = !exitOk ? (stderr || "Runtime error").trim() : (stderr.trim() || null);

        // ── 2. Run test cases ─────────────────────────────────────────
        let testResults: TestResult[] | null = null;

        if (testCases && testCases.length > 0) {
          testResults = [];

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
              const { stdout: tOut, stderr: tErr, exitOk: tOk } = await judge0Run(testCode);
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
                  typeof tc.input === "object" ? JSON.stringify(tc.input) : (tc.input || ""),
                expectedOutput:
                  typeof expectedVal === "object"
                    ? JSON.stringify(expectedVal)
                    : String(expectedVal),
                actualOutput: !tOk ? `Error: ${tErr}` : testOutput,
              });
            } catch (e) {
              testResults.push({
                index: i + 1,
                passed: false,
                input:
                  typeof tc.input === "object" ? JSON.stringify(tc.input) : (tc.input || ""),
                expectedOutput: String(tc.expectedOutput),
                actualOutput: `Error: ${(e as Error).message}`,
              });
            }
          }
        }

        setStatus("ready");
        return { output, error, executionTime: ms || Math.round(performance.now() - startTime), testResults };
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
