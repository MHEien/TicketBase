import React, {  } from 'react';
import '../fullscreen-puck.css';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import type{ BorderFieldProps } from '@repo/editor/lib/types';
import { ColorPickerField } from './color-picker';

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