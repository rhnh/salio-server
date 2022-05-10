import { IBaseModel } from 'types'
type MT = 'announcement' | 'info' | 'warning' | 'suggestion'
export type IAudience = 'mod' | 'user' | 'all' | 'unregistered'

export interface INotifications extends IBaseModel {
  message: string
  audience: IAudience
  isActive: boolean
  messageType: MT
  time: number
}
