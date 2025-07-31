"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { ImageThumbnail } from "@/components/ui/image-thumbnail"
import { ImageUploadDialog } from "@/components/ui/image-upload-dialog"
import { useTaskImages } from "@/hooks/use-task-images"
import { Edit2 } from "lucide-react"
import { Task, Priority } from "@/types"
import { STORY_POINTS, PRIORITIES } from "@/lib/utils/constants"
import { UserSearch } from "@/components/ui/user-search"

interface EditTaskDialogProps {
  task: Task
  projectId: number
  onUpdate: (id: string, updates: Partial<Task>) => void
  onOpenChange?: (open: boolean) => void
}

// Define StagedImage interface
interface StagedImage {
  id: string
  file: File
  preview: string
  originalName: string
  contentType: string
  fileSize: number
}

export function EditTaskDialog({ task, projectId, onUpdate, onOpenChange }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState(task.description || "")
  const [isBlocked, setIsBlocked] = useState(task.isBlocked || false)
  const [blockedReason, setBlockedReason] = useState(task.blockedReason || "")
  const [assigneeId, setAssigneeId] = useState(task.assigneeId?.toString() || "")
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([])
  const [stagedForDeletion, setStagedForDeletion] = useState<Set<number>>(new Set())
  const [isUploading, setIsUploading] = useState(false)
  
  // Fetch task images
  const { images, isLoading: imagesLoading, refetch } = useTaskImages(projectId, typeof task.id === 'string' ? parseInt(task.id) : task.id)

  const handleImagesAdded = (newImages: StagedImage[]) => {
    setStagedImages(prev => [...prev, ...newImages])
  }

  const removeStagedImage = (imageId: string) => {
    setStagedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const stageImageForDeletion = (imageId: number) => {
    setStagedForDeletion(prev => new Set(prev).add(imageId))
  }

  const unstageImageForDeletion = (imageId: number) => {
    setStagedForDeletion(prev => {
      const newSet = new Set(prev)
      newSet.delete(imageId)
      return newSet
    })
  }

  const deleteStagedImages = async () => {
    if (stagedForDeletion.size === 0) return

    try {
      // Delete images in parallel
      await Promise.all(
        Array.from(stagedForDeletion).map(async (imageId) => {
          const response = await fetch(`/api/projects/${projectId}/tasks/${typeof task.id === 'string' ? parseInt(task.id) : task.id}/images/${imageId}`, {
            method: 'DELETE',
          })
          
          if (!response.ok) {
            throw new Error("Failed to delete image " + imageId)
          }
        })
      )

      // Clear staged deletions after successful deletion
      setStagedForDeletion(new Set())
    } catch (error) {
      console.error('Error deleting images:', error)
      // TODO: Show error toast
      throw error // Re-throw to handle in calling function
    }
  }

  const uploadStagedImages = async (taskId: number) => {
    if (stagedImages.length === 0) return

    try {
      // Convert files to base64
      const imageData = await Promise.all(
        stagedImages.map(async (stagedImage) => ({
          originalName: stagedImage.originalName,
          contentType: stagedImage.contentType,
          fileSize: stagedImage.fileSize,
          base64Data: stagedImage.preview.split(',')[1], // Remove data:image/...;base64, prefix
        }))
      )

      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}/images/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imageData }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload images')
      }

      // Clear staged images after successful upload
      setStagedImages([])
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error // Re-throw to handle in calling function
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const title = formData.get('title') as string
    const storyPoints = formData.get('storyPoints') as string
    const priority = formData.get('priority') as Priority
    const tags = formData.get('tags') as string

    if (title.trim()) {
      setIsUploading(true)
      try {
        // First update the task
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
        
        // Then handle image operations
        const taskId = typeof task.id === 'string' ? parseInt(task.id) : task.id
        
        // Delete staged images first
        if (stagedForDeletion.size > 0) {
          await deleteStagedImages()
        }
        
        // Then upload any staged images
        if (stagedImages.length > 0) {
          await uploadStagedImages(taskId)
        }
        
        // If we had any image operations, refetch to ensure UI is up to date
        if (stagedForDeletion.size > 0 || stagedImages.length > 0) {
          await refetch()
        }
        
      } catch (error) {
        console.error('Error saving changes:', error)
        // TODO: Show error toast
        return // Don't close dialog on error
      } finally {
        setIsUploading(false)
      }
      
      setOpen(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      // Reset states when opening dialog
      setStagedImages([])
      setStagedForDeletion(new Set())
      setIsUploading(false)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Edit2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[45vw] max-h-[90vh] overflow-y-auto">
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

          {/* Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Images</Label>
              <ImageUploadDialog onImagesAdded={handleImagesAdded} />
            </div>
            
            {/* Staged Images Preview */}
            {stagedImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {stagedImages.length} image{stagedImages.length !== 1 ? 's' : ''} ready to upload
                </p>
                <div className="flex flex-wrap gap-3">
                  {stagedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                        <img
                          src={image.preview}
                          alt={image.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeStagedImage(image.id)}
                      >
                        ×
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-16">
                        {image.originalName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Attached Images */}
          {!imagesLoading && images.length > 0 && (
            <div className="space-y-2">
              {stagedForDeletion.size > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {stagedForDeletion.size} image{stagedForDeletion.size !== 1 ? 's' : ''} marked for deletion
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {images.map((image) => {
                  const isMarkedForDeletion = stagedForDeletion.has(image.id)
                  return (
                    <div key={image.id} className="relative group">
                      <div className={`${isMarkedForDeletion ? 'opacity-50 ring-2 ring-red-500' : ''}`}>
                        <ImageThumbnail
                          imageId={image.id}
                          originalName={image.originalName}
                          thumbnailSize="md"
                          className="flex-shrink-0"
                        />
                      </div>
                      <Button
                        type="button"
                        variant={isMarkedForDeletion ? "default" : "destructive"}
                        size="sm"
                        className={`absolute -top-2 -right-2 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isMarkedForDeletion ? 'bg-green-600 hover:bg-green-700' : ''
                        }`}
                        onClick={() => {
                          if (isMarkedForDeletion) {
                            unstageImageForDeletion(image.id)
                          } else {
                            stageImageForDeletion(image.id)
                          }
                        }}
                        title={isMarkedForDeletion ? 'Undo deletion' : 'Delete image'}
                      >
                        {isMarkedForDeletion ? '↶' : '×'}
                      </Button>
                      {isMarkedForDeletion && (
                        <div 
                          className="absolute inset-0 rounded"
                          style={{
                            background: `repeating-linear-gradient(
                              45deg,
                              rgba(239, 68, 68, 0.2) 0px,
                              rgba(239, 68, 68, 0.2) 4px,
                              transparent 4px,
                              transparent 8px
                            )`
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 