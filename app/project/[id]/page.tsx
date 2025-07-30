"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { NewTaskDialog } from "@/components/ui/new-task-dialog"
import { ArrowLeft, Plus } from "lucide-react"
import { Project, Task } from "@/types"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Simple data loading - only run once on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Load project
        const projectRes = await fetch(`/api/projects/${projectId}`)
        if (projectRes.ok) {
          const projectData = await projectRes.json()
          setProject(projectData)
        }

        // Load tasks
        const tasksRes = await fetch(`/api/projects/${projectId}/tasks`)
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [projectId]) // Include projectId in dependency array

  async function handleUpdateTask(id: string | number, updates: Partial<Task>) {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  async function handleDeleteTask(id: string | number) {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== id))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  async function handleCreateTask(taskData: Partial<Task>) {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (response.ok) {
        const newTask = await response.json()
        setTasks(prev => [...prev, newTask])
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  async function handleReorderTasks(taskId: number, newStatus: string, newPosition: number) {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus, newPosition }),
      })
      if (response.ok) {
        const updatedTasks = await response.json()
        setTasks(updatedTasks)
      }
    } catch (error) {
      console.error('Error reordering tasks:', error)
      throw error // Re-throw so the KanbanBoard can handle it
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Header with Navigation */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative py-4 px-6">
          {/* Left: Navigation Buttons */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <NewTaskDialog 
              onCreateTask={handleCreateTask}
              trigger={
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              }
            />
          </div>
          
          {/* Center: Project Title */}
          <div className="flex items-center justify-center">
            <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
              {project.title}
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard 
        tasks={tasks}
        projectId={parseInt(projectId)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onReorderTasks={handleReorderTasks}
      />
    </div>
  )
} 