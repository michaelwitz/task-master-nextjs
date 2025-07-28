"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { KanbanColumn } from "@/components/ui/kanban-column"
import { TaskCard } from "@/components/ui/task-card"
import { Task, TaskStatus, Priority } from "@/types"
import { KANBAN_COLUMNS } from "@/lib/utils/constants"

interface KanbanBoardProps {
  onCreateTask: (taskData: {
    title: string
    storyPoints?: number
    priority: Priority
    assignee?: string
    tags: string[]
    isBlocked?: boolean
    blockedReason?: string
  }) => void
  tasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export function KanbanBoard({ onCreateTask, tasks, onUpdateTask, onDeleteTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    if (KANBAN_COLUMNS.some((col) => col.id === newStatus)) {
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        // Prevent blocked tasks from being moved to Done
        if (newStatus === 'done' && task.isBlocked) {
          return
        }

        const updates: Partial<Task> = { 
          status: newStatus,
          updatedAt: new Date()
        }
        
        // Set completed date when moving to Done
        if (newStatus === 'done' && task.status !== 'done') {
          updates.completedAt = new Date()
        }
        // Remove completed date when moving out of Done
        else if (newStatus !== 'done' && task.status === 'done') {
          updates.completedAt = undefined
        }
        
        onUpdateTask(taskId, updates)
      }
    }
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
} 