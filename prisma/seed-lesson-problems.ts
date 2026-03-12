import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lessonProblemMap: Record<string, string[]> = {
  "python-basics-review": ["two-sum", "contains-duplicate", "valid-anagram"],
  "time-space-complexity": ["two-sum", "maximum-subarray", "best-time-buy-sell-stock"],
  "array-two-pointers": ["move-zeroes", "3sum", "container-with-most-water", "trapping-rain-water"],
  "sliding-window-pattern": ["longest-substring-without-repeating", "best-time-buy-sell-stock", "sliding-window-maximum"],
  "hashmaps-and-sets": ["two-sum", "valid-anagram", "group-anagrams", "contains-duplicate", "top-k-frequent-elements"],
  "stacks-and-queues": ["valid-parentheses", "min-stack"],
  "linked-lists-fundamentals": ["reverse-linked-list", "linked-list-cycle", "merge-two-sorted-lists"],
  "binary-search": ["binary-search", "search-in-rotated-sorted-array", "find-minimum-in-rotated-sorted-array"],
  "trees-and-bst": ["maximum-depth-binary-tree", "invert-binary-tree", "validate-binary-search-tree", "lowest-common-ancestor-bst"],
  "recursion-and-backtracking": ["generate-parentheses", "subsets", "permutations", "word-search"],
  "fast-slow-pointers": ["linked-list-cycle", "find-duplicate-number"],
  "merge-intervals": ["merge-intervals"],
  "bfs-and-dfs-graphs": ["number-of-islands", "course-schedule", "word-ladder", "binary-tree-level-order"],
  "dynamic-programming-intro": ["climbing-stairs", "coin-change", "longest-increasing-subsequence", "maximum-product-subarray"],
  "heap-priority-queue": ["kth-largest-element", "top-k-frequent-elements"],
};

export async function seedLessonProblems() {
  console.log("🔗 Linking lessons to problems...\n");

  let linked = 0;
  let skipped = 0;

  for (const [lessonSlug, problemSlugs] of Object.entries(lessonProblemMap)) {
    const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } });
    if (!lesson) {
      console.log(`  ⚠ Lesson not found: ${lessonSlug}`);
      skipped += problemSlugs.length;
      continue;
    }

    for (let i = 0; i < problemSlugs.length; i++) {
      const problem = await prisma.problem.findUnique({ where: { slug: problemSlugs[i] } });
      if (!problem) {
        console.log(`  ⚠ Problem not found: ${problemSlugs[i]}`);
        skipped++;
        continue;
      }

      try {
        await prisma.lessonProblem.upsert({
          where: {
            lessonId_problemId: {
              lessonId: lesson.id,
              problemId: problem.id,
            },
          },
          update: { order: i },
          create: {
            lessonId: lesson.id,
            problemId: problem.id,
            order: i,
          },
        });
        linked++;
        console.log(`  ✓ ${lessonSlug} → ${problemSlugs[i]} (order: ${i})`);
      } catch (e) {
        console.log(`  ⚠ Failed: ${lessonSlug} → ${problemSlugs[i]}: ${(e as Error).message?.slice(0, 60)}`);
        skipped++;
      }
    }
  }

  console.log(`\n✅ Linked ${linked} lesson-problem pairs (${skipped} skipped)`);
}

if (require.main === module || process.argv[1]?.includes('seed-lesson-problems')) {
  seedLessonProblems()
    .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
