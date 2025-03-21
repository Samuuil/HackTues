import { Elysia } from 'elysia';
import { isAuthenticated } from "./Auth";

export const isAdmin = new Elysia().use(isAuthenticated).derive(({ user, set }) => {
  if (!user || !user.isAdmin) {
    set.status = 403;
    return { error: "Admin access required" };
  }
  return { adminUser: user } as const;
});
