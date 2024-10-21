import { env } from "~/env.js"
import type { Handler, SSEventStream } from "hyper-express"

export class LiveReloadController {
    private streams = new Map<string, SSEventStream>()

    private delay(ms: number, { persistent = true } = {}) {
        return new Promise((resolve) => setTimeout(resolve, ms, persistent))
    }

    async *streamEvents() {
        yield "event: refresh\n"
        yield "data: refresh\n"
        yield "\n\n"

        while (true) {
            await this.delay(30000, { persistent: false })
            yield "event: ping\n"
            yield "data: ping\n"
            yield "\n\n"
        }
    }

    feed: Handler = async (_req, res) => {
        if (env.NODE_ENV !== "development")
            return res.status(404).send("Not Found")

        if (res.sse) {
            res.sse.open()
            const id = crypto.randomUUID()
            res.sse.id = id
            this.streams.set(id, res.sse)
            for await (const event of this.streamEvents()) {
                if (!res.sse.active) break

                res.sse.send(event)
            }
            res.once("close", () => this.streams.delete(id))
        } else {
            res.status(400).send("SSE not supported")
        }
    }
}
