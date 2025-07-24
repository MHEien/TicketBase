import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePuck, Config } from '@measured/puck';
import '@measured/puck/puck.css';
import './fullscreen-puck.css';
import { Settings, Plus, Layers, Undo, Redo, X, Monitor, Smartphone, Tablet, ZoomIn, ZoomOut, Save, Globe, Sparkles, MousePointer, Type, Link, Move, RotateCcw, Maximize, Layout, Image as ImageIcon, Video, Grid, Columns, Mail, Star, TrendingUp, Quote, Palette, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BreakpointKey, ColorPickerFieldProps, ComponentItemProps, ResponsiveTypographyFieldProps } from '@/lib/editor/types';
import { BREAKPOINTS } from '@/lib/editor/constants';
import { ResponsiveSpacingFieldProps, TypographyFieldProps, SpacingFieldProps, BorderFieldProps, DraggableResizablePanelProps, ComponentListProps } from '@/lib/editor/types';

export const ResponsiveTypographyField: React.FC<ResponsiveTypographyFieldProps> = ({ value, onChange, label }) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey>('desktop');

  const updateBreakpoint = (breakpoint: BreakpointKey, property: string, newValue: number) => {
    onChange({
      ...value,
      [breakpoint]: {
        ...value[breakpoint],
        [property]: newValue,
      },
    });
  };

  const updateGlobal = (property: string, newValue: any) => {
    onChange({
      ...value,
      [property]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      {/* Breakpoint Selector */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {Object.entries(BREAKPOINTS).map(([key, bp]) => {
          const Icon = bp.icon;
          return (
            <Button
              key={key}
              variant={activeBreakpoint === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveBreakpoint(key as BreakpointKey)}
              className="h-8 px-2"
            >
              <Icon size={14} />
            </Button>
          );
        })}
      </div>

      {/* Responsive Controls */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">
            Font Size ({BREAKPOINTS[activeBreakpoint].label}): {value[activeBreakpoint].fontSize}px
          </Label>
          <Slider
            value={[value[activeBreakpoint].fontSize]}
            onValueChange={([val]) => updateBreakpoint(activeBreakpoint, 'fontSize', val)}
            max={72}
            min={8}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">
            Line Height ({BREAKPOINTS[activeBreakpoint].label}): {value[activeBreakpoint].lineHeight}
          </Label>
          <Slider
            value={[value[activeBreakpoint].lineHeight]}
            onValueChange={([val]) => updateBreakpoint(activeBreakpoint, 'lineHeight', val)}
            max={3}
            min={0.8}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      <Separator />

      {/* Global Typography Controls */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Font Family</Label>
          <Select value={value.fontFamily} onValueChange={(val) => updateGlobal('fontFamily', val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inherit">Default</SelectItem>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Poppins">Poppins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Font Weight</Label>
          <Select value={value.fontWeight} onValueChange={(val) => updateGlobal('fontWeight', val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="400">Normal</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semi Bold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
              <SelectItem value="800">Extra Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Letter Spacing: {value.letterSpacing}px</Label>
          <Slider
            value={[value.letterSpacing]}
            onValueChange={([val]) => updateGlobal('letterSpacing', val)}
            max={5}
            min={-2}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export const ResponsiveSpacingField: React.FC<ResponsiveSpacingFieldProps> = ({ value, onChange, label }) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey>('desktop');
  const [isLinked, setIsLinked] = useState(true);

  const handleChange = (side: string, val: number) => {
    if (isLinked) {
      onChange({
        ...value,
        [activeBreakpoint]: { top: val, right: val, bottom: val, left: val },
      });
    } else {
      onChange({
        ...value,
        [activeBreakpoint]: {
          ...value[activeBreakpoint],
          [side]: val,
        },
      });
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      {/* Breakpoint Selector */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {Object.entries(BREAKPOINTS).map(([key, bp]) => {
          const Icon = bp.icon;
          return (
            <Button
              key={key}
              variant={activeBreakpoint === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveBreakpoint(key as BreakpointKey)}
              className="h-8 px-2"
            >
              <Icon size={14} />
            </Button>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2">
        <Switch
          checked={isLinked}
          onCheckedChange={setIsLinked}
          id="link-spacing"
        />
        <Label htmlFor="link-spacing" className="text-xs text-muted-foreground">Link values</Label>
      </div>

      {isLinked ? (
        <div>
          <Label className="text-xs text-muted-foreground">
            All sides ({BREAKPOINTS[activeBreakpoint].label}): {value[activeBreakpoint].top}px
          </Label>
          <Slider
            value={[value[activeBreakpoint].top]}
            onValueChange={([val]) => handleChange('top', val)}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Top</Label>
            <Input
              type="number"
              value={value[activeBreakpoint].top}
              onChange={(e) => handleChange('top', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Right</Label>
            <Input
              type="number"
              value={value[activeBreakpoint].right}
              onChange={(e) => handleChange('right', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Bottom</Label>
            <Input
              type="number"
              value={value[activeBreakpoint].bottom}
              onChange={(e) => handleChange('bottom', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Left</Label>
            <Input
              type="number"
              value={value[activeBreakpoint].left}
              onChange={(e) => handleChange('left', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ value, onChange, label }) => {
  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export const TypographyField: React.FC<TypographyFieldProps> = ({ value, onChange, label }) => {
  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Font Family</Label>
          <Select value={value.fontFamily} onValueChange={(val) => onChange({ ...value, fontFamily: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inherit">Default</SelectItem>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Poppins">Poppins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Font Size: {value.fontSize}px</Label>
          <Slider
            value={[value.fontSize]}
            onValueChange={([val]) => onChange({ ...value, fontSize: val })}
            max={72}
            min={8}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Font Weight</Label>
          <Select value={value.fontWeight} onValueChange={(val) => onChange({ ...value, fontWeight: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="400">Normal</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semi Bold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
              <SelectItem value="800">Extra Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Line Height: {value.lineHeight}</Label>
          <Slider
            value={[value.lineHeight]}
            onValueChange={([val]) => onChange({ ...value, lineHeight: val })}
            max={3}
            min={0.8}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Letter Spacing: {value.letterSpacing}px</Label>
          <Slider
            value={[value.letterSpacing]}
            onValueChange={([val]) => onChange({ ...value, letterSpacing: val })}
            max={5}
            min={-2}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export const SpacingField: React.FC<SpacingFieldProps> = ({ value, onChange, label }) => {
  const [isLinked, setIsLinked] = useState(true);

  const handleChange = (side: string, val: number) => {
    if (isLinked) {
      onChange({ top: val, right: val, bottom: val, left: val });
    } else {
      onChange({ ...value, [side]: val });
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="flex items-center gap-2">
        <Switch
          checked={isLinked}
          onCheckedChange={setIsLinked}
          id="link-spacing"
        />
        <Label htmlFor="link-spacing" className="text-xs text-muted-foreground">Link values</Label>
      </div>

      {isLinked ? (
        <div>
          <Label className="text-xs text-muted-foreground">All sides: {value.top}px</Label>
          <Slider
            value={[value.top]}
            onValueChange={([val]) => handleChange('top', val)}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Top</Label>
            <Input
              type="number"
              value={value.top}
              onChange={(e) => handleChange('top', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Right</Label>
            <Input
              type="number"
              value={value.right}
              onChange={(e) => handleChange('right', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Bottom</Label>
            <Input
              type="number"
              value={value.bottom}
              onChange={(e) => handleChange('bottom', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Left</Label>
            <Input
              type="number"
              value={value.left}
              onChange={(e) => handleChange('left', parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export const BorderField: React.FC<BorderFieldProps> = ({ value, onChange, label }) => {
  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div>
        <Label className="text-xs text-muted-foreground">Width: {value.width}px</Label>
        <Slider
          value={[value.width]}
          onValueChange={([val]) => onChange({ ...value, width: val })}
          max={10}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Style</Label>
        <Select value={value.style} onValueChange={(val) => onChange({ ...value, style: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
            <SelectItem value="double">Double</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPickerField
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
        label="Color"
      />

      <div>
        <Label className="text-xs text-muted-foreground">Radius: {value.radius}px</Label>
        <Slider
          value={[value.radius]}
          onValueChange={([val]) => onChange({ ...value, radius: val })}
          max={50}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};

// Enhanced Component Configuration
export const createAdvancedConfig = (): Config => ({
  root: {
    render: ({ children }: any) => {
      return (
        <div className="min-h-screen bg-background">
          {children}
        </div>
      );
    },
  },
  components: {
    // Layout Components
    Section: {
      fields: {
        backgroundType: {
          type: "select" as const,
          options: [
            { label: "None", value: "none" },
            { label: "Color", value: "color" },
            { label: "Gradient", value: "gradient" },
            { label: "Image", value: "image" },
          ],
        },
        backgroundColor: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <ColorPickerField value={value} onChange={onChange} label="Background Color" />
          ),
        },
        padding: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <SpacingField value={value} onChange={onChange} label="Padding" />
          ),
        },
        margin: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <SpacingField value={value} onChange={onChange} label="Margin" />
          ),
        },
        fullWidth: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={onChange} />
              <Label>Full Width</Label>
            </div>
          ),
        },
      },
      defaultProps: {
        backgroundType: "none",
        backgroundColor: "#ffffff",
        padding: { top: 40, right: 20, bottom: 40, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        fullWidth: false,
      },
      render: ({ children, backgroundColor, padding, margin, fullWidth, backgroundType }: any) => {
        const sectionStyles = {
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
          backgroundColor: backgroundType === 'color' ? backgroundColor : 'transparent',
          width: fullWidth ? '100vw' : 'auto',
          marginLeft: fullWidth ? '50%' : 'auto',
          transform: fullWidth ? 'translateX(-50%)' : 'none',
        };

        return (
          <section style={sectionStyles} className="relative">
            {children}
          </section>
        );
      },
    },

    Container: {
      fields: {
        maxWidth: {
          type: "select" as const,
          options: [
            { label: "Small (640px)", value: "640" },
            { label: "Medium (768px)", value: "768" },
            { label: "Large (1024px)", value: "1024" },
            { label: "XL (1280px)", value: "1280" },
            { label: "2XL (1536px)", value: "1536" },
            { label: "Full", value: "full" },
          ],
        },
        alignment: {
          type: "select" as const,
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        maxWidth: "1280",
        alignment: "center",
      },
      render: ({ children, maxWidth, alignment }: any) => {
        const containerClasses = [
          "w-full",
          maxWidth !== "full" ? `max-w-${maxWidth === "640" ? "sm" : maxWidth === "768" ? "md" : maxWidth === "1024" ? "lg" : maxWidth === "1280" ? "xl" : "2xl"}` : "",
          alignment === "center" ? "mx-auto" : alignment === "right" ? "ml-auto" : "mr-auto",
          "px-4",
        ].filter(Boolean).join(" ");

        return (
          <div className={containerClasses}>
            {children}
          </div>
        );
      },
    },

    Columns: {
      fields: {
        columns: {
          type: "select" as const,
          options: [
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
          ],
        },
        gap: {
          type: "select" as const,
          options: [
            { label: "Small", value: "4" },
            { label: "Medium", value: "6" },
            { label: "Large", value: "8" },
          ],
        },
        verticalAlign: {
          type: "select" as const,
          options: [
            { label: "Top", value: "start" },
            { label: "Middle", value: "center" },
            { label: "Bottom", value: "end" },
          ],
        },
      },
      defaultProps: {
        columns: "2",
        gap: "6",
        verticalAlign: "start",
      },
      render: ({ children, columns, gap, verticalAlign }: any) => {
        const gridClasses = [
          "grid",
          `grid-cols-${columns}`,
          `gap-${gap}`,
          `items-${verticalAlign}`,
        ].join(" ");

        return (
          <div className={gridClasses}>
            {children}
          </div>
        );
      },
    },

    // Enhanced Content Components
    AdvancedHeading: {
      fields: {
        text: { type: "text" as const },
        tag: {
          type: "select" as const,
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        typography: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <TypographyField value={value} onChange={onChange} label="Typography" />
          ),
        },
        color: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <ColorPickerField value={value} onChange={onChange} label="Text Color" />
          ),
        },
        alignment: {
          type: "select" as const,
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        margin: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <SpacingField value={value} onChange={onChange} label="Margin" />
          ),
        },
      },
      defaultProps: {
        text: "Your Heading Here",
        tag: "h2",
        typography: {
          fontSize: 32,
          fontWeight: "600",
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: "inherit",
        },
        color: "#000000",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 20, left: 0 },
      },
             render: ({ text, tag, typography, color, alignment, margin }: any) => {
         const styles = {
           fontSize: `${typography.fontSize}px`,
           fontWeight: typography.fontWeight,
           lineHeight: typography.lineHeight,
           letterSpacing: `${typography.letterSpacing}px`,
           fontFamily: typography.fontFamily !== 'inherit' ? typography.fontFamily : undefined,
           color,
           textAlign: alignment as 'left' | 'center' | 'right',
           margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
         };

         return React.createElement(tag, { style: styles }, text);
       },
    },

    AdvancedText: {
      fields: {
        content: { type: "textarea" as const },
        typography: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <TypographyField value={value} onChange={onChange} label="Typography" />
          ),
        },
        color: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <ColorPickerField value={value} onChange={onChange} label="Text Color" />
          ),
        },
        alignment: {
          type: "select" as const,
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
            { label: "Justify", value: "justify" },
          ],
        },
        margin: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <SpacingField value={value} onChange={onChange} label="Margin" />
          ),
        },
      },
      defaultProps: {
        content: "Add your text content here. You can format it with multiple lines and create engaging copy for your visitors.",
        typography: {
          fontSize: 16,
          fontWeight: "400",
          lineHeight: 1.6,
          letterSpacing: 0,
          fontFamily: "inherit",
        },
        color: "#666666",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 20, left: 0 },
      },
      render: ({ content, typography, color, alignment, margin }: any) => {
        const styles = {
          fontSize: `${typography.fontSize}px`,
          fontWeight: typography.fontWeight,
          lineHeight: typography.lineHeight,
          letterSpacing: `${typography.letterSpacing}px`,
          fontFamily: typography.fontFamily !== 'inherit' ? typography.fontFamily : undefined,
          color,
          textAlign: alignment,
          margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
          whiteSpace: 'pre-wrap' as const,
        };

        return <p style={styles}>{content}</p>;
      },
    },

    AdvancedButton: {
      fields: {
        text: { type: "text" as const },
        url: { type: "text" as const },
        size: {
          type: "select" as const,
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
        style: {
          type: "select" as const,
          options: [
            { label: "Filled", value: "filled" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
          ],
        },
        backgroundColor: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <ColorPickerField value={value} onChange={onChange} label="Background Color" />
          ),
        },
        textColor: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <ColorPickerField value={value} onChange={onChange} label="Text Color" />
          ),
        },
        border: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <BorderField value={value} onChange={onChange} label="Border" />
          ),
        },
        padding: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <SpacingField value={value} onChange={onChange} label="Padding" />
          ),
        },
        margin: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <SpacingField value={value} onChange={onChange} label="Margin" />
          ),
        },
        alignment: {
          type: "select" as const,
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        openInNewTab: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={onChange} />
              <Label>Open in new tab</Label>
            </div>
          ),
        },
      },
      defaultProps: {
        text: "Click Me",
        url: "#",
        size: "md",
        style: "filled",
        backgroundColor: "#0070f3",
        textColor: "#ffffff",
        border: { width: 0, style: "solid", color: "#0070f3", radius: 6 },
        padding: { top: 12, right: 24, bottom: 12, left: 24 },
        margin: { top: 0, right: 0, bottom: 20, left: 0 },
        alignment: "left",
        openInNewTab: false,
      },
      render: ({ 
        text, 
        url, 
        size, 
        style, 
        backgroundColor, 
        textColor, 
        border, 
        padding, 
        margin, 
        alignment, 
        openInNewTab 
      }: any) => {
        const buttonStyles = {
          backgroundColor: style === 'filled' ? backgroundColor : 'transparent',
          color: style === 'filled' ? textColor : backgroundColor,
          border: `${border.width}px ${border.style} ${border.color}`,
          borderRadius: `${border.radius}px`,
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        };

        const containerStyles = {
          textAlign: alignment,
        };

        return (
          <div style={containerStyles}>
            <a
              href={url}
              target={openInNewTab ? "_blank" : "_self"}
              rel={openInNewTab ? "noopener noreferrer" : undefined}
              style={buttonStyles}
              className="hover:opacity-80"
            >
              {text}
            </a>
          </div>
        );
      },
    },

    // Image Component
    ImageBlock: {
      fields: {
        src: { type: "text" as const },
        alt: { type: "text" as const },
        width: {
          type: "select" as const,
          options: [
            { label: "25%", value: "25" },
            { label: "50%", value: "50" },
            { label: "75%", value: "75" },
            { label: "100%", value: "100" },
            { label: "Custom", value: "custom" },
          ],
        },
        customWidth: { type: "number" as const },
        alignment: {
          type: "select" as const,
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        border: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <BorderField value={value} onChange={onChange} label="Border" />
          ),
        },
        margin: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <SpacingField value={value} onChange={onChange} label="Margin" />
          ),
        },
      },
      defaultProps: {
        src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Placeholder image",
        width: "100",
        customWidth: 400,
        alignment: "center",
        border: { width: 0, style: "solid", color: "#e5e5e5", radius: 8 },
        margin: { top: 0, right: 0, bottom: 20, left: 0 },
      },
      render: ({ src, alt, width, customWidth, alignment, border, margin }: any) => {
        const imageStyles = {
          width: width === "custom" ? `${customWidth}px` : `${width}%`,
          border: `${border.width}px ${border.style} ${border.color}`,
          borderRadius: `${border.radius}px`,
          margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
          display: 'block',
          maxWidth: '100%',
          height: 'auto',
        };

        const containerStyles = {
          textAlign: alignment,
        };

        return (
          <div style={containerStyles}>
            <img src={src} alt={alt} style={imageStyles} />
          </div>
        );
      },
    },

    // Spacer Component
    Spacer: {
      fields: {
        height: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Height: {value}px</Label>
              <Slider
                value={[value]}
                onValueChange={([val]) => onChange(val)}
                max={200}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          ),
        },
        showOnDesktop: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={onChange} />
              <Label>Show on Desktop</Label>
            </div>
          ),
        },
        showOnTablet: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={onChange} />
              <Label>Show on Tablet</Label>
            </div>
          ),
        },
        showOnMobile: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={onChange} />
              <Label>Show on Mobile</Label>
            </div>
          ),
        },
      },
      defaultProps: {
        height: 40,
        showOnDesktop: true,
        showOnTablet: true,
        showOnMobile: true,
      },
      render: ({ height, showOnDesktop, showOnTablet, showOnMobile }: any) => {
        const responsiveClasses = [
          showOnDesktop ? 'block' : 'hidden',
          'lg:' + (showOnDesktop ? 'block' : 'hidden'),
          'md:' + (showOnTablet ? 'block' : 'hidden'),
          'sm:' + (showOnMobile ? 'block' : 'hidden'),
        ].join(' ');

        return (
          <div 
            className={responsiveClasses}
            style={{ height: `${height}px` }}
          />
        );
      },
    },

    // Contact Form
    ContactForm: {
      fields: {
        title: { type: "text" as const },
        showTitle: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={onChange} />
              <Label>Show Title</Label>
            </div>
          ),
        },
        fields: {
          type: "custom" as const,
          render: ({ value, onChange }) => (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Form Fields</Label>
              {value.map((field: any, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Input
                    value={field.label}
                    onChange={(e) => {
                      const newFields = [...value];
                      newFields[index] = { ...field, label: e.target.value };
                      onChange(newFields);
                    }}
                    placeholder="Field label"
                    className="flex-1"
                  />
                  <Select
                    value={field.type}
                    onValueChange={(type) => {
                      const newFields = [...value];
                      newFields[index] = { ...field, type };
                      onChange(newFields);
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newFields = value.filter((_: any, i: number) => i !== index);
                      onChange(newFields);
                    }}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange([...value, { label: "New Field", type: "text", required: false }]);
                }}
              >
                <Plus size={14} className="mr-1" />
                Add Field
              </Button>
            </div>
          ),
        },
        submitText: { type: "text" as const },
        successMessage: { type: "text" as const },
      },
      defaultProps: {
        title: "Contact Us",
        showTitle: true,
        fields: [
          { label: "Name", type: "text", required: true },
          { label: "Email", type: "email", required: true },
          { label: "Message", type: "textarea", required: true },
        ],
        submitText: "Send Message",
        successMessage: "Thank you! Your message has been sent.",
      },
      render: ({ title, showTitle, fields, submitText, successMessage }: any) => {
        const [isSubmitted, setIsSubmitted] = useState(false);

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 3000);
        };

        if (isSubmitted) {
          return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          );
        }

        return (
          <div className="max-w-md mx-auto">
            {showTitle && (
              <h3 className="text-2xl font-bold text-center mb-6">{title}</h3>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field: any, index: number) => (
                <div key={index}>
                  <Label htmlFor={`field-${index}`} className="block text-sm font-medium mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={`field-${index}`}
                      required={field.required}
                      className="w-full"
                      rows={4}
                    />
                  ) : (
                    <Input
                      id={`field-${index}`}
                      type={field.type}
                      required={field.required}
                      className="w-full"
                    />
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full">
                {submitText}
              </Button>
            </form>
          </div>
        );
      },
    },

    // Testimonial Component
    Testimonial: {
      fields: {
        quote: { type: "textarea" as const },
        author: { type: "text" as const },
        position: { type: "text" as const },
        company: { type: "text" as const },
        avatar: { type: "text" as const },
        rating: {
          type: "select" as const,
          options: [
            { label: "5 Stars", value: "5" },
            { label: "4 Stars", value: "4" },
            { label: "3 Stars", value: "3" },
            { label: "2 Stars", value: "2" },
            { label: "1 Star", value: "1" },
          ],
        },
        style: {
          type: "select" as const,
          options: [
            { label: "Card", value: "card" },
            { label: "Minimal", value: "minimal" },
            { label: "Centered", value: "centered" },
          ],
        },
      },
      defaultProps: {
        quote: "This product has completely transformed our workflow. Highly recommended!",
        author: "John Doe",
        position: "CEO",
        company: "Example Company",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        rating: "5",
        style: "card",
      },
      render: ({ quote, author, position, company, avatar, rating, style }: any) => {
        const stars = Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            className={i < parseInt(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ));

        const content = (
          <>
            <div className="flex mb-3">{stars}</div>
            <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
            <div className="flex items-center gap-3">
              <img src={avatar} alt={author} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{author}</p>
                <p className="text-sm text-gray-600">{position} at {company}</p>
              </div>
            </div>
          </>
        );

        if (style === "card") {
          return (
            <div className="bg-white p-6 rounded-lg shadow-lg border max-w-md mx-auto">
              {content}
            </div>
          );
        }

        if (style === "centered") {
          return (
            <div className="text-center max-w-2xl mx-auto">
              <div className="flex justify-center mb-3">{stars}</div>
              <blockquote className="text-xl italic mb-6">"{quote}"</blockquote>
              <div className="flex justify-center items-center gap-3">
                <img src={avatar} alt={author} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-lg">{author}</p>
                  <p className="text-gray-600">{position} at {company}</p>
                </div>
              </div>
            </div>
          );
        }

        return <div className="max-w-md">{content}</div>;
      },
    },

         // Progress Bar
     ProgressBar: {
       fields: {
         label: { type: "text" as const },
         percentage: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="space-y-2">
               <Label className="text-sm font-medium">Progress: {value}%</Label>
               <Slider
                 value={[value]}
                 onValueChange={([val]) => onChange(val)}
                 max={100}
                 min={0}
                 step={1}
                 className="w-full"
               />
             </div>
           ),
         },
         color: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ColorPickerField value={value} onChange={onChange} label="Progress Color" />
           ),
         },
         backgroundColor: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ColorPickerField value={value} onChange={onChange} label="Background Color" />
           ),
         },
         height: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="space-y-2">
               <Label className="text-sm font-medium">Height: {value}px</Label>
               <Slider
                 value={[value]}
                 onValueChange={([val]) => onChange(val)}
                 max={30}
                 min={4}
                 step={1}
                 className="w-full"
               />
             </div>
           ),
         },
         showPercentage: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="flex items-center space-x-2">
               <Switch checked={value} onCheckedChange={onChange} />
               <Label>Show Percentage</Label>
             </div>
           ),
         },
       },
       defaultProps: {
         label: "Progress",
         percentage: 75,
         color: "#0070f3",
         backgroundColor: "#e5e5e5",
         height: 8,
         showPercentage: true,
       },
       render: ({ label, percentage, color, backgroundColor, height, showPercentage }: any) => {
         return (
           <div className="w-full">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-medium">{label}</span>
               {showPercentage && <span className="text-sm text-gray-600">{percentage}%</span>}
             </div>
             <div
               className="w-full rounded-full overflow-hidden"
               style={{ backgroundColor, height: `${height}px` }}
             >
               <div
                 className="h-full transition-all duration-500 ease-out"
                 style={{
                   width: `${percentage}%`,
                   backgroundColor: color,
                 }}
               />
             </div>
           </div>
         );
       },
     },

     // Video Player
     VideoPlayer: {
       fields: {
         videoUrl: { type: "text" as const },
         poster: { type: "text" as const },
         autoplay: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="flex items-center space-x-2">
               <Switch checked={value} onCheckedChange={onChange} />
               <Label>Autoplay</Label>
             </div>
           ),
         },
         controls: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="flex items-center space-x-2">
               <Switch checked={value} onCheckedChange={onChange} />
               <Label>Show Controls</Label>
             </div>
           ),
         },
         loop: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="flex items-center space-x-2">
               <Switch checked={value} onCheckedChange={onChange} />
               <Label>Loop Video</Label>
             </div>
           ),
         },
         width: {
           type: "select" as const,
           options: [
             { label: "50%", value: "50" },
             { label: "75%", value: "75" },
             { label: "100%", value: "100" },
           ],
         },
         aspectRatio: {
           type: "select" as const,
           options: [
             { label: "16:9", value: "16/9" },
             { label: "4:3", value: "4/3" },
             { label: "1:1", value: "1/1" },
           ],
         },
         alignment: {
           type: "select" as const,
           options: [
             { label: "Left", value: "left" },
             { label: "Center", value: "center" },
             { label: "Right", value: "right" },
           ],
         },
       },
       defaultProps: {
         videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
         poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
         autoplay: false,
         controls: true,
         loop: false,
         width: "100",
         aspectRatio: "16/9",
         alignment: "center",
       },
       render: ({ videoUrl, poster, autoplay, controls, loop, width, aspectRatio, alignment }: any) => {
         const containerStyles = {
           textAlign: alignment,
           width: '100%',
         };

         const videoStyles = {
           width: `${width}%`,
           aspectRatio,
           maxWidth: '100%',
         };

         return (
           <div style={containerStyles}>
             <video
               src={videoUrl}
               poster={poster}
               autoPlay={autoplay}
               controls={controls}
               loop={loop}
               style={videoStyles}
               className="rounded-lg shadow-lg"
             >
               Your browser does not support the video tag.
             </video>
           </div>
         );
       },
     },

     // Image Gallery
     ImageGallery: {
       fields: {
         images: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="space-y-2">
               <Label className="text-sm font-medium">Gallery Images</Label>
               {value.map((image: any, index: number) => (
                 <div key={index} className="flex items-center gap-2 p-2 border rounded">
                   <Input
                     value={image.src}
                     onChange={(e) => {
                       const newImages = [...value];
                       newImages[index] = { ...image, src: e.target.value };
                       onChange(newImages);
                     }}
                     placeholder="Image URL"
                     className="flex-1"
                   />
                   <Input
                     value={image.alt}
                     onChange={(e) => {
                       const newImages = [...value];
                       newImages[index] = { ...image, alt: e.target.value };
                       onChange(newImages);
                     }}
                     placeholder="Alt text"
                     className="w-20"
                   />
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                       const newImages = value.filter((_: any, i: number) => i !== index);
                       onChange(newImages);
                     }}
                   >
                     <X size={14} />
                   </Button>
                 </div>
               ))}
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => {
                   onChange([...value, { src: "", alt: "Gallery image" }]);
                 }}
               >
                 <Plus size={14} className="mr-1" />
                 Add Image
               </Button>
             </div>
           ),
         },
         columns: {
           type: "select" as const,
           options: [
             { label: "2 Columns", value: "2" },
             { label: "3 Columns", value: "3" },
             { label: "4 Columns", value: "4" },
           ],
         },
         gap: {
           type: "select" as const,
           options: [
             { label: "Small", value: "2" },
             { label: "Medium", value: "4" },
             { label: "Large", value: "6" },
           ],
         },
         rounded: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="space-y-2">
               <Label className="text-sm font-medium">Border Radius: {value}px</Label>
               <Slider
                 value={[value]}
                 onValueChange={([val]) => onChange(val)}
                 max={20}
                 min={0}
                 step={1}
                 className="w-full"
               />
             </div>
           ),
         },
         showLightbox: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="flex items-center space-x-2">
               <Switch checked={value} onCheckedChange={onChange} />
               <Label>Enable Lightbox</Label>
             </div>
           ),
         },
       },
       defaultProps: {
         images: [
           { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 1" },
           { src: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 2" },
           { src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 3" },
           { src: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 4" },
         ],
         columns: "3",
         gap: "4",
         rounded: 8,
         showLightbox: true,
       },
       render: ({ images, columns, gap, rounded, showLightbox }: any) => {
         const [lightboxOpen, setLightboxOpen] = useState(false);
         const [currentImage, setCurrentImage] = useState(0);

         const gridStyles = {
           display: 'grid',
           gridTemplateColumns: `repeat(${columns}, 1fr)`,
           gap: `${gap * 4}px`,
         };

         const imageStyles = {
           borderRadius: `${rounded}px`,
           width: '100%',
           height: '200px',
           objectFit: 'cover' as const,
           cursor: showLightbox ? 'pointer' : 'default',
           transition: 'transform 0.2s ease',
         };

         const handleImageClick = (index: number) => {
           if (showLightbox) {
             setCurrentImage(index);
             setLightboxOpen(true);
           }
         };

         return (
           <>
             <div style={gridStyles}>
               {images.map((image: any, index: number) => (
                 <img
                   key={index}
                   src={image.src}
                   alt={image.alt}
                   style={imageStyles}
                   onClick={() => handleImageClick(index)}
                   className="hover:scale-105"
                 />
               ))}
             </div>
             
             {/* Simple Lightbox */}
             {lightboxOpen && showLightbox && (
               <div 
                 className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                 onClick={() => setLightboxOpen(false)}
               >
                 <div className="relative max-w-4xl max-h-full p-4">
                   <img
                     src={images[currentImage]?.src}
                     alt={images[currentImage]?.alt}
                     className="max-w-full max-h-full object-contain"
                   />
                   <button
                     onClick={() => setLightboxOpen(false)}
                     className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                   >
                     ×
                   </button>
                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                     {images.map((_: any, index: number) => (
                       <button
                         key={index}
                         onClick={(e) => {
                           e.stopPropagation();
                           setCurrentImage(index);
                         }}
                         className={`w-3 h-3 rounded-full ${
                           index === currentImage ? 'bg-white' : 'bg-white/50'
                         }`}
                       />
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </>
                  );
       },
     },

     // Hero Section
     HeroSection: {
       fields: {
         title: { type: "text" as const },
         subtitle: { type: "textarea" as const },
         backgroundImage: { type: "text" as const },
         overlayColor: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ColorPickerField value={value} onChange={onChange} label="Overlay Color" />
           ),
         },
         overlayOpacity: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="space-y-2">
               <Label className="text-sm font-medium">Overlay Opacity: {value}%</Label>
               <Slider
                 value={[value]}
                 onValueChange={([val]) => onChange(val)}
                 max={100}
                 min={0}
                 step={5}
                 className="w-full"
               />
             </div>
           ),
         },
         typography: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ResponsiveTypographyField value={value} onChange={onChange} label="Title Typography" />
           ),
         },
         textColor: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ColorPickerField value={value} onChange={onChange} label="Text Color" />
           ),
         },
         buttonText: { type: "text" as const },
         buttonUrl: { type: "text" as const },
         buttonStyle: {
           type: "select" as const,
           options: [
             { label: "Primary", value: "primary" },
             { label: "Secondary", value: "secondary" },
             { label: "Outline", value: "outline" },
           ],
         },
         height: {
           type: "select" as const,
           options: [
             { label: "Small (400px)", value: "400" },
             { label: "Medium (600px)", value: "600" },
             { label: "Large (800px)", value: "800" },
             { label: "Full Screen", value: "100vh" },
           ],
         },
         alignment: {
           type: "select" as const,
           options: [
             { label: "Left", value: "left" },
             { label: "Center", value: "center" },
             { label: "Right", value: "right" },
           ],
         },
       },
       defaultProps: {
         title: "Welcome to Our Amazing Product",
         subtitle: "Discover the future of innovation with our cutting-edge solutions designed to transform your business.",
         backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
         overlayColor: "#000000",
         overlayOpacity: 40,
         typography: {
           mobile: { fontSize: 32, lineHeight: 1.2 },
           tablet: { fontSize: 48, lineHeight: 1.2 },
           desktop: { fontSize: 64, lineHeight: 1.1 },
           fontWeight: "700",
           letterSpacing: -1,
           fontFamily: "inherit",
         },
         textColor: "#ffffff",
         buttonText: "Get Started",
         buttonUrl: "#",
         buttonStyle: "primary",
         height: "600",
         alignment: "center",
       },
       render: ({ 
         title, 
         subtitle, 
         backgroundImage, 
         overlayColor, 
         overlayOpacity, 
         typography, 
         textColor, 
         buttonText, 
         buttonUrl, 
         buttonStyle,
         height,
         alignment 
       }: any) => {
         const getResponsiveFontSize = () => {
           return {
             fontSize: `clamp(${typography.mobile.fontSize}px, 4vw, ${typography.desktop.fontSize}px)`,
             lineHeight: typography.desktop.lineHeight,
           };
         };

         const heroStyles = {
           backgroundImage: `url(${backgroundImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           height: height === '100vh' ? '100vh' : `${height}px`,
           position: 'relative' as const,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
         };

         const overlayStyles = {
           position: 'absolute' as const,
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           backgroundColor: overlayColor,
           opacity: overlayOpacity / 100,
         };

         const contentStyles = {
           position: 'relative' as const,
           zIndex: 1,
           textAlign: alignment,
           maxWidth: '800px',
           padding: '0 20px',
         };

         const titleStyles = {
           ...getResponsiveFontSize(),
           fontWeight: typography.fontWeight,
           letterSpacing: `${typography.letterSpacing}px`,
           fontFamily: typography.fontFamily !== 'inherit' ? typography.fontFamily : undefined,
           color: textColor,
           marginBottom: '20px',
         };

         const buttonStyles = {
           display: 'inline-block',
           padding: '16px 32px',
           marginTop: '30px',
           borderRadius: '8px',
           textDecoration: 'none',
           fontWeight: '600',
           fontSize: '16px',
           transition: 'all 0.3s ease',
           backgroundColor: buttonStyle === 'primary' ? '#0070f3' : buttonStyle === 'secondary' ? '#666' : 'transparent',
           color: buttonStyle === 'outline' ? textColor : '#ffffff',
           border: buttonStyle === 'outline' ? `2px solid ${textColor}` : 'none',
         };

         return (
           <div style={heroStyles}>
             <div style={overlayStyles} />
             <div style={contentStyles}>
               <h1 style={titleStyles}>{title}</h1>
               <p style={{ color: textColor, fontSize: '18px', lineHeight: 1.6, marginBottom: '20px' }}>
                 {subtitle}
               </p>
               {buttonText && (
                 <a href={buttonUrl} style={buttonStyles} className="hover:opacity-90">
                   {buttonText}
                 </a>
               )}
             </div>
           </div>
         );
       },
     },

     // Feature Grid
     FeatureGrid: {
       fields: {
         title: { type: "text" as const },
         subtitle: { type: "textarea" as const },
         features: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="space-y-2">
               <Label className="text-sm font-medium">Features</Label>
               {value.map((feature: any, index: number) => (
                 <div key={index} className="p-3 border rounded space-y-2">
                   <div className="flex items-center gap-2">
                     <Input
                       value={feature.icon}
                       onChange={(e) => {
                         const newFeatures = [...value];
                         newFeatures[index] = { ...feature, icon: e.target.value };
                         onChange(newFeatures);
                       }}
                       placeholder="Icon (emoji or text)"
                       className="w-20"
                     />
                     <Input
                       value={feature.title}
                       onChange={(e) => {
                         const newFeatures = [...value];
                         newFeatures[index] = { ...feature, title: e.target.value };
                         onChange(newFeatures);
                       }}
                       placeholder="Feature title"
                       className="flex-1"
                     />
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => {
                         const newFeatures = value.filter((_: any, i: number) => i !== index);
                         onChange(newFeatures);
                       }}
                     >
                       <X size={14} />
                     </Button>
                   </div>
                   <Textarea
                     value={feature.description}
                     onChange={(e) => {
                       const newFeatures = [...value];
                       newFeatures[index] = { ...feature, description: e.target.value };
                       onChange(newFeatures);
                     }}
                     placeholder="Feature description"
                     rows={2}
                   />
                 </div>
               ))}
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => {
                   onChange([...value, { icon: "✨", title: "New Feature", description: "Feature description" }]);
                 }}
               >
                 <Plus size={14} className="mr-1" />
                 Add Feature
               </Button>
             </div>
           ),
         },
         columns: {
           type: "select" as const,
           options: [
             { label: "2 Columns", value: "2" },
             { label: "3 Columns", value: "3" },
             { label: "4 Columns", value: "4" },
           ],
         },
         cardStyle: {
           type: "select" as const,
           options: [
             { label: "Card", value: "card" },
             { label: "Minimal", value: "minimal" },
             { label: "Centered", value: "centered" },
           ],
         },
         padding: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ResponsiveSpacingField value={value} onChange={onChange} label="Section Padding" />
           ),
         },
       },
       defaultProps: {
         title: "Why Choose Us",
         subtitle: "Discover the key features that make our solution stand out from the competition.",
         features: [
           {
             icon: "🚀",
             title: "Fast Performance",
             description: "Lightning-fast loading times and optimized performance for the best user experience."
           },
           {
             icon: "🔒",
             title: "Secure & Reliable",
             description: "Enterprise-grade security with 99.9% uptime guarantee for peace of mind."
           },
           {
             icon: "📱",
             title: "Mobile First",
             description: "Fully responsive design that works perfectly on all devices and screen sizes."
           },
           {
             icon: "⚡",
             title: "Easy Integration",
             description: "Simple setup process with comprehensive documentation and support."
           },
         ],
         columns: "3",
         cardStyle: "card",
         padding: {
           mobile: { top: 40, right: 20, bottom: 40, left: 20 },
           tablet: { top: 60, right: 40, bottom: 60, left: 40 },
           desktop: { top: 80, right: 80, bottom: 80, left: 80 },
         },
       },
       render: ({ title, subtitle, features, columns, cardStyle, padding }: any) => {
         const getCurrentPadding = () => {
           // This is a simplified responsive implementation
           // In a real app, you'd use CSS media queries or a responsive system
           return `${padding.desktop.top}px ${padding.desktop.right}px ${padding.desktop.bottom}px ${padding.desktop.left}px`;
         };

         const sectionStyles = {
           padding: getCurrentPadding(),
           textAlign: 'center' as const,
         };

         const gridStyles = {
           display: 'grid',
           gridTemplateColumns: `repeat(${columns}, 1fr)`,
           gap: '30px',
           marginTop: '50px',
         };

         const getCardStyles = () => {
           switch (cardStyle) {
             case 'card':
               return {
                 padding: '30px',
                 backgroundColor: '#ffffff',
                 borderRadius: '12px',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                 border: '1px solid #e5e5e5',
               };
             case 'minimal':
               return {
                 padding: '20px',
               };
             case 'centered':
               return {
                 padding: '30px',
                 textAlign: 'center' as const,
               };
             default:
               return {};
           }
         };

         return (
           <div style={sectionStyles}>
             <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>{title}</h2>
             <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
               {subtitle}
             </p>
             
             <div style={gridStyles}>
               {features.map((feature: any, index: number) => (
                 <div key={index} style={getCardStyles()}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>{feature.icon}</div>
                   <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                     {feature.title}
                   </h3>
                   <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.6 }}>
                     {feature.description}
                   </p>
                 </div>
               ))}
             </div>
           </div>
         );
       },
     },

     // Call to Action Block
     CTABlock: {
       fields: {
         title: { type: "text" as const },
         description: { type: "textarea" as const },
         primaryButtonText: { type: "text" as const },
         primaryButtonUrl: { type: "text" as const },
         secondaryButtonText: { type: "text" as const },
         secondaryButtonUrl: { type: "text" as const },
         showSecondaryButton: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="flex items-center space-x-2">
               <Switch checked={value} onCheckedChange={onChange} />
               <Label>Show Secondary Button</Label>
             </div>
           ),
         },
         backgroundColor: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ColorPickerField value={value} onChange={onChange} label="Background Color" />
           ),
         },
         textColor: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ColorPickerField value={value} onChange={onChange} label="Text Color" />
           ),
         },
         borderRadius: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <div className="space-y-2">
               <Label className="text-sm font-medium">Border Radius: {value}px</Label>
               <Slider
                 value={[value]}
                 onValueChange={([val]) => onChange(val)}
                 max={50}
                 min={0}
                 step={1}
                 className="w-full"
               />
             </div>
           ),
         },
         padding: {
           type: "custom" as const,
           render: ({ value, onChange }) => (
             <ResponsiveSpacingField value={value} onChange={onChange} label="Padding" />
           ),
         },
       },
       defaultProps: {
         title: "Ready to Get Started?",
         description: "Join thousands of satisfied customers who have transformed their business with our solution.",
         primaryButtonText: "Start Free Trial",
         primaryButtonUrl: "#",
         secondaryButtonText: "Learn More",
         secondaryButtonUrl: "#",
         showSecondaryButton: true,
         backgroundColor: "#0070f3",
         textColor: "#ffffff",
         borderRadius: 16,
         padding: {
           mobile: { top: 40, right: 20, bottom: 40, left: 20 },
           tablet: { top: 60, right: 40, bottom: 60, left: 40 },
           desktop: { top: 80, right: 80, bottom: 80, left: 80 },
         },
       },
       render: ({ 
         title, 
         description, 
         primaryButtonText, 
         primaryButtonUrl, 
         secondaryButtonText, 
         secondaryButtonUrl, 
         showSecondaryButton,
         backgroundColor,
         textColor,
         borderRadius,
         padding 
       }: any) => {
         const getCurrentPadding = () => {
           return `${padding.desktop.top}px ${padding.desktop.right}px ${padding.desktop.bottom}px ${padding.desktop.left}px`;
         };

         const ctaStyles = {
           backgroundColor,
           color: textColor,
           borderRadius: `${borderRadius}px`,
           padding: getCurrentPadding(),
           textAlign: 'center' as const,
           margin: '40px 0',
         };

         const primaryButtonStyles = {
           display: 'inline-block',
           padding: '16px 32px',
           margin: '20px 10px 0 0',
           borderRadius: '8px',
           textDecoration: 'none',
           fontWeight: '600',
           fontSize: '16px',
           backgroundColor: '#ffffff',
           color: backgroundColor,
           border: 'none',
           transition: 'all 0.3s ease',
         };

         const secondaryButtonStyles = {
           display: 'inline-block',
           padding: '16px 32px',
           margin: '20px 0 0 10px',
           borderRadius: '8px',
           textDecoration: 'none',
           fontWeight: '600',
           fontSize: '16px',
           backgroundColor: 'transparent',
           color: textColor,
           border: `2px solid ${textColor}`,
           transition: 'all 0.3s ease',
         };

         return (
           <div style={ctaStyles}>
             <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>{title}</h2>
             <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 20px' }}>
               {description}
             </p>
             
             <div>
               <a href={primaryButtonUrl} style={primaryButtonStyles} className="hover:opacity-90">
                 {primaryButtonText}
               </a>
               {showSecondaryButton && (
                 <a href={secondaryButtonUrl} style={secondaryButtonStyles} className="hover:opacity-80">
                   {secondaryButtonText}
                 </a>
               )}
             </div>
           </div>
         );
       },
     },
   },
 });

// Enhanced floating action button with toggle state
export const FloatingActionButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = "default",
  className = "",
  isActive = false 
}: { 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string; 
  variant?: "default" | "primary" | "secondary";
  className?: string;
  isActive?: boolean;
}) => {
  const getVariantStyles = () => {
    if (isActive) return "bg-primary text-primary-foreground shadow-lg shadow-primary/25";
    switch (variant) {
      case "primary": return "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25";
      case "secondary": return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      default: return "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground shadow-lg";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Button
        onClick={onClick}
        size="icon"
        className={`h-12 w-12 rounded-full transition-all duration-200 border-border/50 backdrop-blur-xl ${getVariantStyles()}`}
        title={label}
      >
        <Icon size={20} />
      </Button>
    </motion.div>
  );
};

// New Draggable and Resizable Panel Component
export const DraggableResizablePanel: React.FC<DraggableResizablePanelProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  defaultPosition = { x: window.innerWidth - 350, y: 100 },
  defaultSize = { width: 320, height: 400 },
  minSize = { width: 280, height: 200 },
  panelId
}) => {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(`panel-${panelId}-position`);
    return saved ? JSON.parse(saved) : defaultPosition;
  });
  
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem(`panel-${panelId}-size`);
    return saved ? JSON.parse(saved) : defaultSize;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const panelRef = useRef<HTMLDivElement>(null);

  // Save position and size to localStorage
  useEffect(() => {
    localStorage.setItem(`panel-${panelId}-position`, JSON.stringify(position));
  }, [position, panelId]);

  useEffect(() => {
    localStorage.setItem(`panel-${panelId}-size`, JSON.stringify(size));
  }, [size, panelId]);

  // Handle dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle') || 
        (e.target as HTMLElement).closest('.panel-content')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  }, [position]);

  // Handle resizing
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    e.preventDefault();
    e.stopPropagation();
  }, [size]);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
        setPosition({ x: newX, y: newY });
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(minSize.width, resizeStart.width + deltaX);
        const newHeight = Math.max(minSize.height, resizeStart.height + deltaY);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, dragStart, resizeStart, size, minSize]);

  const resetPosition = () => {
    setPosition(defaultPosition);
    setSize(defaultSize);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.3 }}
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      <Card className="h-full shadow-2xl border-border/50 backdrop-blur-xl bg-card/95 flex flex-col">
        {/* Header with drag handle */}
        <CardHeader 
          className="pb-3 cursor-grab active:cursor-grabbing flex-shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Move size={16} className="text-muted-foreground" />
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={resetPosition}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Reset position and size"
              >
                <RotateCcw size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose} 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Content area */}
        <CardContent className="flex-1 overflow-y-auto panel-content">
          {children}
        </CardContent>
        
        {/* Resize handle */}
        <div 
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors"
          onMouseDown={handleResizeMouseDown}
          style={{
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
          }}
        />
      </Card>
    </motion.div>
  );
};

// Custom Component List with draggable panel
export const CustomComponentList = ({ children }: ComponentListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Main floating add button */}
      <FloatingActionButton
        onClick={() => setIsOpen(!isOpen)}
        icon={Plus}
        label="Add Components"
        variant="primary"
        isActive={isOpen}
        className="fixed bottom-32 right-6 z-30"
      />

      {/* Component list panel */}
      <DraggableResizablePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Components"
        description="Drag and drop components to build your page"
        panelId="components"
        defaultPosition={{ x: window.innerWidth - 350, y: 100 }}
        defaultSize={{ width: 320, height: 500 }}
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">All Components</h4>
            <div className="space-y-2">
              {children}
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-3 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Structure Components</h4>
            <div className="space-y-2">
              {React.Children.toArray(children).filter((child: any) => {
                const componentName = child?.props?.name || child?.key;
                return ['Section', 'Container', 'Columns', 'Spacer'].includes(componentName);
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-3 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Content Components</h4>
            <div className="space-y-2">
              {React.Children.toArray(children).filter((child: any) => {
                const componentName = child?.props?.name || child?.key;
                return ['AdvancedHeading', 'AdvancedText', 'AdvancedButton', 'ImageBlock', 'VideoPlayer', 'ImageGallery'].includes(componentName);
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-3 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Interactive Components</h4>
                         <div className="space-y-2">
               {React.Children.toArray(children).filter((child: any) => {
                 const componentName = child?.props?.name || child?.key;
                 return ['ContactForm', 'Testimonial', 'ProgressBar', 'HeroSection', 'FeatureGrid', 'CTABlock'].includes(componentName);
               })}
             </div>
          </TabsContent>
        </Tabs>
      </DraggableResizablePanel>
    </>
  );
};

// Enhanced Properties Panel with draggable panel
export const CustomFields = ({ children }: ComponentListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedItem } = usePuck();
  
  // Auto-open properties panel when a component is selected
  useEffect(() => {
    if (selectedItem) {
      setIsOpen(true);
    }
  }, [selectedItem]);
  
  return (
    <>
      <FloatingActionButton
        onClick={() => setIsOpen(!isOpen)}
        icon={Settings}
        label="Properties"
        variant="default"
        isActive={isOpen}
        className="fixed bottom-48 right-6 z-30"
      />

      <DraggableResizablePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedItem ? `Edit ${selectedItem.type}` : "Properties"}
        description={selectedItem ? "Customize component settings" : "Select a component to edit its properties"}
        panelId="properties"
        defaultPosition={{ x: window.innerWidth - 700, y: 100 }}
        defaultSize={{ width: 350, height: 500 }}
      >
        {selectedItem ? (
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-3">
                {children}
              </div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Style Controls</h4>
                <p className="text-xs text-muted-foreground">Advanced styling options will appear here based on the selected component.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Advanced Settings</h4>
                <div className="space-y-2">
                  <Label className="text-xs">CSS Classes</Label>
                  <Input placeholder="custom-class another-class" className="h-8 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Component ID</Label>
                  <Input placeholder="unique-id" className="h-8 text-xs" />
                </div>
                <Separator />
                                 <div className="space-y-2">
                   <Label className="text-xs text-muted-foreground">Responsive Visibility</Label>
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                       <Switch defaultChecked id="show-desktop" />
                       <Label htmlFor="show-desktop" className="text-xs">Desktop</Label>
                     </div>
                     <div className="flex items-center space-x-2">
                       <Switch defaultChecked id="show-tablet" />
                       <Label htmlFor="show-tablet" className="text-xs">Tablet</Label>
                     </div>
                     <div className="flex items-center space-x-2">
                       <Switch defaultChecked id="show-mobile" />
                       <Label htmlFor="show-mobile" className="text-xs">Mobile</Label>
                     </div>
                   </div>
                 </div>
                 
                 <Separator />
                 
                 <div className="space-y-2">
                   <Label className="text-xs text-muted-foreground">Animations</Label>
                   <div className="space-y-2">
                     <div>
                       <Label className="text-xs text-muted-foreground">Entrance Animation</Label>
                       <Select defaultValue="none">
                         <SelectTrigger className="h-8">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="none">None</SelectItem>
                           <SelectItem value="fadeIn">Fade In</SelectItem>
                           <SelectItem value="slideUp">Slide Up</SelectItem>
                           <SelectItem value="slideDown">Slide Down</SelectItem>
                           <SelectItem value="slideLeft">Slide Left</SelectItem>
                           <SelectItem value="slideRight">Slide Right</SelectItem>
                           <SelectItem value="zoomIn">Zoom In</SelectItem>
                           <SelectItem value="bounce">Bounce</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     
                     <div>
                       <Label className="text-xs text-muted-foreground">Animation Delay: 0ms</Label>
                       <Slider
                         defaultValue={[0]}
                         max={2000}
                         min={0}
                         step={100}
                         className="w-full"
                       />
                     </div>
                     
                     <div>
                       <Label className="text-xs text-muted-foreground">Animation Duration: 600ms</Label>
                       <Slider
                         defaultValue={[600]}
                         max={2000}
                         min={200}
                         step={100}
                         className="w-full"
                       />
                     </div>
                     
                     <div className="flex items-center space-x-2">
                       <Switch id="repeat-animation" />
                       <Label htmlFor="repeat-animation" className="text-xs">Repeat on scroll</Label>
                     </div>
                   </div>
                 </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 p-3 rounded-full bg-muted">
              <MousePointer className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Select a component to edit its properties</p>
          </div>
        )}
      </DraggableResizablePanel>
    </>
  );
};

// Enhanced Outline Panel with draggable panel
export const CustomOutline = ({ children }: ComponentListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <FloatingActionButton
        onClick={() => setIsOpen(!isOpen)}
        icon={Layers}
        label="Page Structure"
        variant="default"
        isActive={isOpen}
        className="fixed bottom-64 right-6 z-30"
      />

      <DraggableResizablePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Page Structure"
        description="Navigate and organize your page components"
        panelId="outline"
        defaultPosition={{ x: 50, y: 100 }}
        defaultSize={{ width: 300, height: 500 }}
      >
        <div className="text-sm space-y-2">
          {children}
        </div>
      </DraggableResizablePanel>
    </>
  );
};

// Global Styles Panel
export const GlobalStylesPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <FloatingActionButton
        onClick={() => setIsOpen(!isOpen)}
        icon={Palette}
        label="Global Styles"
        variant="default"
        isActive={isOpen}
        className="fixed bottom-80 right-6 z-30"
      />

      <DraggableResizablePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Global Styles"
        description="Manage site-wide styling and theme settings"
        panelId="global-styles"
        defaultPosition={{ x: 50, y: 200 }}
        defaultSize={{ width: 350, height: 600 }}
      >
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">Typography</TabsTrigger>
            <TabsTrigger value="spacing" className="text-xs">Spacing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Brand Colors</h4>
              
              <div className="space-y-3">
                <ColorPickerField 
                  value="#0070f3" 
                  onChange={() => {}} 
                  label="Primary Color" 
                />
                <ColorPickerField 
                  value="#666666" 
                  onChange={() => {}} 
                  label="Secondary Color" 
                />
                <ColorPickerField 
                  value="#000000" 
                  onChange={() => {}} 
                  label="Text Color" 
                />
                <ColorPickerField 
                  value="#f5f5f5" 
                  onChange={() => {}} 
                  label="Background Color" 
                />
              </div>

              <Separator />

              <h4 className="text-sm font-medium">Status Colors</h4>
              <div className="space-y-3">
                <ColorPickerField 
                  value="#10b981" 
                  onChange={() => {}} 
                  label="Success Color" 
                />
                <ColorPickerField 
                  value="#f59e0b" 
                  onChange={() => {}} 
                  label="Warning Color" 
                />
                <ColorPickerField 
                  value="#ef4444" 
                  onChange={() => {}} 
                  label="Error Color" 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Global Typography</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Primary Font</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Base Font Size: 16px</Label>
                  <Slider
                    defaultValue={[16]}
                    max={24}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Line Height: 1.6</Label>
                  <Slider
                    defaultValue={[1.6]}
                    max={2.5}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              <h4 className="text-sm font-medium">Heading Styles</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <div>H1: 2.5rem / Bold</div>
                  <div>H2: 2rem / Semi Bold</div>
                  <div>H3: 1.5rem / Semi Bold</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="spacing" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Global Spacing</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Base Spacing Unit: 8px</Label>
                  <Slider
                    defaultValue={[8]}
                    max={16}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Section Spacing: 80px</Label>
                  <Slider
                    defaultValue={[80]}
                    max={160}
                    min={40}
                    step={8}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Element Spacing: 20px</Label>
                  <Slider
                    defaultValue={[20]}
                    max={60}
                    min={10}
                    step={2}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              <h4 className="text-sm font-medium">Border Radius</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Base Radius: 8px</Label>
                  <Slider
                    defaultValue={[8]}
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Button Radius: 6px</Label>
                  <Slider
                    defaultValue={[6]}
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DraggableResizablePanel>
    </>
  );
};

// Hide the default action bar
export const CustomActionBar = ({ children }: ComponentListProps) => {
  return <div style={{ display: 'none' }}>{children}</div>;
};

// Enhanced preview with sophisticated bottom toolbar
export const CustomPreview = ({ children }: ComponentListProps) => {
  const [isAutoViewport, setIsAutoViewport] = useState(false);

  const CustomBottomToolbar = () => {
    const { appState, history, dispatch } = usePuck();
    const [currentZoom, setCurrentZoom] = useState(100);
    const [browserSize, setBrowserSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const viewports = [
      { id: 'auto', label: 'Auto', icon: Maximize, width: 'auto' as const },
      { id: 'desktop', label: 'Desktop', icon: Monitor, width: 1280 },
      { id: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
      { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 375 },
    ];

    const zoomOptions = [50, 75, 100, 125, 150, 200];

    // Track browser resize for auto viewport
    useEffect(() => {
      const handleResize = () => {
        setBrowserSize({ width: window.innerWidth, height: window.innerHeight });
        
        // If auto viewport is active, update the viewport immediately
        if (isAutoViewport) {
          dispatch({
            type: 'setUi',
            ui: {
              ...appState.ui,
              viewports: {
                ...appState.ui?.viewports,
                current: {
                  width: window.innerWidth - 48, // Account for padding
                  height: 'auto' as const
                }
              }
            }
          });
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isAutoViewport, appState.ui, dispatch]);

    const currentViewport = appState.ui?.viewports?.current || { width: 1280 };
    
    // Determine current viewport ID
    let currentViewportId: string;
    if (isAutoViewport) {
      currentViewportId = 'auto';
    } else if (currentViewport.width === 1280) {
      currentViewportId = 'desktop';
    } else if (currentViewport.width === 768) {
      currentViewportId = 'tablet';
    } else if (currentViewport.width === 375) {
      currentViewportId = 'mobile';
    } else {
      currentViewportId = 'auto';
    }

    const handleViewportChange = (viewport: any) => {
      if (viewport.id === 'auto') {
        setIsAutoViewport(true);
        dispatch({
          type: 'setUi',
          ui: {
            ...appState.ui,
            viewports: {
              ...appState.ui?.viewports,
              current: {
                width: browserSize.width - 48, // Account for padding
                height: 'auto' as const
              }
            }
          }
        });
      } else {
        setIsAutoViewport(false);
        dispatch({
          type: 'setUi',
          ui: {
            ...appState.ui,
            viewports: {
              ...appState.ui?.viewports,
              current: {
                width: viewport.width as number,
                height: 'auto' as const
              }
            }
          }
        });
      }
    };

    const handleZoomChange = (zoom: number) => {
      setCurrentZoom(zoom);
      setTimeout(() => {
        // Try multiple selectors to find the preview content
        const previewElement = document.querySelector('.Puck-frame') as HTMLElement ||
                              document.querySelector('.Puck-preview > div') as HTMLElement ||
                              document.querySelector('.Puck-preview iframe') as HTMLElement;
        
        if (previewElement) {
          previewElement.style.transform = `scale(${zoom / 100})`;
          previewElement.style.transformOrigin = 'top center';
          previewElement.style.transition = 'transform 0.3s ease';
          
          // Also adjust the container to prevent overflow issues
          const previewContainer = document.querySelector('.Puck-preview') as HTMLElement;
          if (previewContainer) {
            previewContainer.style.overflow = 'auto';
            previewContainer.style.display = 'flex';
            previewContainer.style.justifyContent = 'center';
            previewContainer.style.alignItems = 'flex-start';
          }
        } else {
          console.warn('Could not find preview element for zoom');
        }
      }, 100);
    };

    const handleSave = () => {
      localStorage.setItem('puck-draft', JSON.stringify(appState.data));
      console.log('Draft saved:', appState.data);
    };

    const handlePublish = () => {
      console.log('Publishing:', appState.data);
    };

    const handleUndo = () => {
      if (history.hasPast) {
        history.back();
      }
    };

    const handleRedo = () => {
      if (history.hasFuture) {
        history.forward();
      }
    };

    const currentViewportData = viewports.find(v => v.id === currentViewportId);
    const CurrentViewportIcon = currentViewportData?.icon || Monitor;

    return (
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        style={{ position: 'fixed' }}
      >
        <Card className="shadow-2xl border-border/50 backdrop-blur-xl bg-card/95">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Undo/Redo Group */}
              <div className="flex items-center gap-1">
                <Button 
                  onClick={handleUndo}
                  disabled={!history.hasPast}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Undo"
                >
                  <Undo size={14} />
                </Button>
                <Button 
                  onClick={handleRedo}
                  disabled={!history.hasFuture}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Redo"
                >
                  <Redo size={14} />
                </Button>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Viewport Controls */}
              <div className="flex items-center gap-2">
                <CurrentViewportIcon size={16} className="text-muted-foreground" />
                <div className="flex items-center gap-1">
                  {viewports.map(viewport => {
                    const Icon = viewport.icon;
                    return (
                      <Button
                        key={viewport.id}
                        onClick={() => handleViewportChange(viewport)}
                        variant={currentViewportId === viewport.id ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-2"
                        title={viewport.id === 'auto' ? `Auto (${browserSize.width}px)` : `${viewport.label} (${viewport.width}px)`}
                      >
                        <Icon size={14} />
                      </Button>
                    );
                  })}
                </div>
                {isAutoViewport && (
                  <Badge variant="outline" className="text-xs ml-2">
                    {browserSize.width}px × {browserSize.height}px
                  </Badge>
                )}
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const newZoom = Math.max(25, currentZoom - 25);
                    handleZoomChange(newZoom);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </Button>
                
                <Badge variant="outline" className="font-mono text-xs min-w-[60px] justify-center">
                  {currentZoom}%
                </Badge>

                <Button
                  onClick={() => {
                    const newZoom = Math.min(300, currentZoom + 25);
                    handleZoomChange(newZoom);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </Button>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleSave}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  <Save size={14} />
                  Save
                </Button>

                <Button 
                  onClick={handlePublish}
                  variant="default"
                  size="sm"
                  className="h-8"
                >
                  <Globe size={14} />
                  Publish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Add data attribute for auto viewport styling
  useEffect(() => {
    const previewElement = document.querySelector('.Puck-preview');
    const frameElement = document.querySelector('.Puck-frame');
    
    if (previewElement && frameElement) {
      if (isAutoViewport) {
        previewElement.setAttribute('data-auto-viewport', 'true');
        frameElement.setAttribute('data-auto-viewport', 'true');
      } else {
        previewElement.removeAttribute('data-auto-viewport');
        frameElement.removeAttribute('data-auto-viewport');
      }
    }
  }, [isAutoViewport]);

  return (
    <>
      {children}
      <CustomBottomToolbar />
    </>
  );
};

// Enhanced component item with sophisticated card design
export const CustomComponentItem = ({ name, children }: ComponentItemProps) => {
  const getComponentIcon = (componentName: string) => {
    switch (componentName) {
      case 'Section': return Layout;
      case 'Container': return Grid;
      case 'Columns': return Columns;
      case 'AdvancedHeading': return Type;
      case 'AdvancedText': return Type;
      case 'AdvancedButton': return Link;
      case 'ImageBlock': return ImageIcon;
      case 'VideoPlayer': return Video;
      case 'ImageGallery': return Grid;
      case 'Spacer': return Move;
      case 'ContactForm': return Mail;
      case 'Testimonial': return Quote;
      case 'ProgressBar': return TrendingUp;
      case 'HeroSection': return Target;
      case 'FeatureGrid': return Grid;
      case 'CTABlock': return Zap;
      default: return Sparkles;
    }
  };

  const getComponentDescription = (componentName: string) => {
    switch (componentName) {
      case 'Section': return 'Layout container with background options';
      case 'Container': return 'Content wrapper with max-width control';
      case 'Columns': return 'Multi-column layout grid';
      case 'AdvancedHeading': return 'Customizable heading with typography controls';
      case 'AdvancedText': return 'Rich text with styling options';
      case 'AdvancedButton': return 'Button with advanced styling';
      case 'ImageBlock': return 'Responsive image with borders';
      case 'VideoPlayer': return 'Responsive video player with controls';
      case 'ImageGallery': return 'Multi-image gallery with lightbox';
      case 'Spacer': return 'Adjustable spacing element';
      case 'ContactForm': return 'Customizable contact form';
      case 'Testimonial': return 'Customer testimonial with rating';
      case 'ProgressBar': return 'Animated progress indicator';
      case 'HeroSection': return 'Full-width hero banner with background';
      case 'FeatureGrid': return 'Grid layout for showcasing features';
      case 'CTABlock': return 'Call-to-action section with buttons';
      default: return 'Drag to add component';
    }
  };

  const Icon = getComponentIcon(name);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", duration: 0.2 }}
    >
      <Card className="cursor-grab hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 active:cursor-grabbing">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm">{name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{getComponentDescription(name)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};