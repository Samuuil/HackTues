import Elysia, { t } from "elysia";
import { Optional } from "../utils/Optional";
import type { IGuardedService } from "../services/interfaces/GuardedService";

function provideGuardedContext(): IGuardedService{}

export const guardedRouter = new Elysia({ prefix: "/guarded" })
  .state("context", provideGuardedContext())
  .get(
    "/",
    async ({ params, store }) => {
      // should just return all the quarded if there is a param return the specific one
      return await store.context.get(new Optional(params.id));
    },
    {
      params: t.Object({
        id: t.Optional(t.String()),
      }),
      detail: {
        description:
          "returns a list of the guarded and if an id is supplied it provides the guarded with the id ",
      },
    }
  )
  .get(
    "/data",
    async ({ store, params }) => {
      return await store.context.getData({
        start: params.start,
        end: params.end,
      }); //TODO implement memoization so the we dont need to compose these everytime and make expensive queries, also consider a real time db for these
    },
    {
      params: t.Object({
        start: t.Date(),
        end: t.Date(),
        guardedId: t.String(), //TODO make it so that this and /:id are unedr the same subroute and this will become /:id/data
      }),
      detail: {
        description: "it returns the data collected from a guarded person ",
      },
    }
  );
