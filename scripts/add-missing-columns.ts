#!/usr/bin/env tsx

import { db } from '../lib/db'
import { sql } from 'drizzle-orm'

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns to PROJECTS table...')
    
    // Add code column
    await db.execute(sql`ALTER TABLE "PROJECTS" ADD COLUMN IF NOT EXISTS "code" varchar(10) NOT NULL DEFAULT 'TEMP'`)
    console.log('  ✅ Added code column')
    
    // Add description column  
    await db.execute(sql`ALTER TABLE "PROJECTS" ADD COLUMN IF NOT EXISTS "description" text`)
    console.log('  ✅ Added description column')
    
    // Add unique constraint on code (try to add, ignore if exists)
    try {
      await db.execute(sql`ALTER TABLE "PROJECTS" ADD CONSTRAINT "PROJECTS_code_unique" UNIQUE("code")`)
      console.log('  ✅ Added unique constraint on code')
    } catch (error: any) {
      if (error.cause?.code === '42P07') {
        console.log('  ℹ️  Unique constraint already exists')
      } else {
        throw error
      }
    }
    
    console.log('✅ All missing columns added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding columns:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

addMissingColumns()
