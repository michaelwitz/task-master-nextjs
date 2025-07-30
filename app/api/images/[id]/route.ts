import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { IMAGE_METADATA, IMAGE_DATA } from '@/lib/db/schema'
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

    // Get image metadata and binary data
    const result = await db
      .select({
        metadata: IMAGE_METADATA,
        data: IMAGE_DATA.data,
        thumbnail_data: IMAGE_DATA.thumbnail_data,
      })
      .from(IMAGE_METADATA)
      .leftJoin(IMAGE_DATA, eq(IMAGE_METADATA.id, IMAGE_DATA.id))
      .where(eq(IMAGE_METADATA.id, imageId))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const { metadata, data } = result[0]

    if (!data) {
      return NextResponse.json({ error: 'Image data not found' }, { status: 404 })
    }

    // Convert base64 to binary
    const binaryData = Buffer.from(data, 'base64')

    // Return the image with proper headers
    return new NextResponse(binaryData, {
      status: 200,
      headers: {
        'Content-Type': metadata.content_type,
        'Content-Length': binaryData.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
