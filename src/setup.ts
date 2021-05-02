import { Application } from 'express'
import helmet from 'helmet'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
// import cors from 'cors'
import { AppRouter } from './routes'
import errorHandler from 'errorhandler'
import { authentication, authorization } from './utils/user-manager'
import passport from 'passport'
import cors from 'cors'
export function setup(app: Application): void {
  app.use(helmet())
  const allowedOrigins = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.use(cors(allowedOrigins))
  app.use(morgan('dev'))
  app.use(urlencoded({ extended: true }))
  app.use(json())
  authorization()
  authentication()
  app.use(passport.initialize())
  //Routers
  app.use('/', AppRouter)
  app.use(passport.initialize())

  app.use('/status', express.static('build'))
  app.use('/', express.static('build'))

  process.env.NODE_ENV && process.env.NODE_ENV === 'development'
    ? app.use(errorHandler)
    : ''
}
