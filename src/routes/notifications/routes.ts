import { Router } from 'express'
import { body, param } from 'express-validator'
import { asyncFn } from 'utils/helpers'
import { verifyUser } from 'utils/user-manager'
import * as controllers from './controllers'

export const notificationsRouter = Router()

/**
 * get all notifications, if the users is admin or mode
 */
notificationsRouter.get(
  '/',
  verifyUser,
  asyncFn(controllers.getNotificationsCtrl)
)

/**
 * add new Notification
 */
notificationsRouter.post(
  '/notification',
  body('message').notEmpty().trim(),
  body('audience').notEmpty().trim(),
  body('messageType').notEmpty().trim(),
  body('time').notEmpty().trim(),
  verifyUser,
  asyncFn(controllers.addNotificationCtrl)
)

/**
 * update by Id
 */
notificationsRouter.put(
  '/notification/:id',
  param('id').notEmpty().trim(),
  body('active').notEmpty(),
  verifyUser,
  asyncFn(controllers.setActiveByIdCtrl)
)

/**
 * get by Id
 */

notificationsRouter.get(
  '/notification/:id',
  param('id').notEmpty().trim(),
  verifyUser,
  asyncFn(controllers.getByIdCtrl)
)

notificationsRouter.get('/active', asyncFn(controllers.getActiveCtrl))

/**
 * delete by id
 */
notificationsRouter.delete(
  '/notification/:id',
  param('id').notEmpty().trim(),
  verifyUser,
  asyncFn(controllers.delNotificationByIdCtrl)
)
