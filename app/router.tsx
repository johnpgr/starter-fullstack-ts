import { AuthController } from "~/controllers/auth-controller.js"
import { Router } from "hyper-express"
import { HomePage } from "./views/home/home-page.js"
import { ctx } from "./middlewares/ctx.js"
import { assets } from "./middlewares/assets.js"
import { liveReload } from "./middlewares/live-reload.js"

const authController = new AuthController()

export const router = new Router()
    .get("/assets/*", assets)
    .get("/live-reload/feed", liveReload)
    .use(ctx)
    .get("/", (req, res) => res.render(<HomePage req={req} />))
    .use("/auth", authController.router)
