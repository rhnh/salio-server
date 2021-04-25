import { Request, Response } from "express";
import { addList } from "../models/list-models";
import { httpStatus } from "../types";
export async function addListCtrl(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const { username, listName } = req.body;
    const hasList = await addList({ username, listName });
    if (hasList) {
      return res.json({
        message: `Successfully added ${listName}`,
        done: true,
      });
    }
    return res.json({
      message: `Something went wrong`,
      done: false,
      status: httpStatus.error,
    });
  } catch (error) {
    return res.json({
      status: httpStatus.badRequest,
      done: false,
    });
  }
}
