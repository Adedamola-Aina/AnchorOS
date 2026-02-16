import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@anchor-os/ui': path.resolve(rootDir, 'src/libs/ui'),
    },
  },
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: path.resolve(rootDir, 'src/test/setup.ts'),
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/[.]**',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/test-setup.ts',
        'e2e/**',
      ],
      thresholds: {
        statements: 82,
        branches: 73,
        functions: 80,
        lines: 85,
      },
    },
  },
})
