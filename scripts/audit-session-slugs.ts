/**
 * scripts/audit-session-slugs.ts
 *
 * Audits all session definitions to find problem slugs referenced in "code" stages.
 * Queries the database and reports which slugs exist and which are missing.
 *
 * Run: npx tsx scripts/audit-session-slugs.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load env vars from .env.local first, then .env
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
} else {
  dotenv.config({ override: true });
}

import { prisma } from "../lib/prisma";
// Import getAllSessionDefinitions — this also registers all sessions via side effects
import { getAllSessionDefinitions } from "../lib/sessionDefinitions";

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 SESSION → PROBLEM SLUG AUDIT");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const sessions = getAllSessionDefinitions();

  // Collect all problem slugs used by code stages
  const slugMap: Record<string, string[]> = {}; // slug → [sessionTitle, ...]
  for (const session of sessions) {
    for (const stage of session.stages) {
      if (stage.type === "code") {
        const config = stage.config as { problemSlug: string };
        const slug = config.problemSlug;
        if (!slugMap[slug]) slugMap[slug] = [];
        slugMap[slug].push(session.title);
      }
    }
  }

  const uniqueSlugs = Object.keys(slugMap);
  console.log(`\nFound ${uniqueSlugs.length} unique problem slugs across ${sessions.length} sessions:\n`);

  // Query DB for each slug
  let found = 0;
  let missing = 0;
  const missingList: { slug: string; usedIn: string[] }[] = [];

  for (const slug of uniqueSlugs) {
    try {
      const problem = await prisma.problem.findUnique({
        where: { slug },
        select: { id: true, title: true, difficulty: true },
      });

      if (problem) {
        console.log(`  ✅ "${slug}"`);
        console.log(`       DB: "${problem.title}" (${problem.difficulty})`);
        console.log(`       Used in: ${slugMap[slug].join(", ")}`);
        found++;
      } else {
        console.log(`  ❌ "${slug}" — NOT IN DATABASE`);
        console.log(`       Used in: ${slugMap[slug].join(", ")}`);
        missing++;
        missingList.push({ slug, usedIn: slugMap[slug] });
      }
    } catch (err) {
      console.log(`  ⚠  "${slug}" — DB query failed:`, err);
    }
    console.log("");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Summary: ${found} found ✅, ${missing} missing ❌`);
  if (missingList.length > 0) {
    console.log("\nMissing slugs to add to seed-problems-foundations.ts:");
    for (const { slug, usedIn } of missingList) {
      console.log(`  - "${slug}" (used by: ${usedIn.join(", ")})`);
    }
    console.log(
      "\nRun: npx tsx prisma/seed-master.ts   to seed all problems"
    );
  } else {
    console.log("\n🎉 All session problem slugs are present in the database!");
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("Audit failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
