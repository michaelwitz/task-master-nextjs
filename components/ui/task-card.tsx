"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Flame, TrendingUp } from "lucide-react"
import { Task, Priority } from "@/types"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { EditTaskDialog } from "@/components/ui/edit-task-dialog"
import { PRIORITY_COLORS } from "@/lib/utils/constants"

interface TaskCardProps {
  task: Task
  projectId: number
  onUpdate: (id: string | number, updates: Partial<Task>) => void
  onDelete: (id: string | number) => void
}

const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case 'Critical':
      return <Flame className="h-4 w-4 text-orange-500" />
    case 'High':
      return <TrendingUp className="h-4 w-4 text-red-500" />
    default:
      return null
  }
}

export function TaskCard({ task, projectId, onUpdate, onDelete }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isEditDialogOpen })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    onDelete(task.id)
    setShowDeleteDialog(false)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
                    className={`mb-3 cursor-grab active:cursor-grabbing relative ${
                isDragging ? "shadow-lg" : ""
              } ${task.isBlocked ? "ring-2 ring-yellow-400" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3 pt-2">
        {/* Title Section */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="flex-1 text-sm font-medium cursor-text flex items-center gap-2"
          >
            {(task.priority === 'Critical' || task.priority === 'High') && (
              <span className="flex-shrink-0">
                {getPriorityIcon(task.priority)}
              </span>
            )}
            <span>{task.title}</span>
          </div>
          <div className="flex gap-1">
            <EditTaskDialog 
              task={task} 
              projectId={projectId}
              onUpdate={onUpdate} 
              onOpenChange={setIsEditDialogOpen}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={handleDeleteClick}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-2">
                            {/* Priority Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    {task.storyPoints !== undefined && task.storyPoints !== null && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                        {task.storyPoints} SP
                      </span>
                    )}
                    {task.isBlocked && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
                        BLOCKED
                      </span>
                    )}
                  </div>

          {/* Assignee */}
          {task.assignee && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Assignee:</span> {task.assignee}
            </div>
          )}

                            {/* Blocked Reason */}
                  {task.isBlocked && task.blockedReason && (
                    <div className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950 p-2 rounded">
                      <span className="font-medium">Blocked:</span> {task.blockedReason}
                    </div>
                  )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Dates */}
          <div className="text-xs text-muted-foreground pt-1 border-t space-y-1">
            <div>Created: {new Date(task.createdAt).toLocaleDateString()}</div>
            {task.completedAt && (
              <div className="text-green-600 dark:text-green-400 font-medium">
                Completed: {new Date(task.completedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={task.title}
      />
    </Card>
  )
} 