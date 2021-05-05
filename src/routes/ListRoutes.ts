import { Router } from 'express'
import { createList, addListItem, deleteList, getList } from './Lists'
import { param, body } from 'express-validator'
import { verifyUser } from '../utils/user-manager'
import { asyncFn } from '../utils/helpers'

export const listRouter = Router()

//Create new list
listRouter.post(
  '/',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(createList)
)
//Delete list by Name
listRouter.delete(
  '/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(deleteList)
)
//get all list
listRouter.get('/', verifyUser, asyncFn(getList))

//create a new bird or the specific listName
listRouter.post(
  '/lists/birds',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(addListItem)
)
/**
 * TODO: a function need to be written for this.
 */
listRouter.delete(
  '/lists/:listName/birds/:taxonomyName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)
