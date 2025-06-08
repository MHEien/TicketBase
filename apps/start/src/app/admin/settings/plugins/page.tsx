import React, { Suspense } from 'react';
import { usePlugins } from '../../../../lib/plugins/plugin-context';

interface MarketplacePlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  displayName: string;
  iconUrl?: string;
}

export default function PluginsPage() {
  const { plugins, loadingPlugins, error, installPlugin, uninstallPlugin, enablePlugin, disablePlugin } = usePlugins();
  const [marketplacePlugins, setMarketplacePlugins] = React.useState<MarketplacePlugin[]>([]);
  const [loadingMarketplace, setLoadingMarketplace] = React.useState(true);
  const [marketplaceError, setMarketplaceError] = React.useState<string | null>(null);

  // Load marketplace plugins
  React.useEffect(() => {
    async function loadMarketplace() {
      try {
        const response = await fetch('/api/plugins/marketplace');
        if (!response.ok) {
          throw new Error('Failed to load marketplace plugins');
        }
        const data = await response.json();
        setMarketplacePlugins(data);
      } catch (err) {
        setMarketplaceError('Failed to load marketplace plugins');
        console.error('Failed to load marketplace:', err);
      } finally {
        setLoadingMarketplace(false);
      }
    }

    loadMarketplace();
  }, []);

  // Handle plugin installation
  const handleInstall = async (pluginId: string) => {
    try {
      await installPlugin(pluginId);
    } catch (err) {
      console.error('Failed to install plugin:', err);
    }
  };

  // Handle plugin uninstallation
  const handleUninstall = async (pluginId: string) => {
    try {
      await uninstallPlugin(pluginId);
    } catch (err) {
      console.error('Failed to uninstall plugin:', err);
    }
  };

  // Handle plugin enable/disable
  const handleToggleEnabled = async (pluginId: string, currentlyEnabled: boolean) => {
    try {
      if (currentlyEnabled) {
        await disablePlugin(pluginId);
      } else {
        await enablePlugin(pluginId);
      }
    } catch (err) {
      console.error('Failed to toggle plugin:', err);
    }
  };

  if (loadingPlugins || loadingMarketplace) {
    return <div>Loading...</div>;
  }

  if (error || marketplaceError) {
    return <div>Error: {error || marketplaceError}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Plugin Marketplace</h1>

      {/* Installed Plugins */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installed Plugins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.map(plugin => {
            const marketplaceData = marketplacePlugins.find(p => p.id === plugin.id);
            return (
              <div key={plugin.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{marketplaceData?.displayName || plugin.name}</h3>
                    <p className="text-sm text-gray-500">{marketplaceData?.description}</p>
                  </div>
                  {marketplaceData?.iconUrl && (
                    <img 
                      src={marketplaceData.iconUrl} 
                      alt={`${plugin.name} icon`}
                      className="w-12 h-12 rounded"
                    />
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Enabled</label>
                    <input
                      type="checkbox"
                      checked={plugin.enabled}
                      onChange={() => handleToggleEnabled(plugin.id, plugin.enabled)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <button
                    onClick={() => handleUninstall(plugin.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Uninstall
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Available Plugins */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Plugins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplacePlugins
            .filter(plugin => !plugins.some(p => p.id === plugin.id))
            .map(plugin => (
              <div key={plugin.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{plugin.displayName || plugin.name}</h3>
                    <p className="text-sm text-gray-500">{plugin.description}</p>
                  </div>
                  {plugin.iconUrl && (
                    <img 
                      src={plugin.iconUrl} 
                      alt={`${plugin.name} icon`}
                      className="w-12 h-12 rounded"
                    />
                  )}
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Version {plugin.version}</span>
                    <span>{plugin.author}</span>
                  </div>
                  <button
                    onClick={() => handleInstall(plugin.id)}
                    className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors"
                  >
                    Install
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
} 