# Task Master

A modern, full-stack task management application built with Next.js 15, TypeScript, PostgreSQL, and Drizzle ORM. Features a Kanban board interface with drag-and-drop functionality, markdown descriptions, user management, and real-time updates.

## 🚀 Features

- **Kanban Board**: Drag-and-drop task management across multiple columns (Todo, In Progress, In Review, Done)
- **Project Management**: Create and manage multiple projects with team leaders
- **User Management**: Assign tasks to team members with type-ahead search
- **Markdown Support**: Rich text descriptions for tasks with formatting toolbar
- **Real-time Updates**: Optimistic UI updates with persistent database storage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Keyboard Navigation**: Full keyboard accessibility support
- **Efficient Drag & Drop**: Sparse numbering algorithm for optimal performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable
- **Markdown Editor**: @uiw/react-md-editor
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 22+ (for local development)
- Git

## 🐳 Quick Start with Docker

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextjs-team-tasks
```

### 2. Start the Application

```bash
# Start all services (PostgreSQL + Next.js)
docker-compose up -d

# Or start in the foreground to see logs
docker-compose up
```

### 3. Run Database Migrations

```bash
# Run migrations to create database schema
docker-compose exec nextjs npm run db:migrate
```

### 4. Seed Test Data

```bash
# Seed all test data (users, projects, and tasks)
docker-compose exec nextjs npx tsx scripts/seed-all.ts
```

Or seed individually:

```bash
# Seed users only
docker-compose exec nextjs npx tsx scripts/seed-users.ts

# Seed projects only (requires users first)
docker-compose exec nextjs npx tsx scripts/seed-projects.ts

# Seed tasks only (requires users and projects first)
docker-compose exec nextjs npx tsx scripts/seed-tasks.ts
```

### 5. Access the Application

Open your browser and navigate to: http://localhost:3000

## 🧪 Test Data

The application includes comprehensive test data to get you started:

### Users

- John Doe (john.doe@example.com)
- Jane Smith (jane.smith@example.com)
- Bob Johnson (bob.johnson@example.com)
- Alice Williams (alice.williams@example.com)
- Charlie Brown (charlie.brown@example.com)

### Projects

1. **Website Redesign** (Leader: John Doe)
2. **Mobile App Development** (Leader: Jane Smith)
3. **Database Migration** (Leader: Bob Johnson)
4. **API Integration** (Leader: Alice Williams)
5. **Security Audit** (Leader: Charlie Brown)

### Sample Tasks

Each project includes multiple tasks across different statuses:

**Website Redesign Project:**

- Design Homepage Mockup (Todo, High Priority, 8 points)
- Implement Responsive Layout (In Progress, High Priority, 13 points)
- Optimize Images and Assets (In Review, Medium Priority, 5 points)
- Write Documentation (Done, Low Priority, 3 points)

**Mobile App Development Project:**

- Set up React Native Project (Done, High Priority, 5 points)
- Design App Navigation (In Progress, High Priority, 8 points)
- Integrate API Endpoints (Todo, Medium Priority, 13 points)
- Test on iOS Simulator (Todo, Medium Priority, 5 points)

**Database Migration Project:**

- Backup Current Database (Done, Critical Priority, 3 points)
- Create Migration Scripts (In Progress, High Priority, 21 points)
- Test Migration Process (Todo, High Priority, 8 points)

**API Integration Project:**

- Research Third-party APIs (Done, Medium Priority, 5 points)
- Implement Payment Gateway (In Progress, High Priority, 13 points)
- Set up Email Service (Todo, Medium Priority, 8 points)

**Security Audit Project:**

- Vulnerability Assessment (In Progress, Critical Priority, 21 points)
- Update Security Policies (Todo, High Priority, 8 points)
- Implement Security Fixes (Todo, Critical Priority, 13 points)

All tasks include:

- Rich markdown descriptions
- Story points for estimation
- Priority levels (Low, Medium, High, Critical)
- Tags for categorization
- Assignees from the user pool

## 🔧 Local Development

### Prerequisites

- Node.js 22+
- PostgreSQL (or use Docker)

### Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:

   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/kanban_db
   ```

3. **Database Setup**

   ```bash
   # Start PostgreSQL (if using Docker)
   docker-compose up postgres -d

   # Run migrations
   npm run db:migrate

   # Seed test data
   npx tsx scripts/seed-all.ts
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Tables

- **USERS**: Team members with first name, last name, and email
- **PROJECTS**: Projects with title and leader assignment
- **TASKS**: Tasks with title, description, status, priority, assignee, and position
- **TAGS**: Task tags for categorization

### Key Features

- Integer sequence primary keys
- Snake_case column naming (database) with camelCase mapping (JavaScript)
- Sparse numbering for efficient drag-and-drop operations
- Foreign key relationships with proper constraints

## 🎯 Usage

### Creating Projects

1. Navigate to the home page
2. Click "Create New Project"
3. Enter project title and select a team leader
4. Click "Create Project"

### Managing Tasks

1. Click on a project to open the Kanban board
2. Use the "Add Task" button to create new tasks
3. Drag and drop tasks between columns
4. Click on tasks to edit details, assignees, and descriptions

### User Management

- Type-ahead search for users when assigning tasks or project leaders
- Users can be assigned to multiple tasks
- Project leaders can be changed via the edit dialog

## 🔄 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate new migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
npm run db:push      # Push schema changes

# Utilities
npm run lint         # Run ESLint
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d kanban_db

# Run commands in Next.js container
docker-compose exec nextjs npm run db:migrate
```

## 🏗️ Architecture

### Frontend

- **Next.js 15**: App Router with server and client components
- **React 19**: Latest React features and hooks
- **TypeScript**: Full type safety
- **shadcn/ui**: Consistent, accessible UI components

### Backend

- **API Routes**: Next.js API routes for data operations
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Robust relational database

### Key Patterns

- **Optimistic Updates**: UI updates immediately, syncs with server
- **Sparse Numbering**: Efficient drag-and-drop with minimal database writes
- **Property Mapping**: Consistent camelCase/snake_case conversion
- **Error Handling**: Graceful error recovery and user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors**

- Ensure PostgreSQL is running: `docker-compose ps`
- Check environment variables are set correctly
- Verify database migrations have been run

**Drag and Drop Not Working**

- Check browser console for JavaScript errors
- Ensure you're not in edit mode (drag is disabled when editing)
- Verify the task card is not being blocked by other elements

**User Search Not Working**

- Ensure test data has been seeded: `npx tsx scripts/seed-users.ts`
- Check that users exist in the database
- Verify the search is case-insensitive

**Performance Issues**

- The sparse numbering algorithm should handle hundreds of tasks efficiently
- If experiencing slowdowns, check for infinite loops in React components
- Monitor database query performance

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Review the Docker logs: `docker-compose logs -f`
3. Verify all prerequisites are installed
4. Ensure database migrations and seeding completed successfully
