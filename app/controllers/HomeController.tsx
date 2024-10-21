import { HomePage } from "~/views/home/HomePage.js"
import type { Handler } from "./types.js"
import { render } from "./utils.js"

export class HomeController {
    show: Handler = (req, res) => {
        return render(res, <HomePage req={req} />)
    }
}
