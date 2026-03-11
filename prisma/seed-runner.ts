import { seedCourses } from './seed'
import { seedProblems } from './seed-problems-50'
import { seedPhases } from './seed-phases'

async function main() {
  console.log('🌱 Seeding courses, lessons, patterns...')
  await seedCourses()
  console.log('🌱 Seeding hand-crafted problems...')
  await seedProblems()
  console.log('🌱 Seeding phase problems...')
  await seedPhases()
  console.log('✅ All seeds complete.')
}

main().catch(console.error)
