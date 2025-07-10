import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import { UsersService } from './users.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import {
  PaginatedUsersResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post()
  @Auth({
    permissions: ['users:create'],
  })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: any,
  ): Promise<UserResponseDto> {
    const organizationId = req.user?.organizationId;
    const user = await this.usersService.createUser(
      createUserDto,
      organizationId,
    );

    // Transform to response DTO (excluding password)
    return {
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
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: PaginatedUsersResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() queryDto: UserQueryDto,
    @Request() req: any,
  ): Promise<PaginatedUsersResponseDto> {
    const organizationId = req.user?.organizationId;
    return this.usersService.findUsers(queryDto, organizationId);
  }

  @Get('stats')
  @Auth({
    permissions: ['users:view'],
  })
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics',
  })
  async getStats(@Request() req: any) {
    const organizationId = req.user?.organizationId;
    return this.usersService.getUserStats(organizationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Transform to response DTO (excluding password)
    return {
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
    };
  }

  @Put(':id')
  @Auth({
    permissions: ['users:update'],
  })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: AdminUpdateUserDto,
    @Request() req: any,
  ): Promise<UserResponseDto> {
    const organizationId = req.user?.organizationId;
    const user = await this.usersService.updateUser(
      id,
      updateUserDto,
      organizationId,
    );

    // Transform to response DTO (excluding password)
    return {
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
    };
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ): Promise<{ message: string }> {
    // For security, users can only change their own password unless they're admin
    const currentUser = req.user;
    if (
      currentUser.id !== id &&
      !['owner', 'admin'].includes(currentUser.role)
    ) {
      throw new Error('Forbidden: You can only change your own password');
    }

    // If changing own password, verify current password
    if (currentUser.id === id) {
      const isValid = await this.usersService.validateUser(
        currentUser.email,
        changePasswordDto.currentPassword,
      );
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }
    }

    await this.usersService.updateUser(id, {
      password: changePasswordDto.newPassword,
    });

    return { message: 'Password changed successfully' };
  }

  @Delete(':id')
  @Auth({
    permissions: ['users:delete'],
  })
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const organizationId = req.user?.organizationId;

    // Prevent users from deleting themselves
    if (req.user.id === id) {
      throw new Error('Cannot delete your own account');
    }

    // Get user data before deletion for logging
    const userToDelete = await this.usersService.findById(id);
    if (!userToDelete) {
      throw new Error('User not found');
    }

    await this.usersService.deleteUser(id, organizationId);

    // Log activity
    await this.activitiesService.logUserDeleted(
      req.user.id,
      userToDelete.id,
      userToDelete.name,
      organizationId,
    );

    return { message: 'User deleted successfully' };
  }
}
