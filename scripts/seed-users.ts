import { dbService } from '../lib/db/service'

async function seedUsers() {
  try {
    console.log('Seeding users...')
    
    const users = [
      { fullName: 'John Doe', email: 'john.doe@example.com' },
      { fullName: 'Jane Smith', email: 'jane.smith@example.com' },
      { fullName: 'Bob Johnson', email: 'bob.johnson@example.com' },
      { fullName: 'Alice Williams', email: 'alice.williams@example.com' },
      { fullName: 'Charlie Brown', email: 'charlie.brown@example.com' },
    ]

    for (const user of users) {
      const createdUser = await dbService.createUser(user.fullName, user.email)
      console.log(`Created user: ${createdUser.fullName} (${createdUser.email})`)
    }

    console.log('User seeding completed!')
  } catch (error) {
    console.error('Error seeding users:', error)
  }
}

seedUsers() 