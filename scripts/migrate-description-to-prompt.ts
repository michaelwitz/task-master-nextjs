#!/usr/bin/env tsx

import { db } from '../lib/db'
import { sql } from 'drizzle-orm'

async function migrateDescriptionToPrompt() {
  try {
    console.log('🔄 Migrating task description column to prompt...')
    
    // Step 1: Add the new prompt column
    console.log('  ➕ Adding prompt column...')
    await db.execute(sql`ALTER TABLE "TASKS" ADD COLUMN "prompt" text`)
    
    // Step 2: Copy data from description to prompt
    console.log('  📋 Copying data from description to prompt...')
    await db.execute(sql`UPDATE "TASKS" SET "prompt" = "description" WHERE "description" IS NOT NULL`)
    
    // Step 3: Drop the old description column
    console.log('  ➖ Dropping description column...')
    await db.execute(sql`ALTER TABLE "TASKS" DROP COLUMN "description"`)
    
    console.log('✅ Migration completed successfully!')
    console.log('   All task descriptions have been migrated to prompt column.')
    
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

migrateDescriptionToPrompt()
