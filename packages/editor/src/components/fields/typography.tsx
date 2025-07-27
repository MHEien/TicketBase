import React, { useState } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Button } from '@repo/ui/components/ui/button';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Separator } from '@repo/ui/components/ui/separator';
import type { BreakpointKey, ResponsiveTypographyFieldProps } from '@repo/editor/lib/types';
import { BREAKPOINTS } from '@/lib/constants';
import type{ TypographyFieldProps } from '@repo/editor/lib/types';

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