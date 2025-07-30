import { db } from '../lib/db'
import { IMAGE_METADATA, IMAGE_DATA, TASKS } from '../lib/db/schema'
import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

async function seedRealImage() {
  try {
    console.log('🚀 Seeding real image from Downloads...')

    // Path to the test image in Downloads
    const imagePath = join(homedir(), 'Downloads', 'test-image.png')
    
    // Check if file exists and get stats
    let stats
    try {
      stats = statSync(imagePath)
    } catch (error) {
      console.error(`❌ File not found: ${imagePath}`)
      process.exit(1)
    }

    console.log(`📁 Found image: ${imagePath} (${stats.size} bytes)`)

    // Read the file and convert to base64
    const imageBuffer = readFileSync(imagePath)
    const base64Data = imageBuffer.toString('base64')
    
    console.log(`📊 Image size: ${stats.size} bytes, Base64 size: ${base64Data.length} characters`)

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
      file_size: stats.size,
      url: `/api/images/${2}`, // Will be ID 2 (assuming ID 1 exists from previous test)
      storage_type: 'local',
    }).returning()

    console.log(`📝 Created image metadata with ID: ${imageMetadata.id}`)

    // Insert image binary data
    await db.insert(IMAGE_DATA).values({
      id: imageMetadata.id,
      data: base64Data,
      thumbnail_data: null, // We'll implement thumbnail generation later
    })

    console.log(`🖼️ Inserted image data for image ID: ${imageMetadata.id}`)
    console.log(`✅ Real image seeded successfully for task ID: ${taskId}`)
    console.log(`🔗 Image URL: http://localhost:3000/api/images/${imageMetadata.id}`)
    
  } catch (error) {
    console.error('❌ Error seeding real image:', error)
    process.exit(1)
  }
}

seedRealImage()
