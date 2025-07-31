"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserSearch } from "@/components/ui/user-search"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { Project } from "@/types"

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (projectId: number, updates: { title: string; code: string; description?: string; leaderId: number }) => void
}

export function EditProjectDialog({ project, open, onOpenChange, onUpdate }: EditProjectDialogProps) {
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description || "")
  const [leaderId, setLeaderId] = useState(project.leaderId.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && leaderId) {
      onUpdate(project.id, {
        title: title.trim(),
        code: project.code, // Keep existing code - cannot be changed
        description: description.trim() || undefined,
        leaderId: parseInt(leaderId)
      })
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    setTitle(project.title)
    setDescription(project.description || "")
    setLeaderId(project.leaderId.toString())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[45vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project-title">Project Title *</Label>
            <Input
              id="edit-project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-project-code">Project Code</Label>
            <div className="flex items-center gap-3">
              <Input
                id="edit-project-code"
                value={project.code}
                readOnly
                disabled
                className="bg-muted cursor-not-allowed w-32 font-mono"
                maxLength={10}
              />
              <p className="text-sm text-muted-foreground flex-1">
                🔒 Project code cannot be changed after creation
              </p>
            </div>
          </div>
          
          <UserSearch
            value={leaderId}
            onValueChange={setLeaderId}
            placeholder="Select project leader..."
            label="Project Leader *"
          />
          
          <div className="space-y-2">
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              label="Description"
              placeholder="Enter project description and objectives..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || !leaderId}
            >
              Update Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 