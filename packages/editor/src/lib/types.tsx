import type { ReactNode } from "react";
import { BREAKPOINTS } from "./constants";

export type BreakpointKey = keyof typeof BREAKPOINTS;

// Advanced Field Types
export interface ColorPickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export interface ResponsiveTypographyFieldProps {
  value: {
    mobile: { fontSize: number; lineHeight: number };
    tablet: { fontSize: number; lineHeight: number };
    desktop: { fontSize: number; lineHeight: number };
    fontWeight: string;
    letterSpacing: number;
    fontFamily: string;
  };
  onChange: (value: any) => void;
  label?: string;
}

export interface ResponsiveSpacingFieldProps {
    value: {
      mobile: { top: number; right: number; bottom: number; left: number };
      tablet: { top: number; right: number; bottom: number; left: number };
      desktop: { top: number; right: number; bottom: number; left: number };
    };
    onChange: (value: any) => void;
    label?: string;
  }

  export interface TypographyFieldProps {
    value: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
      fontFamily: string;
    };
    onChange: (value: any) => void;
    label?: string;
  }

  export interface SpacingFieldProps {
    value: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    onChange: (value: any) => void;
    label?: string;
  }

  export interface BorderFieldProps {
    value: {
      width: number;
      style: string;
      color: string;
      radius: number;
    };
    onChange: (value: any) => void;
    label?: string;
  }
  
  export interface FloatingPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
    className?: string;
    description?: string;
  }
  
  export interface ComponentListProps {
    children: ReactNode;
    pageId?: string;
    title?: string;
    slug?: string;
  }
  
  export interface ComponentItemProps {
    name: string;
    children: ReactNode;
  }
  
  export interface HeadingBlockProps {
    children: string;
  }
  
  export interface TextBlockProps {
    text: string;
  }
  
  export interface ButtonBlockProps {
    text: string;
    href: string;
  }
  
  export interface RootProps {
    content: ReactNode;
  }
  
 export interface DraggableResizablePanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
    description?: string;
    defaultPosition?: { x: number; y: number };
    defaultSize?: { width: number; height: number };
    minSize?: { width: number; height: number };
    panelId: string;
  }

  export interface HeroSectionProps {
    title: string;
    subtitle: string;
    backgroundType: "gradient" | "image" | "video" | "solid";
    gradientFrom: string;
    gradientTo: string;
    solidColor?: string;
    backgroundImage?: string;
    buttonText: string;
    buttonStyle: "primary" | "secondary" | "outline" | "ghost";
    animation: "fadeIn" | "slideUp" | "scale" | "bounce" | "none";
    overlay: false | "light" | "medium" | "heavy";
    height: "screen" | "3/4" | "1/2" | "auto";
  }
  
  export interface GlassCardProps {
    title: string;
    content: string;
    icon: string;
    blur:
      | "backdrop-blur-sm"
      | "backdrop-blur-md"
      | "backdrop-blur-lg"
      | "backdrop-blur-xl";
    opacity:
      | "bg-white/5"
      | "bg-white/10"
      | "bg-white/20"
      | "bg-white/30"
      | "bg-black/10"
      | "bg-black/20";
    borderStyle:
      | "border-white/20"
      | "border-white/40"
      | "border-gray-300/20"
      | "border-transparent";
    padding: string;
    rounded: string;
  }
  
  export interface FeatureGridProps {
    title: string;
    subtitle: string;
    columns:
      | "grid-cols-1"
      | "grid-cols-2"
      | "grid-cols-3"
      | "grid-cols-4"
      | "grid-cols-auto-fit";
    gap: "gap-4" | "gap-6" | "gap-8" | "gap-12";
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  }
  
  export interface StatsSectionProps {
    title: string;
    backgroundColor: "transparent" | "dark-glass" | "light-glass";
    stats: Array<{
      number: string;
      label: string;
      icon: React.ComponentType<{ size: number; className?: string }>;
    }>;
  }
  
  // Animation definitions
  export type AnimationType = "fadeIn" | "slideUp" | "scale" | "bounce" | "none";
  
  export interface AnimationConfig {
    initial: Record<string, any>;
    animate: Record<string, any>;
    transition: Record<string, any>;
  }

  export interface Page {
    id: string
    title: string
    slug: string
    description?: string
    content: Record<string, any> // Reka.js state configuration
    status: 'draft' | 'published' | 'archived'
    isHomepage: boolean
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    featuredImage?: string
    metadata?: Record<string, any>
    sortOrder: number
    organizationId: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
  }

  // Plugin integration types
  export interface PluginPuckComponent {
    label: string;
    defaultProps: Record<string, any>;
    fields: Record<string, any>;
    render: (props: any) => React.ReactElement;
    category?: string;
    icon?: string;
  }

  export interface PluginComponentDefinition {
    id: string;
    name: string;
    component: PluginPuckComponent;
    pluginId: string;
    version: string;
    extensionPoint: string;
  }

  export interface PluginRegistry {
    components: Map<string, PluginComponentDefinition>;
    subscribe: (callback: (components: PluginComponentDefinition[]) => void) => () => void;
    register: (definition: PluginComponentDefinition) => void;
    unregister: (componentId: string) => void;
    getActiveComponents: () => PluginComponentDefinition[];
  }
