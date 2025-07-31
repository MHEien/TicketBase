// plugins/countdown-widget-plugin/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'countdownWidgetPlugin',
      filename: 'remoteEntry.js',
      exposes: {
        './plugin': './src/index.tsx',
      },
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
        'framer-motion': {
          singleton: true,
        },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});