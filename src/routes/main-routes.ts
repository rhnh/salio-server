import { Router } from "express";
import { MainController } from "./main-controllers";

export const MainRouter = Router();

MainRouter.get("/", MainController);
MainRouter.post("/", MainController);
