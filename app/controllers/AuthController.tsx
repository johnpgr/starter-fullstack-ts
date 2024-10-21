import { is, tags } from "typia"
import type { Handler } from "./types.js"
import { QueryBuilder } from "~/database.js"
import { User } from "~/models/User.js"
import { hash, verify } from "@node-rs/argon2"
import { config } from "~/config.js"
import { render } from "./utils.js"
import { AuthHelper } from "~/helpers/AuthHelper.js"
import { SigninPage } from "~/views/auth/SigninPage.js"
import { SignupPage } from "~/views/auth/SignupPage.js"

export class AuthController {
    showSignup: Handler = (req, res) => render(res, <SignupPage req={req} />)
    showSignin: Handler = (req, res) => render(res, <SigninPage req={req} />)

    handleSignup: Handler = async (req, res) => {
        type SignupBody = {
            email: string & tags.Format<"email">
            username: string & tags.Pattern<"^[a-zA-Z0-9_]{3,16}$">
            password: string & tags.Format<"password">
        }

        const body = await req.json()
        if (!is<SignupBody>(body)) {
            return res.status(400).send("Invalid request body")
        }

        const exists = await QueryBuilder.select("user")
            .where("user.email = :email OR user.username = :username", {
                username: body.username,
                email: body.email,
            })
            .from(User, "user")
            .getOne()

        if (exists) {
            return res.status(409).send("User already exists")
        }
        const user = new User()
        user.email = body.email
        user.name = body.username
        user.hashedPassword = await hash(body.password)
        await user.save()

        const ip = req.ip || req.headers["x-forwarded-for"]
        const userAgent = req.headers["user-agent"]
        if (!ip || !userAgent) {
            return res.status(400).send("Invalid request")
        }

        const session = await AuthHelper.createSession({
            user,
            ip: ip,
            userAgent: userAgent,
        })

        const [accessToken, refreshToken] =
            await AuthHelper.createTokens(session)

        res.cookie("access_token", accessToken, config.accessTokenExp, {
            maxAge: config.accessTokenExp,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        res.cookie("refresh_token", refreshToken, config.refreshTokenExp, {
            maxAge: config.refreshTokenExp,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        return res.redirect("/")
    }

    handleSignin: Handler = async (req, res) => {
        type SigninBody = {
            usernameOrEmail: string
            password: string
        }

        const body = await req.json()
        if (!is<SigninBody>(body)) {
            return res.status(400).send("Invalid request body")
        }

        const user = await QueryBuilder.select("user")
            .where(
                "user.email = :usernameOrEmail OR user.name = :usernameOrEmail",
                { userNameOrEmail: body.usernameOrEmail },
            )
            .from(User, "user")
            .getOne()

        if (!user) {
            return res.status(400).send("Invalid credentials")
        }

        const valid = await verify(user.hashedPassword, body.password)

        if (!valid) {
            return res.status(400).send("Invalid credentials")
        }

        const ip = req.ip || req.headers["x-forwarded-for"]
        const userAgent = req.headers["user-agent"]
        if (!ip || !userAgent) {
            return res.status(400).send("Invalid request")
        }

        const session = await AuthHelper.createSession({
            user,
            ip: ip,
            userAgent: userAgent,
        })

        const [accessToken, refreshToken] =
            await AuthHelper.createTokens(session)

        res.cookie("access_token", accessToken, config.accessTokenExp, {
            maxAge: config.accessTokenExp,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        res.cookie("refresh_token", refreshToken, config.refreshTokenExp, {
            maxAge: config.refreshTokenExp,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        return res.redirect("/")
    }
}
