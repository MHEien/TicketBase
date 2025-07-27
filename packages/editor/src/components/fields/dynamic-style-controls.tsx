import React from 'react';
import { usePuck } from '@measured/puck';
import { Label } from '@repo/ui/components/ui/label';
import { Separator } from '@repo/ui/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { 
  ShadowField, 
  TransformField, 
  FilterField, 
  GradientPickerField,
  ColorPickerField,
  SpacingField,
  BorderField 
} from './index';

export const DynamicStyleControls = () => {
  const { selectedItem, dispatch } = usePuck();

  if (!selectedItem) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Select a component to edit its styles</p>
      </div>
    );
  }

  const updateStyle = (property: string, value: any) => {
    dispatch({
      type: 'setData',
      payload: {
        ...selectedItem,
        props: {
          ...selectedItem.props,
          [property]: value,
        },
      },
    });
  };

  const getDefaultStyles = () => ({
    // Background & Colors
    backgroundColor: selectedItem.props.backgroundColor || '#ffffff',
    backgroundGradient: selectedItem.props.backgroundGradient || {
      type: 'linear',
      direction: 90,
      stops: [
        { color: '#ffffff', position: 0 },
        { color: '#f0f0f0', position: 100 }
      ]
    },
    
    // Spacing
    padding: selectedItem.props.padding || { top: 0, right: 0, bottom: 0, left: 0 },
    margin: selectedItem.props.margin || { top: 0, right: 0, bottom: 0, left: 0 },
    
    // Border
    border: selectedItem.props.border || { width: 0, style: 'solid', color: '#e5e5e5', radius: 0 },
    
    // Effects
    shadow: selectedItem.props.shadow || [],
    transform: selectedItem.props.transform || {
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      skewX: 0,
      skewY: 0,
      translateX: 0,
      translateY: 0,
    },
    filter: selectedItem.props.filter || {
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      opacity: 100,
    },
  });

  const styles = getDefaultStyles();

  return (
    <div className="space-y-4">
      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-4 text-xs">
          <TabsTrigger value="background">BG</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="advanced">More</TabsTrigger>
        </TabsList>

        <TabsContent value="background" className="space-y-4 mt-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Background</Label>
            
            <ColorPickerField
              value={styles.backgroundColor}
              onChange={(value) => updateStyle('backgroundColor', value)}
              label="Solid Color"
            />
            
            <Separator />
            
            <GradientPickerField
              value={styles.backgroundGradient}
              onChange={(value) => updateStyle('backgroundGradient', value)}
              label="Gradient"
            />
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 mt-4">
          <div className="space-y-4">
            <SpacingField
              value={styles.padding}
              onChange={(value) => updateStyle('padding', value)}
              label="Padding"
            />
            
            <SpacingField
              value={styles.margin}
              onChange={(value) => updateStyle('margin', value)}
              label="Margin"
            />
            
            <BorderField
              value={styles.border}
              onChange={(value) => updateStyle('border', value)}
              label="Border"
            />
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4 mt-4">
          <div className="space-y-4">
            <ShadowField
              value={styles.shadow}
              onChange={(value) => updateStyle('shadow', value)}
              label="Shadows"
            />
            
            <TransformField
              value={styles.transform}
              onChange={(value) => updateStyle('transform', value)}
              label="Transform"
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-4">
          <div className="space-y-4">
            <FilterField
              value={styles.filter}
              onChange={(value) => updateStyle('filter', value)}
              label="Filters"
            />
            
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-xs font-medium text-muted-foreground">Advanced CSS</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Advanced CSS controls like flexbox, grid, and positioning will be added here.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};