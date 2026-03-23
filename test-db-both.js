const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('=== DATABASE CONNECTION TEST - DETAILED ===\n');
  
  console.log('Test 1: Using DATABASE_URL (pooler)...');
  console.log('URL:', process.env.DATABASE_URL.substring(0, 60) + '...');
  const prismaPooler = new PrismaClient({ 
    datasources: { 
      db: { url: process.env.DATABASE_URL } 
    }
  });
  
  try {
    const result = await prismaPooler.$queryRawUnsafe('SELECT NOW()');
    console.log('✓ POOLER SUCCESS:', result);
  } catch (error) {
    console.log('✗ Pooler error:', error.message);
  } finally {
    await prismaPooler.$disconnect();
  }
  
  console.log('\nTest 2: Using DIRECT_URL...');
  console.log('URL:', process.env.DIRECT_URL.substring(0, 60) + '...');
  const prismaDirect = new PrismaClient({ 
    datasources: { 
      db: { url: process.env.DIRECT_URL } 
    }
  });
  
  try {
    const result = await prismaDirect.$queryRawUnsafe('SELECT NOW()');
    console.log('✓ DIRECT SUCCESS:', result);
  } catch (error) {
    console.log('✗ Direct error:', error.message);
  } finally {
    await prismaDirect.$disconnect();
  }
}

testConnection();
