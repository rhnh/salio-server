import { Router } from 'express'
import { body } from 'express-validator'

import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'
import {
  createTaxonomyCTRL,
  getTaxonomiesCtr,
  getTaxonomySpeciesCtr,
} from './Taxonomies'

export const taxonomyRouter = Router()
/**
 *  
 *  
  englishName: string
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

taxonomyRouter.get('/', getTaxonomiesCtr)
taxonomyRouter.get('/species', verifyUser, getTaxonomySpeciesCtr)

taxonomyRouter.get('/taxonomy/:taxonomyId', verifyUser)
