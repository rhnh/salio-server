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

export async function getListUserListName({
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
export async function getListByUserListName({
  listName,
  username,
}: IList): Promise<IList | null> {
  try {
    const result = await lists.findOne({ username, listName })
    return result
  } catch (error) {
    return error
  }
}
interface IListProjection {
  username?: number
  _id?: number
  listName?: number
  birdIds?: number
}
export async function getLists(
  list: IList,
  project?: IListProjection
): Promise<IList[] | null> {
  try {
    let hasList
    if (project)
      hasList = await lists.find(lists, { projection: { ...project } })
    else hasList = await lists.find(list)
    return hasList.toArray()
  } catch (error) {
    return null
  }
}

export async function getListItemIds({
  listName,
  username,
}: IList): Promise<IList[] | null> {
  try {
    const { birdIds } = await lists.findOne(
      { username, listName },
      {
        projection: { birdIds: 1, _id: 0 },
      }
    )
    return birdIds
  } catch (error) {
    return error
  }
}
export async function getListItems({
  listName,
  username,
}: IList): Promise<IList[] | null> {
  try {
    const listItems = await lists.aggregate([
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
          _id: 1,
          username: 1,
          listName: 1,
          birds: 1,
        },
      },
    ])
    return listItems.toArray()
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
