import { is } from "typia"

export interface Env {
    NODE_ENV: "development" | "production" | "debug" | "test"
    PORT: string
    JWT_SECRET: string
}

function parseEnv(values: Record<string, any>) {
    if (!is<Env>(values)) {
        console.error(values)
        throw new Error("Invalid environment variables")
    }

    return values
}

export const env = parseEnv(process.env)
