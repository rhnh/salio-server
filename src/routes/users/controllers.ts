import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import {
  addUser,
  changeUserPassword,
  deleteUserByUsername,
  findUserByUsername,
  getAllUsers,
  getUserProfile,
  setPrivilege,
} from './models'
import { httpStatus, IUser } from 'types'
import { generatePassword } from 'utils/password'

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
          data: { username },
        })
      : res.json({
          status: httpStatus.badRequest,
          message: 'Something went wrong on server',
        })
  } catch (error) {
    console.error(error)
    res.json({ statusMessage: 'something went wrong', statusCode: 505 })
  }
}

export async function changePassword(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username, password, newPassword } = req.body
    const hasChanged = await changeUserPassword({
      username,
      password,
      newPassword,
    })
    return res.json({ done: hasChanged })
  } catch (error) {
    console.warn('error', changePassword.name)
    return res.json({ done: false, error: true })
  }
}

export async function getUserProfileCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.params
    const user = await getUserProfile(username)

    return res.json({ ...user })
  } catch (error) {
    console.warn('error', getUserProfileCtrl.name)
    return res.json({ done: false, error: true })
  }
}

export async function getMembersCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const givenUser = req.user as IUser
    const username = givenUser?.username
    const user = await findUserByUsername(username)
    if (user?.role !== 'admin') {
      return res.status(401).send({ message: 'You are not authorized!' })
    }
    const users = await getAllUsers()

    return res.json(users)
  } catch (error) {
    console.warn('error', getMembersCtrl.name)
    return res.json({ done: false, error: true })
  }
}

export async function setPrivilegeCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const givenUser = req.user as IUser
    const admin = givenUser?.username //gets from token
    const isAdmin = await findUserByUsername(admin)

    if (isAdmin?.role !== 'admin') {
      return res.status(401).send({ message: 'You are not authorized!' })
    }

    const { role } = req.body
    const { username } = req.params
    if (role === undefined || username === undefined) {
      return res.status(404).send({
        message: 'bad request',
        done: false,
      })
    }

    const isSuccess = await setPrivilege(username, role)
    if (isSuccess) {
      return res.status(200).send({
        message: `You granted {username} changed to mode`,
        done: false,
      })
    }
    return res.status(400).send({
      message: `Something went wrong`,
      done: false,
    })
  } catch (error) {
    console.warn('error', getMembersCtrl.name)
    return res.json({ done: false, error: true })
  }
}

export async function deleteUserCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const givenUser = req.user as IUser
    const admin = givenUser?.username //gets from token
    const isAdmin = await findUserByUsername(admin)

    if (isAdmin?.role !== 'admin') {
      return res.status(401).send({ message: 'You are not authorized!' })
    }

    const { username } = req.params
    if (username === undefined || username === 'admin') {
      return res.status(404).send({
        message: 'bad request',
        done: false,
      })
    }

    const isSuccess = await deleteUserByUsername(username)
    if (isSuccess) {
      return res.status(200).send({
        message: `You delete {username}`,
        done: false,
      })
    }
    return res.status(400).send({
      message: `Something went wrong`,
      done: false,
    })
  } catch (error) {
    console.warn('error', getMembersCtrl.name)
    return res.json({ done: false, error: true })
  }
}
