import React, { useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Switch } from '@repo/ui/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { AnimationFieldProps } from '@repo/editor/lib/types';

export const AnimationField: React.FC<AnimationFieldProps> = ({ value, onChange, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const animationPresets = {
    fadeIn: {
      name: 'Fade In',
      keyframes: { from: { opacity: 0 }, to: { opacity: 1 } }
    },
    slideUp: {
      name: 'Slide Up',
      keyframes: { from: { transform: 'translateY(30px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } }
    },
    slideDown: {
      name: 'Slide Down',
      keyframes: { from: { transform: 'translateY(-30px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } }
    },
    slideLeft: {
      name: 'Slide Left',
      keyframes: { from: { transform: 'translateX(30px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } }
    },
    slideRight: {
      name: 'Slide Right',
      keyframes: { from: { transform: 'translateX(-30px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } }
    },
    zoomIn: {
      name: 'Zoom In',
      keyframes: { from: { transform: 'scale(0.8)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } }
    },
    zoomOut: {
      name: 'Zoom Out',
      keyframes: { from: { transform: 'scale(1.2)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } }
    },
    bounce: {
      name: 'Bounce',
      keyframes: {
        '0%': { transform: 'scale(0.8)', opacity: 0 },
        '50%': { transform: 'scale(1.1)', opacity: 0.8 },
        '100%': { transform: 'scale(1)', opacity: 1 }
      }
    },
    rotate: {
      name: 'Rotate',
      keyframes: { from: { transform: 'rotate(-180deg)', opacity: 0 }, to: { transform: 'rotate(0deg)', opacity: 1 } }
    },
    flip: {
      name: 'Flip',
      keyframes: { from: { transform: 'rotateY(-90deg)', opacity: 0 }, to: { transform: 'rotateY(0deg)', opacity: 1 } }
    }
  };

  const easingOptions = [
    { label: 'Ease', value: 'ease' },
    { label: 'Ease In', value: 'ease-in' },
    { label: 'Ease Out', value: 'ease-out' },
    { label: 'Ease In Out', value: 'ease-in-out' },
    { label: 'Linear', value: 'linear' },
    { label: 'Bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    { label: 'Back', value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  ];

  const triggerOptions = [
    { label: 'On Load', value: 'onLoad' },
    { label: 'On Scroll Into View', value: 'onScrollIntoView' },
    { label: 'On Hover', value: 'onHover' },
    { label: 'On Click', value: 'onClick' },
    { label: 'Continuous', value: 'continuous' },
  ];

  const handleChange = (property: string, newValue: any) => {
    onChange({ ...value, [property]: newValue });
  };

  const playAnimation = () => {
    setIsPlaying(true);
    setPreviewKey(prev => prev + 1);
    setTimeout(() => setIsPlaying(false), value.duration);
  };

  const resetAnimation = () => {
    onChange({
      type: 'none',
      duration: 600,
      delay: 0,
      easing: 'ease-out',
      trigger: 'onScrollIntoView',
      repeat: false,
      repeatCount: 1,
      direction: 'normal',
      fillMode: 'forwards',
    });
  };

  const getAnimationCSS = () => {
    if (value.type === 'none') return {};
    
    const preset = animationPresets[value.type as keyof typeof animationPresets];
    if (!preset) return {};

    return {
      animation: `preview-animation ${value.duration}ms ${value.easing} ${value.delay}ms ${value.fillMode}`,
      animationIterationCount: value.repeat ? (value.repeatCount === -1 ? 'infinite' : value.repeatCount) : 1,
      animationDirection: value.direction,
    };
  };

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <Tabs defaultValue="entrance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entrance">Entrance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="entrance" className="space-y-4">
          {/* Preview */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="flex justify-center items-center h-20">
              <div
                key={previewKey}
                className="w-12 h-12 bg-blue-500 rounded"
                style={getAnimationCSS()}
              />
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={playAnimation}
                disabled={isPlaying}
                className="h-7"
              >
                <Play size={12} className="mr-1" />
                Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAnimation}
                className="h-7"
              >
                <RotateCcw size={12} className="mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Animation Type */}
          <div>
            <Label className="text-xs text-muted-foreground">Animation Type</Label>
            <Select
              value={value.type}
              onValueChange={(val) => handleChange('type', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {Object.entries(animationPresets).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-xs text-muted-foreground">Duration: {value.duration}ms</Label>
            <Slider
              value={[value.duration]}
              onValueChange={([val]) => handleChange('duration', val)}
              max={3000}
              min={100}
              step={100}
              className="w-full"
            />
          </div>

          {/* Delay */}
          <div>
            <Label className="text-xs text-muted-foreground">Delay: {value.delay}ms</Label>
            <Slider
              value={[value.delay]}
              onValueChange={([val]) => handleChange('delay', val)}
              max={2000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>

          {/* Easing */}
          <div>
            <Label className="text-xs text-muted-foreground">Easing</Label>
            <Select
              value={value.easing}
              onValueChange={(val) => handleChange('easing', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {easingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trigger */}
          <div>
            <Label className="text-xs text-muted-foreground">Trigger</Label>
            <Select
              value={value.trigger}
              onValueChange={(val) => handleChange('trigger', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {/* Repeat */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={value.repeat}
              onCheckedChange={(checked) => handleChange('repeat', checked)}
              id="repeat-animation"
            />
            <Label htmlFor="repeat-animation" className="text-xs">Repeat Animation</Label>
          </div>

          {value.repeat && (
            <div>
              <Label className="text-xs text-muted-foreground">
                Repeat Count: {value.repeatCount === -1 ? 'Infinite' : value.repeatCount}
              </Label>
              <Slider
                value={[value.repeatCount === -1 ? 10 : value.repeatCount]}
                onValueChange={([val]) => handleChange('repeatCount', val === 10 ? -1 : val)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set to max for infinite repeat
              </p>
            </div>
          )}

          {/* Direction */}
          <div>
            <Label className="text-xs text-muted-foreground">Direction</Label>
            <Select
              value={value.direction}
              onValueChange={(val) => handleChange('direction', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="reverse">Reverse</SelectItem>
                <SelectItem value="alternate">Alternate</SelectItem>
                <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fill Mode */}
          <div>
            <Label className="text-xs text-muted-foreground">Fill Mode</Label>
            <Select
              value={value.fillMode}
              onValueChange={(val) => handleChange('fillMode', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forwards">Forwards</SelectItem>
                <SelectItem value="backwards">Backwards</SelectItem>
                <SelectItem value="both">Both</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {/* CSS Output */}
      {value.type !== 'none' && (
        <div className="p-3 bg-muted rounded-lg">
          <Label className="text-xs text-muted-foreground">Generated CSS</Label>
          <code className="text-xs block mt-1 text-muted-foreground">
            animation: {value.type} {value.duration}ms {value.easing} {value.delay}ms {value.fillMode}
          </code>
        </div>
      )}

      <style jsx>{`
        @keyframes preview-animation {
          ${value.type && animationPresets[value.type as keyof typeof animationPresets] 
            ? Object.entries(animationPresets[value.type as keyof typeof animationPresets].keyframes)
                .map(([key, styles]) => 
                  `${key} { ${Object.entries(styles as any).map(([prop, val]) => `${prop}: ${val}`).join('; ')} }`
                ).join(' ')
            : ''
          }
        }
      `}</style>
    </div>
  );
};