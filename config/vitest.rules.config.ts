// @ts-nocheck
import { defineConfig } from 'vitest/config';

/**
 * Vitest config for Firestore security rules tests.
 * Runs in Node environment (no jsdom) against the Firestore emulator.
 *
 * Usage:
 *   firebase emulators:exec --only firestore \
 *     "npx vitest run --config config/vitest.rules.config.ts"
 */
export default defineConfig({
  test: {
    include: ['src/__tests__/*.emulator.ts'],
    environment: 'node',
    testTimeout: 30_000,
  },
});
