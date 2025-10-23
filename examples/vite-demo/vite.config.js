import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3008,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@ldesign/timeline': '../../src/index.ts',
    },
  },
});

