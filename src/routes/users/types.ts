import { IBaseModel } from 'types'

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
  avatar?: string
}
