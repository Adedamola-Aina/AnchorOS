/**
 * Cold Start Profiler — SRE-005
 *
 * Instruments Cloud Function cold starts with timing metrics.
 * Records module-load time and per-invocation cold/warm status.
 * Metrics are stored in Firestore for dashboard consumption.
 */

import { logger } from 'firebase-functions';

export interface ColdStartMetric {
  functionName: string;
  moduleLoadMs: number;
  wasColdStart: boolean;
  timestamp: string;
}

/** Module-level timestamp captured at import time (cold start marker). */
const MODULE_LOAD_TIME = Date.now();
let firstInvocation = true;
const metricsLog: ColdStartMetric[] = [];

/**
 * Check if the current invocation is a cold start.
 * First invocation after module load = cold start.
 */
export function isColdStart(): boolean {
  if (firstInvocation) {
    firstInvocation = false;
    return true;
  }
  return false;
}

/**
 * Measure cold start timing for a specific function.
 * Call this at the start of each callable handler.
 */
export function measureColdStart(functionName: string): ColdStartMetric {
  const now = Date.now();
  const moduleLoadMs = now - MODULE_LOAD_TIME;
  const wasColdStart = isColdStart();

  const metric: ColdStartMetric = {
    functionName,
    moduleLoadMs,
    wasColdStart,
    timestamp: new Date(now).toISOString(),
  };

  metricsLog.push(metric);

  logger.info(`[ColdStart] ${functionName}`, {
    ...metric,
    'coldstart.profiling': true,
  });

  return metric;
}

/**
 * Get all accumulated cold start metrics for this instance.
 */
export function getColdStartMetrics(): readonly ColdStartMetric[] {
  return metricsLog;
}
