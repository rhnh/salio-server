import { IBaseModel } from 'types'

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

export interface IListTaxonomy {
  birdIds: [
    {
      birdId: string
      createdAt: string
    }
  ]
}
