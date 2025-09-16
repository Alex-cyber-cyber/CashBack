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
  }
});