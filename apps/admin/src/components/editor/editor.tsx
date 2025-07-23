import React from 'react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { Puck, usePuck } from '@measured/puck'
import '@measured/puck/puck.css'
import { pagesApi, type Page } from '@/lib/api/pages'
import { Button } from '@repo/ui/components/ui/button'
import { Progress } from '@repo/ui/components/ui/progress'
import { TooltipProvider } from '@repo/ui/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { 
  Layout, 
  Paintbrush, 
  Layers3, 
  Square,
  RotateCcw,
  Eye,
  Check,
  X
} from 'lucide-react'

// Import our extracted modules
import { config } from '@/lib/puck/config'
import { viewports } from '@/lib/puck/constants'
import { 
  formatTimeAgo, 
  createDefaultPageData, 
  createNewPageSettings,
  getAutoSaveStatusConfig 
} from '@/lib/utils'
import type { 
  AutoSaveStatus, 
  CollaborationUser, 
  PageSettings,
  ViewportConfig
} from '@/types/editor'
import { PageEditorHeader } from './PageEditorHeader'
import { PageSettingsDialog } from './PageSettingsDialog'
import { KeyboardShortcutsDialog } from './KeyboardShortcutDialog'

export const Route = createFileRoute('/admin/pages/editor/$pageId')({
  component: PageEditor,
})

function PageEditor() {
  const { pageId } = useParams({ from: '/admin/pages/editor/$pageId' })
  const navigate = useNavigate()
  
  // Core state
  const [page, setPage] = useState<Page | null>(null)
  const [puckData, setPuckData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Enhanced UI state
  const [showSettings, setShowSettings] = useState(false)
  const [currentViewport, setCurrentViewport] = useState(viewports[1])
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showOutline, setShowOutline] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Collaboration state (simulated)
  const [collaborators] = useState<CollaborationUser[]>([
    { id: '1', name: 'Sarah Chen', avatar: 'SC', color: 'bg-blue-500', isActive: true },
    { id: '2', name: 'Marcus Johnson', avatar: 'MJ', color: 'bg-green-500', isActive: false },
    { id: '3', name: 'Elena Rodriguez', avatar: 'ER', color: 'bg-purple-500', isActive: true },
  ])
  
  // Page settings state
  const [pageSettings, setPageSettings] = useState<PageSettings>(createNewPageSettings())

  // Auto-save functionality
  const autoSave = useCallback(async (data: any) => {
    if (pageId === 'new') return
    
    setAutoSaveStatus('saving')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      setAutoSaveStatus('error')
    }
  }, [pageId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave(puckData)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault()
        setIsPreviewMode(prev => !prev)
      }
      if (e.key === 'Escape') {
        setShowSettings(false)
        setShowKeyboardShortcuts(false)
        setIsFullscreen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setIsFullscreen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [puckData])

  useEffect(() => {
    loadPage()
  }, [pageId])

  const loadPage = async () => {
    try {
      if (pageId === 'new') {
        const newPageSettings = createNewPageSettings()
        setPageSettings(newPageSettings)
        setPuckData(createDefaultPageData())
      } else {
        const response = await pagesApi.getPage(pageId)
        setPage(response)
        setPageSettings({
          title: response.title,
          slug: response.slug,
          metaTitle: response.metaTitle || '',
          metaDescription: response.metaDescription || '',
          metaKeywords: response.metaKeywords || '',
          isHomepage: response.isHomepage,
        })
        setPuckData(response.content || createDefaultPageData())
      }
    } catch (error) {
      console.error('Failed to load page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    setSaving(true)
    setAutoSaveStatus('saving')
    
    try {
      const pageData = {
        title: pageSettings.title,
        slug: pageSettings.slug,
        content: data,
        metaTitle: pageSettings.metaTitle,
        metaDescription: pageSettings.metaDescription,
        metaKeywords: pageSettings.metaKeywords,
        isHomepage: pageSettings.isHomepage,
        status: page?.status || 'draft' as const,
      }

      let savedPage
      if (pageId === 'new') {
        savedPage = await pagesApi.createPage(pageData)
        navigate({ to: `/admin/pages/editor/${savedPage.id}` })
      } else {
        savedPage = await pagesApi.updatePage(pageId, pageData)
        setPage(savedPage)
      }
      
      setPuckData(data)
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save page:', error)
      setAutoSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!page) return
    try {
      await pagesApi.publishPage(page.id)
      await loadPage()
    } catch (error) {
      console.error('Failed to publish page:', error)
    }
  }

  const handleUnpublish = async () => {
    if (!page) return
    try {
      await pagesApi.unpublishPage(page.id)
      await loadPage()
    } catch (error) {
      console.error('Failed to unpublish page:', error)
    }
  }

  const handlePreview = () => {
    if (page) {
      window.open(`/pages/${page.slug}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-pulse mx-auto"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading Advanced Editor
            </h3>
            <p className="text-slate-600">
              Initializing professional page builder with AI-powered components...
            </p>
          </div>
          <Progress value={78} className="w-64 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "h-screen flex flex-col bg-slate-50",
        isFullscreen && "fixed inset-0 z-50"
      )}>
        {/* Header */}
        <PageEditorHeader
          pageSettings={pageSettings}
          page={page}
          autoSaveStatus={autoSaveStatus}
          lastSaved={lastSaved}
          currentViewport={currentViewport}
          viewports={viewports}
          onViewportChange={setCurrentViewport}
          showOutline={showOutline}
          onShowOutlineChange={setShowOutline}
          isFullscreen={isFullscreen}
          onFullscreenChange={setIsFullscreen}
          onSettingsClick={() => setShowSettings(true)}
          onKeyboardShortcutsClick={() => setShowKeyboardShortcuts(true)}
          onPreview={handlePreview}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          collaborators={collaborators}
        />

        {/* Advanced Puck Editor with Custom Interface */}
        <div className="flex-1 overflow-hidden relative bg-slate-50">
          {puckData && (
            <Puck
              config={config}
              data={puckData}
              onPublish={handleSave}
              onChange={autoSave}
              viewports={viewports}
              iframe={{
                enabled: true,
                waitForStyles: true,
              }}
              ui={{
                leftSideBarVisible: !isPreviewMode,
                rightSideBarVisible: !isPreviewMode,
              }}
              // Advanced overrides for custom branding
              overrides={{
                // Custom component item styling
                componentItem: ({ name, children }) => (
                  <div className="group bg-white rounded-lg border border-slate-200 p-3 mb-2 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-[1.02]">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Square className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {name}
                      </span>
                    </div>
                  </div>
                ),
                
                // Custom header actions
                headerActions: () => {
                  const { appState, dispatch } = usePuck();
                  return (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch({ type: "setData", data: { content: [], root: {} } })}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    
                      <Button
                        variant={isPreviewMode ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {isPreviewMode ? 'Edit' : 'Preview'}
                      </Button>
                    </div>
                  );
                },
              }}
            >
              {/* Custom interface using Puck's compositional API */}
              <div className="h-full flex">
                {/* Enhanced Sidebar */}
                {!isPreviewMode && (
                  <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600">
                      <h3 className="font-semibold text-white flex items-center">
                        <Layout className="w-5 h-5 mr-2" />
                        Components
                      </h3>
                      <p className="text-blue-100 text-sm mt-1">Drag to build your page</p>
                    </div>
                    
                    {/* Component Library */}
                    <div className="component-library-container p-4 overflow-y-auto flex-1">
                      <Puck.Components />
                    </div>
                  </div>
                )}

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col">
                  {/* Preview Container */}
                  <div className="flex-1 bg-slate-100 p-4 overflow-auto">
                    <div 
                      className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
                      style={{
                        width: currentViewport.width,
                        maxWidth: '100%',
                        transition: 'width 0.3s ease'
                      }}
                    >
                      <Puck.Preview />
                    </div>
                  </div>
                </div>

                {/* Properties Panel */}
                {!isPreviewMode && (
                  <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
                    {/* Properties Header */}
                    <div className="p-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900 flex items-center">
                        <Paintbrush className="w-5 h-5 mr-2 text-purple-500" />
                        Properties
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">Customize selected element</p>
                    </div>
                    
                    {/* Fields */}
                    <div className="properties-panel-container p-4 flex-1 overflow-y-auto">
                      <Puck.Fields />
                    </div>

                    {/* Outline Panel */}
                    {showOutline && (
                      <>
                        <div className="border-t border-slate-200 p-4 max-h-64 overflow-y-auto">
                          <h4 className="font-semibold text-slate-900 flex items-center mb-3">
                            <Layers3 className="w-4 h-4 mr-2 text-blue-500" />
                            Page Outline
                          </h4>
                          <div className="max-h-48 overflow-y-auto">
                            <Puck.Outline />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Puck>
          )}

          {/* Floating Save Indicator */}
          <div className="absolute bottom-6 right-6 z-50">
            <div className={cn(
              "px-4 py-2 rounded-full shadow-lg border transition-all duration-300",
              getAutoSaveStatusConfig(autoSaveStatus).bg,
              getAutoSaveStatusConfig(autoSaveStatus).border,
              getAutoSaveStatusConfig(autoSaveStatus).text
            )}>
              <div className="flex items-center space-x-2 text-sm font-medium">
                {autoSaveStatus === 'saving' && (
                  <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                )}
                {autoSaveStatus === 'saved' && <Check className="w-3 h-3" />}
                {autoSaveStatus === 'error' && <X className="w-3 h-3" />}
                <span>
                  {getAutoSaveStatusConfig(autoSaveStatus).message}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <PageSettingsDialog
          open={showSettings}
          onOpenChange={setShowSettings}
          pageSettings={pageSettings}
          onPageSettingsChange={setPageSettings}
        />

        <KeyboardShortcutsDialog
          open={showKeyboardShortcuts}
          onOpenChange={setShowKeyboardShortcuts}
        />
      </div>
    </TooltipProvider>
  )
}