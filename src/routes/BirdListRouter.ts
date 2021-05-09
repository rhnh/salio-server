import { Router } from 'express'
import { body, param } from 'express-validator'
// import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'

const birdListRouter = Router()

//create a new bird or the specific listName
birdListRouter.post(
  '/lists/birds',
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  body('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
)
/**
 * TODO: a function need to be written for this.
 */
birdListRouter.delete(
  '/lists/:listName/birds/:taxonomyName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)

/**
 * TODO: a function need to be written for this.
 * update specific Taxonomy
 */
birdListRouter.put(
  '/',
  body([
    'taxonomyName',
    'uTaxonomyName',
    'uTaxonomy',
    'taxonomy',
    'category',
    'uCategory',
  ])
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)

/**
 * TODO: a function need to be written for this.
 * get specific taxonomyName for specific listName
 */
birdListRouter.get(
  '/lists/:listName/birds/:taxonomyName',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)

/**
 * TODO: a function need to be written for this.
 * get all birds for specific listName
 */
birdListRouter.get(
  '/lists/:listName/birds/',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)
