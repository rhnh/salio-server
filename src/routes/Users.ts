import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { addUser, findUserByUsername } from '../models/user-models'
import { httpStatus } from '../types'
import { generatePassword } from '../utils/password'

export async function registerUser(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { username, password } = req.body
    console.log(username, password)
    const usernameTaken = await findUserByUsername(username)

    if (usernameTaken) {
      return res.status(httpStatus.conflict).json({
        message: `User: ${username} already taken!`,
      })
    }

    const done = await addUser({
      username,
      password: await generatePassword(password),
    })

    return done
      ? res.json({
          message: `You have successfully register`,
          done,
          status: httpStatus.ok,
        })
      : res.json({
          status: httpStatus.badRequest,
          message: 'Something went wrong on server',
        })
  } catch (error) {
    res.json({ statusMessage: 'something went wrong', statusCode: 505 })
  }
}
