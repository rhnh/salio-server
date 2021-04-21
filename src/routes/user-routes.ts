import { Router } from "express";
import { asyncFn } from "../utils/helpers";
import { AddUserController } from "./user-controllers";

export const userRouter = Router();

userRouter.post("/new", asyncFn(AddUserController));
