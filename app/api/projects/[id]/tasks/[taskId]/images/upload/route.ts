import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { IMAGE_METADATA, IMAGE_DATA } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

interface UploadImageData {
  originalName: string
  contentType: string
  fileSize: number
  base64Data: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params
    const taskIdNum = parseInt(taskId)
    
    if (isNaN(taskIdNum)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 })
    }

    const body = await request.json()
    const { images }: { images: UploadImageData[] } = body

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const uploadedImages = []

    for (const imageData of images) {
      const { originalName, contentType, fileSize, base64Data } = imageData

      // Validate required fields
      if (!originalName || !contentType || !fileSize || !base64Data) {
        continue // Skip invalid images
      }

      // Insert image metadata
      const [imageMetadata] = await db.insert(IMAGE_METADATA).values({
        task_id: taskIdNum,
        original_name: originalName,
        content_type: contentType,
        file_size: fileSize,
        url: `/api/images/${0}`, // Will be updated after we get the ID
        storage_type: 'local',
      }).returning()

      // Update URL with the actual image ID
      await db.update(IMAGE_METADATA)
        .set({ url: `/api/images/${imageMetadata.id}` })
        .where(eq(IMAGE_METADATA.id, imageMetadata.id))

      // Insert image binary data
      await db.insert(IMAGE_DATA).values({
        id: imageMetadata.id,
        data: base64Data,
        thumbnail_data: null, // We could generate thumbnails here in the future
      })

      uploadedImages.push({
        id: imageMetadata.id,
        originalName: imageMetadata.original_name,
        contentType: imageMetadata.content_type,
        url: imageMetadata.url,
      })
    }

    return NextResponse.json({ 
      success: true, 
      images: uploadedImages,
      count: uploadedImages.length 
    })
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
