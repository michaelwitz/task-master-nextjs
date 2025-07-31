import { db } from '../lib/db'
import { sql } from 'drizzle-orm'

async function clearData() {
  try {
    console.log('🧹 Starting data cleanup...\n')

    // Use TRUNCATE CASCADE to handle foreign key constraints automatically
    console.log('🗑️  Truncating all tables with CASCADE...')
    
    // Truncate tables in reverse dependency order with CASCADE
    await db.execute(sql`TRUNCATE TABLE "TASK_TAGS" CASCADE`)
    console.log(`  ✅ Truncated TASK_TAGS`)
    
    await db.execute(sql`TRUNCATE TABLE "IMAGE_DATA" CASCADE`)
    console.log(`  ✅ Truncated IMAGE_DATA`)
    
    await db.execute(sql`TRUNCATE TABLE "IMAGE_METADATA" CASCADE`)
    console.log(`  ✅ Truncated IMAGE_METADATA`)
    
    await db.execute(sql`TRUNCATE TABLE "TASKS" CASCADE`)
    console.log(`  ✅ Truncated TASKS`)
    
    await db.execute(sql`TRUNCATE TABLE "PROJECTS" CASCADE`)
    console.log(`  ✅ Truncated PROJECTS`)
    
    await db.execute(sql`TRUNCATE TABLE "USERS" CASCADE`)
    console.log(`  ✅ Truncated USERS`)
    
    await db.execute(sql`TRUNCATE TABLE "TAGS" CASCADE`)
    console.log(`  ✅ Truncated TAGS`)

    // Reset sequences to start from 1
    await db.execute(sql`ALTER SEQUENCE "USERS_id_seq" RESTART WITH 1`)
    await db.execute(sql`ALTER SEQUENCE "PROJECTS_id_seq" RESTART WITH 1`)
    await db.execute(sql`ALTER SEQUENCE "TASKS_id_seq" RESTART WITH 1`)
    await db.execute(sql`ALTER SEQUENCE "IMAGE_METADATA_id_seq" RESTART WITH 1`)
    console.log(`  ✅ Reset all sequences`)

    console.log('\n🎉 Data cleanup completed successfully!')
    console.log('✨ Database is now clean and ready for fresh seeding.')

  } catch (error) {
    console.error('❌ Error during data cleanup:', error)
    process.exit(1)
  }
}

clearData()
