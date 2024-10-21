import type { MiddlewareHandler, SSEventStream } from "hyper-express";

//until https://github.com/kartikk221/hyper-express/pull/317 is merged
declare module "hyper-express" {
    interface Response {
        get sse(): SSEventStream | undefined
    }
    interface SSEventStream {
        id?: string | undefined
    }
    // just a type rename
    type Handler = MiddlewareHandler
}
