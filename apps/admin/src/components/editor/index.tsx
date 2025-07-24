import React from 'react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import './fullscreen-puck.css';
import { CustomComponentList, CustomFields, CustomActionBar, CustomOutline, CustomPreview, CustomComponentItem, createAdvancedConfig, GlobalStylesPanel } from './fields';

// Main App Component
export const FullscreenPuckApp = () => {
  const config = createAdvancedConfig();

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
          
      <GlobalStylesPanel />
    </div>
  );
};