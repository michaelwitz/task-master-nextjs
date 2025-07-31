import { db } from '../lib/db'
import * as fs from 'fs'
import * as path from 'path'

async function runMigration() {
  try {
    console.log('🚀 Running migration to add project code and description fields...\n')

    const migrationPath = path.join(__dirname, 'migrate-add-project-fields.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Split the SQL into individual statements (simple approach)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s !== 'COMMIT')

    for (const statement of statements) {
      if (statement) {
        console.log(`Executing: ${statement.substring(0, 50)}...`)
        await db.execute(statement)
      }
    }

    console.log('\n✅ Migration completed successfully!')
    console.log('\n📊 Verifying results...')
    
    // Verify the migration
    const result = await db.execute(`
      SELECT id, title, code, 
             CASE WHEN description IS NOT NULL THEN LENGTH(description) ELSE 0 END as desc_length, 
             created_at 
      FROM "PROJECTS" 
      ORDER BY created_at
    `)
    
    console.log('\n🔍 Current projects after migration:')
    for (const row of result) {
      console.log(`  📋 ${row.title} [${row.code}] - Description: ${row.desc_length} chars`)
    }

  } catch (error) {
    console.error('❌ Error running migration:', error)
    process.exit(1)
  }
}

runMigration()
