import { Router } from 'express'
import * as routes from './Lists'
import { param, body } from 'express-validator'
import { verifyUser } from '../utils/user-manager'
import { asyncFn } from '../utils/helpers'

export const listRouter = Router()

/**
 * DELETE
 */
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

/**
 * POST
 */
// * Create new list
listRouter.post(
  '/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.createListCtrl)
)

//POST all list- no pagination is need, because can have only 10 to 20 lists in total
listRouter.post('/', verifyUser, asyncFn(routes.getListCtrl))

// *Add new Taxonomy to the list
listRouter.post(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('englishName').not().isEmpty().trim().isLength({
    min: 3,
  }),
  body('taxonomy').not().isEmpty().trim().isLength({
    min: 3,
  }),
  verifyUser,
  asyncFn(routes.addListItemCtrl)
)
// *remove new Taxonomy to the list
listRouter.delete(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('englishName').not().isEmpty().trim().isLength({
    min: 3,
  }),
  body('taxonomy').not().isEmpty().trim().isLength({
    min: 3,
  }),
  verifyUser,
  asyncFn(routes.removeListItemCtrl)
)

/**
 * GET
 */
//Send specific list with items
listRouter.get('/list/:listName', verifyUser, asyncFn(routes.getListItemsCtrl))

//?get specific list with items
listRouter.get(
  '/list/:listName/:id',
  verifyUser,
  asyncFn(routes.getListItemByIdCtrl)
)

//get Total list
listRouter.get(
  '/list/total-items/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.getTotalItemsCtrl)
)

//get list by ID
listRouter.get(
  '/list/:listId',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(routes.getTotalItemsCtrl)
)

//get All ids of birds from any list
listRouter.post(
  '/birds/:username',
  param('username').not().isEmpty().trim(),
  verifyUser,
  asyncFn(routes.getUsersBirdIdsCtrl)
)
