'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ZoomIn } from 'lucide-react'

interface ImageThumbnailProps {
  imageId: number
  originalName: string
  className?: string
  thumbnailSize?: 'sm' | 'md' | 'lg'
}

export function ImageThumbnail({ 
  imageId, 
  originalName, 
  className = '', 
  thumbnailSize = 'md' 
}: ImageThumbnailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  }

  const imageUrl = `/api/images/${imageId}`

  const handleThumbnailClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent task card click event
    setIsModalOpen(true)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={`${sizeClasses[thumbnailSize]} ${className} relative cursor-pointer group rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors`}
        onClick={handleThumbnailClick}
        title={`View ${originalName}`}
      >
        {isLoading && (
          <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="text-xs text-gray-500">...</div>
          </div>
        )}
        
        {hasError && !isLoading && (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-xs text-gray-500">❌</div>
          </div>
        )}
        
        <img
          src={imageUrl}
          alt={originalName}
          className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Full-size image modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">{originalName}</DialogTitle>
          <div className="relative">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Full-size image */}
            <img
              src={imageUrl}
              alt={originalName}
              className="w-full h-auto max-h-[90vh] object-contain"
              onError={() => setHasError(true)}
            />
            
            {/* Image name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
              <p className="text-sm font-medium">{originalName}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
