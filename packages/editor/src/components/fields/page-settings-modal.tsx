import { useState, useEffect, useCallback } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Switch } from '@repo/ui/components/ui/switch';
import { Dialog, DialogContent, DialogClose } from '@repo/ui/components/ui/dialog';

export function PageSettingsModal({
    open,
    onOpenChange,
    initialValues,
    onSettingsChange,
    pageId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: any;
    onSettingsChange: (values: any) => void;
    pageId?: string;
  }) {
    // Local state to prevent rerenders of parent component
    const [formData, setFormData] = useState(() => ({
      title: '',
      slug: '',
      description: '',
      status: 'draft',
      isHomepage: false,
      sortOrder: 0,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      metadata: '',
      ...initialValues
    }));
    
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [hasUserChanges, setHasUserChanges] = useState(false);
  
    // Only initialize form data when component first mounts or when we explicitly want to reset
    useEffect(() => {
      // Only set initial data if we don't have user changes or if this is the first time
      if (!hasUserChanges && initialValues) {
        setFormData((prev: any) => ({
          title: '',
          slug: '',
          description: '',
          status: 'draft',
          isHomepage: false,
          sortOrder: 0,
          seoTitle: '',
          seoDescription: '',
          seoKeywords: '',
          metadata: '',
          ...initialValues
        }));
      }
    }, [initialValues, hasUserChanges]);
  
    // Clear validation errors when modal opens
    useEffect(() => {
      if (open) {
        setValidationErrors({});
      }
    }, [open]);
  
    // Local form field update handler
    const handleFieldChange = useCallback((field: string, value: any) => {
      const newFormData = { ...formData, [field]: value };
      setFormData(newFormData);
      setHasUserChanges(true); // Mark that user has made changes
      
      // Notify parent of changes
      onSettingsChange(newFormData);
      
      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors((prev: Record<string, string>) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }, [formData, onSettingsChange, validationErrors]);
  
    // Auto-generate slug from title
    const handleTitleChange = useCallback((value: string) => {
      let newSlug = formData.slug;
      
      // Auto-generate slug if it's empty or matches the previous title pattern
      if (!formData.slug || formData.slug === formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')) {
        newSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
      
      const newFormData = { ...formData, title: value, slug: newSlug };
      setFormData(newFormData);
      setHasUserChanges(true); // Mark that user has made changes
      onSettingsChange(newFormData);
      
      // Clear validation errors
      if (validationErrors.title || validationErrors.slug) {
        setValidationErrors((prev: Record<string, string>) => {
          const newErrors = { ...prev };
          delete newErrors.title;
          delete newErrors.slug;
          return newErrors;
        });
      }
    }, [formData, onSettingsChange, validationErrors]);
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl glassy-modal border-2 border-primary/30 shadow-2xl animate-in fade-in-0 zoom-in-95">
          <Card className="bg-gradient-to-br from-background/80 to-primary/10 shadow-2xl backdrop-blur-xl border-0">
            <CardHeader className="pb-2 flex-row items-center gap-4">
              <Sparkles className="text-primary animate-pulse" size={28} />
              <div>
                <CardTitle className="text-3xl font-extrabold tracking-tight">Page Settings</CardTitle>
                <CardDescription className="text-base mt-1">Customize your page metadata, SEO, and advanced options.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-0">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => handleTitleChange(e.target.value)} 
                  placeholder="Page title" 
                  className={`mt-1 ${validationErrors.title ? 'border-red-500' : ''}`}
                />
                {validationErrors.title && (
                  <span className="text-xs text-red-500 mt-1">{validationErrors.title}</span>
                )}
              </div>
              
              {/* Slug */}
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input 
                  id="slug" 
                  value={formData.slug} 
                  onChange={e => handleFieldChange('slug', e.target.value)} 
                  placeholder="page-slug" 
                  className={`mt-1 ${validationErrors.slug ? 'border-red-500' : ''}`}
                />
                {validationErrors.slug && (
                  <span className="text-xs text-red-500 mt-1">{validationErrors.slug}</span>
                )}
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => handleFieldChange('description', e.target.value)} 
                  placeholder="Short description for this page" 
                  className="mt-1 min-h-[60px]" 
                />
              </div>
              
              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={val => handleFieldChange('status', val)}>
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Is Homepage */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="isHomepage">Homepage</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Switch 
                    id="isHomepage" 
                    checked={!!formData.isHomepage} 
                    onCheckedChange={val => handleFieldChange('isHomepage', val)} 
                  />
                  <span className="text-xs text-muted-foreground">Set as homepage</span>
                </div>
              </div>
              
              {/* Sort Order */}
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input 
                  id="sortOrder" 
                  type="number" 
                  value={formData.sortOrder ?? 0} 
                  onChange={e => handleFieldChange('sortOrder', Number(e.target.value))} 
                  className="mt-1" 
                />
              </div>
              
  
              {/* SEO Title */}
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input 
                  id="seoTitle" 
                  value={formData.seoTitle || ''} 
                  onChange={e => handleFieldChange('seoTitle', e.target.value)} 
                  placeholder="SEO title" 
                  className="mt-1" 
                />
              </div>
              
              {/* SEO Description */}
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea 
                  id="seoDescription" 
                  value={formData.seoDescription || ''} 
                  onChange={e => handleFieldChange('seoDescription', e.target.value)} 
                  placeholder="SEO description" 
                  className="mt-1 min-h-[40px]" 
                />
              </div>
              
              {/* SEO Keywords */}
              <div className="md:col-span-2">
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input 
                  id="seoKeywords" 
                  value={formData.seoKeywords || ''} 
                  onChange={e => handleFieldChange('seoKeywords', e.target.value)} 
                  placeholder="keyword1, keyword2, ..." 
                  className="mt-1" 
                />
              </div>
              
              {/* Metadata */}
              <div className="md:col-span-2">
                <Label htmlFor="metadata">Metadata (JSON)</Label>
                <Textarea 
                  id="metadata" 
                  value={formData.metadata || ''} 
                  onChange={e => handleFieldChange('metadata', e.target.value)} 
                  placeholder="{}" 
                  className={`mt-1 font-mono min-h-[60px] ${validationErrors.metadata ? 'border-red-500' : ''}`}
                />
                {validationErrors.metadata && (
                  <span className="text-xs text-red-500 mt-1">{validationErrors.metadata}</span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }
  