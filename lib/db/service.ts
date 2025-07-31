import { db } from './index'
import { USERS, TAGS, PROJECTS, TASKS, TASK_TAGS, IMAGE_METADATA, IMAGE_DATA } from './schema'
import { eq, and, ilike, desc, asc, or, sql } from 'drizzle-orm'
import type { Task, Priority } from '@/types'
import { mapDbToJs, mapJsToDb, mapDbArrayToJs } from '@/lib/utils/property-mapper'

export class DatabaseService {
  // User methods
  async getUsers() {
    const users = await db.select().from(USERS).orderBy(asc(USERS.first_name), asc(USERS.last_name))
    return mapDbArrayToJs(users)
  }

  async searchUsers(query: string) {
    const searchTerm = `%${query.toLowerCase()}%`
    const users = await db
      .select({
        id: USERS.id,
        first_name: USERS.first_name,
        last_name: USERS.last_name,
        email: USERS.email,
        full_name: sql<string>`${USERS.first_name} || ' ' || ${USERS.last_name}`,
      })
      .from(USERS)
      .where(
        or(
          ilike(USERS.first_name, searchTerm),
          ilike(USERS.last_name, searchTerm),
          ilike(USERS.email, searchTerm),
          ilike(sql<string>`${USERS.first_name} || ' ' || ${USERS.last_name}`, searchTerm)
        )
      )
      .orderBy(asc(USERS.first_name), asc(USERS.last_name))
      .limit(10)
    
    return mapDbArrayToJs(users)
  }

  async createUser(firstName: string, lastName: string, email: string) {
    const [user] = await db
      .insert(USERS)
      .values({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
      })
      .returning()
    return mapDbToJs(user)
  }

  // Tag methods
  async getTags() {
    const tags = await db.select().from(TAGS).orderBy(asc(TAGS.tag))
    return mapDbArrayToJs(tags)
  }

  async searchTags(query: string) {
    const searchTerm = `%${query.toLowerCase()}%`
    const tags = await db
      .select()
      .from(TAGS)
      .where(ilike(TAGS.tag, searchTerm))
      .orderBy(asc(TAGS.tag))
      .limit(10)
    
    return mapDbArrayToJs(tags)
  }

  async createTag(tag: string) {
    const [newTag] = await db
      .insert(TAGS)
      .values({ tag: tag.toLowerCase() })
      .returning()
    return mapDbToJs(newTag)
  }

  // Project methods
  async getProjects() {
    const projects = await db
      .select({
        id: PROJECTS.id,
        title: PROJECTS.title,
        code: PROJECTS.code,
        description: PROJECTS.description,
        leader_id: PROJECTS.leader_id,
        created_at: PROJECTS.created_at,
        updated_at: PROJECTS.updated_at,
        leader: {
          id: USERS.id,
          first_name: USERS.first_name,
          last_name: USERS.last_name,
          email: USERS.email,
        },
      })
      .from(PROJECTS)
      .leftJoin(USERS, eq(PROJECTS.leader_id, USERS.id))
      .orderBy(desc(PROJECTS.created_at))

    return projects.map(project => {
      const mappedProject = mapDbToJs(project)
      return {
        ...mappedProject,
        leader: project.leader ? `${project.leader.first_name} ${project.leader.last_name}` : undefined,
      }
    })
  }

  async createProject(title: string, code: string, leaderId: number, description?: string) {
    const [project] = await db
      .insert(PROJECTS)
      .values({
        title: title.trim(),
        code: code.trim().toUpperCase(),
        description: description?.trim() || null,
        leader_id: leaderId,
      })
      .returning()
    return mapDbToJs(project)
  }

  async getProject(id: number) {
    const [project] = await db
      .select({
        id: PROJECTS.id,
        title: PROJECTS.title,
        code: PROJECTS.code,
        description: PROJECTS.description,
        leader_id: PROJECTS.leader_id,
        created_at: PROJECTS.created_at,
        updated_at: PROJECTS.updated_at,
        leader: {
          id: USERS.id,
          first_name: USERS.first_name,
          last_name: USERS.last_name,
          email: USERS.email,
        },
      })
      .from(PROJECTS)
      .leftJoin(USERS, eq(PROJECTS.leader_id, USERS.id))
      .where(eq(PROJECTS.id, id))

    if (!project) {
      return null
    }

    const mappedProject = mapDbToJs(project)
    return {
      ...mappedProject,
      leader: project.leader ? `${project.leader.first_name} ${project.leader.last_name}` : undefined,
    }
  }

  async updateProject(id: number, updates: { title?: string; code?: string; description?: string; leaderId?: number }) {
    // Convert camelCase updates to snake_case for database
    const dbUpdates = mapJsToDb(updates)
    
    await db
      .update(PROJECTS)
      .set({
        ...dbUpdates,
        updated_at: new Date(),
      })
      .where(eq(PROJECTS.id, id))
    
    // Fetch the updated project with leader information
    const [project] = await db
      .select({
        id: PROJECTS.id,
        title: PROJECTS.title,
        code: PROJECTS.code,
        description: PROJECTS.description,
        leader_id: PROJECTS.leader_id,
        created_at: PROJECTS.created_at,
        updated_at: PROJECTS.updated_at,
        leader: {
          id: USERS.id,
          first_name: USERS.first_name,
          last_name: USERS.last_name,
          email: USERS.email,
        },
      })
      .from(PROJECTS)
      .leftJoin(USERS, eq(PROJECTS.leader_id, USERS.id))
      .where(eq(PROJECTS.id, id))

    if (!project) {
      return null
    }

    const mappedProject = mapDbToJs(project)
    return {
      ...mappedProject,
      leader: project.leader ? `${project.leader.first_name} ${project.leader.last_name}` : undefined,
    }
  }

  async deleteProject(id: number) {
    await db.delete(PROJECTS).where(eq(PROJECTS.id, id))
  }

  // Task methods
  async getTasks(projectId: number) {
    const tasks = await db
      .select({
        id: TASKS.id,
        project_id: TASKS.project_id,
        title: TASKS.title,
        status: TASKS.status,
        position: TASKS.position,
        story_points: TASKS.story_points,
        priority: TASKS.priority,
        assignee_id: TASKS.assignee_id,
        description: TASKS.description,
        is_blocked: TASKS.is_blocked,
        blocked_reason: TASKS.blocked_reason,
        completed_at: TASKS.completed_at,
        created_at: TASKS.created_at,
        updated_at: TASKS.updated_at,
        assignee: {
          id: USERS.id,
          first_name: USERS.first_name,
          last_name: USERS.last_name,
          email: USERS.email,
        },
      })
      .from(TASKS)
      .leftJoin(USERS, eq(TASKS.assignee_id, USERS.id))
      .where(eq(TASKS.project_id, projectId))
      .orderBy(asc(TASKS.status), asc(TASKS.position))

    // Get tags for each task
    const tasksWithTags = await Promise.all(
      tasks.map(async (task) => {
        const taskTags = await db
          .select({ tag: TAGS.tag })
          .from(TASK_TAGS)
          .innerJoin(TAGS, eq(TASK_TAGS.tag, TAGS.tag))
          .where(eq(TASK_TAGS.task_id, task.id))

        const mappedTask = mapDbToJs(task)
        return {
          ...mappedTask,
          tags: taskTags.map(tt => tt.tag),
          assignee: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : undefined,
        }
      })
    )

    return tasksWithTags
  }

  async getTaskImages(taskId: number) {
    const images = await db
      .select({
        id: IMAGE_METADATA.id,
        original_name: IMAGE_METADATA.original_name,
        content_type: IMAGE_METADATA.content_type,
        url: IMAGE_METADATA.url,
        thumbnailData: IMAGE_DATA.thumbnail_data,
      })
      .from(IMAGE_METADATA)
      .leftJoin(IMAGE_DATA, eq(IMAGE_METADATA.id, IMAGE_DATA.id))
      .where(eq(IMAGE_METADATA.task_id, taskId))

    return mapDbArrayToJs(images)
  }

  async createTask(projectId: number, taskData: {
    title: string
    storyPoints?: number
    priority: Priority
    assigneeId?: number
    tags: string[]
    description?: string
    isBlocked?: boolean
    blockedReason?: string
    status?: string
  }) {
    // Get the next position for this status using increments of 10
    const maxPositionResult = await db
      .select({ maxPosition: sql<number>`COALESCE(MAX(position), 0)` })
      .from(TASKS)
      .where(and(
        eq(TASKS.project_id, projectId),
        eq(TASKS.status, taskData.status || 'todo')
      ))
    
    const nextPosition = maxPositionResult[0]?.maxPosition + 10

    // Create the task
    const [task] = await db
      .insert(TASKS)
      .values({
        project_id: projectId,
        title: taskData.title,
        status: taskData.status || 'todo',
        position: nextPosition,
        story_points: taskData.storyPoints,
        priority: taskData.priority,
        assignee_id: taskData.assigneeId,
        description: taskData.description,
        is_blocked: taskData.isBlocked || false,
        blocked_reason: taskData.blockedReason,
      })
      .returning()

    // Create tags if they don't exist and link them to the task
    if (taskData.tags.length > 0) {
      await Promise.all(
        taskData.tags.map(async (tag) => {
          // Try to create the tag (will fail silently if it exists)
          try {
            await db.insert(TAGS).values({ tag: tag.toLowerCase() })
          } catch (error) {
            // Tag already exists, continue
          }

          // Link tag to task
          await db.insert(TASK_TAGS).values({
            task_id: task.id,
            tag: tag.toLowerCase(),
          })
        })
      )
    }

    return mapDbToJs(task)
  }

  async updateTask(projectId: number, taskId: number, updates: Partial<Task>) {
    // Build update object directly to ensure proper types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.storyPoints !== undefined) updateData.story_points = updates.storyPoints
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.isBlocked !== undefined) updateData.is_blocked = updates.isBlocked
    if (updates.blockedReason !== undefined) updateData.blocked_reason = updates.blockedReason
    if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt
    if (updates.assigneeId !== undefined) updateData.assignee_id = updates.assigneeId
    
    updateData.updated_at = new Date()
    
    // Update the task
    const [task] = await db
      .update(TASKS)
      .set(updateData)
      .where(and(eq(TASKS.id, taskId), eq(TASKS.project_id, projectId)))
      .returning()

    // Update tags if provided
    if (updates.tags) {
      // Remove existing tags
      await db.delete(TASK_TAGS).where(eq(TASK_TAGS.task_id, taskId))

      // Add new tags
      if (updates.tags.length > 0) {
        await Promise.all(
          updates.tags.map(async (tag) => {
            // Try to create the tag (will fail silently if it exists)
            try {
              await db.insert(TAGS).values({ tag: tag.toLowerCase() })
            } catch (error) {
              // Tag already exists, continue
            }

            // Link tag to task
            await db.insert(TASK_TAGS).values({
              task_id: taskId,
              tag: tag.toLowerCase(),
            })
          })
        )
      }
    }

    return mapDbToJs(task)
  }

  async deleteTask(projectId: number, taskId: number) {
    await db
      .delete(TASKS)
      .where(and(eq(TASKS.id, taskId), eq(TASKS.project_id, projectId)))
  }

  async getTasksByStatus(projectId: number, status: string) {
    const tasks = await db
      .select({
        id: TASKS.id,
        project_id: TASKS.project_id,
        title: TASKS.title,
        status: TASKS.status,
        story_points: TASKS.story_points,
        priority: TASKS.priority,
        assignee_id: TASKS.assignee_id,
        description: TASKS.description,
        is_blocked: TASKS.is_blocked,
        blocked_reason: TASKS.blocked_reason,
        completed_at: TASKS.completed_at,
        created_at: TASKS.created_at,
        updated_at: TASKS.updated_at,
        assignee: {
          id: USERS.id,
          first_name: USERS.first_name,
          last_name: USERS.last_name,
          email: USERS.email,
        },
      })
      .from(TASKS)
      .leftJoin(USERS, eq(TASKS.assignee_id, USERS.id))
      .where(and(eq(TASKS.project_id, projectId), eq(TASKS.status, status)))
      .orderBy(asc(TASKS.created_at))

    // Get tags for each task
    const tasksWithTags = await Promise.all(
      tasks.map(async (task) => {
        const taskTags = await db
          .select({ tag: TAGS.tag })
          .from(TASK_TAGS)
          .innerJoin(TAGS, eq(TASK_TAGS.tag, TAGS.tag))
          .where(eq(TASK_TAGS.task_id, task.id))

        const mappedTask = mapDbToJs(task)
        return {
          ...mappedTask,
          tags: taskTags.map(tt => tt.tag),
          assignee: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : undefined,
        }
      })
    )

    return tasksWithTags
  }

  private async getUserIdByName(fullName: string) {
    const [firstName, lastName] = fullName.split(' ')
    const [user] = await db
      .select()
      .from(USERS)
      .where(and(eq(USERS.first_name, firstName), eq(USERS.last_name, lastName)))
    return user || null
  }

  async reorderTasks(projectId: number, taskId: number, newStatus: string, targetPosition: number) {
    // Get the current task
    const [currentTask] = await db
      .select()
      .from(TASKS)
      .where(and(eq(TASKS.id, taskId), eq(TASKS.project_id, projectId)))

    if (!currentTask) {
      throw new Error('Task not found')
    }

    const oldStatus = currentTask.status
    const oldPosition = currentTask.position

    // If moving to a different status, we need to calculate the new position
    if (oldStatus !== newStatus) {
      // Get all tasks in the target status, ordered by position
      const targetTasks = await db
        .select()
        .from(TASKS)
        .where(and(eq(TASKS.project_id, projectId), eq(TASKS.status, newStatus)))
        .orderBy(asc(TASKS.position))

      let newPosition: number

      if (targetTasks.length === 0) {
        // Empty column, start at position 10
        newPosition = 10
      } else if (targetPosition === 0) {
        // Dropping at the beginning
        newPosition = Math.floor(targetTasks[0].position / 2)
      } else if (targetPosition >= targetTasks.length || targetPosition === 999) {
        // Dropping at the end
        newPosition = targetTasks[targetTasks.length - 1].position + 10
      } else {
        // Dropping between two tasks
        const prevTask = targetTasks[targetPosition - 1]
        const nextTask = targetTasks[targetPosition]
        newPosition = Math.floor((prevTask.position + nextTask.position) / 2)
        
        // If positions are too close, we need to reorder
        if (newPosition === prevTask.position || newPosition === nextTask.position) {
          // Reorder the entire column with increments of 10
          for (let i = 0; i < targetTasks.length; i++) {
            await db
              .update(TASKS)
              .set({ position: (i + 1) * 10 })
              .where(eq(TASKS.id, targetTasks[i].id))
          }
          newPosition = (targetPosition + 1) * 10
        }
      }

      // Update the moved task
      await db
        .update(TASKS)
        .set({ 
          status: newStatus, 
          position: newPosition,
          updated_at: new Date()
        })
        .where(and(eq(TASKS.id, taskId), eq(TASKS.project_id, projectId)))

      // Reorder the old status column if it's different
      if (oldStatus !== newStatus) {
        const oldTasks = await db
          .select()
          .from(TASKS)
          .where(and(eq(TASKS.project_id, projectId), eq(TASKS.status, oldStatus)))
          .orderBy(asc(TASKS.position))

        for (let i = 0; i < oldTasks.length; i++) {
          await db
            .update(TASKS)
            .set({ position: (i + 1) * 10 })
            .where(eq(TASKS.id, oldTasks[i].id))
        }
      }
    } else {
      // Same status, reordering within the column
      const columnTasks = await db
        .select()
        .from(TASKS)
        .where(and(eq(TASKS.project_id, projectId), eq(TASKS.status, oldStatus)))
        .orderBy(asc(TASKS.position))

      let newPosition: number

      if (targetPosition === 0) {
        // Moving to the beginning
        newPosition = Math.floor(columnTasks[0].position / 2)
      } else if (targetPosition >= columnTasks.length || targetPosition === 999) {
        // Moving to the end
        newPosition = columnTasks[columnTasks.length - 1].position + 10
      } else {
        // Moving between two tasks
        const prevTask = columnTasks[targetPosition - 1]
        const nextTask = columnTasks[targetPosition]
        newPosition = Math.floor((prevTask.position + nextTask.position) / 2)
        
        // If positions are too close, reorder the entire column
        if (newPosition === prevTask.position || newPosition === nextTask.position) {
          for (let i = 0; i < columnTasks.length; i++) {
            await db
              .update(TASKS)
              .set({ position: (i + 1) * 10 })
              .where(eq(TASKS.id, columnTasks[i].id))
          }
          newPosition = (targetPosition + 1) * 10
        }
      }

      // Update the moved task
      await db
        .update(TASKS)
        .set({ 
          position: newPosition,
          updated_at: new Date()
        })
        .where(and(eq(TASKS.id, taskId), eq(TASKS.project_id, projectId)))
    }

    return this.getTasks(projectId)
  }
}

// Create singleton instance
export const dbService = new DatabaseService() 