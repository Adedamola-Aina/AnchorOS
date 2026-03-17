import type { AnchorTask, AnchorTransaction, Prediction, UserPattern } from '../../types';
import { detectPrimaryCurrency, formatCents, monthKey, toDate } from './fabricUtils';
import { inMonth, nextIso } from './predictionCommon';

export function buildPatternInformedPredictions(
  patterns: UserPattern[],
  transactions: AnchorTransaction[],
  commitments: AnchorTask[],
  now: Date,
): Prediction[] {
  const results: Prediction[] = [];
  const mKey = monthKey(now);
  const currency = detectPrimaryCurrency(transactions);
  const confirmed = patterns.filter((p) => p.confidence >= 0.65);

  for (const pattern of confirmed) {
    if (pattern.trigger.type === 'time_of_day') {
      const hourDiff = Math.abs(now.getHours() - pattern.trigger.hour);
      if (hourDiff <= 2) {
        const isCommitment = pattern.followUpAction.type === 'check_commitment';
        results.push({
          id: `pred-pattern-time-${pattern.trigger.hour}-${mKey}`,
          type: 'commitment_reminder',
          message: 'Based on your patterns, this is when you usually check in.',
          detail: `You tend to review your ${isCommitment ? 'commitments' : 'budget'} around this time.`,
          severity: 'info',
          confidence: pattern.confidence,
          actionable: true,
          action: { label: isCommitment ? 'Open Commitments' : 'Review Budget', navigateTo: isCommitment ? '/commitments' : '/finance' },
          expiresAt: nextIso(now, 1),
          createdAt: now.toISOString(),
        });
      }
    }

    if (pattern.trigger.type === 'transaction_recorded' && pattern.trigger.category) {
      const cat = pattern.trigger.category;
      const thisMonthExpenses = transactions.filter((tx) => {
        if (tx.type !== 'expense' || tx.isSoftDeleted || tx.category !== cat) return false;
        const d = toDate(tx.date);
        return !!d && inMonth(d, now.getFullYear(), now.getMonth());
      });
      const thisMonthTotal = thisMonthExpenses.reduce((s, t) => s + t.amountCents, 0);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthTotal = transactions
        .filter((tx) => {
          if (tx.type !== 'expense' || tx.isSoftDeleted || tx.category !== cat) return false;
          const d = toDate(tx.date);
          return !!d && inMonth(d, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
        })
        .reduce((s, t) => s + t.amountCents, 0);

      if (lastMonthTotal > 0 && thisMonthTotal > lastMonthTotal * 1.2) {
        const pct = Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);
        results.push({
          id: `pred-pattern-category-${cat.toLowerCase().replace(/\s+/g, '-')}-${mKey}`,
          type: 'budget_overage',
          message: `You tend to review your ${cat} budget after spending here.`,
          detail: `${cat} is up ${pct}% vs last month (${formatCents(thisMonthTotal, currency)} vs ${formatCents(lastMonthTotal, currency)}).`,
          severity: 'info',
          confidence: pattern.confidence * 0.9,
          actionable: true,
          action: { label: 'Review spending', navigateTo: '/finance' },
          expiresAt: nextIso(now, 3),
          createdAt: now.toISOString(),
        });
      }
    }

    if (pattern.trigger.type === 'commitment_completed' && pattern.trigger.commitmentId) {
      const commitmentId = pattern.trigger.commitmentId;
      const task = commitments.find((t) => t.id === commitmentId);
      if (task && !task.completed && task.type === 'daily') {
        results.push({
          id: `pred-pattern-commitment-${task.id}-${now.toISOString().slice(0, 10)}`,
          type: 'commitment_reminder',
          message: `You usually complete "${task.title}" around this time.`,
          detail: task.currentStreak && task.currentStreak > 0 ? `${task.currentStreak}-day streak - don't break it.` : undefined,
          severity: 'info',
          confidence: pattern.confidence,
          actionable: true,
          action: { label: 'Open Commitments', navigateTo: '/commitments' },
          expiresAt: nextIso(now, 1),
          createdAt: now.toISOString(),
        });
      }
    }

    if (results.length >= 2) break;
  }

  return results;
}
