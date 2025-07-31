# Project Code & Description Feature Setup

This update adds **Project Codes** and **Descriptions** to your task management system.

## ✨ New Features

- **Project Code**: Unique, immutable ALL CAPS identifier (max 10 characters)
- **Description**: Rich markdown editor for project details and objectives  
- **Enhanced UI**: Warnings about code immutability, better form layouts
- **Validation**: Prevents duplicate codes and invalid characters

## 🚀 Quick Setup

### Option 1: Fresh Database Reset (Recommended for Testing)

If you want to start completely fresh with sample data:

```bash
# First add the new database columns
npx tsx scripts/add-missing-columns.ts

# Then reset and populate with sample data
npx tsx scripts/reset-and-seed.ts
```

### Option 2: Add Columns to Existing Data

If you want to keep your existing data and just add the new columns:

```bash
# Add the new code and description columns
npx tsx scripts/add-missing-columns.ts

# Manually update existing projects to add codes via the UI
```

⚠️ **Note**: With Option 2, existing projects will have a default code of "TEMP" that you'll need to update manually.

### What the Reset Script Does:
- ✅ Clear all existing data (users, projects, tasks, tags, images)
- ✅ Populate with 5 sample users
- ✅ Create 5 sample projects with codes and markdown descriptions
- ✅ Generate 17 sample tasks across all projects
- ✅ Maintain all relationships and constraints

## 📋 What You'll Get

After running the script, you'll have 5 sample projects:

| Project Title | Code | Description |
|---------------|------|-------------|
| Website Redesign | `WEBSITE` | Complete website overhaul with modern design |
| Mobile App Development | `MOBILEAPP` | React Native cross-platform app |
| Database Migration | `DBMIGRATE` | Infrastructure upgrade and optimization |
| API Integration | `APIINT` | Third-party service integrations |
| Security Audit | `SECURITY` | Comprehensive security assessment |

## 🎯 Features in Action

### Project Creation
- Enter project code (automatically converted to ALL CAPS)
- Warning message about code immutability  
- Rich markdown editor for descriptions
- Validation prevents invalid codes

### Project Editing
- Code field is locked (read-only) with lock icon
- Title and description can be edited
- Leader can be changed

### Project Display
- Project cards show code in brackets: `[WEBSITE]`
- Codes displayed in monospace font for clarity

## 🔧 Technical Details

### Database Changes
- Added `code varchar(10) NOT NULL UNIQUE` to PROJECTS table
- Added `description text NULLABLE` to PROJECTS table
- Updated all API endpoints and database service methods

### Validation Rules
- **Code Format**: ALL CAPS letters only (A-Z)
- **Code Length**: Maximum 10 characters
- **Code Uniqueness**: No duplicates allowed
- **Code Immutability**: Cannot be changed after creation

### UI Components
- Enhanced create/edit dialogs with proper sizing
- MarkdownEditor integration for descriptions
- Form validation and user-friendly error messages
- Responsive layouts for all screen sizes

## 🏃 Running the Application

After setting up the database:

```bash
# Start the development server
npm run dev

# Or build and start production
npm run build
npm start
```

Access your application at **http://localhost:3000**

## 📝 Testing the Features

1. **View Sample Projects**: Navigate to the home page to see projects with codes like `[WEBSITE]`, `[MOBILEAPP]`
2. **Create New Project**: Click the + button and try creating a project with a code
3. **Edit Project**: Click the edit button on any project card - notice the code field is locked
4. **View Kanban Board**: Click on any project to see tasks organized by status

That's it! Your application now has the new project code and description features ready to use. 🎉
