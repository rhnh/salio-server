import { Router } from "express";
import { asyncFn } from "../utils/helpers";
import { registerUser } from "./user-controllers";
import { body } from "express-validator";
import passport from "passport";

export const userRouter = Router();

userRouter.post(
  "/new",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("password").not().isEmpty().trim().isLength({ min: 3 }),
  asyncFn(registerUser)
);

userRouter.post(
  "/login",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("password").not().isEmpty().trim().isLength({ min: 3 }),
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);
