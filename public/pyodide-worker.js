/* eslint-disable no-restricted-globals */

// Pyodide Web Worker – runs Python code off the main thread
// Communication via postMessage / onmessage

let pyodide = null;
let pyodideReady = false;

async function loadPyodideRuntime() {
  if (pyodide) return pyodide;

  // Load Pyodide from CDN
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

  pyodide = await self.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
  });

  pyodideReady = true;
  return pyodide;
}

// Send status updates to main thread
function sendMessage(type, data) {
  self.postMessage({ type, ...data });
}

self.onmessage = async function (e) {
  const { id, type, code, testCases, functionName } = e.data;

  if (type === "init") {
    try {
      sendMessage("loading", { id });
      await loadPyodideRuntime();
      sendMessage("ready", { id });
    } catch (err) {
      sendMessage("error", { id, error: `Failed to load Python: ${err.message}` });
    }
    return;
  }

  if (type === "run") {
    try {
      if (!pyodideReady) {
        await loadPyodideRuntime();
      }

      const startTime = performance.now();

      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
__stdout_capture = StringIO()
sys.stdout = __stdout_capture
sys.stderr = __stdout_capture
`);

      // Run user code with timeout
      try {
        pyodide.runPython(code);
      } catch (pyErr) {
        // Get any partial output
        const partialOutput = pyodide.runPython("__stdout_capture.getvalue()");
        // Reset stdout
        pyodide.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");

        const elapsed = performance.now() - startTime;
        sendMessage("result", {
          id,
          output: partialOutput || "",
          error: pyErr.message,
          executionTime: Math.round(elapsed),
          testResults: null,
        });
        return;
      }

      // Get captured output
      const output = pyodide.runPython("__stdout_capture.getvalue()");
      // Reset stdout
      pyodide.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");

      const elapsed = performance.now() - startTime;

      // Run test cases if provided
      let testResults = null;
      if (testCases && testCases.length > 0) {
        testResults = [];
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          try {
            // Capture stdout for each test
            pyodide.runPython(`
import sys
from io import StringIO
__test_capture = StringIO()
sys.stdout = __test_capture
sys.stderr = __test_capture
`);

            // Build test execution code
            let testCode;
            if (typeof tc.input === 'object' && tc.input !== null) {
              // Structured test case — use provided function name, or detect from code
              let funcName = functionName;
              if (!funcName) {
                const funcMatch = code.match(/def\s+(\w+)\s*\(/);
                funcName = funcMatch ? funcMatch[1] : 'solve';
              }
              const args = Object.values(tc.input).map(v => JSON.stringify(v)).join(', ');
              testCode = `${code}\n\nimport json\n__result = ${funcName}(${args})\nprint(json.dumps(__result))`;
            } else if (tc.input) {
              testCode = `${code}\n\n# Test execution\n__result = ${tc.functionCall || `print(${tc.input})`}`;
            } else {
              testCode = code;
            }

            pyodide.runPython(testCode);
            const testOutput = pyodide.runPython("__test_capture.getvalue()").trim();
            pyodide.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");

            // Compare outputs — handle both string and structured expectedOutput
            let passed;
            const expectedVal = tc.expectedOutput;
            try {
              const actualParsed = JSON.parse(testOutput);
              const expectedParsed = typeof expectedVal === 'string' ? JSON.parse(expectedVal) : expectedVal;
              passed = JSON.stringify(actualParsed) === JSON.stringify(expectedParsed);
            } catch {
              passed = testOutput === (typeof expectedVal === 'string' ? expectedVal.trim() : JSON.stringify(expectedVal));
            }

            const inputDisplay = typeof tc.input === 'object' ? JSON.stringify(tc.input) : (tc.input || "");
            const expectedDisplay = typeof expectedVal === 'object' ? JSON.stringify(expectedVal) : String(expectedVal);
            testResults.push({
              index: i + 1,
              passed,
              input: inputDisplay,
              expectedOutput: expectedDisplay,
              actualOutput: testOutput,
            });
          } catch (testErr) {
            pyodide.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
            const inputDisplay = typeof tc.input === 'object' ? JSON.stringify(tc.input) : (tc.input || "");
            const expectedDisplay = typeof tc.expectedOutput === 'object' ? JSON.stringify(tc.expectedOutput) : String(tc.expectedOutput);
            testResults.push({
              index: i + 1,
              passed: false,
              input: inputDisplay,
              expectedOutput: expectedDisplay,
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
