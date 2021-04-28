import { Router } from 'express'
import { asyncFn } from '../utils/helpers'
import { registerUser } from './user-controllers'
import { body } from 'express-validator'
import passport from 'passport'
import { httpStatus, IUser } from '../types'
import { createAccountLimiter } from '../utils/basic-manager'
import { generateToken } from '../utils/user-manager'
import { appCors } from '../utils/cors'

export const userRouter = Router()
userRouter.options('*', appCors, (_, res) => {
  res.sendStatus(200)
})
userRouter.post(
  '/signup',
  createAccountLimiter,
  body('username').not().isEmpty().trim().isLength({ min: 3 }),
  body('password').not().isEmpty().trim().isLength({ min: 3 }),

  asyncFn(registerUser)
)

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    const token = generateToken(req.user as IUser)
    res.status(httpStatus.ok)
    return res.json(token)
  } else {
    res.status(httpStatus.badRequest)
    return res.json({
      failed: true,
    })
  }
})
