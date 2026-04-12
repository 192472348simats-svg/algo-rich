import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// A simple CLI script to ingest new problems manually or from a JSON file.
// Usage: npx tsx scripts/ingest-problem.ts path/to/problem.json

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("Please provide a path to a JSON file. Example: npx tsx scripts/ingest-problem.ts problems/my-new-problem.json");
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  
  // Validate basic schema
  const required = ["slug", "title", "difficulty", "description", "starterCode", "testCases"];
  for (const field of required) {
    if (!data[field]) {
      console.error(`Missing required field: ${field}`);
      process.exit(1);
    }
  }

  try {
    const problem = await prisma.problem.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        difficulty: data.difficulty,
        pattern: data.pattern || null,
        description: data.description,
        starterCode: data.starterCode,
        solutionCode: data.solutionCode || null,
        solutionExplanation: data.solutionExplanation || null,
        testCases: typeof data.testCases === "string" ? data.testCases : JSON.stringify(data.testCases),
        hiddenTestCases: data.hiddenTestCases ? (typeof data.hiddenTestCases === "string" ? data.hiddenTestCases : JSON.stringify(data.hiddenTestCases)) : "[]",
        isActive: data.isActive ?? true,
        category: data.category || "DSA",
        correctPattern: data.correctPattern || null,
        correctTimeComplexity: data.correctTimeComplexity || null,
        correctSpaceComplexity: data.correctSpaceComplexity || null,
        isOptimal: data.isOptimal ?? true
      },
      create: {
        slug: data.slug,
        title: data.title,
        difficulty: data.difficulty,
        pattern: data.pattern || null,
        description: data.description,
        starterCode: data.starterCode,
        solutionCode: data.solutionCode || null,
        solutionExplanation: data.solutionExplanation || null,
        testCases: typeof data.testCases === "string" ? data.testCases : JSON.stringify(data.testCases),
        hiddenTestCases: data.hiddenTestCases ? (typeof data.hiddenTestCases === "string" ? data.hiddenTestCases : JSON.stringify(data.hiddenTestCases)) : "[]",
        isActive: data.isActive ?? true,
        category: data.category || "DSA",
        correctPattern: data.correctPattern || null,
        correctTimeComplexity: data.correctTimeComplexity || null,
        correctSpaceComplexity: data.correctSpaceComplexity || null,
        isOptimal: data.isOptimal ?? true
      }
    });

    console.log(`✅ Successfully ingested problem: ${problem.title} (${problem.slug})`);
  } catch (error) {
    console.error("Failed to ingest problem to database:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
