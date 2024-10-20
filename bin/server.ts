import { Server } from "hyper-express"

new Server()
    .get("/", (request, response) => {
        response.send("Hello World")
    })
    .listen(process.env.PORT || 3000)
    .then((socket) => console.log("Webserver started on port 80"))
    .catch((error) => console.log("Failed to start webserver on port 80"))
