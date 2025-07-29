import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export interface ModuleFederationConfig {
  name: string;
  filename: string;
  exposes: Record<string, string>;
  shared: Record<string, any>;
  library: {
    type: string;
    name: string;
  };
}

@Injectable()
export class ModuleFederationService {
  private readonly logger = new Logger(ModuleFederationService.name);

  /**
   * Generates a Module Federation webpack configuration for a plugin
   * @param pluginId - The unique ID of the plugin
   * @param pluginDir - The plugin directory path
   * @param metadata - Plugin metadata from plugin.json
   * @returns Module Federation configuration object
   */
  async generateFederationConfig(
    pluginId: string,
    pluginDir: string,
    metadata?: any,
  ): Promise<ModuleFederationConfig> {
    this.logger.log(`Generating Module Federation config for plugin: ${pluginId}`);

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

    // Generate clean plugin name for federation (replace special chars)
    const federationName = pluginId.replace(/[^a-zA-Z0-9_]/g, '_');

    const config: ModuleFederationConfig = {
      name: `${federationName}_plugin`,
      filename: 'remoteEntry.js',
      exposes: {
        './plugin': './src/index.tsx', // Main plugin entry point
      },
      shared: this.generateSharedDependencies(pluginJson),
      library: {
        type: 'var',
        name: `${federationName}_plugin`,
      },
    };

    // Add additional exposes if plugin specifies them
    if (pluginJson.federation?.exposes) {
      config.exposes = { ...config.exposes, ...pluginJson.federation.exposes };
    }

    return config;
  }

  /**
   * Generates webpack configuration with Module Federation
   * @param pluginId - The unique ID of the plugin
   * @param pluginDir - The plugin directory path
   * @param federationConfig - Module Federation configuration
   * @returns Webpack configuration object
   */
  async generateWebpackConfig(
    pluginId: string,
    pluginDir: string,
    federationConfig: ModuleFederationConfig,
  ): Promise<any> {
    this.logger.log(`Generating Webpack config for plugin: ${pluginId}`);

    // Use native webpack container plugin for better compatibility
    const webpackConfig = {
      mode: 'development',
      entry: './src/index.tsx',
      devtool: 'source-map',
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      plugins: [
        // Will be replaced with proper plugin instance in writeWebpackConfig
        {
          __mf_config: {
            name: federationConfig.name,
            filename: federationConfig.filename,
            exposes: federationConfig.exposes,
            shared: {
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
              'framer-motion': {
                singleton: true,
              },
            },
          }
        }
      ],
      output: {
        path: path.join(pluginDir, 'dist'),
        filename: '[name].js',
        publicPath: 'auto',
        clean: true,
      },
      target: 'web',
      stats: 'minimal',
    };

    return webpackConfig;
  }

  /**
   * Writes webpack configuration to plugin directory
   * @param pluginDir - The plugin directory path
   * @param webpackConfig - Webpack configuration object
   */
  async writeWebpackConfig(pluginDir: string, webpackConfig: any): Promise<void> {
    const configPath = path.join(pluginDir, 'webpack.config.js');
    
    // Extract MF config from the placeholder
    const mfConfig = webpackConfig.plugins[0].__mf_config;
    
    // Generate proper JavaScript config
    const configContent = `const path = require('path');

module.exports = {
  mode: '${webpackConfig.mode}',
  entry: '${webpackConfig.entry}',
  devtool: '${webpackConfig.devtool}',
  resolve: {
    extensions: ${JSON.stringify(webpackConfig.resolve.extensions)},
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new (require('webpack')).container.ModuleFederationPlugin({
      name: '${mfConfig.name}',
      filename: '${mfConfig.filename}',
      exposes: ${JSON.stringify(mfConfig.exposes)},
      shared: ${JSON.stringify(mfConfig.shared, null, 2)},
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: 'auto',
    clean: true,
  },
  target: '${webpackConfig.target}',
  stats: '${webpackConfig.stats}',
};`;
    
    await fs.promises.writeFile(configPath, configContent, 'utf-8');
    this.logger.log(`Webpack config written to: ${configPath}`);
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
        strictVersion: false,
      },
      'react-dom': {
        singleton: true,
        requiredVersion: '^19.0.0',
        strictVersion: false,
      },
      'ticketsplatform-plugin-sdk': {
        singleton: true,
        strictVersion: false,
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
            strictVersion: false,
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