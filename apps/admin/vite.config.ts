// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { federation } from "@module-federation/vite";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  const plugins = [
    tailwindcss(),
    // Enables Vite to resolve imports using path aliases.
    tsconfigPaths(),
    tanstackStart({
      tsr: {
        // Specifies the directory TanStack Router uses for your routes.
        routesDirectory: "src/app", // Defaults to "src/routes"
      },
    }),
  ];

  // Only add Module Federation in production or when explicitly enabled
  if (isProduction || process.env.ENABLE_MF === "true") {
    plugins.push(
      federation({
        name: "tickets-platform-admin",
        filename: "remoteEntry.js",
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
        },
        dev: false,
      }),
    );
  }

  return {
    server: {
      port: 3000,
    },
    plugins,
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
      ...(isProduction && {
        rollupOptions: {
          external: ["virtual:mf"],
        },
      }),
    },
    // Add Module Federation specific configurations only in production
    ...(isProduction && {
      define: {
        __MF_DEV__: false,
      },
      optimizeDeps: {
        exclude: ["virtual:mf"],
      },
    }),
  };
});
