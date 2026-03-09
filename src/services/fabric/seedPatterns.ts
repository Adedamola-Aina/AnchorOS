import type { AnchorTask, AnchorTransaction, PatternTrigger, UserPattern } from '../../types';
import { calculateConfidence } from './behaviorEngineUtils';

function buildFinancePatterns(transactions: AnchorTransaction[], nowIso: string): UserPattern[] {
  const activeTransactions = transactions.filter((tx) => !tx.isSoftDeleted && tx.type === 'expense');
  const categoryCount = new Map<string, number>();

  for (const tx of activeTransactions) {
    const key = tx.category || 'General';
    categoryCount.set(key, (categoryCount.get(key) ?? 0) + 1);
  }

  const patterns: UserPattern[] = [];
  for (const [category, count] of categoryCount.entries()) {
    if (count < 2) continue;
    patterns.push({
      id: `seed-finance-${category.toLowerCase().replace(/\s+/g, '-')}`,
      trigger: { type: 'transaction_recorded', category },
      followUpAction: { type: 'review_budget', category },
      frequency: count,
      confidence: Math.max(0.55, calculateConfidence(count, 0, count)),
      lastOccurred: nowIso,
      averageDelayMs: 0,
      dismissed: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }

  return patterns;
}

function buildCommitmentPatterns(commitments: AnchorTask[], nowIso: string): UserPattern[] {
  const commitmentByTime = commitments
    .filter((task) => task.completed && task.timeOfDay && task.timeOfDay !== 'any')
    .reduce<Record<string, number>>((acc, task) => {
      const key = task.timeOfDay as string;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

  const hourByTimeOfDay: Record<string, number> = {
    morning: 8,
    afternoon: 14,
    evening: 18,
  };

  const patterns: UserPattern[] = [];
  for (const [timeOfDay, count] of Object.entries(commitmentByTime)) {
    if (count < 2) continue;
    const trigger: PatternTrigger = { type: 'time_of_day', hour: hourByTimeOfDay[timeOfDay] ?? 9 };
    patterns.push({
      id: `seed-commitment-${timeOfDay}`,
      trigger,
      followUpAction: { type: 'check_commitment' },
      frequency: count,
      confidence: Math.max(0.55, calculateConfidence(count, 0, count)),
      lastOccurred: nowIso,
      averageDelayMs: 0,
      dismissed: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }

  return patterns;
}

export function buildSeedPatterns(
  transactions: AnchorTransaction[],
  commitments: AnchorTask[],
  nowIso: string
): UserPattern[] {
  return [
    ...buildFinancePatterns(transactions, nowIso),
    ...buildCommitmentPatterns(commitments, nowIso),
  ];
}