import { Collection } from "mongodb";
import { IList } from "../types";

let lists: Collection;

export function setList(collection: Collection): void {
  lists = collection;
}

export async function addList({ username, listName }: IList): Promise<boolean> {
  try {
    const newList = await lists.insertOne({ username, listName });
    return newList.result.n === 1;
  } catch (error) {
    return false;
  }
}

export async function findList({
  username,
  listName,
}: IList): Promise<IList | null> {
  try {
    const hasFoundList = await lists.findOne({ username, listName });
    return hasFoundList;
  } catch (error) {
    return null;
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
    );
    return hasUpdatedList.result.n === 1;
  } catch (error) {
    return false;
  }
}

export async function deleteList({
  listName,
  username,
}: IList): Promise<boolean> {
  try {
    const hasDeletedList = await lists.deleteOne({ username, listName });
    return hasDeletedList.result.n === 1;
  } catch (error) {
    return false;
  }
}
