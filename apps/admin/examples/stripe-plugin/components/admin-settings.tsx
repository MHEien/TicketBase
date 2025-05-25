"use client";

import { useState } from "react";
import { updatePluginConfig } from "@/lib/plugin-api";

interface AdminSettingsProps {
  initialConfig: {
    apiKey?: string;
    webhookUrl?: string;
    testMode?: boolean;
  };
  pluginId: string;
}

export default function AdminSettingsComponent({
  initialConfig,
  pluginId,
}: AdminSettingsProps) {
  const [config, setConfig] = useState(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updatePluginConfig(pluginId, config);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="apiKey"
          className="block text-sm font-medium text-gray-700"
        >
          Stripe API Key
        </label>
        <input
          id="apiKey"
          name="apiKey"
          type="text"
          placeholder="sk_test_..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={config.apiKey || ""}
          onChange={handleChange}
          disabled={isSaving}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe API key is used to process payments. You can find it in
          your Stripe dashboard.
        </p>
      </div>

      <div>
        <label
          htmlFor="webhookUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Webhook URL
        </label>
        <input
          id="webhookUrl"
          name="webhookUrl"
          type="url"
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={config.webhookUrl || ""}
          onChange={handleChange}
          disabled={isSaving}
        />
        <p className="mt-1 text-xs text-gray-500">
          Stripe will send payment events to this URL. Optional if you're only
          using client-side checkout.
        </p>
      </div>

      <div className="flex items-center">
        <input
          id="testMode"
          name="testMode"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={config.testMode || false}
          onChange={handleChange}
          disabled={isSaving}
        />
        <label htmlFor="testMode" className="ml-2 block text-sm text-gray-700">
          Test Mode
        </label>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {saved && (
        <div className="text-green-500 text-sm">
          Settings saved successfully!
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
