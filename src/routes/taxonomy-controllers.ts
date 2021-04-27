import { Response, Request } from 'express'
import { validationResult } from 'express-validator'
import { addItems, getUserItems } from '../models/taxonomy-models'
import { httpStatus, ITaxonomy, IUser } from '../types'
/**
 *
 * @param req - req.params.listName
 * @param res - res
 * @returns - Response Object
 */
export async function getUserItemsCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  let { list } = req.params
  list = list || ''
  console.log(list, req.params, 'hooooooooooooooooh')
  const { username } = req.user as IUser
  try {
    const taxonomies = (await getUserItems({ username, listName: list })) || []
    if (taxonomies?.length >= 0) {
      return res.status(httpStatus.ok).json(taxonomies)
    } else {
      return res.status(httpStatus.badRequest).json({
        done: false,
        message: `no list "${list}" found for User "${username}" `,
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
export async function addItemCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { taxonomyName, category, sex } = req.body as ITaxonomy
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
      approved: false,
    }
    const hasItem = await addItems(item)
    if (hasItem) {
      return res
        .status(httpStatus.ok)
        .json({ done: true, message: `${taxonomyName} has been added!` })
    }
    return res.status(httpStatus.badRequest).json({ done: false })
  } catch (error) {
    return res.json(error)
  }
}
