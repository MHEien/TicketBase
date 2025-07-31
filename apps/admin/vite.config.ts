// apps/admin/vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadEnv } from "vite";
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, "../../", "VITE_");
  
  return {
    envDir: "../../",
    server: {
      port: Number(env.VITE_ADMIN_PORT),
    },
    plugins: [
      federation({
        name: 'admin_host',
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
          '@repo/ui': { 
            singleton: true,
          },
          'framer-motion': { 
            singleton: true,
          },
        },
        remotes: {
          // Plugins will be loaded dynamically at runtime
          // No need to define them here since you load them dynamically
        },
      }),
      tailwindcss(),
      tsconfigPaths(),
      tanstackStart({
        target: "bun",
        tsr: {
          routesDirectory: "src/app",
        },
        customViteReactPlugin: true,
      }),
      react(),
    ],
    build: {
      target: ["chrome89", "edge89", "firefox89", "safari15"],
      minify: false,
      cssCodeSplit: false,
      // Important for Module Federation
      rollupOptions: {
        external: [],
        output: {
          format: 'es',
        },
      },
    },
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
  };
});