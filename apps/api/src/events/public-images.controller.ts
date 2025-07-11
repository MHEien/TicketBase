import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { ImageStorageService } from './services/image-storage.service';

@Controller('events') // [[memory:2891758]]
export class PublicImagesController {
  constructor(private readonly imageStorageService: ImageStorageService) {}

  // Public image serving endpoint (no authentication required)
  @Get('images/*')
  async serveImage(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract the path after /api/events/images/
      const fullPath = req.path;
      const imagePath = fullPath.replace('/api/events/images/', '');
      console.log('🖼️ Full request path:', fullPath);
      console.log('🖼️ Extracted image path:', imagePath);

      const stream =
        await this.imageStorageService.getEventImageStream(imagePath);

      // Set appropriate headers
      res.set({
        'Content-Type': 'image/*', // Will be overridden by actual content type from MinIO
        'Cache-Control': 'max-age=31536000, public',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      });

      // Pipe the stream to the response
      stream.pipe(res);
    } catch {
      res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }
  }
}
