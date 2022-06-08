import { Collection, Cursor, ObjectId } from 'mongodb'
import slugify from 'slugify'
import { IList } from 'types'
let lists: Collection

export function setLists(collection: Collection): void {
  lists = collection
}

/**
 *
 * @param - username and listName
 * @returns - a boolean value, if created the list or not
 */
export async function create({ username, listName }: IList): Promise<boolean> {
  try {
    const newList = await lists.insertOne({
      username,
      listName,
      slug: slugify(listName),
      createdAt: Date.now(),
    })
    return newList.result.n === 1
  } catch (error) {
    return false
  }
}

/**
 *
 * @param - username and listName
 * @returns - returns list with ids of birds
 */
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
/**
 *
 * @param - username  and listName
 *
 * @returns returns a
 */
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
          username,
          listName,
        },
      },
      {
        $lookup: {
          from: 'taxonomies',
          localField: 'birds.birdId',
          foreignField: '_id',
          as: 'birds',
        },
      },
    ])

    return listItems
  } catch (error) {
    throw new Error(getListItems.name + ' has error')
  }
}

export async function updateById({
  listId,
  newListName,
}: {
  listId: string
  newListName: string
}): Promise<boolean> {
  try {
    const hasUpdatedList = await lists.updateOne(
      { _id: new ObjectId(listId) },
      {
        $set: {
          listName: newListName,
          slug: slugify(newListName),
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
export async function purgeUserList(username: string): Promise<boolean> {
  try {
    const hasDeleteAll = await lists.deleteMany({ username })
    return (await hasDeleteAll.result.n) === 1
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
            createdAt: 1,
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
      { username, slug: slugify(listName) },
      {
        $push: {
          birds: {
            birdId: new ObjectId(taxonomyId),
            location,
            createdAt: Date.now(),
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
          birds: {
            birdId: new ObjectId(taxonomyId),
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
          birds: {
            birdId: new ObjectId(taxonomyId),
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
            path: '$birds',
          },
        },
        {
          $match: {
            username,
          },
        },
        {
          $project: {
            birds: 1,
            _id: 0,
          },
        },
        {
          $group: {
            _id: '$birds.birdId',
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

export async function deleteById(listId: string): Promise<boolean> {
  try {
    return (await lists.deleteOne({ _id: new ObjectId(listId) })).result.n === 1
  } catch (error) {
    return false
  }
}
