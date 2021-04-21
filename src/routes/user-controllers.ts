import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { addUser, findUser } from "../models/user-models";
import { httpStatus } from "../utils/helpers";

export async function AddUserController(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const userTaken = await findUser({ username, password });
    if (userTaken) {
      return res.json({
        status: httpStatus.conflict,
        message: `User: ${username} already taken!`,
      });
    }
    const done = await addUser({ username, password });
    return done
      ? res.json({
          message: `You have successfully register`,
          done,
          status: httpStatus.ok,
        })
      : res.json({
          status: httpStatus.badRequest,
          message: "Something went wrong on server",
        });
  } catch (error) {
    res.json({ statusMessage: "something went wrong", statusCode: 505 });
  }
}
