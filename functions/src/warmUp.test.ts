import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase-functions', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: vi.fn((_opts: unknown, handler: () => Promise<void>) => handler),
}));

vi.mock('firebase-functions/v2/https', () => ({
  onCall: vi.fn((_opts: unknown, handler: unknown) => handler),
  onRequest: vi.fn((_opts: unknown, handler: unknown) => handler),
}));

const mockGet = vi.fn().mockResolvedValue({
  status: 200,
  ok: true,
});

vi.mock('./config', () => ({
  db: {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    set: vi.fn().mockResolvedValue(undefined),
  },
  APP_ID: 'anchor-os',
}));

import { WARM_TARGETS, getWarmTargets } from './warmUp';

describe('warmUp', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('WARM_TARGETS', () => {
    it('defines at least 3 high-traffic endpoints', () => {
      expect(WARM_TARGETS.length).toBeGreaterThanOrEqual(3);
    });

    it('includes the health endpoint', () => {
      const names = WARM_TARGETS.map(t => t.name);
      expect(names).toContain('health');
    });

    it('each target has name and description', () => {
      for (const target of WARM_TARGETS) {
        expect(target.name).toBeTruthy();
        expect(target.description).toBeTruthy();
      }
    });
  });

  describe('getWarmTargets', () => {
    it('returns a frozen copy', () => {
      const targets = getWarmTargets();
      expect(Object.isFrozen(targets)).toBe(true);
    });
  });
});
