import { Collection, ObjectId } from 'mongodb'
import { purgeUserList } from 'routes/lists/models'
import { IUser } from 'types'

let users: Collection

export function setUsers(collection: Collection): void {
  users = collection
}

export async function addUser(user: IUser): Promise<boolean> {
  const { username, password } = user
  try {
    const newUser = await users.insertOne({
      username,
      password,
      role: 'user',
      createdAt: Date.now(),
    })
    return newUser.insertedId ? true : false
  } catch (error) {
    return false
  }
}

export async function findUserByUsername(
  username: string
): Promise<IUser | null> {
  try {
    const isUser = await users.findOne<IUser>({
      username,
    })
    return isUser || null
  } catch (error) {
    return null
  }
}

export async function setPrivilege(
  username: string,
  role: string
): Promise<boolean | null> {
  try {
    const isUser = await users.updateOne(
      {
        username,
      },
      {
        $set: { role },
      }
    )

    if (isUser.upsertedId) {
      return true
    }
    return false
  } catch (error) {
    return null
  }
}

export async function getAllUsers(): Promise<IUser[] | null> {
  try {
    const isUser = await users
      .find<IUser>(
        {},
        {
          projection: {
            password: 0,
          },
        }
      )
      .toArray()
    return isUser || null
  } catch (error) {
    return null
  }
}

export async function getUserProfile(username: string): Promise<IUser | null> {
  try {
    const user = await users
      .aggregate([
        { $match: { username } },
        {
          $lookup: {
            from: 'lists',
            localField: 'username',
            foreignField: 'username',
            as: 'listItems',
          },
        },
        { $project: { password: 0, 'lists.birds': 0, 'lists.username': 0 } },
        { $addFields: { totalLists: { $size: '$listItems' } } },
        { $project: { listItems: 0 } },
      ])
      .toArray()
    if (user.length === 1) {
      return user[0] as IUser
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}
export async function findUser(user: IUser): Promise<IUser | null> {
  try {
    const { username, password } = user

    const isUser = await users.findOne<IUser>(
      {
        username,
        password,
      },
      {
        projection: {
          password: 0,
        },
      }
    )
    return isUser || null
  } catch (error) {
    return null
  }
}
export async function findUserById(id: string): Promise<IUser | null> {
  try {
    const isUser = await users.findOne<IUser>(
      { _id: new ObjectId(id) },
      {
        projection: {
          password: 0,
        },
      }
    )
    return isUser || null
  } catch (error) {
    return null
  }
}
export async function deleteUserByUsername(
  username: string
): Promise<boolean | null> {
  try {
    const isUser = await users.deleteOne({ username })
    const UserList = await purgeUserList(username)
    if (isUser.deletedCount === 1 && UserList) {
      return true
    }

    return false
  } catch (error) {
    return null
  }
}
interface IChangeUserPassword extends IUser {
  newPassword: string
}
export async function changeUserPassword(
  user: IChangeUserPassword
): Promise<boolean> {
  try {
    const { username, password, newPassword } = user
    const hasPasswordChange = await users.updateOne(
      { username, password },
      { $set: { password: newPassword } }
    )
    return hasPasswordChange.upsertedId ? true : false
  } catch (error) {
    return false
  }
}

export async function changeAvatar(
  username: string,
  url: string
): Promise<boolean | null> {
  try {
    const isUser = await users.updateOne(
      {
        username,
      },
      {
        $set: { avatar: url },
      }
    )

    if (isUser.upsertedId) {
      return true
    }
    return false
  } catch (error) {
    return null
  }
}
