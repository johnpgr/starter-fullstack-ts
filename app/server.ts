import "./env.js"
import { AppDataSource } from "./database.js"
import { Server } from "hyper-express"
import { router } from "./router.js"
import { env } from "./env.js"

await AppDataSource.initialize()
new Server()
    .use("/", router)
    .listen(env.PORT)
    .then(() => console.log("Server started on port", env.PORT))
    .catch(() => console.error("Failed to start server on port", env.PORT))
