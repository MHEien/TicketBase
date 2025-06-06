// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

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
  ],
});
