// @ts-check
import { spawn } from "child_process"
import { existsSync } from "fs"

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function cmd(command, ...args) {
    return new Promise((resolve, reject) => {
        /** @type {const} */
        const spawnOptions = { shell: true, stdio: "inherit" }
        console.log("CMD:", command, args.flat(), spawnOptions)
        const child = spawn(command, args.flat(), spawnOptions)

        child.on("close", (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`Process exited with code ${code}`))
            }
        })

        child.on("error", (err) => {
            reject(err)
        })
    })
}

if (!existsSync("dist")) {
    await cmd("tsc")
}

await Promise.allSettled([
    cmd("tsc", "--watch", "--preserveWatchOutput"),
    cmd("node", "--watch", "--env-file=.env", "dist/app/server.js"),
])
