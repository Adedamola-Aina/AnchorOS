/**
 * Firestore Quota Monitoring — SRE-004
 *
 * Scheduled function that checks Firestore usage metrics against
 * configurable thresholds (default 80%) and logs structured alerts.
 * Stores metrics history in Firestore for trend analysis.
 *
 * In production, this integrates with Cloud Monitoring API.
 * The pure functions (evaluateQuotaThresholds, buildQuotaMetrics)
 * are exported for unit testing.
 */

import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db, APP_ID } from './config';

export interface QuotaMetrics {
  dailyReads: number;
  dailyWrites: number;
  dailyDeletes: number;
  storageBytes: number;
  collectedAt: string;
}

export interface QuotaLimits {
  dailyReads: number;
  dailyWrites: number;
  dailyDeletes: number;
  storageBytes: number;
}

export interface QuotaAlert {
  metric: keyof QuotaLimits;
  current: number;
  limit: number;
  percentUsed: number;
  severity: 'warning' | 'critical';
}

const WARNING_THRESHOLD = 0.80;
const CRITICAL_THRESHOLD = 0.95;

/** Default Firestore free-tier daily limits (Blaze plan). */
const DEFAULT_LIMITS: QuotaLimits = {
  dailyReads: 50_000,
  dailyWrites: 20_000,
  dailyDeletes: 20_000,
  storageBytes: 1_073_741_824, // 1 GiB
};

/**
 * Build a QuotaMetrics snapshot from raw usage numbers.
 */
export function buildQuotaMetrics(usage: Omit<QuotaMetrics, 'collectedAt'>): QuotaMetrics {
  return { ...usage, collectedAt: new Date().toISOString() };
}

/**
 * Evaluate usage against limits and return alerts for any
 * metrics exceeding the warning threshold (80%).
 */
export function evaluateQuotaThresholds(
  metrics: QuotaMetrics,
  limits: QuotaLimits = DEFAULT_LIMITS,
): QuotaAlert[] {
  const alerts: QuotaAlert[] = [];
  const checks: Array<{ key: keyof QuotaLimits; current: number }> = [
    { key: 'dailyReads', current: metrics.dailyReads },
    { key: 'dailyWrites', current: metrics.dailyWrites },
    { key: 'dailyDeletes', current: metrics.dailyDeletes },
    { key: 'storageBytes', current: metrics.storageBytes },
  ];

  for (const { key, current } of checks) {
    const limit = limits[key];
    const ratio = current / limit;

    if (ratio >= WARNING_THRESHOLD) {
      alerts.push({
        metric: key,
        current,
        limit,
        percentUsed: Math.round(ratio * 100),
        severity: ratio >= CRITICAL_THRESHOLD ? 'critical' : 'warning',
      });
    }
  }

  return alerts;
}

/**
 * Store quota metrics snapshot in Firestore for historical tracking.
 */
async function storeMetrics(metrics: QuotaMetrics): Promise<void> {
  const docId = metrics.collectedAt.replace(/[:.]/g, '-');
  await db
    .collection('artifacts')
    .doc(APP_ID)
    .collection('quota_metrics')
    .doc(docId)
    .set(metrics);
}

/**
 * Scheduled function: runs every 6 hours to check Firestore quota.
 * Logs structured alerts for Cloud Monitoring/Alerting integration.
 *
 * In practice, usage numbers come from the Cloud Monitoring API
 * (firestore.googleapis.com/document/read_count, etc.).
 * The scheduled function fetches these and evaluates thresholds.
 */
export const checkFirestoreQuota = onSchedule(
  { schedule: 'every 6 hours', timeZone: 'UTC' },
  async () => {
    logger.info('[QuotaMonitor] Starting quota check');

    // In production, replace with Cloud Monitoring API calls:
    // const { MetricServiceClient } = require('@google-cloud/monitoring');
    // For now, we read a stored usage counter (set by triggers or external).
    const usageDoc = await db
      .collection('artifacts')
      .doc(APP_ID)
      .collection('system')
      .doc('daily_usage')
      .get();

    const usage = usageDoc.exists
      ? (usageDoc.data() as Omit<QuotaMetrics, 'collectedAt'>)
      : { dailyReads: 0, dailyWrites: 0, dailyDeletes: 0, storageBytes: 0 };

    const metrics = buildQuotaMetrics(usage);
    await storeMetrics(metrics);

    const alerts = evaluateQuotaThresholds(metrics);

    if (alerts.length === 0) {
      logger.info('[QuotaMonitor] All metrics within limits', { metrics });
      return;
    }

    for (const alert of alerts) {
      const logFn = alert.severity === 'critical' ? logger.error : logger.warn;
      logFn(`[QuotaMonitor] ${alert.severity.toUpperCase()}: ${alert.metric}`, {
        ...alert,
        'monitoring.alert': true,
        'monitoring.severity': alert.severity,
      });
    }

    // Store alert snapshot for dashboard consumption
    await db
      .collection('artifacts')
      .doc(APP_ID)
      .collection('quota_alerts')
      .doc(metrics.collectedAt.replace(/[:.]/g, '-'))
      .set({ alerts, collectedAt: metrics.collectedAt });
  },
);
