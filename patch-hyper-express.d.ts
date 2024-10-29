import type { DefaultResponseLocals, MiddlewareHandler } from "hyper-express"

//until https://github.com/kartikk221/hyper-express/pull/317 is merged
declare module "hyper-express" {
    interface Response {
        get sse(): SSEventStream | undefined

        /**
         * Extend the Response object with a render method that takes JSX and returns a stream
         */
        render: (jsx: JSX.Element) => Response<DefaultResponseLocals>
        /**
         * Extend the Response object with a hxRedirect method that redirects the client
         */
        hxRedirect: (url: string) => Response<DefaultResponseLocals>
    }
    interface SSEventStream {
        id?: string | undefined
    }
    // just a type rename
    type Handler = MiddlewareHandler
}
