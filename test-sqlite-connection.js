const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('\n✅ Testing SQLite Connection...\n');
    
    const courses = await prisma.course.count();
    const lessons = await prisma.lesson.count();
    const users = await prisma.user.count();
    
    console.log('📊 Database Stats:');
    console.log(`   Courses: ${courses}`);
    console.log(`   Lessons: ${lessons}`);
    console.log(`   Users: ${users}`);
    
    // Fetch sample course
    const sampleCourse = await prisma.course.findFirst({
      include: { lessons: true }
    });
    
    if (sampleCourse) {
      console.log('\n📚 Sample Course:');
      console.log(`   Title: ${sampleCourse.title}`);
      console.log(`   Lessons: ${sampleCourse.lessons.length}`);
    }
    
    console.log('\n✅ SQLite Connection Successful!');
  } catch (error) {
    console.error('\n❌ Connection Error:');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
