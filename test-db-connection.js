const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('=== TEST 3: Prisma Database Connection ===');
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing DATABASE_URL (pooler connection)...');
    const result = await prisma.$queryRawUnsafe('SELECT 1');
    console.log('✓ Pooler connection SUCCESS:', result);
  } catch (error) {
    console.log('✗ Pooler connection FAILED:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
