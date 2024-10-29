import type { PropsWithChildren } from "@kitajs/html"
import { UserInfo } from "../auth/user-info.js"
import type { Request } from "hyper-express"
import { env } from "~/env.js"

export function ApplicationLayout(
    props: PropsWithChildren<{
        req: Request
        title: string
    }>,
) {
    return (
        <>
            {"<!DOCTYPE html/>"}
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <title>{props.title}</title>
                    <script src="/assets/scripts/htmx.js" />
                    {env.NODE_ENV === "development" ? (
                        <script async src="/assets/scripts/live-reload.js" />
                    ) : null}
                    <link rel="stylesheet" href="/assets/styles/globals.css" />
                </head>
                <body
                    hx-boost="true"
                    hx-ext="json-enc-custom, response-targets"
                    data-theme="nord"
                >
                    <header class="flex items-center justify-end min-h-12 px-4 w-full bg-neutral">
                        <nav></nav>
                        <UserInfo req={props.req} />
                    </header>
                    {props.children}
                </body>
            </html>
        </>
    )
}
