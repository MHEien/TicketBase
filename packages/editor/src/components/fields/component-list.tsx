import React, { useState } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import type{ ComponentListProps } from '@repo/editor/lib/types';
import { FloatingActionButton } from './fab';
import { DraggableResizablePanel } from './resizeable';
export const CustomComponentList = ({ children }: ComponentListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        {/* Main floating add button */}
        <FloatingActionButton
          onClick={() => setIsOpen(!isOpen)}
          icon={Plus}
          label="Add Components"
          variant="primary"
          isActive={isOpen}
          className="fixed bottom-32 right-6 z-30"
        />
  
        {/* Component list panel */}
        <DraggableResizablePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Add Components"
          description="Drag and drop components to build your page"
          panelId="components"
          defaultPosition={{ x: window.innerWidth - 350, y: 100 }}
          defaultSize={{ width: 320, height: 500 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-3 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground">All Components</h4>
              <div className="space-y-2">
                {children}
              </div>
            </TabsContent>
            
            <TabsContent value="layout" className="space-y-3 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground">Structure Components</h4>
              <div className="space-y-2">
                {React.Children.toArray(children).filter((child: any) => {
                  const componentName = child?.props?.name || child?.key;
                  return ['Section', 'Container', 'Columns', 'Spacer'].includes(componentName);
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-3 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground">Content Components</h4>
              <div className="space-y-2">
                {React.Children.toArray(children).filter((child: any) => {
                  const componentName = child?.props?.name || child?.key;
                  return ['AdvancedHeading', 'AdvancedText', 'AdvancedButton', 'ImageBlock', 'VideoPlayer', 'ImageGallery'].includes(componentName);
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-3 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground">Interactive Components</h4>
                           <div className="space-y-2">
                 {React.Children.toArray(children).filter((child: any) => {
                   const componentName = child?.props?.name || child?.key;
                   return ['ContactForm', 'Testimonial', 'ProgressBar', 'HeroSection', 'FeatureGrid', 'CTABlock'].includes(componentName);
                 })}
               </div>
            </TabsContent>
          </Tabs>
        </DraggableResizablePanel>
      </>
    );
  };