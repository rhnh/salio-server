import { Router } from 'express'
import { asyncFn } from '../utils/helpers'
import { changePassword, registerUser } from './Users'
import { body } from 'express-validator'
import passport from 'passport'
import { httpStatus, IUser } from '../types'
import { createAccountLimiter } from '../utils/basic-manager'
import { generateToken, verifyUser } from '../utils/user-manager'

export const userRouter = Router()
//signup
userRouter.post(
  '/',
  createAccountLimiter,
  body('username').not().isEmpty().trim().isLength({ min: 3 }),
  body('password').not().isEmpty().trim().isLength({ min: 3 }),
  asyncFn(registerUser)
)
//login
userRouter.post('/user', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    const token = generateToken(req.user as IUser)
    res.status(httpStatus.ok)
    return res.json(token)
  } else {
    return res.sendStatus(httpStatus.badRequest).json({
      failed: true,
      username: req.user,
    })
  }
})

userRouter.get('/user', (req, res) => {
  req.logOut()
  return res.json({
    done: true,
    message: 'you have logged out',
  })
})

userRouter.post('/user/password', verifyUser, asyncFn(changePassword))
