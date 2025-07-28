# Next.js Team Tasks - Kanban Project Management Tool

A modern Kanban board application built with Next.js 15, TypeScript, and PostgreSQL with Drizzle ORM.

## Features

- **Kanban Board**: Drag-and-drop task management with columns for Todo, In Progress, In Review, and Done
- **Rich Task Descriptions**: Markdown editor with formatting toolbar for detailed task documentation
- **User Management**: Assign tasks to team members with type-ahead search
- **Tag System**: Organize tasks with tags, with automatic lowercase storage and duplicate prevention
- **Project Management**: Create and manage multiple projects
- **Real-time Updates**: Immediate UI updates when tasks are modified
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL 15 with Drizzle ORM
- **Containerization**: Docker & Docker Compose
- **Markdown Editor**: @uiw/react-md-editor
- **Drag & Drop**: @dnd-kit

## Database Schema

### Tables

- **USERS**: Team members with first name, last name, and email
- **PROJECTS**: Projects with title and leader
- **TASKS**: Tasks with title, status, priority, assignee, description, and metadata
- **TAGS**: Reusable tags (stored in lowercase, no duplicates)
- **TASK_TAGS**: Many-to-many relationship between tasks and tags

### Key Features

- Integer sequence primary keys for scalability
- Database-generated IDs for multi-container support
- Lowercase tag storage with duplicate prevention
- Proper foreign key relationships with cascade deletes
- Timestamps for audit trails

## Quick Start

### Prerequisites

- Docker Desktop
- Node.js 22 LTS
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd nextjs-team-tasks
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/kanban_db
```

### 3. Start with Docker Compose

```bash
# Start PostgreSQL and Next.js containers
docker-compose up -d

# The application will be available at http://localhost:3000
```

### 4. Database Setup (First Time)

```bash
# Generate and run migrations
npm run db:generate
npm run db:push

# Or run migrations manually
npm run db:migrate
```

## Development

### Local Development (without Docker)

```bash
# Start PostgreSQL container only
docker-compose up postgres -d

# Start Next.js in development mode
npm run dev
```

### Database Commands

```bash
# Generate new migration
npm run db:generate

# Push schema changes to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build -d

# Remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users?q=search` - Search users
- `POST /api/users` - Create new user

### Tags

- `GET /api/tags` - Get all tags
- `GET /api/tags?q=search` - Search tags
- `POST /api/tags` - Create new tag

### Projects & Tasks

- Handled through the database service layer

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── project/[id]/      # Project pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── kanban-board.tsx  # Main Kanban component
├── lib/                  # Utilities and services
│   ├── db/              # Database schema and service
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── types/               # TypeScript type definitions
├── docker-compose.yml   # Docker services configuration
├── Dockerfile          # Next.js container configuration
└── drizzle.config.ts   # Drizzle ORM configuration
```

## Database Design Decisions

### Primary Keys

- **USERS**: Integer sequence (best practice for scalability)
- **PROJECTS**: Integer sequence (best practice for scalability)
- **TASKS**: Integer sequence (best practice for scalability)
- **TAGS**: String (tag value as primary key, natural key)
- **TASK_TAGS**: Composite key (task_id + tag)

### Tag System

- All tags stored in lowercase
- No duplicate tags allowed (case-insensitive)
- Tags created automatically when referenced in tasks
- Junction table for many-to-many relationship

### User Assignment

- Users referenced by ID for performance
- Type-ahead search by name/email
- Graceful handling of deleted users (set null)

## Production Considerations

### Multi-Container Support

- Database-generated IDs ensure no conflicts
- Connection pooling for multiple app instances
- Proper indexing for performance

### Security

- Environment variables for database credentials
- Input validation and sanitization
- SQL injection prevention through ORM

### Performance

- Database indexes on frequently queried columns
- Efficient joins for task-user relationships
- Pagination for large datasets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
