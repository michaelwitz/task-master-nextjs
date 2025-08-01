import { dbService } from '../lib/db/service'

async function testSearch() {
  try {
    console.log('Testing user search...')
    
    // Test different search queries
    const queries = ['char', 'Charlie', 'brown', 'john', 'alice']
    
    for (const query of queries) {
      console.log(`\nSearching for "${query}":`)
      const results = await dbService.searchUsers(query)
      console.log(`Found ${results.length} results:`)
      results.forEach(user => {
        console.log(`- ${user.fullName} (${user.email})`)
      })
    }
    
    // Also show all users for comparison
    console.log('\n\nAll users in database:')
    const allUsers = await dbService.getUsers()
    allUsers.forEach(user => {
      console.log(`- ${user.fullName} (${user.email})`)
    })
    
  } catch (error) {
    console.error('Error testing search:', error)
  }
}

testSearch() 