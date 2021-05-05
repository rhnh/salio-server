import { Router } from 'express'
import { body, param } from 'express-validator'
import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'
import { createTaxonomyCTRL } from './Taxonomies'

export const taxonomyRouter = Router()
/**
 *  
 *  
  taxonomyName: string
  category: ICategories
  parent?: string
  approved: boolean
  username: string
  slug?: string
  info?: string
  sex?: IGender | undefined
  ancestors?: string[]
  taxonomy?: string
 */
taxonomyRouter.post(
  '/',
  body(['taxonomy', 'category']).not().isEmpty().trim().isLength({ min: 3 }),
  body('ancestors').isArray(),

  verifyUser,
  asyncFn(createTaxonomyCTRL)
)

/**
 * TODO: a function need to be written for this.
 * update specific Taxonomy
 */
taxonomyRouter.put(
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
taxonomyRouter.get(
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
taxonomyRouter.get(
  '/lists/:listName/birds/',
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  param('taxonomyName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser
  // asyncFn(addListItem)
)
