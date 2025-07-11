import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, "../../", "VITE_");
  return {
    envDir: "../../",
    server: {
      port: Number(env.VITE_STOREFRONT_PORT),
    },
    plugins: [
      tsConfigPaths(),
      tailwindcss(),
      tanstackStart({
        target: "bun",
      }),
    ],
  };
});
