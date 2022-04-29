import { Router } from 'express'
import { body, param } from 'express-validator'

import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'
import {
  createCTRL,
  getCtr,
  getByIdCtrl,
  getSpeciesCtr,
  getByTaxonomyNameCtrl,
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
  asyncFn(createCTRL)
)

taxonomyRouter.get('/', getCtr)

taxonomyRouter.get('/species', getSpeciesCtr)

taxonomyRouter.get(
  '/id/:id',
  param('id').notEmpty().trim(),
  verifyUser,
  asyncFn(getByIdCtrl)
)

taxonomyRouter.get(
  '/taxonomyName/:taxonomyName',
  param('taxonomyName').notEmpty().trim(),
  verifyUser,
  asyncFn(getByTaxonomyNameCtrl)
)
