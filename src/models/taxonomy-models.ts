import { IList, ISalioResponse, ITaxonomy } from '../types'
import { ObjectID } from 'bson'

import { getListItemIds } from './list-models'
import { Collection } from 'mongodb'

let taxonomies: Collection

export const setItems = (t: Collection): void => {
  taxonomies = t
}

export async function getUserTaxonomy({
  username,
  listName,
}: IList): Promise<ITaxonomy[] | null> {
  try {
    const ids = await getListItemIds({ username, listName })
    const idArray = ids?.map((id) => new ObjectID(String(id)))

    idArray?.map((d) => console.error(typeof d))
    if (ids) {
      const t = await taxonomies.find({ _id: { $in: idArray } }).toArray()
      return t
    }
    return null
  } catch (error) {
    return null
  }
}

export async function createTaxonomy(
  taxonomy: ITaxonomy
): Promise<ISalioResponse<string>> {
  const item: ITaxonomy = taxonomy as ITaxonomy
  const { category } = item
  try {
    const hasItem = await taxonomies.insertOne({
      ...taxonomy,
      category: category || 'species',
      approved: false,
    })
    if (hasItem.result.n === 1) {
      return {
        done: true,
        data: hasItem.insertedId,
      }
    }
    return {
      done: false,
      message: 'Something went wrong',
    }
  } catch (error) {
    console.log(error)
    return {
      done: false,
      error: new Error(error),
    }
  }
}

export async function updateTaxonomy(
  taxonomy: ITaxonomy,
  uTaxonomy: ITaxonomy
): Promise<ISalioResponse<string>> {
  try {
    const hasItem = await taxonomies.updateOne(
      {
        taxonomy,
      },
      {
        set: {
          uTaxonomy,
        },
      }
    )
    if (hasItem.result.n === 1) {
      return {
        done: true,
        data: [hasItem.upsertedId.toString()],
      }
    }
    return {
      done: false,
      message: 'Something went wrong in database',
    }
  } catch (error) {
    console.log(error)
    return {
      done: false,
      error: new Error(error),
    }
  }
}
