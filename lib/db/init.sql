-- Initialize database with test data

-- Insert test users
INSERT INTO "USERS" (first_name, last_name, email) VALUES
('Alice', 'Johnson', 'alice.johnson@company.com'),
('Bob', 'Smith', 'bob.smith@company.com'),
('Charlie', 'Brown', 'charlie.brown@company.com'),
('Diana', 'Prince', 'diana.prince@company.com'),
('Eve', 'Wilson', 'eve.wilson@company.com'),
('Frank', 'Miller', 'frank.miller@company.com'),
('Grace', 'Lee', 'grace.lee@company.com'),
('Henry', 'Davis', 'henry.davis@company.com')
ON CONFLICT (email) DO NOTHING;

-- Insert test tags (all lowercase)
INSERT INTO "TAGS" (tag) VALUES
('backend'),
('frontend'),
('database'),
('design'),
('bug'),
('security'),
('urgent'),
('feature'),
('testing'),
('documentation'),
('api'),
('ui'),
('ux'),
('performance'),
('mobile'),
('desktop'),
('cloud'),
('devops'),
('ci/cd'),
('monitoring')
ON CONFLICT (tag) DO NOTHING;

-- Insert test projects
INSERT INTO "PROJECTS" (title, leader_id) VALUES
('Sample Project', (SELECT id FROM "USERS" WHERE email = 'alice.johnson@company.com')),
('E-commerce Platform', (SELECT id FROM "USERS" WHERE email = 'bob.smith@company.com')),
('Mobile App Development', (SELECT id FROM "USERS" WHERE email = 'charlie.brown@company.com')),
('API Gateway', (SELECT id FROM "USERS" WHERE email = 'diana.prince@company.com')),
('User Management System', (SELECT id FROM "USERS" WHERE email = 'eve.wilson@company.com'))
ON CONFLICT DO NOTHING;

-- Insert test tasks (using the first project)
INSERT INTO "TASKS" (project_id, title, status, story_points, priority, assignee_id, description, is_blocked, blocked_reason) 
SELECT 
    1, -- project_id for 'Sample Project'
    'Set up database',
    'in-progress',
    8,
    'High',
    (SELECT id FROM "USERS" WHERE email = 'alice.johnson@company.com'),
    '# Database Setup

## Overview
Set up the PostgreSQL database for the new project.

## Requirements
- Install PostgreSQL 15+
- Configure connection pooling
- Set up backup strategy

## Steps
1. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql-15
   ```

2. **Configure Database**
   - Create database user
   - Set up SSL certificates
   - Configure connection limits

3. **Test Connection**
   - Verify connectivity
   - Run migration scripts
   - Test backup/restore

## Acceptance Criteria
- [ ] Database accessible from application
- [ ] Backup system configured
- [ ] Performance benchmarks met',
    false,
    NULL
WHERE EXISTS (SELECT 1 FROM "USERS" WHERE email = 'alice.johnson@company.com');

INSERT INTO "TASKS" (project_id, title, status, story_points, priority, assignee_id, description, is_blocked, blocked_reason) 
SELECT 
    1,
    'Design UI components',
    'in-review',
    5,
    'Medium',
    (SELECT id FROM "USERS" WHERE email = 'bob.smith@company.com'),
    '# UI Component Design

## Overview
Create reusable UI components for the application.

## Components to Design
- **Button System**
  - Primary, secondary, danger variants
  - Loading states
  - Icon support

- **Form Components**
  - Input fields with validation
  - Select dropdowns
  - Checkbox and radio buttons

- **Layout Components**
  - Card containers
  - Modal dialogs
  - Navigation bars

## Design System
- Use consistent spacing (8px grid)
- Follow accessibility guidelines
- Support dark/light themes

## Deliverables
- [ ] Component library
- [ ] Storybook documentation
- [ ] Design tokens',
    false,
    NULL
WHERE EXISTS (SELECT 1 FROM "USERS" WHERE email = 'bob.smith@company.com');

INSERT INTO "TASKS" (project_id, title, status, story_points, priority, assignee_id, description, is_blocked, blocked_reason) 
SELECT 
    1,
    'Fix authentication bug',
    'todo',
    3,
    'Critical',
    (SELECT id FROM "USERS" WHERE email = 'charlie.brown@company.com'),
    '# Authentication Bug Fix

## Issue Description
Users are experiencing intermittent authentication failures when logging in.

## Bug Details
- **Error**: 401 Unauthorized after successful login
- **Frequency**: ~15% of login attempts
- **Affected**: All user types
- **Environment**: Production only

## Investigation Steps
1. **Check Logs**
   - Review authentication service logs
   - Look for token validation errors
   - Check session storage issues

2. **Reproduce Issue**
   - Test with different browsers
   - Check network timing
   - Verify token expiration

3. **Root Cause Analysis**
   - Race condition in token refresh
   - Session cleanup timing
   - Load balancer configuration

## Fix Strategy
- Implement proper token refresh logic
- Add retry mechanism for failed auth
- Improve error handling

## Testing
- [ ] Unit tests for auth flow
- [ ] Integration tests
- [ ] Load testing',
    true,
    'Waiting for security review'
WHERE EXISTS (SELECT 1 FROM "USERS" WHERE email = 'charlie.brown@company.com');

-- Insert task-tag relationships
INSERT INTO "TASK_TAGS" (task_id, tag)
SELECT t.id, tag.tag
FROM "TASKS" t
CROSS JOIN "TAGS" tag
WHERE t.title = 'Set up database' 
  AND tag.tag IN ('backend', 'database', 'urgent')
ON CONFLICT DO NOTHING;

INSERT INTO "TASK_TAGS" (task_id, tag)
SELECT t.id, tag.tag
FROM "TASKS" t
CROSS JOIN "TAGS" tag
WHERE t.title = 'Design UI components' 
  AND tag.tag IN ('frontend', 'design', 'ui', 'ux')
ON CONFLICT DO NOTHING;

INSERT INTO "TASK_TAGS" (task_id, tag)
SELECT t.id, tag.tag
FROM "TASKS" t
CROSS JOIN "TAGS" tag
WHERE t.title = 'Fix authentication bug' 
  AND tag.tag IN ('bug', 'security', 'urgent')
ON CONFLICT DO NOTHING; 