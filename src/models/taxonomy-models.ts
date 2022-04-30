import { IList, ISalioResponse, ITaxonomy } from '../types'

import { Collection, ObjectID } from 'mongodb'
import slugify from 'slugify'

let taxonomies: Collection

export const setItems = (t: Collection): void => {
  taxonomies = t
}

export async function create(
  taxonomy: ITaxonomy
): Promise<ISalioResponse<string>> {
  const item: ITaxonomy = taxonomy as ITaxonomy
  const { rank: category } = item
  try {
    const hasItem = await taxonomies.insertOne({
      ...taxonomy,
      category: category || 'species',
      approved: false,
      createdAt: Date.now(),
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

export async function update(
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

export async function getByUser({
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
    console.error('something went wrong', getByUser.name, error)
    return []
  }
}

export async function getByTaxonomyName(
  taxonomyName: string
): Promise<ITaxonomy[] | null> {
  const t = new RegExp(taxonomyName, 'i')
  try {
    const isTaxonomy = await taxonomies.find({
      taxonomyName: { $regex: t },
      approved: true,
    })
    return await isTaxonomy.toArray()
  } catch (error) {
    console.error('error', getByTaxonomyName.name)
    return null
  }
}

export async function addSpecies(
  englishName: string,
  taxonomyName: string,
  location: string
): Promise<string> {
  try {
    const slug = slugify(englishName)
    const isTaxonomy = await taxonomies.insertOne({
      taxonomyName,
      englishName,
      rank: 'species',
      location,
      slug,
    })
    return isTaxonomy.insertedId
  } catch (error) {
    console.error('error', addSpecies.name)
    return ''
  }
}

export async function get(): Promise<ITaxonomy[]> {
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
    console.error('error', get.name)
    return []
  }
}

export async function getSpecies(): Promise<ITaxonomy[]> {
  try {
    const isTaxonomy = await taxonomies.find({
      approved: true,
      englishName: { $ne: null },
      rank: /species/i,
    })

    return isTaxonomy.toArray()
  } catch (error) {
    console.error('error', getSpecies.name)
    return []
  }
}

export async function getById(_id: string): Promise<ITaxonomy | null> {
  try {
    const isTaxonomy = await taxonomies.findOne({
      // approved: true,
      _id: new ObjectID(_id),
    })

    return (isTaxonomy as unknown) as ITaxonomy
  } catch (error) {
    console.error('error', getById.name)
    return null
  }
}
export async function getByApprovedSpecies(
  englishName: string,
  taxonomyName: string
): Promise<ITaxonomy | null> {
  try {
    const isTaxonomy = await taxonomies.findOne({
      englishName,
      taxonomyName,
      approved: true,
    })
    return isTaxonomy
  } catch (error) {
    console.error('error', getByApprovedSpecies.name)
    return null
  }
}
