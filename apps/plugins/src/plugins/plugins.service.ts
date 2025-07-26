import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plugin, PluginDocument } from './schemas/plugin.schema';
import {
  InstalledPlugin,
  InstalledPluginDocument,
} from './schemas/installed-plugin.schema';
import {
  PluginRating,
  PluginRatingDocument,
} from './schemas/plugin-rating.schema';
import { BundleService } from './services/bundle.service';
import { PluginStorageService } from './services/plugin-storage.service';
import { SecureConfigService } from './services/secure-config.service';
import { GitHubBuildService } from './services/github-build.service';
import { ConfigService } from '@nestjs/config';
import * as JSZip from 'jszip';

@Injectable()
export class PluginsService {
  private readonly logger = new Logger(PluginsService.name);

  constructor(
    @InjectModel(Plugin.name) private pluginModel: Model<PluginDocument>,
    @InjectModel(InstalledPlugin.name)
    private installedPluginModel: Model<InstalledPluginDocument>,
    @InjectModel(PluginRating.name)
    private pluginRatingModel: Model<PluginRatingDocument>,
    private bundleService: BundleService,
    private pluginStorageService: PluginStorageService,
    private secureConfigService: SecureConfigService,
    private githubBuildService: GitHubBuildService,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<PluginDocument[]> {
    return this.pluginModel.find().exec();
  }

  async findById(id: string): Promise<PluginDocument> {
    const plugin = await this.pluginModel.findOne({ id }).exec();
    if (!plugin) {
      throw new NotFoundException(`Plugin with ID ${id} not found`);
    }
    return plugin;
  }

  async getInstalledPlugins(tenantId: string): Promise<any[]> {
    // Get all installed plugins for this tenant with populated plugin data
    const installed = await this.installedPluginModel.find({ tenantId }).exec();

    // Map to full plugin data
    const installedWithData = await Promise.all(
      installed.map(async (item) => {
        const plugin = await this.pluginModel.findById(item.pluginId).exec();
        if (!plugin) return null;

        return {
          ...plugin.toObject(),
          enabled: item.enabled,
          tenantId: item.tenantId,
          configuration: item.configuration,
          installedAt: item.installedAt || item.createdAt,
          updatedAt: item.updatedAt,
        };
      }),
    );

    return installedWithData.filter(Boolean);
  }

  async installPlugin(tenantId: string, pluginId: string): Promise<any> {
    // Verify plugin exists
    const plugin = await this.findById(pluginId);

    // Check if already installed
    const existing = await this.installedPluginModel
      .findOne({
        tenantId,
        pluginId: plugin._id,
      })
      .exec();

    if (existing) {
      throw new BadRequestException(
        `Plugin ${pluginId} is already installed for tenant ${tenantId}`,
      );
    }

    // Install plugin
    const installed = await this.installedPluginModel.create({
      tenantId,
      pluginId: plugin._id,
      enabled: true,
      configuration: {},
      installedAt: new Date(),
    });

    // Update plugin install count
    await this.updatePluginInstallCount(pluginId);

    return {
      ...plugin.toObject(),
      enabled: installed.enabled,
      tenantId,
      configuration: installed.configuration,
      installedAt: installed.installedAt,
      updatedAt: installed.updatedAt,
    };
  }

  async uninstallPlugin(tenantId: string, pluginId: string): Promise<void> {
    const plugin = await this.findById(pluginId);

    const result = await this.installedPluginModel
      .deleteOne({
        tenantId,
        pluginId: plugin._id,
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Plugin ${pluginId} is not installed for tenant ${tenantId}`,
      );
    }

    // Update plugin install count (decrement)
    await this.updatePluginInstallCount(pluginId, -1);
  }

  /**
   * Update plugin install count
   * @param pluginId - The plugin ID
   * @param increment - The amount to increment (default 1, use -1 to decrement)
   */
  private async updatePluginInstallCount(
    pluginId: string,
    increment: number = 1,
  ): Promise<void> {
    try {
      const plugin = await this.pluginModel.findOne({ id: pluginId }).exec();
      if (plugin) {
        const currentCount = plugin.metadata?.installCount || 0;
        const newCount = Math.max(0, currentCount + increment); // Ensure count doesn't go below 0

        await this.pluginModel
          .updateOne(
            { id: pluginId },
            {
              $set: {
                'metadata.installCount': newCount,
                'metadata.lastUpdated': new Date().toISOString(),
              },
            },
          )
          .exec();
      }
    } catch (error) {
      this.logger.warn(
        `Failed to update install count for plugin ${pluginId}:`,
        error,
      );
    }
  }

  async updatePluginConfig(
    tenantId: string,
    pluginId: string,
    config: Record<string, any>,
    auditContext?: { userId?: string; ipAddress?: string; userAgent?: string },
  ): Promise<any> {
    const plugin = await this.findById(pluginId);

    const installed = await this.installedPluginModel
      .findOne({
        tenantId,
        pluginId: plugin._id,
      })
      .exec();

    if (!installed) {
      throw new NotFoundException(
        `Plugin ${pluginId} is not installed for tenant ${tenantId}`,
      );
    }

    // Get plugin schema for sensitive field detection
    const configSchema = plugin.metadata?.configSchema;

    // Save configuration using secure config service
    await this.secureConfigService.savePluginConfig(
      tenantId,
      pluginId,
      plugin.version,
      config,
      configSchema,
      auditContext,
    );

    // Update the installed plugin's updatedAt timestamp
    installed.updatedAt = new Date();
    await installed.save();

    // Return updated plugin data with the configuration
    return {
      ...plugin.toObject(),
      enabled: installed.enabled,
      tenantId,
      configuration: config, // Return the config as-is (SecureConfigService handles security)
      installedAt: installed.installedAt,
      updatedAt: installed.updatedAt,
    };
  }

  async getPluginConfig(
    tenantId: string,
    pluginId: string,
    auditContext?: { userId?: string; ipAddress?: string; userAgent?: string },
  ): Promise<Record<string, any> | null> {
    // Verify plugin exists and is installed
    const plugin = await this.findById(pluginId);

    const installed = await this.installedPluginModel
      .findOne({
        tenantId,
        pluginId: plugin._id,
      })
      .exec();

    if (!installed) {
      throw new NotFoundException(
        `Plugin ${pluginId} is not installed for tenant ${tenantId}`,
      );
    }

    // Get configuration using secure config service
    const config = await this.secureConfigService.getPluginConfig(
      tenantId,
      pluginId,
      auditContext,
    );

    return config || {};
  }

  async setPluginEnabled(
    tenantId: string,
    pluginId: string,
    enabled: boolean,
  ): Promise<any> {
    const plugin = await this.findById(pluginId);

    const installed = await this.installedPluginModel
      .findOne({
        tenantId,
        pluginId: plugin._id,
      })
      .exec();

    if (!installed) {
      throw new NotFoundException(
        `Plugin ${pluginId} is not installed for tenant ${tenantId}`,
      );
    }

    installed.enabled = enabled;
    installed.updatedAt = new Date();
    await installed.save();

    return {
      ...plugin.toObject(),
      enabled: installed.enabled,
      tenantId,
      configuration: installed.configuration,
      installedAt: installed.installedAt,
      updatedAt: installed.updatedAt,
    };
  }

  async createPlugin(
    id: string,
    name: string,
    version: string,
    description: string,
    category: string,
    sourceCode: string,
    requiredPermissions: string[] = [],
    bundleUrl?: string,
    providedExtensionPoints?: string[],
    configSchema?: any,
  ): Promise<PluginDocument> {
    this.logger.log(`Creating plugin ${id} v${version}`);

    // Use provided extension points if available, otherwise analyze bundle
    let extensionPoints: string[];
    let metadata: any;

    if (providedExtensionPoints && providedExtensionPoints.length > 0) {
      // Use the provided extension points (from plugin.json)
      extensionPoints = providedExtensionPoints;
      this.logger.log(
        `Using provided extension points: ${extensionPoints.join(', ')}`,
      );

      // Create basic metadata including configSchema
      metadata = {
        installCount: 0,
        lastUpdated: new Date().toISOString(),
        ...(configSchema && { configSchema }),
      };
    } else {
      // Validate plugin structure only when analyzing source code
      const isValid =
        await this.bundleService.validatePluginStructure(sourceCode);
      if (!isValid) {
        throw new BadRequestException('Invalid plugin structure');
      }

      // Analyze plugin bundle to extract metadata and extension points
      const analyzed = await this.bundleService.analyzeBundle(sourceCode);
      extensionPoints = analyzed.extensionPoints;
      metadata = analyzed.metadata;
      this.logger.log(
        `Analyzed extension points from source: ${extensionPoints.join(', ')}`,
      );
    }

    let finalBundleUrl = bundleUrl;

    // If bundleUrl is not provided, we need to generate and store the bundle
    if (!finalBundleUrl) {
      try {
        // Check MinIO connection first
        const storageStatus =
          await this.pluginStorageService.checkStorageConnection();
        if (!storageStatus.isConnected) {
          throw new Error(storageStatus.message);
        }

        // Generate the bundle from source
        const bundleBuffer = await this.bundleService.generateBundleBuffer(
          id,
          sourceCode,
        );

        // Store the bundle in MinIO and get the URL
        finalBundleUrl = await this.pluginStorageService.storePluginBundle(
          id,
          version,
          bundleBuffer,
          'application/javascript',
        );
      } catch (error) {
        this.logger.error(
          `Failed to store plugin bundle: ${error.message}`,
          error,
        );
        throw new BadRequestException(
          `Failed to store plugin bundle: ${error.message}. ` +
            `Make sure MinIO is running and properly configured in your .env file. ` +
            `You can also provide a bundleUrl directly.`,
        );
      }
    }

    if (!finalBundleUrl) {
      throw new BadRequestException(
        'Bundle URL is required. Either provide it directly in your request or ' +
          'ensure your MinIO storage service is properly configured and running.',
      );
    }

    // Create the plugin
    const plugin = await this.pluginModel.create({
      id,
      name,
      version,
      description,
      category,
      bundleUrl: finalBundleUrl,
      extensionPoints,
      metadata,
      requiredPermissions,
    });

    this.logger.log(`Plugin ${id} v${version} created successfully`);
    return plugin;
  }

  async updatePlugin(
    id: string,
    updates: {
      name?: string;
      version?: string;
      description?: string;
      category?: string;
      sourceCode?: string;
      requiredPermissions?: string[];
    },
  ): Promise<PluginDocument> {
    this.logger.log(`Updating plugin ${id}`);
    const plugin = await this.findById(id);
    const updateData: any = {};

    // Update basic properties
    if (updates.name) updateData.name = updates.name;
    if (updates.version) updateData.version = updates.version;
    if (updates.description) updateData.description = updates.description;
    if (updates.category) updateData.category = updates.category;
    if (updates.requiredPermissions)
      updateData.requiredPermissions = updates.requiredPermissions;

    // If source code is updated, recompile and update bundle/metadata
    if (updates.sourceCode) {
      this.logger.log(`Recompiling plugin ${id} with new source code`);

      // Validate plugin structure
      const isValid = await this.bundleService.validatePluginStructure(
        updates.sourceCode,
      );
      if (!isValid) {
        throw new BadRequestException('Invalid plugin structure');
      }

      // Analyze plugin bundle to extract metadata and extension points
      const { extensionPoints, metadata } =
        await this.bundleService.analyzeBundle(updates.sourceCode);

      // Version is required for storage
      const version = updates.version || plugin.version;

      // Generate the bundle from source
      const bundleBuffer = await this.bundleService.generateBundleBuffer(
        id,
        updates.sourceCode,
      );

      // Store the bundle in MinIO and get the URL
      const bundleUrl = await this.pluginStorageService.storePluginBundle(
        id,
        version,
        bundleBuffer,
        'application/javascript',
      );

      // Update with new bundle data
      updateData.bundleUrl = bundleUrl;
      updateData.extensionPoints = extensionPoints;
      updateData.metadata = metadata;

      // Update version if not already specified
      if (!updates.version) {
        updateData.version = version;
      }
    }

    // Apply updates
    await this.pluginModel.updateOne({ id }, { $set: updateData }).exec();

    // Return updated plugin
    return this.findById(id);
  }

  async getPluginsByExtensionPoint(
    extensionPoint: string,
  ): Promise<PluginDocument[]> {
    return this.pluginModel
      .find({
        extensionPoints: extensionPoint,
      })
      .exec();
  }

  /**
   * Check MinIO storage health
   * @returns Object with MinIO connection status and optional message
   */
  async checkStorageHealth(): Promise<{
    isConnected: boolean;
    message?: string;
  }> {
    return this.pluginStorageService.checkStorageConnection();
  }

  /**
   * Store a plugin bundle directly in MinIO
   * @param pluginId - The ID of the plugin
   * @param version - The version of the plugin
   * @param bundleBuffer - The plugin bundle file as a Buffer
   * @returns URL to the stored bundle
   */
  async storePluginBundle(
    pluginId: string,
    version: string,
    bundleBuffer: Buffer,
  ): Promise<string> {
    return this.pluginStorageService.storePluginBundle(
      pluginId,
      version,
      bundleBuffer,
      'application/javascript',
    );
  }

  /**
   * Submit a rating for a plugin
   * @param pluginId - The plugin ID
   * @param tenantId - The tenant ID
   * @param userId - The user ID
   * @param rating - The rating (1-5)
   * @param review - Optional review text
   */
  async submitRating(
    pluginId: string,
    tenantId: string,
    userId: string,
    rating: number,
    review?: string,
  ): Promise<PluginRatingDocument> {
    // Verify plugin exists
    await this.findById(pluginId);

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Create or update rating
    const existingRating = await this.pluginRatingModel
      .findOne({ pluginId, tenantId, userId })
      .exec();

    let ratingDoc: PluginRatingDocument;
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      existingRating.updatedAt = new Date();
      ratingDoc = await existingRating.save();
    } else {
      ratingDoc = await this.pluginRatingModel.create({
        pluginId,
        tenantId,
        userId,
        rating,
        review,
      });
    }

    // Update plugin average rating
    await this.updatePluginAverageRating(pluginId);

    return ratingDoc;
  }

  /**
   * Get ratings for a plugin
   * @param pluginId - The plugin ID
   * @returns Array of ratings
   */
  async getPluginRatings(pluginId: string): Promise<PluginRatingDocument[]> {
    return this.pluginRatingModel.find({ pluginId }).exec();
  }

  /**
   * Build plugin from ZIP file containing source code
   * @param zipBuffer - ZIP file buffer containing plugin source
   * @param filename - Original filename
   * @returns Plugin build result with bundle URL and metadata
   */
  async buildPluginFromZip(
    zipBuffer: Buffer,
    filename: string,
  ): Promise<{
    pluginId: string;
    version: string;
    bundleUrl: string;
    bundleSize: number;
    metadata: any;
  }> {
    let pluginMetadata: any = null;
    let pluginId: string;
    let version = '1.0.0';

    try {
      // Extract ZIP contents
      this.logger.log(`Building plugin from ZIP: ${filename}`);
      this.logger.debug('📦 ZIP file details:', {
        filename,
        bufferSize: zipBuffer?.length || 0,
        bufferType: typeof zipBuffer,
      });
      
      if (!zipBuffer || zipBuffer.length === 0) {
        throw new BadRequestException('Invalid ZIP file provided');
      }
      
      this.logger.debug('🔍 Loading ZIP file with JSZip...');
      const zip = new JSZip();
      await zip.loadAsync(zipBuffer);

      this.logger.log(`Extracting ZIP contents for ${filename}`);
      // Check for plugin.json metadata
      if (!zip.files || Object.keys(zip.files).length === 0) {
        throw new BadRequestException('ZIP file is empty or invalid');
      }

      const zipFiles = Object.keys(zip.files);
      this.logger.log(`ZIP filenames: ${zipFiles}`);
      this.logger.debug('📋 Detailed ZIP file list:', zipFiles);

      // Extract plugin.json for metadata
      const pluginJsonFile = zip.file('plugin.json');
      this.logger.log(`Found plugin.json: ${!!pluginJsonFile}`);
      
      if (pluginJsonFile) {
        this.logger.debug('📄 Reading plugin.json content...');
        const content = await pluginJsonFile.async('text');
        this.logger.debug('📄 plugin.json content:', content);
        
        try {
          pluginMetadata = JSON.parse(content);
          this.logger.debug('✅ plugin.json parsed successfully:', pluginMetadata);
          pluginId = pluginMetadata.id;
          version = pluginMetadata.version || version;
        } catch (parseError) {
          this.logger.error('❌ Failed to parse plugin.json:', parseError);
          throw new BadRequestException('Invalid plugin.json format');
        }
      } else {
        // Generate plugin ID from filename
        this.logger.debug('🔧 No plugin.json found, generating plugin ID from filename');
        pluginId = filename
          .replace('.zip', '')
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-');
      }

      this.logger.log(`Using plugin ID: ${pluginId}, version: ${version}`);

      // Extract source code (look for src/index.tsx or src/index.ts)
      let sourceCode = '';
      const possibleEntryPoints = ['src/index.tsx', 'src/index.ts', 'index.tsx', 'index.ts'];
      
      this.logger.debug('🔍 Looking for entry point files:', possibleEntryPoints);
      
      for (const entryPoint of possibleEntryPoints) {
        const sourceFile = zip.file(entryPoint);
        this.logger.debug(`Checking for ${entryPoint}: ${!!sourceFile}`);
        
        if (sourceFile) {
          this.logger.debug(`📄 Found entry point: ${entryPoint}`);
          sourceCode = await sourceFile.async('text');
          this.logger.debug(`📄 Entry point content length: ${sourceCode.length}`);
          this.logger.debug(`📄 Entry point preview: ${sourceCode.substring(0, 200)}...`);
          break;
        }
      }
      
      this.logger.log(`Found entry point source code: ${!!sourceCode}`);

      if (!sourceCode) {
        this.logger.error('❌ No entry point found in ZIP:', {
          checkedFiles: possibleEntryPoints,
          availableFiles: zipFiles,
        });
        throw new Error('No entry point found (src/index.tsx, src/index.ts, index.tsx, or index.ts)');
      }

      // Validate plugin structure
      this.logger.debug('🔍 Validating plugin structure...');
      const isValid = await this.bundleService.validatePluginStructure(sourceCode);
      if (!isValid) {
        this.logger.error('❌ Plugin structure validation failed');
        throw new BadRequestException('Invalid plugin structure');
      }
      this.logger.log(`Plugin structure validated for ${pluginId}`);

      // Extract package.json for GitHub Actions build
      let packageJson = '';
      const packageJsonFile = zip.file('package.json');
      if (packageJsonFile) {
        packageJson = await packageJsonFile.async('text');
        this.logger.debug('📦 Found package.json for GitHub Actions build');
      } else {
        // Create a minimal package.json if none exists
        packageJson = JSON.stringify({
          name: pluginId,
          version: version,
          type: 'module',
          scripts: {
            build: 'bun build src/index.tsx --outdir dist --format esm --external react --external react-dom --minify'
          },
          dependencies: {},
          devDependencies: {}
        }, null, 2);
        this.logger.debug('📦 Created minimal package.json for GitHub Actions build');
      }

      // Trigger GitHub Actions build
      this.logger.debug('🚀 Triggering GitHub Actions build...');
      const callbackUrl = `${this.configService.get('APP_URL', 'http://localhost:4000')}/github-build/callback`;
      
      await this.githubBuildService.triggerBuild({
        pluginId,
        sourceCode,
        packageJson,
        callbackUrl,
      });

      this.logger.log(`✅ GitHub Actions build triggered for ${pluginId}`);
      
      // For now, return a placeholder response since the actual bundle will come via callback
      // In a real implementation, you might want to implement a polling mechanism or webhook handling
      return {
        pluginId,
        version,
        bundleUrl: `pending://${pluginId}`, // Placeholder URL
        bundleSize: 0, // Will be updated when bundle is received
        metadata: pluginMetadata || { id: pluginId, extensionPoints: [], metadata: {} },
      };
    } catch (error) {
      this.logger.error(`Failed to build plugin from ZIP: ${error.message}`);
      this.logger.error('Build error details:', {
        error: error.message,
        errorStack: error.stack,
        errorName: error.name,
        errorCode: error.code,
        filename,
      });
      
      // Log additional error details if available
      if (error.stderr) {
        this.logger.error('🔍 Build stderr output:', error.stderr);
      }
      if (error.stdout) {
        this.logger.error('🔍 Build stdout output:', error.stdout);
      }
      if (error.cmd) {
        this.logger.error('🔍 Failed command:', error.cmd);
      }
      
      throw new BadRequestException(`Failed to build plugin: ${error.message}`);
    }
  }

  /**
   * Update plugin average rating based on all ratings
   * @param pluginId - The plugin ID
   */
  private async updatePluginAverageRating(pluginId: string): Promise<void> {
    try {
      const ratings = await this.pluginRatingModel.find({ pluginId }).exec();

      if (ratings.length === 0) {
        // No ratings, set to null
        await this.pluginModel
          .updateOne(
            { id: pluginId },
            {
              $set: {
                'metadata.rating': null,
                'metadata.reviewCount': 0,
                'metadata.lastUpdated': new Date().toISOString(),
              },
            },
          )
          .exec();
      } else {
        // Calculate average rating
        const totalRating = ratings.reduce(
          (sum, rating) => sum + rating.rating,
          0,
        );
        const averageRating = totalRating / ratings.length;

        await this.pluginModel
          .updateOne(
            { id: pluginId },
            {
              $set: {
                'metadata.rating': Math.round(averageRating * 10) / 10, // Round to 1 decimal place
                'metadata.reviewCount': ratings.length,
                'metadata.lastUpdated': new Date().toISOString(),
              },
            },
          )
          .exec();
      }
    } catch (error) {
      this.logger.warn(
        `Failed to update average rating for plugin ${pluginId}:`,
        error,
      );
    }
  }
}
