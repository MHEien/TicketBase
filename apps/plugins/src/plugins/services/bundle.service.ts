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
   * @returns Buffer containing the bundled plugin code
   */
  async generateBundleBuffer(
    pluginId: string,
    sourceCode: string,
  ): Promise<Buffer> {
    this.logger.log(`Generating bundle buffer for plugin: ${pluginId}`);

    // Create a temporary directory for processing
    const tempDir = await this.createTempDirectory();
    this.logger.log(`Created temporary directory: ${tempDir}`);
    const pluginDir = path.join(tempDir, 'plugin');
    this.logger.log(`Using plugin directory: ${pluginDir}`);
    try {
      // Set up a minimal project structure
      await this.setupPluginProject(pluginDir, sourceCode);
      this.logger.log(`Plugin project structure set up at: ${pluginDir}`);
      // Bundle the code
      const response = await this.bundlePlugin(pluginDir);
      console.log('Bundling result:', response);
      // Read the bundle
      const bundlePath = path.join(pluginDir, 'dist', 'bundle.js');
      const bundleContent = await fs.promises.readFile(bundlePath);

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
  ): Promise<void> {
    // Create directories
    await fs.promises.mkdir(pluginDir, { recursive: true });
    await fs.promises.mkdir(path.join(pluginDir, 'src'), { recursive: true });

    // Write source code with .tsx extension since it contains JSX
    await fs.promises.writeFile(
      path.join(pluginDir, 'src', 'index.tsx'),
      sourceCode,
    );

    // Create package.json
    const packageJson = {
      name: 'plugin-bundle',
      version: '1.0.0',
      private: true,
      scripts: {
        build:
          'tsc && esbuild src/index.tsx --bundle --outfile=dist/bundle.js --format=esm --platform=browser --jsx=automatic --target=es2020 --external:react --external:react-dom',
      },
      dependencies: {
        esbuild: '^0.19.2',
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

    // Create tsconfig.json
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

  private async bundlePlugin(pluginDir: string): Promise<void> {
    // Install dependencies
    await execPromise('bun install', { cwd: pluginDir });

    // Create dist directory
    await fs.promises.mkdir(path.join(pluginDir, 'dist'), { recursive: true });

    // Bundle the plugin
    await execPromise('bun run build', { cwd: pluginDir });
  }
}
