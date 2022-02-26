import cors from 'cors'
import express, { Application, Response, ErrorRequestHandler } from 'express'

import path from 'path'

import { setup } from './settings'

export const app: Application = express()

app.use(express.static(path.join(__dirname, 'build')))
app.disable('etag') //removes response 304
const allowedOrigins = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(allowedOrigins))
app.get('/', (_, res: Response) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): Response | void | any => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    console.log(err, 'Error')
    next(err)
  }
}

app.use(errorHandler as ErrorRequestHandler)

setup(app)
