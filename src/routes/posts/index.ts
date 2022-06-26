// import { validationResult } from 'express-validator'

import { Response, Request } from 'express'
// import { findUserByUsername } from '../models/user-models'
import { httpStatus, IPost } from 'types'
import {
  createPost,
  deletePostById,
  getFeaturedPost,
  getPostById,
  getPosts,
  setFeaturedPost,
  unFeaturedPost,
} from './models'

export async function createPostCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  // const { username } = req.user as IUser
  try {
    // const user = await findUserByUsername(username)
    const uname = 'john'

    const { title, body, image_url } = req.body
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     errors: errors.array(),
    //     message: 'You need to fill all fields',
    //   })
    // }

    if (uname) {
      const post: IPost = {
        username: uname,
        title,
        image_url,
        body,
        featured: false,
      }
      const result = await createPost(post)
      if (result.done) {
        return res.status(200).json({
          message: `Great! You have successfully posted ${title}.`,
        })
      } else {
        return res.status(400)
      }
    }
    return res.status(409).json({
      message: 'Invalid username',
    })
  } catch (error) {
    throw new Error('Cannot create new Post')
  }
}

export async function getPostsCtrl(
  _: Request,
  res: Response
): Promise<Response> {
  try {
    const posts = await getPosts()
    return res.json(posts)
  } catch (error) {
    throw new Error('Cannot get posts. Something went wrong on server')
  }
}
export async function getPostByIdCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params
    const post = await getPostById(id)

    return res.json(post)
  } catch (error) {
    throw new Error('Cannot get posts. Something went wrong on server')
  }
}
export async function getFeaturedPostCtrl(
  _: Request,
  res: Response
): Promise<Response> {
  try {
    const post = await getFeaturedPost()
    return res.json(post)
  } catch (error) {
    throw new Error('Cannot get posts. Something went wrong on server')
  }
}
export async function setFeaturedPostCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params

    const isIt = await setFeaturedPost(id)

    return res.json(isIt)
  } catch (error) {
    throw new Error('Cannot get posts. Something went wrong on server')
  }
}

export async function unFeaturedPostCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params
    const isIt = await unFeaturedPost(id)
    return res.json(isIt)
  } catch (error) {
    throw new Error('Cannot get posts. Something went wrong on server')
  }
}
export async function deletePostByCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params
    const isIt = await deletePostById(id)
    if (isIt) {
      return res.status(200).json({ done: true })
    } else {
      return res.status(httpStatus.badRequest)
    }
  } catch (error) {
    throw new Error('Cannot get posts. Something went wrong on server')
  }
}
