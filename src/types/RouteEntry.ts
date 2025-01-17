import { IRequest } from './IRequest'
import { RequestHandler } from './RequestHandler'

export type RouteEntry<RequestType = IRequest, Args extends any[] = any[]> = [
  httpMethod: string,
  match: RegExp,
  handlers: RequestHandler<RequestType, Args>[],
  path?: string,
]
