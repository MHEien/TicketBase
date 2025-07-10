import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import {
  PaginatedUsersResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';
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
    return this.usersRepository.findOne({
      where: { id },
      relations: ['department', 'organization'],
    });
  }

  async createUser(
    userData: CreateUserDto,
    organizationId?: string,
  ): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      organizationId: organizationId || userData.organizationId,
    });
    return this.usersRepository.save(newUser);
  }

  async findUsers(
    queryDto: UserQueryDto,
    organizationId?: string,
  ): Promise<PaginatedUsersResponseDto> {
    const {
      search,
      role,
      status,
      departmentId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.department', 'department');

    // Add organization filter if provided
    if (organizationId) {
      queryBuilder.andWhere('user.organizationId = :organizationId', {
        organizationId,
      });
    }

    // Add search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Add role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Add status filter
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    // Add department filter
    if (departmentId) {
      queryBuilder.andWhere('user.departmentId = :departmentId', {
        departmentId,
      });
    }

    // Add sorting
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Add pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    // Transform to response DTOs
    const userDtos: UserResponseDto[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      permissions: user.permissions,
      organizationId: user.organizationId,
      departmentId: user.departmentId,
      createdAt: user.createdAt,
      lastActive: user.lastActive,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      department: user.department
        ? {
            id: user.department.id,
            name: user.department.name,
            slug: user.department.slug,
          }
        : undefined,
    }));

    return {
      users: userDtos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(
    id: string,
    updateDto: UpdateUserDto | AdminUpdateUserDto,
    organizationId?: string,
  ): Promise<User> {
    const whereClause: any = { id };
    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    const user = await this.usersRepository.findOne({ where: whereClause });
    if (!user) {
      throw new Error('User not found');
    }

    // Handle password update if provided (only for AdminUpdateUserDto)
    const updateData: any = { ...updateDto };
    if ('password' in updateDto && updateDto.password) {
      updateData.password = await this.hashPassword(updateDto.password);
    }

    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async deleteUser(id: string, organizationId?: string): Promise<void> {
    const whereClause: any = { id };
    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    const user = await this.usersRepository.findOne({ where: whereClause });
    if (!user) {
      throw new Error('User not found');
    }

    // First revoke all user sessions
    await this.revokeAllUserSessions(id);

    // Then delete the user
    await this.usersRepository.remove(user);
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

  async getUserStats(organizationId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    byRole: Record<string, number>;
  }> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (organizationId) {
      queryBuilder.where('user.organizationId = :organizationId', {
        organizationId,
      });
    }

    const users = await queryBuilder.getMany();

    const stats = {
      total: users.length,
      active: users.filter((u) => u.status === UserStatus.ACTIVE).length,
      inactive: users.filter((u) => u.status === UserStatus.INACTIVE).length,
      pending: users.filter((u) => u.status === UserStatus.PENDING).length,
      byRole: {} as Record<string, number>,
    };

    // Calculate role distribution
    for (const user of users) {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    }

    return stats;
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

    // Mark expired sessions as revoked
    const expiredResult = await this.sessionsRepository.update(
      {
        expiresAt: LessThan(now),
        isRevoked: false,
      },
      { isRevoked: true },
    );

    // Delete old revoked sessions (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldSessionsResult = await this.sessionsRepository.delete({
      createdAt: LessThan(thirtyDaysAgo),
      isRevoked: true,
    });

    return {
      removed:
        (expiredResult.affected || 0) + (oldSessionsResult.affected || 0),
    };
  }

  async findActiveSessionByRefreshToken(
    refreshToken: string,
  ): Promise<UserSession | null> {
    const now = new Date();
    return this.sessionsRepository.findOne({
      where: {
        refreshToken,
        isRevoked: false,
        expiresAt: MoreThan(now), // Only return non-expired sessions
      },
      relations: ['user'],
    });
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
