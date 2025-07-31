import { dbService } from '../lib/db/service'
import { db } from '../lib/db'
import { PROJECTS } from '../lib/db/schema'

async function seedAll() {
  try {
    console.log('🚀 Starting comprehensive data seeding...\n')

    // Step 1: Seed Users
    console.log('📝 Step 1: Seeding users...')
    const users = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com' },
      { firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com' },
    ]

    for (const user of users) {
      const createdUser = await dbService.createUser(user.firstName, user.lastName, user.email)
      console.log(`  ✅ Created user: ${createdUser.firstName} ${createdUser.lastName} (${createdUser.email})`)
    }

    // Step 2: Seed Projects
    console.log('\n📋 Step 2: Seeding projects...')
    const createdUsers = await dbService.getUsers()
    
    const projects = [
      { 
        title: 'Website Redesign',
        code: 'WEBSITE',
        prompt: `# Website Redesign Project

## Overview
Complete overhaul of the company website to improve user experience and modernize the design.

## Objectives
- Improve user engagement and conversion rates
- Implement responsive design for all devices
- Optimize for search engines (SEO)
- Enhance page load performance

## Key Features
- Modern, clean design
- Mobile-first approach
- Fast loading times
- Accessibility compliance`,
        leaderId: createdUsers[0].id as number // John Doe
      },
      { 
        title: 'Mobile App Development',
        code: 'MOBILEAPP',
        prompt: `# Mobile App Development

## Overview
Develop a cross-platform mobile application using React Native to expand our digital presence.

## Objectives
- Create native mobile experience for iOS and Android
- Integrate with existing API infrastructure
- Provide offline functionality
- Implement push notifications

## Technology Stack
- React Native
- TypeScript
- Redux for state management
- Firebase for analytics`,
        leaderId: createdUsers[1].id as number // Jane Smith
      },
      { 
        title: 'Database Migration',
        code: 'DBMIGRATE',
        prompt: `# Database Migration Project

## Overview
Migrate our current database infrastructure to a more scalable and performant solution.

## Objectives
- Improve database performance
- Enhance data security
- Implement better backup strategies
- Reduce operational costs

## Migration Plan
1. **Backup**: Create comprehensive backups
2. **Schema**: Update database schema
3. **Data Transfer**: Migrate all existing data
4. **Testing**: Verify data integrity
5. **Cutover**: Switch to new database`,
        leaderId: createdUsers[2].id as number // Bob Johnson
      },
      { 
        title: 'API Integration',
        code: 'APIINT',
        prompt: `# API Integration Project

## Overview
Integrate third-party services to enhance our platform capabilities.

## Objectives
- Implement payment processing
- Add email marketing capabilities
- Integrate analytics services
- Enhance user authentication

## Services to Integrate
- **Payment**: Stripe for payment processing
- **Email**: SendGrid for transactional emails
- **Analytics**: Google Analytics for insights
- **Auth**: OAuth providers for social login`,
        leaderId: createdUsers[3].id as number // Alice Williams
      },
      { 
        title: 'Security Audit',
        code: 'SECURITY',
        prompt: `# Security Audit Project

## Overview
Comprehensive security assessment of our entire technology stack.

## Objectives
- Identify security vulnerabilities
- Implement security best practices
- Ensure compliance with regulations
- Protect user data and privacy

## Audit Scope
- **Application Security**: Code review and vulnerability testing
- **Infrastructure**: Server and network security
- **Data Protection**: Encryption and access controls
- **Compliance**: GDPR, SOC2, and industry standards`,
        leaderId: createdUsers[4].id as number // Charlie Brown
      }
    ]

    for (const project of projects) {
      const createdProject = await dbService.createProject(project.title, project.code, project.leaderId, project.prompt)
      console.log(`  ✅ Created project: ${createdProject.title} [${createdProject.code}] (Leader ID: ${createdProject.leaderId})`)
    }

    // Step 3: Get project IDs directly from database
    console.log('\n🎯 Step 3: Seeding tasks...')
    const projectResults = await db.select({ id: PROJECTS.id, title: PROJECTS.title }).from(PROJECTS).orderBy(PROJECTS.id)
    
    const tasks = [
      // Website Redesign Project (Project 1)
      {
        projectId: projectResults[0].id,
        title: 'Design Homepage Mockup',
        status: 'todo' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[1].id as number, // Jane Smith
        storyPoints: 8,
        prompt: 'Create wireframes and mockups for the new homepage design. Focus on user experience and modern design principles.',
        tags: ['design', 'frontend', 'ux']
      },
      {
        projectId: projectResults[0].id,
        title: 'Implement Responsive Layout',
        status: 'in-progress' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[0].id as number, // John Doe
        storyPoints: 13,
        prompt: 'Build the responsive layout using CSS Grid and Flexbox. Ensure compatibility across all devices.',
        tags: ['frontend', 'css', 'responsive']
      },
      {
        projectId: projectResults[0].id,
        title: 'Optimize Images and Assets',
        status: 'in-review' as const,
        priority: 'Medium' as const,
        assigneeId: createdUsers[2].id as number, // Bob Johnson
        storyPoints: 5,
        prompt: 'Compress and optimize all images for web. Implement lazy loading for better performance.',
        tags: ['performance', 'optimization']
      },
      {
        projectId: projectResults[0].id,
        title: 'Write Documentation',
        status: 'done' as const,
        priority: 'Low' as const,
        assigneeId: createdUsers[3].id as number, // Alice Williams
        storyPoints: 3,
        prompt: 'Create comprehensive documentation for the new website design and implementation.',
        tags: ['documentation']
      },

      // Mobile App Development Project (Project 2)
      {
        projectId: projectResults[1].id,
        title: 'Set up React Native Project',
        status: 'done' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[1].id as number, // Jane Smith
        storyPoints: 5,
        prompt: 'Initialize React Native project with TypeScript and configure development environment.',
        tags: ['mobile', 'react-native', 'setup']
      },
      {
        projectId: projectResults[1].id,
        title: 'Design App Navigation',
        status: 'in-progress' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[0].id as number, // John Doe
        storyPoints: 8,
        prompt: 'Implement bottom tab navigation and stack navigation for different app screens.',
        tags: ['mobile', 'navigation', 'ui']
      },
      {
        projectId: projectResults[1].id,
        title: 'Integrate API Endpoints',
        status: 'todo' as const,
        priority: 'Medium' as const,
        assigneeId: createdUsers[2].id as number, // Bob Johnson
        storyPoints: 13,
        prompt: 'Connect the mobile app to backend API endpoints for data fetching and user authentication.',
        tags: ['api', 'integration', 'backend']
      },
      {
        projectId: projectResults[1].id,
        title: 'Test on iOS Simulator',
        status: 'todo' as const,
        priority: 'Medium' as const,
        assigneeId: createdUsers[4].id as number, // Charlie Brown
        storyPoints: 5,
        prompt: 'Run comprehensive tests on iOS simulator to ensure app functionality and UI consistency.',
        tags: ['testing', 'ios', 'qa']
      },

      // Database Migration Project (Project 3)
      {
        projectId: projectResults[2].id,
        title: 'Backup Current Database',
        status: 'done' as const,
        priority: 'Critical' as const,
        assigneeId: createdUsers[2].id as number, // Bob Johnson
        storyPoints: 3,
        prompt: 'Create full backup of current database before migration. Verify backup integrity.',
        tags: ['database', 'backup', 'migration']
      },
      {
        projectId: projectResults[2].id,
        title: 'Create Migration Scripts',
        status: 'in-progress' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[2].id as number, // Bob Johnson
        storyPoints: 21,
        prompt: 'Write SQL migration scripts to transform current schema to new structure. Include rollback procedures.',
        tags: ['database', 'migration', 'sql']
      },
      {
        projectId: projectResults[2].id,
        title: 'Test Migration Process',
        status: 'todo' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[3].id as number, // Alice Williams
        storyPoints: 8,
        prompt: 'Test migration process on staging environment. Verify data integrity and performance.',
        tags: ['testing', 'migration', 'staging']
      },

      // API Integration Project (Project 4)
      {
        projectId: projectResults[3].id,
        title: 'Research Third-party APIs',
        status: 'done' as const,
        priority: 'Medium' as const,
        assigneeId: createdUsers[3].id as number, // Alice Williams
        storyPoints: 5,
        prompt: 'Research and evaluate third-party APIs for payment processing and email services.',
        tags: ['research', 'api', 'integration']
      },
      {
        projectId: projectResults[3].id,
        title: 'Implement Payment Gateway',
        status: 'in-progress' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[0].id as number, // John Doe
        storyPoints: 13,
        prompt: 'Integrate Stripe payment gateway for processing online payments securely.',
        tags: ['payment', 'stripe', 'security']
      },
      {
        projectId: projectResults[3].id,
        title: 'Set up Email Service',
        status: 'todo' as const,
        priority: 'Medium' as const,
        assigneeId: createdUsers[1].id as number, // Jane Smith
        storyPoints: 8,
        prompt: 'Configure SendGrid for transactional emails and marketing campaigns.',
        tags: ['email', 'sendgrid', 'marketing']
      },

      // Security Audit Project (Project 5)
      {
        projectId: projectResults[4].id,
        title: 'Vulnerability Assessment',
        status: 'in-progress' as const,
        priority: 'Critical' as const,
        assigneeId: createdUsers[4].id as number, // Charlie Brown
        storyPoints: 21,
        prompt: 'Conduct comprehensive security audit of all systems and identify potential vulnerabilities.',
        tags: ['security', 'audit', 'vulnerability']
      },
      {
        projectId: projectResults[4].id,
        title: 'Update Security Policies',
        status: 'todo' as const,
        priority: 'High' as const,
        assigneeId: createdUsers[4].id as number, // Charlie Brown
        storyPoints: 8,
        prompt: 'Review and update security policies and procedures based on audit findings.',
        tags: ['security', 'policies', 'compliance']
      },
      {
        projectId: projectResults[4].id,
        title: 'Implement Security Fixes',
        status: 'todo' as const,
        priority: 'Critical' as const,
        assigneeId: createdUsers[2].id as number, // Bob Johnson
        storyPoints: 13,
        prompt: 'Implement security patches and fixes for identified vulnerabilities.',
        tags: ['security', 'patches', 'fixes']
      }
    ]

    for (const task of tasks) {
      const createdTask = await dbService.createTask(task.projectId, {
        title: task.title,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        storyPoints: task.storyPoints,
        prompt: task.prompt,
        tags: task.tags
      })
      const projectTitle = projectResults.find(p => p.id === task.projectId)?.title
      console.log(`  ✅ Created task: ${createdTask.title} (Project: ${projectTitle})`)
    }

    console.log('\n🎉 All seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`  👥 Users: ${createdUsers.length}`)
    console.log(`  📋 Projects: ${projectResults.length}`)
    console.log(`  🎯 Tasks: ${tasks.length}`)
    console.log('\n🚀 You can now access the application at http://localhost:3000')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

seedAll() 