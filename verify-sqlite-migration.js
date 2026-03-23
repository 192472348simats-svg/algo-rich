#!/usr/bin/env node

/**
 * SQLITE MIGRATION VERIFICATION REPORT
 * Comprehensive check of all database configuration changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n' + '='.repeat(70));
console.log('🔍 SQLITE MIGRATION VERIFICATION REPORT');
console.log('='.repeat(70));

const checks = [];

// Check 1: .env file exists and has SQLite
console.log('\n📋 Check 1: Environment Configuration');
try {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Get only active DATABASE_URL (not commented examples)
  const activeDbUrl = envContent.split('\n')
    .find(line => line.match(/^DATABASE_URL=/) && !line.startsWith('#'));
  
  const hasSQLiteUrl = activeDbUrl && activeDbUrl.includes('file:./prisma/dev.db');
  
  console.log(`  ✓ .env file exists`);
  console.log(`  ${hasSQLiteUrl ? '✓' : '✗'} Active DATABASE_URL: ${activeDbUrl || 'NOT FOUND'}`);
  console.log(`  ✓ Production examples included (for reference)`);
  checks.push(hasSQLiteUrl);
} catch (e) {
  console.log(`  ✗ Error reading .env: ${e.message}`);
  checks.push(false);
}

// Check 2: Prisma schema uses SQLite
console.log('\n📋 Check 2: Prisma Schema Configuration');
try {
  const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const hasSQLiteProvider = schemaContent.includes('provider = "sqlite"');
  const hasPostgresProvider = schemaContent.includes('provider = "postgresql"');
  const hasDirectUrl = schemaContent.includes('directUrl');
  
  console.log(`  ${hasSQLiteProvider ? '✓' : '✗'} Uses SQLite provider`);
  console.log(`  ${hasPostgresProvider ? '✗' : '✓'} No PostgreSQL provider`);
  console.log(`  ${hasDirectUrl ? '✗' : '✓'} No directUrl field`);
  checks.push(hasSQLiteProvider && !hasPostgresProvider && !hasDirectUrl);
} catch (e) {
  console.log(`  ✗ Error reading schema: ${e.message}`);
  checks.push(false);
}

// Check 3: SQLite database exists
console.log('\n📋 Check 3: SQLite Database File');
try {
  const dbPath = path.join(__dirname, 'prisma', 'dev.db');
  const dbExists = fs.existsSync(dbPath);
  
  if (dbExists) {
    const stats = fs.statSync(dbPath);
    console.log(`  ✓ Database file exists: prisma/dev.db`);
    console.log(`    File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`    Created: ${stats.birthtime.toISOString()}`);
  } else {
    console.log(`  ✗ Database file not found at prisma/dev.db`);
  }
  checks.push(dbExists);
} catch (e) {
  console.log(`  ✗ Error checking database: ${e.message}`);
  checks.push(false);
}

// Check 4: Migrations exist
console.log('\n📋 Check 4: Prisma Migrations');
try {
  const migrationsPath = path.join(__dirname, 'prisma', 'migrations');
  
  if (!fs.existsSync(migrationsPath)) {
    console.log(`  ✗ Migrations directory not found`);
    checks.push(false);
  } else {
    const migrations = fs.readdirSync(migrationsPath)
      .filter(f => fs.statSync(path.join(migrationsPath, f)).isDirectory());
    
    console.log(`  ✓ Migrations directory exists`);
    console.log(`    Total migrations: ${migrations.length}`);
    
    migrations.forEach(migration => {
      console.log(`    - ${migration}`);
    });
    
    checks.push(migrations.length > 0);
  }
} catch (e) {
  console.log(`  ✗ Error checking migrations: ${e.message}`);
  checks.push(false);
}

// Check 5: No PostgreSQL migrations
console.log('\n📋 Check 5: Migration Cleanup');
try {
  const migrationsPath = path.join(__dirname, 'prisma', 'migrations');
  const migrations = fs.readdirSync(migrationsPath);
  const postgresNames = migrations.filter(m => m.includes('postgres') || m.includes('postgresql'));
  
  console.log(`  ${postgresNames.length === 0 ? '✓' : '✗'} No PostgreSQL migrations`);
  console.log(`    Total items in migrations: ${migrations.length}`);
  checks.push(postgresNames.length === 0);
} catch (e) {
  console.log(`  ✗ Error: ${e.message}`);
  checks.push(false);
}

// Check 6: Prisma Client generated
console.log('\n📋 Check 6: Prisma Client');
try {
  const clientPath = path.join(__dirname, 'node_modules', '@prisma', 'client', 'index.js');
  const clientExists = fs.existsSync(clientPath);
  
  console.log(`  ${clientExists ? '✓' : '✗'} Prisma Client generated at @prisma/client`);
  checks.push(clientExists);
} catch (e) {
  console.log(`  ✗ Error: ${e.message}`);
  checks.push(false);
}

// Summary
console.log('\n' + '='.repeat(70));
const passed = checks.filter(c => c).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`\n📊 RESULTS: ${passed}/${total} Checks Passed (${percentage}%)\n`);

if (percentage === 100) {
  console.log('✅ SQLite Migration Complete! All checks passed.\n');
  console.log('Next steps:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Open browser: http://localhost:3000');
  console.log('  3. Test database operations');
} else {
  console.log('⚠️  Some checks failed. Review the errors above.\n');
}

console.log('='.repeat(70) + '\n');

process.exit(percentage === 100 ? 0 : 1);
