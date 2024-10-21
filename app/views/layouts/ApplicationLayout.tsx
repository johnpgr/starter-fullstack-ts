import type { PropsWithChildren } from "@kitajs/html"
import { UserInfo } from "../auth/UserInfo.js"
import type { Request } from "hyper-express"

export function ApplicationLayout(
    props: PropsWithChildren<{
        head?: JSX.Element
        req: Request
        title?: string
    }>
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
                    <title>{props.title || "Hello World"}</title>
                    <script src="/assets/htmx.js"></script>
                    <script src="/assets/htmx-json-enc.js"></script>
                    {/* <script */}
                    {/*     src="https://unpkg.com/htmx.org@2.0.3" */}
                    {/*     integrity="sha384-0895/pl2MU10Hqc6jd4RvrthNlDiE9U1tWmX7WRESftEDRosgxNsQG/Ze9YMRzHq" */}
                    {/*     crossorigin="anonymous" */}
                    {/* ></script> */}
                    {/* <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script> */}
                    {props.head}
                </head>
                <body hx-ext="json-enc">
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
