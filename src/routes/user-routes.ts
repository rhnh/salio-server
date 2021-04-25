import { Router } from "express";
import { asyncFn } from "../utils/helpers";
import { registerUser } from "./user-controllers";
import { body } from "express-validator";
import passport from "passport";
import { httpStatus } from "../types";
import { createAccountLimiter } from "../utils/basic-manager";

export const userRouter = Router();

userRouter.post(
  "/signup",
  createAccountLimiter,
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("password").not().isEmpty().trim().isLength({ min: 3 }),

  asyncFn(registerUser)
);

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.user) {
    return res.sendStatus(200).send("nice");
  }
  return res.sendStatus(httpStatus.badRequest).json({
    failed: true,
  });
});
