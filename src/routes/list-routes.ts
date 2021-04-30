import { Router } from 'express'
import { addListCtrl, deleteListCtrl, showListCtrl } from './list-controllers'
import { body, param } from 'express-validator'
import { verifyUser } from '../utils/user-manager'
import { asyncFn } from '../utils/helpers'

export const listRouter = Router()

listRouter.post(
  '/new',
  body('username').not().isEmpty().trim().isLength({ min: 3 }),
  param('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(addListCtrl)
)

listRouter.delete(
  '/:listName',
  body('username').not().isEmpty().trim().isLength({ min: 3 }),
  body('listName').not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  asyncFn(deleteListCtrl)
)

listRouter.post('/show', verifyUser, asyncFn(showListCtrl))
