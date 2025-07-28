"use client"

import { useParams, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { KanbanBoard } from "@/components/kanban-board"
import { NewTaskDialog } from "@/components/ui/new-task-dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import { useProjects } from "@/lib/hooks/useProjects"
import { useTasks } from "@/lib/hooks/useTasks"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const { getProject } = useProjects()
  const { tasks, createTask, updateTask, deleteTask } = useTasks(projectId)
  
  const project = getProject(projectId)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button onClick={() => router.push('/')}>
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative py-4">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/')}
                      className="h-9 w-9 p-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to project manager</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="w-px h-6 bg-border"></div>
              <div className="-ml-8">
                <NewTaskDialog onCreateTask={createTask} />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
              {project.title}
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard 
        onCreateTask={createTask}
        tasks={tasks}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  )
} 