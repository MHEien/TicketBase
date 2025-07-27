import React, { useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Plus, X } from 'lucide-react';
import type { GradientPickerFieldProps } from '@repo/editor/lib/types';

export const GradientPickerField: React.FC<GradientPickerFieldProps> = ({ value, onChange, label }) => {
  const [activeStop, setActiveStop] = useState(0);

  const addColorStop = () => {
    const newStops = [...value.stops, { color: '#000000', position: 100 }];
    onChange({ ...value, stops: newStops });
  };

  const removeColorStop = (index: number) => {
    if (value.stops.length > 2) {
      const newStops = value.stops.filter((_, i) => i !== index);
      onChange({ ...value, stops: newStops });
      setActiveStop(Math.max(0, activeStop - 1));
    }
  };

  const updateColorStop = (index: number, property: string, newValue: any) => {
    const newStops = value.stops.map((stop, i) =>
      i === index ? { ...stop, [property]: newValue } : stop
    );
    onChange({ ...value, stops: newStops });
  };

  const updateGradientProperty = (property: string, newValue: any) => {
    onChange({ ...value, [property]: newValue });
  };

  const getGradientCSS = () => {
    const { type, direction, stops } = value;
    const stopList = stops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (type === 'linear') {
      return `linear-gradient(${direction}deg, ${stopList})`;
    } else {
      return `radial-gradient(circle, ${stopList})`;
    }
  };

  const colorPalettes = [
    { name: 'Sunset', colors: ['#ff7e5f', '#feb47b'] },
    { name: 'Ocean', colors: ['#2193b0', '#6dd5ed'] },
    { name: 'Purple', colors: ['#667eea', '#764ba2'] },
    { name: 'Green', colors: ['#11998e', '#38ef7d'] },
    { name: 'Pink', colors: ['#f093fb', '#f5576c'] },
    { name: 'Blue', colors: ['#4facfe', '#00f2fe'] },
  ];

  const applyPalette = (colors: string[]) => {
    const newStops = colors.map((color, index) => ({
      color,
      position: (index / (colors.length - 1)) * 100,
    }));
    onChange({ ...value, stops: newStops });
  };

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <Tabs defaultValue="gradient" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solid">Solid</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
        </TabsList>

        <TabsContent value="solid" className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value.stops[0]?.color || '#000000'}
              onChange={(e) => updateColorStop(0, 'color', e.target.value)}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <Input
              value={value.stops[0]?.color || '#000000'}
              onChange={(e) => updateColorStop(0, 'color', e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </TabsContent>

        <TabsContent value="gradient" className="space-y-4">
          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div
              className="w-full h-16 rounded-lg border"
              style={{ background: getGradientCSS() }}
            />
            <p className="text-xs text-center mt-2 text-muted-foreground">Gradient Preview</p>
          </div>

          {/* Quick Palettes */}
          <div>
            <Label className="text-xs text-muted-foreground">Quick Palettes</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {colorPalettes.map((palette) => (
                <Button
                  key={palette.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPalette(palette.colors)}
                  className="h-8 p-1"
                >
                  <div
                    className="w-full h-4 rounded"
                    style={{
                      background: `linear-gradient(90deg, ${palette.colors.join(', ')})`
                    }}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Gradient Type */}
          <div>
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select
              value={value.type}
              onValueChange={(val) => updateGradientProperty('type', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Direction (for linear gradients) */}
          {value.type === 'linear' && (
            <div>
              <Label className="text-xs text-muted-foreground">Direction: {value.direction}°</Label>
              <Slider
                value={[value.direction]}
                onValueChange={([val]) => updateGradientProperty('direction', val)}
                max={360}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          )}

          {/* Color Stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Color Stops</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addColorStop}
                className="h-7"
              >
                <Plus size={12} className="mr-1" />
                Add Stop
              </Button>
            </div>

            {value.stops.map((stop, index) => (
              <div
                key={index}
                className={`p-3 border rounded ${activeStop === index ? 'border-primary' : ''}`}
                onClick={() => setActiveStop(index)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                    className="w-8 h-6 rounded border cursor-pointer"
                  />
                  <Input
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                    className="flex-1 h-6 text-xs"
                  />
                  {value.stops.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColorStop(index);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X size={10} />
                    </Button>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Position: {stop.position}%</Label>
                  <Slider
                    value={[stop.position]}
                    onValueChange={([val]) => updateColorStop(index, 'position', val)}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};