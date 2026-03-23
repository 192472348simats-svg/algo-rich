// Load .env.local first (same as Next.js app), then fall back to .env
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

import { PrismaClient } from "@prisma/client";
import { seedCoursesAndLessons } from "./seed-courses-full";
import { seedPatterns } from "./seed-patterns";
import { seedProblems } from "./seed-problems-complete";
import { seedLessonProblems } from "./seed-lesson-problems";

const prisma = new PrismaClient();

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌱 ALGO RICH — MASTER SEED RUNNER");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Step 1: Courses and Lessons (no dependencies)
  console.log("\n📚 Step 1/4: Seeding courses and lessons...");
  await seedCoursesAndLessons();

  // Step 2: Patterns (no dependencies)
  console.log("\n🔗 Step 2/4: Seeding patterns...");
  await seedPatterns();

  // Step 3: Problems (depends on Step 2 for foreign key)
  console.log("\n🧩 Step 3/4: Seeding 50 problems...");
  await seedProblems();

  // Step 4: Lesson-Problem links (depends on Step 1 + 3)
  console.log("\n🔗 Step 4/4: Linking lessons to problems...");
  await seedLessonProblems();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ ALL SEEDS COMPLETE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nVerification counts:");
  const courses = await prisma.course.count();
  const lessons = await prisma.lesson.count();
  const patterns = await prisma.pattern.count();
  const problems = await prisma.problem.count();
  const lessonProblems = await prisma.lessonProblem.count();
  console.log(`  Courses:         ${courses}`);
  console.log(`  Lessons:         ${lessons}`);
  console.log(`  Patterns:        ${patterns}`);
  console.log(`  Problems:        ${problems}`);
  console.log(`  Lesson-Problems: ${lessonProblems}`);
}

main()
  .catch((e) => {
    console.error("❌ Master seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
