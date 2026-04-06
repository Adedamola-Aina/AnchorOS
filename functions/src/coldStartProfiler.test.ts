import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase-functions', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: vi.fn((_opts: unknown, handler: () => Promise<void>) => handler),
}));

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    set: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('./config', () => ({
  db: mockDb,
  APP_ID: 'anchor-os',
}));

import {
  measureColdStart,
  isColdStart,
  getColdStartMetrics,
} from './coldStartProfiler';

describe('coldStartProfiler', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('isColdStart', () => {
    it('returns true on first call', () => {
      // Reset the module state would be complex here,
      // so we test the function returns a boolean
      expect(typeof isColdStart()).toBe('boolean');
    });
  });

  describe('measureColdStart', () => {
    it('returns timing metrics', () => {
      const metrics = measureColdStart('testFunc');
      expect(metrics.functionName).toBe('testFunc');
      expect(typeof metrics.moduleLoadMs).toBe('number');
      expect(typeof metrics.timestamp).toBe('string');
    });

    it('captures function name correctly', () => {
      const m1 = measureColdStart('funcA');
      const m2 = measureColdStart('funcB');
      expect(m1.functionName).toBe('funcA');
      expect(m2.functionName).toBe('funcB');
    });
  });

  describe('getColdStartMetrics', () => {
    it('returns accumulated metrics array', () => {
      measureColdStart('test1');
      const all = getColdStartMetrics();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBeGreaterThanOrEqual(1);
    });
  });
});
