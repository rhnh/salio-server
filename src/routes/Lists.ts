import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as ListModel from '../models/list-models'
import {
  addSpecies,
  getSpeciesByIds,
  getTaxonomy,
  totalSpecies,
} from '../models/taxonomy-models'
import { httpStatus, ITaxonomy, IUser } from '../types'

//Create a new list
export async function createListCtrl(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const { listName } = req.body
    const { username } = req.user as IUser
    const alreadyList = await ListModel.getList({
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
//Delete specific list
export async function deleteListCtrl(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const { listName } = req.params
    const { username } = req.user as IUser

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

//Get all user's lists
export async function getListCtrl(
  req: Request,
  res: Response
): Promise<Response> {
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

//get user's specific list
export async function getListByNameCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { username } = req.user as IUser
  const { listName } = req.params
  try {
    const list = await ListModel.getList({
      username,
      listName,
    })
    if (list) {
      return res.status(200).json(list)
    }
    return res
      .status(httpStatus.badRequest)
      .json({ message: 'no list found', done: false })
  } catch (error) {
    return error
  }
}
//Add specific Specific Taxonomy to user list
export async function addListItemCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { username } = req.user as IUser
  const { taxonomyName, taxonomy } = req.body
  const { listName } = req.params
  try {
    const isTaxonomy = await getTaxonomy(taxonomyName, taxonomy)

    const { _id } = ((await isTaxonomy) as ITaxonomy) || ''
    if (_id) {
      const done = await ListModel.createListItem({
        username,
        listName,
        taxonomyId: _id,
      })
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
    }
    const taxonomyId = await addSpecies(taxonomyName, taxonomy)
    const done = await ListModel.createListItem({
      username,
      listName,
      taxonomyId,
    })
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

export async function getListItemsCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { username } = req.user as IUser

  const { listName, page } = req.params
  try {
    const birdIds = await ListModel.getListBirdIds({ listName, username })

    const birds = await getSpeciesByIds({ birdIds, page: +page })
    const total = await totalSpecies({ birdIds })
    console.log('total', total)
    return res.json({ birds, total })
  } catch (error) {
    return res.json({
      done: false,
      error: true,
      message: error.message,
    })
  }
}
