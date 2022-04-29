import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
// import { networkInterfaces } from 'os'
import * as modal from '../models/taxonomy-models'

import { httpStatus, ITaxonomy, IUser } from '../types'
/**
 *
 * @param req - req.params.listName
 * @param res - res
 * @returns - Response Object
 */

export async function createCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const event: Date = new Date()
    const today = event.setDate(event.getDate() + 1)
    const {
      englishName,
      rank: category,
      parent,
      ancestors,
      taxonomyName: taxonomy,
      sex,
    } = req.body as ITaxonomy

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username } = req.user as IUser

    const item: ITaxonomy = {
      englishName,
      rank: category,
      sex,
      username,
      parent,
      ancestors,
      taxonomyName: taxonomy,
      createdAt: today,
      approved: false,
    }

    const hasItem = await modal.create(item)

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

export async function updateCTRL(
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
      rank: category,
      username,
      taxonomyName: taxonomy,
      approved: false,
    }

    const ut1: ITaxonomy = {
      englishName: englishName_new,
      rank: uCategory,
      approved: false,
      username,
      taxonomyName: uTaxonomy,
    }
    const hasItem = await modal.update(t1, ut1)
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
// eslint-disable-next-line @typescript-eslint/ban-types
export const getObjectKeyValue = <T extends object, U extends keyof T>(
  key: U
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => (obj: T) => obj[key]
export async function getCtr(req: Request, res: Response): Promise<Response> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const isTaxonomies = await modal.get()

    if (isTaxonomies.length > 0) {
      return res.status(httpStatus.ok).json(isTaxonomies)
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
export async function getSpeciesCtr(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const isTaxonomies = await modal.getSpecies()
    if (isTaxonomies.length > 0) {
      return res.status(httpStatus.ok).json(isTaxonomies)
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}

export async function getByIdCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params

    const taxonomy = await modal.getById(id)
    if (taxonomy) {
      return res.status(200).send(taxonomy)
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
export async function getByTaxonomyNameCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { taxonomyName } = req.params

    const taxonomy = await modal.getByTaxonomyName(taxonomyName)
    if (taxonomy) {
      return res.status(200).send(taxonomy)
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
