import React from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Label } from '@repo/ui/components/ui/label'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Switch } from '@repo/ui/components/ui/switch'
import { Separator } from '@repo/ui/components/ui/separator'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@repo/ui/components/ui/dialog'
import { 
  Sparkles, 
  Type, 
  Search, 
  Settings, 
  Check 
} from 'lucide-react'
import type { PageSettings } from '@/types/editor'

interface PageSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageSettings: PageSettings
  onPageSettingsChange: (settings: PageSettings) => void
}

export function PageSettingsDialog({ 
  open, 
  onOpenChange, 
  pageSettings, 
  onPageSettingsChange 
}: PageSettingsDialogProps) {
  const updatePageSettings = (field: keyof PageSettings, value: string | boolean) => {
    onPageSettingsChange({
      ...pageSettings,
      [field]: value
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Page Configuration</span>
          </DialogTitle>
          <DialogDescription>
            Advanced page settings, SEO optimization, and performance configuration
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 mt-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 flex items-center">
              <Type className="w-5 h-5 mr-2 text-blue-500" />
              Basic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Page Title</Label>
                <Input
                  id="title"
                  value={pageSettings.title}
                  onChange={(e) => updatePageSettings('title', e.target.value)}
                  placeholder="Enter page title"
                  className="transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">URL Slug</Label>
                <Input
                  id="slug"
                  value={pageSettings.slug}
                  onChange={(e) => updatePageSettings('slug', e.target.value)}
                  placeholder="page-url-slug"
                  className="transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* SEO Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 flex items-center">
              <Search className="w-5 h-5 mr-2 text-green-500" />
              SEO & Metadata
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-sm font-medium">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={pageSettings.metaTitle}
                  onChange={(e) => updatePageSettings('metaTitle', e.target.value)}
                  placeholder="SEO-optimized title for search engines"
                  className="transition-all focus:ring-2 focus:ring-green-500/20"
                />
                <p className="text-xs text-slate-500">Recommended: 50-60 characters</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-sm font-medium">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={pageSettings.metaDescription}
                  onChange={(e) => updatePageSettings('metaDescription', e.target.value)}
                  placeholder="Compelling description that appears in search results"
                  rows={3}
                  className="transition-all focus:ring-2 focus:ring-green-500/20"
                />
                <p className="text-xs text-slate-500">Recommended: 150-160 characters</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaKeywords" className="text-sm font-medium">Focus Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={pageSettings.metaKeywords}
                  onChange={(e) => updatePageSettings('metaKeywords', e.target.value)}
                  placeholder="events, tickets, concerts, festivals"
                  className="transition-all focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-500" />
              Advanced Configuration
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="space-y-1">
                  <Label htmlFor="isHomepage" className="text-sm font-medium">Set as Homepage</Label>
                  <p className="text-xs text-slate-600">Make this the default landing page for your event platform</p>
                </div>
                <Switch
                  id="isHomepage"
                  checked={pageSettings.isHomepage}
                  onCheckedChange={(checked) => updatePageSettings('isHomepage', checked)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => onOpenChange(false)} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}