import { GenericTraps } from './GenericTraps'

export type RequestLike = {
  method: string
  url: string
} & GenericTraps
