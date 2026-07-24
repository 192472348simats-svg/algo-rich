import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error", "warn"] });

async function test() {
  console.log("Testing DB connection...");
  console.log("URL:", (process.env.DATABASE_URL ?? "").slice(0, 50) + "...");
  try {
    await prisma.$connect();
    console.log("✅ Connected successfully!");
    const count = await prisma.problem.count();
    console.log(`   Problems in DB: ${count}`);
    const patternCount = await prisma.pattern.count();
    console.log(`   Patterns in DB: ${patternCount}`);
  } catch (e) {
    console.error("❌ Connection failed:", (e as Error).message.slice(0, 300));
  } finally {
    await prisma.$disconnect();
  }
}

test();
