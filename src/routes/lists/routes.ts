import { Router } from 'express'
import * as controllers from './controllers'
import { param, body } from 'express-validator'
import { verifyUser } from 'utils/user-manager'
import { asyncFn } from 'utils/helpers'

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
  asyncFn(controllers.removeItemsCtrl)
)

//!Delete list by Name
listRouter.delete(
  '/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.deleteListCtrl)
)

/**
 * POST
 */
// * Create new list
listRouter.post(
  '/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.createListCtrl)
)

//POST all list- no pagination is need, because can have only 10 to 20 lists in total
listRouter.post('/', verifyUser, asyncFn(controllers.getListCtrl))

// *Add new Taxonomy to the list
listRouter.post(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('englishName').not().isEmpty().trim().isLength({
    min: 3,
  }),
  body('taxonomyName').not().isEmpty().trim().isLength({
    min: 3,
  }),
  verifyUser,
  asyncFn(controllers.addListItemCtrl)
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
  asyncFn(controllers.removeListItemCtrl)
)

/**
 * GET
 */
//Send specific list with items
listRouter.get(
  '/list/:listName',
  verifyUser,
  asyncFn(controllers.getListItemsCtrl)
)

//?get specific list with items
listRouter.get(
  '/list/:listName/:id',
  verifyUser,
  asyncFn(controllers.getListItemByIdCtrl)
)

//get Total list
listRouter.get(
  '/list/total-items/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.getTotalItemsCtrl)
)

//get list by ID
listRouter.get(
  '/list/:listId',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.getTotalItemsCtrl)
)

//get All ids of birds from any list
listRouter.post(
  '/birds/:username',
  param('username').not().isEmpty().trim(),
  verifyUser,
  asyncFn(controllers.getUsersBirdIdsCtrl)
)
//edit list
listRouter.put(
  '/list/:slug',
  param('slug').not().isEmpty().trim(),

  verifyUser,
  asyncFn(controllers.updateListByIDCtrl)
)
