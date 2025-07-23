import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { PageStatus } from './entities/page.entity';

@Controller('public/pages')
export class PublicPagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('by-slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Query('organizationId') organizationId: string,
  ) {
    if (!organizationId) {
      throw new NotFoundException('Organization ID is required');
    }

    return this.pagesService.findBySlug(slug, organizationId);
  }

  @Get('homepage')
  async getHomepage(@Query('organizationId') organizationId: string) {
    if (!organizationId) {
      throw new NotFoundException('Organization ID is required');
    }

    const homepage = await this.pagesService.getHomepage(organizationId);
    if (!homepage) {
      throw new NotFoundException('No homepage found for this organization');
    }

    return homepage;
  }

  @Get()
  async findPublishedPages(@Query('organizationId') organizationId: string) {
    if (!organizationId) {
      throw new NotFoundException('Organization ID is required');
    }

    return this.pagesService.findAll(organizationId, {
      status: PageStatus.PUBLISHED,
      page: 1,
      limit: 100, // Get all published pages
      sortBy: 'sortOrder',
      sortOrder: 'ASC',
    });
  }
}
