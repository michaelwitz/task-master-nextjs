import { db } from '../lib/db'
import { sql } from 'drizzle-orm'

async function migrateAddImageTables() {
  try {
    console.log('🚀 Creating image tables...')

    // Create IMAGE_METADATA table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "IMAGE_METADATA" (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL REFERENCES "TASKS"(id) ON DELETE CASCADE,
        original_name VARCHAR(255) NOT NULL,
        content_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        url VARCHAR(500) NOT NULL,
        storage_type VARCHAR(20) NOT NULL DEFAULT 'local',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `)

    // Create IMAGE_DATA table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "IMAGE_DATA" (
        id INTEGER PRIMARY KEY REFERENCES "IMAGE_METADATA"(id) ON DELETE CASCADE,
        data TEXT NOT NULL,
        thumbnail_data TEXT
      )
    `)

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS image_metadata_task_id_idx ON "IMAGE_METADATA"(task_id)
    `)

    console.log('✅ Image tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating image tables:', error)
    process.exit(1)
  }
}

migrateAddImageTables()
