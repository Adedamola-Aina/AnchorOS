import type { Prediction } from '../../types';
import { detectAnomalies } from '../../utils/insights/transactionInsights';
import { nextIso } from './predictionCommon';
import { detectPrimaryCurrency, formatCents } from './fabricUtils';
import type { PredictionInput } from './predictionTypes';

const MAX_ANOMALY_PREDICTIONS = 3;
const CRITICAL_MULTIPLIER = 5;

export function buildAnomalySignals(input: PredictionInput): Prediction[] {
  const { transactions, now } = input;
  const anomalies = detectAnomalies(transactions);
  if (anomalies.length === 0) return [];

  const currency = detectPrimaryCurrency(transactions);

  return anomalies.slice(0, MAX_ANOMALY_PREDICTIONS).map((anomaly) => {
    const ratio = anomaly.amountCents / anomaly.averageCents;
    const confidence = Math.min(0.5 + (ratio - 2) * 0.1, 1.0);
    const severity = ratio >= CRITICAL_MULTIPLIER ? 'critical' as const : 'warning' as const;

    return {
      id: `pred-anomaly-${anomaly.id}`,
      type: 'unusual_spending' as const,
      message: `Unusual ${anomaly.category} spending: ${formatCents(anomaly.amountCents, currency)} (avg ${formatCents(anomaly.averageCents, currency)}).`,
      detail: `"${anomaly.title}" was ${ratio.toFixed(1)}× your typical ${anomaly.category} transaction.`,
      severity,
      confidence,
      actionable: true,
      action: { label: 'Review spending', navigateTo: '/finance' },
      expiresAt: nextIso(now, 7),
      createdAt: now.toISOString(),
    };
  });
}
