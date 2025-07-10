import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';
import { Organization } from './entities/organization.entity';

@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get current user organization settings' })
  @ApiResponse({
    status: 200,
    description: 'Organization settings found',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getCurrentUserOrganizationSettings(
    @Request() req: any,
  ): Promise<Organization> {
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId) {
      throw new BadRequestException(
        'Organization ID not found in user session',
      );
    }

    const organization =
      await this.organizationsService.findById(userOrganizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update current user organization settings' })
  @ApiResponse({
    status: 200,
    description: 'Organization settings updated successfully',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async updateCurrentUserOrganizationSettings(
    @Body() updateData: Partial<Organization>,
    @Request() req: any,
  ): Promise<Organization> {
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId) {
      throw new BadRequestException(
        'Organization ID not found in user session',
      );
    }

    const organization =
      await this.organizationsService.findById(userOrganizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.organizationsService.updateOrganization(
      userOrganizationId,
      updateData,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<Organization> {
    // Ensure user can only access their own organization
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId || userOrganizationId !== id) {
      throw new BadRequestException('Access denied to this organization');
    }

    const organization = await this.organizationsService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Organization>,
    @Request() req: any,
  ): Promise<Organization> {
    // Ensure user can only update their own organization
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId || userOrganizationId !== id) {
      throw new BadRequestException('Access denied to this organization');
    }

    const organization = await this.organizationsService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.organizationsService.updateOrganization(id, updateData);
  }

  @Patch(':id/settings')
  @ApiOperation({ summary: 'Update organization settings' })
  @ApiResponse({
    status: 200,
    description: 'Organization settings updated successfully',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async updateSettings(
    @Param('id') id: string,
    @Body() settings: any,
    @Request() req: any,
  ): Promise<Organization> {
    // Ensure user can only update their own organization
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId || userOrganizationId !== id) {
      throw new BadRequestException('Access denied to this organization');
    }

    const organization = await this.organizationsService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.organizationsService.updateOrganizationSettings(id, settings);
  }

  @Patch(':id/domain-verification')
  @ApiOperation({ summary: 'Update domain verification token' })
  @ApiResponse({
    status: 200,
    description: 'Domain verification token updated successfully',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async updateDomainVerification(
    @Param('id') id: string,
    @Body() data: { domainVerificationToken: string },
    @Request() req: any,
  ): Promise<Organization> {
    // Ensure user can only update their own organization
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId || userOrganizationId !== id) {
      throw new BadRequestException('Access denied to this organization');
    }

    const organization = await this.organizationsService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.organizationsService.updateOrganization(id, {
      domainVerificationToken: data.domainVerificationToken,
    });
  }
}
