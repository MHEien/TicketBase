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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationGuard } from '../auth/guards/organization.guard';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from './entities/user.entity';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Auth({
    roles: [UserRole.OWNER, UserRole.ADMIN],
    permissions: ['departments.create'],
  })
  @UseGuards(OrganizationGuard)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully',
    type: Department,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  @ApiOperation({ summary: 'Get all departments for an organization' })
  @ApiResponse({
    status: 200,
    description: 'List of departments',
    type: [Department],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('organizationId') organizationId: string,
  ): Promise<Department[]> {
    return this.departmentsService.findAll(organizationId);
  }

  @Get('hierarchy')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  @ApiOperation({ summary: 'Get department hierarchy for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Hierarchical list of departments',
    type: [Department],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getHierarchy(
    @Query('organizationId') organizationId: string,
  ): Promise<Department[]> {
    return this.departmentsService.getHierarchy(organizationId);
  }

  @Get('with-users')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  @ApiOperation({
    summary: 'Get all departments with users for an organization',
  })
  @ApiResponse({
    status: 200,
    description: 'List of departments with users',
    type: [Department],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllWithUsers(
    @Query('organizationId') organizationId: string,
  ): Promise<Department[]> {
    return this.departmentsService.findAllWithUsers(organizationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiResponse({
    status: 200,
    description: 'Department found',
    type: Department,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findOne(
    @Param('id') id: string,
    @Query('organizationId') organizationId?: string,
  ): Promise<Department> {
    return this.departmentsService.findOne(id, organizationId);
  }

  @Get('by-slug/:slug')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  @ApiOperation({ summary: 'Get a department by slug' })
  @ApiResponse({
    status: 200,
    description: 'Department found',
    type: Department,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findBySlug(
    @Param('slug') slug: string,
    @Query('organizationId') organizationId: string,
  ): Promise<Department> {
    return this.departmentsService.findBySlug(slug, organizationId);
  }

  @Put(':id')
  @Auth({
    roles: [UserRole.OWNER, UserRole.ADMIN],
    permissions: ['departments.update'],
  })
  @UseGuards(OrganizationGuard)
  @ApiOperation({ summary: 'Update a department' })
  @ApiResponse({
    status: 200,
    description: 'Department updated successfully',
    type: Department,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Query('organizationId') organizationId?: string,
  ): Promise<Department> {
    return this.departmentsService.update(
      id,
      updateDepartmentDto,
      organizationId,
    );
  }

  @Delete(':id')
  @Auth({
    roles: [UserRole.OWNER, UserRole.ADMIN],
    permissions: ['departments.delete'],
  })
  @UseGuards(OrganizationGuard)
  @ApiOperation({ summary: 'Delete a department' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  remove(
    @Param('id') id: string,
    @Query('organizationId') organizationId?: string,
  ): Promise<void> {
    return this.departmentsService.remove(id, organizationId);
  }
}
