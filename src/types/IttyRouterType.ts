import { GenericTraps } from './GenericTraps'
import { IRequest } from './IRequest'
import { RequestLike } from './RequestLike'
import { Route } from './Route'
import { RouteEntry } from './RouteEntry'
import { CustomRoutes } from './CustomRoutes'

export type IttyRouterType<
  R = IRequest,
  A extends any[] = any[],
  ResponseType = any,
  GlobalRequestType = R,
> = {
  __proto__: IttyRouterType<R>
  routes: RouteEntry[]
  fetch: <Args extends any[] = A>(request: RequestLike, ...extra: Args) => Promise<ResponseType>
  all: Route<GlobalRequestType, A>
  delete: Route<GlobalRequestType, A>
  get: Route<GlobalRequestType, A>
  head: Route<GlobalRequestType, A>
  options: Route<GlobalRequestType, A>
  patch: Route<GlobalRequestType, A>
  post: Route<GlobalRequestType, A>
  put: Route<GlobalRequestType, A>
} & CustomRoutes<Route<GlobalRequestType, A>> & GenericTraps
