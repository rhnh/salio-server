import { Router } from 'express'
import { createList, deleteList, getList, getListByName } from './Lists'
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

//get specific list
listRouter.get(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(getListByName)
)
