import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html']
    },
    passWithNoTests: true
  },
  css: {
    modules: {
      localsConvention: 'camelCase' // o 'dashes'
    }
  },
  server: {
    host: '0.0.0.0'
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          tanstack: ['@tanstack/react-query'],
        },
      },
    },
  },
});
