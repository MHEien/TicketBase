import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export interface ViteFederationConfig {
  name: string;
  filename: string;
  exposes: Record<string, string>;
  shared: Record<string, any>;
}

@Injectable()
export class ModuleFederationService {
  private readonly logger = new Logger(ModuleFederationService.name);

  /**
   * Generates a Vite Module Federation configuration for a plugin
   * @param pluginId - The unique ID of the plugin
   * @param pluginDir - The plugin directory path
   * @param metadata - Plugin metadata from plugin.json
   * @returns Vite Module Federation configuration object
   */
  async generateViteFederationConfig(
    pluginId: string,
    pluginDir: string,
    metadata?: any,
  ): Promise<ViteFederationConfig> {
    this.logger.log(`Generating Vite Module Federation config for plugin: ${pluginId}`);

    // Read plugin.json if it exists to get federation-specific config
    let pluginJson: any = {};
    try {
      const pluginJsonPath = path.join(pluginDir, 'plugin.json');
      if (fs.existsSync(pluginJsonPath)) {
        pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
      }
    } catch (error) {
      this.logger.warn(`Could not read plugin.json for ${pluginId}:`, error);
    }

    // Generate clean plugin name for federation
    const federationName = this.sanitizePluginName(pluginId);

    const config: ViteFederationConfig = {
      name: federationName,
      filename: 'remoteEntry.js',
      exposes: {
        './plugin': './src/index.tsx', // Main plugin entry point
      },
      shared: this.generateSharedDependencies(pluginJson),
    };

    // Add additional exposes if plugin specifies them
    if (pluginJson.federation?.exposes) {
      config.exposes = { ...config.exposes, ...pluginJson.federation.exposes };
    }

    return config;
  }

  /**
   * Writes Vite configuration to plugin directory
   * @param pluginDir - The plugin directory path
   * @param federationConfig - Vite Module Federation configuration
   */
  async writeViteConfig(pluginDir: string, federationConfig: ViteFederationConfig): Promise<void> {
    const configPath = path.join(pluginDir, 'vite.config.ts');
    
    // Generate TypeScript Vite config
    const configContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '${federationConfig.name}',
      filename: '${federationConfig.filename}',
      exposes: ${JSON.stringify(federationConfig.exposes, null, 2)},
      shared: ${JSON.stringify(federationConfig.shared, null, 2)},
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});`;
    
    await fs.promises.writeFile(configPath, configContent, 'utf-8');
    this.logger.log(`Vite config written to: ${configPath}`);
  }

  /**
   * Updates plugin package.json with Vite build scripts
   * @param pluginDir - The plugin directory path
   */
  async updatePackageJsonForVite(pluginDir: string): Promise<void> {
    const packageJsonPath = path.join(pluginDir, 'package.json');
    
    try {
      const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf-8'));
      
      // Update build script to use Vite
      packageJson.scripts = {
        ...packageJson.scripts,
        build: 'vite build',
        'build:prod': 'vite build --mode production',
        dev: 'vite build --watch',
        preview: 'vite preview',
      };

      // Add Vite and Module Federation as dependencies
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        vite: '^7.0.3',
        '@module-federation/vite': '^1.7.1',
        '@vitejs/plugin-react': '^4.7.0',
      };

      // Remove webpack dependencies if they exist
      delete packageJson.devDependencies?.webpack;
      delete packageJson.devDependencies?.['webpack-cli'];
      delete packageJson.devDependencies?.['@module-federation/enhanced'];
      delete packageJson.devDependencies?.['ts-loader'];
      delete packageJson.devDependencies?.['css-loader'];
      delete packageJson.devDependencies?.['style-loader'];

      await fs.promises.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        'utf-8'
      );

      this.logger.log(`Updated package.json for Vite: ${packageJsonPath}`);
    } catch (error) {
      this.logger.error(`Failed to update package.json for plugin: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sanitizes plugin name for use as federation name
   * @param pluginId - The plugin ID
   * @returns Sanitized name suitable for Vite federation
   */
  private sanitizePluginName(pluginId: string): string {
    // Convert to camelCase for Vite compatibility
    return pluginId
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map((word, index) => 
        index === 0 
          ? word.toLowerCase() 
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }

  /**
   * Generates shared dependencies configuration for Module Federation
   * @param pluginJson - Plugin metadata from plugin.json
   * @returns Shared dependencies configuration
   */
  private generateSharedDependencies(pluginJson: any): Record<string, any> {
    const sharedDefaults = {
      react: {
        singleton: true,
        requiredVersion: '^19.0.0',
      },
      'react-dom': {
        singleton: true,
        requiredVersion: '^19.0.0',
      },
      'ticketsplatform-plugin-sdk': {
        singleton: true,
      },
    };

    // Add plugin-specific shared dependencies if specified
    if (pluginJson.federation?.shared) {
      return { ...sharedDefaults, ...pluginJson.federation.shared };
    }

    // Auto-detect shared dependencies from plugin dependencies
    if (pluginJson.dependencies) {
      const autoShared: Record<string, any> = {};
      
      // Common libraries that should be shared
      const sharedLibraries = [
        'framer-motion',
        'lodash',
        '@repo/ui',
        '@tanstack/react-query',
      ];

      sharedLibraries.forEach(lib => {
        if (pluginJson.dependencies[lib]) {
          autoShared[lib] = {
            singleton: true,
          };
        }
      });

      return { ...sharedDefaults, ...autoShared };
    }

    return sharedDefaults;
  }

  /**
   * Generates HTML template for webpack build (optional, mainly for development)
   * @returns HTML template string
   */
  private generateHTMLTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plugin Remote</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
    `.trim();
  }

  /**
   * Updates plugin package.json with Module Federation build script
   * @param pluginDir - The plugin directory path
   */
  async updatePackageJsonForFederation(pluginDir: string): Promise<void> {
    const packageJsonPath = path.join(pluginDir, 'package.json');
    
    try {
      const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf-8'));
      
      // Update build script to use webpack with Module Federation
      packageJson.scripts = {
        ...packageJson.scripts,
        build: 'webpack --mode=development --progress', // Use dev mode for faster builds
        'build:prod': 'webpack --mode=production',
        'build:dev': 'webpack --mode=development',
      };

      // Add webpack and Module Federation as dependencies (latest versions)
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        webpack: '^5.95.0',
        '@module-federation/enhanced': '^0.17.1', // Latest version
        'webpack-cli': '^5.1.4',
        'ts-loader': '^9.5.2',
        'css-loader': '^7.1.2',
        'style-loader': '^4.0.0',
      };

      await fs.promises.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        'utf-8'
      );

      this.logger.log(`Updated package.json for Module Federation: ${packageJsonPath}`);
    } catch (error) {
      this.logger.error(`Failed to update package.json for plugin: ${error.message}`);
      throw error;
    }
  }
}