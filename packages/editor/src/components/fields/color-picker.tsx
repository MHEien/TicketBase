import React, {  } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import type { ColorPickerFieldProps } from '@repo/editor/lib/types';

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