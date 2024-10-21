import { renderToStream } from "@kitajs/html/suspense"
import type { Response } from "hyper-express"

export function render(res: Response, element: JSX.Element) {
    res.header("Content-Type", "text/html; charset=utf-8")
    return renderToStream(element).pipe(res)
}
