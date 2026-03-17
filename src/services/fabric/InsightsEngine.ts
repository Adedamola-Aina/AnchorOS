import type { Insight } from '../../types';
import { detectPrimaryCurrency } from './fabricUtils';
import {
  buildDayOfWeekInsight,
  buildSavingsRateInsight,
  buildSpendingInsight,
  buildSubscriptionInsight,
} from './insights/financeInsights';
import {
  buildCommitmentInsight,
  buildFamilyInsight,
  buildStreakInsight,
} from './insights/commitmentInsights';
import { buildCorrelationInsight } from './insights/patternInsights';
import type { InsightInput } from './insights/types';

export function buildInsights(input: InsightInput): Insight[] {
  const spending = buildSpendingInsight(input.transactions, input.now);
  const commitment = buildCommitmentInsight(input.commitments, input.now);
  const family = buildFamilyInsight(input.transactions, input.now);
  const streak = buildStreakInsight(input.commitments, input.now);
  const currency = detectPrimaryCurrency(input.transactions);
  const subscriptions = buildSubscriptionInsight(input.recurring, currency, input.now);
  const savings = buildSavingsRateInsight(input.transactions, input.now);
  const dayOfWeek = buildDayOfWeekInsight(input.transactions, input.now);
  const correlation = buildCorrelationInsight(input.transactions, input.commitments, input.now);

  if (input.feature === 'finance') {
    return [spending, subscriptions, savings, dayOfWeek].filter((i): i is Insight => !!i);
  }
  if (input.feature === 'commitments') {
    return [commitment, streak].filter((i): i is Insight => !!i);
  }
  if (input.feature === 'family') return family ? [family] : [];

  return [correlation, spending, commitment, streak, savings, dayOfWeek].filter((i): i is Insight => !!i);
}
