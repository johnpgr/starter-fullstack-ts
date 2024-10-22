import * as jose from "jose"
import { sha256 } from "@oslojs/crypto/sha2"
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from "@oslojs/encoding"
import { config } from "~/config.js"
import { Session } from "~/models/Session.js"
import type { User } from "~/models/User.js"
import { env } from "~/env.js"

export type RefreshToken = string
export type AccessToken = string

const enum SessionTokenError {
    NotFound = "SessionTokenError.NotFound",
    Expired = "SessionTokenError.Expired",
}

export class ValidateSessionTokenError extends Error {
    private constructor(public kind: SessionTokenError) {
        super(kind)
    }

    static NotFound = () =>
        new ValidateSessionTokenError(SessionTokenError.NotFound)
    static Expired = () =>
        new ValidateSessionTokenError(SessionTokenError.Expired)
}

export namespace AuthHelper {
    const encoder = new TextEncoder()

    function generateSessionToken(): string {
        return encodeBase32LowerCaseNoPadding(
            encoder.encode(crypto.randomUUID()),
        )
    }

    export async function createSession(args: {
        user: User
        userAgent: string
        ip: string
    }): Promise<Session> {
        const sessionToken = generateSessionToken()

        const sessionId = encodeHexLowerCase(
            sha256(encoder.encode(sessionToken)),
        )

        const session = new Session()
        session.id = sessionId
        session.user = args.user
        session.userAgent = args.userAgent
        session.ip = args.ip
        session.expiresAt = new Date(Date.now() + config.sessionTimeout)
        await session.save()

        return session
    }

    export async function createTokens(
        session: Session,
    ): Promise<[AccessToken, RefreshToken]> {
        const accessToken = new jose.EncryptJWT({
            sessionToken: session.id,
            userId: session.user.id,
        })
            .setProtectedHeader({
                alg: "dir",
                enc: "A128CBC-HS256",
            })
            .setIssuedAt()
            .setExpirationTime("1d")
            .encrypt(jose.base64url.decode(env.JWT_SECRET))

        const refreshToken = new jose.EncryptJWT({
            sessionToken: session.id,
        })
            .setProtectedHeader({
                alg: "dir",
                enc: "A128CBC-HS256",
            })
            .setIssuedAt()
            .setExpirationTime("7d")
            .encrypt(jose.base64url.decode(env.JWT_SECRET))

        return await Promise.all([accessToken, refreshToken])
    }

    export async function validateSessionToken(
        accessToken: string,
    ): Promise<Session | ValidateSessionTokenError> {
        const token = await jose.jwtDecrypt(
            accessToken,
            jose.base64url.decode(env.JWT_SECRET),
        )
        const sessionId = token.payload.sessionToken as string

        const session = await Session.findOneBy({
            id: sessionId,
        })

        if (!session) {
            return ValidateSessionTokenError.NotFound()
        }

        if (Date.now() >= session.expiresAt.getTime()) {
            await session.remove()
            return ValidateSessionTokenError.Expired()
        }

        return session
    }
}
