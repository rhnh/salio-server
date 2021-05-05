import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
import {
  createTaxonomy,
  getUserTaxonomy,
  updateTaxonomy,
} from '../models/taxonomy-models'
import { httpStatus, ITaxonomy, IUser } from '../types'
/**
 *
 * @param req - req.params.listName
 * @param res - res
 * @returns - Response Object
 */
export async function getBirdsCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  let { listName } = req.params

  listName = listName || ''
  const { username } = req.user as IUser
  try {
    const taxonomies = (await getUserTaxonomy({ username, listName })) || []
    if (taxonomies?.length >= 0) {
      return res.status(httpStatus.ok).json(taxonomies)
    } else {
      return res.status(httpStatus.badRequest).json({
        done: false,
        message: `no list "${listName}" found for User "${username}" `,
      })
    }
  } catch (error) {
    return res.status(httpStatus.error).json({ done: false })
  }
}
/**
 *
 * @param req - taxonomyName category gender
 * @param res
 * @returns
 */
export async function createTaxonomyCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      taxonomyName,
      category,
      parent,
      ancestors,
      taxonomy,
      sex,
    } = req.body as ITaxonomy
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { username } = req.user as IUser
    const item: ITaxonomy = {
      taxonomyName,
      category,
      sex,
      username,
      parent,
      ancestors,
      taxonomy,
      createAt: new Date(Date.now()),
      approved: false,
    }
    const hasItem = await createTaxonomy(item)
    if (hasItem.done) {
      return res.status(httpStatus.ok).json({
        done: true,
        message: `${taxonomy} has been added!`,
        birdId: hasItem.data,
      })
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
export async function updateTaxonomyCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      taxonomyName,
      category,
      taxonomy,
      uTaxonomy,
      uTaxonomyName,
      uCategory,
    } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { username } = req.user as IUser
    const t1: ITaxonomy = {
      taxonomyName,
      category,
      username,
      taxonomy,
      approved: false,
    }

    const ut1: ITaxonomy = {
      taxonomyName: uTaxonomyName,
      category: uCategory,
      approved: false,
      username,
      taxonomy: uTaxonomy,
    }
    const hasItem = await updateTaxonomy(t1, ut1)
    if (hasItem.done) {
      return res.status(httpStatus.ok).json({
        done: true,
        message: `${t1} has been added!`,
        birdId: hasItem.data,
      })
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
