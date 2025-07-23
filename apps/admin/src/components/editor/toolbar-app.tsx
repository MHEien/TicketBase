import { Undo, Redo, Eye, EyeOff } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useMaybeEditor } from '@/lib/use-editor';
import { EditorMode } from '@/components/editor/editor';

import { Button } from '@/components/ui/button';
import { Collaborators } from '@/components/editor/collaborators/collaborators';
import { Tooltip } from '@/components/editor/tooltip';

export const ToolbarApp = observer(() => {
  const editor = useMaybeEditor();

  const isCodeModeRef = React.useRef(editor && editor.mode === EditorMode.Code);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5 max-sm:hidden">
      <Tooltip content="Undo">
        <Button
          disabled={!editor.reka.canUndo()}
          variant="outline"
          size="sm"
          onClick={() => {
            editor.reka.undo();
          }}
        >
          <Undo />
        </Button>
      </Tooltip>
      <Tooltip content="Redo">
        <Button
          disabled={!editor.reka.canRedo()}
          variant="outline"
          size="sm"
          onClick={() => {
            editor.reka.redo();
          }}
        >
          <Redo />
        </Button>
      </Tooltip>

      <Collaborators />

      <Tooltip content="Toggle code editor">
        <Button
          variant={'outline'}
          size="sm"
          onClick={() => {
            if (editor.mode === EditorMode.Code) {
              editor.setMode(EditorMode.UI);
              isCodeModeRef.current = false;
              return;
            }

            isCodeModeRef.current = true;
            editor.setMode(EditorMode.Code);
          }}
        >
          {editor.mode === EditorMode.Code ? 'Exit Code Editor' : 'Edit Code'}
        </Button>
      </Tooltip>

      <Tooltip content="Preview">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (editor.mode === EditorMode.Preview) {
              editor.setMode(
                isCodeModeRef.current ? EditorMode.Code : EditorMode.UI
              );
              return;
            }

            editor.setMode(EditorMode.Preview);
          }}
        >
          {editor.mode === EditorMode.Preview ? (
            <EyeOff />
          ) : (
            <Eye />
          )}
        </Button>
      </Tooltip>
    </div>
  );
});