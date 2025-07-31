import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/service'

export async function GET() {
  try {
    const projects = await dbService.getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, code, leaderId, description } = await request.json()
    
    if (!title || !code || !leaderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const project = await dbService.createProject(title, code, leaderId, description)
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
} 