import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plugin, PluginDocument } from '../schemas/plugin.schema';

export interface SecurityValidationResult {
  safe: boolean;
  risks: string[];
  warnings: string[];
  sanitizedCode?: string;
}

export interface PluginSignature {
  signature: string;
  timestamp: string;
  version: string;
}

@Injectable()
export class PluginSecurityService {
  private readonly logger = new Logger(PluginSecurityService.name);
  private readonly trustedDomains: string[];
  private readonly signatureKey: string;

  constructor(
    @InjectModel(Plugin.name)
    private pluginModel: Model<PluginDocument>,
    private configService: ConfigService,
  ) {
    this.trustedDomains = this.configService
      .get<string>('TRUSTED_PLUGIN_DOMAINS', 'localhost,127.0.0.1')
      .split(',');
    
    this.signatureKey = this.configService.get<string>('PLUGIN_SIGNATURE_KEY', 'default-key');
    
    if (this.signatureKey === 'default-key') {
      this.logger.warn('⚠️ Using default plugin signature key. Set PLUGIN_SIGNATURE_KEY in production!');
    }
  }

  /**
   * Validate plugin code for security threats
   */
  async validatePluginCode(pluginCode: string, filename: string): Promise<SecurityValidationResult> {
    const result: SecurityValidationResult = {
      safe: true,
      risks: [],
      warnings: [],
    };

    try {
      // 1. Check for dangerous patterns
      const dangerousPatterns = [
        // File system access
        { pattern: /require\s*\(\s*['"`]fs['"`]/, message: 'File system access detected' },
        { pattern: /import\s+.*from\s+['"`]fs['"`]/, message: 'File system import detected' },
        { pattern: /\.readFileSync|\.writeFileSync|\.unlinkSync/, message: 'File system operations detected' },
        
        // Process execution
        { pattern: /require\s*\(\s*['"`]child_process['"`]/, message: 'Child process access detected' },
        { pattern: /import\s+.*from\s+['"`]child_process['"`]/, message: 'Child process import detected' },
        { pattern: /\.exec|\.spawn|\.fork/, message: 'Process execution detected' },
        
        // Network access
        { pattern: /require\s*\(\s*['"`]http['"`]/, message: 'HTTP module access detected' },
        { pattern: /require\s*\(\s*['"`]https['"`]/, message: 'HTTPS module access detected' },
        { pattern: /require\s*\(\s*['"`]net['"`]/, message: 'Network module access detected' },
        
        // Code evaluation
        { pattern: /\beval\s*\(/, message: 'Code evaluation detected' },
        { pattern: /Function\s*\(/, message: 'Dynamic function creation detected' },
        { pattern: /new\s+Function\s*\(/, message: 'Function constructor detected' },
        
        // Global access
        { pattern: /global\.|window\.|self\./, message: 'Global object access detected' },
        { pattern: /process\.env/, message: 'Environment variable access detected' },
        
        // Dynamic imports
        { pattern: /import\s*\(\s*['"`]/, message: 'Dynamic import detected' },
        { pattern: /require\s*\(\s*[^'"`]/, message: 'Dynamic require detected' },
        
        // DOM manipulation outside React
        { pattern: /document\.|window\.document/, message: 'Direct DOM access detected' },
        { pattern: /innerHTML|outerHTML/, message: 'Direct HTML manipulation detected' },
        
        // Dangerous APIs
        { pattern: /XMLHttpRequest|fetch\s*\(/, message: 'Direct network request detected' },
        { pattern: /WebSocket|EventSource/, message: 'WebSocket/EventSource usage detected' },
        { pattern: /localStorage|sessionStorage/, message: 'Storage API access detected' },
        
        // Security bypasses
        { pattern: /dangerouslySetInnerHTML/, message: 'dangerouslySetInnerHTML usage detected' },
        { pattern: /src\s*=\s*["'`]javascript:/, message: 'JavaScript URL detected' },
        { pattern: /__proto__|constructor\.prototype/, message: 'Prototype pollution attempt detected' },
      ];

      // Check for dangerous patterns
      for (const { pattern, message } of dangerousPatterns) {
        if (pattern.test(pluginCode)) {
          result.risks.push(message);
          result.safe = false;
        }
      }

      // 2. Check for suspicious patterns (warnings, not risks)
      const suspiciousPatterns = [
        { pattern: /console\.log|console\.warn|console\.error/, message: 'Console logging detected - may leak sensitive data' },
        { pattern: /alert\s*\(|confirm\s*\(|prompt\s*\(/, message: 'Browser dialog usage detected' },
        { pattern: /setTimeout|setInterval/, message: 'Timer usage detected - check for infinite loops' },
        { pattern: /while\s*\(true\)|for\s*\(;;\)/, message: 'Potential infinite loop detected' },
        { pattern: /JSON\.parse\s*\(/, message: 'JSON parsing detected - ensure input validation' },
        { pattern: /atob\s*\(|btoa\s*\(/, message: 'Base64 encoding/decoding detected' },
        { pattern: /crypto\.|Math\.random/, message: 'Cryptographic/random functions detected' },
      ];

      for (const { pattern, message } of suspiciousPatterns) {
        if (pattern.test(pluginCode)) {
          result.warnings.push(message);
        }
      }

      // 3. Validate React component structure
      if (!this.validateReactComponentStructure(pluginCode)) {
        result.risks.push('Invalid React component structure');
        result.safe = false;
      }

      // 4. Check file size limits
      if (pluginCode.length > 500 * 1024) { // 500KB limit
        result.risks.push('Plugin code exceeds size limit (500KB)');
        result.safe = false;
      }

      // 5. Validate filename
      if (!this.validateFilename(filename)) {
        result.risks.push('Invalid filename detected');
        result.safe = false;
      }

      // 6. Check for obfuscated code
      if (this.isObfuscatedCode(pluginCode)) {
        result.risks.push('Obfuscated code detected');
        result.safe = false;
      }

      this.logger.debug(`Plugin security validation complete: ${result.safe ? 'SAFE' : 'UNSAFE'}`, {
        risks: result.risks.length,
        warnings: result.warnings.length,
      });

      return result;
    } catch (error) {
      this.logger.error('Plugin security validation failed:', error);
      return {
        safe: false,
        risks: ['Security validation failed'],
        warnings: [],
      };
    }
  }

  /**
   * Validate React component structure
   */
  private validateReactComponentStructure(code: string): boolean {
    // Must contain React import
    if (!code.includes('React') && !code.includes('react')) {
      return false;
    }

    // Must contain extension points export
    if (!code.includes('extensionPoints') && !code.includes('export')) {
      return false;
    }

    // Must be ES module format
    if (!code.includes('export') && !code.includes('module.exports')) {
      return false;
    }

    return true;
  }

  /**
   * Validate filename for security
   */
  private validateFilename(filename: string): boolean {
    // Check for path traversal
    if (filename.includes('..') || filename.includes('\\') || filename.includes('/')) {
      return false;
    }

    // Check for valid extensions
    const allowedExtensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.zip'];
    const hasValidExtension = allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    
    if (!hasValidExtension) {
      return false;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /[<>:"\\|?*]/, // Invalid filename characters
      /^\.|\.\./, // Hidden files or path traversal
      /\.(bat|cmd|exe|scr|vbs|ps1)$/i, // Executable files
    ];

    return !suspiciousPatterns.some(pattern => pattern.test(filename));
  }

  /**
   * Check if code is obfuscated
   */
  private isObfuscatedCode(code: string): boolean {
    // Simple heuristics for obfuscation detection
    const suspiciousPatterns = [
      /var\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*["'][^"']{50,}["']/, // Long encoded strings
      /\\x[0-9a-fA-F]{2}/g, // Hex encoded strings
      /\\u[0-9a-fA-F]{4}/g, // Unicode encoded strings
      /\w{1,2}(\[\w{1,2}\]){5,}/, // Heavily property-accessed code
    ];

    let suspiciousCount = 0;
    for (const pattern of suspiciousPatterns) {
      const matches = code.match(pattern);
      if (matches) {
        suspiciousCount += matches.length;
      }
    }

    // If more than 10 suspicious patterns, likely obfuscated
    return suspiciousCount > 10;
  }

  /**
   * Create plugin signature for integrity verification
   */
  createPluginSignature(pluginCode: string, pluginId: string, version: string): PluginSignature {
    const timestamp = new Date().toISOString();
    const dataToSign = `${pluginId}:${version}:${timestamp}:${pluginCode}`;
    
    const hmac = createHmac('sha256', this.signatureKey);
    hmac.update(dataToSign);
    const signature = hmac.digest('hex');

    return {
      signature,
      timestamp,
      version,
    };
  }

  /**
   * Verify plugin signature
   */
  verifyPluginSignature(
    pluginCode: string,
    pluginId: string,
    version: string,
    signature: PluginSignature,
  ): boolean {
    try {
      const dataToSign = `${pluginId}:${version}:${signature.timestamp}:${pluginCode}`;
      
      const hmac = createHmac('sha256', this.signatureKey);
      hmac.update(dataToSign);
      const expectedSignature = hmac.digest('hex');

      return timingSafeEqual(
        Buffer.from(signature.signature, 'hex'),
        Buffer.from(expectedSignature, 'hex'),
      );
    } catch (error) {
      this.logger.error('Plugin signature verification failed:', error);
      return false;
    }
  }

  /**
   * Sanitize plugin configuration for public access
   * This ensures sensitive data is not exposed to unauthenticated users
   */
  sanitizePluginConfigForPublic(
    config: Record<string, any>,
    configSchema: any,
  ): Record<string, any> {
    if (!configSchema || !configSchema.sensitiveFields) {
      return config;
    }

    const sanitized = { ...config };
    
    // Remove sensitive fields for public access
    for (const sensitiveField of configSchema.sensitiveFields) {
      delete sanitized[sensitiveField];
    }

    return sanitized;
  }

  /**
   * Validate plugin URL for security
   */
  validatePluginUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Check protocol
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false;
      }

      // Check for trusted domains in development
      const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
      if (nodeEnv === 'development') {
        const hostname = parsedUrl.hostname;
        if (this.trustedDomains.includes(hostname)) {
          return true;
        }
      }

      // In production, only allow HTTPS
      if (nodeEnv === 'production' && parsedUrl.protocol !== 'https:') {
        return false;
      }

      // Check for suspicious patterns
      const suspiciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /ftp:/i,
      ];

      return !suspiciousPatterns.some(pattern => pattern.test(url));
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate Content Security Policy for plugin execution
   */
  generatePluginCSP(): string {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for dynamic plugin loading
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https:",
      "font-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ];

    return cspDirectives.join('; ');
  }

  /**
   * Validate plugin permissions against required permissions
   */
  validatePluginPermissions(
    requiredPermissions: string[],
    userPermissions: string[],
  ): { valid: boolean; missingPermissions: string[] } {
    const missingPermissions = requiredPermissions.filter(
      permission => !userPermissions.includes(permission),
    );

    return {
      valid: missingPermissions.length === 0,
      missingPermissions,
    };
  }

  /**
   * Create sandboxed execution context for plugin validation
   */
  createSandboxedContext(): Record<string, any> {
    // Create a minimal context for plugin validation
    // This should NOT include dangerous globals
    return {
      React: {}, // Mock React for validation
      console: {
        log: () => {},
        warn: () => {},
        error: () => {},
      },
      // Add other safe globals as needed
    };
  }

  /**
   * Perform static analysis on plugin code
   */
  async performStaticAnalysis(pluginCode: string): Promise<{
    complexity: number;
    dependencies: string[];
    exports: string[];
    issues: string[];
  }> {
    const analysis = {
      complexity: 0,
      dependencies: [],
      exports: [],
      issues: [],
    };

    try {
      // Count cyclomatic complexity (simple heuristic)
      const complexityPatterns = [
        /if\s*\(/g,
        /while\s*\(/g,
        /for\s*\(/g,
        /switch\s*\(/g,
        /catch\s*\(/g,
        /&&/g,
        /\|\|/g,
        /\?/g,
      ];

      for (const pattern of complexityPatterns) {
        const matches = pluginCode.match(pattern);
        if (matches) {
          analysis.complexity += matches.length;
        }
      }

      // Extract dependencies
      const importPattern = /import\s+.*from\s+['"`]([^'"`]+)['"`]/g;
      const requirePattern = /require\s*\(\s*['"`]([^'"`]+)['"`]\)/g;
      
      let match;
      while ((match = importPattern.exec(pluginCode)) !== null) {
        analysis.dependencies.push(match[1]);
      }
      
      while ((match = requirePattern.exec(pluginCode)) !== null) {
        analysis.dependencies.push(match[1]);
      }

      // Extract exports
      const exportPattern = /export\s+(?:default\s+|const\s+|function\s+|class\s+)?(\w+)/g;
      while ((match = exportPattern.exec(pluginCode)) !== null) {
        analysis.exports.push(match[1]);
      }

      // Check for common issues
      if (analysis.complexity > 50) {
        analysis.issues.push('High cyclomatic complexity detected');
      }

      if (analysis.dependencies.length > 20) {
        analysis.issues.push('Too many dependencies');
      }

      return analysis;
    } catch (error) {
      this.logger.error('Static analysis failed:', error);
      analysis.issues.push('Static analysis failed');
      return analysis;
    }
  }
}