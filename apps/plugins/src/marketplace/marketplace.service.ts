import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plugin, PluginDocument, AdminComponents, StorefrontComponents } from '../plugins/schemas/plugin.schema';
import { PublishPluginDto } from './dto/publish-plugin.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(Plugin.name) private pluginModel: Model<PluginDocument>,
  ) {}

  async publishPlugin(pluginData: PublishPluginDto): Promise<PluginDocument> {
    // Convert PublishPluginDto to Plugin schema format
    const pluginDocument: Partial<Plugin> = {
      id: pluginData.id,
      name: pluginData.name,
      version: pluginData.version,
      description: pluginData.description,
      category: pluginData.category,
      remoteEntry: pluginData.remoteEntry,
      scope: pluginData.scope,
      bundleUrl: pluginData.remoteEntry, // Use remoteEntry as bundleUrl for backward compatibility
      extensionPoints: [], // Default empty array
      adminComponents: (pluginData.adminComponents || {}) as AdminComponents,
      storefrontComponents: (pluginData.storefrontComponents || {}) as StorefrontComponents,
      requiredPermissions: pluginData.requiredPermissions || [],
      metadata: pluginData.metadata || {},
    };

    // Check if plugin already exists
    const existing = await this.pluginModel
      .findOne({ id: pluginData.id })
      .exec();

    if (existing) {
      // Update existing plugin
      Object.assign(existing, pluginDocument);
      return existing.save();
    }

    // Create new plugin
    return this.pluginModel.create(pluginDocument);
  }

  async getMarketplacePlugins(
    category?: string,
    search?: string,
  ): Promise<PluginDocument[]> {
    let query = this.pluginModel.find();

    if (category) {
      query = query.where('category').equals(category);
    }

    if (search) {
      query = query.or([
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]);
    }

    return query.exec();
  }

  async getPluginById(id: string): Promise<PluginDocument | null> {
    return this.pluginModel.findOne({ id }).exec();
  }

  async removePlugin(id: string): Promise<boolean> {
    const result = await this.pluginModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  async getPluginCategories(): Promise<string[]> {
    const categories = await this.pluginModel.distinct('category').exec();
    return categories;
  }
}
