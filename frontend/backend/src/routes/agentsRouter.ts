import Elysia, { t } from "elysia";
import type { IAgentsService } from "../services/interfaces/Agents";
import { context } from "../context";


function provideAgentsService(): IAgentsService {
        return context.agentsService
    } 


/*
agents serve as long lived access tokens
*/
export const agentsRouter = new Elysia({ prefix: "/agents" })
  .state("agentsService", provideAgentsService())
  // .guard({
  //   body: t.Object({
  //     userId: t.String(),
  //     agentName: t.String()
  //   })
  // }).resolve(({ body }) => {
  //   return {
  //     userId: body.userId,
  //     agentName: body.agentName
  //   }
  // })
.get(
  "/:userId",
  async ({ store, params  }) => {
    return await store.agentsService.getUserAgents( params.userId )
  }, {
    params: t.Object({
      userId: t.String()
    })
  }
  )
  .post(
    "/",
    ({ store, body }) => {
      store.agentsService.create(body.userId, body.agent);
    },
    {
      body: t.Object({
        userId: t.String(),
        agent: t.String()
      }),
    }
  )
  .delete("/", ({agentName,store, userId}) => {
   store.agentsService.delete(userId, agentName) 
  });// see if guards are applied to the openapi spec generation 
