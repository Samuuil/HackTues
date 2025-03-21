import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";
import crypto from "crypto";
import swagger from "@elysiajs/swagger";
import type { User } from "./models/User";
import type { Session } from "./models/Session";
import { AuthService } from "./services/main";
import { UserRepository } from "./repositories/main";
import { AdminRepository } from "./repositories/main";
import { SessionRepository } from "./repositories/main";
import { SessionService } from "./services/main";
import { adminRoutes, authRoutes } from "./routes/admin";
import { treaty } from "@elysiajs/eden";



const userRepository = new UserRepository();
const adminRepository = new AdminRepository();
const sessionRepository = new SessionRepository();

const sessionService = new SessionService(sessionRepository);
const authService = new AuthService(
  userRepository,
  adminRepository,
  sessionService
);

export const context = {
    userRepository,
    authService,
    sessionService
}

authService.initializeDefaultAdmin();

const app = new Elysia()
  .state("userRepository", userRepository)
  .state("adminRepository", adminRepository)
  .state("authService", authService)
    .use(swagger({
      documentation: {
        info: {
          title: "Elysia Secrets API",
          version: "1.0.0",
          description: "A secure API for storing and retrieving secrets",
        },
        components: {
          securitySchemes: {
            sessionAuth: {
              type: "apiKey",
              in: "header",
              name: "x-session-id",
              description: "Session ID obtained from login or register",
            },
          },
        },
      },
  }))
  .use(adminRoutes)
  .use(authRoutes)
  .listen(3000);

console.log(
  `🦊 Authentication service is running at ${app.server?.hostname}:${app.server?.port}`
);

export const client = treaty<typeof app>