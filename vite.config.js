import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve( './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities']
  },
  server: {
    port: 3000,
  },
})