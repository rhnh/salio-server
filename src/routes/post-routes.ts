import { Router } from 'express'
// import { body } from 'express-validator'
import { asyncFn } from '../utils/helpers'
// import { verifyUser } from '../utils/user-manager'
import {
  createPostCTRL,
  getFeaturedPostCtrl,
  getPostByIdCtrl,
  getPostsCtrl,
} from './posts'

export const postRouter = Router()

//Create new Post
postRouter.post(
  '/',
  // body(['title'], ['body']).not().isEmpty().trim(),
  // verifyUser,
  asyncFn(createPostCTRL)
)

//get all posts
postRouter.get('/', asyncFn(getPostsCtrl))

//get post by id
postRouter.get('/post/:id', asyncFn(getPostByIdCtrl))

//get featured post
postRouter.get('/featured', asyncFn(getFeaturedPostCtrl))
