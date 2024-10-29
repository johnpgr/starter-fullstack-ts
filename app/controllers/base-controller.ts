import { Router } from "hyper-express"

export class BaseController {
    constructor(public router: Router = new Router()) {}
}
