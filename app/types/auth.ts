import type { tags } from "typia"

export interface SignupBody {
    email: string & tags.Format<"email">
    username: string & tags.Pattern<"^[a-zA-Z0-9_]{3,16}$">
    password: string & tags.Format<"password">
}

export interface SigninBody {
    sub: string
    password: string
}
