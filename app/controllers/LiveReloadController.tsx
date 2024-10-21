import { env } from "~/env.js"
import type { Handler } from "./types.js"
import { Readable } from "node:stream"

export class LiveReloadController {
    feed: Handler = (_req, res) => {
        if (env.NODE_ENV !== "development")
            return res.status(404).send("Not Found")

        res.setHeader("Content-Type", "text/event-stream")

        return createReadableStream().pipe(res)
    }
}

function delay(ms: number, { persistent = true } = {}) {
    return new Promise((resolve) => setTimeout(resolve, ms, persistent))
}

async function* streamEvents() {
    yield "event: refresh\n"
    yield "data: refresh\n"
    yield "\n\n"

    while (true) {
        await delay(30000, { persistent: false })
        yield "event: ping\n"
        yield "data: ping\n"
        yield "\n\n"
    }
}

function createReadableStream() {
    const readable = new Readable({
        async read() {
            for await (const chunk of streamEvents()) {
                // Push the chunk to the stream
                this.push(chunk)
            }
        },
    })
    return readable
}
