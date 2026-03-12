import { PrismaClient } from "@prisma/client";
import { seedCoursesAndLessons } from "./seed-courses-full";
import { seedProblems } from "./seed-problems-complete";
import { seedLessonProblems } from "./seed-lesson-problems";

const prisma = new PrismaClient();

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌱 ALGO RICH — MASTER SEED RUNNER");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Step 1: Courses and Lessons (no dependencies)
  console.log("\n📚 Step 1/3: Seeding courses and lessons...");
  await seedCoursesAndLessons();

  // Step 2: Problems (no dependencies)
  console.log("\n🧩 Step 2/3: Seeding 50 problems...");
  await seedProblems();

  // Step 3: Lesson-Problem links (depends on Step 1 + 2)
  console.log("\n🔗 Step 3/3: Linking lessons to problems...");
  await seedLessonProblems();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ ALL SEEDS COMPLETE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nVerification counts:");
  const courses = await prisma.course.count();
  const lessons = await prisma.lesson.count();
  const problems = await prisma.problem.count();
  const lessonProblems = await prisma.lessonProblem.count();
  console.log(`  Courses:         ${courses}`);
  console.log(`  Lessons:         ${lessons}`);
  console.log(`  Problems:        ${problems}`);
  console.log(`  Lesson-Problems: ${lessonProblems}`);
}

main()
  .catch((e) => {
    console.error("❌ Master seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
