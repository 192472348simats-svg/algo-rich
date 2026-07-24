import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds correct answers for reflection validation on all problems.
 * Maps problem slugs to their correct pattern, time/space complexity, and optimality.
 */
export async function seedReflections() {
  console.log("🧠 Seeding reflection validation data...\n");

  const reflectionData: Record<
    string,
    {
      correctPattern: string;
      correctTimeComplexity: string;
      correctSpaceComplexity: string;
      isOptimal: boolean;
    }
  > = {
    // ─── EASY ────────────────────────────────
    "two-sum": {
      correctPattern: "hash-map",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "reverse-string": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "valid-parentheses": {
      correctPattern: "stack",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "best-time-to-buy-sell-stock": {
      correctPattern: "greedy",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "contains-duplicate": {
      correctPattern: "hash-map",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "merge-two-sorted-lists": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n+m)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "linked-list-cycle": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "binary-search": {
      correctPattern: "binary-search",
      correctTimeComplexity: "O(log n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "palindrome-check": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "max-depth-binary-tree": {
      correctPattern: "recursion",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(h)",
      isOptimal: true,
    },

    // ─── MEDIUM ──────────────────────────────
    "maximum-subarray": {
      correctPattern: "dynamic-programming",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "longest-substring-no-repeat-v2": {
      correctPattern: "sliding-window",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "three-sum": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n²)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "group-anagrams": {
      correctPattern: "hash-map",
      correctTimeComplexity: "O(n·k log k)",
      correctSpaceComplexity: "O(n·k)",
      isOptimal: true,
    },
    "product-except-self": {
      correctPattern: "prefix-suffix",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "container-with-most-water-v2": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "number-of-islands": {
      correctPattern: "bfs-dfs",
      correctTimeComplexity: "O(m·n)",
      correctSpaceComplexity: "O(m·n)",
      isOptimal: true,
    },
    "invert-binary-tree": {
      correctPattern: "recursion",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(h)",
      isOptimal: true,
    },
    "validate-bst": {
      correctPattern: "recursion",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(h)",
      isOptimal: true,
    },
    "level-order-traversal": {
      correctPattern: "bfs-dfs",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "climbing-stairs-v2": {
      correctPattern: "dynamic-programming",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "coin-change": {
      correctPattern: "dynamic-programming",
      correctTimeComplexity: "O(n·amount)",
      correctSpaceComplexity: "O(amount)",
      isOptimal: true,
    },
    "house-robber": {
      correctPattern: "dynamic-programming",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "rotate-array": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "min-stack": {
      correctPattern: "stack",
      correctTimeComplexity: "O(1)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "top-k-frequent": {
      correctPattern: "hash-map",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "merge-intervals": {
      correctPattern: "intervals",
      correctTimeComplexity: "O(n log n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "search-rotated-sorted-array": {
      correctPattern: "binary-search",
      correctTimeComplexity: "O(log n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "letter-combinations-phone": {
      correctPattern: "backtracking",
      correctTimeComplexity: "O(4^n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    subsets: {
      correctPattern: "backtracking",
      correctTimeComplexity: "O(2^n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "word-break": {
      correctPattern: "dynamic-programming",
      correctTimeComplexity: "O(n²·k)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "longest-increasing-subsequence": {
      correctPattern: "dynamic-programming",
      correctTimeComplexity: "O(n log n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "course-schedule": {
      correctPattern: "bfs-dfs",
      correctTimeComplexity: "O(V+E)",
      correctSpaceComplexity: "O(V+E)",
      isOptimal: true,
    },
    "word-search": {
      correctPattern: "backtracking",
      correctTimeComplexity: "O(m·n·4^L)",
      correctSpaceComplexity: "O(L)",
      isOptimal: true,
    },
    permutations: {
      correctPattern: "backtracking",
      correctTimeComplexity: "O(n!)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "kth-largest-element": {
      correctPattern: "hash-map",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "spiral-matrix": {
      correctPattern: "design",
      correctTimeComplexity: "O(m·n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "set-matrix-zeroes": {
      correctPattern: "design",
      correctTimeComplexity: "O(m·n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },

    // ─── HARD ────────────────────────────────
    "trapping-rain-water": {
      correctPattern: "two-pointers",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "median-two-sorted-arrays": {
      correctPattern: "binary-search",
      correctTimeComplexity: "O(log min(m,n))",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "serialize-deserialize-tree": {
      correctPattern: "bfs-dfs",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "lru-cache": {
      correctPattern: "design",
      correctTimeComplexity: "O(1)",
      correctSpaceComplexity: "O(capacity)",
      isOptimal: true,
    },
    "minimum-window-substring": {
      correctPattern: "sliding-window",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "merge-k-sorted-lists": {
      correctPattern: "design",
      correctTimeComplexity: "O(n log k)",
      correctSpaceComplexity: "O(k)",
      isOptimal: true,
    },
    "longest-palindromic-substring": {
      correctPattern: "dynamic-programming",
      correctTimeComplexity: "O(n²)",
      correctSpaceComplexity: "O(1)",
      isOptimal: true,
    },
    "implement-trie": {
      correctPattern: "design",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
    "clone-graph": {
      correctPattern: "bfs-dfs",
      correctTimeComplexity: "O(V+E)",
      correctSpaceComplexity: "O(V)",
      isOptimal: true,
    },
    "longest-consecutive-sequence": {
      correctPattern: "hash-map",
      correctTimeComplexity: "O(n)",
      correctSpaceComplexity: "O(n)",
      isOptimal: true,
    },
  };

  let updated = 0;
  let skipped = 0;

  for (const [slug, data] of Object.entries(reflectionData)) {
    const result = await prisma.problem.updateMany({
      where: { slug },
      data: {
        correctPattern: data.correctPattern,
        correctTimeComplexity: data.correctTimeComplexity,
        correctSpaceComplexity: data.correctSpaceComplexity,
        isOptimal: data.isOptimal,
      },
    });

    if (result.count > 0) {
      updated++;
    } else {
      skipped++;
      console.log(`   ⚠ Slug not found: "${slug}" — skipped`);
    }
  }

  console.log(`\n✅ Reflection data seeded: ${updated} updated, ${skipped} skipped`);
}

if (require.main === module || process.argv[1]?.includes("seed-reflections")) {
  seedReflections()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
