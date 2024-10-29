//@ts-check
import terser from "@rollup/plugin-terser"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { defineConfig } from "rollup"
import { globSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export default defineConfig({
    input: Object.fromEntries(
        globSync("app/scripts/*.{ts,js}").map((file) => [
            // This remove `src/` as well as the file extension from each
            // file, so e.g. src/nested/foo.js becomes nested/foo
            path.relative(
                "app",
                file.slice(0, file.length - path.extname(file).length),
            ),
            // This expands the relative paths to absolute paths, so e.g.
            // src/nested/foo becomes /project/src/nested/foo.js
            fileURLToPath(new URL(file, import.meta.url)),
        ]),
    ),
    output: {
        compact: true,
        minifyInternalExports: true,
        dir: "assets",
        format: "cjs",
    },
    // @ts-ignore
    plugins: [nodeResolve(), terser()],
})
