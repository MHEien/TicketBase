import { ReactNode } from "react";
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