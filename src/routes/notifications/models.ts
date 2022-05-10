import { Collection, ObjectID } from 'mongodb'

import { INotifications } from './types'

let notifications: Collection

export function setNotifications(c: Collection): void {
  notifications = c
}

export async function addNotification(prop: INotifications): Promise<boolean> {
  try {
    try {
      if (prop.isActive)
        await notifications.updateMany({}, { $set: { isActive: false } })
    } catch (err) {
      return false
    }
    const n: INotifications = {
      ...prop,
      createdAt: Date.now(),
    }

    const newNot = await notifications.insertOne(n)
    return newNot.result.n === 1
  } catch (error) {
    return false
  }
}

export async function setActiveById(
  id: string,
  isActive: boolean
): Promise<boolean> {
  try {
    await notifications.updateMany({}, { $set: { isActive: false } })
    const update = await notifications.updateOne(
      {
        _id: new ObjectID(id),
      },
      {
        $set: {
          isActive,
        },
      }
    )
    return update.result.n === 1
  } catch (error) {
    throw new Error(setActiveById.name)
  }
}

export async function getNotifications(): Promise<INotifications[]> {
  try {
    const n = await notifications.find({}).sort({
      createdAt: 1,
    })
    return await n.toArray()
  } catch (error) {
    throw new Error(getNotifications.name)
  }
}

export async function getById(id: string): Promise<INotifications | null> {
  try {
    const i = await notifications.findOne<INotifications>({
      _id: new ObjectID(id),
    })
    return i
  } catch (error) {
    throw new Error(`Notifications ${getById.name}`)
  }
}
export async function getActive(): Promise<INotifications | null> {
  try {
    const i = await notifications.findOne<INotifications>({
      isActive: true,
    })
    return i
  } catch (error) {
    throw new Error(`Notifications ${getById.name}`)
  }
}
export async function deleteById(id: string): Promise<boolean> {
  try {
    const i = await notifications.deleteOne({
      _id: new ObjectID(id),
    })
    return i.deletedCount === 1
  } catch (error) {
    throw new Error(`Notifications ${deleteById.name}`)
  }
}
