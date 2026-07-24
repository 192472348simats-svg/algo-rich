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
  const isMountedRef = useRef(false);

  const failPendingRuns = useCallback((error: string) => {
    const result: ExecutionResult = {
      output: "",
      error,
      executionTime: 0,
      testResults: null,
    };

    for (const callback of callbacksRef.current.values()) {
      callback(result);
    }
    callbacksRef.current.clear();
  }, []);

  const startWorker = useCallback(() => {
    const worker = new Worker("/pyodide-worker.js");
    workerRef.current = worker;

    worker.onmessage = (e) => {
      // Ignore messages from a terminated worker after it has been replaced.
      if (workerRef.current !== worker) return;

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
        case "error": {
          const errCb = callbacksRef.current.get(id);
          if (errCb) {
            setStatus("ready");
            errCb({
              output: "",
              error: data.error || "Python execution failed",
              executionTime: 0,
              testResults: null,
            });
            callbacksRef.current.delete(id);
          } else {
            // An initialization failure needs an explicit retry rather than leaving a
            // seemingly-ready but unusable worker behind.
            setStatus("error");
          }
          break;
        }
        case "result": {
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

          // The worker closes itself when its memory guard fires. Mark it unusable so
          // the next execution cannot be posted to a dead worker, then replace it.
          if (typeof data.error === "string" && /memory limit exceeded|worker terminated/i.test(data.error)) {
            worker.terminate();
            workerRef.current = null;
            setStatus("loading");
            setPyodideProgress(0);
            setPyodideMessage("Restarting Python environment after a memory limit...");
            setTimeout(() => {
              if (isMountedRef.current && !workerRef.current) startWorker();
            }, 0);
          }
          break;
        }
      }
    };

    worker.onerror = () => {
      if (workerRef.current !== worker) return;
      workerRef.current = null;
      setStatus("error");
      failPendingRuns("Python worker crashed. Please retry your code.");
    };

    worker.postMessage({ type: "init", id: "init" });
  }, [failPendingRuns]);

  const restartWorker = useCallback((message: string) => {
    const worker = workerRef.current;
    if (worker) worker.terminate();
    workerRef.current = null;
    failPendingRuns(message);

    if (!isMountedRef.current) return;
    setStatus("loading");
    setPyodideProgress(0);
    setPyodideMessage("Restarting Python environment...");
    startWorker();
  }, [failPendingRuns, startWorker]);

  // Initialize worker
  useEffect(() => {
    isMountedRef.current = true;
    startWorker();

    return () => {
      isMountedRef.current = false;
      workerRef.current?.terminate();
      workerRef.current = null;
      failPendingRuns("Python environment was closed.");
    };
  }, [failPendingRuns, startWorker]);

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
          resolve({
            output: "",
            error: "Execution timed out (10s limit)",
            executionTime: 10000,
            testResults: null,
          });
          // A synchronous loop can leave the worker unable to process another message.
          // Terminate it and eagerly start a clean runtime for the next attempt.
          restartWorker("Python environment restarted after a timed-out execution.");
        }, 10000);

        callbacksRef.current.set(id, (result) => {
          clearTimeout(timeout);
          resolve(result);
        });

        workerRef.current.postMessage({ type: "run", id, code, testCases, functionName });
      });
    },
    [restartWorker]
  );

  return { status, runCode, pyodideProgress, pyodideMessage };
}
