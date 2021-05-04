import { Router } from 'express'
import { body } from 'express-validator'
import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'
import { addItemCTRL, getUserItemsCTRL } from './Taxonomies'

export const taxonomyRouter = Router()

taxonomyRouter.post('/:listName/all', verifyUser, asyncFn(getUserItemsCTRL))

taxonomyRouter.post(
  '',
  body(['taxonomyName']).not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(addItemCTRL)
)
