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
    // RA-15 (#169): suites share one deterministic Firestore project id so rule
    // coverage aggregates (and is visible to check-rules-coverage). Running them
    // in parallel would let one suite's clearFirestore() wipe another's fixtures.
    fileParallelism: false,
  },
});
