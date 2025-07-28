import { dbService } from '../lib/db/service'

async function seedUsers() {
  try {
    console.log('Seeding users...')
    
    const users = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com' },
      { firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com' },
    ]

    for (const user of users) {
      const createdUser = await dbService.createUser(user.firstName, user.lastName, user.email)
      console.log(`Created user: ${createdUser.firstName} ${createdUser.lastName} (${createdUser.email})`)
    }

    console.log('User seeding completed!')
  } catch (error) {
    console.error('Error seeding users:', error)
  }
}

seedUsers() 