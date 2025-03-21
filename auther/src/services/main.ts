import type { ISessionService, IAuthService } from "../services/interfaces/main";
import type { IUserRepository, IAdminRepository, ISessionRepository } from "../repositories/interfaces/main";
import type { User } from "../models/User";

class SessionService implements ISessionService {
  constructor(private sessionRepository: ISessionRepository) {}

  async createSession(
    userId: string,
    expiresInSeconds: number = 60 * 60 * 24
  ): Promise<string> {
    const session = await this.sessionRepository.create(
      userId,
      expiresInSeconds
    );
    return session.sessionId;
  }

  async validateSession(sessionId: string): Promise<string | null> {
    const session = await this.sessionRepository.findById(sessionId);
    return session ? session.userId : null;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.sessionRepository.delete(sessionId);
  }
}

class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private adminRepository: IAdminRepository,
    private sessionService: ISessionService
  ) {}

  async initializeDefaultAdmin(): Promise<void> {
    const existingAdmin = await this.adminRepository.findByUsername("admin");
    if (!existingAdmin) {
      await this.adminRepository.create("admin", "password");
      console.log("Default admin user created");
    }
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username) || await this.adminRepository.findByUsername(username);
    if (!user) return null;

    const hashedPassword = this.userRepository.hashValue(password);
    if (user.passwordHash === hashedPassword) {
      return user;
    }

    return null;
  }

  async authenticateAdmin(
    username: string,
    password: string
  ): Promise<User | null> {
    const admin = await this.adminRepository.findByUsername(username);
    if (!admin) return null;

    const hashedPassword = this.adminRepository.hashValue(password);
    if (admin.passwordHash === hashedPassword) {
      return admin;
    }

    return null;
  }

  async createUser(
    username: string,
    password: string,
    isAdmin: boolean = false
  ): Promise<User | null> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) return null;

    return this.userRepository.create(username, password, isAdmin);
  }

  async createAdmin(username: string, password: string): Promise<User | null> {
    const existingAdmin = await this.adminRepository.findByUsername(username);
    if (existingAdmin) return null;

    return this.adminRepository.create(username, password);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.userRepository.delete(userId);
  }

  async deleteAdmin(adminId: string): Promise<boolean> {
    return this.adminRepository.delete(adminId);
  }

  async createSession(userId: string): Promise<string> {
    return this.sessionService.createSession(userId);
  }

  async validateSession(sessionId: string): Promise<string | null> {
    return this.sessionService.validateSession(sessionId);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.sessionService.deleteSession(sessionId);
  }
}

export { SessionService, AuthService };
