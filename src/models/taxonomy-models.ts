import { IList, ISalioResponse, ITaxonomy } from '../types'

import { Collection, ObjectID } from 'mongodb'

let taxonomies: Collection

export const setItems = (t: Collection): void => {
  taxonomies = t
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

export async function getSpeciesByIds({
  birdIds,
}: {
  birdIds: IList[]
}): Promise<ITaxonomy[] | []> {
  try {
    const objectIds = birdIds.map((b) => (b = new ObjectID(b)))
    console.log([...objectIds])
    const birds = await taxonomies.find({ _id: { in: birdIds[0] } })
    return birds.toArray()
  } catch (error) {
    console.log('something went wrong', getSpeciesByIds.name)
    return []
  }
}
