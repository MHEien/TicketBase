import {
  Controller,
  All,
  Param,
  Req,
  Res,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PluginsService } from './plugins.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@ApiTags('plugin-proxy')
@Controller('api/plugins/proxy')
export class PluginProxyController {
  private readonly logger = new Logger(PluginProxyController.name);
  
  constructor(
    private readonly pluginsService: PluginsService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  
  @All(':pluginId/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Proxy requests to the plugin server' })
  @ApiParam({ name: 'pluginId', description: 'Plugin ID to route the request to' })
  async proxyRequest(
    @Param('pluginId') pluginId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // Find the plugin
      const plugin = await this.pluginsService.findOne(pluginId);
      if (!plugin) {
        throw new NotFoundException(`Plugin with ID ${pluginId} not found`);
      }
      
      // Check if plugin is active
      if (plugin.status !== 'active') {
        throw new BadRequestException(`Plugin with ID ${pluginId} is not active`);
      }
      
      // Get the original URL and extract the path after the pluginId
      const originalUrl = req.originalUrl;
      const pathMatch = originalUrl.match(new RegExp(`/api/plugins/proxy/${pluginId}(.*)`));
      
      if (!pathMatch || !pathMatch[1]) {
        throw new BadRequestException('Invalid plugin proxy path');
      }
      
      // Extract the path to forward
      const pathToForward = pathMatch[1];
      
      // Get plugin server URL from environment
      const pluginServerUrl = this.configService.get<string>('plugins.serverUrl');
      if (!pluginServerUrl) {
        throw new InternalServerErrorException('Plugin server URL not configured');
      }
      
      // Construct full URL to forward to
      const targetUrl = `${pluginServerUrl}/${plugin.category}/${plugin.name}${pathToForward}`;
      
      this.logger.log(`Proxying request to: ${targetUrl}`);
      
      // Forward the request with all headers, query parameters, and body
      const { method, headers, query, body } = req;
      
      // Remove host header to avoid conflicts
      const forwardHeaders = { ...headers };
      delete forwardHeaders.host;
      
      // Add plugin-specific headers
      forwardHeaders['x-plugin-id'] = pluginId;
      forwardHeaders['x-plugin-version'] = plugin.version;
      
      // Forward organization ID from user if available
      if (req.user && req.user['organizationId']) {
        forwardHeaders['x-organization-id'] = req.user['organizationId'];
      }
      
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url: targetUrl,
          headers: forwardHeaders,
          params: query,
          data: body,
          responseType: 'arraybuffer', // To support binary responses
          maxRedirects: 5,
        }).pipe(
          catchError(error => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              this.logger.error(`Plugin server responded with error: ${error.response.status}`);
              throw new InternalServerErrorException(
                `Plugin request failed with status ${error.response.status}`
              );
            } else if (error.request) {
              // The request was made but no response was received
              this.logger.error('No response received from plugin server');
              throw new InternalServerErrorException('No response from plugin server');
            } else {
              // Something happened in setting up the request that triggered an Error
              this.logger.error(`Error making request to plugin server: ${error.message}`);
              throw new InternalServerErrorException('Error proxying request to plugin server');
            }
          })
        )
      );
      
      // Forward the response back to the client
      const responseHeaders = { ...response.headers };
      
      // Set response headers
      Object.keys(responseHeaders).forEach(key => {
        res.setHeader(key, responseHeaders[key]);
      });
      
      // Send status and body
      return res.status(response.status).send(response.data);
    } catch (error) {
      this.logger.error(`Error proxying request: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException ||
          error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to proxy request to plugin server');
    }
  }
} 