// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadEnv } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, "../../", "VITE_");
  return {
    envDir: "../../",
    server: {
      port: Number(env.VITE_ADMIN_PORT),
    },
    plugins: [
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
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
  };
});
