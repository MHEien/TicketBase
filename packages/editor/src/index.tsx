// Main exports for @repo/editor package
export { PageEditor } from './components';
export { Renderer } from './components/renderer';
export { config } from './lib';

// Plugin integration exports
export { dynamicConfig, useDynamicPuckConfig } from './lib/dynamic-config';
export { 
  pluginRegistry, 
  notifyPluginActivated, 
  notifyPluginDeactivated, 
  notifyPluginUpdated 
} from './lib/plugin-registry';

// Re-export component types and utilities
export type { Page } from '@ticketbase/api';
export type { 
  PluginPuckComponent, 
  PluginComponentDefinition, 
  PluginRegistry 
} from './lib/types';
