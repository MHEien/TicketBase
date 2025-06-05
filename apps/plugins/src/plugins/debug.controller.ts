import { Controller, Get, Logger } from '@nestjs/common';
import { PluginStorageService } from './services/plugin-storage.service';
import { Public } from '../common/auth/decorators/public.decorator';

@Controller('debug')
export class DebugController {
  private readonly logger = new Logger(DebugController.name);

  constructor(private readonly pluginStorageService: PluginStorageService) {}

  @Public()
  @Get('storage/list')
  async listAllObjects() {
    try {
      const objects = await this.pluginStorageService.debugListAllObjects();
      return {
        success: true,
        objects: objects.map((obj) => ({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
        })),
      };
    } catch (error) {
      this.logger.error(`Debug list objects failed: ${error.message}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Public()
  @Get('storage/health')
  async checkStorageHealth() {
    try {
      const health = await this.pluginStorageService.checkStorageConnection();
      return health;
    } catch (error) {
      return {
        isConnected: false,
        message: error.message,
      };
    }
  }
}
