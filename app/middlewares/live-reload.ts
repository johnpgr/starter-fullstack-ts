import { env } from "~/env.js"
import type { MiddlewareHandler, SSEventStream } from "hyper-express"

const enum Event {
    Refresh = "refresh",
    Ping = "ping",
}

const streams = new Map<string, SSEventStream>()

const delay = (ms: number, { persistent = true } = {}) => {
    return new Promise((resolve) => setTimeout(resolve, ms, persistent))
}

async function* streamEvents() {
    yield Event.Refresh

    while (true) {
        await delay(30000, { persistent: false })
        yield Event.Ping
    }
}

export const liveReload: MiddlewareHandler = async (_req, res) => {
    if (env.NODE_ENV !== "development") return res.status(404).send("Not Found")

    if (res.sse) {
        res.sse.open()
        const id = crypto.randomUUID()
        res.sse.id = id
        streams.set(id, res.sse)
        for await (const event of streamEvents()) {
            if (!res.sse.active) break

            res.sse.send(event, event)
        }
        res.once("close", () => streams.delete(id))
    } else {
        res.status(400).send("SSE not supported")
    }
}
