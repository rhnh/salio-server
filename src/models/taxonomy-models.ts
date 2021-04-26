import { IList, ITaxonomy } from '../types'
import { ObjectID } from 'bson'

import { getListItemIds } from './list-models'
import { Collection } from 'mongodb'

let taxonomies: Collection

export const setItems = (t: Collection): void => {
  taxonomies = t
}

export async function getUserItems({
  username,
  listName,
}: IList): Promise<ITaxonomy[] | null> {
  try {
    const ids = await getListItemIds({ username, listName })
    console.log(ids)
    const idArray = ids?.map((id) => new ObjectID(String(id)))

    idArray?.map((d) => console.error(typeof d))
    if (ids) {
      const t = await taxonomies.find({ _id: { $in: idArray } }).toArray()
      console.log(ids, t)
      return t
    }
    return null
  } catch (error) {
    return null
  }
}
