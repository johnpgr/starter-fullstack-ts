import { AuthController } from "~/controllers/auth-controller.js"
import { Router } from "hyper-express"
import { assets } from "./middlewares/assets.js"
import { ctx } from "./middlewares/ctx.js"
import { render } from "./utils/response.js"
import { liveReloadHandler } from "./live-reload.js"
import { HomePage } from "./views/home/home-page.js"

const authController = new AuthController()

export const router = new Router()

router.get("/assets/*", assets)
router.get("/live-reload/feed", liveReloadHandler)
router.use(ctx)
router.get("/", (req, res) => render(res, <HomePage req={req} />))
router.use("/auth", authController.router)
