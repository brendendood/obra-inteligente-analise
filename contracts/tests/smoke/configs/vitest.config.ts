import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./setup.ts'],
    globals: true,
    include: ['**/*.test.ts'],
    timeout: 10000, // 10s timeout for external API tests
    testTimeout: 10000,
    hookTimeout: 5000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../../src'),
    },
  },
  esbuild: {
    target: 'node14'
  }
})