import { SITE_LAYOUT_CLASSNAME } from "@/lib/editor/constants/css";
import { requestAnimationSequence } from "@/lib/editor/utils";
import { RekaProvider } from "@rekajs/react";
import { useRouter } from "@tanstack/react-router";
import { flushSync } from "react-dom";
import { EditorContext, Editor, EditorMode } from "./editor";
import { EditorLayout } from "./editor/editor-layout";
import { HeaderToolbar } from "./editor/header-toolbar";
import { ToolbarApp } from "./editor/toolbar-app";
import * as React from 'react';

export const AppEditor = () => {
    const router = useRouter();
  
    const { editor, setEditor } = React.useContext(EditorContext);
  
    const routerRef = React.useRef(router);
    routerRef.current = router;
  
    const disposeEditor = React.useCallback(
      (editor: Editor) => {
        flushSync(() => {
          setEditor(null);
        });
  
        editor.dispose();
      },
      [setEditor]
    );
  
        React.useEffect(() => {
      if (router.state.isLoading) {
        return;
      }

      // Pass the router directly to the Editor constructor
      const editor = new Editor(router);
  
      (window as any).state = editor.reka;
  
      setEditor(editor);
  
      return () => {
        disposeEditor(editor);
      };
    }, [setEditor, disposeEditor, router.state.isLoading]);
  
    React.useEffect(() => {
      if (!editor) {
        return;
      }
  
      if (editor.ready) {
        return;
      }
  
      const onMessage = (e: MessageEvent) => {
        if (!e.data.REKA_CONTENT_LOADED) {
          return;
        }
  
        requestAnimationSequence([
          [() => editor.setReady(true), 200],
          [
            () => {
              const siteLayoutDom = document.querySelector(
                `.${SITE_LAYOUT_CLASSNAME}`
              );
  
              if (!siteLayoutDom) {
                return;
              }
  
              siteLayoutDom.classList.remove('hidden-header');
            },
            200,
          ],
          [() => editor.setMode(EditorMode.UI), 400],
        ]);
      };
  
      window.addEventListener('message', onMessage);
  
      return () => {
        window.removeEventListener('message', onMessage);
      };
    }, [editor]);
  
    if (!editor) {
      return null;
    }
  
    return (
      <RekaProvider key={editor.reka.id} reka={editor.reka}>
        <HeaderToolbar>
          <ToolbarApp />
        </HeaderToolbar>
        <EditorLayout />
      </RekaProvider>
    );
  };