import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { asyncFn } from 'utils/helpers'
import { verifyUser } from 'utils/user-manager'
import {
  createCTRL,
  getCtr,
  getByIdCtrl,
  getSpeciesCtr,
  getByEnglishNameCtrl,
  getByTaxonomyNameCtrl,
  getPaginatedCtrl,
  getByRankCtrl,
  getByAncestorsCtrl,
  getUnApprovedCtrl,
  setApprovedCtrl,
  delTaxByIdCtrl,
  getByParentCtrl,
  updateCTRL,
} from './controllers'

export const taxonomyRouter = Router()
/**
 *  
 *  
  englishName: string
  rank: IRank
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
  body('ancestors').isArray(),
  body('rank').notEmpty().trim(),
  body('taxonomyName').notEmpty().trim(),
  verifyUser,
  asyncFn(createCTRL)
)

//get all
taxonomyRouter.get('/', verifyUser, getCtr)

//get only english name
taxonomyRouter.get('/species', verifyUser, getSpeciesCtr)

//get by id
taxonomyRouter.get(
  '/id/:id',
  param('id').notEmpty().trim(),
  verifyUser,
  asyncFn(getByIdCtrl)
)

/**
 * english name
 */
taxonomyRouter.get('/names', verifyUser, asyncFn(getByEnglishNameCtrl))

/**
 * TaxonomyName
 */
taxonomyRouter.get(
  '/taxonomyName/:taxonomyName',
  verifyUser,
  asyncFn(getByTaxonomyNameCtrl)
)
//get paginated
taxonomyRouter.get(
  '/paginated',
  // verifyUser, //for now
  query('page').notEmpty(),
  query('limit').trim(),
  asyncFn(getPaginatedCtrl)
)

taxonomyRouter.get('/rank/:rank', verifyUser, asyncFn(getByRankCtrl))

taxonomyRouter.get(
  '/ancestors/:parent/:rank',
  verifyUser,
  asyncFn(getByAncestorsCtrl)
)

//get Children
taxonomyRouter.get('/parent/:parent', verifyUser, asyncFn(getByParentCtrl))

//get all unapproved taxonomies which are added only by mods/admin
taxonomyRouter.get('/unapproved', verifyUser, asyncFn(getUnApprovedCtrl))

//approved by id
taxonomyRouter.post(
  '/set-approve/:id',
  param('id').notEmpty().trim(),
  verifyUser,
  asyncFn(setApprovedCtrl)
)

taxonomyRouter.delete(
  '/taxonomy/:id',
  param('id').notEmpty().trim(),
  verifyUser,
  asyncFn(delTaxByIdCtrl)
)

taxonomyRouter.put(
  '/taxonomy/:id',
  body('taxonomyName').notEmpty().trim(),
  param('id').notEmpty().trim(),
  verifyUser,
  asyncFn(updateCTRL)
)
