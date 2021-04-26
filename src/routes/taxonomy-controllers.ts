import { Response, Request } from 'express'
import { getUserItems } from '../models/taxonomy-models'
import { httpStatus, IUser } from '../types'

export async function getTaxonomiesCTRL(
  req: Request,
  res: Response
): Promise<Response> {
  const { listName } = req.body
  const { username } = req.user as IUser
  console.log(username, listName)
  try {
    const taxonomies = (await getUserItems({ username, listName })) || []
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
