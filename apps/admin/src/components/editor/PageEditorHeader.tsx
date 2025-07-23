import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@repo/ui/components/ui/button'
import { Badge } from '@repo/ui/components/ui/badge'
import { Separator } from '@repo/ui/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@repo/ui/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { 
  ArrowLeft,
  Globe,
  Clock,
  Settings,
  Eye,
  X,
  Zap,
  Layers3,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Command,
  Code,
  Database,
  Share2,
  Download,
  Plus
} from 'lucide-react'
import type { Page } from '@/lib/api/pages'
import type { AutoSaveStatus, CollaborationUser, PageSettings, ViewportConfig } from '@/types/editor'
import { formatTimeAgo } from '@/lib/utils'

interface PageEditorHeaderProps {
  pageSettings: PageSettings
  page: Page | null
  autoSaveStatus: AutoSaveStatus
  lastSaved: Date | null
  currentViewport: ViewportConfig
  viewports: ViewportConfig[]
  onViewportChange: (viewport: ViewportConfig) => void
  showOutline: boolean
  onShowOutlineChange: (show: boolean) => void
  isFullscreen: boolean
  onFullscreenChange: (fullscreen: boolean) => void
  onSettingsClick: () => void
  onKeyboardShortcutsClick: () => void
  onPreview: () => void
  onPublish: () => void
  onUnpublish: () => void
  collaborators: CollaborationUser[]
}

export function PageEditorHeader({
  pageSettings,
  page,
  autoSaveStatus,
  lastSaved,
  currentViewport,
  viewports,
  onViewportChange,
  showOutline,
  onShowOutlineChange,
  isFullscreen,
  onFullscreenChange,
  onSettingsClick,
  onKeyboardShortcutsClick,
  onPreview,
  onPublish,
  onUnpublish,
  collaborators
}: PageEditorHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 px-6 py-3 relative">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin/pages' })}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to Pages</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  {pageSettings.title}
                </h1>
                
                {page && (
                  <Badge 
                    variant={page.status === 'published' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs font-medium",
                      page.status === 'published' && "bg-green-100 text-green-800 border-green-200"
                    )}
                  >
                    {page.status}
                  </Badge>
                )}
                
                {pageSettings.isHomepage && (
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-800">
                    <Globe className="w-3 h-3 mr-1" />
                    Homepage
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    autoSaveStatus === 'saved' && "bg-green-500",
                    autoSaveStatus === 'saving' && "bg-yellow-500 animate-pulse",
                    autoSaveStatus === 'error' && "bg-red-500",
                    autoSaveStatus === 'unsaved' && "bg-slate-400"
                  )} />
                  <span className="font-medium">
                    {autoSaveStatus === 'saved' && lastSaved && `Saved ${formatTimeAgo(lastSaved)}`}
                    {autoSaveStatus === 'saving' && 'Auto-saving...'}
                    {autoSaveStatus === 'error' && 'Save failed'}
                    {autoSaveStatus === 'unsaved' && 'Unsaved changes'}
                  </span>
                </div>
                
                <Separator orientation="vertical" className="h-3" />
                
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3 h-3" />
                  <span>Modified 2h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Advanced Viewport Controls */}
        <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
          {viewports.map((viewport) => (
            <Tooltip key={viewport.width}>
              <TooltipTrigger asChild>
                <Button
                  variant={currentViewport.width === viewport.width ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewportChange(viewport)}
                  className={cn(
                    "px-3 py-2 transition-all",
                    currentViewport.width === viewport.width 
                      ? "bg-white shadow-sm border border-slate-200" 
                      : "hover:bg-slate-50"
                  )}
                >
                  {viewport.icon}
                  <span className="ml-2 text-xs font-medium">
                    {viewport.width}px
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{viewport.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Right Section - Action Hub */}
        <div className="flex items-center space-x-3">
          {/* Collaboration Hub */}
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {collaborators.map((user) => (
                <Tooltip key={user.id}>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white cursor-pointer transition-all hover:scale-110 hover:z-10",
                      user.color,
                      user.isActive && "ring-2 ring-green-400 ring-offset-2"
                    )}>
                      {user.avatar}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user.name} {user.isActive && '(online)'}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            
            <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onShowOutlineChange(!showOutline)}
                  className={showOutline ? "bg-blue-50 text-blue-600" : ""}
                >
                  <Layers3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Outline</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onFullscreenChange(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Advanced Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onKeyboardShortcutsClick}>
                  <Command className="w-4 h-4 mr-2" />
                  Keyboard Shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Code className="w-4 h-4 mr-2" />
                  Export Code
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Database className="w-4 h-4 mr-2" />
                  Data Sources
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Preview Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={onSettingsClick} className="bg-white/50 border-slate-200 hover:bg-white hover:border-blue-300">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            {page && (
              <Button variant="outline" size="sm" onClick={onPreview} className="bg-white/50 border-slate-200 hover:bg-white hover:border-blue-300">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}

            {page && (
              page.status === 'published' ? (
                <Button variant="outline" size="sm" onClick={onUnpublish} className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                  <X className="w-4 h-4 mr-2" />
                  Unpublish
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={onPublish}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Publish Live
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  )
}