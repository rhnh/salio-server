import { Router } from 'express'
import { body } from 'express-validator'
import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'
import { addItemCTRL, getUserItemsCTRL } from './taxonomy-controllers'

export const taxonomyRouter = Router()

taxonomyRouter.post('/', verifyUser, asyncFn(getUserItemsCTRL))

taxonomyRouter.post(
  '/new/item',
  body(['taxonomyName', 'category', 'sex'])
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 3 }),
  verifyUser,
  asyncFn(addItemCTRL)
)
