import { useState, useEffect } from 'react'
import { Project } from '@/types'
import { store } from '@/lib/store'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])

  // Load projects from store on mount
  useEffect(() => {
    setProjects(store.getProjects())
  }, [])

  const createProject = (title: string, leader: string) => {
    const newProject = store.createProject(title, leader)
    setProjects(store.getProjects())
    return newProject
  }

  const getProject = (id: string): Project | null => {
    return store.getProject(id)
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    store.updateProject(id, updates)
    setProjects(store.getProjects())
  }

  const deleteProject = (id: string) => {
    store.deleteProject(id)
    setProjects(store.getProjects())
  }

  return {
    projects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
  }
} 