export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  storyPoints?: number
  priority: Priority
  assignee?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface Column {
  id: TaskStatus
  title: string
  tasks: Task[]
} 