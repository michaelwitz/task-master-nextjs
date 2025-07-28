"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2 } from "lucide-react"
import { Task, Priority } from "@/types"
import { STORY_POINTS, PRIORITIES } from "@/lib/utils/constants"

interface EditTaskDialogProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

export function EditTaskDialog({ task, onUpdate }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [storyPoints, setStoryPoints] = useState<string>(task.storyPoints?.toString() || "-")
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [assignee, setAssignee] = useState(task.assignee || "")
  const [tags, setTags] = useState(task.tags.join(", "))
  const [isBlocked, setIsBlocked] = useState(task.isBlocked || false)
  const [blockedReason, setBlockedReason] = useState(task.blockedReason || "")

  // Reset form when task changes
  useEffect(() => {
    setTitle(task.title)
    setStoryPoints(task.storyPoints?.toString() || "-")
    setPriority(task.priority)
    setAssignee(task.assignee || "")
    setTags(task.tags.join(", "))
    setIsBlocked(task.isBlocked || false)
    setBlockedReason(task.blockedReason || "")
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onUpdate(task.id, {
        title: title.trim(),
        storyPoints: storyPoints && storyPoints !== '-' ? parseInt(storyPoints) : undefined,
        priority,
        assignee: assignee.trim() || undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        isBlocked,
        blockedReason: blockedReason.trim() || undefined,
        updatedAt: new Date(),
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Edit2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Task Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-storyPoints">Story Points</Label>
              <Select value={storyPoints} onValueChange={setStoryPoints}>
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
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
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

          <div className="space-y-2">
            <Label htmlFor="edit-assignee">Assignee</Label>
            <Input
              id="edit-assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Developer name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="bug, frontend, urgent (comma separated)"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isBlocked"
                checked={isBlocked}
                onChange={(e) => setIsBlocked(e.target.checked)}
                className="rounded border-gray-300"
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
            <Button type="submit" disabled={!title.trim()}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 