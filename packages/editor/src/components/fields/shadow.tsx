import React, { useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Switch } from '@repo/ui/components/ui/switch';
import { Plus, X } from 'lucide-react';
import { ColorPickerField } from './color-picker';
import type { ShadowFieldProps } from '@repo/editor/lib/types';

export const ShadowField: React.FC<ShadowFieldProps> = ({ value, onChange, label }) => {
  const [shadows, setShadows] = useState(value || []);

  const addShadow = () => {
    const newShadow = {
      id: Date.now().toString(),
      type: 'box',
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: '#000000',
      opacity: 0.1,
      inset: false,
    };
    const newShadows = [...shadows, newShadow];
    setShadows(newShadows);
    onChange(newShadows);
  };

  const removeShadow = (id: string) => {
    const newShadows = shadows.filter(shadow => shadow.id !== id);
    setShadows(newShadows);
    onChange(newShadows);
  };

  const updateShadow = (id: string, property: string, newValue: any) => {
    const newShadows = shadows.map(shadow =>
      shadow.id === id ? { ...shadow, [property]: newValue } : shadow
    );
    setShadows(newShadows);
    onChange(newShadows);
  };

  const getShadowPreview = (shadow: any) => {
    const { type, offsetX, offsetY, blurRadius, spreadRadius, color, opacity, inset } = shadow;
    const colorWithOpacity = `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
    
    if (type === 'box') {
      return `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorWithOpacity}`;
    } else {
      return `${offsetX}px ${offsetY}px ${blurRadius}px ${colorWithOpacity}`;
    }
  };

  const combinedShadow = shadows.map(getShadowPreview).join(', ');

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      {/* Preview */}
      {shadows.length > 0 && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
          <div
            className="w-20 h-20 bg-white rounded-lg mx-auto"
            style={{ 
              boxShadow: combinedShadow,
              textShadow: shadows.filter(s => s.type === 'text').map(getShadowPreview).join(', ') || 'none'
            }}
          />
          <p className="text-xs text-center mt-2 text-muted-foreground">Preview</p>
        </div>
      )}

      {/* Shadow List */}
      <div className="space-y-3">
        {shadows.map((shadow, index) => (
          <div key={shadow.id} className="p-3 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Shadow {index + 1}</Label>
              <div className="flex items-center gap-2">
                <Select 
                  value={shadow.type} 
                  onValueChange={(val) => updateShadow(shadow.id, 'type', val)}
                >
                  <SelectTrigger className="w-20 h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeShadow(shadow.id)}
                  className="h-7 w-7 p-0"
                >
                  <X size={12} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">X Offset</Label>
                <Input
                  type="number"
                  value={shadow.offsetX}
                  onChange={(e) => updateShadow(shadow.id, 'offsetX', parseInt(e.target.value) || 0)}
                  className="h-7"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Y Offset</Label>
                <Input
                  type="number"
                  value={shadow.offsetY}
                  onChange={(e) => updateShadow(shadow.id, 'offsetY', parseInt(e.target.value) || 0)}
                  className="h-7"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Blur: {shadow.blurRadius}px</Label>
                <Slider
                  value={[shadow.blurRadius]}
                  onValueChange={([val]) => updateShadow(shadow.id, 'blurRadius', val)}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              {shadow.type === 'box' && (
                <div>
                  <Label className="text-xs text-muted-foreground">Spread: {shadow.spreadRadius}px</Label>
                  <Slider
                    value={[shadow.spreadRadius]}
                    onValueChange={([val]) => updateShadow(shadow.id, 'spreadRadius', val)}
                    max={20}
                    min={-20}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <ColorPickerField
                value={shadow.color}
                onChange={(color) => updateShadow(shadow.id, 'color', color)}
                label="Color"
              />
              
              <div>
                <Label className="text-xs text-muted-foreground">Opacity: {Math.round(shadow.opacity * 100)}%</Label>
                <Slider
                  value={[shadow.opacity]}
                  onValueChange={([val]) => updateShadow(shadow.id, 'opacity', val)}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </div>

            {shadow.type === 'box' && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={shadow.inset}
                  onCheckedChange={(checked) => updateShadow(shadow.id, 'inset', checked)}
                  id={`inset-${shadow.id}`}
                />
                <Label htmlFor={`inset-${shadow.id}`} className="text-xs">Inner shadow</Label>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addShadow}
        className="w-full"
      >
        <Plus size={14} className="mr-1" />
        Add Shadow
      </Button>
    </div>
  );
};