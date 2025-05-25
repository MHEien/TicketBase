import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plugin, PluginCategory, PluginStatus } from './entities/plugin.entity';
import { InstalledPlugin } from './entities/installed-plugin.entity';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { InstallPluginDto } from './dto/install-plugin.dto';

@Injectable()
export class PluginsService {
  constructor(
    @InjectRepository(Plugin)
    private pluginsRepository: Repository<Plugin>,
    @InjectRepository(InstalledPlugin)
    private installedPluginsRepository: Repository<InstalledPlugin>,
  ) {}

  async create(createPluginDto: CreatePluginDto): Promise<Plugin> {
    const plugin = this.pluginsRepository.create(createPluginDto);
    return this.pluginsRepository.save(plugin);
  }

  async findAll(status?: PluginStatus): Promise<Plugin[]> {
    if (status) {
      return this.pluginsRepository.find({
        where: { status },
        order: { name: 'ASC' },
      });
    }
    return this.pluginsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Plugin> {
    const plugin = await this.pluginsRepository.findOne({
      where: { id },
    });
    
    if (!plugin) {
      throw new NotFoundException(`Plugin with ID ${id} not found`);
    }
    
    return plugin;
  }

  async update(id: string, updatePluginDto: UpdatePluginDto): Promise<Plugin> {
    const plugin = await this.findOne(id);
    
    // Update the plugin
    Object.assign(plugin, updatePluginDto);
    
    return this.pluginsRepository.save(plugin);
  }

  async deprecate(id: string): Promise<Plugin> {
    const plugin = await this.findOne(id);
    
    plugin.status = PluginStatus.DEPRECATED;
    
    return this.pluginsRepository.save(plugin);
  }

  async remove(id: string): Promise<Plugin> {
    const plugin = await this.findOne(id);
    
    plugin.status = PluginStatus.REMOVED;
    
    return this.pluginsRepository.save(plugin);
  }

  async findByCategory(category: string): Promise<Plugin[]> {
    return this.pluginsRepository.find({
      where: { 
        category: category as PluginCategory,
        status: PluginStatus.ACTIVE,
      },
      order: { name: 'ASC' },
    });
  }

  async findByExtensionPoint(extensionPoint: string): Promise<Plugin[]> {
    const plugins = await this.pluginsRepository.find({
      where: { status: PluginStatus.ACTIVE },
    });
    
    return plugins.filter(plugin => 
      plugin.extensionPoints.includes(extensionPoint)
    );
  }

  async installPlugin(installPluginDto: InstallPluginDto): Promise<InstalledPlugin> {
    const { pluginId, organizationId, userId } = installPluginDto;
    
    // Check if plugin exists and is active
    const plugin = await this.pluginsRepository.findOne({
      where: { id: pluginId },
    });
    
    if (!plugin) {
      throw new NotFoundException(`Plugin with ID ${pluginId} not found`);
    }
    
    if (plugin.status !== PluginStatus.ACTIVE) {
      throw new BadRequestException(`Plugin is not active and cannot be installed`);
    }
    
    // Check if already installed
    const existing = await this.installedPluginsRepository.findOne({
      where: { 
        pluginId,
        organizationId,
      },
    });
    
    if (existing) {
      throw new BadRequestException(`Plugin is already installed for this organization`);
    }
    
    // Install the plugin
    const installedPlugin = this.installedPluginsRepository.create({
      pluginId,
      organizationId,
      installedBy: userId,
      version: plugin.version,
      enabled: true,
      configuration: {},
    });
    
    return this.installedPluginsRepository.save(installedPlugin);
  }

  async uninstallPlugin(id: string): Promise<void> {
    const installedPlugin = await this.installedPluginsRepository.findOne({
      where: { id },
    });
    
    if (!installedPlugin) {
      throw new NotFoundException(`Installed plugin with ID ${id} not found`);
    }
    
    await this.installedPluginsRepository.remove(installedPlugin);
  }

  async togglePluginStatus(id: string, enabled: boolean): Promise<InstalledPlugin> {
    const installedPlugin = await this.installedPluginsRepository.findOne({
      where: { id },
    });
    
    if (!installedPlugin) {
      throw new NotFoundException(`Installed plugin with ID ${id} not found`);
    }
    
    installedPlugin.enabled = enabled;
    
    return this.installedPluginsRepository.save(installedPlugin);
  }

  async updatePluginConfiguration(id: string, configuration: Record<string, any>): Promise<InstalledPlugin> {
    const installedPlugin = await this.installedPluginsRepository.findOne({
      where: { id },
    });
    
    if (!installedPlugin) {
      throw new NotFoundException(`Installed plugin with ID ${id} not found`);
    }
    
    installedPlugin.configuration = {
      ...installedPlugin.configuration,
      ...configuration,
    };
    
    return this.installedPluginsRepository.save(installedPlugin);
  }

  async getInstalledPlugins(organizationId: string): Promise<InstalledPlugin[]> {
    return this.installedPluginsRepository.find({
      where: { organizationId },
      relations: ['plugin'],
    });
  }

  async getEnabledPlugins(organizationId: string): Promise<InstalledPlugin[]> {
    return this.installedPluginsRepository.find({
      where: { 
        organizationId,
        enabled: true,
      },
      relations: ['plugin'],
    });
  }

  async getPluginsByType(organizationId: string, type: string): Promise<InstalledPlugin[]> {
    const allEnabled = await this.getEnabledPlugins(organizationId);
    
    return allEnabled.filter(installedPlugin => 
      installedPlugin.plugin.category === type
    );
  }
}