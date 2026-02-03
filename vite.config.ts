/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@anchor-os/ui': path.resolve(__dirname, 'src/libs/ui'),
    },
  },
  build: {
    sourcemap: true, // Required for Sentry
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: (id) => {
          // Only split in production to avoid duplicate React in dev
          if (id.includes('node_modules')) {
            // Firebase
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Charts
            if (id.includes('recharts')) {
              return 'recharts';
            }
            // React ecosystem - keep together to avoid duplicate instances
            if (id.includes('react') || id.includes('@tanstack/react-virtual')) {
              return 'vendor';
            }
            // Data management
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
          }
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'anchor.tail2fa2e.ts.net',
      '.tail2fa2e.ts.net',
    ],
  },
})
