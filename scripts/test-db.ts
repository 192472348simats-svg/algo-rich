import { PrismaClient } from "@prisma/client";

async function testUrl(label: string, url: string) {
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  const host = url.split("@")[1]?.split("/")[0];
  try {
    console.log(`\n🔌 Testing ${label}...`);
    console.log(`   Host: ${host}`);
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ ${label} — Connected!`);
    const count = await prisma.user.count();
    console.log(`✅ User table accessible. Count: ${count}`);
    return true;
  } catch (e: unknown) {
    console.error(`❌ ${label} — Failed: ${String(e).split("\n")[2]?.trim() ?? String(e).slice(0, 120)}`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const dbUrl = process.env.DATABASE_URL!;
  const directUrl = process.env.DIRECT_URL!;

  const poolerOk = await testUrl("DATABASE_URL (pooler)", dbUrl);
  const directOk = await testUrl("DIRECT_URL (direct)", directUrl);

  console.log("\n--- Summary ---");
  console.log(`DATABASE_URL : ${poolerOk ? "✅ OK" : "❌ FAIL"}`);
  console.log(`DIRECT_URL   : ${directOk ? "✅ OK" : "❌ FAIL"}`);
}

main();
