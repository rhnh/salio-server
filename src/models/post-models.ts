import { IPost, ISalioResponse } from '../types'

import { Collection } from 'mongodb'
let postsCollection: Collection
export const setPosts = (t: Collection): void => {
  postsCollection = t
}
export async function createPost(post: IPost): Promise<ISalioResponse<string>> {
  try {
    const newPost = await postsCollection.insertOne({ ...post })

    if (newPost.result.n === 1) {
      return {
        done: true,
        data: newPost.insertedId,
      }
    }

    return {
      done: false,
      message: 'cannot insert new Post',
    }
  } catch (error) {
    return {
      done: false,
      error: new Error('Error: creating Post'),
    }
  }
}

export async function getPostById(id: string): Promise<ISalioResponse<string>> {
  try {
    const foundPost = await postsCollection.findOne({
      _id: id,
    })
    if (foundPost) {
      return { done: true, data: foundPost }
    }
    return {
      done: false,
      data: null,
      message: 'no Post found',
    }
  } catch (error) {
    return {
      done: false,
      data: null,
      message: 'error',
    }
  }
}
export async function getFeaturedPost(): Promise<ISalioResponse<string>> {
  try {
    const foundPost = await postsCollection.findOne({
      featured: true,
    })
    if (foundPost) {
      return { done: true, data: foundPost }
    }
    return {
      done: false,
      data: null,
      message: 'no Post found',
    }
  } catch (error) {
    return {
      done: false,
      data: null,
      message: 'error',
    }
  }
}

export async function setFeaturedPost(
  id: string
): Promise<ISalioResponse<string>> {
  try {
    const updatedPost = postsCollection.updateOne(
      {
        _id: id,
      },
      { featured: true }
    )
    if ((await updatedPost).modifiedCount === 1) {
      return {
        done: true,
        message: 'success updated the Post',
      }
    }

    return {
      done: false,
      data: null,
    }
  } catch (err: unknown) {
    const error = err as Error
    return {
      done: false,
      message: 'error, something went wrong',
      error: error,
    }
  }
}

export async function getPosts(): Promise<IPost[]> {
  try {
    const posts = await postsCollection.find({})
    return posts.toArray()
  } catch (error) {
    console.log('error', getPosts.name)
    throw new Error('Cannot find any post. Server error. Please try later')
  }
}
