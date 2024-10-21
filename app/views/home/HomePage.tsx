import type { Request } from "hyper-express"
import { ApplicationLayout } from "~/views/layouts/ApplicationLayout.js"

export function HomePage(props: { req: Request }) {
    return (
        <ApplicationLayout req={props.req} title="Home">
            <main>
                <h1>Hello World</h1>
            </main>
        </ApplicationLayout>
    )
}
