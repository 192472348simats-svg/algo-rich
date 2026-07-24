/* eslint-disable no-restricted-globals */

// public/pyodide-worker.js - SECURITY HARDENED VERSION
// Pyodide Web Worker – runs Python code off the main thread

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
  MAX_EXECUTION_TIME_MS: 10000,  // 10 seconds
  MAX_MEMORY_GROWTH_MB: 500,      // 500MB heap growth
  MAX_PYTHON_STEPS: 100000,       // Instruction limit
  MAX_OUTPUT_LENGTH: 1000000,     // 1MB output
  INDEX_URL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
};

// ==========================================
// SECURITY: FORBIDDEN PATTERNS
// ==========================================
const FORBIDDEN_PATTERNS = [
  // Direct imports of dangerous modules
  /import\s+os/i,
  /import\s+subprocess/i,
  /import\s+pty/i,
  /import\s+socket/i,
  /import\s+requests/i,
  /import\s+urllib/i,
  /import\s+http/i,
  /import\s+ftplib/i,
  /import\s+smtplib/i,
  // Dynamic imports
  /__import__\s*\(/i,
  /importlib/i,
  /__import_module__/i,
  // Object introspection attacks
  /__bases__/i,
  /__subclasses__/i,
  /__globals__/i,
  /__getattribute__/i,
  /__class__\s*\.\s*__bases__/i,
  // File operations targeting system paths
  /open\s*\(\s*['"][^'"]*\/etc\//i,
  /open\s*\(\s*['"][^'"]*\/proc\//i,
  /open\s*\(\s*['"][^'"]*C:\\\\Windows/i,
  // Shell escapes
  /os\.system/i,
  /os\.popen/i,
  /subprocess\.call/i,
  /subprocess\.Popen/i,
];

let pyodide = null;
let pyodideReady = false;

// Send status updates to main thread
function sendMessage(type, data) {
  self.postMessage({ type, ...data });
}

async function loadPyodideRuntime(id) {
  if (pyodide) return pyodide;

  // Load Pyodide from CDN
  sendMessage("loading", { id, progress: 25, message: "Downloading Python runtime (~8 MB)..." });
  importScripts(CONFIG.INDEX_URL + "pyodide.js");

  sendMessage("loading", { id, progress: 60, message: "Compiling standard library..." });
  pyodide = await self.loadPyodide({
    indexURL: CONFIG.INDEX_URL,
  });

  sendMessage("loading", { id, progress: 90, message: "Warming up interpreter..." });
  pyodide.runPython("1 + 1");

  pyodideReady = true;
  return pyodide;
}

function securityCheck(code) {
  const violations = [];
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      violations.push(pattern.toString());
    }
  }
  if (violations.length > 0) {
    return {
      safe: false,
      error: `Security violation: Forbidden pattern detected. For security, Algo Rich sandboxes are restricted.`,
      details: violations
    };
  }
  return { safe: true };
}

// ==========================================
// MEMORY MONITORING
// ==========================================
function createMemoryMonitor(id) {
  if (!performance.memory) {
    console.warn('Memory monitoring not available in this browser');
    return null;
  }
  
  const startHeap = performance.memory.usedJSHeapSize;
  
  const interval = setInterval(() => {
    const current = performance.memory.usedJSHeapSize;
    const growth = (current - startHeap) / (1024 * 1024); // MB
    
    if (growth > CONFIG.MAX_MEMORY_GROWTH_MB) {
      clearInterval(interval);
      // We can't easily "throw" out of the Python execution from here, 
      // but we can kill the worker if we have to. 
      // For now, we report it and the next execution will be blocked if we kill it.
      sendMessage("result", {
        id,
        output: "Memory limit exceeded. Worker terminated.",
        error: `Memory limit exceeded: ${growth.toFixed(1)}MB growth`,
        executionTime: 0,
      });
      self.close();
    }
  }, 100);
  
  return {
    stop: () => {
      clearInterval(interval);
    }
  };
}

self.onmessage = async function (e) {
  const { id, type, code, testCases, functionName } = e.data;

  if (type === "init") {
    try {
      sendMessage("loading", { id, progress: 10, message: "Initializing Python environment..." });
      await loadPyodideRuntime(id);
      sendMessage("ready", { id, progress: 100, message: "Python ready!" });
    } catch (err) {
      sendMessage("error", { id, error: `Failed to load Python: ${err.message}` });
    }
    return;
  }

  if (type === "run") {
    try {
      if (!pyodideReady) {
        await loadPyodideRuntime(id);
      }

      // 1. Security check
      const security = securityCheck(code);
      if (!security.safe) {
        sendMessage("result", {
          id,
          output: "",
          error: security.error,
          executionTime: 0,
          testResults: null,
        });
        return;
      }

      const memoryMonitor = createMemoryMonitor(id);
      const startTime = performance.now();

      // 2. Setup stdout/stderr capture via Pyodide JS API (immune to sys.settrace)
      let capturedOutput = "";
      pyodide.setStdout({ batched: (text) => { capturedOutput += text + "\n"; } });
      pyodide.setStderr({ batched: (text) => { capturedOutput += text + "\n"; } });

      // Setup step limiter (trace only — stdout goes through JS bridge, not affected)
      pyodide.runPython(`
import sys
import time

class StepLimiter:
    def __init__(self, limit):
        self.limit = limit
        self.count = 0
        self.start_time = time.time()

    def trace(self, frame, event, arg):
        self.count += 1
        if self.count > self.limit:
            raise RuntimeError(f"Step limit exceeded: {self.limit} instructions")
        if time.time() - self.start_time > 10:
            raise TimeoutError("Execution timed out (10s limit)")
        return self.trace

__limiter = StepLimiter(${CONFIG.MAX_PYTHON_STEPS})
sys.settrace(__limiter.trace)
`);

      // 3. Run user code
      try {
        await pyodide.runPythonAsync(code);
      } finally {
        pyodide.runPython("sys.settrace(None)");
      }

      const elapsed = performance.now() - startTime;
      if (memoryMonitor) memoryMonitor.stop();

      // 4. Get results — output was captured via JS callback
      let output = capturedOutput.trimEnd();
      const TRUNCATION_LIMIT = 100 * 1024;
      if (output.length > TRUNCATION_LIMIT) {
        output = output.slice(0, TRUNCATION_LIMIT) + "\n... (truncated)";
      }

      // Reset stdout to default
      pyodide.setStdout({ batched: (text) => console.log("[py]", text) });
      pyodide.setStderr({ batched: (text) => console.warn("[py]", text) });

      // 5. Run test cases
      let testResults = null;
      if (testCases && testCases.length > 0) {
        testResults = [];
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          try {
            // Capture test output via JS-level stdout (immune to sys.settrace)
            let testCaptured = "";
            pyodide.setStdout({ batched: (text) => { testCaptured += text + "\n"; } });
            pyodide.setStderr({ batched: (text) => { testCaptured += text + "\n"; } });

            let testCode;
            if (typeof tc.input === 'object' && tc.input !== null) {
              let funcName = functionName;
              if (!funcName) {
                const funcMatch = code.match(/def\s+(\w+)\s*\(/);
                funcName = funcMatch ? funcMatch[1] : 'solve';
              }
              const args = Object.values(tc.input).map(v => JSON.stringify(v)).join(', ');
              testCode = `import json\n__result = ${funcName}(${args})\nprint(json.dumps(__result))`;
            } else if (tc.input) {
              testCode = `__result = ${tc.functionCall || `print(${tc.input})`}`;
            } else {
              testCode = "";
            }

            if (testCode) {
               // Re-enable step limiting for tests
               pyodide.runPython(`__limiter.count = 0; __limiter.start_time = time.time(); sys.settrace(__limiter.trace)`);
               try {
                 await pyodide.runPythonAsync(testCode);
               } finally {
                 pyodide.runPython("sys.settrace(None)");
               }
            }

            // Reset stdout back to default
            pyodide.setStdout({ batched: (text) => console.log("[py]", text) });
            pyodide.setStderr({ batched: (text) => console.warn("[py]", text) });

            const testOutput = testCaptured.trim();

            let passed;
            const expectedVal = tc.expectedOutput;
            try {
              const actualParsed = JSON.parse(testOutput);
              const expectedParsed = typeof expectedVal === 'string' ? JSON.parse(expectedVal) : expectedVal;
              passed = JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
            } catch {
              passed = testOutput === (typeof expectedVal === 'string' ? expectedVal.trim() : JSON.stringify(expectedVal));
            }

            testResults.push({
              index: i + 1,
              passed,
              input: typeof tc.input === 'object' ? JSON.stringify(tc.input) : (tc.input || ""),
              expectedOutput: typeof expectedVal === 'object' ? JSON.stringify(expectedVal) : String(expectedVal),
              actualOutput: testOutput,
            });
          } catch (testErr) {
            pyodide.setStdout({ batched: (text) => console.log("[py]", text) });
            pyodide.setStderr({ batched: (text) => console.warn("[py]", text) });
            testResults.push({
              index: i + 1,
              passed: false,
              input: typeof tc.input === 'object' ? JSON.stringify(tc.input) : (tc.input || ""),
              expectedOutput: typeof tc.expectedOutput === 'object' ? JSON.stringify(tc.expectedOutput) : String(tc.expectedOutput),
              actualOutput: `Error: ${testErr.message}`,
            });
          }
        }
      }


      sendMessage("result", {
        id,
        output: output || "",
        error: null,
        executionTime: Math.round(elapsed),
        testResults,
      });

    } catch (err) {
      sendMessage("result", {
        id,
        output: "",
        error: err.message,
        executionTime: 0,
        testResults: null,
      });
    }
  }
};
