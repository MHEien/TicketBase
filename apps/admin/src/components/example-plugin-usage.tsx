/**
 * Example Plugin Usage Component
 * Demonstrates how to integrate plugins into your application
 */

import React, { useEffect, useState } from 'react';
import PluginExtensionPoint, { usePlugins } from './plugin-extension-point';
import { pluginLoader } from '@/lib/plugin-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Example: Payment Methods Page
export const PaymentMethodsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load payment plugins when component mounts
    const loadPaymentPlugins = async () => {
      setLoading(true);
      try {
        await pluginLoader.loadInstalledPlugins();
      } catch (error) {
        console.error('Failed to load payment plugins:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentPlugins();
  }, []);

  // Context that will be passed to all payment plugins
  const paymentContext = {
    user: { id: 'user123', email: 'user@example.com' },
    organization: { id: 'org123', name: 'Example Org' },
    permissions: ['read:orders', 'write:transactions'],
    cart: {
      total: 99.99,
      currency: 'USD',
      items: [
        { id: 'ticket1', name: 'Concert Ticket', price: 99.99, quantity: 1 }
      ],
      customer: {
        email: 'customer@example.com',
        name: 'John Doe'
      }
    },
    sdk: typeof window !== 'undefined' ? (window as any).PluginSDK : null,
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment Methods</h1>
        <p className="text-muted-foreground">
          Choose your preferred payment method
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading payment methods...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Render all payment method plugins */}
          <PluginExtensionPoint
            extensionPoint="payment-methods"
            context={paymentContext}
            filter={(plugin) => plugin.metadata.category === 'payment'}
            fallback={() => (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No payment methods available. Please install payment plugins.
                  </p>
                </CardContent>
              </Card>
            )}
            pluginWrapper={({ plugin, children }) => (
              <Card key={plugin.metadata.id}>
                <CardHeader>
                  <CardTitle>{plugin.metadata.name}</CardTitle>
                  <CardDescription>{plugin.metadata.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {children}
                </CardContent>
              </Card>
            )}
          />
        </div>
      )}
    </div>
  );
};

// Example: Admin Settings Page
export const AdminSettingsPage: React.FC = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  const plugins = usePlugins('admin-settings');

  const adminContext = {
    user: { id: 'admin123', email: 'admin@example.com', role: 'admin' },
    organization: { id: 'org123', name: 'Example Org' },
    permissions: ['admin:read', 'admin:write', 'plugins:configure'],
    sdk: typeof window !== 'undefined' ? (window as any).PluginSDK : null,
  };

  useEffect(() => {
    // Auto-select first plugin if available
    if (plugins.length > 0 && !selectedPlugin) {
      setSelectedPlugin(plugins[0].metadata.id);
    }
  }, [plugins, selectedPlugin]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Plugin Settings</h1>
        <p className="text-muted-foreground">
          Configure your installed plugins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Plugin List Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Installed Plugins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {plugins.map((plugin) => (
                <Button
                  key={plugin.metadata.id}
                  variant={selectedPlugin === plugin.metadata.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPlugin(plugin.metadata.id)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{plugin.metadata.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      v{plugin.metadata.version}
                    </Badge>
                  </div>
                </Button>
              ))}
              
              {plugins.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No configurable plugins installed
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plugin Settings Content */}
        <div className="md:col-span-3">
          {selectedPlugin ? (
            <PluginExtensionPoint
              extensionPoint="admin-settings"
              context={adminContext}
              filter={(plugin) => plugin.metadata.id === selectedPlugin}
              pluginWrapper={({ plugin, children }) => (
                <Card>
                  <CardHeader>
                    <CardTitle>{plugin.metadata.name} Settings</CardTitle>
                    <CardDescription>
                      Version {plugin.metadata.version} • {plugin.metadata.description}
                    </CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                    {children}
                  </CardContent>
                </Card>
              )}
            />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Select a plugin from the sidebar to configure its settings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Example: Checkout Confirmation Page
export const CheckoutConfirmationPage: React.FC = () => {
  const confirmationContext = {
    user: { id: 'user123', email: 'user@example.com' },
    organization: { id: 'org123', name: 'Example Org' },
    permissions: ['read:orders'],
    paymentDetails: {
      provider: 'stripe',
      transactionId: 'txn_1234567890',
      amount: 99.99,
      currency: 'USD',
      testMode: false,
      status: 'completed'
    },
    orderDetails: {
      id: 'order_1234',
      items: [
        { id: 'ticket1', name: 'Concert Ticket', price: 99.99, quantity: 1 }
      ],
      total: 99.99,
      customer: {
        email: 'customer@example.com',
        name: 'John Doe'
      }
    },
    sdk: typeof window !== 'undefined' ? (window as any).PluginSDK : null,
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Concert Ticket</span>
                <span>$99.99</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>$99.99</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plugin-specific confirmation messages */}
        <PluginExtensionPoint
          extensionPoint="checkout-confirmation"
          context={confirmationContext}
          pluginWrapper={({ plugin, children }) => (
            <div key={plugin.metadata.id} className="space-y-2">
              {children}
            </div>
          )}
        />
      </div>
    </div>
  );
};

// Example: Plugin Status Dashboard
export const PluginDashboard: React.FC = () => {
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        await pluginLoader.loadInstalledPlugins();
        setPlugins(pluginLoader.loadedPlugins.map(id => ({
          id,
          ...((window as any).pluginManager?.getPlugin(id) || {})
        })));
      } catch (error) {
        console.error('Failed to load plugins:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlugins();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading plugin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Plugin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your installed plugins
        </p>
      </div>

      <div className="grid gap-4">
        {plugins.map((plugin) => (
          <Card key={plugin.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{plugin.metadata?.name || plugin.id}</CardTitle>
                  <CardDescription>
                    Version {plugin.metadata?.version} • {plugin.metadata?.category}
                  </CardDescription>
                </div>
                <Badge variant={plugin.isLoaded ? "default" : "destructive"}>
                  {plugin.isLoaded ? "Loaded" : "Error"}
                </Badge>
              </div>
            </CardHeader>
            {plugin.error && (
              <CardContent>
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  Error: {plugin.error}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {plugins.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No plugins installed. Upload plugins to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 