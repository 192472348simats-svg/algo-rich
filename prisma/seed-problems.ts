import { seedProblems as seedProblemsComplete } from "./seed-problems-complete";

/**
 * Canonical problem seed entrypoint.
 * Keep all production problem seeding routed through seed-problems-complete.ts.
 */
export async function seedProblems() {
  return seedProblemsComplete();
}

if (require.main === module || process.argv[1]?.includes("seed-problems.ts")) {
  seedProblems()
    .catch((e) => {
      console.error("Seed failed:", e);
      process.exit(1);
    });
}
