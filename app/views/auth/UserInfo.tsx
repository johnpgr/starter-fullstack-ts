import type { Request } from "hyper-express"
import { Context } from "~/context.js"

export function UserInfo(props: { req: Request }) {
    const ctx = Context.get(props.req)
    const user = ctx.session?.user

    return (
        <div class="text-neutral-content">
            {user ? (
                <div class="flex gap-2 items-center">
                    <p>Hello, {user.name}</p>
                    <button
                        class="btn btn-sm btn-primary text-neutral-content"
                        hx-post="/api/auth/signout"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <div class="flex items-center gap-4">
                    <a href="/signin" class="btn btn-sm btn-primary text-neutral-content">
                        Sign In
                    </a>
                    <a href="/signup" class="btn btn-sm btn-primary text-neutral-content">
                        Sign Up
                    </a>
                </div>
            )}
        </div>
    )
}
