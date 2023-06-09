import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        settings: resolve(__dirname, 'settings/index.html'),
      },
    },
  },
  plugins: [react()],
});
