import type Elysia from "elysia";
import { context } from "../context";



export const authenticationMiddleware = (app: Elysia) =>
  app.onBeforeHandle(async ({ request,headers, set }) => {
    //   return new Optional(headers.authorization).tryReturningTheSameType({
    //         ifNone: async () => {
    //           set.status = 401
    //           return "provide auth token"
    //       },
    //       ifNotNone: async (v) => {
    //           if (!await authService.isValid(v)) {
    //              set.status = 403
    //              return "token does not belong to you"
    //              // TODO: cybersec thing: remove a token in this case
    //           }
    //          return  
    //       }
    // })

     const token = headers.bearer;
      if (request.url.indexOf("/swagger")> -1) { // potential sec vulnerabilty
          
      } else {
          if (!token) {
              set.status = 401;
              return { error: "Provide auth token" };
          }

          if (!(await context.authService.isValid(token))) {
              set.status = 403;
              return { error: "Token does not belong to you" };
              // TODO: Cybersecurity thing: Remove token if invalid
          }
      }
  });
