import { useState } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Layers } from 'lucide-react';
import type{ ComponentListProps } from '@repo/editor/lib/types';
import { FloatingActionButton } from './fab';
import { DraggableResizablePanel } from './resizeable';

export const CustomOutline = ({ children }: ComponentListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <FloatingActionButton
          onClick={() => setIsOpen(!isOpen)}
          icon={Layers}
          label="Page Structure"
          variant="default"
          isActive={isOpen}
          className="fixed bottom-64 right-6 z-30"
        />
  
        <DraggableResizablePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Page Structure"
          description="Navigate and organize your page components"
          panelId="outline"
          defaultPosition={{ x: 50, y: 100 }}
          defaultSize={{ width: 300, height: 500 }}
        >
          <div className="text-sm space-y-2">
            {children}
          </div>
        </DraggableResizablePanel>
      </>
    );
  };