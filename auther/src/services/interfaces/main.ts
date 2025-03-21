import type { User } from "../../models/User";

export interface ISessionService {
  createSession(userId: string, expiresInSeconds?: number): Promise<string>;
  validateSession(sessionId: string): Promise<string | null>;
  deleteSession(sessionId: string): Promise<boolean>;
}

export interface IAuthService {
  initializeDefaultAdmin(): Promise<void>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  authenticateAdmin(username: string, password: string): Promise<User | null>;
  createUser(
    username: string,
    password: string,
    isAdmin?: boolean
  ): Promise<User | null>;
  createAdmin(username: string, password: string): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
  deleteAdmin(adminId: string): Promise<boolean>;
  createSession(userId: string): Promise<string>;
  validateSession(sessionId: string): Promise<string | null>;
  deleteSession(sessionId: string): Promise<boolean>;
}
