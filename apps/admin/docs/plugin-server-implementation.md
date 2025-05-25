# Plugin Server Implementation Guide

This document explains how to implement plugin bundle serving using our NestJS plugin server and MinIO storage.

## Architecture Overview

For our dynamic plugin system, we need to:

1. **Store** plugin bundles in MinIO
2. **Serve** them via HTTP endpoints
3. **Load** them in the Next.js application using dynamic imports

## MinIO Configuration

### 1. Create a Plugin Bundles Bucket

```bash
# Using MinIO client
mc mb minio/plugin-bundles

# Set proper CORS policy for the bucket
mc admin policy set download minio/plugin-bundles
```

### 2. Configure CORS for the Bucket

Create a `cors.json` file:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "Content-Length"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

Apply the CORS policy:

```bash
mc admin config set minio/plugin-bundles cors.json
```

## NestJS Plugin Server Implementation

### 1. Plugin Storage Service

Create a service to handle plugin bundle storage in MinIO:

```typescript
// src/plugins/plugin-storage.service.ts
import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PluginStorageService {
  private readonly bucketName = 'plugin-bundles';
  
  constructor(private readonly minioService: MinioService) {}
  
  async storePluginBundle(
    pluginId: string, 
    version: string, 
    bundleBuffer: Buffer,
    contentType = 'application/javascript'
  ): Promise<string> {
    const objectKey = `${pluginId}/v${version}/bundle.js`;
    
    await this.minioService.client.putObject(
      this.bucketName,
      objectKey,
      bundleBuffer,
      {
        'Content-Type': contentType,
        'Cache-Control': 'max-age=31536000, immutable', // Long cache for versioned bundles
      }
    );
    
    // Generate public URL for the plugin bundle
    const bundleUrl = `${process.env.PLUGIN_SERVER_URL}/plugins/bundles/${pluginId}/v${version}/bundle.js`;
    
    return bundleUrl;
  }
  
  async getPluginBundleStream(pluginId: string, version: string) {
    const objectKey = `${pluginId}/v${version}/bundle.js`;
    return this.minioService.client.getObject(this.bucketName, objectKey);
  }
}
```

### 2. Bundle Serving Controller

Create a controller to serve plugin bundles:

```typescript
// src/plugins/bundle.controller.ts
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { PluginStorageService } from './plugin-storage.service';

@Controller('plugins/bundles')
export class PluginBundleController {
  constructor(private readonly pluginStorageService: PluginStorageService) {}
  
  @Get(':pluginId/v:version/bundle.js')
  async servePluginBundle(
    @Param('pluginId') pluginId: string,
    @Param('version') version: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Set appropriate headers for JavaScript
    res.set({
      'Content-Type': 'application/javascript',
      'Cache-Control': 'max-age=31536000, immutable', // Long cache for versioned bundles
    });
    
    // Get bundle stream from MinIO
    const stream = await this.pluginStorageService.getPluginBundleStream(pluginId, version);
    
    // Return the stream as a StreamableFile
    return new StreamableFile(stream);
  }
}
```

### 3. Plugin Upload Handling

Update your plugin installation logic to handle the bundling process:

```typescript
// src/plugins/plugins.service.ts
@Injectable()
export class PluginsService {
  constructor(
    private readonly pluginStorageService: PluginStorageService,
    @InjectModel('Plugin') private readonly pluginModel: Model<Plugin>,
    @InjectModel('TenantPlugin') private readonly tenantPluginModel: Model<TenantPlugin>,
  ) {}
  
  async uploadPlugin(
    file: Express.Multer.File, 
    metadata: PluginMetadata
  ): Promise<Plugin> {
    // Store the plugin bundle in MinIO
    const bundleUrl = await this.pluginStorageService.storePluginBundle(
      metadata.id,
      metadata.version,
      file.buffer
    );
    
    // Create a new plugin document with the bundle URL
    const plugin = new this.pluginModel({
      ...metadata,
      bundleUrl, // URL to the plugin bundle
      createdAt: new Date(),
    });
    
    // Save to MongoDB
    await plugin.save();
    
    return plugin;
  }
  
  // Other methods...
}
```

## Plugin Installation Process

The complete plugin installation process should:

1. Receive plugin bundle (uploaded ZIP or JS file)
2. Validate the plugin bundle
3. Extract metadata from the plugin
4. Store the bundle in MinIO
5. Register the plugin in MongoDB
6. Return the bundleUrl to use in the frontend

## Testing Your Setup

1. Create a test plugin using the webpack configuration template
2. Build the plugin bundle
3. Upload it to your plugin server
4. Update your plugin model to include the new `bundleUrl` and `extensionPoints` fields
5. Try loading the plugin in your Next.js application

## Next Steps

- Implement plugin validation (security checks, structure verification)
- Add version management for plugins
- Create a plugin marketplace UI in your admin dashboard
- Add tenant-specific plugin configuration

## Example: Manually Testing a Plugin

1. Build a test plugin:
   ```bash
   cd my-test-plugin
   npm run build
   ```

2. Upload to your plugin server:
   ```bash
   curl -X POST http://localhost:4000/plugins/upload \
     -F "file=@dist/plugin.js" \
     -F "metadata={\"id\":\"test-plugin\",\"name\":\"Test Plugin\",\"version\":\"1.0.0\",\"description\":\"A test plugin\",\"category\":\"payment\",\"extensionPoints\":[\"payment-methods\"]}"
   ```

3. Install the plugin for a tenant:
   ```bash
   curl -X POST http://localhost:4000/plugins/install \
     -H "x-tenant-id: your-tenant-id" \
     -d "{\"pluginId\":\"test-plugin\"}"
   ```

4. Verify it works in your Next.js application by checking the extension point renders correctly 