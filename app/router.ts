import { AuthController } from "~/controllers/AuthController.js"
import { HomeController } from "~/controllers/HomeController.js"
import { Router } from "hyper-express"
import { assets } from "./assets.js"

const homeController = new HomeController()
const authController = new AuthController()

export const router = new Router()

router.get("/assets/*", assets)
router.get("/", homeController.show)
router.get("/signin", authController.showSignin)
router.get("/signup", authController.showSignup)
router.post("/api/auth/signin", authController.handleSignin)
router.post("/api/auth/signup", authController.handleSignup)
