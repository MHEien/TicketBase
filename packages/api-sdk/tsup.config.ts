import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outExtension({ format }) {
    return {
      js: `.${format === "esm" ? "mjs" : "js"}`,
    };
  },
  esbuildOptions(options) {
    options.external = [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "react-query-swagger",
    ];
  },
});
