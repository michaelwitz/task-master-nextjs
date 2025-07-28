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

    const updates = await request.json()
    const task = await dbService.updateTask(projectId, taskId, updates)
    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(
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

    await dbService.deleteTask(projectId, taskId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
} 