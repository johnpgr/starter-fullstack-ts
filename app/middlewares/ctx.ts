import type { MiddlewareHandler } from "hyper-express"
import { AuthHelper, ValidateSessionTokenError } from "../helpers/AuthHelper.js"
import { Context } from "../context.js"

//BUG: if you do an async function here it will bug and crash the app
//Because of write after response end
export const ctx: MiddlewareHandler = (req, _res, next) => {
    const ctx = Context.bind(req)

    const sessionToken = req.cookies.sessionToken
    if (!sessionToken) return next()

    return AuthHelper.validateSessionToken(sessionToken)
        .then((result) => {
            if (result instanceof ValidateSessionTokenError) {
                return next()
            }
            ctx.session = result
            next()
        })
        .catch((e) => {
            console.error(e)
            next()
        })
}
