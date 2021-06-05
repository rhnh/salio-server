import { Router } from 'express'
import * as routes from './Lists'
import { param, body } from 'express-validator'
import { verifyUser } from '../utils/user-manager'
import { asyncFn } from '../utils/helpers'

export const listRouter = Router()
//!Delete by Id
listRouter.delete(
  '/list/:listName/bird/:taxonomyId',
  param('taxonomyId').not().isEmpty().trim().isLength({ min: 3 }),
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.removeItemsCtrl)
)

//!Delete list by Name
listRouter.delete(
  '/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.deleteListCtrl)
)
//?get all list- no pagination is need, because can have only 10 to 20 lists in total
listRouter.get('/', verifyUser, asyncFn(routes.getListCtrl))

//?get specific list with items
listRouter.get('/list/:listName', verifyUser, asyncFn(routes.getListItemsCtrl))

//?get Total list
listRouter.get(
  '/list/total-items/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),

  verifyUser,
  asyncFn(routes.getTotalItemsCtrl)
)
// * Create new list
listRouter.post(
  '/',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.createListCtrl)
)
// *Add new Taxonomy to the list
listRouter.post(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('taxonomyName').not().isEmpty().trim().isLength({
    min: 3,
  }),
  body('taxonomy').not().isEmpty().trim().isLength({
    min: 3,
  }),
  verifyUser,
  asyncFn(routes.addListItemCtrl)
)
