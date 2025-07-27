import { useCallback } from 'react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import './fullscreen-puck.css';
import { CustomComponentList, CustomFields, CustomOutline, CustomPreview, CustomComponentItem, GlobalStylesPanel } from './fields';
import type { Page } from '@ticketbase/api';
import { useDynamicPuckConfig } from '@/lib/dynamic-config';

// Main App Component
export function PageEditor({
  initialPage,
  onSavePageData,
  plugins = [],
}: {
  initialPage: Page;
  onSavePageData: (pageData: any, puckData?: any) => Promise<void>;
  plugins?: any[];
}) {
  // Use dynamic config that includes activated plugin components
  console.log('📝 PageEditor: Initial page:', initialPage);
  console.log('📝 PageEditor: Organization ID:', initialPage?.organizationId);
  console.log('📝 PageEditor: Plugins received:', plugins);
  
  const { config, loading } = useDynamicPuckConfig({ 
    tenantId: initialPage?.organizationId,
    plugins: plugins
  });
  const initialData = initialPage ? initialPage.content : {};

  // Handle page publishing (saves content only)
  const handlePublish = useCallback(async (data: any) => {
    try {
      if (initialPage && initialPage.id !== 'new') {
        await onSavePageData(data);
        console.log('Page published successfully');
      } else {
        // For new pages, we need title and slug from the settings modal
        throw new Error('Please save page settings first before publishing');
      }
    } catch (error) {
      console.error('Error publishing page:', error);
      throw error;
    }
  }, [initialPage]);

  // Handle page saving with full page data (title, slug, content, etc.)
  const handleSavePageData = useCallback(async (pageData: any, puckData?: any) => {
    try {
      if (initialPage && initialPage.id !== 'new') {
        // Update existing page
        const updateData = {
          ...pageData,
          content: puckData || initialData
        };
        await onSavePageData(updateData);
        console.log('Page updated successfully');
      } else {
        // Create new page
        const createData = {
          ...pageData,
          content: puckData || initialData
        };
        await onSavePageData(createData);
        console.log('Page created successfully');
        
        // Optionally redirect to the new page editor
        // window.location.href = `/admin/pages/edit/${newPage.id}`;
      }
    } catch (error) {
      console.error('Error saving page:', error);
      throw error;
    }
  }, [initialPage, initialData]);

  // Show loading state while fetching plugin components
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading editor components...</p>
        </div>
      </div>
    );
  }

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
          //actionBar: CustomActionBar,
          componentItem: CustomComponentItem,
          preview: (props) => (
            <CustomPreview 
              {...props} 
              pageId={initialPage?.id}
              initialPageData={{
                title: initialPage?.title || '',
                slug: initialPage?.slug || '',
                description: initialPage?.seoDescription || '',
                status: initialPage?.status || 'draft',
                isHomepage: initialPage?.isHomepage || false,
                sortOrder: 0,
                seoTitle: initialPage?.seoTitle || '',
                seoDescription: initialPage?.seoDescription || '',
                seoKeywords: initialPage?.seoKeywords || '',
              }}
              onSavePageData={handleSavePageData}
            />
          ),
        }}
      />
      <GlobalStylesPanel />
    </div>
  );
};