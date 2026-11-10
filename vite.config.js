import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dos páginas: el escritorio en la raíz y la vista simple (el portafolio de una página) en /simple/
export default defineConfig({
  plugins: [react()],
  base: '/Portafolio/',
  build: {
    rollupOptions: {
      input: {
        desktop: resolve(import.meta.dirname, 'index.html'),
        simple: resolve(import.meta.dirname, 'simple/index.html'),
      },
    },
  },
})
