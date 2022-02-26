import { Router } from 'express'

import { listRouter } from './ListRoutes'
import { MainRouter } from './MainRouter'
import { postRouter } from './post-routes'
import { taxonomyRouter } from './TaxonomiesRouter'
import { userRouter } from './UserRouter'

export const AppRouter = Router()

AppRouter.use('/', MainRouter)
AppRouter.use('/lists', listRouter)
AppRouter.use('/taxonomies', taxonomyRouter)
AppRouter.use('/users', userRouter)
AppRouter.use('/posts', postRouter)
