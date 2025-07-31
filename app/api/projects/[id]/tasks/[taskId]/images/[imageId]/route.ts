import { NextRequest, NextResponse } from 'next/server'
import { db, IMAGE_METADATA } from '@/lib/db'
import { eq, and } from 'drizzle-orm'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; taskId: string; imageId: string }> }
) {
  try {
    const params = await context.params
    const taskId = parseInt(params.taskId)
    const imageId = parseInt(params.imageId)

    // Verify the image belongs to the task
    const image = await db.select().from(IMAGE_METADATA)
      .where(and(eq(IMAGE_METADATA.id, imageId), eq(IMAGE_METADATA.task_id, taskId)))
      .then(rows => rows[0])

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from database (IMAGE_DATA will be deleted automatically due to cascade)
    await db.delete(IMAGE_METADATA).where(eq(IMAGE_METADATA.id, imageId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
