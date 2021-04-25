import { Router } from "express";
import { listRouter } from "./list-routes";
import { MainRouter } from "./main-routes";
import { taxonomyRouter } from "./taxonomy-routes";
import { userRouter } from "./user-routes";

export const AppRouter = Router();

AppRouter.use("/", MainRouter);
AppRouter.use("/lists", listRouter);
AppRouter.use("/items", taxonomyRouter);
AppRouter.use("/users", userRouter);
