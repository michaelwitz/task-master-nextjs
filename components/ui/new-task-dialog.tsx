"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MarkdownEditor } from "@/components/ui/markdown-editor"

import { Plus } from "lucide-react"
import { Priority } from "@/types"
import { STORY_POINTS, PRIORITIES } from "@/lib/utils/constants"
import { UserSearch } from "@/components/ui/user-search"

interface NewTaskDialogProps {
  onCreateTask: (taskData: {
    title: string
    storyPoints?: number
    priority: Priority
    assigneeId?: number
    tags: string[]
    description?: string
    isBlocked?: boolean
    blockedReason?: string
  }) => void
  trigger?: React.ReactNode
}

export function NewTaskDialog({ onCreateTask, trigger }: NewTaskDialogProps) {
  const [open, setOpen] = useState(false)
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  const [title, setTitle] = useState("")
  const [storyPoints, setStoryPoints] = useState<string>("-")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [assigneeId, setAssigneeId] = useState("")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockedReason, setBlockedReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onCreateTask({
        title: title.trim(),
        storyPoints: storyPoints && storyPoints !== '-' ? parseInt(storyPoints) : undefined,
        priority,
        assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        description: description.trim() || undefined,
        isBlocked: isBlocked,
        blockedReason: blockedReason.trim() || undefined,
      })
      setTitle("")
      setStoryPoints("-")
      setPriority("Medium")
      setAssigneeId("")
      setTags("")
      setDescription("")
      setIsBlocked(false)
      setBlockedReason("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="icon" className="h-9 w-9">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[33vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storyPoints">Story Points</Label>
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
              <Label htmlFor="priority">Priority</Label>
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

          <UserSearch
            value={assigneeId}
            onValueChange={setAssigneeId}
            placeholder="Select assignee..."
            label="Assignee"
          />

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
                id="isBlocked"
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
              <Label htmlFor="isBlocked">Task is blocked</Label>
            </div>
            {isBlocked && (
              <div className="space-y-2">
                <Label htmlFor="blockedReason">Blocked Reason</Label>
                <Input
                  id="blockedReason"
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
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 