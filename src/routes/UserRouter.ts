import { Router } from 'express'
import { asyncFn } from '../utils/helpers'
import { changePassword, registerUser } from './Users'
// import { body } from 'express-validator'
import passport from 'passport'
import { httpStatus, IUser } from '../types'
import { createAccountLimiter } from '../utils/basic-manager'
import { generateToken, verifyToken, verifyUser } from '../utils/user-manager'

export const userRouter = Router()
//signup
userRouter.post(
  '/',
  // body('username').not().isEmpty().trim().isLength({ min: 3 }),
  // body('password').not().isEmpty().trim().isLength({ min: 3 }),
  createAccountLimiter,
  asyncFn(registerUser)
)
//login
userRouter.post('/user', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    const token = generateToken(req.user as IUser)
    res.status(httpStatus.ok)
    const user = req.user as IUser
    const { username } = user
    return res.json({ ...token, username })
  } else {
    return res.sendStatus(httpStatus.badRequest).json({
      failed: true,
      username: req.user,
    })
  }
})

//logout
userRouter.get('/user', (req, res) => {
  req.logOut()
  return res.json({
    done: true,
    message: 'you have logged out',
  })
})

//change password
userRouter.post('/user/password', verifyUser, asyncFn(changePassword))

//verifyUser
userRouter.post('/verify-user', (req, res) => {
  const { authorization } = req.headers

  const bearer = authorization?.split(/\s/)[1]
  const result = verifyToken(bearer || '')
  if (result) {
    res.status(200)
    return res.json({ isValidToken: true })
  } else {
    res.status(401)
    return res.json({ isValidToken: false })
  }
})
