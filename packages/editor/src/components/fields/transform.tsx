import React from 'react';
import { Label } from '@repo/ui/components/ui/label';
import { Slider } from '@repo/ui/components/ui/slider';
import { Input } from '@repo/ui/components/ui/input';
import { Button } from '@repo/ui/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { TransformFieldProps } from '@repo/editor/lib/types';

export const TransformField: React.FC<TransformFieldProps> = ({ value, onChange, label }) => {
  const handleChange = (property: string, newValue: number) => {
    onChange({ ...value, [property]: newValue });
  };

  const reset = () => {
    onChange({
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      skewX: 0,
      skewY: 0,
      translateX: 0,
      translateY: 0,
    });
  };

  const getTransformString = () => {
    const { scaleX, scaleY, rotate, skewX, skewY, translateX, translateY } = value;
    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg)`;
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
        <div className="flex justify-center items-center h-20">
          <div
            className="w-12 h-12 bg-blue-500 rounded"
            style={{ transform: getTransformString() }}
          />
        </div>
        <p className="text-xs text-center mt-2 text-muted-foreground">Transform Preview</p>
      </div>

      {/* Scale Controls */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Scale</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">X: {value.scaleX}</Label>
            <Slider
              value={[value.scaleX]}
              onValueChange={([val]) => handleChange('scaleX', val)}
              max={3}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Y: {value.scaleY}</Label>
            <Slider
              value={[value.scaleY]}
              onValueChange={([val]) => handleChange('scaleY', val)}
              max={3}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div>
        <Label className="text-xs text-muted-foreground">Rotation: {value.rotate}°</Label>
        <Slider
          value={[value.rotate]}
          onValueChange={([val]) => handleChange('rotate', val)}
          max={360}
          min={-360}
          step={1}
          className="w-full"
        />
      </div>

      {/* Skew Controls */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Skew</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">X: {value.skewX}°</Label>
            <Slider
              value={[value.skewX]}
              onValueChange={([val]) => handleChange('skewX', val)}
              max={45}
              min={-45}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Y: {value.skewY}°</Label>
            <Slider
              value={[value.skewY]}
              onValueChange={([val]) => handleChange('skewY', val)}
              max={45}
              min={-45}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Translation Controls */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Translate</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">X</Label>
            <Input
              type="number"
              value={value.translateX}
              onChange={(e) => handleChange('translateX', parseInt(e.target.value) || 0)}
              className="h-7"
              placeholder="0px"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Y</Label>
            <Input
              type="number"
              value={value.translateY}
              onChange={(e) => handleChange('translateY', parseInt(e.target.value) || 0)}
              className="h-7"
              placeholder="0px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};