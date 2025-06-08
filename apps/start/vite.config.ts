// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ["react-query-swagger"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  plugins: [
    tailwindcss(),
    // Enables Vite to resolve imports using path aliases.
    tsconfigPaths(),
    tanstackStart({
      tsr: {
        // Specifies the directory TanStack Router uses for your routes.
        routesDirectory: "src/app", // Defaults to "routes",
        srcDirectory: "src",
      },
    }),
    react(),
    federation({
      name: 'storefront',
      filename: 'remoteEntry.js',
      remotes: {
        // Dynamic remotes will be added at runtime
      },
      exposes: {
        // Expose components that plugins can use
        './CheckoutContext': './src/components/checkout/CheckoutContext',
        './PaymentContext': './src/components/checkout/PaymentContext',
      },
      shared: ['react', 'react-dom', '@ticketsplatform/ui', '@ticketsplatform/plugin-sdk']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
