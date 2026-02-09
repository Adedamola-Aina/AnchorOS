/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vite plugin to write a build environment marker file.
 * This allows deploy scripts to verify the build matches the target environment.
 * Prevents deploying a dev build to staging or production.
 */
function buildEnvMarker(mode: string) {
  return {
    name: 'build-env-marker',
    closeBundle() {
      // Map Vite mode to environment name
      const env = mode === 'staging' ? 'staging' 
                : mode === 'production' ? 'production'
                : 'development';
      const markerPath = path.resolve(__dirname, 'dist/.build-env');
      fs.writeFileSync(markerPath, env, 'utf-8');
      console.log(`\n✓ Build environment marker written: ${env}`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    buildEnvMarker(mode),
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
            // Firebase - large, changes rarely
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Charts - only loaded on dashboard/finance
            if (id.includes('recharts')) {
              return 'recharts';
            }
            // Radix UI components - commonly used across app
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'date-fns';
            }
            // Icons - large but compressed well
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // React ecosystem - keep together to avoid duplicate instances
            if (id.includes('react') || id.includes('@tanstack/react-virtual')) {
              return 'vendor';
            }
            // Data management
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            // Sentry - load after app is interactive
            if (id.includes('@sentry')) {
              return 'sentry';
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
}))
