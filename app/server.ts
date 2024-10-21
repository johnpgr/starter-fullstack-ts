import "./env.js"
import { AppDataSource } from "./database.js"
import { Server } from "hyper-express"
import { router } from "./router.js"
import { ctx } from "./middleware.js"

await AppDataSource.initialize()

await new Server()
    .use(ctx)
    .use("/", router)
    .listen(3000, (_socket) => console.log("Webserver started on port " + 3000))
