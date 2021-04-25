import { Application } from "express";
import helmet from "helmet";
import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { AppRouter } from "./routes";
import errorHandler from "errorhandler";

export function setup(app: Application): void {
  app.use(helmet());
  app.use(cors());

  app.use(morgan("tiny"));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  //Routers
  app.use("/", AppRouter);

  app.use("/status", express.static("build"));
  app.use("/", express.static("build"));

  process.env.NODE_ENV && process.env.NODE_ENV === "development"
    ? app.use(errorHandler)
    : "";
}
