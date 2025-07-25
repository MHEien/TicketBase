import { useCallback } from 'react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import './fullscreen-puck.css';
import { CustomComponentList, CustomFields, CustomActionBar, CustomOutline, CustomPreview, CustomComponentItem, createAdvancedConfig, GlobalStylesPanel } from './fields';
import type { Page } from '@/types';

// Main App Component
export function PageEditor({
  initialPage,
  onSavePageData,
}: {
  initialPage: Page;
  onSavePageData: (pageData: any, puckData?: any) => Promise<void>;
}) {
  const config = createAdvancedConfig();
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
                description: initialPage?.description || '',
                status: initialPage?.status || 'draft',
                isHomepage: initialPage?.isHomepage || false,
                sortOrder: initialPage?.sortOrder || 0,
                featuredImage: initialPage?.featuredImage || '',
                seoTitle: initialPage?.seoTitle || '',
                seoDescription: initialPage?.seoDescription || '',
                seoKeywords: initialPage?.seoKeywords || '',
                metadata: initialPage?.metadata ? JSON.stringify(initialPage.metadata, null, 2) : ''
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