"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Users, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProjects } from "@/lib/hooks/useProjects"

export default function Home() {
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [newProjectLeader, setNewProjectLeader] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const router = useRouter()
  const { projects, createProject } = useProjects()

  const handleCreateProject = () => {
    if (newProjectTitle.trim() && newProjectLeader.trim()) {
      createProject(newProjectTitle, newProjectLeader)
      setNewProjectTitle("")
      setNewProjectLeader("")
      setShowCreateDialog(false)
    }
  }

  const selectProject = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  return (
    <div className="font-sans min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Team Task Manager</h1>
            <p className="text-muted-foreground text-lg">
              Manage your projects with Kanban boards
            </p>
          </div>

          {/* Create Project Button */}
          <div className="flex justify-center mb-8">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="h-12 w-12"
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a new project</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-title">Project Title *</Label>
                    <Input
                      id="project-title"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="Enter project title..."
                      autoFocus
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-leader">Project Leader *</Label>
                    <Input
                      id="project-leader"
                      value={newProjectLeader}
                      onChange={(e) => setNewProjectLeader(e.target.value)}
                      placeholder="Enter project leader name..."
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!newProjectTitle.trim() || !newProjectLeader.trim()}>
                      Create Project
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                <p>Create your first project to get started</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => selectProject(project.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Leader: {project.leader}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Open Kanban Board
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
