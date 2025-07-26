# Reka.js React Integration Guide

This guide explains how to properly integrate Reka.js with React using modern React patterns including Context API, hooks, and the observer pattern for reactivity.

## Overview

The integration provides:

- **React Context Provider** (`RekaProvider`) for dependency injection
- **Custom Hooks** for accessing Reka state and operations
- **Observer Pattern** for automatic re-renders when Reka state changes
- **Real-time Collaboration** through Yjs integration
- **Type Safety** with TypeScript
- **Proper Lifecycle Management** for initialization and cleanup

## Architecture

```
RekaProvider (Context)
├── useReka() - Core Reka operations
├── useRekaState() - Reactive state access
├── useRekaFrame() - Frame management
├── useRekaComponent() - Component access
└── withRekaObserver() - HOC for reactivity
```

## Quick Start

### 1. Wrap your app with RekaProvider

```tsx
import { RekaProvider } from '@/lib/reka/reka-provider';

function App() {
  return (
    <RekaProvider
      documentId="your-document-id" // For collaboration
      initialContent={yourInitialContent} // Optional
      autoInitialize={true} // Auto-start Reka
    >
      <YourPageEditor />
    </RekaProvider>
  );
}
```

### 2. Use hooks in your components

```tsx
import { useReka, useRekaState, withRekaObserver } from '@/lib/reka/reka-provider';

const MyEditor = withRekaObserver(() => {
  const { change, isInitialized, isLoading, error } = useReka();
  const state = useRekaState();

  const addTextComponent = () => {
    change(() => {
      // Modify Reka state here
      const appComponent = state?.program?.components?.find(
        (comp) => comp.name === 'App'
      );
      // ... add components
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isInitialized) return <div>Not ready</div>;

  return (
    <div>
      <button onClick={addTextComponent}>Add Text</button>
      {/* Your editor UI */}
    </div>
  );
});
```

### 3. Render Reka content

```tsx
import { useRekaFrame, withRekaObserver } from '@/lib/reka/reka-provider';
import { RenderFrame } from '@/components/page-editor/reka-frame-renderer';

const MyRenderer = withRekaObserver(() => {
  const frame = useRekaFrame('App');

  return (
    <div>
      {frame ? (
        <RenderFrame frame={frame} />
      ) : (
        <div>No content to render</div>
      )}
    </div>
  );
});
```

## API Reference

### RekaProvider

The main context provider that manages the Reka instance.

```tsx
interface RekaProviderProps {
  children: ReactNode;
  documentId?: string;        // For collaboration
  initialContent?: any;       // Initial state
  autoInitialize?: boolean;   // Auto-start (default: true)
}
```

### useReka()

Core hook for Reka operations:

```tsx
const {
  reka,           // Reka instance
  isInitialized,  // Ready state
  isLoading,      // Loading state
  error,          // Error message
  
  // Operations
  getState,       // Get current state
  change,         // Modify state
  loadState,      // Load new state
  createFrame,    // Create frame
  
  // Lifecycle
  initialize,     // Manual init
  cleanup         // Cleanup
} = useReka();
```

### useRekaState()

Reactive access to Reka state:

```tsx
const state = useRekaState();
// Automatically re-renders when state changes
console.log(state?.program?.components);
```

### useRekaFrame()

Frame management with automatic updates:

```tsx
const frame = useRekaFrame('App'); // Component name
// Frame automatically updates when state changes
```

### useRekaComponent()

Access specific components:

```tsx
const appComponent = useRekaComponent('App');
// Returns the component definition
```

### withRekaObserver()

Higher-order component for reactivity:

```tsx
const MyComponent = withRekaObserver(() => {
  // This component will re-render when Reka state changes
  const state = useRekaState();
  return <div>{/* UI */}</div>;
});
```

## Patterns and Best Practices

### 1. Component Structure

```tsx
// ✅ Good: Separate concerns
const PageEditor = () => (
  <RekaProvider documentId="page-123">
    <EditorLayout>
      <EditorSidebar />
      <EditorCanvas />
    </EditorLayout>
  </RekaProvider>
);

const EditorSidebar = withRekaObserver(() => {
  const { change } = useReka();
  // Editor controls
});

const EditorCanvas = withRekaObserver(() => {
  const frame = useRekaFrame();
  // Render preview
});
```

### 2. State Modifications

```tsx
// ✅ Good: Use change() for mutations
const addComponent = useCallback(() => {
  change(() => {
    // All Reka state mutations inside change()
    const app = state.program.components.find(c => c.name === 'App');
    app.template.children.push(newComponent);
  });
}, [change]);

// ❌ Bad: Direct mutations
const addComponentBad = () => {
  state.program.components[0].template.children.push(newComponent);
};
```

### 3. Error Handling

```tsx
const MyEditor = withRekaObserver(() => {
  const { isLoading, error, isInitialized } = useReka();

  // Always handle these states
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!isInitialized) return <InitializingMessage />;

  return <ActualEditor />;
});
```

### 4. Performance Optimization

```tsx
// ✅ Good: Memoize expensive operations
const MyComponent = withRekaObserver(() => {
  const state = useRekaState();
  
  const componentCount = useMemo(() => 
    state?.program?.components?.length || 0
  , [state?.program?.components]);
  
  return <div>Components: {componentCount}</div>;
});
```

## Collaboration Features

### Real-time Collaboration

```tsx
<RekaProvider
  documentId="shared-document-123"
  initialContent={pageContent}
>
  {/* Multiple users can edit simultaneously */}
  <CollaborativeEditor />
</RekaProvider>
```

### Collaboration Hooks

```tsx
const MyEditor = withRekaObserver(() => {
  const { isCollaborative, collaborators } = useEditorStore();
  
  return (
    <div>
      {isCollaborative && (
        <div>
          {collaborators.map(user => (
            <UserAvatar key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
});
```

## Migration from Direct Usage

### Before (Direct Reka usage):

```tsx
// ❌ Old pattern
const MyEditor = () => {
  const [reka, setReka] = useState<Reka | null>(null);
  
  useEffect(() => {
    const instance = RekaService.getInstance();
    setReka(instance);
  }, []);
  
  const addComponent = () => {
    RekaService.change(() => {
      // Direct service calls
    });
  };
  
  return <div>{/* Editor */}</div>;
};
```

### After (React Context):

```tsx
// ✅ New pattern
const MyEditor = withRekaObserver(() => {
  const { change, isInitialized } = useReka();
  const state = useRekaState();
  
  const addComponent = () => {
    change(() => {
      // Clean state mutations
    });
  };
  
  if (!isInitialized) return <Loading />;
  return <div>{/* Editor */}</div>;
});

// Wrap with provider
<RekaProvider>
  <MyEditor />
</RekaProvider>
```

## Troubleshooting

### Common Issues

1. **"useReka must be used within a RekaProvider"**
   - Make sure your component is wrapped with `<RekaProvider>`

2. **Components not re-rendering on state changes**
   - Use `withRekaObserver()` HOC
   - Use `useRekaState()` instead of direct state access

3. **Frame not updating**
   - Use `useRekaFrame()` hook
   - Ensure component is wrapped with observer

4. **Collaboration not working**
   - Check `documentId` is provided
   - Verify network connectivity
   - Check console for WebRTC errors

### Debug Information

Enable debug mode to see detailed information:

```tsx
<RekaProvider
  documentId="debug-session"
  initialContent={content}
>
  <RekaRenderer showDebug={true} />
</RekaProvider>
```

## Examples

See the complete working examples:

- **Basic Editor**: `apps/admin/src/components/page-editor/reka-editor-v2.tsx`
- **Renderer**: `apps/admin/src/components/page-editor/reka-renderer-v2.tsx`
- **Full Page Editor**: `apps/admin/src/components/page-editor/page-editor-v2.tsx`
- **Demo Route**: `apps/admin/src/app/admin/pages/edit/reka-demo.tsx`

## Next Steps

1. **Custom Components**: Create your own Reka component types
2. **Advanced Collaboration**: Implement user awareness and cursors
3. **Performance**: Add virtualization for large component trees
4. **Persistence**: Integrate with your backend API for saving/loading
5. **Undo/Redo**: Implement history management

This integration provides a solid foundation for building React-based visual editors with Reka.js while following React best practices and patterns. 