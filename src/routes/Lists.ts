import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as ListModel from '../models/list-models'
import { httpStatus, IUser } from '../types'

export async function createList(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const { listName } = req.body
    const { username } = req.user as IUser
    console.log(listName, username)
    const alreadyList = await ListModel.getListUserListName({
      listName,
      username,
    })
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (alreadyList) {
      return res
        .status(httpStatus.badRequest)
        .json({ message: 'already exist', done: false })
    }
    const hasList = await ListModel.create({ username, listName })
    if (hasList) {
      return res.json({
        message: `Successfully added ${listName}`,
        done: true,
        user: req.user,
      })
    }
    return res.status(httpStatus.error).json({
      message: `Something went wrong`,
      done: false,
    })
  } catch (error) {
    return res.json({
      status: httpStatus.badRequest,
      done: false,
    })
  }
}

export async function deleteList(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const { listName } = req.params
    const { username } = req.user as IUser
    console.log(listName)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(httpStatus.badRequest).json({ errors: errors.array() })
    }
    if (listName === '' || !listName) {
      return res
        .status(httpStatus.badRequest)
        .json({ message: 'Something went wrong', done: true })
    }
    const isDeleted = await ListModel.deleteUserListName({ username, listName })
    if (isDeleted) {
      return res.json({
        message: `Successfully deleted ListName: "${listName}"`,
        done: true,
        user: req.user,
      })
    }
    return res.status(httpStatus.error).json({
      message: `Something went wrong,No ListName: "${listName}" found`,
      done: false,
    })
  } catch (error) {
    return res.json({
      status: httpStatus.badRequest,
      done: false,
    })
  }
}

export async function getList(req: Request, res: Response): Promise<Response> {
  const { username } = req.user as IUser
  try {
    const allLists = await ListModel.getListsByUsername({ username })
    if (allLists) {
      return res.status(200).json(allLists)
    }
    return res
      .status(httpStatus.badRequest)
      .json({ message: 'no list found', done: false })
  } catch (error) {
    return error
  }
}

export async function addListItem(
  req: Request,
  res: Response
): Promise<Response> {
  const { username } = req.user as IUser
  const { listName, taxonomyId } = req.body
  try {
    const done = ListModel.createListItem({ username, listName, taxonomyId })
    if (done) {
      return res.json({
        done: true,
        message: 'successfully added',
      })
    } else {
      return res.json({
        done: false,
        message: 'Something went wrong',
      })
    }
  } catch (error) {
    return res.json({
      done: false,
      error: true,
      message: error.message,
    })
  }
}