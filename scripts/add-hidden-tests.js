// Script to add hiddenTestCases to all problems in seed-problems-150.ts
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../prisma/seed-problems-150.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Map of slug -> hiddenTestCases (2 edge cases each)
const hiddenTestsMap = {
  "move-zeroes": `hiddenTestCases: JSON.stringify([
        { input: { nums: [] }, expectedOutput: [] },
        { input: { nums: [0, 0, 0, 1] }, expectedOutput: [1, 0, 0, 0] },
      ]),`,
  "find-disappeared-numbers": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1] }, expectedOutput: [] },
        { input: { nums: [2, 2] }, expectedOutput: [1] },
      ]),`,
  "majority-element": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1] }, expectedOutput: 1 },
        { input: { nums: [6, 5, 5] }, expectedOutput: 5 },
      ]),`,
  "single-number": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1] }, expectedOutput: 1 },
        { input: { nums: [0, 1, 0] }, expectedOutput: 1 },
      ]),`,
  "pascals-triangle": `hiddenTestCases: JSON.stringify([
        { input: { numRows: 2 }, expectedOutput: [[1], [1, 1]] },
        { input: { numRows: 4 }, expectedOutput: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]] },
      ]),`,
  "next-permutation": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1] }, expectedOutput: [1] },
        { input: { nums: [2, 3, 1] }, expectedOutput: [3, 1, 2] },
      ]),`,
  "sort-colors": `hiddenTestCases: JSON.stringify([
        { input: { nums: [0] }, expectedOutput: [0] },
        { input: { nums: [1, 0] }, expectedOutput: [0, 1] },
      ]),`,
  "find-minimum-rotated-sorted": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1] }, expectedOutput: 1 },
        { input: { nums: [2, 1] }, expectedOutput: 1 },
      ]),`,
  "maximum-product-subarray": `hiddenTestCases: JSON.stringify([
        { input: { nums: [0] }, expectedOutput: 0 },
        { input: { nums: [-2, -3, -4] }, expectedOutput: 12 },
      ]),`,
  "subarray-sum-equals-k": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1], k: 0 }, expectedOutput: 0 },
        { input: { nums: [-1, -1, 1], k: 0 }, expectedOutput: 1 },
      ]),`,
  "valid-anagram": `hiddenTestCases: JSON.stringify([
        { input: { s: "", t: "" }, expectedOutput: true },
        { input: { s: "a", t: "b" }, expectedOutput: false },
      ]),`,
  "first-unique-character": `hiddenTestCases: JSON.stringify([
        { input: { s: "aabbcc" }, expectedOutput: -1 },
        { input: { s: "z" }, expectedOutput: 0 },
      ]),`,
  "longest-common-prefix": `hiddenTestCases: JSON.stringify([
        { input: { strs: [""] }, expectedOutput: "" },
        { input: { strs: ["abc", "abc", "abc"] }, expectedOutput: "abc" },
      ]),`,
  "string-to-integer-atoi": `hiddenTestCases: JSON.stringify([
        { input: { str: "" }, expectedOutput: 0 },
        { input: { str: "-2147483649" }, expectedOutput: -2147483648 },
      ]),`,
  "count-and-say": `hiddenTestCases: JSON.stringify([
        { input: { n: 1 }, expectedOutput: "1" },
        { input: { n: 6 }, expectedOutput: "312211" },
      ]),`,
  "zigzag-conversion": `hiddenTestCases: JSON.stringify([
        { input: { s: "A", numRows: 1 }, expectedOutput: "A" },
        { input: { s: "AB", numRows: 1 }, expectedOutput: "AB" },
      ]),`,
  "encode-decode-strings": `hiddenTestCases: JSON.stringify([
        { input: { strs: [] }, expectedOutput: [] },
        { input: { strs: [""] }, expectedOutput: [""] },
      ]),`,
  "minimum-remove-valid-parens": `hiddenTestCases: JSON.stringify([
        { input: { s: "" }, expectedOutput: "" },
        { input: { s: "((((" }, expectedOutput: "" },
      ]),`,
  "unique-paths": `hiddenTestCases: JSON.stringify([
        { input: { m: 1, n: 1 }, expectedOutput: 1 },
        { input: { m: 1, n: 100 }, expectedOutput: 1 },
      ]),`,
  "decode-ways": `hiddenTestCases: JSON.stringify([
        { input: { s: "0" }, expectedOutput: 0 },
        { input: { s: "10" }, expectedOutput: 1 },
      ]),`,
  "longest-common-subsequence": `hiddenTestCases: JSON.stringify([
        { input: { text1: "abc", text2: "" }, expectedOutput: 0 },
        { input: { text1: "aaa", text2: "aa" }, expectedOutput: 2 },
      ]),`,
  "edit-distance": `hiddenTestCases: JSON.stringify([
        { input: { word1: "", word2: "abc" }, expectedOutput: 3 },
        { input: { word1: "abc", word2: "abc" }, expectedOutput: 0 },
      ]),`,
  "partition-equal-subset-sum": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1, 1] }, expectedOutput: true },
        { input: { nums: [1, 2, 3, 5] }, expectedOutput: false },
      ]),`,
  "min-cost-climbing-stairs": `hiddenTestCases: JSON.stringify([
        { input: { cost: [0, 0] }, expectedOutput: 0 },
        { input: { cost: [1, 100, 1, 1, 1, 100, 1, 1, 100, 1] }, expectedOutput: 6 },
      ]),`,
  "coin-change-ii": `hiddenTestCases: JSON.stringify([
        { input: { amount: 0, coins: [1, 2, 5] }, expectedOutput: 1 },
        { input: { amount: 3, coins: [2] }, expectedOutput: 0 },
      ]),`,
  "palindromic-substrings": `hiddenTestCases: JSON.stringify([
        { input: { s: "a" }, expectedOutput: 1 },
        { input: { s: "aaaa" }, expectedOutput: 10 },
      ]),`,
  "maximal-square": `hiddenTestCases: JSON.stringify([
        { input: { matrix: [["0"]] }, expectedOutput: 0 },
        { input: { matrix: [["1"]] }, expectedOutput: 1 },
      ]),`,
  "target-sum": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1], target: 1 }, expectedOutput: 1 },
        { input: { nums: [1, 1, 1, 1, 1], target: 5 }, expectedOutput: 1 },
      ]),`,
  "pacific-atlantic-water-flow": `hiddenTestCases: JSON.stringify([
        { input: { heights: [[1]] }, expectedOutput: [[0, 0]] },
        { input: { heights: [[1, 1], [1, 1]] }, expectedOutput: [[0, 0], [0, 1], [1, 0], [1, 1]] },
      ]),`,
  "rotting-oranges": `hiddenTestCases: JSON.stringify([
        { input: { grid: [[0]] }, expectedOutput: 0 },
        { input: { grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]] }, expectedOutput: -1 },
      ]),`,
  "walls-and-gates": `hiddenTestCases: JSON.stringify([
        { input: { rooms: [] }, expectedOutput: [] },
        { input: { rooms: [[-1]] }, expectedOutput: [[-1]] },
      ]),`,
  "graph-valid-tree": `hiddenTestCases: JSON.stringify([
        { input: { n: 1, edges: [] }, expectedOutput: true },
        { input: { n: 2, edges: [[0, 1], [0, 1]] }, expectedOutput: false },
      ]),`,
  "number-connected-components": `hiddenTestCases: JSON.stringify([
        { input: { n: 1, edges: [] }, expectedOutput: 1 },
        { input: { n: 4, edges: [[0, 1], [2, 3]] }, expectedOutput: 2 },
      ]),`,
  "network-delay-time": `hiddenTestCases: JSON.stringify([
        { input: { times: [[1, 2, 1]], n: 2, k: 1 }, expectedOutput: 1 },
        { input: { times: [[1, 2, 1]], n: 3, k: 1 }, expectedOutput: -1 },
      ]),`,
  "surrounded-regions": `hiddenTestCases: JSON.stringify([
        { input: { board: [["X"]] }, expectedOutput: [["X"]] },
        { input: { board: [["O"]] }, expectedOutput: [["O"]] },
      ]),`,
  "alien-dictionary": `hiddenTestCases: JSON.stringify([
        { input: { words: ["z", "x"] }, expectedOutput: "zx" },
        { input: { words: ["a"] }, expectedOutput: "a" },
      ]),`,
  "two-sum-ii-sorted": `hiddenTestCases: JSON.stringify([
        { input: { numbers: [2, 7], target: 9 }, expectedOutput: [1, 2] },
        { input: { numbers: [-1, 0], target: -1 }, expectedOutput: [1, 2] },
      ]),`,
  "isomorphic-strings": `hiddenTestCases: JSON.stringify([
        { input: { s: "", t: "" }, expectedOutput: true },
        { input: { s: "aa", t: "ab" }, expectedOutput: false },
      ]),`,
  "happy-number": `hiddenTestCases: JSON.stringify([
        { input: { n: 1 }, expectedOutput: true },
        { input: { n: 2 }, expectedOutput: false },
      ]),`,
  "intersection-two-arrays-ii": `hiddenTestCases: JSON.stringify([
        { input: { nums1: [], nums2: [1] }, expectedOutput: [] },
        { input: { nums1: [1, 1, 1], nums2: [1, 1] }, expectedOutput: [1, 1] },
      ]),`,
  "ransom-note": `hiddenTestCases: JSON.stringify([
        { input: { ransomNote: "", magazine: "" }, expectedOutput: true },
        { input: { ransomNote: "aa", magazine: "ab" }, expectedOutput: false },
      ]),`,
  "reverse-linked-list-v2": `hiddenTestCases: JSON.stringify([
        { input: { head: [] }, expectedOutput: [] },
        { input: { head: [1] }, expectedOutput: [1] },
      ]),`,
  "remove-nth-from-end": `hiddenTestCases: JSON.stringify([
        { input: { head: [1], n: 1 }, expectedOutput: [] },
        { input: { head: [1, 2], n: 1 }, expectedOutput: [1] },
      ]),`,
  "reorder-list": `hiddenTestCases: JSON.stringify([
        { input: { head: [1] }, expectedOutput: [1] },
        { input: { head: [1, 2, 3] }, expectedOutput: [1, 3, 2] },
      ]),`,
  "add-two-numbers": `hiddenTestCases: JSON.stringify([
        { input: { l1: [0], l2: [0] }, expectedOutput: [0] },
        { input: { l1: [9, 9, 9], l2: [1] }, expectedOutput: [0, 0, 0, 1] },
      ]),`,
  "middle-linked-list": `hiddenTestCases: JSON.stringify([
        { input: { head: [1] }, expectedOutput: [1] },
        { input: { head: [1, 2] }, expectedOutput: [2] },
      ]),`,
  "same-tree": `hiddenTestCases: JSON.stringify([
        { input: { p: null, q: null }, expectedOutput: true },
        { input: { p: [1], q: [1, 2] }, expectedOutput: false },
      ]),`,
  "subtree-of-another-tree": `hiddenTestCases: JSON.stringify([
        { input: { root: [1], subRoot: [1] }, expectedOutput: true },
        { input: { root: null, subRoot: [1] }, expectedOutput: false },
      ]),`,
  "lowest-common-ancestor-bst": `hiddenTestCases: JSON.stringify([
        { input: { root: [2, 1, 3], p: 1, q: 3 }, expectedOutput: 2 },
        { input: { root: [2, 1, 3], p: 1, q: 2 }, expectedOutput: 2 },
      ]),`,
  "binary-tree-right-side-view": `hiddenTestCases: JSON.stringify([
        { input: { root: null }, expectedOutput: [] },
        { input: { root: [1] }, expectedOutput: [1] },
      ]),`,
  "diameter-of-binary-tree": `hiddenTestCases: JSON.stringify([
        { input: { root: [1] }, expectedOutput: 0 },
        { input: { root: [1, 2, 3, 4, 5] }, expectedOutput: 3 },
      ]),`,
  "kth-smallest-bst": `hiddenTestCases: JSON.stringify([
        { input: { root: [1], k: 1 }, expectedOutput: 1 },
        { input: { root: [5, 3, 6, 2, 4], k: 5 }, expectedOutput: 6 },
      ]),`,
  "construct-tree-preorder-inorder": `hiddenTestCases: JSON.stringify([
        { input: { preorder: [1], inorder: [1] }, expectedOutput: [1] },
        { input: { preorder: [1, 2], inorder: [2, 1] }, expectedOutput: [1, 2] },
      ]),`,
  "balanced-binary-tree": `hiddenTestCases: JSON.stringify([
        { input: { root: null }, expectedOutput: true },
        { input: { root: [1, 2, 2, 3, 3, null, null, 4, 4] }, expectedOutput: false },
      ]),`,
  "first-bad-version": `hiddenTestCases: JSON.stringify([
        { input: { n: 1, bad: 1 }, expectedOutput: 1 },
        { input: { n: 100, bad: 1 }, expectedOutput: 1 },
      ]),`,
  "find-peak-element": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1] }, expectedOutput: 0 },
        { input: { nums: [3, 2, 1] }, expectedOutput: 0 },
      ]),`,
  "search-2d-matrix": `hiddenTestCases: JSON.stringify([
        { input: { matrix: [[1]], target: 2 }, expectedOutput: false },
        { input: { matrix: [[1]], target: 1 }, expectedOutput: true },
      ]),`,
  "koko-eating-bananas": `hiddenTestCases: JSON.stringify([
        { input: { piles: [1], h: 1 }, expectedOutput: 1 },
        { input: { piles: [1000000000], h: 1000000000 }, expectedOutput: 1 },
      ]),`,
  "remove-duplicates-sorted": `hiddenTestCases: JSON.stringify([
        { input: { nums: [] }, expectedOutput: 0 },
        { input: { nums: [1] }, expectedOutput: 1 },
      ]),`,
  "four-sum": `hiddenTestCases: JSON.stringify([
        { input: { nums: [], target: 0 }, expectedOutput: [] },
        { input: { nums: [0, 0, 0, 0], target: 0 }, expectedOutput: [[0, 0, 0, 0]] },
      ]),`,
  "valid-palindrome-ii": `hiddenTestCases: JSON.stringify([
        { input: { s: "a" }, expectedOutput: true },
        { input: { s: "abc" }, expectedOutput: false },
      ]),`,
  "boats-to-save-people": `hiddenTestCases: JSON.stringify([
        { input: { people: [1], limit: 1 }, expectedOutput: 1 },
        { input: { people: [2, 2], limit: 3 }, expectedOutput: 2 },
      ]),`,
  "max-sliding-window": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1], k: 1 }, expectedOutput: [1] },
        { input: { nums: [1, -1], k: 1 }, expectedOutput: [1, -1] },
      ]),`,
  "permutation-in-string": `hiddenTestCases: JSON.stringify([
        { input: { s1: "a", s2: "a" }, expectedOutput: true },
        { input: { s1: "ab", s2: "a" }, expectedOutput: false },
      ]),`,
  "longest-repeating-character-replacement": `hiddenTestCases: JSON.stringify([
        { input: { s: "A", k: 0 }, expectedOutput: 1 },
        { input: { s: "AAAA", k: 2 }, expectedOutput: 4 },
      ]),`,
  "fruit-into-baskets": `hiddenTestCases: JSON.stringify([
        { input: { fruits: [1] }, expectedOutput: 1 },
        { input: { fruits: [1, 1, 1, 1] }, expectedOutput: 4 },
      ]),`,
  "combination-sum": `hiddenTestCases: JSON.stringify([
        { input: { candidates: [2], target: 1 }, expectedOutput: [] },
        { input: { candidates: [1], target: 1 }, expectedOutput: [[1]] },
      ]),`,
  "combination-sum-ii": `hiddenTestCases: JSON.stringify([
        { input: { candidates: [1, 1], target: 1 }, expectedOutput: [[1]] },
        { input: { candidates: [2], target: 1 }, expectedOutput: [] },
      ]),`,
  "n-queens": `hiddenTestCases: JSON.stringify([
        { input: { n: 1 }, expectedOutput: [["Q"]] },
        { input: { n: 2 }, expectedOutput: [] },
      ]),`,
  "palindrome-partitioning": `hiddenTestCases: JSON.stringify([
        { input: { s: "a" }, expectedOutput: [["a"]] },
        { input: { s: "aa" }, expectedOutput: [["a", "a"], ["aa"]] },
      ]),`,
  "insert-interval": `hiddenTestCases: JSON.stringify([
        { input: { intervals: [], newInterval: [5, 7] }, expectedOutput: [[5, 7]] },
        { input: { intervals: [[1, 5]], newInterval: [2, 3] }, expectedOutput: [[1, 5]] },
      ]),`,
  "non-overlapping-intervals": `hiddenTestCases: JSON.stringify([
        { input: { intervals: [] }, expectedOutput: 0 },
        { input: { intervals: [[1, 2]] }, expectedOutput: 0 },
      ]),`,
  "meeting-rooms-ii": `hiddenTestCases: JSON.stringify([
        { input: { intervals: [] }, expectedOutput: 0 },
        { input: { intervals: [[1, 2]] }, expectedOutput: 1 },
      ]),`,
  "last-stone-weight": `hiddenTestCases: JSON.stringify([
        { input: { stones: [1] }, expectedOutput: 1 },
        { input: { stones: [2, 2] }, expectedOutput: 0 },
      ]),`,
  "k-closest-points-to-origin": `hiddenTestCases: JSON.stringify([
        { input: { points: [[0, 0]], k: 1 }, expectedOutput: [[0, 0]] },
        { input: { points: [[1, 0], [0, 1]], k: 1 }, expectedOutput: [[1, 0]] },
      ]),`,
  "task-scheduler": `hiddenTestCases: JSON.stringify([
        { input: { tasks: ["A"], n: 0 }, expectedOutput: 1 },
        { input: { tasks: ["A", "A"], n: 2 }, expectedOutput: 5 },
      ]),`,
  "find-median-from-data-stream": `hiddenTestCases: JSON.stringify([
        { input: { nums: [1] }, expectedOutput: 1.0 },
        { input: { nums: [1, 2, 3] }, expectedOutput: 2.0 },
      ]),`,
  "reorganize-string": `hiddenTestCases: JSON.stringify([
        { input: { s: "a" }, expectedOutput: "a" },
        { input: { s: "aaa" }, expectedOutput: "" },
      ]),`,
  "jump-game": `hiddenTestCases: JSON.stringify([
        { input: { nums: [0] }, expectedOutput: true },
        { input: { nums: [2, 0, 0] }, expectedOutput: true },
      ]),`,
  "jump-game-ii": `hiddenTestCases: JSON.stringify([
        { input: { nums: [0] }, expectedOutput: 0 },
        { input: { nums: [1, 2, 3] }, expectedOutput: 2 },
      ]),`,
  "gas-station": `hiddenTestCases: JSON.stringify([
        { input: { gas: [1], cost: [1] }, expectedOutput: 0 },
        { input: { gas: [2, 3], cost: [3, 2] }, expectedOutput: 1 },
      ]),`,
  "hand-of-straights": `hiddenTestCases: JSON.stringify([
        { input: { hand: [1], groupSize: 1 }, expectedOutput: true },
        { input: { hand: [1, 2, 3], groupSize: 2 }, expectedOutput: false },
      ]),`,
  "partition-labels": `hiddenTestCases: JSON.stringify([
        { input: { s: "a" }, expectedOutput: [1] },
        { input: { s: "aa" }, expectedOutput: [2] },
      ]),`,
  "reverse-integer": `hiddenTestCases: JSON.stringify([
        { input: { x: 0 }, expectedOutput: 0 },
        { input: { x: -2147483648 }, expectedOutput: 0 },
      ]),`,
  "power-of-two": `hiddenTestCases: JSON.stringify([
        { input: { n: 0 }, expectedOutput: false },
        { input: { n: -2 }, expectedOutput: false },
      ]),`,
  "counting-bits": `hiddenTestCases: JSON.stringify([
        { input: { n: 0 }, expectedOutput: [0] },
        { input: { n: 4 }, expectedOutput: [0, 1, 1, 2, 1] },
      ]),`,
  "missing-number": `hiddenTestCases: JSON.stringify([
        { input: { nums: [0] }, expectedOutput: 1 },
        { input: { nums: [1] }, expectedOutput: 0 },
      ]),`,
  "number-of-1-bits": `hiddenTestCases: JSON.stringify([
        { input: { n: 0 }, expectedOutput: 0 },
        { input: { n: 4294967295 }, expectedOutput: 32 },
      ]),`,
  "daily-temperatures": `hiddenTestCases: JSON.stringify([
        { input: { temperatures: [30] }, expectedOutput: [0] },
        { input: { temperatures: [100, 99, 98] }, expectedOutput: [0, 0, 0] },
      ]),`,
  "evaluate-reverse-polish-notation": `hiddenTestCases: JSON.stringify([
        { input: { tokens: ["3"] }, expectedOutput: 3 },
        { input: { tokens: ["0", "3", "/"] }, expectedOutput: 0 },
      ]),`,
  "largest-rectangle-histogram": `hiddenTestCases: JSON.stringify([
        { input: { heights: [1] }, expectedOutput: 1 },
        { input: { heights: [0] }, expectedOutput: 0 },
      ]),`,
  "generate-parentheses": `hiddenTestCases: JSON.stringify([
        { input: { n: 1 }, expectedOutput: ["()"] },
        { input: { n: 0 }, expectedOutput: [""] },
      ]),`,
  "min-stack-v2": `hiddenTestCases: JSON.stringify([
        { input: { ops: ["push", "getMin"], vals: [-2, null] }, expectedOutput: -2 },
        { input: { ops: ["push", "push", "pop", "getMin"], vals: [5, 1, null, null] }, expectedOutput: 5 },
      ]),`,
  "implement-queue-using-stacks": `hiddenTestCases: JSON.stringify([
        { input: { ops: ["push", "peek"], vals: [1, null] }, expectedOutput: 1 },
        { input: { ops: ["push", "push", "pop"], vals: [1, 2, null] }, expectedOutput: 1 },
      ]),`,
  "time-based-key-value-store": `hiddenTestCases: JSON.stringify([
        { input: { key: "foo", value: "bar", timestamp: 1, getTimestamp: 0 }, expectedOutput: "" },
        { input: { key: "foo", value: "bar", timestamp: 1, getTimestamp: 3 }, expectedOutput: "bar" },
      ]),`,
  "fibonacci-number": `hiddenTestCases: JSON.stringify([
        { input: { n: 0 }, expectedOutput: 0 },
        { input: { n: 10 }, expectedOutput: 55 },
      ]),`,
  "power-function": `hiddenTestCases: JSON.stringify([
        { input: { x: 1.0, n: 0 }, expectedOutput: 1.0 },
        { input: { x: 2.0, n: -2 }, expectedOutput: 0.25 },
      ]),`,
  "merge-sort-implementation": `hiddenTestCases: JSON.stringify([
        { input: { nums: [] }, expectedOutput: [] },
        { input: { nums: [1] }, expectedOutput: [1] },
      ]),`,
  "flatten-nested-list": `hiddenTestCases: JSON.stringify([
        { input: { nestedList: [] }, expectedOutput: [] },
        { input: { nestedList: [[1, 1], 2, [1, 1]] }, expectedOutput: [1, 1, 2, 1, 1] },
      ]),`,
};

// Normalize line endings to \n for processing
const originalEnding = content.includes('\r\n') ? '\r\n' : '\n';
content = content.replace(/\r\n/g, '\n');

for (const [slug, hiddenTests] of Object.entries(hiddenTestsMap)) {
  const slugPattern = `slug: "${slug}"`;
  const slugIdx = content.indexOf(slugPattern);
  if (slugIdx === -1) {
    console.log(`⚠️  Slug not found: ${slug}`);
    continue;
  }

  const nextSlugIdx = content.indexOf('slug: "', slugIdx + slugPattern.length);
  const blockStart = slugIdx;
  const blockEnd = nextSlugIdx !== -1 ? nextSlugIdx : content.length;
  const blockContent = content.substring(blockStart, blockEnd);

  if (blockContent.includes('hiddenTestCases')) {
    console.log(`✓  Already has hiddenTestCases: ${slug}`);
    continue;
  }

  // Find the last "    }," in this block — the closing brace of the problem object
  const closingPattern = '    },';
  const lastClose = blockContent.lastIndexOf(closingPattern);

  if (lastClose === -1) {
    console.log(`⚠️  Could not find closing brace for: ${slug} (block: ${blockContent.substring(0, 100)})`);
    continue;
  }

  const insertPos = blockStart + lastClose;
  const insertion = `      ${hiddenTests}\n`;
  content = content.substring(0, insertPos) + insertion + content.substring(insertPos);

  console.log(`✅  Added hiddenTestCases: ${slug}`);
}

// Restore line endings
if (originalEnding === '\r\n') {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ Done! seed-problems-150.ts updated with hidden test cases.');
