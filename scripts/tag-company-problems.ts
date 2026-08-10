/**
 * scripts/tag-company-problems.ts
 *
 * One-time script to tag all 148 existing problems with company names
 * based on real 2024-2025 Indian company interview data.
 *
 * Run: npx tsx scripts/tag-company-problems.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
} else {
  dotenv.config({ override: true });
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Company Tag Map ──────────────────────────────────────────────────────────
// Based on: LeetCode company tags, GFG, Striver's SDE Sheet, PrepInsta,
// and community-reported 2024-25 Indian interview experiences
// Format: slug → array of companies
// ─────────────────────────────────────────────────────────────────────────────

const COMPANY_TAGS: Record<string, string[]> = {
  // ── Arrays & Hashing ─────────────────────────────────────────────────────
  "two-sum":                          ["Google", "Amazon", "Microsoft", "Flipkart", "TCS", "Wipro", "Infosys"],
  "contains-duplicate":               ["Amazon", "Microsoft", "TCS", "Wipro"],
  "valid-anagram":                    ["Amazon", "Microsoft", "Google", "TCS"],
  "best-time-buy-sell-stock":         ["Amazon", "Microsoft", "Google", "Flipkart", "TCS"],
  "maximum-subarray":                 ["Amazon", "Microsoft", "Google", "Flipkart", "TCS", "Infosys"],
  "move-zeroes":                      ["Microsoft", "Amazon", "TCS", "Wipro"],
  "product-of-array-except-self":     ["Amazon", "Google", "Microsoft", "Flipkart"],
  "group-anagrams":                   ["Google", "Amazon", "Microsoft", "Flipkart"],
  "longest-consecutive-sequence":     ["Google", "Amazon", "Microsoft"],

  // ── Sliding Window ───────────────────────────────────────────────────────
  "longest-substring-without-repeating": ["Amazon", "Google", "Microsoft", "Flipkart"],
  "minimum-window-substring":          ["Google", "Amazon", "Flipkart", "Microsoft"],
  "sliding-window-maximum":            ["Amazon", "Flipkart", "Google"],
  "longest-repeating-character-replacement": ["Google", "Amazon", "Flipkart"],
  "permutation-in-string":             ["Amazon", "Microsoft", "Google"],
  "minimum-size-subarray-sum":         ["Amazon", "Flipkart", "Microsoft"],
  "max-consecutive-ones-iii":          ["Amazon", "Google"],
  "fruit-into-baskets":                ["Amazon", "Google"],
  "grumpy-bookstore-owner":            ["Amazon"],
  "contains-duplicate-ii":             ["Amazon", "TCS"],

  // ── Two Pointers ─────────────────────────────────────────────────────────
  "3sum":                              ["Google", "Amazon", "Microsoft", "Flipkart"],
  "container-with-most-water":         ["Amazon", "Google", "Microsoft"],
  "trapping-rain-water":               ["Google", "Amazon", "Microsoft", "Flipkart"],
  "four-sum":                          ["Amazon", "Microsoft", "Google"],
  "squares-of-sorted-array":           ["Amazon", "TCS", "Wipro"],
  "sort-colors":                       ["Microsoft", "Amazon", "Google"],
  "remove-duplicates-sorted-array":    ["Microsoft", "Amazon", "TCS"],
  "backspace-string-compare":          ["Amazon", "Microsoft"],

  // ── Stack ─────────────────────────────────────────────────────────────────
  "valid-parentheses":                 ["Google", "Amazon", "Microsoft", "Flipkart", "TCS"],
  "min-stack":                         ["Amazon", "Microsoft", "Google", "Flipkart"],
  "daily-temperatures":                ["Amazon", "Google", "Flipkart"],
  "evaluate-reverse-polish":           ["Amazon", "Google"],
  "decode-string":                     ["Amazon", "Google", "Microsoft"],
  "asteroid-collision":                ["Amazon", "Google"],
  "next-greater-element":              ["Amazon", "Microsoft"],
  "largest-rectangle-histogram":       ["Google", "Amazon", "Flipkart"],

  // ── Linked Lists ──────────────────────────────────────────────────────────
  "reverse-linked-list":               ["Amazon", "Microsoft", "Google", "Flipkart", "TCS"],
  "linked-list-cycle":                 ["Amazon", "Microsoft", "Google", "Flipkart"],
  "merge-two-sorted-lists":            ["Amazon", "Microsoft", "Google", "Flipkart", "TCS"],
  "lru-cache":                         ["Google", "Amazon", "Microsoft", "Flipkart"],
  "remove-nth-from-end":               ["Amazon", "Microsoft", "Google", "Flipkart"],
  "add-two-numbers":                   ["Amazon", "Microsoft", "Google", "Flipkart"],
  "reorder-list":                      ["Amazon", "Google"],
  "find-duplicate-number":             ["Amazon", "Google", "Microsoft", "Flipkart"],
  "swap-nodes-in-pairs":               ["Amazon", "Microsoft"],
  "odd-even-linked-list":              ["Amazon", "Microsoft"],

  // ── Binary Search ─────────────────────────────────────────────────────────
  "binary-search":                     ["Amazon", "Microsoft", "Google", "TCS"],
  "search-in-rotated-sorted-array":    ["Amazon", "Microsoft", "Google", "Flipkart"],
  "find-minimum-in-rotated-sorted-array": ["Amazon", "Microsoft", "Google"],
  "koko-eating-bananas":               ["Amazon", "Google"],
  "find-peak-element":                 ["Google", "Amazon", "Microsoft"],
  "time-based-key-value-store":        ["Google", "Amazon"],
  "first-bad-version":                 ["Amazon", "Microsoft", "Google", "Flipkart"],
  "search-2d-matrix":                  ["Amazon", "Microsoft", "Google"],

  // ── Trees ─────────────────────────────────────────────────────────────────
  "maximum-depth-binary-tree":         ["Amazon", "Microsoft", "Google", "Flipkart", "TCS"],
  "invert-binary-tree":                ["Google", "Amazon", "Microsoft", "Flipkart"],
  "validate-binary-search-tree":       ["Amazon", "Microsoft", "Google", "Flipkart"],
  "binary-tree-level-order":           ["Amazon", "Microsoft", "Google", "Flipkart"],
  "lowest-common-ancestor-bst":        ["Amazon", "Microsoft", "Google", "Flipkart"],
  "serialize-deserialize-binary-tree": ["Google", "Amazon", "Flipkart", "Microsoft"],
  "same-tree":                         ["Microsoft", "Amazon", "TCS"],
  "kth-smallest-bst":                  ["Amazon", "Microsoft", "Google"],
  "binary-tree-right-side-view":       ["Amazon", "Microsoft", "Google", "Flipkart"],
  "path-sum":                          ["Amazon", "Microsoft", "Google"],
  "diameter-of-binary-tree":           ["Amazon", "Google", "Microsoft"],
  "symmetric-tree":                    ["Microsoft", "Amazon", "TCS"],

  // ── Heap / Priority Queue ─────────────────────────────────────────────────
  "kth-largest-element":               ["Amazon", "Google", "Microsoft", "Flipkart"],
  "top-k-frequent-elements":           ["Amazon", "Google", "Flipkart", "Microsoft"],
  "merge-k-sorted-lists":              ["Google", "Amazon", "Microsoft", "Flipkart"],
  "k-closest-points":                  ["Amazon", "Google", "Flipkart"],
  "last-stone-weight":                 ["Amazon"],
  "reorganize-string":                 ["Amazon", "Flipkart", "Google"],
  "sort-characters-by-frequency":      ["Amazon", "Google"],
  "find-median-from-stream":           ["Google", "Amazon", "Flipkart"],
  "kth-largest-in-stream":             ["Amazon", "Google", "Flipkart"],
  "top-k-frequent-words":              ["Amazon", "Google", "Microsoft"],

  // ── Trie ──────────────────────────────────────────────────────────────────
  "implement-trie":                    ["Flipkart", "Google", "Microsoft", "Amazon"],
  "design-add-search-words":           ["Google", "Microsoft", "Amazon"],
  "replace-words":                     ["Flipkart", "Amazon"],
  "search-suggestions-system":         ["Flipkart", "Amazon", "Google"],
  "longest-word-in-dictionary":        ["Google", "Flipkart"],
  "map-sum-pairs":                     ["Google"],

  // ── Graphs ────────────────────────────────────────────────────────────────
  "number-of-islands":                 ["Amazon", "Google", "Microsoft", "Flipkart"],
  "course-schedule":                   ["Amazon", "Google", "Microsoft", "Flipkart"],
  "number-of-connected-components":    ["Amazon", "Google", "Microsoft"],
  "word-ladder":                       ["Google", "Amazon"],
  "alien-dictionary":                  ["Google", "Flipkart", "Amazon"],
  "clone-graph":                       ["Amazon", "Google", "Microsoft"],
  "pacific-atlantic-water-flow":       ["Google", "Amazon"],
  "rotting-oranges":                   ["Amazon", "Google", "Microsoft"],
  "surrounded-regions":                ["Google", "Amazon"],
  "redundant-connection":              ["Amazon", "Google"],
  "network-delay-time":                ["Google", "Amazon", "Flipkart"],
  "shortest-path-binary-matrix":       ["Amazon", "Google"],
  "walls-and-gates":                   ["Amazon", "Google", "Microsoft"],
  "graph-valid-tree":                  ["Amazon", "Google"],
  "accounts-merge":                    ["Google", "Amazon"],
  "word-search":                       ["Amazon", "Google", "Microsoft"],

  // ── Dynamic Programming ───────────────────────────────────────────────────
  "climbing-stairs":                   ["Amazon", "Google", "Microsoft", "TCS", "Wipro"],
  "coin-change":                       ["Amazon", "Google", "Microsoft", "Flipkart"],
  "longest-increasing-subsequence":    ["Amazon", "Google", "Microsoft", "Flipkart"],
  "house-robber":                      ["Amazon", "Google", "Microsoft"],
  "house-robber-ii":                   ["Amazon", "Google"],
  "decode-ways":                       ["Amazon", "Microsoft", "Google", "Flipkart"],
  "unique-paths":                      ["Amazon", "Microsoft", "Google", "TCS"],
  "word-break":                        ["Amazon", "Google", "Microsoft", "Flipkart"],
  "longest-common-subsequence":        ["Google", "Amazon", "Microsoft"],
  "palindromic-substrings":            ["Amazon", "Google", "Microsoft"],
  "longest-palindromic-substring":     ["Amazon", "Google", "Microsoft", "Flipkart"],
  "partition-equal-subset-sum":        ["Amazon", "Google"],
  "target-sum":                        ["Amazon", "Google"],
  "coin-change-ii":                    ["Amazon", "Google"],
  "min-cost-climbing-stairs":          ["Amazon", "TCS"],
  "maximum-product-subarray":          ["Amazon", "Google", "Microsoft", "Flipkart"],
  "edit-distance":                     ["Google", "Amazon", "Microsoft"],
  "burst-balloons":                    ["Google"],

  // ── Greedy ────────────────────────────────────────────────────────────────
  "merge-intervals":                   ["Google", "Amazon", "Microsoft", "Flipkart"],
  "jump-game":                         ["Amazon", "Microsoft", "Google"],
  "jump-game-ii":                      ["Amazon", "Google"],
  "gas-station":                       ["Amazon", "Google"],
  "task-scheduler":                    ["Amazon", "Google", "Microsoft", "Flipkart"],
  "meeting-rooms":                     ["Amazon", "Google", "Microsoft", "Flipkart"],
  "meeting-rooms-ii":                  ["Amazon", "Google", "Microsoft", "Flipkart"],
  "non-overlapping-intervals":         ["Amazon", "Google"],
  "partition-labels":                  ["Amazon", "Google"],
  "boats-to-save-people":              ["Amazon", "Google"],
  "assign-cookies":                    ["Amazon", "TCS"],
  "lemonade-change":                   ["Amazon"],
  "maximum-units-on-truck":            ["Amazon"],

  // ── Backtracking ──────────────────────────────────────────────────────────
  "generate-parentheses":              ["Google", "Amazon", "Microsoft", "Flipkart"],
  "subsets":                           ["Amazon", "Google", "Microsoft"],
  "permutations":                      ["Amazon", "Google", "Microsoft", "Flipkart"],

  // ── Matrix ────────────────────────────────────────────────────────────────
  "spiral-matrix":                     ["Amazon", "Microsoft", "Google"],
  "rotate-image":                      ["Amazon", "Microsoft", "Google"],
  "set-matrix-zeroes":                 ["Amazon", "Microsoft", "Google", "Flipkart"],
  "valid-sudoku":                      ["Amazon", "Microsoft"],
  "trapping-rain-water-ii":            ["Google"],

  // ── Bit Manipulation ─────────────────────────────────────────────────────
  "single-number":                     ["Amazon", "Microsoft", "TCS"],
  "number-of-1-bits":                  ["Amazon", "Microsoft", "TCS"],
  "counting-bits":                     ["Amazon", "Microsoft"],
  "missing-number":                    ["Amazon", "Microsoft", "TCS"],
  "power-of-two":                      ["Amazon", "Microsoft", "TCS"],
  "sum-of-two-integers":               ["Amazon", "Microsoft", "Google"],
  "reverse-bits":                      ["Amazon", "Microsoft"],
  "hamming-distance":                  ["Amazon", "Microsoft", "Google"],
  "single-number-ii":                  ["Amazon", "Google"],

  // ── Hard / Advanced ───────────────────────────────────────────────────────
  "find-median-two-sorted-arrays":     ["Google", "Amazon", "Microsoft"],
};

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🏷️  Tagging problems with company names...\n");

  let updated = 0;
  let notFound = 0;

  for (const [slug, companies] of Object.entries(COMPANY_TAGS)) {
    const companiesJson = JSON.stringify(companies);

    const result = await prisma.problem.updateMany({
      where: { slug },
      data: {
        companies: companiesJson,
        companyTags: companies.join(","),
      },
    });

    if (result.count > 0) {
      console.log(`  ✅ ${slug.padEnd(48)} → ${companies.slice(0, 3).join(", ")}${companies.length > 3 ? ` +${companies.length - 3}` : ""}`);
      updated++;
    } else {
      console.log(`  ⚠️  ${slug} — not found in DB (may not be seeded yet)`);
      notFound++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Tagged: ${updated} problems`);
  if (notFound > 0) console.log(`⚠️  Not found: ${notFound} problems (seed them first)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main()
  .catch((e) => {
    console.error("❌ Tagging failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
