import { Project, Task, Priority } from '@/types'

// Simple in-memory store for development
class Store {
  private projects: Project[] = []
  private tasks: Map<string, Task[]> = new Map()
  private taskIdCounter = 0

  constructor() {
    // Add some sample data for testing
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Create sample project
    const sampleProject = this.createProject("Sample Project", "John Doe")
    
    // Add sample tasks with different statuses
    const task1 = this.createTask(sampleProject.id, {
      title: "Set up database",
      storyPoints: 8,
      priority: "High",
      assignee: "Alice",
      tags: ["backend", "database"],
      isBlocked: false
    })
    // Move to in-progress
    this.updateTask(sampleProject.id, task1.id, { status: "in-progress" })

    const task2 = this.createTask(sampleProject.id, {
      title: "Design UI components",
      storyPoints: 5,
      priority: "Medium",
      assignee: "Bob",
      tags: ["frontend", "design"],
      isBlocked: false
    })
    // Move to in-review
    this.updateTask(sampleProject.id, task2.id, { status: "in-review" })

    const task3 = this.createTask(sampleProject.id, {
      title: "Fix authentication bug",
      storyPoints: 3,
      priority: "Critical",
      assignee: "Charlie",
      tags: ["bug", "security"],
      isBlocked: true,
      blockedReason: "Waiting for security review"
    })
    // Keep in todo
  }

  // Project methods
  getProjects(): Project[] {
    return this.projects
  }

  createProject(title: string, leader: string): Project {
    const newProject: Project = {
      id: `p${Math.floor(Math.random() * 9000) + 1000}`,
      title: title.trim(),
      leader: leader.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.projects.push(newProject)
    return newProject
  }

  getProject(id: string): Project | null {
    return this.projects.find(p => p.id === id) || null
  }

  updateProject(id: string, updates: Partial<Project>): void {
    const project = this.projects.find(p => p.id === id)
    if (project) {
      Object.assign(project, updates, { updatedAt: new Date() })
    }
  }

  deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id)
    this.tasks.delete(id)
  }

  // Task methods
  getTasks(projectId: string): Task[] {
    return this.tasks.get(projectId) || []
  }

  createTask(projectId: string, taskData: {
    title: string
    storyPoints?: number
    priority: Priority
    assignee?: string
    tags: string[]
    isBlocked?: boolean
    blockedReason?: string
  }): Task {
    this.taskIdCounter++
    // Add a small delay to ensure uniqueness
    const timestamp = Date.now() + this.taskIdCounter
    const newTask: Task = {
      id: `task-${this.taskIdCounter}-${timestamp}`,
      title: taskData.title,
      status: "todo",
      storyPoints: taskData.storyPoints,
      priority: taskData.priority,
      assignee: taskData.assignee,
      tags: taskData.tags,
      isBlocked: taskData.isBlocked,
      blockedReason: taskData.blockedReason,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const projectTasks = this.tasks.get(projectId) || []
    projectTasks.push(newTask)
    this.tasks.set(projectId, projectTasks)
    
    return newTask
  }

  updateTask(projectId: string, taskId: string, updates: Partial<Task>): void {
    const projectTasks = this.tasks.get(projectId) || []
    const taskIndex = projectTasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      projectTasks[taskIndex] = { ...projectTasks[taskIndex], ...updates, updatedAt: new Date() }
      this.tasks.set(projectId, projectTasks)
    }
  }

  deleteTask(projectId: string, taskId: string): void {
    const projectTasks = this.tasks.get(projectId) || []
    const filteredTasks = projectTasks.filter(t => t.id !== taskId)
    this.tasks.set(projectId, filteredTasks)
  }

  getTasksByStatus(projectId: string, status: string): Task[] {
    const projectTasks = this.tasks.get(projectId) || []
    return projectTasks.filter(task => task.status === status)
  }
}

// Create singleton instance
export const store = new Store() 