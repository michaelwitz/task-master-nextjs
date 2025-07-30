'use client'

import { useState, useEffect } from 'react'

interface TaskImage {
  id: number
  originalName: string
  contentType: string
  url: string
  thumbnailData?: string
}

export function useTaskImages(projectId: number, taskId: number) {
  const [images, setImages] = useState<TaskImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function fetchImages() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}/images`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }

        const fetchedImages = await response.json()
        
        if (isMounted) {
          setImages(fetchedImages)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch images')
          setImages([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (projectId && taskId) {
      fetchImages()
    } else {
      setImages([])
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [projectId, taskId, refetchTrigger])

  const refetch = async () => {
    setRefetchTrigger(prev => prev + 1)
  }

  return { images, isLoading, error, refetch }
}
