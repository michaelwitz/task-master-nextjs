export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: number
  title: string
  code: string
  description?: string
  leaderId: number
  leader?: string // For display purposes
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: number
  taskId: string // Human-readable task identifier (e.g., "WEBSITE-1")
  projectId: number
  title: string
  status: TaskStatus
  position: number // Position within the column for ordering
  storyPoints?: number
  priority: Priority
  assigneeId?: number
  assignee?: string // For display purposes
  tags: string[]
  prompt?: string // Markdown content for detailed task instructions and AI prompts
  isBlocked?: boolean
  blockedReason?: string
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Column {
  id: TaskStatus
  title: string
  tasks: Task[]
} 