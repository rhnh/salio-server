import { MongoClient } from 'mongodb'
import { DB_NAME, URI, PORT } from './utils/configs'
import { setLists } from 'routes/lists/models'
import { setUsers } from 'routes/users/models'
import { Application } from 'express'
import { setPosts } from 'routes/posts/models'
import { setTaxonomies } from 'routes/taxonomies/models'
import { setNotifications } from 'routes/notifications/models'
import { USERS, NOTIFICATIONS, LISTS, TAXONOMIES, POSTS } from 'utils/const'

const client = new MongoClient(URI)

export async function server(app: Application): Promise<void> {
  try {
    await client.connect()
    await client.db(DB_NAME).command({ ping: 1 })

    try {
      const existingCollections = await client
        .db(DB_NAME)
        .listCollections()
        .toArray()
      if (existingCollections.length <= 0) {
        await client.db(DB_NAME).createCollection(USERS)
        await client.db(DB_NAME).createCollection(TAXONOMIES)
        await client.db(DB_NAME).createCollection(LISTS)
        await client.db(DB_NAME).createCollection(POSTS)
        await client.db(DB_NAME).createCollection(NOTIFICATIONS)
      }
    } catch (error) {
      console.error(
        `Cannot create collections, missing database name for the ${URI}`
      )
      process.exit(1)
    }
    try {
      setUsers(client.db(DB_NAME).collection(USERS))
      setPosts(client.db(DB_NAME).collection(POSTS))
      setLists(client.db(DB_NAME).collection(LISTS))
      setNotifications(client.db(DB_NAME).collection(NOTIFICATIONS))
      setTaxonomies(client.db(DB_NAME).collection(TAXONOMIES))
      app.listen(PORT, () => {
        console.info(`http://localhost:${PORT}`)
      })
    } catch (error) {
      console.error('cannot set the collection')
      process.exit(1)
    }
  } catch (error) {
    console.error(error)
    console.error('cannot connect the database! ')
    process.exit(1)
  }
}
