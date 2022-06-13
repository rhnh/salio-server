import { IList, ISalioResponse, ITaxonomy } from 'types'
import { Collection, ObjectId, ObjectID } from 'mongodb'

import slugify from 'slugify'
import {
  ancestorsPipeLine,
  getByUserPipeLine,
  paginationPipeLine,
  unApprovedPipe,
} from './pipelines'

let taxonomies: Collection

export const setTaxonomies = (t: Collection): void => {
  taxonomies = t
}
/**
 *
 * @param taxonomy a Taxonomy
 * @returns
 */
export async function create(
  taxonomy: ITaxonomy
): Promise<ISalioResponse<string>> {
  try {
    const hasItem = await taxonomies.insertOne({
      ...taxonomy,
      isApproved: false,
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
export async function setApprove(id: string): Promise<boolean> {
  try {
    const hasItem = await taxonomies.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isApproved: true } }
    )
    return (await hasItem.result.n) === 1
  } catch (nn) {
    return false
  }
}
export async function delTaxById(id: string): Promise<boolean> {
  try {
    const hasItem = await taxonomies.deleteOne({ _id: new ObjectId(id) })
    return (await hasItem.result.n) === 1
  } catch (nn) {
    return false
  }
}

export async function getByUser({
  username,
  listName,
}: IList): Promise<ITaxonomy[] | []> {
  try {
    const birds = await taxonomies.aggregate(
      getByUserPipeLine({ username, listName })
    )
    return await birds.toArray()
  } catch (error) {
    console.error('something went wrong', getByUser.name, error)
    return []
  }
}
export async function getByParent({
  parent,
}: {
  parent: string
}): Promise<ITaxonomy[] | []> {
  try {
    const birds = await taxonomies.find({
      parent,
      isApproved: true,
    })
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
      isApproved: true,
    })
    const tr = await isTaxonomy.toArray()

    return tr
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
    const isTaxonomy = taxonomies.find({
      isApproved: true,
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
    const isTaxonomy = taxonomies.find({
      isApproved: true,
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
      // isApproved: true,
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
      isApproved: true,
    })
    return isTaxonomy
  } catch (error) {
    console.error('error', getByApprovedSpecies.name)
    return null
  }
}
export async function getNames(): Promise<ITaxonomy[] | null> {
  try {
    const isTaxonomy = taxonomies
      .find({
        isApproved: true,
      })
      .project({
        englishName: 1,
        taxonomyName: 1,
        username: 1,
      })

    return isTaxonomy.toArray()
  } catch (error) {
    console.error('error', getByApprovedSpecies.name)
    return null
  }
}
interface MYResult {
  page: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalPages: number
  totalItems: number
  items: ITaxonomy[]
}
export async function paginatedTaxonomies({
  page,
}: {
  page: number
  limit: number
}): Promise<MYResult | null> {
  try {
    const ts = taxonomies.aggregate(paginationPipeLine(page))
    const f = await ts.toArray()
    return f[0] as MYResult
  } catch (error) {
    return null
  }
}

export async function getByRank({
  rank,
}: {
  rank: string
}): Promise<ITaxonomy[]> {
  try {
    const r = new RegExp(rank, 'i')
    const ts = taxonomies
      .find({ rank: r, isApproved: true })
      .project({
        taxonomyName: 1,
        englishName: 1,
        parent: 1,
        ancestors: 1,
        username: 1,
      })
      .sort({ taxonomyName: 1 })
    return (await ts.toArray()) as ITaxonomy[]
  } catch (error) {
    return []
  }
}
export async function getUnApproved(): Promise<ITaxonomy[]> {
  try {
    const ts = taxonomies.aggregate(unApprovedPipe)
    const f = await ts.toArray()
    return f as ITaxonomy[]
  } catch (error) {
    return []
  }
}
export async function getByAncestors({
  parent,
  rank,
}: {
  parent: string
  rank: string
}): Promise<ITaxonomy[]> {
  try {
    const p = new RegExp(parent, 'i')
    const r = new RegExp(rank, 'i')
    const ts = await taxonomies.aggregate(ancestorsPipeLine({ p, r }))
    return (await ts.toArray()) as ITaxonomy[]
  } catch (error) {
    return []
  }
}
