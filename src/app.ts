import express from "express";
import { Application } from "express";
import * as routes from "./routes";
import { setup } from "./setup";

export const app: Application = express();
setup(app);

//Routers
app.use("/user", routes.userRouter);
app.use("/taxonomy", routes.taxonomyRouter);
app.use("/lists", routes.listRouter);
app.use("/users", routes.userRouter);
