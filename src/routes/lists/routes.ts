import { Router } from 'express'
import * as controllers from './controllers'
import { param, body } from 'express-validator'
import { verifyUser } from 'utils/user-manager'
import { asyncFn } from 'utils/helpers'

export const listRouter = Router()

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

/**
 * GET
 * #################################################################################
 */
//get specific list with items
listRouter.get(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.getListItemsCtrl)
)
//get all list- no pagination is need, because can have only 10 to 20 lists in total
listRouter.get('/', verifyUser, asyncFn(controllers.getListCtrl))

//?get specific list with items
listRouter.get(
  '/list/:listName/id/:id',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('id').not().isEmpty().trim().isLength({ min: 3 }),
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
  param(`listId`).not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.getTotalItemsCtrl)
)

//get All ids of birds from any list
listRouter.get(
  '/birds/:username',
  param('username').not().isEmpty().trim(),
  verifyUser,
  asyncFn(controllers.getUsersBirdIdsCtrl)
)

/**
 * PUT
 */
//edit list
listRouter.put(
  '/list/:listName/',
  param(`listName`).not().isEmpty().trim(),
  verifyUser,
  asyncFn(controllers.updateListByIDCtrl)
)

//edit items
listRouter.put(
  `/list/:listName/bird/:taxonomyId`,
  param(`taxonomyId`).not().isEmpty().trim().isLength({ min: 3 }),
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.removeItemsCtrl)
)
/**
 * DELETE
 * #################################################################################
 */
//!Delete item by Id
listRouter.delete(
  `/list/:listName/bird/:taxonomyId/:seen`,
  param(`taxonomyId`).not().isEmpty().trim().isLength({ min: 3 }),
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.removeItemsCtrl)
)

//!Delete list by Name
listRouter.delete(
  '/list/:listName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(controllers.deleteListIDCtrl)
)

//delete list by ID
listRouter.delete(
  '/list/:listId',
  param(`listId`).not().isEmpty().trim(),
  verifyUser,
  asyncFn(controllers.deleteListByIDCtrl)
)
