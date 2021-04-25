import { Router } from "express";
import { asyncFn } from "../utils/helpers";
import { isGuest, registerUser } from "./user-controllers";
import { body } from "express-validator";

export const userRouter = Router();

userRouter.post(
  "/new",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("password").not().isEmpty().trim().isLength({ min: 3 }),
  asyncFn(isGuest),
  asyncFn(registerUser)
);

userRouter.post(
  "/login",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("password").not().isEmpty().trim().isLength({ min: 3 })
);
