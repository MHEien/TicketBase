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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageQueryDto } from './dto/page-query.dto';

@Controller('pages')
@UseGuards(JwtAuthGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  async create(@Body() createPageDto: CreatePageDto, @Request() req) {
    return this.pagesService.create(
      createPageDto,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get()
  async findAll(@Query() query: PageQueryDto, @Request() req) {
    return this.pagesService.findAll(req.user.organizationId, query);
  }

  @Get('homepage')
  async getHomepage(@Request() req) {
    return this.pagesService.getHomepage(req.user.organizationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.pagesService.findOne(id, req.user.organizationId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @Request() req,
  ) {
    return this.pagesService.update(
      id,
      updatePageDto,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string, @Request() req) {
    return this.pagesService.publish(id, req.user.organizationId, req.user.id);
  }

  @Patch(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string, @Request() req) {
    return this.pagesService.unpublish(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string, @Request() req) {
    return this.pagesService.duplicate(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    return this.pagesService.remove(id, req.user.organizationId, req.user.id);
  }
}
