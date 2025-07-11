import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from './entities/event.entity';
import { ImageStorageService } from './services/image-storage.service';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.create(organizationId, userId, createEventDto);
  }

  @Get()
  findAll(@Request() req, @Query() query) {
    const organizationId = req.user.organizationId;
    const options = {};

    if (query.status && Object.values(EventStatus).includes(query.status)) {
      options['status'] = query.status;
    }

    if (query.category) {
      options['category'] = query.category;
    }

    if (query.search) {
      options['search'] = query.search;
    }

    if (query.startDate && !isNaN(new Date(query.startDate).getTime())) {
      options['startDate'] = new Date(query.startDate);
    }

    if (query.endDate && !isNaN(new Date(query.endDate).getTime())) {
      options['endDate'] = new Date(query.endDate);
    }

    if (query.upcoming === 'true') {
      options['upcoming'] = true;
    }

    if (query.limit && !isNaN(parseInt(query.limit))) {
      options['limit'] = parseInt(query.limit);
    }

    return this.eventsService.findAll(organizationId, options);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return this.eventsService.findOne(id, organizationId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.update(
      id,
      organizationId,
      userId,
      updateEventDto,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.remove(id, organizationId, userId);
  }

  @Post(':id/publish')
  publish(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.publish(id, organizationId, userId);
  }

  @Post(':id/cancel')
  cancel(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.cancel(id, organizationId, userId);
  }

  // Image upload endpoints
  @Post(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(
    @Request() req,
    @Param('id') eventId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const organizationId = req.user.organizationId;

    // For draft events (temporary IDs), skip the existence check
    // For real events, verify event exists and user has access
    if (!eventId.startsWith('draft-')) {
      await this.eventsService.findOne(eventId, organizationId);
    }

    const imageUrl = await this.imageStorageService.storeEventImage(
      organizationId,
      eventId,
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return {
      success: true,
      imageUrl,
      message: 'Image uploaded successfully',
    };
  }
}
