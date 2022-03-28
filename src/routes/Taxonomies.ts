import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
import {
  createTaxonomy,
  getTaxonomies,
  getTaxonomyById,
  getTaxonomySpecies,
  updateTaxonomy,
} from '../models/taxonomy-models'

import { httpStatus, ITaxonomy, IUser } from '../types'
/**
 *
 * @param req - req.params.listName
 * @param res - res
 * @returns - Response Object
 */

export async function createTaxonomyCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      englishName,
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
      englishName,
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
      englishName,
      category,
      taxonomy,
      uTaxonomy,
      englishName_new,
      uCategory,
    } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { username } = req.user as IUser
    const t1: ITaxonomy = {
      englishName,
      category,
      username,
      taxonomy,
      approved: false,
    }

    const ut1: ITaxonomy = {
      englishName: englishName_new,
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
export async function getTaxonomiesCtr(
  _: Request,
  res: Response
): Promise<Response> {
  try {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }
    // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    const isTaxonomies = await getTaxonomies()

    if (isTaxonomies.length > 0) {
      return res.status(httpStatus.ok).json(isTaxonomies)
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
export async function getTaxonomySpeciesCtr(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const isTaxonomies = await getTaxonomySpecies()

    if (isTaxonomies.length > 0) {
      return res.status(httpStatus.ok).json(isTaxonomies)
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
export async function getTaxonomyByIdCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { taxonomyId } = req.params

    const taxonomy = await getTaxonomyById(taxonomyId)
    if (taxonomy) {
      return res.status(200).send(taxonomy)
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
