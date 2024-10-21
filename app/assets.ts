import type { MiddlewareHandler } from "hyper-express"
import LiveDirectory from "live-directory"

const liveAssets = new LiveDirectory("./app/assets/js/", {
    filter: {
        keep: {
            extensions: ["css", "js", "json", "png", "jpg", "jpeg"],
        },
        ignore: (path) => {
            return path.startsWith(".")
        },
    },

    cache: {
        max_file_count: 250, // Files will only be cached up to 250 MB of memory usage
        max_file_size: 1024 * 1024, // All files under 1 MB will be cached
    },
})

export const assets: MiddlewareHandler = (req, res) => {
    // Strip away '/assets' from the request path to get asset relative path lookup from our LiveDirectory instance.
    const path = req.path.replace("/assets", "")
    const file = liveAssets.get(path)

    // Return a 404 if no asset/file exists on the derived path
    if (!file) return res.status(404).send()

    const fileParts = file.path.split(".")
    const extension = fileParts[fileParts.length - 1]
    if (!extension) return res.status(404).send()

    // Set Cache-Control header to cache the asset for 1 year
    res.set("Cache-Control", "public, max-age=31536000");
    // Set ETag header for cache validation
    res.set("ETag", file.etag);

    if (file.content instanceof Buffer) {
        // Set appropriate mime-type and serve file content Buffer as response body (This means that the file content was cached in memory)
        return res.type(extension).send(file.content)
    } else {
        // Set the type and stream the content as the response body (This means that the file content was NOT cached in memory)
        return res.type(extension).stream(file.content)
    }
}
