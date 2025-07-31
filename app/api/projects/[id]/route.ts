import { NextRequest, NextResponse } from "next/server"
import { dbService } from "@/lib/db/service"

export async function GET(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params
    const projectId = parseInt(id)
    const project = await dbService.getProject(projectId)
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params
    const projectId = parseInt(id)
    const body = await request.json()
    const { title, code, leaderId, description } = body

    if (!title || !code || !leaderId) {
      return NextResponse.json(
        { error: "Title, code, and leaderId are required" },
        { status: 400 }
      )
    }

    const updatedProject = await dbService.updateProject(projectId, {
      title,
      code: code.toUpperCase(),
      description,
      leaderId: parseInt(leaderId)
    })

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params
    const projectId = parseInt(id)
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }

    await dbService.deleteProject(projectId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
} 