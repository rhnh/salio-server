/**
 * Basic
 * @internal
 */

import { NextFunction } from 'express'

interface IBaseModel {
  _id?: string
  createAt?: Date
}

export type ICategories = 'species' | 'genus' | 'family' | 'order'
export type IGender = 'female' | 'male' | 'unknown'
/**
 * - A Taxonomy can be specified for either a species, genus, family , order or even a bird itself.
 * - By default every category's approved is false
 * The slug is optional because, cannot be only type of species
 * If the parent is null, it is of order
 * @public
 */
export interface ITaxonomy extends IBaseModel {
  englishName?: string // only species can have it.
  taxonomy: string // It is a must for species: It should container binomial name
  category: ICategories
  parent?: string
  approved: boolean
  username: string
  slug?: string
  image?: string
  info?: string
  sex?: IGender | undefined
  ancestors?: string[]
}

/**
 * Every user creates a list to add birds
 * @public
 */
export interface IList extends IBaseModel {
  username: string
  listName: string
  birdIds?: string[]
  slug?: string
}

export type Role = 'user' | 'mod' | 'admin'
/**
 * - Every User needs a username
 * - Every User needs a password
 * - role : admin | user | mod
 * @public
 */
export interface IUser extends IBaseModel {
  username: string
  password: string
  role?: Role | undefined
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

export interface IListTaxonomy {
  birdIds: [
    {
      birdId: string
      seenAt: string
    }
  ]
}

export interface IPost extends IBaseModel {
  title: string
  body: string
  image_url: string
  username: string
  featured: boolean
}
