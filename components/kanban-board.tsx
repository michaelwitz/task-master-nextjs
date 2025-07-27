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
import { NewTaskDialog } from "@/components/ui/new-task-dialog"
import { TaskCard } from "@/components/ui/task-card"
import { Task, TaskStatus, Priority } from "@/types"

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "in-review", title: "In Review" },
  { id: "done", title: "Done" },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const createTask = (taskData: {
    title: string
    storyPoints?: number
    priority: Priority
    assignee?: string
    tags: string[]
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      status: "todo",
      storyPoints: taskData.storyPoints,
      priority: taskData.priority,
      assignee: taskData.assignee,
      tags: taskData.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

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

    if (COLUMNS.some((col) => col.id === newStatus)) {
      const task = tasks.find(t => t.id === taskId)
      if (task) {
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
        
        updateTask(taskId, updates)
      }
    }
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <NewTaskDialog onCreateTask={createTask} />
        <h1 className="text-2xl font-bold">Kanban Board</h1>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
} 