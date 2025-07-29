import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, "../../", "VITE_");
  return {
    envDir: "../../",
    server: {
      port: Number(env.VITE_STOREFRONT_PORT),
    },
    plugins: [
      federation({
        name: 'storefront_host',
        filename: 'remoteEntry.js',
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^19.0.0',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^19.0.0',
          },
          'ticketsplatform-plugin-sdk': {
            singleton: true,
          },
          '@repo/editor': {
            singleton: true,
          },
          '@measured/puck': {
            singleton: true,
          },
        },
        remotes: {
          // Plugins will be loaded dynamically at runtime
        },
      }),
      tsConfigPaths(),
      tailwindcss(),
      tanstackStart({
        target: "bun",
      }),
    ],
  };
});
