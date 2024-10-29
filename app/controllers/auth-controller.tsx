import { is } from "typia"
import { User } from "~/models/user.js"
import { hash, verify } from "@node-rs/argon2"
import { config } from "~/config.js"
import { hxRedirect, render } from "../utils/response.js"
import { AuthHelper } from "~/helpers/auth-helper.js"
import { SigninPage } from "~/views/auth/signin-page.js"
import { SignupPage } from "~/views/auth/signup-page.js"
import type { Request, Response } from "hyper-express"
import type { SigninBody, SignupBody } from "~/types/auth.js"
import { BaseController } from "./base-controller.js"

export class AuthController extends BaseController {
    constructor() {
        super()

        this.router.get("/signup", this.showSignup)
        this.router.get("/signin", this.showSignin)
        this.router.post("/signup", this.handleSignup)
        this.router.post("/signin", this.handleSignin)
        this.router.post("/signout", this.handleSignout)
    }

    showSignup(req: Request, res: Response) {
        return render(res, <SignupPage req={req} />)
    }

    showSignin(req: Request, res: Response) {
        return render(res, <SigninPage req={req} />)
    }

    async handleSignup(req: Request, res: Response) {
        const body = await req.json()
        if (!is<SignupBody>(body)) {
            return res.status(400).send("Invalid request body")
        }

        const exists = await User.findOne({
            where: [{ email: body.email }, { name: body.username }],
        })

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
            path: "/",
            maxAge: config.accessTokenExp,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        res.cookie("refresh_token", refreshToken, config.refreshTokenExp, {
            path: "/",
            maxAge: config.refreshTokenExp,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        return hxRedirect(res, "/")
    }

    async handleSignin(req: Request, res: Response) {
        const body = await req.json()
        if (!is<SigninBody>(body)) {
            return res.status(400).send("Invalid request body")
        }

        const user = await User.findOne({
            where: [{ email: body.sub }, { name: body.sub }],
        })

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
            path: "/",
            maxAge: config.accessTokenExp / 1000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        res.cookie("refresh_token", refreshToken, config.refreshTokenExp, {
            path: "/",
            maxAge: config.refreshTokenExp / 1000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        return hxRedirect(res, "/")
    }

    async handleSignout(req: Request, res: Response) {
        const accessToken = req.cookies["access_token"]
        const refreshToken = req.cookies["refresh_token"]

        if (accessToken) {
        }
    }
}
