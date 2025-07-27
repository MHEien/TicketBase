import React from 'react';
import { Label } from '@repo/ui/components/ui/label';
import { Slider } from '@repo/ui/components/ui/slider';
import { Button } from '@repo/ui/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { FilterFieldProps } from '@repo/editor/lib/types';

export const FilterField: React.FC<FilterFieldProps> = ({ value, onChange, label }) => {
  const handleChange = (property: string, newValue: number) => {
    onChange({ ...value, [property]: newValue });
  };

  const reset = () => {
    onChange({
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      opacity: 100,
    });
  };

  const getFilterString = () => {
    const { blur, brightness, contrast, saturate, hue, sepia, grayscale, invert, opacity } = value;
    const filters = [];
    
    if (blur !== 0) filters.push(`blur(${blur}px)`);
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
    if (hue !== 0) filters.push(`hue-rotate(${hue}deg)`);
    if (sepia !== 0) filters.push(`sepia(${sepia}%)`);
    if (grayscale !== 0) filters.push(`grayscale(${grayscale}%)`);
    if (invert !== 0) filters.push(`invert(${invert}%)`);
    if (opacity !== 100) filters.push(`opacity(${opacity}%)`);
    
    return filters.length > 0 ? filters.join(' ') : 'none';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <Button variant="ghost" size="sm" onClick={reset} className="h-7">
          <RotateCcw size={12} className="mr-1" />
          Reset
        </Button>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500"
            style={{ filter: getFilterString() }}
          />
        </div>
        <p className="text-xs text-center mt-2 text-muted-foreground">Filter Preview</p>
      </div>

      {/* Filter Controls */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Blur: {value.blur}px</Label>
          <Slider
            value={[value.blur]}
            onValueChange={([val]) => handleChange('blur', val)}
            max={20}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Brightness: {value.brightness}%</Label>
          <Slider
            value={[value.brightness]}
            onValueChange={([val]) => handleChange('brightness', val)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Contrast: {value.contrast}%</Label>
          <Slider
            value={[value.contrast]}
            onValueChange={([val]) => handleChange('contrast', val)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Saturation: {value.saturate}%</Label>
          <Slider
            value={[value.saturate]}
            onValueChange={([val]) => handleChange('saturate', val)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Hue Rotate: {value.hue}°</Label>
          <Slider
            value={[value.hue]}
            onValueChange={([val]) => handleChange('hue', val)}
            max={360}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Sepia: {value.sepia}%</Label>
          <Slider
            value={[value.sepia]}
            onValueChange={([val]) => handleChange('sepia', val)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Grayscale: {value.grayscale}%</Label>
          <Slider
            value={[value.grayscale]}
            onValueChange={([val]) => handleChange('grayscale', val)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Invert: {value.invert}%</Label>
          <Slider
            value={[value.invert]}
            onValueChange={([val]) => handleChange('invert', val)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Opacity: {value.opacity}%</Label>
          <Slider
            value={[value.opacity]}
            onValueChange={([val]) => handleChange('opacity', val)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};