import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // This simulates a browser for your BDD tests
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // This fixes the "@/components" imports
    },
  },
})