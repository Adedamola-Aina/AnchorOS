import { describe, it, expect, vi, beforeEach } from 'vitest';

const loggerMock = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

vi.mock('firebase-functions', () => ({
  logger: loggerMock,
}));

vi.mock('firebase-functions/v2/scheduler', () => ({
  onSchedule: vi.fn((_opts: unknown, handler: () => Promise<void>) => handler),
}));

vi.mock('firebase-functions/v2/https', () => ({
  onCall: vi.fn((_opts: unknown, handler: unknown) => handler),
  onRequest: vi.fn((_opts: unknown, handler: unknown) => handler),
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

import { WARM_TARGETS, getWarmTargets, warmUpFunctions } from './warmUp';

describe('warmUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

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

  describe('warmUpFunctions', () => {
    it('logs cycle result and persists warm-up snapshot', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-10T08:30:45.120Z'));

      await warmUpFunctions();

      expect(loggerMock.info).toHaveBeenNthCalledWith(
        1,
        '[WarmUp] Starting keep-warm cycle',
        expect.objectContaining({
          targetCount: WARM_TARGETS.length,
        }),
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        2,
        '[WarmUp] Cycle complete',
        expect.objectContaining({
          timestamp: '2026-04-10T08:30:45.120Z',
          status: 'ok',
          targets: WARM_TARGETS.map(t => t.name),
          durationMs: expect.any(Number),
        }),
      );

      expect(mockDb.doc).toHaveBeenCalledWith('2026-04-10T08-30-45-120Z');
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: '2026-04-10T08:30:45.120Z',
          targets: WARM_TARGETS.map(t => t.name),
          status: 'ok',
        }),
      );
    });
  });
});
