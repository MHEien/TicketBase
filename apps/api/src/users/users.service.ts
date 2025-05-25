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
    if (user && (await this.comparePassword(password, user.password))) {
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
      relations: ['user'],
    });
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<UserSession | null> {
    return this.sessionsRepository.findOne({
      where: { refreshToken, isRevoked: false },
      relations: ['user'],
    });
  }

  async findSessionsByUserId(userId: string): Promise<UserSession[]> {
    return this.sessionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.sessionsRepository.update(sessionId, { isRevoked: true });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.sessionsRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  async cleanupSessions(): Promise<{ removed: number }> {
    const now = new Date();

    const expiredResult = await this.sessionsRepository.update(
      {
        expiresAt: LessThan(now),
        isRevoked: false,
      },
      { isRevoked: true },
    );

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldSessionsResult = await this.sessionsRepository.delete({
      createdAt: LessThan(thirtyDaysAgo),
    });

    return {
      removed:
        (expiredResult.affected || 0) + (oldSessionsResult.affected || 0),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword as string;
  }

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch as boolean;
  }
}
