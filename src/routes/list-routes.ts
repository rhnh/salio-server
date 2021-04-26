import { Router } from "express";
import { addListCtrl } from "./list-controllers";
import { body } from "express-validator";
import { verifyUser } from "../utils/user-manager";

export const listRouter = Router();

listRouter.post(
  "/new",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("listName").not().isEmpty().trim().isLength({ min: 3 }),
  verifyUser,
  addListCtrl
);
