import "./env.js"
import { AppDataSource } from "./database.js"
import { Response, Server } from "hyper-express"
import { router } from "./router.js"
import { env } from "./env.js"
import { renderToStream } from "@kitajs/html/suspense"

Response.prototype.render = function (jsx) {
    this.header("Content-Type", "text/html; charset=utf-8")
    return renderToStream(jsx).pipe(this)
}
Response.prototype.hxRedirect = function (url) {
    this.status(302)
    this.header("HX-Location", url)
    return this.end()
}

await AppDataSource.initialize()
const app = new Server()

app.use(router)

await app
    .listen(env.PORT)
    .then(() => console.log("Server started on port", env.PORT))
    .catch(() => console.error("Failed to start server on port", env.PORT))
