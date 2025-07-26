import React from "react";
import type { Config } from "@measured/puck";
import { config as staticConfig } from "./index";
import { pluginRegistry } from "./plugin-registry";
import type { PluginComponentDefinition } from "./types";

interface DynamicConfigOptions {
  tenantId?: string;
  enabledExtensionPoints?: string[];
}

class DynamicPuckConfig {
  private baseConfig: Config;
  private currentConfig: Config;
  private subscribers: Set<(config: Config) => void> = new Set();

  constructor(baseConfig: Config) {
    this.baseConfig = baseConfig;
    this.currentConfig = { ...baseConfig };
    
    // Subscribe to plugin registry changes
    pluginRegistry.subscribe(this.handlePluginComponentsChange.bind(this));
  }

  private handlePluginComponentsChange(components: PluginComponentDefinition[]): void {
    this.updateConfig(components);
  }

  private updateConfig(pluginComponents: PluginComponentDefinition[]): void {
    // Start with base static components
    const dynamicComponents = { ...this.baseConfig.components };

    // Add plugin components
    pluginComponents.forEach(pluginDef => {
      const { component, id } = pluginDef;
      
      // Create Puck-compatible component
      dynamicComponents[id] = {
        label: component.label,
        defaultProps: this.sanitizeDefaultProps(component.defaultProps),
        fields: this.processPluginFields(component.fields),
        render: this.wrapPluginComponent(component.render, pluginDef),
      };
    });

    // Update current config
    this.currentConfig = {
      ...this.baseConfig,
      components: dynamicComponents,
    };

    // Notify subscribers
    this.notifySubscribers();
  }

  private sanitizeDefaultProps(defaultProps: Record<string, any>): Record<string, any> {
    // Ensure all default props are safe and follow our patterns
    const sanitized = { ...defaultProps };
    
    // Add default styling to match our design system
    if (!sanitized.className) {
      sanitized.className = "plugin-component";
    }
    
    // Ensure animation defaults
    if (!sanitized.animation) {
      sanitized.animation = "fadeIn";
    }

    return sanitized;
  }

  private processPluginFields(fields: Record<string, any>): Record<string, any> {
    const processedFields: Record<string, any> = {};

    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      if (typeof fieldConfig === 'object' && fieldConfig !== null) {
        // Process field configuration
        processedFields[fieldName] = this.enhanceFieldConfig(fieldConfig);
      } else {
        // Simple field type
        processedFields[fieldName] = fieldConfig;
      }
    });

    return processedFields;
  }

  private enhanceFieldConfig(fieldConfig: any): any {
    const enhanced = { ...fieldConfig };

    // Add responsive capabilities if field supports it
    if (fieldConfig.type === 'text' && fieldConfig.responsive) {
      enhanced.type = 'custom';
      enhanced.render = ({ value, onChange, label }: any) => (
        <div className="space-y-2">
          <label className="text-sm font-medium">{label}</label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    }

    // Add glassmorphism styling options
    if (fieldConfig.type === 'styling') {
      enhanced.type = 'custom';
      enhanced.render = ({ value, onChange, label }: any) => (
        <div className="space-y-2">
          <label className="text-sm font-medium">{label}</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={value?.blur || 'backdrop-blur-md'}
              onChange={(e) => onChange({ ...value, blur: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="backdrop-blur-sm">Light Blur</option>
              <option value="backdrop-blur-md">Medium Blur</option>
              <option value="backdrop-blur-lg">Heavy Blur</option>
              <option value="backdrop-blur-xl">Extra Heavy Blur</option>
            </select>
            <select
              value={value?.opacity || 'bg-white/20'}
              onChange={(e) => onChange({ ...value, opacity: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="bg-white/5">5% White</option>
              <option value="bg-white/10">10% White</option>
              <option value="bg-white/20">20% White</option>
              <option value="bg-white/30">30% White</option>
              <option value="bg-black/10">10% Black</option>
              <option value="bg-black/20">20% Black</option>
            </select>
          </div>
        </div>
      );
    }

    return enhanced;
  }

  private wrapPluginComponent(renderFn: (props: any) => React.ReactElement, pluginDef: PluginComponentDefinition) {
    return (props: any) => {
      try {
        // Add plugin context and styling
        const enhancedProps = {
          ...props,
          pluginId: pluginDef.pluginId,
          pluginVersion: pluginDef.version,
          className: `${props.className || ''} plugin-component plugin-${pluginDef.pluginId}`.trim(),
        };

        // Render the plugin component with error boundary
        return (
          <PluginComponentWrapper pluginDef={pluginDef}>
            {renderFn(enhancedProps)}
          </PluginComponentWrapper>
        );
      } catch (error) {
        console.error(`Error rendering plugin component ${pluginDef.id}:`, error);
        return (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <p className="text-red-700 font-medium">Plugin Error</p>
            <p className="text-red-600 text-sm">Failed to render {pluginDef.name}</p>
          </div>
        );
      }
    };
  }

  subscribe(callback: (config: Config) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current config
    callback(this.currentConfig);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  getCurrentConfig(): Config {
    return this.currentConfig;
  }

  async initialize(options: DynamicConfigOptions = {}): Promise<void> {
    if (options.tenantId) {
      // Load tenant-specific plugin components
      await pluginRegistry.loadPluginComponents(options.tenantId);
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentConfig);
      } catch (error) {
        console.error('Error notifying config subscriber:', error);
      }
    });
  }
}

// Error boundary wrapper for plugin components
interface PluginComponentWrapperProps {
  children: React.ReactNode;
  pluginDef: PluginComponentDefinition;
}

class PluginComponentWrapper extends React.Component<PluginComponentWrapperProps, { hasError: boolean }> {
  constructor(props: PluginComponentWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Plugin component error (${this.props.pluginDef.id}):`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-orange-300 bg-orange-50 rounded-md">
          <p className="text-orange-700 font-medium">Plugin Component Error</p>
          <p className="text-orange-600 text-sm">
            The {this.props.pluginDef.name} component encountered an error.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export singleton instance
export const dynamicConfig = new DynamicPuckConfig(staticConfig);

// React hook for using dynamic config
export function useDynamicPuckConfig(options: DynamicConfigOptions = {}): {
  config: Config;
  loading: boolean;
} {
  const [config, setConfig] = React.useState<Config>(dynamicConfig.getCurrentConfig());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    const initializeConfig = async () => {
      try {
        await dynamicConfig.initialize(options);
      } catch (error) {
        console.error('Failed to initialize dynamic config:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeConfig();

    // Subscribe to config changes
    const unsubscribe = dynamicConfig.subscribe((newConfig) => {
      if (mounted) {
        setConfig(newConfig);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [options.tenantId, options.enabledExtensionPoints?.join(',')]);

  return { config, loading };
}