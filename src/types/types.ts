import { NextFunction, Request, Response } from 'express'

/**
 * Basic
 * @internal
 */
export interface IBaseModel {
  _id?: string
  createdAt?: number
}

export interface ISalioResponse<T> {
  message?: string
  methodName?: string
  done?: boolean
  data?: T | null | T[]
  error?: Error
}

export type MiddleWare = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Response | NextFunction | void

/**
 * Basic http status code
 * @public
 */
export enum httpStatus {
  ok = 200,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  error = 500,
}
export interface RHParams {
  code: httpStatus
  message: string
  status: boolean
}
