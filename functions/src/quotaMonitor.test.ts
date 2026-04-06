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
    get: vi.fn().mockResolvedValue({ exists: false, data: () => null }),
  },
}));

vi.mock('./config', () => ({
  db: mockDb,
  APP_ID: 'anchor-os',
}));

import {
  evaluateQuotaThresholds,
  buildQuotaMetrics,
  type QuotaMetrics,
  type QuotaAlert,
} from './quotaMonitor';

describe('quotaMonitor', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('buildQuotaMetrics', () => {
    it('returns metrics with correct structure', () => {
      const metrics = buildQuotaMetrics({
        dailyReads: 40_000,
        dailyWrites: 15_000,
        dailyDeletes: 5_000,
        storageBytes: 500_000_000,
      });
      expect(metrics.dailyReads).toBe(40_000);
      expect(metrics.dailyWrites).toBe(15_000);
      expect(metrics.dailyDeletes).toBe(5_000);
      expect(metrics.storageBytes).toBe(500_000_000);
      expect(typeof metrics.collectedAt).toBe('string');
    });
  });

  describe('evaluateQuotaThresholds', () => {
    it('returns no alerts when under 80% threshold', () => {
      const metrics: QuotaMetrics = {
        dailyReads: 10_000,
        dailyWrites: 5_000,
        dailyDeletes: 1_000,
        storageBytes: 100_000_000,
        collectedAt: new Date().toISOString(),
      };
      const limits = {
        dailyReads: 50_000,
        dailyWrites: 20_000,
        dailyDeletes: 20_000,
        storageBytes: 1_073_741_824,
      };
      const alerts = evaluateQuotaThresholds(metrics, limits);
      expect(alerts).toHaveLength(0);
    });

    it('fires alert when reads exceed 80% threshold', () => {
      const metrics: QuotaMetrics = {
        dailyReads: 42_000,
        dailyWrites: 5_000,
        dailyDeletes: 1_000,
        storageBytes: 100_000_000,
        collectedAt: new Date().toISOString(),
      };
      const limits = {
        dailyReads: 50_000,
        dailyWrites: 20_000,
        dailyDeletes: 20_000,
        storageBytes: 1_073_741_824,
      };
      const alerts = evaluateQuotaThresholds(metrics, limits);
      expect(alerts.length).toBeGreaterThanOrEqual(1);
      expect(alerts[0].metric).toBe('dailyReads');
      expect(alerts[0].percentUsed).toBeCloseTo(84, 0);
    });

    it('fires multiple alerts when several metrics exceed threshold', () => {
      const metrics: QuotaMetrics = {
        dailyReads: 45_000,
        dailyWrites: 18_000,
        dailyDeletes: 1_000,
        storageBytes: 900_000_000,
        collectedAt: new Date().toISOString(),
      };
      const limits = {
        dailyReads: 50_000,
        dailyWrites: 20_000,
        dailyDeletes: 20_000,
        storageBytes: 1_073_741_824,
      };
      const alerts = evaluateQuotaThresholds(metrics, limits);
      expect(alerts.length).toBe(3); // reads, writes, storage
    });

    it('includes severity "critical" when above 95%', () => {
      const metrics: QuotaMetrics = {
        dailyReads: 48_000,
        dailyWrites: 5_000,
        dailyDeletes: 1_000,
        storageBytes: 100_000_000,
        collectedAt: new Date().toISOString(),
      };
      const limits = {
        dailyReads: 50_000,
        dailyWrites: 20_000,
        dailyDeletes: 20_000,
        storageBytes: 1_073_741_824,
      };
      const alerts = evaluateQuotaThresholds(metrics, limits);
      expect(alerts[0].severity).toBe('critical');
    });

    it('includes severity "warning" when between 80-95%', () => {
      const metrics: QuotaMetrics = {
        dailyReads: 42_000,
        dailyWrites: 5_000,
        dailyDeletes: 1_000,
        storageBytes: 100_000_000,
        collectedAt: new Date().toISOString(),
      };
      const limits = {
        dailyReads: 50_000,
        dailyWrites: 20_000,
        dailyDeletes: 20_000,
        storageBytes: 1_073_741_824,
      };
      const alerts = evaluateQuotaThresholds(metrics, limits);
      expect(alerts[0].severity).toBe('warning');
    });
  });
});
