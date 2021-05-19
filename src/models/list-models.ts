import { Collection, ObjectID } from 'mongodb'
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
      createAt: Date.now(),
    })
    return newList.result.n === 1
  } catch (error) {
    return false
  }
}

export async function getList({
  username,
  listName,
}: IList): Promise<IList | null> {
  try {
    const hasList = await lists.findOne({ username, listName })
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
    const listCount = await getListItems({ listName, username })
    return listCount?.length || 0
  } catch (error) {
    console.error(getTotalItems.name, error)
    return 0
  }
}

// interface IGetListItems extends IList {
//   page: number
//   perPage: number
// }
export async function getListItems({
  listName,
  username,
}: // page = 1,
// perPage = 10,
IList): Promise<IList[] | null> {
  try {
    const listItems = await lists?.aggregate([
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
                  listName: '$birds.taxonomy',
                  seen: '$birdIds.seen',
                  species: '$birds.taxonomyName',
                  location: '$birds.location',
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
            species: '$birds.species',
          },
        },
      },
    ])

    const temp = await await listItems.toArray()
    const f = temp.map((f) => f._id)

    return f
  } catch (error) {
    return error
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
    const hasDeletedList = await lists.deleteOne({ username, listName })
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
          },
        }
      )
      .toArray()
    return allLists
  } catch (error) {
    return error
  }
}
interface IAddItem {
  taxonomyId?: string
  listName: string
  username: string
  location: string
}
export async function createListItem(param: IAddItem): Promise<boolean> {
  const { username, listName, taxonomyId, location } = param
  try {
    if (!taxonomyId) {
      return false
    }
    const isAdd = await lists.updateOne(
      { username, listName },
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
    if (isAdd.upsertedId) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}
