import React, { useState } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Slider } from '@repo/ui/components/ui/slider';
import { Switch } from '@repo/ui/components/ui/switch';
import type { BreakpointKey } from '@repo/editor/lib/types';
import { BREAKPOINTS } from '@/lib/constants';
import type{ ResponsiveSpacingFieldProps, SpacingFieldProps } from '@repo/editor/lib/types';

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