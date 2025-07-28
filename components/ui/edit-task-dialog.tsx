"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { Edit2 } from "lucide-react"
import { Task, Priority } from "@/types"
import { STORY_POINTS, PRIORITIES } from "@/lib/utils/constants"
import { UserSearch } from "@/components/ui/user-search"

interface EditTaskDialogProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onOpenChange?: (open: boolean) => void
}

export function EditTaskDialog({ task, onUpdate, onOpenChange }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState(task.description || "")
  const [isBlocked, setIsBlocked] = useState(task.isBlocked || false)
  const [blockedReason, setBlockedReason] = useState(task.blockedReason || "")
  const [assigneeId, setAssigneeId] = useState(task.assigneeId?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const title = formData.get('title') as string
    const storyPoints = formData.get('storyPoints') as string
    const priority = formData.get('priority') as Priority
    const tags = formData.get('tags') as string

    if (title.trim()) {
      onUpdate(task.id.toString(), {
        title: title.trim(),
        storyPoints: storyPoints && storyPoints !== '-' ? parseInt(storyPoints) : undefined,
        priority,
        assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        description: description.trim() || undefined,
        isBlocked: isBlocked,
        blockedReason: blockedReason.trim() || undefined,
        updatedAt: new Date(),
      })
      setOpen(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Edit2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[33vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Task Title *</Label>
            <Input
              id="edit-title"
              name="title"
              defaultValue={task.title}
              placeholder="Enter task title..."
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-storyPoints">Story Points</Label>
              <Select name="storyPoints" defaultValue={task.storyPoints?.toString() || "-"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select points" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">-</SelectItem>
                  {STORY_POINTS.map((points) => (
                    <SelectItem key={points} value={points.toString()}>
                      {points}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select name="priority" defaultValue={task.priority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <UserSearch
            value={assigneeId}
            onValueChange={setAssigneeId}
            placeholder="Select assignee..."
            label="Assignee"
          />

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              name="tags"
              defaultValue={task.tags && task.tags.length > 0 ? task.tags.join(", ") : ""}
              placeholder="bug, frontend, urgent (comma separated)"
            />
          </div>

          <div className="space-y-2">
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              label="Description"
              placeholder="Enter detailed task description with markdown formatting..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isBlocked"
                checked={isBlocked}
                onChange={(e) => setIsBlocked(e.target.checked)}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault()
                    setIsBlocked(!isBlocked)
                  }
                }}
                className="rounded border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                tabIndex={0}
              />
              <Label htmlFor="edit-isBlocked">Task is blocked</Label>
            </div>
            {isBlocked && (
              <div className="space-y-2">
                <Label htmlFor="edit-blockedReason">Blocked Reason</Label>
                <Input
                  id="edit-blockedReason"
                  value={blockedReason}
                  onChange={(e) => setBlockedReason(e.target.value)}
                  placeholder="Why is this task blocked?"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 