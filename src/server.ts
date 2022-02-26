import { MongoClient } from 'mongodb'
import { DB_NAME, URI, DB_PORT } from './utils/configs'
import { setList, /*setListItem, setTaxonomies,*/ setUser } from './models'
import { Application } from 'express'
import { setItems } from './models/taxonomy-models'
import { setPosts } from './models/post-models'

const client = new MongoClient(URI, { useUnifiedTopology: true })
export async function server(app: Application): Promise<void> {
  try {
    await client.connect()
    await client.db(DB_NAME).command({ ping: 1 })
    console.info('Connected Successfully to the server')
    try {
      const existingCollections = await client
        .db(DB_NAME)
        .listCollections()
        .toArray()
      if (existingCollections.length <= 0) {
        await client.db(DB_NAME).createCollection('users')
        await client.db(DB_NAME).createCollection('taxonomies')
        await client.db(DB_NAME).createCollection('lists')
      }
    } catch (error) {
      console.error('Cannot create collections, missing database name')
      process.exit(1)
    }
    try {
      setUser(client.db(DB_NAME).collection('users'))
      setPosts(client.db(DB_NAME).collection('posts'))
      setList(client.db(DB_NAME).collection('lists'))
      // setListItem(client.db(DB_NAME).collection("lists"));
      setItems(client.db(DB_NAME).collection('taxonomies'))
      app.listen(DB_PORT, () => {
        console.info(`http://localhost:${DB_PORT}`)
      })
    } catch (error) {
      console.error('cannot set the collection')
      process.exit(1)
    }
  } catch (error) {
    console.log(URI, DB_NAME)
    console.log(error)
    console.error('cannot connect the database! ')
    process.exit(1)
  }
}
