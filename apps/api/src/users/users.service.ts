import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserSession)
    private sessionsRepository: Repository<UserSession>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && await this.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async updateLastActive(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      lastActive: new Date(),
    });
  }

  // Session management methods
  async createSession(session: Partial<UserSession>): Promise<UserSession> {
    const newSession = this.sessionsRepository.create(session);
    return this.sessionsRepository.save(newSession);
  }

  async findSessionByToken(token: string): Promise<UserSession | null> {
    return this.sessionsRepository.findOne({ 
      where: { token, isRevoked: false },
      relations: ['user']
    });
  }

  async findSessionByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    return this.sessionsRepository.findOne({ 
      where: { refreshToken, isRevoked: false },
      relations: ['user']
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.sessionsRepository.update(sessionId, { isRevoked: true });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.sessionsRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.sessionsRepository.update(
      { expiresAt: LessThan(new Date()), isRevoked: false },
      { isRevoked: true }
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
} 