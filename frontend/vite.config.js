import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 8000
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src')
    }
  }
})
