import { IBaseModel } from 'types'

export type IRank = 'species' | 'genus' | 'family' | 'order'
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
  taxonomyName: string // It is a must. It should container binomial name.
  rank: IRank
  parent?: string
  approved: boolean
  username: string
  slug?: string
  image?: string
  info?: string
  sex?: IGender | undefined
  ancestors?: string[]
}

export function isRank(rank: IRank): rank is IRank {
  return (
    rank === 'family' ||
    rank === 'genus' ||
    rank === 'order' ||
    rank === 'species'
  )
}
