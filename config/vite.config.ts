// @ts-nocheck
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { sentryVitePlugin } from '@sentry/vite-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

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
      const markerPath = path.resolve(rootDir, 'dist/.build-env');
      fs.writeFileSync(markerPath, env, 'utf-8');
      console.log(`\n✓ Build environment marker written: ${env}`);
    },
  };
}

/**
 * Vite plugin to generate __firebase-config.js for the service worker.
 * Service workers can't use import.meta.env, so we inject Firebase config
 * from environment variables into a JS file during build and dev server start.
 */
function generateFirebaseSwConfig() {
  function writeConfig(envDir: string, mode: string) {
    const env = loadEnv(mode, envDir, 'VITE_');
    const config = {
      apiKey: env.VITE_FIREBASE_API_KEY || '',
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: env.VITE_FIREBASE_APP_ID || '',
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || '',
    };
    const content = `// Auto-generated — do not edit. Built from .env variables.\nself.__FIREBASE_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
    fs.writeFileSync(path.resolve(rootDir, 'public/__firebase-config.js'), content, 'utf-8');
  }

  return {
    name: 'generate-firebase-sw-config',
    configResolved(config: { mode: string; envDir: string }) {
      writeConfig(config.envDir, config.mode);
    },
    closeBundle() {
      // Also copy to dist/ since public/ is copied before plugin runs
      const src = path.resolve(rootDir, 'public/__firebase-config.js');
      const dest = path.resolve(rootDir, 'dist/__firebase-config.js');
      if (fs.existsSync(src) && fs.existsSync(path.resolve(rootDir, 'dist'))) {
        fs.copyFileSync(src, dest);
      }
    },
  };
}

// Read version from package.json at build time
const pkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf-8'));

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_ENV__: JSON.stringify(
      mode === 'staging' ? 'staging'
        : mode === 'production' ? 'production'
          : 'development'
    ),
  },
  plugins: [
    react(),
    buildEnvMarker(mode),
    generateFirebaseSwConfig(),
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    sentryVitePlugin({
      org: "anchor-os",
      project: "anchor-os",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: pkg.version },
      telemetry: false,
    }),
  ].filter(Boolean),
  root: rootDir,
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@anchor-os/ui': path.resolve(rootDir, 'src/libs/ui'),
    },
  },
  css: {
    postcss: __dirname,
  },
  build: {
    sourcemap: true, // Required for Sentry
    rollupOptions: {
      input: path.resolve(rootDir, 'index.html'),
      output: {
        manualChunks: (id) => {
          // Only split in production to avoid duplicate React in dev
          if (id.includes('node_modules')) {
            // Firebase - large, changes rarely
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Sentry - load after app is interactive
            if (id.includes('@sentry')) {
              return 'sentry';
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
            // Data management
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            // React ecosystem - keep together to avoid duplicate instances
            if (id.includes('react') || id.includes('@tanstack')) {
              return 'vendor';
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
