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
  projectId: number
  title: string
  status: TaskStatus
  position: number // Position within the column for ordering
  storyPoints?: number
  priority: Priority
  assigneeId?: number
  assignee?: string // For display purposes
  tags: string[]
  description?: string // Markdown content for detailed task instructions
  isBlocked?: boolean
  blockedReason?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Column {
  id: TaskStatus
  title: string
  tasks: Task[]
} 