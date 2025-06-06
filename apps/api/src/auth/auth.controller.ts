import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, TokenPair, LoginResponse } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token received from login or registration',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'My Organization', description: 'Organization name' })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({
    example: 'my-organization',
    description: 'Organization slug (auto-generated if not provided)',
    required: false,
  })
  @IsString()
  @IsOptional()
  organizationSlug?: string;

  @ApiProperty({
    example: 'owner',
    description: 'User role within the organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  role?: string;

  // Helper method to create DTO from request data
  static fromRequest(data: any): RegisterDto {
    const dto = new RegisterDto();
    dto.name = data.name;
    dto.email = data.email;
    dto.password = data.password;
    dto.organizationName = data.organizationName;
    if (data.organizationSlug) dto.organizationSlug = data.organizationSlug;
    if (data.role) dto.role = data.role;
    return dto;
  }
}

export class TokenResponseDto implements TokenPair {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class LoginResponseDto implements LoginResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  permissions: string[];

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Register a new user with organization' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() data: any): Promise<any> {
    console.log('Register data:', JSON.stringify(data, null, 2));

    // Create a properly formatted DTO
    const registerDto = RegisterDto.fromRequest(data);
    console.log('Transformed DTO:', JSON.stringify(registerDto, null, 2));

    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenPair> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  // Add diagnostic endpoint for debugging token issues
  @ApiOperation({ summary: 'Check refresh token status (diagnostics)' })
  @ApiResponse({
    status: 200,
    description: 'Token status information',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @Post('check-token')
  @HttpCode(HttpStatus.OK)
  async checkToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<any> {
    return this.authService.checkTokenStatus(refreshTokenDto.refreshToken);
  }

  // Add endpoint for session diagnostic information
  @ApiOperation({ summary: 'Get session diagnostic information' })
  @ApiResponse({
    status: 200,
    description: 'Session diagnostic information',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('session-info')
  async getSessionInfo(@Req() req): Promise<any> {
    return this.authService.getSessionInfo(req.user);
  }

  // Add endpoint to clean up expired or abandoned sessions
  @ApiOperation({ summary: 'Clean up expired sessions' })
  @ApiResponse({
    status: 200,
    description: 'Session cleanup result',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('cleanup-sessions')
  async cleanupSessions(): Promise<any> {
    return this.authService.cleanupSessions();
  }

  @ApiOperation({ summary: 'Logout (invalidate current session)' })
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request): Promise<void> {
    const token = this.authService.extractTokenFromHeader(req);
    if (token) {
      await this.authService.logout(token);
    }
  }

  @ApiOperation({
    summary: 'Logout from all devices (invalidate all sessions)',
  })
  @ApiResponse({
    status: 204,
    description: 'Logged out from all devices successfully',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@Req() req: RequestWithUser): Promise<void> {
    await this.authService.logoutAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get current user session info' })
  @ApiResponse({
    status: 200,
    description: 'User session info retrieved successfully',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('session')
  getSession(@Req() req: RequestWithUser) {
    return req.user;
  }

  @ApiOperation({ summary: 'Update user and organization settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('user-settings')
  async updateUserSettings(
    @Req() req: RequestWithUser,
    @Body() settings: Record<string, unknown>,
  ): Promise<{
    updatedUser: User;
    updatedOrganization: Record<string, unknown>;
  }> {
    return this.authService.updateUserSettings(req.user, settings) as Promise<{
      updatedUser: User;
      updatedOrganization: Record<string, unknown>;
    }>;
  }
}
