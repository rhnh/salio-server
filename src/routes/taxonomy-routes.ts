import { Router } from 'express'
import { asyncFn } from '../utils/helpers'
import { verifyUser } from '../utils/user-manager'
import { getTaxonomiesCTRL } from './taxonomy-controllers'

export const taxonomyRouter = Router()

taxonomyRouter.post('/', verifyUser, asyncFn(getTaxonomiesCTRL))
