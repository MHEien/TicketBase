import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as semver from 'semver';

interface PluginManifest {
  id: string;
  name: string;
  version: string;
  minPlatformVersion?: string;
  maxPlatformVersion?: string;
  compatibleVersions?: string[];
  extensionPoints?: string[];
}

@Injectable()
export class CompatibilityService {
  constructor(private configService: ConfigService) {}

  /**
   * Check if a plugin is compatible with the current platform version
   */
  checkPluginCompatibility(
    pluginManifest: PluginManifest,
    platformVersion?: string
  ): { compatible: boolean; issues: string[] } {
    const currentPlatformVersion = 
      platformVersion || this.configService.get<string>('PLATFORM_VERSION') || '1.0.0';
    
    const issues: string[] = [];
    
    // Check minimum platform version requirement
    if (pluginManifest.minPlatformVersion && 
        !semver.gte(currentPlatformVersion, pluginManifest.minPlatformVersion)) {
      issues.push(
        `Plugin requires platform version >= ${pluginManifest.minPlatformVersion}, ` +
        `but current version is ${currentPlatformVersion}`
      );
    }
    
    // Check maximum platform version requirement
    if (pluginManifest.maxPlatformVersion && 
        !semver.lte(currentPlatformVersion, pluginManifest.maxPlatformVersion)) {
      issues.push(
        `Plugin requires platform version <= ${pluginManifest.maxPlatformVersion}, ` +
        `but current version is ${currentPlatformVersion}`
      );
    }
    
    // Check specific compatible versions
    if (pluginManifest.compatibleVersions && 
        pluginManifest.compatibleVersions.length > 0 &&
        !pluginManifest.compatibleVersions.some(v => semver.satisfies(currentPlatformVersion, v))) {
      issues.push(
        `Plugin is only compatible with platform versions: ${pluginManifest.compatibleVersions.join(', ')}, ` +
        `but current version is ${currentPlatformVersion}`
      );
    }
    
    return {
      compatible: issues.length === 0,
      issues,
    };
  }

  /**
   * Get the list of platform versions that are compatible with this plugin version
   */
  getSupportedPlatformVersions(pluginVersion: string): string[] {
    // This is a simplistic implementation
    // In a real application, you'd have a more sophisticated compatibility matrix
    
    // Example implementation: assume 1.x plugins are compatible with 1.x platform
    const majorVersion = semver.major(pluginVersion);
    return [`${majorVersion}.x`];
  }
  
  /**
   * Verify that all extension points declared by the plugin are supported by the platform
   */
  checkExtensionPointsSupport(
    extensionPoints: string[]
  ): { supported: boolean; unsupportedPoints: string[] } {
    // These are the extension points we support in our platform
    const supportedExtensionPoints = [
      'payment-methods',
      'admin-settings',
      'checkout-widgets',
      'event-creation',
      'dashboard-widgets',
      'ticket-selection',
      'event-detail',
      'attendee-management',
      'reporting',
      'marketing',
    ];
    
    const unsupportedPoints = extensionPoints.filter(
      point => !supportedExtensionPoints.includes(point)
    );
    
    return {
      supported: unsupportedPoints.length === 0,
      unsupportedPoints,
    };
  }
} 