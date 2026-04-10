// @ts-nocheck
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const pkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf-8'))

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_ENV__: JSON.stringify('development'),
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@anchor-os/ui': path.resolve(rootDir, 'packages/ui/src/index.ts'),
      '@anchor-os/types': path.resolve(rootDir, 'packages/types/src/index.ts'),
    },
  },
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**', '.stryker-tmp/**', 'tools/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: path.resolve(rootDir, 'src/test/setup.ts'),
    pool: 'forks',
    forks: { maxForks: 2 },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
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
        statements: 86,
        branches: 76,
        functions: 83,
        lines: 89,
      },
    },
  },
})
