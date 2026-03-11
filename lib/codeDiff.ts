export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNum: number;
}

/**
 * Simple line-based diff between two strings.
 * Returns a unified diff showing added/removed/unchanged lines.
 */
export function simpleLineDiff(oldCode: string, newCode: string): DiffLine[] {
  const oldLines = oldCode.split("\n");
  const newLines = newCode.split("\n");
  const result: DiffLine[] = [];

  // LCS-based approach: find common lines and mark differences
  const lcs = buildLCS(oldLines, newLines);
  let oi = 0;
  let ni = 0;
  let li = 0;

  while (oi < oldLines.length || ni < newLines.length) {
    if (
      oi < oldLines.length &&
      ni < newLines.length &&
      li < lcs.length &&
      oldLines[oi] === lcs[li] &&
      newLines[ni] === lcs[li]
    ) {
      result.push({ type: "unchanged", content: oldLines[oi], lineNum: ni + 1 });
      oi++;
      ni++;
      li++;
    } else if (ni < newLines.length && (li >= lcs.length || newLines[ni] !== lcs[li])) {
      result.push({ type: "added", content: newLines[ni], lineNum: ni + 1 });
      ni++;
    } else if (oi < oldLines.length) {
      result.push({ type: "removed", content: oldLines[oi], lineNum: oi + 1 });
      oi++;
    }
  }

  return result;
}

function buildLCS(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  // For large files, limit to avoid performance issues
  if (m * n > 100000) return [];
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const lcs: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs;
}
