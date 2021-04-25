import { Router } from "express";
import { listRouter } from "./list-routes";
import { taxonomyRouter } from "./taxonomy-routes";
import { userRouter } from "./user-routes";

export const AppRouter = Router();

AppRouter.use("/lists", listRouter);
AppRouter.use("/items", taxonomyRouter);
AppRouter.use("/users", userRouter);
