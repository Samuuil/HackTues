import Elysia, { t } from "elysia";
import { Auth } from "../services/implementations/Auth";
import type { IAuth } from "../services/interfaces/Authentication";
import { context } from "../context";
import type { IUser } from "../services/interfaces/UserService";

function provideContext(): { authService: IAuth, userService: IUser } {
    return {
        authService: context.authService,
        userService: context.userService
    }
}

export const authRouter = new Elysia({ prefix: "/auth" })
    .state("context", provideContext())
    .guard({
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
})
    .post(
        "/signup",
        async ({ body, store, set }) => {
            let result = "ok";
            (await store.context.userService.findByUsername(body.username)).try(
                {
                    ifNone: async () => {
                        result = "succesfully created user" 
                        await store.context.userService.createUser({...body})
                    },
                    ifNotNone(v) {
                        set.status = 403 
                        result = `username with this ${v} already exists`
                    },
            })
            
            return result
        },
)
    .post(
        "/login",
        async ({ body, store, set }) => {
            const r = await (await store.context.userService.findByUsername(body.username)).tryReturningTheSameType({
                ifNone: async () => {
                    set.status = 404
                    return "no user with such credentials"
                },
                ifNotNone: async (v) => {
                    // if(await context.authService.getUserPassword(v.id) === body.password)
                    return await context.authService.issueToken(v.id)
                }
            })
            console.log(r)
            return r 
        }
    )