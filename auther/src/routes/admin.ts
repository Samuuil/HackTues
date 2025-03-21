import Elysia, { t } from "elysia";
import { context } from "..";
import { isAdmin } from "../middlewares/isAdmin";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/login",
    async ({ body, store }) => {
      const { username, password } = body;
      const user = await context.authService.authenticateUser(
        username,
        password
      );

      if (!user) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      const token = await context.authService.createSession(user.id);

      return {
        success: true,
        userId: user.id,
        isAdmin: user.isAdmin,
        token,
      };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      detail: {
        summary: "User login",
        description: "Authenticate a user and return a session token.",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: t.Object({
                  success: t.Boolean(),
                  userId: t.String(),
                  isAdmin: t.Boolean(),
                  token: t.String(),
                }),
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: t.Object({
                  success: t.Boolean(),
                  message: t.String(),
                }),
              },
            },
          },
        },
      },
    }
  )
  .post(
    "/logout",
    async ({ headers, store }) => {
      const authHeader = headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        await context.authService.deleteSession(token);
      }

      return { success: true };
    },
    {
      detail: {
        summary: "User logout",
        description: "Logs out a user by deleting the session token.",
        tags: ["Auth"],
        security: [{ sessionAuth: [] }],
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: t.Object({
                  success: t.Boolean(),
                }),
              },
            },
          },
        },
      },
    }
).get(
  "/validity",
  async ({ headers }) => {
    const authHeader = headers["x-session-id"];
    console.log(authHeader)
    if (authHeader === undefined) {
        return {success: false}
      }
      const isValid = await context.authService.validateSession(authHeader);

      if (isValid) {
        return {
          success: true,
        };
      }

    return {
      success: false,
    };
  },
  {
    detail: {
      summary: "Check token validity",
      description: "Validates if the provided session token is active.",
      tags: ["Auth"],
      security: [{ sessionAuth: [] }],
      responses: {
        200: {
          description: "Token is valid",
          content: {
            "application/json": {
              schema: t.Object({
                success: t.Boolean(),
              }),
            },
          },
        },
        403: {
          description: "Invalid or missing token",
          content: {
            "application/json": {
              schema: t.Object({
                success: t.Boolean(),
              }),
            },
          },
        },
      },
    },
  }
)

export const adminRoutes = new Elysia({ prefix: "/admin" }).use(isAdmin).post(
  "/users",
  async ({ body }) => {
    const { username, password, isAdmin = false } = body;
    const user = await context.authService.createUser(
      username,
      password,
      isAdmin
    );
    if (!user) {
      return {
        success: false,
        message: "Username already exists",
      };
    }
    return {
      success: true,
      userId: user.id,
    };
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
      isAdmin: t.Optional(t.Boolean()),
    }),
    detail: {
      summary: "Create a new user (Admin only)",
      description: "Creates a new user. Requires admin privileges.",
      tags: ["Admin"],
      security: [{ sessionAuth: [] }],
      responses: {
        200: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: t.Object({
                success: t.Boolean(),
                userId: t.String(),
              }),
            },
          },
        },
        403: {
          description: "Admin access required",
          content: {
            "application/json": {
              schema: t.Object({
                success: t.Boolean(),
                message: t.String(),
              }),
            },
          },
        },
        400: {
          description: "Username already exists",
          content: {
            "application/json": {
              schema: t.Object({
                success: t.Boolean(),
                message: t.String(),
              }),
            },
          },
        },
      },
    },
  }
);
