import { IList, ISalioResponse, ITaxonomy } from '../types'

import { Collection, ObjectID } from 'mongodb'
import slugify from 'slugify'

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
      createAt: Date.now(),
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
    console.error(error)
    return {
      done: false,
      error: new Error('Error'),
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
    console.error(error)
    return {
      done: false,
      error: new Error('Error while updating Taxonomy'),
    }
  }
}

export async function getUserTaxonomy({
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
    return await birds.toArray()
  } catch (error) {
    console.error('something went wrong', getUserTaxonomy.name, error)
    return []
  }
}

export async function getTaxonomy(
  englishName: string,
  taxonomy: string
): Promise<ITaxonomy | null> {
  try {
    const isTaxonomy = await taxonomies.findOne({
      englishName,
      taxonomy,
    })
    return isTaxonomy
  } catch (error) {
    console.error('error', getTaxonomy.name)
    return null
  }
}

export async function addSpecies(
  englishName: string,
  taxonomy: string,
  location: string
): Promise<string> {
  try {
    const slug = slugify(englishName)
    const isTaxonomy = await taxonomies.insertOne({
      taxonomy,
      englishName,
      category: 'species',
      location,
      slug,
    })
    return isTaxonomy.insertedId
  } catch (error) {
    console.error('error', getTaxonomy.name)
    return ''
  }
}
export async function getTaxonomies(): Promise<ITaxonomy[]> {
  try {
    const isTaxonomy = await taxonomies.find({
      approved: true,
    })
    // .project({
    //   englishName: 1,
    //   taxonomy: 1,
    // })

    return isTaxonomy.toArray()
  } catch (error) {
    console.error('error', getTaxonomy.name)
    return []
  }
}
export async function getTaxonomySpecies(): Promise<ITaxonomy[]> {
  try {
    const isTaxonomy = await taxonomies
      .find({
        approved: true,
        englishName: { $ne: null },
      })
      .project({
        englishName: 1,
        taxonomy: 1,
      })
    return isTaxonomy.toArray()
  } catch (error) {
    console.error('error', getTaxonomy.name)
    return []
  }
}
export async function getTaxonomyById(_id: string): Promise<ITaxonomy | null> {
  try {
    const isTaxonomy = await taxonomies.findOne({
      // approved: true,
      _id: new ObjectID(_id),
    })

    return (isTaxonomy as unknown) as ITaxonomy
  } catch (error) {
    console.error('error', getTaxonomy.name)
    return null
  }
}
