// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { federation } from "@module-federation/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // Module Federation Host Configuration
    federation({
      name: "tickets-platform-admin",
      remotes: {
        // Dynamic remotes will be loaded at runtime
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        // Share plugin SDK
        "ticketsplatform-plugin-sdk": {
          singleton: true,
        },
        // Share common UI components
        "@radix-ui/react-slot": {
          singleton: true,
        },
        "class-variance-authority": {
          singleton: true,
        },
        clsx: {
          singleton: true,
        },
        "tailwind-merge": {
          singleton: true,
        },
        "lucide-react": {
          singleton: true,
        },
        // Share state management
        zustand: {
          singleton: true,
        },
      },
    }),
    tailwindcss(),
    // Enables Vite to resolve imports using path aliases.
    tsconfigPaths(),
    tanstackStart({
      tsr: {
        // Specifies the directory TanStack Router uses for your routes.
        routesDirectory: "src/app", // Defaults to "src/routes"
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
