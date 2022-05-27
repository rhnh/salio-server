import { IBaseModel } from 'types'

/**
 * Every user creates a list to add birds
 * @public
 */
export interface IList extends IBaseModel {
  username: string
  listName: string
  birds?: string[]
  slug?: string
}

export interface IListTaxonomy {
  birds: [
    {
      birdId: string
      createdAt: string
    }
  ]
}
