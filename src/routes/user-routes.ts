import { Router } from "express";
import { asyncFn } from "../utils/helpers";
import { AddUserController } from "./user-controllers";
import { body } from "express-validator";

export const userRouter = Router();

userRouter.post(
  "/new",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("password").not().isEmpty().trim().isLength({ min: 3 }),
  asyncFn(AddUserController)
);

userRouter.post(
  "/login",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("password").not().isEmpty().trim().isLength({ min: 3 })
);
