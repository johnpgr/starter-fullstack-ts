import type { PropsWithChildren } from "@kitajs/html"
import { UserInfo } from "../auth/UserInfo.js"
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
                    <script src="/assets/js/htmx.js"></script>
                    <script defer src="/assets/js/json-enc.js"></script>
                    <script defer src="/assets/js/response-targets.js"></script>
                    {env.NODE_ENV === "development" ? (
                        <script defer src="/assets/js/live-reload.js"></script>
                    ) : null}
                    <link rel="stylesheet" href="/assets/css/styles.css" />
                </head>
                <body hx-boost="true" hx-ext="json-enc, response-targets">
                    <header class="flex items-center justify-end min-h-12 px-4 w-full bg-primary-content">
                        <nav></nav>
                        <UserInfo req={props.req} />
                    </header>
                    {props.children}
                </body>
            </html>
        </>
    )
}
