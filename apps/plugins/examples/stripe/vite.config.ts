import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'stripe_payment',
      filename: 'remoteEntry.js',
      exposes: {
        './Plugin': './src/index.tsx'
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