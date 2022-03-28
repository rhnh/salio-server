// import cors from 'cors'
import express, { Application, Response, ErrorRequestHandler } from 'express'

import path from 'path'

import { setup } from './settings'
// import { allowedOrigins } from './utils/configs'

export const app: Application = express()

app.use(express.static(path.join(__dirname, 'build')))
app.disable('etag') //removes response 304

// app.use(cors(allowedOrigins))
// app.get('/', (_, res: Response) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): Response | void | any => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    console.error(err, 'Error')
    next(err)
  }
}

app.use(errorHandler as ErrorRequestHandler)

setup(app)
