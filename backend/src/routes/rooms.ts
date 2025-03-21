import { Optional } from './../utils/Optional';
import Elysia, { t } from "elysia";
import { NotificationService } from "../services/implementations/Notifcation";
import {
  NotificationStrategy,
  type INotificationService,
} from "../services/interfaces/Notification";
import type { IRoomsService } from "../services/interfaces/Room";
import { guardedRouter } from "./guardedRouter";
import { GetSet } from "../utils/types/Settable";
import { IdOrUsernameQuery } from "../utils/types/idOrUsernnameQuery";
import type { IAgentsService } from '../services/interfaces/Agents';
import { context } from '../context';
import type { IUser } from '../services/interfaces/UserService';

const connectedClients = new Set<{ send: (msg: string) => void }>(); // add tp the context and abstract behind a service

const dataService = new GetSet<{ oil: number }>({ oil: 4 });


function provideContext(): {
  roomsService: IRoomsService,
  notificationService: INotificationService,
  agentsService: IAgentsService,
  userService: IUser
} {
  return {
    ...context,
    notificationService: new NotificationService()
  };
}

export const roomRouter = new Elysia({ prefix: "/rooms" })
  .state("services", provideContext())
  .guard({
    // body: t.Object({
    //   userId: t.String() //TODO replace this with just getting the userId from the provided token, discuss however woth mentor since its potential sec issue
    // }),
    headers: t.Object({
      bearer: t.String({
        pattern: "^Bearer .+$",
      }),
    }),
  })
  // .resolve(
  //   ({
  //     body 
  //   }) => {
  //     return {
  //       userId: body.userId
  //     }
  // })
  .resolve(({ headers }) => {
    return {
      bearer: headers.bearer.slice(7),
    };
  })
// .resolve(async ({ bearer, body, set }) => {
//     const userTokens = await context.authService.getUserTokens(body.userId);
//     const agentTokens = await context.agentsService.getUserAgents(body.userId);

//     const allTokens = new Set([...userTokens, ...agentTokens]);

//     if (!allTokens.has(bearer)) {
//         set.status = 403;
//         return;
//     }
// })
  .post(
    "/",
    async ({ body, store  }) => {
      console.log(body)
      await store.services.roomsService.createRoom(body.roomPassword, body.userId);
    },
    {
      body: t.Object({
        roomPassword: t.String(),
        userId: t.String()
      }),
      detail: {
        description: "creates a new room",
      },
    }
  )
  .get(
    "/members/:roomId",
    ({ params, store }) => {
      console.log(params.roomId)
      console.log("k")
      return store.services.roomsService.getMembers(params.roomId)
    }, {
      params: t.Object({ roomId: t.String() })
    } 
  )
  .get(
    "/:userId",
    async({ params, store }) => {
      return await store.services.roomsService.getUserRooms(params.userId)
    }, {
      params: t.Object({
        userId: t.String()
      })
    }
  )
  .get(
    "/members/:roomId",
    async ({ params, store }) => {
        return await store.services.roomsService.getMembers(params.roomId)
    },
    {
      params: t.Object({
        roomId: t.String()
      })
    }
  )
  .post(
    "/members",
    async ({ store, body }) => {
      await store.services.roomsService.addUserToRoom(
        new IdOrUsernameQuery(
          (new Optional<string>(null)),new Optional(body.userId)
        ),
        body.role,
        body.roomId
      );
    },
    {
      body: t.Object({
        userId: t.String(),
        roomId: t.String(),
        role:  t.String({
          default: "Guardian"
        }), 
        roomPassword: t.String(),
      }),
      detail: {
        description: "adds a person to the room with a role",
      },
    }
  )
  .post(
    // might as well turn it into webscoket route
    "/notify",
    async ({ body, store }) => {
      (await store.services.roomsService.getMembers(body.roomId)).forEach((user) => {
        store.services.notificationService.notify(user.name, {
          strategy: NotificationStrategy.fromString(
            new Optional(body.event.sendingStrategy).unpackWithDefault(
              "unknown"
            )
          ),
          message: body.event.info,
        });
      });
    },
    {
      body: t.Object({
        role: /* t.Enum({guarded: "guarded"}) */ t.String(),
        authToken: t.String(),
        roomId: t.String(),
        event: t.Object({
          info: t.String(),
          sendingStrategy: t.Optional(
            t.Enum({
              email: "email",
              unknown: "unknown",
              slack: "slack",
              phoneNotification: "phoneNotification",
            })
          ),
        }),
      }),
    }
  )
  // .ws("/data", {
  //   body: t.Object({
  //     message: t.Object({
  //       type: t.Enum({
  //         newData: "newData",
  //       }),
  //       authToken: t.String(),
  //     }),
  //   }),
  //   open(ws) {
  //     connectedClients.add(ws);
  //   },
  //   message(ws, { message }) {
  //     if (
  //       JSON.stringify(dataService.value).trim() ===
  //       JSON.stringify(message).trim()
  //     ) {
  //       // lik this we compare two objects by value
  //     }
  //     const { id } = ws.data.query;

  //     for (const c of connectedClients) {
  //       c.send("huhu");
  //     }
  //     ws.send({
  //       id,
  //       message,
  //       time: Date.now(),
  //     });
  //   },
  // })
  // .ws("/notify", {
  //   // instead of this use raw websockets using trpc since clientgeneration does not work here
  //   body: t.String(),
  //   message(ws, message) {
  //     console.log("mggg", message);
  //     ws.send({
  //       message,
  //       time: Date.now(),
  //     });
  //   },
  // })
  .use(guardedRouter);
