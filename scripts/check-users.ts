import { dbService } from '../lib/db/service'

async function checkUsers() {
  try {
    console.log('Checking users in database...')
    
    const users = await dbService.getUsers()
    
    if (users.length === 0) {
      console.log('No users found in database')
    } else {
      console.log(`Found ${users.length} users:`)
      users.forEach(user => {
        console.log(`- ${user.fullName} (${user.email}) - ID: ${user.id}`)
      })
    }
  } catch (error) {
    console.error('Error checking users:', error)
  }
}

checkUsers() 