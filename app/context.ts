import type { Request } from "hyper-express"
import type { Session } from "./models/Session.js"
import { raise } from "./utils/raise.js"

export class Context {
    private static bindings = new WeakMap<Request, Context>()
    constructor(public session: Session | null = null) {}

    static bind(req: Request): Context {
        const ctx = new Context()
        Context.bindings.set(req, ctx)
        return ctx
    }

    static get(req: Request): Context {
        return (
            Context.bindings.get(req) ??
            raise("Context not bound for this request")
        )
    }
}
