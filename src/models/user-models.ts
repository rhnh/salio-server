import { Collection } from "mongodb";
import { IUser } from "../types";
let users: Collection;

export function setUser(collection: Collection): void {
  users = collection;
}

export async function addUser(user: IUser): Promise<boolean> {
  const { username, password } = user;
  try {
    const newUser = await users.insertOne({ username, password });
    return newUser.result.n === 1;
  } catch (error) {
    return false;
  }
}

export async function findUser(user: IUser): Promise<IUser | null> {
  try {
    const { username, password } = user;
    const isUser = await users.findOne({ username, password });
    return isUser || null;
  } catch (error) {
    return null;
  }
}
interface IChangeUserPassword extends IUser {
  newPassword: string;
}
export async function changeUserPassword(
  user: IChangeUserPassword
): Promise<boolean> {
  try {
    const { username, password, newPassword } = user;
    const hasPasswordChange = await users.updateOne(
      { username, password },
      { $set: { password: newPassword } }
    );
    return hasPasswordChange.result.n === 1;
  } catch (error) {
    return false;
  }
}
