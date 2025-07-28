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
import { Project } from "@/types"

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (projectId: number, updates: { title: string; leaderId: number }) => void
}

export function EditProjectDialog({ project, open, onOpenChange, onUpdate }: EditProjectDialogProps) {
  const [title, setTitle] = useState(project.title)
  const [leaderId, setLeaderId] = useState(project.leaderId.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && leaderId) {
      onUpdate(project.id, {
        title: title.trim(),
        leaderId: parseInt(leaderId)
      })
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    setTitle(project.title)
    setLeaderId(project.leaderId.toString())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
          <UserSearch
            value={leaderId}
            onValueChange={setLeaderId}
            placeholder="Select project leader..."
            label="Project Leader *"
          />
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