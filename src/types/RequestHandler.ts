import { IRequest } from './IRequest'

export type RequestHandler<
  RequestType = IRequest,
  Args extends Array<any> = any[]
> = (request: RequestType, ...args: Args) => any
