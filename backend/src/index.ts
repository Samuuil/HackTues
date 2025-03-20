import cors from "@elysiajs/cors";
import Elysia, { t } from "elysia";
import { treaty } from "@elysiajs/eden";
import swagger from "@elysiajs/swagger";
import { agentsRouter } from "./routes/agentsRouter";
import { roomRouter } from "./routes/rooms";
import { authRouter } from "./routes/auth";

const port = 5000

const app = new Elysia().use(cors())
    .use(swagger())
    // .use(authenticationMiddleware)
    .use(authRouter)
    .use(roomRouter)
    .use(agentsRouter)
    .listen(port, () => {
        console.log("listening on port" + port)
    })

export const sdk = treaty<typeof app>("http://localhost:"+port)
export type App = typeof app
// const notifications = sdk.rooms.notify.subscribe()
// notifications.addEventListener("message", ) // addEventListener is like using the raw websocket cleint api


