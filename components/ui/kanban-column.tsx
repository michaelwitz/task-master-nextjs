"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskCard } from "@/components/ui/task-card"
import { Task, TaskStatus } from "@/types"

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onUpdateTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <Card
      ref={setNodeRef}
      className={`h-fit min-h-[500px] w-80 ${
        isOver ? "ring-2 ring-primary/50" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          {title}
          <span className="rounded-full bg-muted px-2 py-1 text-xs">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No tasks
          </div>
        )}
      </CardContent>
    </Card>
  )
} 