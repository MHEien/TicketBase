import React, { useState, useRef, useEffect, useCallback } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { X, Move, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import type{ DraggableResizablePanelProps } from '@repo/editor/lib/types';
export const DraggableResizablePanel: React.FC<DraggableResizablePanelProps> = ({
    isOpen,
    onClose,
    children,
    title,
    description,
    defaultPosition = { x: window.innerWidth - 350, y: 100 },
    defaultSize = { width: 320, height: 400 },
    minSize = { width: 280, height: 200 },
    panelId
  }) => {
    const [position, setPosition] = useState(() => {
      const saved = localStorage.getItem(`panel-${panelId}-position`);
      return saved ? JSON.parse(saved) : defaultPosition;
    });
    
    const [size, setSize] = useState(() => {
      const saved = localStorage.getItem(`panel-${panelId}-size`);
      return saved ? JSON.parse(saved) : defaultSize;
    });
    
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    
    const panelRef = useRef<HTMLDivElement>(null);
  
    // Save position and size to localStorage
    useEffect(() => {
      localStorage.setItem(`panel-${panelId}-position`, JSON.stringify(position));
    }, [position, panelId]);
  
    useEffect(() => {
      localStorage.setItem(`panel-${panelId}-size`, JSON.stringify(size));
    }, [size, panelId]);
  
    // Handle dragging
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.resize-handle') || 
          (e.target as HTMLElement).closest('.panel-content')) return;
      
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }, [position]);
  
    // Handle resizing
    const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height
      });
      e.preventDefault();
      e.stopPropagation();
    }, [size]);
  
    // Mouse move handler
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
          const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
          setPosition({ x: newX, y: newY });
        }
        
        if (isResizing) {
          const deltaX = e.clientX - resizeStart.x;
          const deltaY = e.clientY - resizeStart.y;
          const newWidth = Math.max(minSize.width, resizeStart.width + deltaX);
          const newHeight = Math.max(minSize.height, resizeStart.height + deltaY);
          setSize({ width: newWidth, height: newHeight });
        }
      };
  
      const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
      };
  
      if (isDragging || isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
      }
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }, [isDragging, isResizing, dragStart, resizeStart, size, minSize]);
  
    const resetPosition = () => {
      setPosition(defaultPosition);
      setSize(defaultSize);
    };
  
    if (!isOpen) return null;
  
    return (
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="fixed z-50"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
      >
        <Card className="h-full shadow-2xl border-border/50 backdrop-blur-xl bg-card/95 flex flex-col">
          {/* Header with drag handle */}
          <CardHeader 
            className="pb-3 cursor-grab active:cursor-grabbing flex-shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Move size={16} className="text-muted-foreground" />
                  {title}
                </CardTitle>
                {description && (
                  <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={resetPosition}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title="Reset position and size"
                >
                  <RotateCcw size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onClose} 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Content area */}
          <CardContent className="flex-1 overflow-y-auto panel-content">
            {children}
          </CardContent>
          
          {/* Resize handle */}
          <div 
            className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-muted-foreground/20 hover:bg-muted-foreground/40 transition-colors"
            onMouseDown={handleResizeMouseDown}
            style={{
              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
            }}
          />
        </Card>
      </motion.div>
    );
  };
  