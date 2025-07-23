import { EditorContextProvider } from '@/components/editor';
import { AppEditor } from '@/components/page-editor';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { createFileRoute } from '@tanstack/react-router'
import React from 'react';

export const Route = createFileRoute('/admin/pages/edit/$pageId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <EditorContextProvider>
      <TooltipProvider>
        <AppEditor />
      </TooltipProvider>
    </EditorContextProvider>
  );
}
