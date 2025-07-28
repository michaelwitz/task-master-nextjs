import { TaskStatus, Priority } from '@/types'

export const STORY_POINTS = [0, 1, 2, 3, 5, 8, 13, 21]
export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical']

export const KANBAN_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "in-review", title: "In Review" },
  { id: "done", title: "Done" },
]

export const PRIORITY_COLORS = {
  Critical: 'text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400',
  High: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
  Medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
  Low: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
} as const 