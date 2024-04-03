import { IRequest } from './types'

export type CorsOptions = {
  credentials?: true
  origin?: boolean | string | string[] | RegExp | ((origin: string) => string | void)
  maxAge?: number
  allowMethods?: string | string[]
  allowHeaders?: any
  exposeHeaders?: string | string[]
}

export type Preflight = (request: IRequest) => Response | void
export type Corsify = (response: Response, request?: IRequest) => Response

export type CorsPair = {
  preflight: Preflight
  corsify: Corsify
}

// Create CORS function with default options.
export const cors = (options: CorsOptions = {}) => {
  // Destructure and set defaults for options.
  const {
    origin = '*',
    credentials = false,
    allowMethods = '*',
    allowHeaders,
    exposeHeaders,
    maxAge,
  } = options

  // create generic CORS headers
  const corsHeaders = {
    // @ts-expect-error
    'access-control-expose-headers': exposeHeaders?.join?.(',') ?? exposeHeaders, // include allowed headers
    // @ts-expect-error
    'access-control-allow-methods': allowMethods?.join?.(',') ?? allowMethods,  // include allowed methods
    'access-control-max-age': maxAge,
    'access-control-allow-credentials': credentials,
  }

  const getAccessControlOrigin = (request?: Request): string => {
    const requestOrigin = request?.headers.get('origin') // may be null if no request passed

    // @ts-expect-error
    if (origin === true) return requestOrigin
    // @ts-expect-error
    if (origin instanceof RegExp) return origin.test(requestOrigin) ? requestOrigin : undefined
    // @ts-expect-error
    if (Array.isArray(origin)) return origin.includes(requestOrigin) ? requestOrigin : undefined
    // @ts-expect-error
    if (origin instanceof Function) return origin(requestOrigin)

    // @ts-expect-error
    return origin == '*' && credentials
    ? requestOrigin
    : origin
  }

  const appendHeadersAndReturn = (response: Response, headers: Record<string, any>) => {
    for (const [key, value] of Object.entries(headers)) {
      if (value) response.headers.append(key, value)
    }
    return response
  }

  const preflight = (request: Request) => {
    if (request.method == 'OPTIONS') {
      const response = new Response(null, { status: 204 })

      return appendHeadersAndReturn(response, {
        'access-control-allow-origin': getAccessControlOrigin(request),
        'access-control-allow-headers': allowHeaders?.join?.(',') ?? allowHeaders ?? request.headers.get('access-control-request-headers'), // include allowed headers
        ...corsHeaders,
      })
    } // otherwise ignore
  }

  const corsify = (response: Response, request?: Request) => {
    // ignore if already has CORS headers
    if (
      response?.headers?.get('access-control-allow-origin')
      || response.status == 101
    ) return response

    // clone the response
    // response = response.clone()

    // const origin = getAccessControlOrigin(request)
    // if (origin) response.headers.append('access-control-allow-origin', origin)

    // for (const [key, value] of Object.entries(corsHeaders)) {
    //   if (value) response.headers.append(key, value)
    // }
    return appendHeadersAndReturn(response, {
      'access-control-allow-origin': getAccessControlOrigin(request),
      ...corsHeaders
    })
  }

  // Return corsify and preflight methods.
  return { corsify, preflight }
}
