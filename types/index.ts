export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

export interface Column {
  id: TaskStatus
  title: string
  tasks: Task[]
} 