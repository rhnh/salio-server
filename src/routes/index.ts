import { Router } from 'express'
import { appCors } from '../utils/cors'

import { listRouter } from './list-routes'
import { MainRouter } from './main-routes'
import { taxonomyRouter } from './taxonomy-routes'
import { userRouter } from './user-routes'

export const AppRouter = Router()
AppRouter.options('*', appCors, (_, res) => {
  res.status(200)
})

AppRouter.use('/', MainRouter)
AppRouter.use('/lists', listRouter)
AppRouter.use('/items', taxonomyRouter)
AppRouter.use('/users', userRouter)
