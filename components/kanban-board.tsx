"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { KanbanColumn } from "@/components/ui/kanban-column"
import { TaskCard } from "@/components/ui/task-card"
import { Task, TaskStatus } from "@/types"
import { KANBAN_COLUMNS } from "@/lib/utils/constants"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { NewTaskDialog } from "@/components/ui/new-task-dialog"
import { useToast } from "@/components/ui/toast"

interface KanbanBoardProps {
  tasks: Task[]
  onUpdateTask: (id: string | number, updates: Partial<Task>) => void
  onDeleteTask: (id: string | number) => void
  onReorderTasks: (taskId: number, newStatus: TaskStatus, newPosition: number) => void
}

export function KanbanBoard({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onReorderTasks 
}: KanbanBoardProps) {
const router = useRouter()
const { toast } = useToast()
const [activeTask, setActiveTask] = useState<Task | null>(null)
const [localTasks, setLocalTasks] = useState<Task[]>(tasks)

  // Update local tasks when tasks prop changes
  useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = localTasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTask = localTasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Check if dropping on a column (status) or a task
    const isColumnDrop = KANBAN_COLUMNS.some(col => col.id === overId)
    
    let newStatus: TaskStatus
    let targetPosition: number

    if (isColumnDrop) {
      // Dropping on a column - add to the end
      newStatus = overId as TaskStatus
      targetPosition = 999 // Indicates "add to end"
    } else {
      // Dropping on a task
      const overTask = localTasks.find(t => t.id === overId)
      if (!overTask) return

      newStatus = overTask.status
      
      // Calculate the target position (index) in the column
      const columnTasks = localTasks
        .filter(t => t.status === newStatus)
        .sort((a, b) => a.position - b.position)
      
      const overIndex = columnTasks.findIndex(t => t.id === overId)
      if (overIndex === -1) return

      // If moving within the same column, we need to account for the current position
if (activeTask.status === newStatus) {
        const activeIndex = columnTasks.findIndex(t => t.id === activeId)
        if (activeIndex === -1) return
        
        // If moving down, insert after the target
        // If moving up, insert before the target
        if (activeIndex < overIndex) {
          targetPosition = overIndex
        } else {
          targetPosition = overIndex
        }
      } else {
        // Moving to a different column, insert at the target position
        targetPosition = overIndex
      }
    }

    // Check if task is blocked and being moved to 'Done'
    if (newStatus === 'done' && activeTask.isBlocked) {
      toast({
        title: "Blocked Task",
        description: "Cannot move blocked tasks to 'Done'!",
        type: "warning",
      })
      setLocalTasks(tasks) // revert changes
      return
    }

    // Call the reorder function
    try {
      await onReorderTasks(activeId as number, newStatus, targetPosition)
    } catch (error) {
      console.error('Failed to reorder task:', error)
      // Revert local state on error
      setLocalTasks(tasks)
    }
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return localTasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position)
  }

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
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