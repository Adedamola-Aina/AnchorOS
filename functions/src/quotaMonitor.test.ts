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
  checkFirestoreQuota,
  type QuotaMetrics,
} from './quotaMonitor';

describe('quotaMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

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
      expect(alerts.length).toBe(3);
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

  describe('checkFirestoreQuota', () => {
    it('warns and stores zeroed metrics when usage source is missing', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-10T00:00:00.000Z'));
      mockDb.get.mockResolvedValueOnce({ exists: false, data: () => null });

      await checkFirestoreQuota();

      expect(loggerMock.warn).toHaveBeenCalledWith(
        '[QuotaMonitor] Missing daily_usage source document. Metrics may be stale.',
        expect.objectContaining({
          'monitoring.alert': true,
          'monitoring.severity': 'warning',
        }),
      );
      expect(mockDb.set).toHaveBeenCalledTimes(1);
      expect(mockDb.doc).toHaveBeenCalledWith('2026-04-10T00-00-00-000Z');
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          dailyReads: 0,
          dailyWrites: 0,
          dailyDeletes: 0,
          storageBytes: 0,
          collectedAt: '2026-04-10T00:00:00.000Z',
        }),
      );
      expect(loggerMock.info).toHaveBeenCalledWith(
        '[QuotaMonitor] All metrics within limits',
        expect.any(Object),
      );
    });

    it('normalizes invalid usage values, logs stale source, and stores alerts', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-10T12:00:00.000Z'));
      mockDb.get.mockResolvedValueOnce({
        exists: true,
        data: () => ({
          dailyReads: '49000',
          dailyWrites: -5,
          dailyDeletes: 25.8,
          storageBytes: 'not-a-number',
          updatedAt: '2026-04-09T00:00:00.000Z',
        }),
      });

      await checkFirestoreQuota();

      expect(loggerMock.warn).toHaveBeenCalledWith(
        '[QuotaMonitor] daily_usage source appears stale.',
        expect.objectContaining({
          sourceAgeHours: 36,
        }),
      );

      expect(mockDb.set).toHaveBeenCalledTimes(2);
      expect(mockDb.set).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          dailyReads: 49_000,
          dailyWrites: 0,
          dailyDeletes: 25,
          storageBytes: 0,
        }),
      );

      const secondSetPayload = mockDb.set.mock.calls[1]?.[0] as {
        alerts: Array<{ metric: string; severity: string; percentUsed: number }>;
      };
      expect(secondSetPayload.alerts).toHaveLength(1);
      expect(secondSetPayload.alerts[0]).toMatchObject({
        metric: 'dailyReads',
        severity: 'critical',
        percentUsed: 98,
      });
      expect(loggerMock.error).toHaveBeenCalledWith(
        '[QuotaMonitor] CRITICAL: dailyReads',
        expect.objectContaining({
          'monitoring.alert': true,
          'monitoring.severity': 'critical',
        }),
      );
    });
  });
});
