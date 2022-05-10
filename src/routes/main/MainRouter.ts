import { Router } from 'express'
import { MainController } from './Main'

export const MainRouter = Router()

MainRouter.get('/', MainController)
MainRouter.post('/', MainController)
