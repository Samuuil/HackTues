import type { User } from "../../models/User";
import type { Session } from "../../models/Session";

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(username: string, password: string, isAdmin?: boolean): Promise<User>;
  delete(id: string): Promise<boolean>;
  hashValue(value: string): string;
}

export interface IAdminRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(username: string, password: string): Promise<User>;
  delete(id: string): Promise<boolean>;
  hashValue(value: string): string;
}

export interface ISessionRepository {
  create(userId: string, expiresInSeconds: number): Promise<Session>;
  findById(sessionId: string): Promise<Session | null>;
  delete(sessionId: string): Promise<boolean>;
}
