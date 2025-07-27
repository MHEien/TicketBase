import { useState } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Palette } from 'lucide-react';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Separator } from '@repo/ui/components/ui/separator';
import { FloatingActionButton } from './fab';
import { DraggableResizablePanel } from './resizeable';
import { ColorPickerField } from './color-picker';

export const GlobalStylesPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <FloatingActionButton
          onClick={() => setIsOpen(!isOpen)}
          icon={Palette}
          label="Global Styles"
          variant="default"
          isActive={isOpen}
          className="fixed bottom-80 right-6 z-30"
        />
  
        <DraggableResizablePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Global Styles"
          description="Manage site-wide styling and theme settings"
          panelId="global-styles"
          defaultPosition={{ x: 50, y: 200 }}
          defaultSize={{ width: 350, height: 600 }}
        >
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
              <TabsTrigger value="typography" className="text-xs">Typography</TabsTrigger>
              <TabsTrigger value="spacing" className="text-xs">Spacing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="colors" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Brand Colors</h4>
                
                <div className="space-y-3">
                  <ColorPickerField 
                    value="#0070f3" 
                    onChange={() => {}} 
                    label="Primary Color" 
                  />
                  <ColorPickerField 
                    value="#666666" 
                    onChange={() => {}} 
                    label="Secondary Color" 
                  />
                  <ColorPickerField 
                    value="#000000" 
                    onChange={() => {}} 
                    label="Text Color" 
                  />
                  <ColorPickerField 
                    value="#f5f5f5" 
                    onChange={() => {}} 
                    label="Background Color" 
                  />
                </div>
  
                <Separator />
  
                <h4 className="text-sm font-medium">Status Colors</h4>
                <div className="space-y-3">
                  <ColorPickerField 
                    value="#10b981" 
                    onChange={() => {}} 
                    label="Success Color" 
                  />
                  <ColorPickerField 
                    value="#f59e0b" 
                    onChange={() => {}} 
                    label="Warning Color" 
                  />
                  <ColorPickerField 
                    value="#ef4444" 
                    onChange={() => {}} 
                    label="Error Color" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Global Typography</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Primary Font</Label>
                    <Select defaultValue="inter">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="opensans">Open Sans</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div>
                    <Label className="text-xs text-muted-foreground">Base Font Size: 16px</Label>
                    <Slider
                      defaultValue={[16]}
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>
  
                  <div>
                    <Label className="text-xs text-muted-foreground">Line Height: 1.6</Label>
                    <Slider
                      defaultValue={[1.6]}
                      max={2.5}
                      min={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
  
                <Separator />
  
                <h4 className="text-sm font-medium">Heading Styles</h4>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <div>H1: 2.5rem / Bold</div>
                    <div>H2: 2rem / Semi Bold</div>
                    <div>H3: 1.5rem / Semi Bold</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="spacing" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Global Spacing</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Base Spacing Unit: 8px</Label>
                    <Slider
                      defaultValue={[8]}
                      max={16}
                      min={4}
                      step={1}
                      className="w-full"
                    />
                  </div>
  
                  <div>
                    <Label className="text-xs text-muted-foreground">Section Spacing: 80px</Label>
                    <Slider
                      defaultValue={[80]}
                      max={160}
                      min={40}
                      step={8}
                      className="w-full"
                    />
                  </div>
  
                  <div>
                    <Label className="text-xs text-muted-foreground">Element Spacing: 20px</Label>
                    <Slider
                      defaultValue={[20]}
                      max={60}
                      min={10}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </div>
  
                <Separator />
  
                <h4 className="text-sm font-medium">Border Radius</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Base Radius: 8px</Label>
                    <Slider
                      defaultValue={[8]}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
  
                  <div>
                    <Label className="text-xs text-muted-foreground">Button Radius: 6px</Label>
                    <Slider
                      defaultValue={[6]}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DraggableResizablePanel>
      </>
    );
  };