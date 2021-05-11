import { Router } from 'express'
import * as routes from './Lists'
import { param, body } from 'express-validator'
import { verifyUser } from '../utils/user-manager'
import { asyncFn } from '../utils/helpers'

export const listRouter = Router()

//Create new list
listRouter.post(
  '/',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.createListCtrl)
)
//Delete list by Name
listRouter.delete(
  '/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.deleteListCtrl)
)
//get all list- no pagination is need, because can have only 10 to 20 lists in total
listRouter.get('/', verifyUser, asyncFn(routes.getListCtrl))

//get specific list
listRouter.get(
  '/list/:listName/page/:page',
  verifyUser,
  asyncFn(routes.getListItemsCtrl)
)
listRouter.post(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body(['taxonomyName', 'taxonomy']).not().isEmpty().trim().isLength({
    min: 3,
  }),
  verifyUser,
  asyncFn(routes.addListItemCtrl)
)
