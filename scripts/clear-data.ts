import { db } from '../lib/db'
import { USERS, PROJECTS, TASKS } from '../lib/db/schema'

async function clearData() {
  try {
    console.log('🧹 Starting data cleanup...\n')

    // Delete in order of dependencies (tasks -> projects -> users)
    console.log('🗑️  Deleting tasks...')
    const deletedTasks = await db.delete(TASKS)
    console.log(`  ✅ Deleted all tasks`)

    console.log('🗑️  Deleting projects...')
    const deletedProjects = await db.delete(PROJECTS)
    console.log(`  ✅ Deleted all projects`)

    console.log('🗑️  Deleting users...')
    const deletedUsers = await db.delete(USERS)
    console.log(`  ✅ Deleted all users`)

    console.log('\n🎉 Data cleanup completed successfully!')
    console.log('✨ Database is now clean and ready for fresh seeding.')

  } catch (error) {
    console.error('❌ Error during data cleanup:', error)
    process.exit(1)
  }
}

clearData()
