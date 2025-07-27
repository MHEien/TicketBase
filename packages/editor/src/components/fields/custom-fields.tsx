import { useState, useEffect } from 'react';
import { usePuck } from '@measured/puck';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Settings, MousePointer } from 'lucide-react';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Switch } from '@repo/ui/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Separator } from '@repo/ui/components/ui/separator';
import type{ ComponentListProps } from '@repo/editor/lib/types';
import { FloatingActionButton } from './fab';
import { DraggableResizablePanel } from './resizeable';

export const CustomFields = ({ children }: ComponentListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { selectedItem } = usePuck();
    
    // Auto-open properties panel when a component is selected
    useEffect(() => {
      if (selectedItem) {
        setIsOpen(true);
      }
    }, [selectedItem]);
    
    return (
      <>
        <FloatingActionButton
          onClick={() => setIsOpen(!isOpen)}
          icon={Settings}
          label="Properties"
          variant="default"
          isActive={isOpen}
          className="fixed bottom-48 right-6 z-30"
        />
  
        <DraggableResizablePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={selectedItem ? `Edit ${selectedItem.type}` : "Properties"}
          description={selectedItem ? "Customize component settings" : "Select a component to edit its properties"}
          panelId="properties"
          defaultPosition={{ x: window.innerWidth - 700, y: 100 }}
          defaultSize={{ width: 350, height: 500 }}
        >
          {selectedItem ? (
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
                <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {children}
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Style Controls</h4>
                  <p className="text-xs text-muted-foreground">Advanced styling options will appear here based on the selected component.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Advanced Settings</h4>
                  <div className="space-y-2">
                    <Label className="text-xs">CSS Classes</Label>
                    <Input placeholder="custom-class another-class" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Component ID</Label>
                    <Input placeholder="unique-id" className="h-8 text-xs" />
                  </div>
                  <Separator />
                                   <div className="space-y-2">
                     <Label className="text-xs text-muted-foreground">Responsive Visibility</Label>
                     <div className="space-y-2">
                       <div className="flex items-center space-x-2">
                         <Switch defaultChecked id="show-desktop" />
                         <Label htmlFor="show-desktop" className="text-xs">Desktop</Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Switch defaultChecked id="show-tablet" />
                         <Label htmlFor="show-tablet" className="text-xs">Tablet</Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Switch defaultChecked id="show-mobile" />
                         <Label htmlFor="show-mobile" className="text-xs">Mobile</Label>
                       </div>
                     </div>
                   </div>
                   
                   <Separator />
                   
                   <div className="space-y-2">
                     <Label className="text-xs text-muted-foreground">Animations</Label>
                     <div className="space-y-2">
                       <div>
                         <Label className="text-xs text-muted-foreground">Entrance Animation</Label>
                         <Select defaultValue="none">
                           <SelectTrigger className="h-8">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="none">None</SelectItem>
                             <SelectItem value="fadeIn">Fade In</SelectItem>
                             <SelectItem value="slideUp">Slide Up</SelectItem>
                             <SelectItem value="slideDown">Slide Down</SelectItem>
                             <SelectItem value="slideLeft">Slide Left</SelectItem>
                             <SelectItem value="slideRight">Slide Right</SelectItem>
                             <SelectItem value="zoomIn">Zoom In</SelectItem>
                             <SelectItem value="bounce">Bounce</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       
                       <div>
                         <Label className="text-xs text-muted-foreground">Animation Delay: 0ms</Label>
                         <Slider
                           defaultValue={[0]}
                           max={2000}
                           min={0}
                           step={100}
                           className="w-full"
                         />
                       </div>
                       
                       <div>
                         <Label className="text-xs text-muted-foreground">Animation Duration: 600ms</Label>
                         <Slider
                           defaultValue={[600]}
                           max={2000}
                           min={200}
                           step={100}
                           className="w-full"
                         />
                       </div>
                       
                       <div className="flex items-center space-x-2">
                         <Switch id="repeat-animation" />
                         <Label htmlFor="repeat-animation" className="text-xs">Repeat on scroll</Label>
                       </div>
                     </div>
                   </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 p-3 rounded-full bg-muted">
                <MousePointer className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Select a component to edit its properties</p>
            </div>
          )}
        </DraggableResizablePanel>
      </>
    );
  };