import React, { useState, ReactNode, useRef, useEffect, useCallback } from 'react';
import { Puck, usePuck, Config } from '@measured/puck';
import '@measured/puck/puck.css';
import { Settings, Plus, Eye, Layers, Undo, Redo, X, Monitor, Smartphone, Tablet, ZoomIn, ZoomOut, Save, Globe, Sparkles, MousePointer, Type, Link, Move, RotateCcw, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FloatingPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  className?: string;
  description?: string;
}

interface ComponentListProps {
  children: ReactNode;
}

interface ComponentItemProps {
  name: string;
  children: ReactNode;
}

interface HeadingBlockProps {
  children: string;
}

interface TextBlockProps {
  text: string;
}

interface ButtonBlockProps {
  text: string;
  href: string;
}

interface RootProps {
  content: ReactNode;
}

interface DraggableResizablePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  description?: string;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  panelId: string;
}

// Enhanced floating action button with toggle state
const FloatingActionButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = "default",
  className = "",
  isActive = false 
}: { 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string; 
  variant?: "default" | "primary" | "secondary";
  className?: string;
  isActive?: boolean;
}) => {
  const getVariantStyles = () => {
    if (isActive) return "bg-primary text-primary-foreground shadow-lg shadow-primary/25";
    switch (variant) {
      case "primary": return "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25";
      case "secondary": return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      default: return "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground shadow-lg";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Button
        onClick={onClick}
        size="icon"
        className={`h-12 w-12 rounded-full transition-all duration-200 border-border/50 backdrop-blur-xl ${getVariantStyles()}`}
        title={label}
      >
        <Icon size={20} />
      </Button>
    </motion.div>
  );
};

// New Draggable and Resizable Panel Component
const DraggableResizablePanel: React.FC<DraggableResizablePanelProps> = ({
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

// Custom Component List with draggable panel
const CustomComponentList = ({ children }: ComponentListProps) => {
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
        defaultSize={{ width: 320, height: 400 }}
      >
        <div className="space-y-3">
          {children}
        </div>
      </DraggableResizablePanel>
    </>
  );
};

// Enhanced Properties Panel with draggable panel
const CustomFields = ({ children }: ComponentListProps) => {
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
        defaultSize={{ width: 320, height: 400 }}
      >
        {selectedItem ? (
          <div className="space-y-4">
            {children}
          </div>
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

// Enhanced Outline Panel with draggable panel
const CustomOutline = ({ children }: ComponentListProps) => {
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

// Hide the default action bar
const CustomActionBar = ({ children }: ComponentListProps) => {
  return <div style={{ display: 'none' }}>{children}</div>;
};

// Enhanced preview with sophisticated bottom toolbar
const CustomPreview = ({ children }: ComponentListProps) => {
  const [isAutoViewport, setIsAutoViewport] = useState(false);

  const CustomBottomToolbar = () => {
    const { appState, history, dispatch } = usePuck();
    const [currentZoom, setCurrentZoom] = useState(100);
    const [browserSize, setBrowserSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const viewports = [
      { id: 'auto', label: 'Auto', icon: Maximize, width: 'auto' as const },
      { id: 'desktop', label: 'Desktop', icon: Monitor, width: 1280 },
      { id: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
      { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 375 },
    ];

    const zoomOptions = [50, 75, 100, 125, 150, 200];

    // Track browser resize for auto viewport
    useEffect(() => {
      const handleResize = () => {
        setBrowserSize({ width: window.innerWidth, height: window.innerHeight });
        
        // If auto viewport is active, update the viewport immediately
        if (isAutoViewport) {
          dispatch({
            type: 'setUi',
            ui: {
              ...appState.ui,
              viewports: {
                ...appState.ui?.viewports,
                current: {
                  width: window.innerWidth - 48, // Account for padding
                  height: 'auto' as const
                }
              }
            }
          });
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isAutoViewport, appState.ui, dispatch]);

    const currentViewport = appState.ui?.viewports?.current || { width: 1280 };
    
    // Determine current viewport ID
    let currentViewportId: string;
    if (isAutoViewport) {
      currentViewportId = 'auto';
    } else if (currentViewport.width === 1280) {
      currentViewportId = 'desktop';
    } else if (currentViewport.width === 768) {
      currentViewportId = 'tablet';
    } else if (currentViewport.width === 375) {
      currentViewportId = 'mobile';
    } else {
      currentViewportId = 'auto';
    }

    const handleViewportChange = (viewport: any) => {
      if (viewport.id === 'auto') {
        setIsAutoViewport(true);
        dispatch({
          type: 'setUi',
          ui: {
            ...appState.ui,
            viewports: {
              ...appState.ui?.viewports,
              current: {
                width: browserSize.width - 48, // Account for padding
                height: 'auto' as const
              }
            }
          }
        });
      } else {
        setIsAutoViewport(false);
        dispatch({
          type: 'setUi',
          ui: {
            ...appState.ui,
            viewports: {
              ...appState.ui?.viewports,
              current: {
                width: viewport.width as number,
                height: 'auto' as const
              }
            }
          }
        });
      }
    };

    const handleZoomChange = (zoom: number) => {
      setCurrentZoom(zoom);
      setTimeout(() => {
        // Try multiple selectors to find the preview content
        const previewElement = document.querySelector('.Puck-frame') as HTMLElement ||
                              document.querySelector('.Puck-preview > div') as HTMLElement ||
                              document.querySelector('.Puck-preview iframe') as HTMLElement;
        
        if (previewElement) {
          previewElement.style.transform = `scale(${zoom / 100})`;
          previewElement.style.transformOrigin = 'top center';
          previewElement.style.transition = 'transform 0.3s ease';
          
          // Also adjust the container to prevent overflow issues
          const previewContainer = document.querySelector('.Puck-preview') as HTMLElement;
          if (previewContainer) {
            previewContainer.style.overflow = 'auto';
            previewContainer.style.display = 'flex';
            previewContainer.style.justifyContent = 'center';
            previewContainer.style.alignItems = 'flex-start';
          }
        } else {
          console.warn('Could not find preview element for zoom');
        }
      }, 100);
    };

    const handleSave = () => {
      localStorage.setItem('puck-draft', JSON.stringify(appState.data));
      console.log('Draft saved:', appState.data);
    };

    const handlePublish = () => {
      console.log('Publishing:', appState.data);
    };

    const handleUndo = () => {
      if (history.hasPast) {
        history.back();
      }
    };

    const handleRedo = () => {
      if (history.hasFuture) {
        history.forward();
      }
    };

    const currentViewportData = viewports.find(v => v.id === currentViewportId);
    const CurrentViewportIcon = currentViewportData?.icon || Monitor;

    return (
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        style={{ position: 'fixed' }}
      >
        <Card className="shadow-2xl border-border/50 backdrop-blur-xl bg-card/95">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Undo/Redo Group */}
              <div className="flex items-center gap-1">
                <Button 
                  onClick={handleUndo}
                  disabled={!history.hasPast}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Undo"
                >
                  <Undo size={14} />
                </Button>
                <Button 
                  onClick={handleRedo}
                  disabled={!history.hasFuture}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Redo"
                >
                  <Redo size={14} />
                </Button>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Viewport Controls */}
              <div className="flex items-center gap-2">
                <CurrentViewportIcon size={16} className="text-muted-foreground" />
                <div className="flex items-center gap-1">
                  {viewports.map(viewport => {
                    const Icon = viewport.icon;
                    return (
                      <Button
                        key={viewport.id}
                        onClick={() => handleViewportChange(viewport)}
                        variant={currentViewportId === viewport.id ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-2"
                        title={viewport.id === 'auto' ? `Auto (${browserSize.width}px)` : `${viewport.label} (${viewport.width}px)`}
                      >
                        <Icon size={14} />
                      </Button>
                    );
                  })}
                </div>
                {isAutoViewport && (
                  <Badge variant="outline" className="text-xs ml-2">
                    {browserSize.width}px × {browserSize.height}px
                  </Badge>
                )}
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const newZoom = Math.max(25, currentZoom - 25);
                    handleZoomChange(newZoom);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </Button>
                
                <Badge variant="outline" className="font-mono text-xs min-w-[60px] justify-center">
                  {currentZoom}%
                </Badge>

                <Button
                  onClick={() => {
                    const newZoom = Math.min(300, currentZoom + 25);
                    handleZoomChange(newZoom);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </Button>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleSave}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  <Save size={14} />
                  Save
                </Button>

                <Button 
                  onClick={handlePublish}
                  variant="default"
                  size="sm"
                  className="h-8"
                >
                  <Globe size={14} />
                  Publish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Add data attribute for auto viewport styling
  useEffect(() => {
    const previewElement = document.querySelector('.Puck-preview');
    const frameElement = document.querySelector('.Puck-frame');
    
    if (previewElement && frameElement) {
      if (isAutoViewport) {
        previewElement.setAttribute('data-auto-viewport', 'true');
        frameElement.setAttribute('data-auto-viewport', 'true');
      } else {
        previewElement.removeAttribute('data-auto-viewport');
        frameElement.removeAttribute('data-auto-viewport');
      }
    }
  }, [isAutoViewport]);

  return (
    <>
      {children}
      <CustomBottomToolbar />
    </>
  );
};

// Enhanced component item with sophisticated card design
const CustomComponentItem = ({ name, children }: ComponentItemProps) => {
  const getComponentIcon = (componentName: string) => {
    switch (componentName) {
      case 'HeadingBlock': return Type;
      case 'TextBlock': return Type;
      case 'ButtonBlock': return Link;
      default: return Sparkles;
    }
  };

  const getComponentDescription = (componentName: string) => {
    switch (componentName) {
      case 'HeadingBlock': return 'Add a heading to your page';
      case 'TextBlock': return 'Add a text paragraph';  
      case 'ButtonBlock': return 'Add a clickable button';
      default: return 'Drag to add component';
    }
  };

  const Icon = getComponentIcon(name);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", duration: 0.2 }}
    >
      <Card className="cursor-grab hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 active:cursor-grabbing">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm">{name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{getComponentDescription(name)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main App Component
export const FullscreenPuckApp = () => {
  const config = {
    root: {
      render: ({ children }: any) => {
        return (
          <div className="min-h-screen p-8 bg-background">
            {children}
          </div>
        );
      },
    },
    components: {
      HeadingBlock: {
        fields: {
          children: {
            type: "text" as const,
          },
        },
        defaultProps: {
          children: "New Heading",
        },
        render: ({ children }: any) => {
          return <h1 className="text-3xl font-bold mb-4 text-foreground">{children}</h1>;
        },
      },
      TextBlock: {
        fields: {
          text: {
            type: "textarea" as const,
          },
        },
        defaultProps: {
          text: "Enter your text here...",
        },
        render: ({ text }: any) => {
          return <p className="text-muted-foreground mb-4 leading-relaxed">{text}</p>;
        },
      },
      ButtonBlock: {
        fields: {
          text: {
            type: "text" as const,
          },
          href: {
            type: "text" as const,
          },
        },
        defaultProps: {
          text: "Click me",
          href: "#",
        },
        render: ({ text, href }: any) => {
          return (
            <a
              href={href}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mb-4"
            >
              {text}
            </a>
          );
        },
      },
    },
  };

  const initialData = {};

  const handlePublish = async (data: any) => {
    console.log('Publishing data:', data);
  };

  return (
    <div className="fullscreen-puck-editor">
      <Puck
        config={config}
        data={initialData}
        onPublish={handlePublish}
        ui={{
          leftSideBarVisible: false,
          rightSideBarVisible: false,
          viewports: {
            controlsVisible: false,
            current: {
              width: 1280,
              height: "auto",
            },
            options: [
              {
                width: 1280,
                height: "auto",
                label: "Desktop",
              },
              {
                width: 768,
                height: "auto",
                label: "Tablet",
              },
              {
                width: 375,
                height: "auto",
                label: "Mobile",
              }
            ]
          }
        }}
        overrides={{
          header: () => <></>,
          components: CustomComponentList,
          fields: CustomFields, 
          outline: CustomOutline,
          actionBar: CustomActionBar,
          componentItem: CustomComponentItem,
          preview: CustomPreview,
        }}
      />
                    
      <style>{`
        .fullscreen-puck-editor {
          height: 100vh;
          overflow: hidden;
          background: hsl(var(--color-secondary)) !important;
        }
        
        /* Target specific Puck CSS module classes */
        .fullscreen-puck-editor [class*="_PuckLayout"],
        .fullscreen-puck-editor [class*="_PuckLayout-inner"],
        .fullscreen-puck-editor [class*="_Puck_"],
        .fullscreen-puck-editor .Puck,
        .fullscreen-puck-editor .Puck-root,
        .fullscreen-puck-editor .Puck-editor,
        .fullscreen-puck-editor .Puck-container,
        .fullscreen-puck-editor > div {
          background: hsl(var(--color-secondary)) !important;
          background-color: hsl(var(--color-secondary)) !important;
        }
        
        /* Specifically target the layout areas we saw in HTML */
        .fullscreen-puck-editor [class*="_PuckLayout-leftSideBar"],
        .fullscreen-puck-editor [class*="_PuckLayout-rightSideBar"] {
          background: hsl(var(--color-secondary)) !important;
          background-color: hsl(var(--color-secondary)) !important;
        }
        
        /* Target sidebar sections and content areas */
        .fullscreen-puck-editor [class*="_SidebarSection"],
        .fullscreen-puck-editor [class*="_SidebarSection-content"],
        .fullscreen-puck-editor [class*="_PuckFields"] {
          background: hsl(var(--color-secondary)) !important;
          background-color: hsl(var(--color-secondary)) !important;
        }
        
        /* Remove white borders and backgrounds */
        .fullscreen-puck-editor [class*="_PuckLayout"] {
          border: none !important;
          background: hsl(var(--color-secondary)) !important;
        }
        
        /* Target any remaining white areas aggressively */
        .fullscreen-puck-editor > div:not([class*="_PuckCanvas"]):not([class*="_PuckPreview"]) {
          background: hsl(var(--color-secondary)) !important;
        }
        
        /* Keep canvas area with proper background */
        .fullscreen-puck-editor [class*="_PuckCanvas"],
        .fullscreen-puck-editor [class*="_PuckPreview"],
        .fullscreen-puck-editor .Puck-preview,
        .fullscreen-puck-editor .Puck-frame,
        .fullscreen-puck-editor .Puck-frame > div,
        .fullscreen-puck-editor iframe {
          background: hsl(var(--color-background)) !important;
          background-color: hsl(var(--color-background)) !important;
        }
        
        .fullscreen-puck-editor .Puck-preview {
          height: 100vh !important;
          width: 100% !important;
        }
        
        .fullscreen-puck-editor .Puck-sideBar {
          display: none !important;
        }
        
        /* Remove any borders that might cause white lines */
        .fullscreen-puck-editor [class*="_PuckLayout"],
        .fullscreen-puck-editor [class*="_SidebarSection"] {
          border-left: none !important;
          border-right: none !important;
          border-bottom: none !important;
          border-top: none !important;
        }
        
        /* Ensure no gaps or margins create white space */
        .fullscreen-puck-editor [class*="_PuckLayout-inner"] {
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .fullscreen-puck-editor .Puck-dropZone {
          min-height: 120px;
          border: 2px dashed hsl(var(--border));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
          transition: all 0.3s ease;
          background: hsl(var(--muted) / 0.3);
          margin: 12px 0;
        }
        
        .fullscreen-puck-editor .Puck-dropZone:hover,
        .fullscreen-puck-editor .Puck-dropZone--isOver {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.05);
          color: hsl(var(--primary));
          transform: scale(1.01);
        }
        
        .fullscreen-puck-editor .Puck-dropZone--isEmpty::after {
          content: "Drop components here to build your page";
          font-weight: 500;
        }
        
        .fullscreen-puck-editor .Puck-dragDropContext {
          position: relative;
          z-index: 10;
        }
        
        .fullscreen-puck-editor .Puck-frame {
          position: relative;
          z-index: 10;
        }
        
        .fullscreen-puck-editor .Puck-dragPreview {
          z-index: 35 !important;
          filter: drop-shadow(0 20px 25px rgb(0 0 0 / 0.15));
        }
        
        .fullscreen-puck-editor [data-rfd-drag-handle-draggable-id] {
          pointer-events: auto !important;
        }

        .fullscreen-puck-editor .Puck-preview iframe,
        .fullscreen-puck-editor .Puck-frame {
          transition: transform 0.3s ease, width 0.3s ease;
          border-radius: 8px;
        }

        .fullscreen-puck-editor .Puck-preview {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow: auto;
          padding: 20px;
        }

        /* Enhanced zoom support */
        .fullscreen-puck-editor .Puck-frame {
          transform-origin: top center;
          will-change: transform;
        }

        .fullscreen-puck-editor .Puck-preview[data-viewport="tablet"],
        .fullscreen-puck-editor .Puck-preview[data-viewport="mobile"] {
          background: hsl(var(--muted) / 0.3);
        }

        /* Auto viewport support */
        .fullscreen-puck-editor .Puck-frame[data-auto-viewport="true"] {
          width: 100% !important;
          max-width: none !important;
          min-width: none !important;
        }

        .fullscreen-puck-editor .Puck-preview[data-auto-viewport="true"] {
          padding: 24px;
        }

        .fullscreen-puck-editor .Puck-frame[data-auto-viewport="true"] iframe {
          width: 100% !important;
          border-radius: 0;
        }

        /* Enhanced focus states */
        .fullscreen-puck-editor .Puck-frame [data-rfd-draggable-id]:focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
          border-radius: 6px;
        }

        /* Custom scrollbars */
        .fullscreen-puck-editor ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .fullscreen-puck-editor ::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 3px;
        }

        .fullscreen-puck-editor ::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }

        .fullscreen-puck-editor ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }

        /* Draggable Panel Styles */
        .fullscreen-puck-editor .resize-handle {
          position: relative;
        }

        .fullscreen-puck-editor .resize-handle::after {
          content: '';
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          background: repeating-linear-gradient(
            45deg,
            hsl(var(--muted-foreground) / 0.4),
            hsl(var(--muted-foreground) / 0.4) 1px,
            transparent 1px,
            transparent 3px
          );
        }

        .fullscreen-puck-editor .panel-content {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted-foreground) / 0.3) hsl(var(--muted));
        }

        /* Prevent text selection during drag */
        .fullscreen-puck-editor .cursor-grab:active,
        .fullscreen-puck-editor .cursor-grabbing {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Panel animations */
        .fullscreen-puck-editor [data-panel="draggable"] {
          transition: box-shadow 0.2s ease;
        }

        .fullscreen-puck-editor [data-panel="draggable"]:hover {
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
        }
      `}</style>
    </div>
  );
};