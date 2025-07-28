import { useState, useEffect } from 'react'
import { Task, Priority } from '@/types'
import { store } from '@/lib/store'

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from store on mount and when projectId changes
  useEffect(() => {
    setTasks(store.getTasks(projectId))
  }, [projectId])

  const createTask = (taskData: {
    title: string
    storyPoints?: number
    priority: Priority
    assignee?: string
    tags: string[]
    isBlocked?: boolean
    blockedReason?: string
  }) => {
    const newTask = store.createTask(projectId, taskData)
    setTasks(store.getTasks(projectId))
    return newTask
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    store.updateTask(projectId, id, updates)
    setTasks(store.getTasks(projectId))
  }

  const deleteTask = (id: string) => {
    store.deleteTask(projectId, id)
    setTasks(store.getTasks(projectId))
  }

  const getTasksByStatus = (status: string) => {
    return store.getTasksByStatus(projectId, status)
  }

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
  }
} 