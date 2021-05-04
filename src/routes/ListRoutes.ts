import { Router } from 'express'
import { addList, addListItem, deleteList, getList } from './Lists'
import { param, body } from 'express-validator'
import { verifyUser } from '../utils/user-manager'
import { asyncFn } from '../utils/helpers'

export const listRouter = Router()

listRouter.post(
  '/',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(addList)
)

listRouter.delete(
  '/',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(deleteList)
)

listRouter.get('/', verifyUser, asyncFn(getList))

listRouter.post(
  '/birds',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(addListItem)
)

listRouter.delete(
  '/birds',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)

listRouter.put(
  '/birds',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)
listRouter.get(
  '/birds',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)
