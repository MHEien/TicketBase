import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageQueryDto } from './dto/page-query.dto';

@ApiTags('Pages')
@ApiBearerAuth()
@Controller('pages')
@UseGuards(JwtAuthGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new page' })
  @ApiBody({ type: CreatePageDto })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createPageDto: CreatePageDto, @Request() req) {
    return this.pagesService.create(
      createPageDto,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all pages for the organization' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['draft', 'published', 'archived'],
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isHomepage', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'List of pages returned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: PageQueryDto, @Request() req) {
    return this.pagesService.findAll(req.user.organizationId, query);
  }

  @Get('homepage')
  @ApiOperation({ summary: 'Get the homepage for the organization' })
  @ApiResponse({ status: 200, description: 'Homepage returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHomepage(@Request() req) {
    return this.pagesService.getHomepage(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a page by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Page returned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid page ID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(
        'Invalid page ID format. Expected a valid UUID.',
      );
    }
    return this.pagesService.findOne(id, req.user.organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a page by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePageDto })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @Request() req,
  ) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(
        'Invalid page ID format. Expected a valid UUID.',
      );
    }
    return this.pagesService.update(
      id,
      updatePageDto,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish a page by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Page published successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string, @Request() req) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(
        'Invalid page ID format. Expected a valid UUID.',
      );
    }
    return this.pagesService.publish(id, req.user.organizationId, req.user.id);
  }

  @Patch(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a page by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Page unpublished successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string, @Request() req) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(
        'Invalid page ID format. Expected a valid UUID.',
      );
    }
    return this.pagesService.unpublish(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a page by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 201, description: 'Page duplicated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async duplicate(@Param('id') id: string, @Request() req) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(
        'Invalid page ID format. Expected a valid UUID.',
      );
    }
    return this.pagesService.duplicate(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a page by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Page deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(
        'Invalid page ID format. Expected a valid UUID.',
      );
    }
    return this.pagesService.remove(id, req.user.organizationId, req.user.id);
  }
}
