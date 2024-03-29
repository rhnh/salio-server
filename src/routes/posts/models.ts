import { IPost, ISalioResponse } from 'types'

import { Collection, ObjectId } from 'mongodb'
let postsCollection: Collection
export const setPosts = (t: Collection): void => {
  postsCollection = t
}
export async function createPost(post: IPost): Promise<ISalioResponse<string>> {
  try {
    const newPost = postsCollection.insertOne({
      ...post,
      createdAt: Date.now(),
      _id: new ObjectId(),
    })
    const result = await newPost

    if (result.insertedId) {
      return {
        done: true,
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
      _id: new ObjectId(id),
    })
    if (foundPost) {
      return { done: true, ...foundPost }
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
export async function deletePostById(
  id: string
): Promise<ISalioResponse<string>> {
  try {
    const foundPost = await postsCollection.deleteMany({
      _id: new ObjectId(id),
    })
    if (foundPost) {
      return { done: true, ...foundPost }
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
export async function getFeaturedPost(): Promise<IPost[] | null> {
  try {
    const foundPosts = postsCollection
      .find<IPost>({
        featured: true,
      })
      .sort({ createdAt: -1 })
    return await foundPosts.toArray()
  } catch (error) {
    return null
  }
}

export async function setFeaturedPost(
  id: string
): Promise<ISalioResponse<string>> {
  try {
    const updatedPost = await postsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          featured: true,
        },
      }
    )

    if (updatedPost.modifiedCount === 1) {
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

export async function unFeaturedPost(
  id: string
): Promise<ISalioResponse<string>> {
  try {
    const updatedPost = await postsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          featured: false,
        },
      }
    )

    if (updatedPost.modifiedCount === 1) {
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
    const posts = postsCollection.find<IPost>({}).sort({ createdAt: -1 })
    return posts.toArray()
  } catch (error) {
    console.error('error', getPosts.name)
    throw new Error('Cannot find any post. Server error. Please try later')
  }
}
