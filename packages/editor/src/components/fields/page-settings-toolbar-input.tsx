import React, {  } from 'react';
import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Input } from '@repo/ui/components/ui/input';

export function PageSettingsToolbarInputs({ title, setTitle, slug, setSlug, isPreviewMode }: {
    title?: string;
    setTitle: (title: string) => void;
    slug?: string;
    setSlug: (slug: string) => void;
    isPreviewMode: boolean;
  }) {
    const [localTitle, setLocalTitle] = React.useState(title || "");
    const [localSlug, setLocalSlug] = React.useState(slug || "");
  
    // Keep local state in sync if parent changes (e.g. on page switch)
    React.useEffect(() => {
      setLocalTitle(title || "");
    }, [title]);
    React.useEffect(() => {
      setLocalSlug(slug || "");
    }, [slug]);
  
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">Title:</label>
          <Input
            value={localTitle}
            onChange={e => setLocalTitle(e.target.value)}
            onBlur={_e => setTitle(localTitle)}
            placeholder="Page title"
            className="h-8 w-32 text-xs"
            disabled={isPreviewMode}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">Slug:</label>
          <Input
            value={localSlug}
            onChange={e => setLocalSlug(e.target.value)}
            onBlur={_e => setSlug(localSlug)}
            placeholder="page-slug"
            className="h-8 w-32 text-xs"
            disabled={isPreviewMode}
          />
        </div>
      </div>
    );
  }