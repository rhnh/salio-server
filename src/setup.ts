import { Application } from "express";
import helmet from "helmet";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import errorHandler from "errorhandler";

export function setup(app: Application): void {
  app.use(helmet());
  app.use(cors());

  app.use(morgan("tiny"));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  process.env.NODE_ENV && process.env.NODE_ENV === "development"
    ? app.use(errorHandler)
    : "";
}
