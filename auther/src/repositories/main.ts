import type { IUserRepository, IAdminRepository, ISessionRepository } from "./interfaces/main";
import type { User } from "../models/User";
import type { Session } from "../models/Session";
import crypto from "crypto";

class UserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findByUsername(username: string): Promise<User | null> {
    const hashedUsername = this.hashValue(username);
    for (const user of this.users.values()) {
      if (user.username === hashedUsername) {
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async create(
    username: string,
    password: string,
    isAdmin: boolean = false
  ): Promise<User> {
    const id = crypto.randomUUID();
    const hashedUsername = this.hashValue(username);
    const hashedPassword = this.hashValue(password);

    const user: User = {
      id,
      username: hashedUsername,
      passwordHash: hashedPassword,
      isAdmin,
    };

    this.users.set(id, user);
    return user;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  hashValue(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  }
}

class AdminRepository implements IAdminRepository {
  private admins: Map<string, User> = new Map();

  async findByUsername(username: string): Promise<User | null> {
    const hashedUsername = this.hashValue(username);
    for (const admin of this.admins.values()) {
      if (admin.username === hashedUsername) {
        return admin;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.admins.get(id) || null;
  }

  async create(username: string, password: string): Promise<User> {
    const id = crypto.randomUUID();
    const hashedUsername = this.hashValue(username);
    const hashedPassword = this.hashValue(password);

    const admin: User = {
      id,
      username: hashedUsername,
      passwordHash: hashedPassword,
      isAdmin: true,
    };

    this.admins.set(id, admin);
    return admin;
  }

  async delete(id: string): Promise<boolean> {
    return this.admins.delete(id);
  }

  hashValue(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  }
}

class SessionRepository implements ISessionRepository {
  private sessions: Map<string, Session> = new Map();

  async create(userId: string, expiresInSeconds: number): Promise<Session> {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const session: Session = {
      sessionId,
      userId,
      expiresAt,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  async findById(sessionId: string): Promise<Session | null> {
    const session = this.sessions.get(sessionId);
    if (!session || session.expiresAt < new Date()) {
      this.sessions.delete(sessionId); // Clean up expired sessions
      return null;
    }
    return session;
  }

  async delete(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }
}

export { UserRepository, AdminRepository, SessionRepository };
