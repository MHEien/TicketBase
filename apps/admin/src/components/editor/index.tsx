import React, { useState, ReactNode } from 'react';
import { Puck, usePuck, Config } from '@measured/puck';
import '@measured/puck/puck.css';
import { Settings, Plus, Eye, Layers, Undo, Redo, X, Monitor, Smartphone, Tablet, ZoomIn, ZoomOut, Save, Globe } from 'lucide-react';

interface FloatingPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  className?: string;
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

// Custom floating popover component
const FloatingPopover: React.FC<FloatingPopoverProps> = ({ isOpen, onClose, children, title, className = "" }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 max-h-80 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

// Custom Component List Override
const CustomComponentList = ({ children }: ComponentListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Floating Add Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-30 p-4 rounded-full shadow-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-green-600 text-white hover:bg-green-700 scale-105' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
        }`}
        title="Add Components"
      >
        <Plus size={24} />
      </button>

      {/* Floating Component List */}
      <FloatingPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Components"
        className="bottom-24 right-6 w-80"
      >
        <div className="space-y-2">
          {children}
        </div>
      </FloatingPopover>
    </>
  );
};

// Custom Properties Panel Override  
const CustomFields = ({ children }: ComponentListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedItem } = usePuck();
  
  return (
    <>
      {/* Floating Properties Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-30 p-3 rounded-full shadow-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-green-600 text-white hover:bg-green-700 scale-105' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
        }`}
        title="Properties"
      >
        <Settings size={20} />
      </button>

      {/* Floating Properties Panel */}
      <FloatingPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedItem ? `Edit ${selectedItem.type}` : "Properties"}
        className="bottom-24 right-6 w-80"
      >
        {selectedItem ? (
          <div className="space-y-4">
            {children}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <Settings className="mx-auto mb-2" size={24} />
            <p>Select a component to edit its properties</p>
          </div>
        )}
      </FloatingPopover>
    </>
  );
};

// Custom Outline Override
const CustomOutline = ({ children }: ComponentListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Floating Layers Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-36 right-6 z-30 p-3 rounded-full shadow-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-green-600 text-white hover:bg-green-700 scale-105' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
        }`}
        title="Page Structure"
      >
        <Layers size={20} />
      </button>

      {/* Floating Outline Panel */}
      <FloatingPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Page Structure"
        className="bottom-36 right-6 w-64"
      >
        <div className="text-sm">
          {children}
        </div>
      </FloatingPopover>
    </>
  );
};

// Hide the default action bar completely
const CustomActionBar = ({ children }: ComponentListProps) => {
  return (
    <div style={{ display: 'none' }}>
      {children}
    </div>
  );
};

// Custom Preview Override that includes both the default preview and the floating toolbar
const CustomPreview = ({ children }: ComponentListProps) => {
  // Custom Bottom Floating Toolbar - defined inside to have access to usePuck
  const CustomBottomToolbar = () => {
    const { appState, history, dispatch } = usePuck();
    const [currentZoom, setCurrentZoom] = useState(100);

    // Viewport options that match Puck's configuration
    const viewports = [
      { id: 'desktop', label: 'Desktop', icon: Monitor, width: 1280 },
      { id: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
      { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 375 },
    ];

    // Zoom options
    const zoomOptions = [50, 75, 100, 125, 150, 200];

    // Get current viewport from Puck's state
    const currentViewport = appState.ui?.viewports?.current || { width: 1280 };
    const currentViewportId = currentViewport.width === 1280 ? 'desktop' : 
                             currentViewport.width === 768 ? 'tablet' : 'mobile';

    const handleViewportChange = (viewport: any) => {
      // Use Puck's dispatch to update UI state with new viewport
      dispatch({
        type: 'setUi',
        ui: {
          ...appState.ui,
          viewports: {
            ...appState.ui?.viewports,
            current: {
              width: viewport.width,
              height: 'auto' as const
            }
          }
        }
      });
    };

    const handleZoomChange = (zoom: number) => {
      setCurrentZoom(zoom);
      // Apply zoom to the preview
      setTimeout(() => {
        const previewElement = document.querySelector('.Puck-preview iframe') as HTMLElement;
        if (previewElement) {
          previewElement.style.transform = `scale(${zoom / 100})`;
          previewElement.style.transformOrigin = 'top center';
        }
      }, 100);
    };

    const handleSave = () => {
      // Save current state to localStorage or your backend
      localStorage.setItem('puck-draft', JSON.stringify(appState.data));
      console.log('Draft saved:', appState.data);
    };

    const handlePublish = () => {
      // Trigger the publish action
      console.log('Publishing:', appState.data);
      // You can call your publish callback here
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
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-4 py-3 flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
            <button 
              onClick={handleUndo}
              disabled={!history.hasPast}
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Undo"
            >
              <Undo size={16} />
            </button>
            <button 
              onClick={handleRedo}
              disabled={!history.hasFuture}
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Redo"
            >
              <Redo size={16} />
            </button>
          </div>

          {/* Viewport Selector */}
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            <div className="flex items-center gap-1">
              <CurrentViewportIcon size={16} className="text-gray-600" />
              <select 
                value={currentViewportId}
                onChange={(e) => {
                  const viewport = viewports.find(v => v.id === e.target.value);
                  if (viewport) handleViewportChange(viewport);
                }}
                className="text-sm border-none bg-transparent focus:outline-none cursor-pointer text-gray-700"
              >
                {viewports.map(viewport => (
                  <option key={viewport.id} value={viewport.id}>
                    {viewport.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
            <button
              onClick={() => {
                const newZoom = Math.max(25, currentZoom - 25);
                handleZoomChange(newZoom);
              }}
              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <select 
              value={currentZoom}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="text-sm border-none bg-transparent focus:outline-none cursor-pointer text-gray-700 min-w-[60px]"
            >
              {zoomOptions.map(zoom => (
                <option key={zoom} value={zoom}>
                  {zoom}%
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const newZoom = Math.min(300, currentZoom + 25);
                handleZoomChange(newZoom);
              }}
              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors"
            title="Save Draft"
          >
            <Save size={16} />
            Save
          </button>

          {/* Publish Button */}
          <button 
            onClick={handlePublish}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            title="Publish"
          >
            <Globe size={16} />
            Publish
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Render the default preview content */}
      {children}
      
      {/* Render the floating toolbar */}
      <CustomBottomToolbar />
    </>
  );
};

// Enhanced component item styling
const CustomComponentItem = ({ name, children }: ComponentItemProps) => {
  return (
    <div className="p-3 border border-gray-200 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-sm active:cursor-grabbing">
      <div className="font-medium text-gray-900">{name}</div>
      <div className="text-sm text-gray-500 mt-1">
        {name === 'HeadingBlock' && 'Add a heading to your page'}
        {name === 'TextBlock' && 'Add a text paragraph'}  
        {name === 'ButtonBlock' && 'Add a clickable button'}
      </div>
    </div>
  );
};

// Main App Component
export const FullscreenPuckApp = () => {
  const config = {
    root: {
      render: ({ children }: any) => {
        return (
          <div className="min-h-screen p-8">
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
          return <h1 className="text-3xl font-bold mb-4">{children}</h1>;
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
          return <p className="text-gray-700 mb-4">{text}</p>;
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
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
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
        // Hide the default UI elements
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
        // Override specific UI components with your custom floating design
        overrides={{
          header: () => <></>, // Hide header completely
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
        }
        
        /* Ensure preview takes full space */
        .fullscreen-puck-editor .Puck-preview {
          height: 100vh !important;
          width: 100% !important;
        }
        
        /* Hide default sidebars */
        .fullscreen-puck-editor .Puck-sideBar {
          display: none !important;
        }
        
        /* Style dropzones for better visibility */
        .fullscreen-puck-editor .Puck-dropZone {
          min-height: 120px;
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: #f8fafc;
        }
        
        .fullscreen-puck-editor .Puck-dropZone:hover,
        .fullscreen-puck-editor .Puck-dropZone--isOver {
          border-color: #3b82f6;
          background-color: #eff6ff;
          color: #1d4ed8;
        }
        
        .fullscreen-puck-editor .Puck-dropZone--isEmpty::after {
          content: "Drop components here";
          font-weight: 500;
        }
        
        /* Ensure drag functionality works properly */
        .fullscreen-puck-editor .Puck-dragDropContext {
          position: relative;
          z-index: 10;
        }
        
        .fullscreen-puck-editor .Puck-frame {
          position: relative;
          z-index: 10;
        }
        
        /* Ensure dragged items appear above floating buttons */
        .fullscreen-puck-editor .Puck-dragPreview {
          z-index: 35 !important;
        }
        
        /* Ensure drag handles are clickable */
        .fullscreen-puck-editor [data-rfd-drag-handle-draggable-id] {
          pointer-events: auto !important;
        }

        /* Smooth transitions for viewport changes */
        .fullscreen-puck-editor .Puck-preview iframe {
          transition: transform 0.3s ease, width 0.3s ease;
        }

        /* Ensure the preview container adapts to viewport changes */
        .fullscreen-puck-editor .Puck-preview {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow: auto;
        }

        /* Style for non-desktop viewports */
        .fullscreen-puck-editor .Puck-preview[data-viewport="tablet"],
        .fullscreen-puck-editor .Puck-preview[data-viewport="mobile"] {
          background: #f3f4f6;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};