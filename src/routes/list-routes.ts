import { Router } from "express";
import { addListCtrl } from "./list-controllers";
import { body } from "express-validator";

export const listRouter = Router();

listRouter.post(
  "/add",
  body("username").not().isEmpty().trim().isLength({ min: 3 }),
  body("listName").not().isEmpty().trim().isLength({ min: 3 }),
  addListCtrl
);
