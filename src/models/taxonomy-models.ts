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
interface IPage {
  page?: number
  birdIds: string[]
}
export async function getSpeciesByIds({
  username,
  listName,
}: IList): Promise<ITaxonomy[] | []> {
  try {
    const birds = await taxonomies.aggregate([
      {
        $match: {
          listName,
          username,
        },
      },
      {
        $lookup: {
          from: 'taxonomies',
          localField: 'birdIds.birdId',
          foreignField: '_id',
          as: 'string',
        },
      },
    ])
    console.log(await birds.toArray())
    return await birds.toArray()
  } catch (error) {
    console.log('something went wrong', getSpeciesByIds.name, error)
    return []
  }
}

export async function totalSpecies({ birdIds }: IPage): Promise<number> {
  try {
    if (!birdIds || birdIds.length <= 0) {
      return 0
    }
    const objectIds = birdIds.map((b) => new ObjectID(b))
    const total = await taxonomies
      .find({
        _id: {
          $in: objectIds,
        },
        category: /species/i,
      })
      .count()
    return total
  } catch (error) {
    console.error(totalSpecies.name)
    return 0
  }
}
export async function getTaxonomy(
  taxonomyName: string,
  taxonomy: string
): Promise<ITaxonomy | null> {
  try {
    const isTaxonomy = await taxonomies.findOne({
      taxonomyName,
      taxonomy,
    })
    return isTaxonomy
  } catch (error) {
    console.log('error', getTaxonomy.name)
    return null
  }
}

export async function addSpecies(
  taxonomyName: string,
  taxonomy: string,
  location: string
): Promise<string> {
  try {
    const isTaxonomy = await taxonomies.insertOne({
      taxonomy,
      taxonomyName,
      category: 'species',
      location,
    })
    console.log(isTaxonomy.insertedId)
    return isTaxonomy.insertedId
  } catch (error) {
    console.log('error', getTaxonomy.name)
    return ''
  }
}
