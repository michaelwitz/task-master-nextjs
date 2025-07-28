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
        leaderId: users[0].id // John Doe
      },
      { 
        title: 'Mobile App Development', 
        leaderId: users[1].id // Jane Smith
      },
      { 
        title: 'Database Migration', 
        leaderId: users[2].id // Bob Johnson
      },
      { 
        title: 'API Integration', 
        leaderId: users[3].id // Alice Williams
      },
      { 
        title: 'Security Audit', 
        leaderId: users[4].id // Charlie Brown
      }
    ]

    for (const project of projects) {
      const createdProject = await dbService.createProject(project.title, project.leaderId)
      console.log(`Created project: ${createdProject.title} (Leader ID: ${createdProject.leaderId})`)
    }

    console.log('Project seeding completed!')
  } catch (error) {
    console.error('Error seeding projects:', error)
  }
}

seedProjects() 