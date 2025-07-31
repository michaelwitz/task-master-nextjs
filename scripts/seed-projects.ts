import { dbService } from '../lib/db/service'

async function seedProjects() {
  try {
    console.log('Seeding projects...')
    
    // First, get all users to assign as leaders
    const users = await dbService.getUsers()
    if (users.length === 0) {
      console.log('No users found. Please run seed-users.ts first.')
      return
    }

    const projects = [
      { 
        title: 'Website Redesign',
        code: 'WEBSITE',
        description: '# Website Redesign Project\n\n## Overview\nComplete overhaul of the company website to improve user experience and modernize the design.\n\n## Objectives\n- Improve user engagement and conversion rates\n- Implement responsive design for all devices\n- Optimize for search engines (SEO)\n- Enhance page load performance\n\n## Key Features\n- Modern, clean design\n- Mobile-first approach\n- Fast loading times\n- Accessibility compliance',
        leaderId: users[0].id as number // John Doe
      },
      { 
        title: 'Mobile App Development',
        code: 'MOBILEAPP',
        description: '# Mobile App Development\n\n## Overview\nDevelop a cross-platform mobile application using React Native to expand our digital presence.\n\n## Objectives\n- Create native mobile experience for iOS and Android\n- Integrate with existing API infrastructure\n- Provide offline functionality\n- Implement push notifications\n\n## Technology Stack\n- React Native\n- TypeScript\n- Redux for state management\n- Firebase for analytics',
        leaderId: users[1].id as number // Jane Smith
      },
      { 
        title: 'Database Migration',
        code: 'DBMIGRATE',
        description: '# Database Migration Project\n\n## Overview\nMigrate our current database infrastructure to a more scalable and performant solution.\n\n## Objectives\n- Improve database performance\n- Enhance data security\n- Implement better backup strategies\n- Reduce operational costs\n\n## Migration Plan\n1. **Backup**: Create comprehensive backups\n2. **Schema**: Update database schema\n3. **Data Transfer**: Migrate all existing data\n4. **Testing**: Verify data integrity\n5. **Cutover**: Switch to new database',
        leaderId: users[2].id as number // Bob Johnson
      },
      { 
        title: 'API Integration',
        code: 'APIINT',
        description: '# API Integration Project\n\n## Overview\nIntegrate third-party services to enhance our platform capabilities.\n\n## Objectives\n- Implement payment processing\n- Add email marketing capabilities\n- Integrate analytics services\n- Enhance user authentication\n\n## Services to Integrate\n- **Payment**: Stripe for payment processing\n- **Email**: SendGrid for transactional emails\n- **Analytics**: Google Analytics for insights\n- **Auth**: OAuth providers for social login',
        leaderId: users[3].id as number // Alice Williams
      },
      { 
        title: 'Security Audit',
        code: 'SECURITY',
        description: '# Security Audit Project\n\n## Overview\nComprehensive security assessment of our entire technology stack.\n\n## Objectives\n- Identify security vulnerabilities\n- Implement security best practices\n- Ensure compliance with regulations\n- Protect user data and privacy\n\n## Audit Scope\n- **Application Security**: Code review and vulnerability testing\n- **Infrastructure**: Server and network security\n- **Data Protection**: Encryption and access controls\n- **Compliance**: GDPR, SOC2, and industry standards',
        leaderId: users[4].id as number // Charlie Brown
      }
    ]

    for (const project of projects) {
      const createdProject = await dbService.createProject(project.title, project.code, project.leaderId, project.description)
      console.log(`Created project: ${createdProject.title} [${createdProject.code}] (Leader ID: ${createdProject.leaderId})`)
    }

    console.log('Project seeding completed!')
  } catch (error) {
    console.error('Error seeding projects:', error)
  }
}

seedProjects() 