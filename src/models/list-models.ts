import { Collection } from 'mongodb'
import { IList } from '../types'

let lists: Collection

export function setList(collection: Collection): void {
  lists = collection
}

export async function create({ username, listName }: IList): Promise<boolean> {
  try {
    const newList = await lists.insertOne({ username, listName })
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
export async function getListBirdIds({
  listName,
  username,
}: IList): Promise<IList[] | []> {
  console.log(listName, username)
  try {
    const birdies = await lists
      .find({ listName, username })
      .project({
        birdIds: 1,
        _id: 0,
      })
      .toArray()
    console.log(birdies)
    return birdies
  } catch (error) {
    console.error(getListBirdIds.name, error)
    return []
  }
}

interface IGetListItems extends IList {
  page: number
  perPage: number
}
export async function getListItems({
  listName,
  username,
  page = 1,
  perPage = 10,
}: IGetListItems): Promise<IList[] | null> {
  try {
    const listItems = await lists?.aggregate([
      {
        $match: {
          username,
          listName,
        },
      },
      {
        $lookup: {
          from: 'taxonomies',
          localField: 'birdIds',
          foreignField: '_id',
          as: 'birds',
        },
      },
      {
        $project: {
          _id: 0,
          birds: 1,
        },
      },

      {
        $match: {
          'birds.taxonomyName': {
            $ne: '',
          },
        },
      },
      {
        $match: {
          'birds.category': new RegExp('species', 'i'),
        },
      },
      {
        $sort: {
          'birds.taxonomyName': 1,
        },
      },
      {
        $limit: 15,
      },
      {
        $skip: perPage * page,
      },
    ])
    console.log(await listItems.toArray())

    const temp = (await listItems.toArray()) as IList[]
    return temp
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
  taxonomyId: string
  listName: string
  username: string
}
export async function createListItem(param: IAddItem): Promise<boolean> {
  const { username, listName, taxonomyId } = param
  try {
    const isAdd = await lists.updateOne(
      { username, listName },
      { $push: { birdIds: taxonomyId } }
    )
    if (isAdd.upsertedId) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}
