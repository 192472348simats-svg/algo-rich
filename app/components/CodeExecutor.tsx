"use client";

import { useRef, useState, useCallback, useEffect } from "react";

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

export function usePyodide() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<PyodideStatus>("loading");
  const [pyodideProgress, setPyodideProgress] = useState(0);
  const [pyodideMessage, setPyodideMessage] = useState("Initializing Python environment...");
  const callbacksRef = useRef<Map<string, (result: ExecutionResult) => void>>(
    new Map()
  );
  const idCounterRef = useRef(0);

  // Initialize worker
  useEffect(() => {
    const worker = new Worker("/pyodide-worker.js");
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, id, ...data } = e.data;

      switch (type) {
        case "loading":
          setStatus("loading");
          if (typeof data.progress === "number") setPyodideProgress(data.progress);
          if (data.message) setPyodideMessage(data.message);
          break;
        case "ready":
          setStatus("ready");
          setPyodideProgress(100);
          setPyodideMessage("Python ready!");
          break;
        case "error":
          setStatus("error");
          // Resolve pending callback with error
          const errCb = callbacksRef.current.get(id);
          if (errCb) {
            errCb({
              output: "",
              error: data.error,
              executionTime: 0,
              testResults: null,
            });
            callbacksRef.current.delete(id);
          }
          break;
        case "result":
          setStatus("ready");
          const cb = callbacksRef.current.get(id);
          if (cb) {
            cb({
              output: data.output,
              error: data.error,
              executionTime: data.executionTime,
              testResults: data.testResults,
            });
            callbacksRef.current.delete(id);
          }
          break;
      }
    };

    // Start initialization
    worker.postMessage({ type: "init", id: "init" });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const runCode = useCallback(
    (code: string, testCases?: TestCase[], functionName?: string): Promise<ExecutionResult> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error("Worker not initialized"));
          return;
        }

        const id = `run-${++idCounterRef.current}`;
        setStatus("running");

        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
          callbacksRef.current.delete(id);
          setStatus("ready");
          resolve({
            output: "",
            error: "Execution timed out (10s limit)",
            executionTime: 10000,
            testResults: null,
          });
        }, 10000);

        callbacksRef.current.set(id, (result) => {
          clearTimeout(timeout);
          resolve(result);
        });

        workerRef.current.postMessage({ type: "run", id, code, testCases, functionName });
      });
    },
    []
  );

  return { status, runCode, pyodideProgress, pyodideMessage };
}
