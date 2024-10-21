import { AuthController } from "~/controllers/AuthController.js"
import { HomeController } from "~/controllers/HomeController.js"
import { Router } from "hyper-express"
import { assets } from "./assets.js"
import { ctx } from "./middleware.js"
import { LiveReloadController } from "./controllers/LiveReloadController.js"

const homeController = new HomeController()
const authController = new AuthController()
const liveReloadController = new LiveReloadController()

export const router = new Router()

router.get("/assets/*", assets)
router.get("/live-reload/feed", liveReloadController.feed)
router.use(ctx)
router.post("/api/auth/signin", authController.handleSignin)
router.post("/api/auth/signup", authController.handleSignup)
router.get("/signin", authController.showSignin)
router.get("/signup", authController.showSignup)
router.get("/", homeController.show)
