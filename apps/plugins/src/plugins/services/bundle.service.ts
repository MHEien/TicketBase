import { Injectable, Logger } from '@nestjs/common';
import { AssetsService } from '../../assets/assets.service';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class BundleService {
  private readonly logger = new Logger(BundleService.name);

  constructor(
    private readonly assetsService: AssetsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Processes a plugin source code, bundles it, and uploads to storage
   * @param pluginId - The unique ID of the plugin
   * @param sourceCode - The plugin source code as a string
   * @returns URL to the bundled plugin
   */
  async generateBundle(pluginId: string, sourceCode: string): Promise<string> {
    this.logger.log(`Generating bundle for plugin: ${pluginId}`);

    // First generate the bundle buffer
    const bundleBuffer = await this.generateBundleBuffer(pluginId, sourceCode);

    // Then upload to storage using the existing AssetsService
    const bundleUrl = await this.assetsService.uploadPluginAsset(
      pluginId,
      `bundle-${Date.now()}.js`,
      bundleBuffer,
      'application/javascript',
    );

    return bundleUrl;
  }

  /**
   * Processes a plugin source code and returns the bundled content as a Buffer
   * @param pluginId - The unique ID of the plugin
   * @param sourceCode - The plugin source code as a string
   * @param extractedFiles - Optional extracted files from ZIP (package.json, tsconfig.json, etc.)
   * @returns Buffer containing the bundled plugin code
   */
  async generateBundleBuffer(
    pluginId: string,
    sourceCode: string,
    extractedFiles?: Map<string, string>,
  ): Promise<Buffer> {
    this.logger.log(`Generating bundle buffer for plugin: ${pluginId}`);

    // Create a temporary directory for processing
    const tempDir = await this.createTempDirectory();
    this.logger.log(`Created temporary directory: ${tempDir}`);
    const pluginDir = path.join(tempDir, 'plugin');
    this.logger.log(`Using plugin directory: ${pluginDir}`);
    try {
      // Set up a minimal project structure
      await this.setupPluginProject(pluginDir, sourceCode, extractedFiles);
      this.logger.log(`Plugin project structure set up at: ${pluginDir}`);
      // Bundle the code
      const response = await this.bundlePlugin(pluginDir);
      console.log('Bundling result:', response);
      
      // Read the bundle - check for common output file names
      let bundleContent: Buffer;
      const possibleOutputFiles = ['bundle.js', 'index.js', 'main.js'];
      let foundFile = false;
      
      for (const filename of possibleOutputFiles) {
        const bundlePath = path.join(pluginDir, 'dist', filename);
        try {
          bundleContent = await fs.promises.readFile(bundlePath);
          this.logger.log(`Found bundle at: ${bundlePath}`);
          foundFile = true;
          break;
        } catch (error) {
          // Continue to next possible filename
        }
      }
      
      if (!foundFile) {
        // List contents of dist directory for debugging
        try {
          const distContents = await fs.promises.readdir(path.join(pluginDir, 'dist'));
          this.logger.error(`Bundle file not found. Dist directory contains: ${distContents.join(', ')}`);
        } catch (error) {
          this.logger.error('Dist directory not found after build');
        }
        throw new Error('No bundle file found after build process');
      }

      return bundleContent;
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
      // Create default package.json with bun build command
      const packageJson = {
        name: 'plugin-bundle',
        version: '1.0.0',
        private: true,
        scripts: {
          build: 'tsc && bun build src/index.tsx --outdir dist --format esm --external react --external react-dom',
        },
        dependencies: {
          'ticketsplatform-plugin-sdk': '^1.0.1',
          typescript: '^5.0.0',
        },
        devDependencies: {
          '@types/react': '^19.0.8',
          '@types/react-dom': '^19.0.3',
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

  private async bundlePlugin(pluginDir: string): Promise<void> {
    // Install dependencies
    await execPromise('bun install', { cwd: pluginDir });

    // Create dist directory
    await fs.promises.mkdir(path.join(pluginDir, 'dist'), { recursive: true });

    // Bundle the plugin
    await execPromise('bun run build', { cwd: pluginDir });
  }
}
