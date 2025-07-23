import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Page, PageStatus } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async create(
    createPageDto: CreatePageDto,
    organizationId: string,
    userId: string,
  ): Promise<Page> {
    // Check if slug already exists for this organization
    const existingPage = await this.pageRepository.findOne({
      where: {
        organizationId,
        slug: createPageDto.slug,
      },
    });

    if (existingPage) {
      throw new ConflictException(
        `Page with slug '${createPageDto.slug}' already exists`,
      );
    }

    // If setting as homepage, unset any existing homepage
    if (createPageDto.isHomepage) {
      await this.pageRepository.update(
        { organizationId, isHomepage: true },
        { isHomepage: false },
      );
    }

    const page = this.pageRepository.create({
      ...createPageDto,
      organizationId,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedPage = await this.pageRepository.save(page);

    // Log activity
    await this.activitiesService.logActivity({
      type: 'CREATE' as any,
      description: `Created page "${savedPage.title}"`,
      entityType: 'page',
      entityId: savedPage.id,
      organizationId,
      userId,
      metadata: {
        pageTitle: savedPage.title,
        pageSlug: savedPage.slug,
        status: savedPage.status,
      },
    });

    return savedPage;
  }

  async findAll(
    organizationId: string,
    query: PageQueryDto,
  ): Promise<{ pages: Page[]; total: number; totalPages: number }> {
    const {
      status,
      search,
      isHomepage,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: any = { organizationId };

    if (status) {
      where.status = status;
    }

    if (isHomepage !== undefined) {
      where.isHomepage = isHomepage;
    }

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    const findOptions: FindManyOptions<Page> = {
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [pages, total] = await this.pageRepository.findAndCount(findOptions);

    return {
      pages,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, organizationId: string): Promise<Page> {
    const page = await this.pageRepository.findOne({
      where: { id, organizationId },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }

    return page;
  }

  async findBySlug(slug: string, organizationId: string): Promise<Page> {
    const page = await this.pageRepository.findOne({
      where: { slug, organizationId, status: PageStatus.PUBLISHED },
    });

    if (!page) {
      throw new NotFoundException(`Page with slug '${slug}' not found`);
    }

    return page;
  }

  async getHomepage(organizationId: string): Promise<Page | null> {
    return this.pageRepository.findOne({
      where: {
        organizationId,
        isHomepage: true,
        status: PageStatus.PUBLISHED,
      },
    });
  }

  async update(
    id: string,
    updatePageDto: UpdatePageDto,
    organizationId: string,
    userId: string,
  ): Promise<Page> {
    const page = await this.findOne(id, organizationId);

    // Check slug uniqueness if slug is being updated
    if (updatePageDto.slug && updatePageDto.slug !== page.slug) {
      const existingPage = await this.pageRepository.findOne({
        where: {
          organizationId,
          slug: updatePageDto.slug,
        },
      });

      if (existingPage) {
        throw new ConflictException(
          `Page with slug '${updatePageDto.slug}' already exists`,
        );
      }
    }

    // If setting as homepage, unset any existing homepage
    if (updatePageDto.isHomepage && !page.isHomepage) {
      await this.pageRepository.update(
        { organizationId, isHomepage: true },
        { isHomepage: false },
      );
    }

    // Update the page
    await this.pageRepository.update(id, {
      ...updatePageDto,
      updatedBy: userId,
    });

    const updatedPage = await this.findOne(id, organizationId);

    // Log activity
    await this.activitiesService.logActivity({
      type: 'UPDATE' as any,
      description: `Updated page "${updatedPage.title}"`,
      entityType: 'page',
      entityId: updatedPage.id,
      organizationId,
      userId,
      metadata: {
        pageTitle: updatedPage.title,
        pageSlug: updatedPage.slug,
        status: updatedPage.status,
        changes: updatePageDto,
      },
    });

    return updatedPage;
  }

  async publish(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Page> {
    const page = await this.findOne(id, organizationId);

    if (page.status === PageStatus.PUBLISHED) {
      throw new BadRequestException('Page is already published');
    }

    await this.pageRepository.update(id, {
      status: PageStatus.PUBLISHED,
      updatedBy: userId,
    });

    const publishedPage = await this.findOne(id, organizationId);

    // Log activity
    await this.activitiesService.logActivity({
      type: 'UPDATE' as any,
      description: `Published page "${publishedPage.title}"`,
      entityType: 'page',
      entityId: publishedPage.id,
      organizationId,
      userId,
      metadata: {
        pageTitle: publishedPage.title,
        pageSlug: publishedPage.slug,
      },
    });

    return publishedPage;
  }

  async unpublish(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Page> {
    const page = await this.findOne(id, organizationId);

    if (page.status !== PageStatus.PUBLISHED) {
      throw new BadRequestException('Page is not published');
    }

    await this.pageRepository.update(id, {
      status: PageStatus.DRAFT,
      updatedBy: userId,
    });

    const unpublishedPage = await this.findOne(id, organizationId);

    // Log activity
    await this.activitiesService.logActivity({
      type: 'UPDATE' as any,
      description: `Unpublished page "${unpublishedPage.title}"`,
      entityType: 'page',
      entityId: unpublishedPage.id,
      organizationId,
      userId,
      metadata: {
        pageTitle: unpublishedPage.title,
        pageSlug: unpublishedPage.slug,
      },
    });

    return unpublishedPage;
  }

  async remove(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<void> {
    const page = await this.findOne(id, organizationId);

    await this.pageRepository.remove(page);

    // Log activity
    await this.activitiesService.logActivity({
      type: 'DELETE' as any,
      description: `Deleted page "${page.title}"`,
      entityType: 'page',
      entityId: page.id,
      organizationId,
      userId,
      metadata: {
        pageTitle: page.title,
        pageSlug: page.slug,
      },
    });
  }

  async duplicate(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Page> {
    const originalPage = await this.findOne(id, organizationId);

    // Generate a unique slug for the duplicate
    let duplicateSlug = `${originalPage.slug}-copy`;
    let counter = 1;

    while (
      await this.pageRepository.findOne({
        where: { organizationId, slug: duplicateSlug },
      })
    ) {
      duplicateSlug = `${originalPage.slug}-copy-${counter}`;
      counter++;
    }

    const duplicatePage = this.pageRepository.create({
      title: `${originalPage.title} (Copy)`,
      slug: duplicateSlug,
      description: originalPage.description,
      content: originalPage.content,
      status: PageStatus.DRAFT,
      isHomepage: false, // Never duplicate as homepage
      seoTitle: originalPage.seoTitle,
      seoDescription: originalPage.seoDescription,
      seoKeywords: originalPage.seoKeywords,
      featuredImage: originalPage.featuredImage,
      metadata: originalPage.metadata,
      sortOrder: originalPage.sortOrder,
      organizationId,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedPage = await this.pageRepository.save(duplicatePage);

    // Log activity
    await this.activitiesService.logActivity({
      type: 'CREATE' as any,
      description: `Duplicated page "${originalPage.title}" as "${savedPage.title}"`,
      entityType: 'page',
      entityId: savedPage.id,
      organizationId,
      userId,
      metadata: {
        originalPageId: originalPage.id,
        originalPageTitle: originalPage.title,
        newPageTitle: savedPage.title,
        newPageSlug: savedPage.slug,
      },
    });

    return savedPage;
  }
}
