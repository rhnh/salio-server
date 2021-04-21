import { config } from "dotenv";
config();
export const TEST_URI: string = process.env.TEST_URI
  ? process.env.TEST_URI
  : "mongodb://localhost:27017/testSalio";

export const TEST_DB_NAME: string = process.env.TEST_DB_NAME
  ? process.env.TEST_DB_NAME
  : "testSalio";

export const URI: string = process.env.URI
  ? process.env.URI
  : "mongodb://localhost:27017";

export const DB_NAME: string = process.env.TEST_DB_NAME
  ? process.env.TEST_DB_NAME
  : "salio";

export const SITE_NAME: string = process.env.SITE_NAME
  ? process.env.SITE_NAME
  : "salio";

export const DB_PORT: number = process.env.DB_PORT
  ? Number(process.env.DB_PORT)
  : 9090;
