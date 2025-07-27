import { useState, useEffect } from 'react';
import { usePuck } from '@measured/puck';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Undo, Redo, Monitor, Smartphone, Tablet, ZoomIn, ZoomOut, Save, Globe, Sparkles, Maximize, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import type{ ComponentListProps } from '@repo/editor/lib/types';
import { PageSettingsModal } from './page-settings-modal';
export const CustomPreview = ({ 
    children, 
    pageId, 
    initialPageData,
    onSavePageData,
    // Legacy props for backward compatibility
    title, 
    setTitle, 
    slug, 
    setSlug 
  }: ComponentListProps & { 
    pageId?: string; 
    initialPageData?: any;
    onSavePageData?: (pageData: any, puckData?: any) => Promise<void>;
    // Legacy props
    title?: string; 
    setTitle?: (title: string) => void; 
    slug?: string; 
    setSlug?: (slug: string) => void; 
  }) => {
    const [isAutoViewport, setIsAutoViewport] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // State to hold current page settings from modal
    const [currentPageSettings, setCurrentPageSettings] = useState({
      title: title || '',
      slug: slug || '',
      description: '',
      status: 'draft',
      isHomepage: false,
      sortOrder: 0,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      metadata: '',
      ...initialPageData
    });
  
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
      const randomPageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  
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
  
      const handleSave = async ({ pageId }: { pageId: string }) => {
        if (!onSavePageData) {
          console.warn('No onSavePageData callback provided - save operation will be skipped');
          return;
        }
  
        if (!currentPageSettings.title) {
          throw new Error("Title is required");
        }
        
        if (!currentPageSettings.slug) {
          currentPageSettings.slug = currentPageSettings.title.toLowerCase().replace(/ /g, '-');
        }
        
        const pageData = {
          title: currentPageSettings.title,
          slug: currentPageSettings.slug,
          description: currentPageSettings.description,
          status: currentPageSettings.status,
          isHomepage: currentPageSettings.isHomepage,
          sortOrder: currentPageSettings.sortOrder,
          seoTitle: currentPageSettings.seoTitle,
          seoDescription: currentPageSettings.seoDescription,
          seoKeywords: currentPageSettings.seoKeywords,
          metadata: currentPageSettings.metadata ? JSON.parse(currentPageSettings.metadata) : null,
        };
        
        const puckData = appState.data;
        
        console.log(pageId === "new" ? "Creating page with data:" : "Updating page with data:", { pageData, puckData });
        
        try {
          const result = await onSavePageData(pageData, puckData);
          console.log("Page saved successfully:", result);
          return result;
        } catch (error: any) {
          console.error("Error saving page:", error);
          throw error;
        }
      };
  
      const handlePublish = () => {
        console.log('Publishing:', appState.data);
      };
  
      const handlePreview = () => {
        const newPreviewMode = !isPreviewMode;
        setIsPreviewMode(newPreviewMode);
        
        // Add/remove preview mode class to body to hide floating buttons
        if (newPreviewMode) {
          document.body.classList.add('puck-preview-mode');
        } else {
          document.body.classList.remove('puck-preview-mode');
        }
        
        // Toggle Puck's editing capabilities
        dispatch({
          type: 'setUi',
          ui: {
            ...appState.ui,
            leftSideBarVisible: !newPreviewMode,
            rightSideBarVisible: !newPreviewMode,
          }
        });
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
          <Card className={`shadow-2xl border-border/50 backdrop-blur-xl ${isPreviewMode ? 'bg-primary/10 border-primary/30' : 'bg-card/95'}`}>
            {isPreviewMode && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                  Preview Mode
                </Badge>
              </div>
            )}
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
  
                {/* Page Settings */}
                {/* REMOVE this block from the toolbar:
                {setTitle && setSlug && (
                  <>
                    <PageSettingsToolbarInputs
                      title={title}
                      setTitle={setTitle}
                      slug={slug}
                      setSlug={setSlug}
                      isPreviewMode={isPreviewMode}
                    />
                    <div className="h-4 w-px bg-border" />
                  </>
                )} */}
  
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handlePreview}
                    variant={isPreviewMode ? "default" : "outline"}
                    size="sm"
                    className="h-8"
                    title={isPreviewMode ? "Exit Preview" : "Enter Preview Mode"}
                  >
                    {isPreviewMode ? <EyeOff size={14} /> : <Eye size={14} />}
                    {isPreviewMode ? "Exit Preview" : "Preview"}
                  </Button>
  
                  <Button 
                    onClick={() => handleSave({ pageId: pageId || randomPageId })}
                    variant="outline"
                    size="sm"
                    className="h-8"
                    disabled={isPreviewMode}
                  >
                    <Save size={14} />
                    Save
                  </Button>
  
                  <Button 
                    onClick={handlePublish}
                    variant="default"
                    size="sm"
                    className="h-8"
                    disabled={isPreviewMode}
                  >
                    <Globe size={14} />
                    Publish
                  </Button>
  
                  {/* SETTINGS BUTTON: Add here, after Save/Publish */}
                  <Button
                    onClick={() => setIsSettingsOpen(true)}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 font-bold bg-gradient-to-r from-primary/80 to-blue-500 text-primary-foreground shadow-lg hover:from-blue-500 hover:to-primary/90 transition-all duration-200 border-2 border-primary/40"
                    title="Page Settings"
                  >
                    <Sparkles className="mr-1 animate-pulse" size={16} />
                    Settings
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
  
    // Cleanup preview mode on unmount
    useEffect(() => {
      return () => {
        document.body.classList.remove('puck-preview-mode');
      };
    }, []);
  
    // Handle preview mode cleanup when component unmounts
    useEffect(() => {
      if (!isPreviewMode) {
        document.body.classList.remove('puck-preview-mode');
      }
    }, [isPreviewMode]);
  
    return (
      <>
        {children}
        <CustomBottomToolbar />
        <PageSettingsModal
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          initialValues={currentPageSettings}
          onSettingsChange={(values: any) => {
            // Update current page settings state
            setCurrentPageSettings(values);
            
            // Update legacy state setters if available (for backward compatibility)
            if (typeof setTitle === 'function') setTitle(values.title);
            if (typeof setSlug === 'function') setSlug(values.slug);
          }}
          pageId={pageId}
        />
      </>
    );
  };
  