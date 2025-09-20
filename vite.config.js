// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esto le indica a Vite que reemplace cualquier instancia de 'process.env.API_KEY'
    // en tu código con el valor de la variable de entorno API_KEY del entorno de compilación.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
