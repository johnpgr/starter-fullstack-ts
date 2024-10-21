import { HomePage } from "~/views/home/HomePage.js"
import { render } from "../utils/response.js"
import type { Handler } from "hyper-express"

export class HomeController {
    show: Handler = (req, res) => {
        return render(res, <HomePage req={req} />)
    }
}
