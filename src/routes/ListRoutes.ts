import { Router } from 'express'
import { addList, addListItem, deleteList, getList } from './Lists'
import { param } from 'express-validator'
import { verifyUser } from '../utils/user-manager'
import { asyncFn } from '../utils/helpers'

export const listRouter = Router()

listRouter.post(
  '/:listName/create',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(addList)
)

listRouter.delete(
  '/:listName/delete',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(deleteList)
)

listRouter.post('/all', verifyUser, asyncFn(getList))

listRouter.post(
  '/:listName/:taxonomyName/create',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(addListItem)
)

listRouter.post(
  '/:listName/:taxonomyName/delete',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)

listRouter.post(
  '/:listName/:taxonomyName/update',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)
