// @ts-nocheck
/**
 * vitest.emulator.config.ts — Functions emulator-backed integration tests
 *
 * Includes ONLY *.emulator.test.ts files, which require the Firestore emulator:
 *   firebase emulators:exec --only firestore \
 *     "cd functions && npx vitest run --config vitest.emulator.config.ts"
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.emulator.test.ts'],
    exclude: ['**/node_modules/**', 'lib/**'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
