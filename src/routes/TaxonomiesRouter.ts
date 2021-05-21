import { Router } from 'express'
import { body } from 'express-validator'

import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'
import { createTaxonomyCTRL, getTaxonomiesCtr } from './Taxonomies'

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

taxonomyRouter.get('/', verifyUser, getTaxonomiesCtr)
