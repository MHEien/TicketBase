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
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
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

  @Post(':id/verify-domain')
  @ApiOperation({ summary: 'Verify domain ownership' })
  @ApiResponse({
    status: 200,
    description: 'Domain verification result',
    schema: {
      type: 'object',
      properties: {
        verified: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async verifyDomain(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ verified: boolean; message: string }> {
    // Ensure user can only verify their own organization's domain
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId || userOrganizationId !== id) {
      throw new BadRequestException('Access denied to this organization');
    }

    const organization = await this.organizationsService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (!organization.customDomain) {
      throw new BadRequestException('No custom domain configured');
    }

    const verified = await this.organizationsService.verifyDomainOwnership(id);

    return {
      verified,
      message: verified
        ? 'Domain verification successful'
        : 'Domain verification failed. Please check your DNS settings.',
    };
  }

  @Post(':id/generate-verification-token')
  @ApiOperation({ summary: 'Generate new domain verification token' })
  @ApiResponse({
    status: 200,
    description: 'New verification token generated',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        instructions: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async generateVerificationToken(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ token: string; instructions: any }> {
    // Ensure user can only generate token for their own organization
    const userOrganizationId = req.user?.organizationId;
    if (!userOrganizationId || userOrganizationId !== id) {
      throw new BadRequestException('Access denied to this organization');
    }

    const organization = await this.organizationsService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (!organization.customDomain) {
      throw new BadRequestException('No custom domain configured');
    }

    const token =
      await this.organizationsService.generateDomainVerificationToken(id);

    return {
      token,
      instructions: {
        method1: {
          title: 'DNS TXT Record Verification',
          description: 'Add a TXT record to your DNS settings',
          record: {
            type: 'TXT',
            name: `_verify-${token}`,
            value: token,
            ttl: 300,
          },
        },
        method2: {
          title: 'File Upload Verification',
          description: 'Upload a verification file to your website',
          file: {
            path: '/.well-known/ticket-platform-verification',
            content: token,
          },
        },
        method3: {
          title: 'Meta Tag Verification',
          description: 'Add a meta tag to your website homepage',
          tag: `<meta name="ticket-platform-domain-verification" content="${token}" />`,
        },
      },
    };
  }
}

// Public controller for domain-based organization lookup (no authentication required)
@ApiTags('Public Organizations')
@Controller('public/organizations')
export class PublicOrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('by-domain')
  @ApiOperation({ summary: 'Get organization by domain (public endpoint)' })
  @ApiQuery({
    name: 'domain',
    description: 'Domain name to lookup',
    example: 'thunderstorm.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async findByDomain(@Query('domain') domain: string): Promise<Organization> {
    if (!domain) {
      throw new BadRequestException('Domain parameter is required');
    }

    const organization = await this.organizationsService.findByDomain(domain);
    if (!organization) {
      throw new NotFoundException(
        'No verified organization found for this domain',
      );
    }

    // Return only public information for security
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      favicon: organization.favicon,
      website: organization.website,
      settings: organization.settings,
      customDomain: organization.customDomain,
      domainVerified: organization.domainVerified,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    } as Organization;
  }

  @Get('by-slug')
  @ApiOperation({ summary: 'Get organization by slug (public endpoint)' })
  @ApiQuery({
    name: 'slug',
    description: 'Organization slug to lookup',
    example: 'thunderstorm-events',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    type: Organization,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async findBySlug(@Query('slug') slug: string): Promise<Organization> {
    if (!slug) {
      throw new BadRequestException('Slug parameter is required');
    }

    const organization = await this.organizationsService.findBySlug(slug);
    if (!organization) {
      throw new NotFoundException('No organization found for this slug');
    }

    // Return only public information for security
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      favicon: organization.favicon,
      website: organization.website,
      settings: organization.settings,
      customDomain: organization.customDomain,
      domainVerified: organization.domainVerified,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    } as Organization;
  }

  @Get('all')
  @ApiOperation({
    summary: 'List all organizations (development only)',
    description:
      'Returns a list of all organizations for development purposes. Only available in development mode.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizations list',
    type: [Organization],
  })
  @ApiResponse({ status: 403, description: 'Not available in production' })
  async findAll(): Promise<Organization[]> {
    // Only allow in development/staging environments
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv === 'production') {
      throw new BadRequestException(
        'This endpoint is not available in production',
      );
    }

    const organizations =
      await this.organizationsService.findAllForDevelopment();

    // Return only public information for security
    return organizations.map(
      (organization) =>
        ({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
          favicon: organization.favicon,
          website: organization.website,
          settings: organization.settings,
          customDomain: organization.customDomain,
          domainVerified: organization.domainVerified,
          createdAt: organization.createdAt,
          updatedAt: organization.updatedAt,
        }) as Organization,
    );
  }
}
