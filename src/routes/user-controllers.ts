import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { addUser, findUser } from "../models/user-models";
import { httpStatus } from "../types";
import { hashedPassword, isVerifiedToken } from "../utils/helpers";

export async function registerUser(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.password = hashedPassword(req.body.password);
    const { username, password } = req.body;
    const usernameTaken = await findUser({ username, password });
    if (usernameTaken) {
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

export const verifyUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { authorization } = req.headers || "";
  try {
    await isVerifiedToken(authorization);
    next();
  } catch (error) {
    res.json({ message: "Error: Cannot verify the token" });
  }
};

export const isGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { authorization } = req.headers || "";
  try {
    await isVerifiedToken(authorization);
    next();
  } catch (error) {
    res.json({ message: "Error: Cannot verify the token" });
  }
};
