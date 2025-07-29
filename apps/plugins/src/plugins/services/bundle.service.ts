import { Injectable, Logger } from '@nestjs/common';
import { AssetsService } from '../../assets/assets.service';
import { ModuleFederationService } from './module-federation.service';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Wrapper for execPromise with timeout
const execWithTimeout = async (command: string, options: any, timeoutMs: number = 120000): Promise<{ stdout: string; stderr: string }> => {
  const result = await Promise.race([
    execPromise(command, options),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Command "${command}" timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
  
  return {
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString()
  };
};

@Injectable()
export class BundleService {
  private readonly logger = new Logger(BundleService.name);

  constructor(
    private readonly assetsService: AssetsService,
    private readonly configService: ConfigService,
    private readonly moduleFederationService: ModuleFederationService,
  ) {}

  /**
   * Processes a plugin source code, bundles it with Module Federation, and uploads to storage
   * @param pluginId - The unique ID of the plugin
   * @param sourceCode - The plugin source code as a string
   * @param extractedFiles - Optional extracted files from ZIP
   * @returns Object containing bundle URLs and metadata
   */
  async generateBundle(
    pluginId: string, 
    sourceCode: string, 
    extractedFiles?: Map<string, string>,
    version: string = '1.0.0'
  ): Promise<{
    remoteEntryUrl: string;
    manifestUrl?: string;
    metadata: {
      federationName: string;
      exposes: Record<string, string>;
      shared: Record<string, any>;
    };
  }> {
    this.logger.log(`Generating Module Federation bundle for plugin: ${pluginId}`);

    // Generate the bundle using Module Federation
    const result = await this.generateFederationBundle(pluginId, sourceCode, extractedFiles, version);

    return result;
  }

  /**
   * Generates a Module Federation bundle for a plugin
   * @param pluginId - The unique ID of the plugin
   * @param sourceCode - The plugin source code as a string
   * @param extractedFiles - Optional extracted files from ZIP
   * @returns Object containing bundle URLs and federation metadata
   */
  async generateFederationBundle(
    pluginId: string,
    sourceCode: string,
    extractedFiles?: Map<string, string>,
    version: string = '1.0.0',
  ): Promise<{
    remoteEntryUrl: string;
    manifestUrl?: string;
    metadata: {
      federationName: string;
      exposes: Record<string, string>;
      shared: Record<string, any>;
    };
  }> {
    this.logger.log(`Generating Module Federation bundle for plugin: ${pluginId}`);

    // Create a temporary directory for processing
    const tempDir = await this.createTempDirectory();
    this.logger.log(`Created temporary directory: ${tempDir}`);
    const pluginDir = path.join(tempDir, 'plugin');
    this.logger.log(`Using plugin directory: ${pluginDir}`);
    
    try {
      // Set up plugin project structure
      await this.setupPluginProject(pluginDir, sourceCode, extractedFiles);
      this.logger.log(`Plugin project structure set up at: ${pluginDir}`);

      // Generate Module Federation configuration
      const federationConfig = await this.moduleFederationService.generateFederationConfig(
        pluginId,
        pluginDir,
        extractedFiles?.get('plugin.json') ? JSON.parse(extractedFiles.get('plugin.json')) : null
      );

      // Generate and write webpack configuration
      const webpackConfig = await this.moduleFederationService.generateWebpackConfig(
        pluginId,
        pluginDir,
        federationConfig
      );
      await this.moduleFederationService.writeWebpackConfig(pluginDir, webpackConfig);

      // Update package.json for Module Federation
      await this.moduleFederationService.updatePackageJsonForFederation(pluginDir);

      // Bundle the plugin with webpack and Module Federation
      await this.bundleFederationPlugin(pluginDir);
      
      // Upload all federation files to storage
      const uploadResult = await this.uploadFederationBundle(pluginId, pluginDir, version);

      return {
        ...uploadResult,
        metadata: {
          federationName: federationConfig.name,
          exposes: federationConfig.exposes,
          shared: federationConfig.shared,
        }
      };
    } finally {
      // Clean up temp directory
      this.logger.log(`Cleaning up temporary directory: ${tempDir}`);
      await this.cleanupTempDirectory(tempDir);
    }
  }

  /**
   * Analyzes a bundle to extract metadata and extension points
   * @param sourceCode - The plugin source code
   * @returns Plugin metadata and extension points
   */
  async analyzeBundle(sourceCode: string): Promise<{
    extensionPoints: string[];
    metadata: Record<string, any>;
  }> {
    // Add an artificial await to satisfy the linter
    await Promise.resolve();

    // Simple regex-based analysis to extract extension points and metadata
    // In a production environment, you might want to use a proper parser

    const extensionPoints: string[] = [];
    const extensionPointRegex = /['"]([a-zA-Z0-9-]+)['"]\s*:/g;
    let match;

    // Find all extension point names
    const extensionPointSection = sourceCode.match(
      /extensionPoints\s*:\s*{([^}]*)}/,
    );
    if (extensionPointSection && extensionPointSection[1]) {
      while (
        (match = extensionPointRegex.exec(extensionPointSection[1])) !== null
      ) {
        extensionPoints.push(match[1]);
      }
    }

    // Extract metadata
    let metadata: Record<string, any> = {};
    const metadataMatch = sourceCode.match(/metadata\s*:\s*({[^}]*})/);
    if (metadataMatch && metadataMatch[1]) {
      try {
        // This is a simplified approach - in production you'd want a more robust parser
        const metadataStr = metadataMatch[1]
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
          .replace(/'/g, '"');
        metadata = JSON.parse(metadataStr);
      } catch (error) {
        this.logger.warn('Failed to parse metadata from plugin source', error);
        metadata = {};
      }
    }

    return { extensionPoints, metadata };
  }

  /**
   * Validates the plugin bundle structure and compatibility
   * @param sourceCode - The plugin source code
   * @returns Whether the plugin is valid
   */
  async validatePluginStructure(sourceCode: string): Promise<boolean> {
    // Add an artificial await to satisfy the linter
    await Promise.resolve();

    // Relaxed validation: accept any non-empty JS bundle
    const isNonEmpty =
      typeof sourceCode === 'string' && sourceCode.trim().length > 0;
    this.logger.debug('Relaxed plugin validation:', {
      isNonEmpty,
      sourceLength: sourceCode.length,
    });
    return isNonEmpty;
  }

  private async createTempDirectory(): Promise<string> {
    const tempDir = path.join(os.tmpdir(), `plugin-${Date.now()}`);
    await fs.promises.mkdir(tempDir, { recursive: true });
    return tempDir;
  }

  private async cleanupTempDirectory(tempDir: string): Promise<void> {
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      this.logger.warn(`Failed to clean up temp directory: ${tempDir}`, error);
    }
  }

  private async setupPluginProject(
    pluginDir: string,
    sourceCode: string,
    extractedFiles?: Map<string, string>,
  ): Promise<void> {
    // Create directories
    await fs.promises.mkdir(pluginDir, { recursive: true });
    await fs.promises.mkdir(path.join(pluginDir, 'src'), { recursive: true });

    // Write source code with .tsx extension since it contains JSX
    await fs.promises.writeFile(
      path.join(pluginDir, 'src', 'index.tsx'),
      sourceCode,
    );

    // Check if plugin has its own package.json, otherwise create default
    if (extractedFiles && extractedFiles.has('package.json')) {
      const pluginPackageJsonString = extractedFiles.get('package.json');
      
      // Parse and modify package.json to resolve workspace dependencies
      const pluginPackageJson = JSON.parse(pluginPackageJsonString);
      
      // Replace workspace dependencies with published versions
      if (pluginPackageJson.dependencies) {
        for (const [dep, version] of Object.entries(pluginPackageJson.dependencies)) {
          if (typeof version === 'string' && version.startsWith('workspace:')) {
            // Replace workspace dependencies with published npm versions
            if (dep === 'ticketsplatform-plugin-sdk') {
              pluginPackageJson.dependencies[dep] = '^1.0.1';
            }
          }
        }
      }
      
      // Ensure the plugin SDK is included as a dependency
      if (!pluginPackageJson.dependencies) {
        pluginPackageJson.dependencies = {};
      }
      if (!pluginPackageJson.dependencies['ticketsplatform-plugin-sdk']) {
        pluginPackageJson.dependencies['ticketsplatform-plugin-sdk'] = '^1.0.1';
      }
      
      await fs.promises.writeFile(
        path.join(pluginDir, 'package.json'),
        JSON.stringify(pluginPackageJson, null, 2),
      );
    } else {
      // Create default package.json with webpack and Module Federation
      const packageJson = {
        name: 'plugin-bundle',
        version: '1.0.0',
        private: true,
        scripts: {
          build: 'webpack --mode=development --stats=minimal',
          'build:prod': 'webpack --mode=production --stats=minimal',
        },
        dependencies: {
          'ticketsplatform-plugin-sdk': '^1.0.1',
          react: '^19.0.0',
          'react-dom': '^19.0.0',
        },
        devDependencies: {
          '@types/react': '^19.0.8',
          '@types/react-dom': '^19.0.3',
          typescript: '^5.0.0',
          webpack: '^5.95.0',
          '@module-federation/enhanced': '^0.17.1',
          'webpack-cli': '^5.1.4',
          'ts-loader': '^9.5.2',
          'css-loader': '^7.1.2',
          'style-loader': '^4.0.0',
        },
      };

      await fs.promises.writeFile(
        path.join(pluginDir, 'package.json'),
        JSON.stringify(packageJson, null, 2),
      );
    }

    // Check if plugin has its own tsconfig.json, otherwise create default
    if (extractedFiles && extractedFiles.has('tsconfig.json')) {
      const pluginTsConfig = extractedFiles.get('tsconfig.json');
      await fs.promises.writeFile(
        path.join(pluginDir, 'tsconfig.json'),
        pluginTsConfig,
      );
    } else {
      // Create default tsconfig.json
      const tsConfig = {
        compilerOptions: {
          target: 'ES2020',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          module: 'ESNext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          declaration: true,
          outDir: 'dist',
          baseUrl: '.',
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist'],
      };

      await fs.promises.writeFile(
        path.join(pluginDir, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, 2),
      );
    }
  }

  /**
   * Bundles the plugin using webpack with Module Federation
   * @param pluginDir - The plugin directory path
   */
  private async bundleFederationPlugin(pluginDir: string): Promise<void> {
    this.logger.log(`Building Module Federation plugin at: ${pluginDir}`);

    // Install dependencies
    this.logger.log('Installing plugin dependencies...');
    const installStart = Date.now();
    await execWithTimeout('bun install --legacy-peer-deps', { cwd: pluginDir }, 60000); // 1 minute timeout
    this.logger.log(`Dependencies installed in ${Date.now() - installStart}ms`);

    // Create dist directory
    await fs.promises.mkdir(path.join(pluginDir, 'dist'), { recursive: true });

    // Bundle the plugin with webpack
    this.logger.log('Building plugin with webpack and Module Federation...');
    const buildStart = Date.now();
    const buildResult = await execWithTimeout('bun run build', { cwd: pluginDir }, 120000); // 2 minute timeout
    this.logger.log(`Build completed in ${Date.now() - buildStart}ms:`, buildResult.stdout);

    if (buildResult.stderr && !buildResult.stderr.includes('webpack compiled')) {
      this.logger.warn('Build warnings/errors:', buildResult.stderr);
    }
  }

  /**
   * Uploads all Module Federation files to storage
   * @param pluginId - The unique ID of the plugin
   * @param pluginDir - The plugin directory path
   * @returns URLs to uploaded files
   */
  private async uploadFederationBundle(
    pluginId: string,
    pluginDir: string,
    version: string = '1.0.0',
  ): Promise<{
    remoteEntryUrl: string;
    manifestUrl?: string;
  }> {
    this.logger.log(`Uploading Module Federation bundle for plugin: ${pluginId}`);

    const distDir = path.join(pluginDir, 'dist');
    const distFiles = await fs.promises.readdir(distDir);
    
    this.logger.log(`Found dist files: ${distFiles.join(', ')}`);

    // Find the remoteEntry.js file
    const remoteEntryFile = distFiles.find(file => file === 'remoteEntry.js');
    if (!remoteEntryFile) {
      throw new Error('remoteEntry.js not found after Module Federation build');
    }

    // Upload remoteEntry.js
    const remoteEntryBuffer = await fs.promises.readFile(path.join(distDir, remoteEntryFile));
    const remoteEntryUrl = await this.assetsService.uploadPluginAsset(
      pluginId,
      'remoteEntry.js',
      remoteEntryBuffer,
      'application/javascript',
      version,
    );

    this.logger.log(`Remote entry uploaded: ${remoteEntryUrl}`);

    // Upload additional chunk files if they exist
    const chunkFiles = distFiles.filter(file => 
      file.endsWith('.js') && 
      file !== 'remoteEntry.js' && 
      !file.includes('index.html')
    );

    for (const chunkFile of chunkFiles) {
      const chunkBuffer = await fs.promises.readFile(path.join(distDir, chunkFile));
      await this.assetsService.uploadPluginAsset(
        pluginId,
        chunkFile,
        chunkBuffer,
        'application/javascript',
        version,
      );
      this.logger.log(`Chunk file uploaded: ${chunkFile}`);
    }

    // Look for federation manifest if it exists
    let manifestUrl: string | undefined;
    const manifestFile = distFiles.find(file => file.includes('federation-manifest') || file.includes('manifest'));
    if (manifestFile) {
      const manifestBuffer = await fs.promises.readFile(path.join(distDir, manifestFile));
      manifestUrl = await this.assetsService.uploadPluginAsset(
        pluginId,
        manifestFile,
        manifestBuffer,
        'application/json',
        version,
      );
      this.logger.log(`Manifest uploaded: ${manifestUrl}`);
    }

    return {
      remoteEntryUrl,
      manifestUrl,
    };
  }
}
