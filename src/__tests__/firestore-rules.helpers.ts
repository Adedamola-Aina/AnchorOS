/**
 * Shared helpers for Firestore Security Rules emulator tests.
 *
 * Each test suite file imports from here to avoid boilerplate duplication
 * while keeping test files independently scoped.
 *
 * @vitest-environment node
 */
// @ts-nocheck

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { setLogLevel } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export { assertSucceeds, assertFails };
export { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
export { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ID_BASE = 'rules-test';
export const PREFIX = 'artifacts/anchor-os';

export function makeTestEnv(): {
  getEnv: () => RulesTestEnvironment;
  authedDb: (uid: string, email?: string) => ReturnType<RulesTestEnvironment['authenticatedContext']>['firestore'] extends () => infer R ? R : never;
  unauthDb: () => ReturnType<RulesTestEnvironment['unauthenticatedContext']>['firestore'] extends () => infer R ? R : never;
  setupAll: () => Promise<void>;
  teardownAll: () => Promise<void>;
  clearAll: () => Promise<void>;
} {
  let testEnv: RulesTestEnvironment;
  const projectId = `${PROJECT_ID_BASE}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const RULES_PATH = resolve(__dirname, '../../config/firestore.rules');

  return {
    getEnv: () => testEnv,
    authedDb: (uid: string, email = `${uid}@test.com`) =>
      testEnv.authenticatedContext(uid, { email }).firestore(),
    unauthDb: () => testEnv.unauthenticatedContext().firestore(),
    setupAll: async () => {
      setLogLevel('error');
      const rules = readFileSync(RULES_PATH, 'utf8');
      testEnv = await initializeTestEnvironment({
        projectId,
        firestore: { rules },
      });
    },
    teardownAll: async () => {
      await testEnv.cleanup();
    },
    clearAll: async () => {
      await testEnv.clearFirestore();
    },
  };
}
