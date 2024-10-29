import type { MiddlewareHandler } from "hyper-express"
import {
    AuthHelper,
    ValidateSessionTokenError,
} from "../helpers/auth-helper.js"
import { Context } from "../context.js"

//BUG: if you do an async function here it will bug and crash the app
//Because of write after response end
export const ctx: MiddlewareHandler = (req, _res, next) => {
    const ctx = Context.bind(req)

    const accessToken = req.cookies["access_token"]
    const refreshToken = req.cookies["access_token"]

    if (!accessToken || !refreshToken) {
        next()
        return
    }

    AuthHelper.validateSessionToken(accessToken)
        .then((result) => {
            if (result instanceof ValidateSessionTokenError) {
                next()
                return
            }
            ctx.session = result
            next()
        })
        .catch((e) => {
            console.error(e)
            next()
        })
}
