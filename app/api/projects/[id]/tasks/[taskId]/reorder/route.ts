import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/service'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId: taskIdParam } = await params
    const projectId = parseInt(id)
    const taskId = parseInt(taskIdParam)
    
    if (isNaN(projectId) || isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid project or task ID' }, { status: 400 })
    }

    const body = await request.json()
    const { newStatus, newPosition } = body

    if (!newStatus || typeof newPosition !== 'number') {
      return NextResponse.json({ error: 'Missing newStatus or newPosition' }, { status: 400 })
    }

    const updatedTasks = await dbService.reorderTasks(projectId, taskId, newStatus, newPosition)
    
    return NextResponse.json(updatedTasks)
  } catch (error) {
    console.error('Error reordering task:', error)
    return NextResponse.json(
      { error: 'Failed to reorder task' },
      { status: 500 }
    )
  }
} 