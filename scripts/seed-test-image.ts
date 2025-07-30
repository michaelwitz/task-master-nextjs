import { db } from '../lib/db'
import { IMAGE_METADATA, IMAGE_DATA, TASKS } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

// Simple 1x1 pixel red PNG image as base64 (for testing)
const TEST_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

// Simple 1x1 pixel blue PNG thumbnail as base64 (for testing)
const TEST_THUMBNAIL_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

async function seedTestImage() {
  try {
    console.log('🚀 Seeding test image data...')

    // Find the first task to attach the image to
    const firstTask = await db.select().from(TASKS).limit(1)
    
    if (firstTask.length === 0) {
      console.error('❌ No tasks found in database. Please run the main seed script first.')
      process.exit(1)
    }

    const taskId = firstTask[0].id

    // Insert image metadata
    const [imageMetadata] = await db.insert(IMAGE_METADATA).values({
      task_id: taskId,
      original_name: 'test-image.png',
      content_type: 'image/png',
      file_size: 67, // Size of the base64 decoded data
      url: '/api/images/1', // Will point to our API endpoint
      storage_type: 'local',
    }).returning()

    console.log(`📝 Created image metadata with ID: ${imageMetadata.id}`)

    // Insert image binary data
    await db.insert(IMAGE_DATA).values({
      id: imageMetadata.id,
      data: TEST_IMAGE_BASE64,
      thumbnail_data: TEST_THUMBNAIL_BASE64,
    })

    console.log(`🖼️ Inserted image data for image ID: ${imageMetadata.id}`)
    console.log(`✅ Test image seeded successfully for task ID: ${taskId}`)
    
  } catch (error) {
    console.error('❌ Error seeding test image:', error)
    process.exit(1)
  }
}

seedTestImage()
