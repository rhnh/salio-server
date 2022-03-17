import { config } from 'dotenv'
config()
export const TEST_URI: string = process.env.TEST_URI
  ? process.env.TEST_URI
  : 'mongodb://localhost:27017?authSource=admin'

export const TEST_DB_NAME: string = process.env.TEST_DB_NAME
  ? process.env.TEST_DB_NAME
  : 'testSalio'

export const URI: string = process.env.URI
  ? process.env.URI
  : 'mongodb://localhost:27017?authSource=admin'

export const DB_NAME: string = process.env.TEST_DB_NAME
  ? process.env.TEST_DB_NAME
  : 'salio'

export const SITE_NAME: string = process.env.SITE_NAME
  ? process.env.SITE_NAME
  : 'salio'

export const PORT: number = process.env.PORT ? Number(process.env.PORT) : 9090

export const SECRET_TOKEN: string = process.env.SECRET_TOKEN
  ? process.env.SECRET_TOKEN
  : 'salioilasilasdfjlasdkjfklasldfklasdf'
