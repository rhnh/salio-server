import { Request, Response } from 'express'
import { INotifications } from './types'
import * as models from './models'
import { IUser } from 'types'

export async function addNotificationCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { message, audience, isActive, messageType, time } = req.body
  const n: INotifications = {
    message,
    audience,
    isActive,
    messageType,
    time,
  } as INotifications
  try {
    const result = await models.addNotification(n)
    if (result) {
      return res
        .status(200)
        .json({ message: 'You have successfully added', done: true })
    } else {
      return res.status(400).json({ done: false, message: 'Please try again!' })
    }
  } catch (error) {
    return res.status(500).json({
      message: `${addNotificationCtrl.name} has errored!`,
      done: false,
    })
  }
}

export async function getNotificationsCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { role } = req.user as IUser
  if (role === 'user' || role === undefined) {
    return res.status(409).json({
      message: 'you are not authorized',
    })
  }
  try {
    const ns = await models.getNotifications()
    return res.status(200).json(ns)
  } catch (error) {
    return res.status(500).json({
      message: getNotificationsCtrl.name,
    })
  }
}

export async function setActiveByIdCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { role } = req.user as IUser
  const { id } = req.params

  if (role === 'user' || role === undefined) {
    return res.status(409).json({
      message: 'you are not authorized',
    })
  }
  try {
    const done = await models.setActiveById(id, true)
    if (done) {
      return res.status(200).json({ message: 'has been successfully added' })
    }
    return res.status(400).json({
      message: 'Please retry',
      done: false,
    })
  } catch (error) {
    return res.status(500).json(setActiveByIdCtrl.name)
  }
}

export async function getByIdCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { role } = req.user as IUser
  const { id } = req.params
  if (role === 'user' || role === undefined) {
    return res.status(409).json({
      message: 'you are not authorized',
    })
  }
  try {
    const ns = await models.getById(id)
    if (ns) {
      return res.status(200).json({ ns })
    }
    return res.status(400).json({ message: 'Please try again!' })
  } catch (error) {
    return res.status(500).json({
      message: getNotificationsCtrl.name,
    })
  }
}
export async function getActiveCtrl(
  _: Request,
  res: Response
): Promise<Response> {
  try {
    const ns = await models.getActive()
    if (ns) {
      return res.status(200).json(ns)
    }
    return res.status(400).json({ message: 'Please try again!' })
  } catch (error) {
    return res.status(500).json({
      message: getNotificationsCtrl.name,
    })
  }
}

export async function deleteByIdCtrl(
  req: Request,
  res: Response
): Promise<Response> {
  const { role } = req.user as IUser
  const { id } = req.params
  if (role === 'user' || role === undefined) {
    return res.status(409).json({
      message: 'you are not authorized',
    })
  }
  try {
    const ns = await models.deleteById(id)
    if (ns) {
      return res.status(200).json({ ns })
    }
    return res.status(400).json({ message: 'Please try again!' })
  } catch (error) {
    return res.status(500).json({
      message: getNotificationsCtrl.name,
    })
  }
}
