import { Elysia } from 'elysia';
import { context } from './../index';
export const isAuthenticated = new Elysia().derive(async ({ headers }) => {
  const authHeader = headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return { user: null };

  const token = authHeader.split(" ")[1];
  const userId = await context.authService.validateSession(token);
  if (!userId) return { user: null };

  const user = await context.userRepository.findById(userId);
  return { user } as const;
});
