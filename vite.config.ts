import React from 'react';
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase' // o 'dashes'
    }
  },
  server: {
    host: '0.0.0.0' // Asegúrate que coincida con el puerto que usas
  },
});