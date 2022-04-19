import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
// import { networkInterfaces } from 'os'
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
    const event: Date = new Date()
    const today = event.setDate(event.getDate() + 1)
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
      createdAt: today,
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
// eslint-disable-next-line @typescript-eslint/ban-types
export const getObjectKeyValue = <T extends object, U extends keyof T>(
  key: U
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => (obj: T) => obj[key]
export async function getTaxonomiesCtr(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    // const nets = networkInterfaces()
    // const results = Object.create(null) // Or just '{}', an empty object

    // for (const name of Object.keys(nets)) {
    //   if (nets[name])
    //     for (const net of getObjectKeyValue<any, string>(name)(nets)) {
    //       // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    //       if (net.family === 'IPv4' && !net.internal) {
    //         if (!results[name]) {
    //           results[name] = []
    //         }
    //         results[name].push(net.address)
    //       }
    //     }
    // }
    // console.log('ip: ', ip, results)
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
