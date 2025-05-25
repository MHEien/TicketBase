import { 
  Controller, 
  Post, 
  Param, 
  Headers, 
  Body, 
  NotFoundException, 
  InternalServerErrorException
} from '@nestjs/common';
import { PluginsService } from './plugins.service';
import axios from 'axios';

@Controller('webhooks/plugins')
export class WebhookController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Post(':pluginId')
  async handleWebhook(
    @Param('pluginId') pluginId: string,
    @Headers() headers: Record<string, string>,
    @Body() body: any
  ) {
    try {
      // Verify plugin exists
      const plugin = await this.pluginsService.findById(pluginId);
      
      // Forward webhook to plugin's webhook handler
      // In production, this URL would be dynamically configured based on plugin registration
      const webhookUrl = `https://api.plugin-service.example.com/${pluginId}/webhook`;
      
      try {
        const response = await axios.post(webhookUrl, body, {
          headers,
        });
        
        return response.data;
      } catch (error: any) {
        if (error.response) {
          // Forward the plugin service's error response
          throw new InternalServerErrorException(error.response.data);
        }
        throw new InternalServerErrorException('Error connecting to plugin service');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Plugin ${pluginId} not found`);
      }
      throw error;
    }
  }
} 