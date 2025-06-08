import { Suspense } from "react";
import { usePlugins } from "@/lib/plugins/plugin-context";

interface ExtensionPointProps {
  name: string;
  context: Record<string, any>;
  fallback?: React.ReactNode;
}

export function ExtensionPoint({ name, context, fallback }: ExtensionPointProps) {
  const { getExtensionPoint } = usePlugins();
  const extensions = getExtensionPoint(name);

  if (extensions.length === 0 && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      {extensions.map((Extension, index) => (
        <Suspense key={index} fallback={<div className="h-20 animate-pulse rounded-lg bg-muted" />}>
          <Extension context={context} sdk={window.PluginSDK} />
        </Suspense>
      ))}
    </>
  );
} 