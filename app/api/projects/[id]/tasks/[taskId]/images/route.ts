import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params
    const taskIdNum = parseInt(taskId)
    
    if (isNaN(taskIdNum)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 })
    }

    const images = await dbService.getTaskImages(taskIdNum)
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching task images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
