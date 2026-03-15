import type { AnchorTask, AnchorTransaction, Prediction, UserPattern } from '../../types';
import { detectPrimaryCurrency, formatCents, monthKey, sumByCategory, toDate } from './fabricUtils';

interface PredictionInput {
  patterns: UserPattern[];
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}

function inMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

function nextIso(now: Date, days: number): string {
  const copy = new Date(now);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString();
}

function buildPatternInformedPredictions(
  patterns: UserPattern[],
  transactions: AnchorTransaction[],
  commitments: AnchorTask[],
  now: Date,
): Prediction[] {
  const results: Prediction[] = [];
  const mKey = monthKey(now);
  const currency = detectPrimaryCurrency(transactions);
  const CONFIDENCE_THRESHOLD = 0.65;

  const confirmed = patterns.filter((p) => p.confidence >= CONFIDENCE_THRESHOLD);

  for (const pattern of confirmed) {
    // ─── Type 1: time_of_day trigger ───
    if (pattern.trigger.type === 'time_of_day') {
      const patternHour = pattern.trigger.hour;
      const currentHour = now.getHours();
      const hourDiff = Math.abs(currentHour - patternHour);

      if (hourDiff <= 2) {
        const actionLabel = pattern.followUpAction.type === 'check_commitment'
          ? 'Open Commitments'
          : 'Review Budget';
        const navigateTo = pattern.followUpAction.type === 'check_commitment'
          ? '/commitments'
          : '/finance';

        results.push({
          id: `pred-pattern-time-${patternHour}-${mKey}`,
          type: 'commitment_reminder',
          message: 'Based on your patterns, this is when you usually check in.',
          detail: `You tend to review your ${
            pattern.followUpAction.type === 'check_commitment' ? 'commitments' : 'budget'
          } around this time.`,
          severity: 'info',
          confidence: pattern.confidence,
          actionable: true,
          action: { label: actionLabel, navigateTo },
          expiresAt: nextIso(now, 1),
          createdAt: now.toISOString(),
        });
      }
    }

    // ─── Type 2: transaction_recorded trigger + category spend elevated ───
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

    // ─── Type 3: commitment_completed trigger + task not done today ───
    if (pattern.trigger.type === 'commitment_completed' && pattern.trigger.commitmentId) {
      const task = commitments.find((t) => t.id === pattern.trigger.commitmentId);
      if (task && !task.completed && task.type === 'daily') {
        results.push({
          id: `pred-pattern-commitment-${task.id}-${now.toISOString().slice(0, 10)}`,
          type: 'commitment_reminder',
          message: `You usually complete "${task.title}" around this time.`,
          detail: task.currentStreak && task.currentStreak > 0
            ? `${task.currentStreak}-day streak — don't break it.`
            : undefined,
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

export function buildPredictions(input: PredictionInput): Prediction[] {
  const predictions: Prediction[] = [];
  const { now } = input;
  const year = now.getFullYear();
  const month = now.getMonth();
  const currency = detectPrimaryCurrency(input.transactions);

  // Use month key in IDs so dismissed predictions reset each month
  const mKey = monthKey(now);

  const expenses = input.transactions.filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted);

  // ─── 1. Budget overage ──────────────────────────────────────────────────────
  const thisMonthExpenses = expenses.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && inMonth(d, year, month);
  });
  const thisMonth = thisMonthExpenses.reduce((sum, tx) => sum + tx.amountCents, 0);

  const lastMonthDate = new Date(year, month - 1, 1);
  const lastMonth = expenses
    .filter((tx) => {
      const d = toDate(tx.date);
      return !!d && inMonth(d, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  if (lastMonth > 0 && thisMonth > lastMonth * 1.2) {
    const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    predictions.push({
      id: `pred-budget-overage-${mKey}`,
      type: 'budget_overage',
      message: `Spending is ${pct}% above last month.`,
      detail: `This month: ${formatCents(thisMonth, currency)} vs last month: ${formatCents(lastMonth, currency)}.`,
      severity: 'warning',
      confidence: 0.82,
      actionable: true,
      action: { label: 'Review spending', navigateTo: '/finance' },
      expiresAt: nextIso(now, 3),
      createdAt: now.toISOString(),
    });
  }

  // ─── 2. Category burn rate ───────────────────────────────────────────────────
  // Warn if any category is on pace to exceed its typical monthly total
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthProgress = dayOfMonth / daysInMonth;

  if (monthProgress > 0.1 && lastMonth > 0) {
    const lastMonthByCategory = sumByCategory(
      expenses.filter((tx) => {
        const d = toDate(tx.date);
        return !!d && inMonth(d, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
      }),
    );

    const thisMonthByCategory = sumByCategory(thisMonthExpenses);

    for (const [category, spent] of Object.entries(thisMonthByCategory)) {
      const typical = lastMonthByCategory[category] ?? 0;
      if (typical === 0) continue;
      const projected = spent / monthProgress;
      if (projected > typical * 1.3) {
        const projectedFmt = formatCents(Math.round(projected), currency);
        const typicalFmt = formatCents(typical, currency);
        predictions.push({
          id: `pred-burn-rate-${category.toLowerCase().replace(/\s+/g, '-')}-${mKey}`,
          type: 'budget_overage',
          message: `${category} spend is running high.`,
          detail: `On pace for ${projectedFmt} vs typical ${typicalFmt} last month.`,
          severity: 'warning',
          confidence: 0.72,
          actionable: true,
          action: { label: 'View transactions', navigateTo: '/finance' },
          expiresAt: nextIso(now, 2),
          createdAt: now.toISOString(),
        });
        break; // Only surface the worst offender to avoid noise
      }
    }
  }

  // ─── 3. Streak at risk — with specific task name ─────────────────────────────
  const pendingDaily = input.commitments.filter((task) => task.type === 'daily' && !task.completed);
  if (pendingDaily.length > 0) {
    // Find the task with the longest streak — breaking it hurts most
    const riskiest = pendingDaily.reduce((best, t) =>
      (t.currentStreak ?? 0) > (best.currentStreak ?? 0) ? t : best, pendingDaily[0]);
    const streakInfo = (riskiest.currentStreak ?? 0) > 0
      ? ` Your "${riskiest.title}" streak is at ${riskiest.currentStreak} day${riskiest.currentStreak === 1 ? '' : 's'}.`
      : '';
    predictions.push({
      id: `pred-streak-risk-${now.toISOString().slice(0, 10)}`,
      type: 'streak_at_risk',
      message: pendingDaily.length === 1
        ? `"${riskiest.title}" is still incomplete today.`
        : `${pendingDaily.length} daily commitments are still pending.`,
      detail: `Complete before midnight to keep your streak.${streakInfo}`,
      severity: 'warning',
      confidence: 0.75,
      actionable: true,
      action: { label: 'Open commitments', navigateTo: '/commitments' },
      expiresAt: nextIso(now, 1),
      createdAt: now.toISOString(),
    });
  }

  // ─── 4. Recurring pattern due ────────────────────────────────────────────────
  const recurringPattern = input.patterns.find(
    (p) => p.followUpAction.type === 'review_budget' && p.confidence >= 0.6,
  );
  const recurringCategory =
    recurringPattern?.followUpAction.type === 'review_budget'
      ? recurringPattern.followUpAction.category
      : undefined;
  if (recurringPattern && now.getDate() <= 5) {
    predictions.push({
      id: `pred-recurring-due-${mKey}`,
      type: 'recurring_due',
      message: `A regular ${recurringCategory ?? 'spending'} pattern may be due.`,
      detail: `Anchor AI has noticed a consistent pattern in your ${recurringCategory ?? 'monthly'} spend.`,
      severity: 'info',
      confidence: recurringPattern.confidence,
      actionable: true,
      action: { label: 'Review spending', navigateTo: '/finance' },
      expiresAt: nextIso(now, 5),
      createdAt: now.toISOString(),
    });
  }

  // ─── 5. Savings opportunity ──────────────────────────────────────────────────
  // If income > expenses for the current month, surface a surplus nudge
  const thisMonthIncome = input.transactions
    .filter((tx) => {
      if (tx.type !== 'income' || tx.isSoftDeleted) return false;
      const d = toDate(tx.date);
      return !!d && inMonth(d, year, month);
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const surplus = thisMonthIncome - thisMonth;
  if (thisMonthIncome > 0 && surplus > 0 && dayOfMonth >= 15) {
    predictions.push({
      id: `pred-savings-opportunity-${mKey}`,
      type: 'cash_flow_alert',
      message: `You have a surplus of ${formatCents(surplus, currency)} this month.`,
      detail: 'Consider moving the difference to a savings account.',
      severity: 'info',
      confidence: 0.65,
      actionable: true,
      action: { label: 'View accounts', navigateTo: '/finance' },
      expiresAt: nextIso(now, 7),
      createdAt: now.toISOString(),
    });
  }

  // ─── 6. Unusual spending spike in last 7 days ────────────────────────────────
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const last7Days = expenses.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && d >= sevenDaysAgo;
  });
  const last7Total = last7Days.reduce((sum, tx) => sum + tx.amountCents, 0);

  // Compare to typical 7-day spend (last month / 4)
  const typical7Day = lastMonth / 4;
  if (typical7Day > 0 && last7Total > typical7Day * 1.5 && last7Days.length >= 3) {
    predictions.push({
      id: `pred-unusual-spike-${now.toISOString().slice(0, 10)}`,
      type: 'unusual_spending',
      message: `Higher than usual spending in the last 7 days.`,
      detail: `${formatCents(last7Total, currency)} spent — about ${Math.round((last7Total / typical7Day) * 100)}% of your typical weekly spend.`,
      severity: 'warning',
      confidence: 0.68,
      actionable: true,
      action: { label: 'Review transactions', navigateTo: '/finance' },
      expiresAt: nextIso(now, 2),
      createdAt: now.toISOString(),
    });
  }

  const patternPredictions = buildPatternInformedPredictions(
    input.patterns,
    input.transactions,
    input.commitments,
    now,
  );

  return [...predictions, ...patternPredictions]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
