/** Remove the stdin/stdout harness appended to seeded Python functions. */
export function stripPythonExecutionHarness(code: string): string {
  const firstDefinition = code.search(/^\s*(?:def|class)\s+\w+/m);
  if (firstDefinition < 0) return code.trimEnd();

  const suffix = code.slice(firstDefinition);
  const harnessMarker = suffix.search(/\n\s*import\s+(?:json|sys)\b/);
  if (harnessMarker < 0) return code.trimEnd();

  const markerIndex = firstDefinition + harnessMarker;
  const harness = code.slice(markerIndex);
  return /\binput\s*\(/.test(harness) ? code.slice(0, markerIndex).trimEnd() : code.trimEnd();
}

export function parseTestInput(input: unknown): unknown {
  if (typeof input !== "string") return input;
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}

export function comparableOutput(actualOutput: string, expectedOutput: unknown): boolean {
  const actualText = actualOutput.trim();
  const expectedText = typeof expectedOutput === "string" ? expectedOutput.trim() : JSON.stringify(expectedOutput);

  try {
    const actual = JSON.parse(actualText);
    try {
      return JSON.stringify(actual) === JSON.stringify(JSON.parse(expectedText));
    } catch {
      if (typeof expectedOutput === "string" && actual === expectedOutput) return true;
      if (actual === true && expectedText === "True") return true;
      if (actual === false && expectedText === "False") return true;
      if (actual === null && expectedText === "None") return true;
      return false;
    }
  } catch {
    if (actualText === "True" && expectedOutput === true) return true;
    if (actualText === "False" && expectedOutput === false) return true;
    if (actualText === "None" && expectedOutput === null) return true;
    return actualText === expectedText;
  }
}
