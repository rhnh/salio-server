import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
// import { networkInterfaces } from 'os'
import * as modal from './models'

import { httpStatus, ITaxonomy, IUser } from 'types'
import { IRank, isRank } from './types'

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
    const { username } = req.user as IUser

    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const event: Date = new Date()
    const today = event.setDate(event.getDate() + 1)
    const t = req.body as ITaxonomy
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const taxonomy = { ...t, createdAt: today }

    const hasItem = await modal.create(taxonomy)

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
  const { username } = req.user as IUser
  if (!username) {
    return res.status(404).json({ done: 'you are not logged in!' })
  }
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
      isApproved: false,
    }

    const ut1: ITaxonomy = {
      englishName: englishName_new,
      rank: uCategory,
      isApproved: false,
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
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
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
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
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
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
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
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
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

export async function getByEnglishNameCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const names = await modal.getNames()
    return res.json(names)
  } catch (error) {
    throw new Error(getByEnglishNameCtrl.name)
  }
}

export async function setApprovedCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const id = req.params?.id || ''
    const names = await modal.setApprove(id)
    return res.json(names)
  } catch (error) {
    throw new Error(getByEnglishNameCtrl.name)
  }
}

export async function getPaginatedCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const limit: number = ((req.query?.limit as unknown) as number) || 10
    const page: number = (req.query.page as unknown) as number
    const ts = await modal.paginatedTaxonomies({
      page: Number(page),
      limit: Number(limit),
    })
    const r = { ...ts }
    return res.status(200).json({
      page: r.page,
      totalItems: r.totalItems,
      hasNextPage: r.hasNextPage,
      hasPreviousPage: r.hasPreviousPage,
      nextPage: r.hasNextPage ? Number(page) + 1 : undefined,
      previousPage: r.hasPreviousPage ? page - 1 : undefined,
      items: r.items,
    })
  } catch (error) {
    return res.json(500).json({
      done: false,
      message: `Something went wrong ${getPaginatedCtrl.name}`,
    })
  }
}

export async function getByRankCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const rank = (req.params?.rank as IRank) || ''
    if (!isRank(rank)) {
      return res.status(400).json({ message: 'Invalid Rank', done: false })
    }
    const ranks = await modal.getByRank({ rank })
    return res.json(ranks)
  } catch (error) {
    return res.json(500).json({
      done: false,
      message: `Something went wrong ${getPaginatedCtrl.name}`,
    })
  }
}
export async function getByParentCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const parent = (req.params?.parent as string) || ''
    if (!parent) {
      return res.status(400).json({ message: 'Invalid Rank', done: false })
    }
    const children = await modal.getByParent({ parent })
    return res.json(children)
  } catch (error) {
    return res.json(500).json({
      done: false,
      message: `Something went wrong ${getPaginatedCtrl.name}`,
    })
  }
}

export async function getByAncestorsCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const parent = req.params?.parent || ''
    const rank = req.params?.rank || ''
    const ancestors = await modal.getByAncestors({ parent, rank })
    return res.json([...ancestors])
  } catch (error) {
    return res.json(500).json({
      done: false,
      message: `Something went wrong ${getPaginatedCtrl.name}`,
    })
  }
}

export async function getUnApprovedCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }

    const unapproved = await modal.getUnApproved()
    return res.json([...unapproved])
  } catch (error) {
    return res.json(500).json({
      done: false,
      message: `Something went wrong ${getPaginatedCtrl.name}`,
    })
  }
}
export async function delTaxByIdCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { username } = req.user as IUser
    if (!username) {
      return res.status(404).json({ done: 'you are not logged in!' })
    }
    const id = req.params?.id || ''
    const names = await modal.delTaxById(id)
    return res.json(names)
  } catch (error) {
    throw new Error(getByEnglishNameCtrl.name)
  }
}
