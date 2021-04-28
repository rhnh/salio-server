import cors from 'cors'
import express from 'express'
import { Application, Response } from 'express'
import path from 'path'
import { setup } from './setup'

export const app: Application = express()
app.use(express.static(path.join(__dirname, 'build')))
const allowedOrigins = ['http://localhost:3000']

const options: cors.CorsOptions = {
  origin: allowedOrigins,
}

app.use(cors(options))
app.get('/', (_, res: Response) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

setup(app)
