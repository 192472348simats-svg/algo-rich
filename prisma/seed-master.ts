// Load .env.local first (same as Next.js app), then fall back to .env
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env.local with override=true so its values take precedence
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
} else {
  dotenv.config({ override: true });
}

import { PrismaClient } from "@prisma/client";
import { seedCoursesAndLessons } from "./seed-courses-full";
import { seedPatterns } from "./seed-patterns";
import { seedProblems } from "./seed-problems-complete";
import { seedLessonProblems } from "./seed-lesson-problems";
import { seedFoundations } from "./seed-problems-foundations";
import { seedCards } from "./seed-cards-60";
import { seedReflections } from "./seed-reflections";
import { seedExpansionProblems } from "./seed-problems-expansion";
import { seedExpansionCards } from "./seed-cards-expansion";
import { seedPhase3CompanyProblems } from "./seed-phase3-company-problems";

let databaseUrl = process.env.DATABASE_URL || "";
if (databaseUrl && !databaseUrl.includes("connect_timeout")) {
  const separator = databaseUrl.includes("?") ? "&" : "?";
  databaseUrl = `${databaseUrl}${separator}connect_timeout=30&pool_timeout=30`;
}

const prisma = new PrismaClient({
  log: ["error", "warn"],
  datasourceUrl: databaseUrl,
});

// ── Retry wrapper ──────────────────────────────────────────
// Retries each seed step up to `retries` times with a 5-second
// delay between attempts to handle transient Supabase timeouts.
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  retries = 3
): Promise<T> {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      const msg = (e as Error).message?.slice(0, 120) ?? String(e);
      console.error(`  ⚠  ${label} — attempt ${i}/${retries} failed: ${msg}`);
      if (i === retries) throw e;
      console.log(`     Retrying in 5 s...`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  throw new Error("unreachable");
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌱 ALGO RICH — MASTER SEED RUNNER");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   DB: ${(process.env.DATABASE_URL ?? "").slice(0, 60)}...`);

  // Step 1: Courses and Lessons (no dependencies)
  console.log("\n📚 Step 1/9: Seeding courses and lessons...");
  await withRetry(() => seedCoursesAndLessons(), "Courses & Lessons");

  // Step 2: Patterns (no dependencies)
  console.log("\n🔗 Step 2/9: Seeding patterns...");
  await withRetry(() => seedPatterns(), "Patterns");

  // Step 3: Foundations (Problems 0)
  console.log("\n🧪 Step 3/9: Seeding foundational problems...");
  await withRetry(() => seedFoundations(), "Foundational Problems");

  // Step 4: Problems (depends on Step 2 for foreign key)
  console.log("\n🧩 Step 4/9: Seeding canonical problem set...");
  await withRetry(() => seedProblems(), "Canonical Problems");

  // Step 5: Lesson-Problem links (depends on Step 1 + 3 + 4)
  console.log("\n🔗 Step 5/9: Linking lessons to problems...");
  await withRetry(() => seedLessonProblems(), "Lesson-Problem Links");

  // Step 6: Prediction Cards (no dependencies)
  console.log("\n🃏 Step 6/9: Seeding prediction cards...");
  await withRetry(() => seedCards(), "Prediction Cards");

  // Step 7: Reflections (depends on Step 4)
  console.log("\n🧠 Step 7/9: Seeding reflections validation data...");
  await withRetry(() => seedReflections(), "Reflections");

  // Step 8: Expansion Problems (100 new problems)
  console.log("\n🧩 Step 8/9: Seeding expansion problem set (100 new problems)...");
  await withRetry(() => seedExpansionProblems(), "Expansion Problems");

  // Step 9: Expansion Cards (100 new prediction cards)
  console.log("\n🃏 Step 9/10: Seeding expansion prediction cards (100 new cards)...");
  await withRetry(() => seedExpansionCards(), "Expansion Cards");

  // Step 10: Phase 3 Company-targeted problems
  console.log("\n🎯 Step 10/10: Seeding Phase 3 company problems (10 targeted problems)...");
  await withRetry(() => seedPhase3CompanyProblems(), "Phase 3 Company Problems");

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ ALL SEEDS COMPLETE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nVerification counts:");
  const courses = await prisma.course.count();
  const lessons = await prisma.lesson.count();
  const patterns = await prisma.pattern.count();
  const problems = await prisma.problem.count();
  const lessonProblems = await prisma.lessonProblem.count();
  const cards = await prisma.predictionCard.count();
  const mockInterviews = await prisma.mockInterviewSession.count();
  console.log(`  Courses:          ${courses}`);
  console.log(`  Lessons:          ${lessons}`);
  console.log(`  Patterns:         ${patterns}`);
  console.log(`  Problems:         ${problems}`);
  console.log(`  Lesson-Problems:  ${lessonProblems}`);
  console.log(`  Prediction Cards: ${cards}`);
  console.log(`  Mock Interviews:  ${mockInterviews}`);
}

main()
  .catch((e) => {
    console.error("❌ Master seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
