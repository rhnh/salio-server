import cors from 'cors'
import express from 'express'
import { Application, Response } from 'express'
import path from 'path'
import { setup } from './setup'

export const app: Application = express()
app.use(express.static(path.join(__dirname, 'build')))
const allowedOrigins = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(allowedOrigins))
app.get('/', (_, res: Response) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

setup(app)
