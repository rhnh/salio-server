import { Cursor, Collection, ObjectID } from 'mongodb'
import slugify from 'slugify'
import { IList } from '../types'
let lists: Collection

export function setList(collection: Collection): void {
  lists = collection
}

export async function create({ username, listName }: IList): Promise<boolean> {
  try {
    const newList = await lists.insertOne({
      username,
      listName,
      slug: slugify(listName),
      createAt: Date.now(),
    })
    return newList.result.n === 1
  } catch (error) {
    return false
  }
}

export async function getListByName({
  username,
  listName,
}: IList): Promise<IList | null> {
  try {
    const hasList = await lists.findOne({
      username,
      slug: listName.toLowerCase(),
    })
    return hasList
  } catch (error) {
    return null
  }
}
export async function getListBySlug({
  username,
  listName,
}: IList): Promise<IList | null> {
  try {
    const hasList = await lists.findOne({ username, slug: listName })
    return hasList
  } catch (error) {
    return null
  }
}

export async function getListByID({
  username,
  _id,
}: {
  username: string
  _id: string
}): Promise<IList | null> {
  try {
    const hasList = await lists.findOne({ username, _id })
    return hasList
  } catch (error) {
    return null
  }
}

export async function getTotalItems({
  listName,
  username,
}: IList): Promise<number> {
  try {
    const listCount = await (
      await getListItems({ listName, username })
    ).toArray()
    return listCount?.length || 0
  } catch (error) {
    console.error(getTotalItems.name, error)
    return 0
  }
}

export async function getListItems(param: IList): Promise<Cursor> {
  const { username, listName } = param
  try {
    const listItems = lists?.aggregate([
      {
        $match: {
          slug: listName,
          username,
        },
      },
      {
        $lookup: {
          from: 'taxonomies',
          localField: 'birdIds.birdId',
          foreignField: '_id',
          as: 'birds',
        },
      },
      {
        $unwind: {
          path: '$birds',
        },
      },
      {
        $unwind: {
          path: '$birdIds',
        },
      },
      {
        $group: {
          _id: '$_id',
          birds: {
            $push: {
              $cond: [
                {
                  $eq: ['$birds._id', '$birdIds.birdId'],
                },
                {
                  id: '$birds._id',
                  listName: '$birds.name',
                  seen: '$birdIds.seen',
                  taxonomy: '$birds.taxonomy',
                  location: '$birds.location',
                  englishName: '$birds.englishName',
                  slug: '$birds.slug',
                },
                null,
              ],
            },
          },
        },
      },
      {
        $unwind: {
          path: '$birds',
        },
      },
      {
        $match: {
          birds: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: {
            id: '$birds.id',
            listName: '$birds.listName',
            seen: '$birds.seen',
            taxonomy: '$birds.taxonomy',
            englishName: '$birds.englishName',
            location: '$birds.location',
            slug: '$birds.slug',
          },
        },
      },
      {
        $project: {
          birds: '$_id',
          _id: 0,
        },
      },
      {
        $project: {
          _id: '$birds.id',
          seen: '$birds.seen',
          taxonomy: '$birds.taxonomy',
          englishName: '$birds.englishName',
          location: '$birds.location',
          slug: '$birds.slug',
        },
      },
      {
        $sort: {
          englishName: 1,
        },
      },
    ])

    return listItems
  } catch (error) {
    throw new Error(getListItems.name + ' has error')
  }
}

export async function updateList(
  { listName, username }: IList,
  newName: string
): Promise<boolean> {
  try {
    const hasUpdatedList = await lists.updateOne(
      { username, listName },
      {
        $set: {
          listName: newName,
        },
      }
    )
    return hasUpdatedList.result.n === 1
  } catch (error) {
    return false
  }
}

export async function deleteUserListName({
  listName,
  username,
}: IList): Promise<boolean> {
  try {
    const hasDeletedList = await lists.deleteOne({ username, slug: listName })
    return hasDeletedList.result.n === 1
  } catch (error) {
    return false
  }
}

export async function getListsByUsername({
  username,
}: {
  username: string
}): Promise<IList[] | null> {
  try {
    const allLists = await lists
      .find(
        { username },
        {
          projection: {
            username: 1,
            _id: 1,
            listName: 1,
            createAt: 1,
            location: 1,
            slug: 1,
          },
        }
      )
      .toArray()
    return allLists
  } catch (error) {
    throw new Error(getListsByUsername.name + ' has error')
  }
}
interface IParam {
  taxonomyId: string
  listName: string
  username: string
  location?: string
}
export async function createListItem(param: IParam): Promise<boolean> {
  const { username, listName, taxonomyId, location } = param
  try {
    if (!taxonomyId) {
      return false
    }

    const isAdd = await lists.updateOne(
      { username, slug: listName },
      {
        $push: {
          birdIds: {
            birdId: new ObjectID(taxonomyId),
            location,
            seen: Date.now(),
          },
        },
      }
    )
    if (isAdd.matchedCount === 1) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

export async function deleteListItem(param: IParam): Promise<boolean> {
  const { username, listName, taxonomyId } = param
  try {
    if (!taxonomyId) {
      return false
    }

    const isAdd = await lists.updateOne(
      { username, slug: listName },
      {
        $pull: {
          birdIds: {
            birdId: new ObjectID(taxonomyId),
          },
        },
      }
    )
    if (isAdd.matchedCount === 1) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

export async function removeListItem(param: IParam): Promise<boolean> {
  const { username, listName, taxonomyId } = param
  try {
    if (!taxonomyId) {
      return false
    }
    const hasRemoved = await lists.updateOne(
      { username, listName },
      {
        $pull: {
          birdIds: {
            birdId: new ObjectID(taxonomyId),
          },
        },
      }
    )
    return hasRemoved.result.ok === 1
  } catch (error) {
    return false
  }
}

export async function getUsersBirdIds(username: string): Promise<string[]> {
  try {
    const birdIds = await lists
      .aggregate([
        {
          $unwind: {
            path: '$birdIds',
          },
        },
        {
          $match: {
            username,
          },
        },
        {
          $project: {
            birdIds: 1,
            _id: 0,
          },
        },
        {
          $group: {
            _id: '$birdIds.birdId',
          },
        },
      ])
      .toArray()
    const ids: string[] = birdIds as string[]
    const values = ids.map((id) => Object.values(id)) || []
    const result = values.flat()
    return result
  } catch (error) {
    return []
  }
}
