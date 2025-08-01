import { pgTable, serial, varchar, text, timestamp, integer, boolean, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table - using integer sequence as primary key (best practice for scalability)
export const USERS = pgTable('USERS', {
  id: serial('id').primaryKey(),
  full_name: varchar('full_name', { length: 200 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Tags table - using tag string as primary key since it's unique and natural
export const TAGS = pgTable('TAGS', {
  tag: varchar('tag', { length: 100 }).primaryKey(), // Lowercase tag string as primary key
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Projects table
export const PROJECTS = pgTable('PROJECTS', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  description: text('description'),
  leader_id: integer('leader_id').notNull().references(() => USERS.id, { onDelete: 'restrict' }),
  next_task_sequence: integer('next_task_sequence').notNull().default(1),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Tasks table
export const TASKS = pgTable('TASKS', {
  id: serial('id').primaryKey(),
  project_id: integer('project_id').notNull().references(() => PROJECTS.id, { onDelete: 'cascade' }),
  task_id: varchar('task_id', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('todo'), // 'todo', 'in-progress', 'in-review', 'done'
  position: integer('position').notNull().default(0), // Position within the column for ordering
  story_points: integer('story_points'),
  priority: varchar('priority', { length: 20 }).notNull().default('Medium'), // 'Low', 'Medium', 'High', 'Critical'
  assignee_id: integer('assignee_id').references(() => USERS.id, { onDelete: 'set null' }),
  prompt: text('prompt'),
  is_blocked: boolean('is_blocked').default(false),
  blocked_reason: text('blocked_reason'),
  started_at: timestamp('started_at', { withTimezone: true }),
  completed_at: timestamp('completed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Task-Tags junction table for many-to-many relationship
export const TASK_TAGS = pgTable('TASK_TAGS', {
  task_id: integer('task_id').notNull().references(() => TASKS.id, { onDelete: 'cascade' }),
  tag: varchar('tag', { length: 100 }).notNull().references(() => TAGS.tag, { onDelete: 'cascade' }),
})

// Image metadata table
export const IMAGE_METADATA = pgTable('IMAGE_METADATA', {
  id: serial('id').primaryKey(),
  task_id: integer('task_id').notNull().references(() => TASKS.id, { onDelete: 'cascade' }),
  original_name: varchar('original_name', { length: 255 }).notNull(),
  content_type: varchar('content_type', { length: 100 }).notNull(),
  file_size: integer('file_size').notNull(),
  url: varchar('url', { length: 500 }).notNull(), // Local DB URL or S3 URL
  storage_type: varchar('storage_type', { length: 20 }).notNull().default('local'), // 'local' or 's3'
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Image binary data table (for local storage)
export const IMAGE_DATA = pgTable('IMAGE_DATA', {
  id: integer('id').primaryKey().references(() => IMAGE_METADATA.id, { onDelete: 'cascade' }),
  data: text('data').notNull(), // Binary image data as base64 string
  thumbnail_data: text('thumbnail_data'), // Optional thumbnail data as base64 string
})

// Indexes for better performance
// export const tasksProjectIdIdx = index('tasks_project_id_idx').on(TASKS.project_id)
// export const tasksStatusIdx = index('tasks_status_idx').on(TASKS.status)
// export const tasksAssigneeIdIdx = index('tasks_assignee_id_idx').on(TASKS.assignee_id)
// export const projectsLeaderIdIdx = index('projects_leader_id_idx').on(PROJECTS.leader_id)

// User search indexes for type-ahead functionality
// export const usersFullNameIdx = index('users_full_name_idx').on(USERS.full_name)
// export const usersEmailIdx = index('users_email_idx').on(USERS.email)

// Relations
export const usersRelations = relations(USERS, ({ many }) => ({
  assignedTasks: many(TASKS),
}))

export const projectsRelations = relations(PROJECTS, ({ one, many }) => ({
  leader: one(USERS, {
    fields: [PROJECTS.leader_id],
    references: [USERS.id],
  }),
  tasks: many(TASKS),
}))

export const tasksRelations = relations(TASKS, ({ one, many }) => ({
  project: one(PROJECTS, {
    fields: [TASKS.project_id],
    references: [PROJECTS.id],
  }),
  assignee: one(USERS, {
    fields: [TASKS.assignee_id],
    references: [USERS.id],
  }),
  taskTags: many(TASK_TAGS),
  images: many(IMAGE_METADATA),
}))

export const tagsRelations = relations(TAGS, ({ many }) => ({
  taskTags: many(TASK_TAGS),
}))

export const taskTagsRelations = relations(TASK_TAGS, ({ one }) => ({
  task: one(TASKS, {
    fields: [TASK_TAGS.task_id],
    references: [TASKS.id],
  }),
  tag: one(TAGS, {
    fields: [TASK_TAGS.tag],
    references: [TAGS.tag],
  }),
}))

export const imageMetadataRelations = relations(IMAGE_METADATA, ({ one }) => ({
  task: one(TASKS, {
    fields: [IMAGE_METADATA.task_id],
    references: [TASKS.id],
  }),
  imageData: one(IMAGE_DATA, {
    fields: [IMAGE_METADATA.id],
    references: [IMAGE_DATA.id],
  }),
}))

export const imageDataRelations = relations(IMAGE_DATA, ({ one }) => ({
  metadata: one(IMAGE_METADATA, {
    fields: [IMAGE_DATA.id],
    references: [IMAGE_METADATA.id],
  }),
}))
