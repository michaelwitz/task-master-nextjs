'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface StagedImage {
  id: string // temp ID for staging
  file: File
  preview: string // data URL for preview
  originalName: string
  contentType: string
  fileSize: number
}

interface ImageUploadDialogProps {
  onImagesAdded: (images: StagedImage[]) => void
  trigger?: React.ReactNode
}

export function ImageUploadDialog({ onImagesAdded, trigger }: ImageUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newImages: StagedImage[] = []
    
    Array.from(files).forEach((file) => {
      // Only allow image files
      if (!file.type.startsWith('image/')) {
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        const stagedImage: StagedImage = {
          id: `staged-${Date.now()}-${Math.random()}`,
          file,
          preview,
          originalName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }
        newImages.push(stagedImage)
        
        // Update state when all files are processed
        if (newImages.length === Array.from(files).filter(f => f.type.startsWith('image/')).length) {
          setStagedImages(prev => [...prev, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeImage = (imageId: string) => {
    setStagedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const handleAddImages = () => {
    onImagesAdded(stagedImages)
    setStagedImages([])
    setOpen(false)
  }

  const handleCancel = () => {
    setStagedImages([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop images here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Preview Grid */}
          {stagedImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Selected Images ({stagedImages.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stagedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
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
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {image.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(image.fileSize / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAddImages}
              disabled={stagedImages.length === 0}
            >
              Add {stagedImages.length} Image{stagedImages.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
