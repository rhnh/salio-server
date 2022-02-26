import { IList, ISalioResponse, ITaxonomy } from '../types'

import { Collection } from 'mongodb'
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
    console.log(error)
    return {
      done: false,
      error: new Error('Error while updating Taxonomy'),
    }
  }
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
    return await birds.toArray()
  } catch (error) {
    console.log('something went wrong', getSpeciesByIds.name, error)
    return []
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
    const slug = slugify(taxonomyName)
    const isTaxonomy = await taxonomies.insertOne({
      taxonomy,
      taxonomyName,
      category: 'species',
      location,
      slug,
    })
    return isTaxonomy.insertedId
  } catch (error) {
    console.log('error', getTaxonomy.name)
    return ''
  }
}
export async function getTaxonomies(): Promise<ITaxonomy[]> {
  try {
    const isTaxonomy = await taxonomies.find({
      approved: true,
    })
    // .project({
    //   taxonomyName: 1,
    //   taxonomy: 1,
    // })

    return isTaxonomy.toArray()
  } catch (error) {
    console.log('error', getTaxonomy.name)
    return []
  }
}
export async function getTaxonomySpecies(): Promise<ITaxonomy[]> {
  try {
    const isTaxonomy = await taxonomies
      .find({
        approved: true,
        taxonomyName: { $ne: null },
      })
      .project({
        taxonomyName: 1,
        taxonomy: 1,
      })
    return isTaxonomy.toArray()
  } catch (error) {
    console.log('error', getTaxonomy.name)
    return []
  }
}
