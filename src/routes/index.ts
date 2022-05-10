import { Router } from 'express'
import { MainRouter } from 'routes/main/MainRouter'
import { listRouter } from 'routes/lists/routes'
import { postRouter } from 'routes/posts/routes'
import { taxonomyRouter } from './taxonomies/router'
import { userRouter } from './users/routes'
import { notificationsRouter } from './notifications/routes'

export const AppRouter = Router()

AppRouter.use('/', MainRouter)
AppRouter.use('/lists', listRouter)
AppRouter.use('/taxonomies', taxonomyRouter)
AppRouter.use('/users', userRouter)
AppRouter.use('/posts', postRouter)
AppRouter.use('/notifications', notificationsRouter)
