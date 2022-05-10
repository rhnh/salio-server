import { IBaseModel } from 'types'

export interface IPost extends IBaseModel {
  title: string
  body: string
  image_url: string
  username: string
  featured: boolean
}
