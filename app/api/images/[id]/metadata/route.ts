import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { IMAGE_METADATA } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const imageId = parseInt(id)
    
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 })
    }

    // Get image metadata
    const result = await db
      .select()
      .from(IMAGE_METADATA)
      .where(eq(IMAGE_METADATA.id, imageId))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching image metadata:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
