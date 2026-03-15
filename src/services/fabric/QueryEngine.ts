import type { AnchorAccount, AnchorTask, AnchorTransaction, FabricQueryResult, ParsedIntent, RecurringTransaction } from '../../types';
import {
  buildWeekBuckets,
  detectPrimaryCurrency,
  formatCents,
  formatPeriodLabel,
  getBestCompletionDay,
  getDateRange,
  getHighSpendDay,
  sumByCategory,
  toDate,
  withinRange,
} from './fabricUtils';
import { buildDailyBriefing, getUpcomingItems } from './DailyBriefingEngine';

interface RunFabricQueryInput {
  intent: ParsedIntent;
  input: string;
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  accounts: AnchorAccount[];
  recurring: RecurringTransaction[];
  now: Date;
}

function spendingSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const expenses = input.transactions.filter((tx) => {
    if (tx.type !== 'expense' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });

  const total = expenses.reduce((sum, tx) => sum + tx.amountCents, 0);
  const byCategory = sumByCategory(expenses);

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).at(0);
  const periodLabel = formatPeriodLabel(input.intent.entities.timePeriod);

  // Check if the category filter was specified
  const categoryFilter = input.intent.entities.category;
  if (categoryFilter) {
    const filtered = expenses.filter(
      (tx) => tx.category?.toLowerCase().includes(categoryFilter.toLowerCase()),
    );
    const filteredTotal = filtered.reduce((sum, tx) => sum + tx.amountCents, 0);
    return {
      data: { totalCents: filteredTotal, count: filtered.length, category: categoryFilter },
      summary: `You spent ${formatCents(filteredTotal, currency)} on ${categoryFilter} ${periodLabel} across ${filtered.length} transaction${filtered.length === 1 ? '' : 's'}.`,
      detail: filtered.length === 0 ? `No ${categoryFilter} expenses found for that period.` : undefined,
      visualizable: filtered.length > 0,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  return {
    data: { totalCents: total, count: expenses.length, topCategory },
    summary: expenses.length === 0
      ? `No expenses found for ${periodLabel}.`
      : `You spent ${formatCents(total, currency)} ${periodLabel} across ${expenses.length} transaction${expenses.length === 1 ? '' : 's'}.`,
    detail: topCategory
      ? `Top category: ${topCategory[0]} at ${formatCents(topCategory[1], currency)}.`
      : undefined,
    visualizable: expenses.length > 0,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function commitmentsSummary(input: RunFabricQueryInput): FabricQueryResult {
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const filtered = input.commitments.filter((task) => {
    const date = toDate(task.createdAt ?? null);
    return !date || (date >= range.start && date <= range.end);
  });
  const tasks = filtered.length > 0 ? filtered : input.commitments;

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const bestStreak = tasks.reduce((max, t) => Math.max(max, t.currentStreak ?? 0), 0);

  return {
    data: { total, completed, rate, bestStreak },
    summary: `Commitment completion is ${rate}% (${completed}/${total}).`,
    detail: rate >= 80
      ? `Great consistency! Best streak: ${bestStreak} day${bestStreak === 1 ? '' : 's'}.`
      : rate >= 50
        ? 'You can boost this by completing one pending task today.'
        : 'Consider narrowing your active commitments to build momentum.',
    visualizable: true,
    actions: [{ label: 'Open Commitments', type: 'navigate', payload: { page: 'commitments' } }],
  };
}

function weekSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const weekStart = new Date(input.now);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekTxns = input.transactions.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && d >= weekStart;
  });
  const spent = weekTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents, 0);
  const income = weekTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountCents, 0);
  const completed = input.commitments.filter((t) => t.completed).length;
  const total = input.commitments.length;

  return {
    data: { spent, income, completed, total },
    summary: `This week: ${formatCents(spent, currency)} spent, ${formatCents(income, currency)} earned. Commitments: ${completed}/${total} done.`,
    detail: income > spent ? `You're ${formatCents(income - spent, currency)} ahead — good week!` : undefined,
    visualizable: true,
    actions: [
      { label: 'View Finance', type: 'navigate', payload: { page: 'finance' } },
      { label: 'View Commitments', type: 'navigate', payload: { page: 'commitments' } },
    ],
  };
}

function incomeSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const incomes = input.transactions.filter((tx) => {
    if (tx.type !== 'income' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });
  const total = incomes.reduce((sum, tx) => sum + tx.amountCents, 0);
  const periodLabel = formatPeriodLabel(input.intent.entities.timePeriod);
  return {
    data: { totalCents: total, count: incomes.length },
    summary: incomes.length === 0
      ? `No income recorded for ${periodLabel}.`
      : `You earned ${formatCents(total, currency)} ${periodLabel} across ${incomes.length} income transaction${incomes.length === 1 ? '' : 's'}.`,
    visualizable: incomes.length > 0,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function accountsSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const active = input.accounts.filter((a) => !a.isArchived);
  if (active.length === 0) {
    return {
      data: null,
      summary: 'No accounts found. Add an account in Finance to get started.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }
  const totalCents = active.reduce((sum, a) => sum + a.balanceCents, 0);
  const top = [...active].sort((a, b) => b.balanceCents - a.balanceCents).at(0);
  return {
    data: { accounts: active.length, totalCents },
    summary: `You have ${active.length} account${active.length === 1 ? '' : 's'} with a combined balance of ${formatCents(totalCents, currency)}.`,
    detail: top ? `Highest balance: ${top.name} at ${formatCents(top.balanceCents, currency)}.` : undefined,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function recurringSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const active = input.recurring.filter((r) => r.status === 'active');
  if (active.length === 0) {
    return {
      data: null,
      summary: 'No active recurring transactions found.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }
  const totalMonthlyCents = active
    .filter((r) => r.frequency === 'monthly')
    .reduce((sum, r) => sum + r.amountCents, 0);
  const upcoming = [...active]
    .sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime())
    .at(0);
  return {
    data: { count: active.length, totalMonthlyCents },
    summary: `You have ${active.length} active recurring transaction${active.length === 1 ? '' : 's'}${totalMonthlyCents > 0 ? `, totalling ${formatCents(totalMonthlyCents, currency)}/month` : ''}.`,
    detail: upcoming ? `Next due: ${upcoming.title} on ${new Date(upcoming.nextRunAt).toLocaleDateString()}.` : undefined,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function familySummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const familyTxns = input.transactions.filter((tx) => {
    if (tx.scope !== 'family' || tx.isSoftDeleted) return false;
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });
  if (familyTxns.length === 0) {
    return {
      data: null,
      summary: 'No shared family transactions found for that period.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }
  const totalSpent = familyTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents, 0);
  const periodLabel = formatPeriodLabel(input.intent.entities.timePeriod);
  return {
    data: { count: familyTxns.length, totalSpentCents: totalSpent },
    summary: `${familyTxns.length} shared transactions ${periodLabel} — ${formatCents(totalSpent, currency)} in shared expenses.`,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function netWorthSummary(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const active = input.accounts.filter((a) => !a.isArchived);
  if (active.length === 0) {
    return {
      data: null,
      summary: 'Add accounts in Finance to track your net worth.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }
  const assets = active.filter((a) => a.balanceCents >= 0).reduce((s, a) => s + a.balanceCents, 0);
  const liabilities = active.filter((a) => a.balanceCents < 0).reduce((s, a) => s + Math.abs(a.balanceCents), 0);
  const net = assets - liabilities;
  return {
    data: { netCents: net, assetsCents: assets, liabilitiesCents: liabilities },
    summary: `Your net worth is ${formatCents(net, currency)} across ${active.length} account${active.length === 1 ? '' : 's'}.`,
    detail: liabilities > 0 ? `Assets: ${formatCents(assets, currency)} · Liabilities: ${formatCents(liabilities, currency)}.` : undefined,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function todayQuery(input: RunFabricQueryInput): FabricQueryResult {
  const briefing = buildDailyBriefing(
    'morning',
    input.transactions,
    input.commitments,
    input.recurring,
    input.now,
  );
  const { totalTasks, completedTasks, pendingTasks, streakHighlight } = briefing.todayStats;

  let summary: string;
  if (totalTasks === 0) {
    summary = 'No scheduled tasks today — a good day to rest or tackle something new.';
  } else if (pendingTasks === 0) {
    summary = `All ${totalTasks} tasks done for today — great work!`;
  } else {
    summary = `You have ${pendingTasks} task${pendingTasks === 1 ? '' : 's'} remaining today (${completedTasks}/${totalTasks} done).`;
  }

  const todayBills = briefing.upcoming.filter((u) => u.isToday);
  let detail: string | undefined;
  if (todayBills.length > 0) {
    detail = `Due today: ${todayBills.map((u) => u.title).join(', ')}.`;
  } else if (streakHighlight) {
    detail = `Keep your "${streakHighlight.title}" streak going — ${streakHighlight.days} days!`;
  }

  return {
    data: briefing.todayStats,
    summary,
    detail,
    visualizable: false,
    actions: [{ label: 'Open Commitments', type: 'navigate', payload: { page: 'commitments' } }],
  };
}

function upcomingQuery(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const upcoming = getUpcomingItems(input.recurring, input.now);

  if (upcoming.length === 0) {
    return {
      data: [],
      summary: 'No upcoming bills or payments in the next 7 days.',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const lines = upcoming.slice(0, 5).map((item) => {
    const when = item.isToday ? 'today' : item.isTomorrow ? 'tomorrow' : `in ${item.daysUntil} days`;
    const amount = item.amountCents ? ` — ${formatCents(item.amountCents, currency)}` : '';
    return `${item.title} (${when}${amount})`;
  });

  return {
    data: upcoming,
    summary: `${upcoming.length} upcoming payment${upcoming.length === 1 ? '' : 's'} in the next 7 days.`,
    detail: lines.join('\n'),
    visualizable: false,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function planWeek(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const { start: weekStart, end: weekEnd } = getDateRange('this_week', input.now);

  const weekTxns = input.transactions.filter((tx) => {
    const d = toDate(tx.date);
    return !!d && d >= weekStart && d <= weekEnd && !tx.isSoftDeleted;
  });

  const spentCents = weekTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents, 0);
  const incomeCents = weekTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountCents, 0);

  const dailyTasks = input.commitments.filter((t) => t.type === 'daily');
  const completed = dailyTasks.filter((t) => t.completed).length;
  const rate = dailyTasks.length > 0 ? Math.round((completed / dailyTasks.length) * 100) : 0;

  const upcoming = getUpcomingItems(input.recurring, input.now);
  const upcomingThisWeek = upcoming.filter((u) => u.daysUntil <= 6);

  let summary = `This week: ${formatCents(spentCents, currency)} spent`;
  if (incomeCents > 0) summary += `, ${formatCents(incomeCents, currency)} earned`;
  summary += `. Daily habits: ${completed}/${dailyTasks.length} (${rate}%).`;

  const detail = upcomingThisWeek.length > 0
    ? `Coming up: ${upcomingThisWeek.map((u) => {
        const when = u.isToday ? 'today' : u.isTomorrow ? 'tomorrow' : `in ${u.daysUntil}d`;
        return `${u.title} (${when})`;
      }).join(', ')}.`
    : rate >= 80
      ? 'Great momentum — keep your streaks going through the week.'
      : 'Focus on building consistency with your daily habits this week.';

  return {
    data: { spentCents, incomeCents, completedTasks: completed, totalTasks: dailyTasks.length },
    summary,
    detail,
    visualizable: true,
    actions: [
      { label: 'View Commitments', type: 'navigate', payload: { page: 'commitments' } },
      { label: 'View Finance', type: 'navigate', payload: { page: 'finance' } },
    ],
  };
}

function savingsRateQuery(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const { start, end } = getDateRange('this_month', input.now);

  const income = input.transactions
    .filter((tx) => tx.type === 'income' && !tx.isSoftDeleted && withinRange(tx.date, start, end))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  if (income === 0) {
    return {
      data: { incomeCents: 0, expenseCents: 0, savingsRate: 0 },
      summary: 'No income recorded this month yet',
      visualizable: false,
      actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
    };
  }

  const expenses = input.transactions
    .filter((tx) => tx.type === 'expense' && !tx.isSoftDeleted && withinRange(tx.date, start, end))
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const rate = ((income - expenses) / income) * 100;
  const roundedRate = Math.round(rate);

  let detail: string;
  if (roundedRate >= 20) {
    detail = "Solid — you're above the 20% savings benchmark";
  } else if (roundedRate >= 10) {
    detail = 'Decent — aim for 20% to build a meaningful buffer';
  } else if (roundedRate >= 0) {
    detail = "You're saving something, but below the 20% benchmark";
  } else {
    detail = `Expenses exceed income this month by ${formatCents(Math.abs(income - expenses), currency)}`;
  }

  return {
    data: { incomeCents: income, expenseCents: expenses, savingsRate: roundedRate },
    summary: `You're saving ${roundedRate}% of your income this month`,
    detail,
    visualizable: true,
    actions: [{ label: 'Open Finance', type: 'navigate', payload: { page: 'finance' } }],
  };
}

function dayOfWeekQuery(input: RunFabricQueryInput): FabricQueryResult {
  const highSpend = getHighSpendDay(input.transactions, input.now);
  const bestCompletion = getBestCompletionDay(input.commitments, input.now);

  if (!highSpend && !bestCompletion) {
    return {
      data: null,
      summary: 'Not enough data yet — check back after a few months',
      visualizable: false,
      actions: [],
    };
  }

  const lines: string[] = [];
  if (highSpend) {
    lines.push(`${highSpend.dayName} is your highest-spend day`);
  }
  if (bestCompletion) {
    lines.push(`${bestCompletion.dayName} is your strongest completion day`);
  }

  return {
    data: { highSpend, bestCompletion },
    summary: lines.join('; '),
    detail: highSpend && bestCompletion
      ? `You spend most on ${highSpend.dayName}s, while commitment follow-through is strongest on ${bestCompletion.dayName}s.`
      : undefined,
    visualizable: true,
    actions: [{ label: 'Open Dashboard', type: 'navigate', payload: { page: 'dashboard' } }],
  };
}

function correlationQuery(input: RunFabricQueryInput): FabricQueryResult {
  const buckets = buildWeekBuckets(input.transactions, input.commitments, input.now, 12);
  if (buckets.length < 8) {
    return {
      data: null,
      summary: 'Need at least 8 weeks of data to find patterns',
      visualizable: false,
      actions: [],
    };
  }

  const highCompletion = buckets.filter((b) => b.completionRate >= 0.70);
  const lowCompletion = buckets.filter((b) => b.completionRate < 0.50);

  const mean = (arr: number[]): number => arr.reduce((s, v) => s + v, 0) / arr.length;

  if (highCompletion.length >= 3 && lowCompletion.length >= 3) {
    const avgHighSpend = mean(highCompletion.map((b) => b.discretionaryCents));
    const avgLowSpend = mean(lowCompletion.map((b) => b.discretionaryCents));

    if (avgLowSpend > 0) {
      const diff = (avgLowSpend - avgHighSpend) / avgLowSpend;
      const overallMean = mean(buckets.map((b) => b.discretionaryCents));
      const recent8 = buckets.slice(-8);
      const patternHeld = recent8.filter((b) =>
        (b.completionRate >= 0.70 && b.discretionaryCents <= overallMean) ||
        (b.completionRate < 0.50 && b.discretionaryCents >= overallMean),
      ).length;

      if (diff >= 0.15 && patternHeld >= 5) {
        const currency = detectPrimaryCurrency(input.transactions);
        const pct = Math.round(diff * 100);
        return {
          data: {
            buckets: buckets.length,
            avgHighSpend,
            avgLowSpend,
            diffPct: pct,
            patternHeld,
          },
          summary: `In high-completion weeks, discretionary spending is about ${pct}% lower.`,
          detail: `High-completion weeks average ${formatCents(avgHighSpend, currency)} vs ${formatCents(avgLowSpend, currency)} in low-completion weeks. Pattern held in ${patternHeld} of the last 8 weeks.`,
          visualizable: true,
          actions: [{ label: 'Open Dashboard', type: 'navigate', payload: { page: 'dashboard' } }],
        };
      }
    }
  }

  return {
    data: { buckets: buckets.length },
    summary: 'No consistent pattern found yet between your habits and spending — check back in a few weeks',
    visualizable: false,
    actions: [],
  };
}

function momentumQuery(input: RunFabricQueryInput): FabricQueryResult {
  const currency = detectPrimaryCurrency(input.transactions);
  const thisWeek = getDateRange('this_week', input.now);
  const lastWeek = getDateRange('last_week', input.now);

  const completionRateForRange = (start: Date, end: Date): number => {
    const completedCount = input.commitments.filter((task) => {
      const completedAt = ('completedAt' in task ? (task as { completedAt?: Date | string }).completedAt : undefined)
        ?? task.lastCompletedAt;
      if (!completedAt) return false;
      return withinRange(completedAt, start, end);
    }).length;

    const eligibleCount = input.commitments.filter((task) => {
      const created = toDate(task.createdAt ?? null);
      return !created || created <= end;
    }).length;

    if (eligibleCount === 0) return 0;
    return (completedCount / eligibleCount) * 100;
  };

  const sumByType = (type: 'income' | 'expense', start: Date, end: Date): number =>
    input.transactions
      .filter((tx) => tx.type === type && !tx.isSoftDeleted && withinRange(tx.date, start, end))
      .reduce((sum, tx) => sum + tx.amountCents, 0);

  const thisWeekCompletion = completionRateForRange(thisWeek.start, thisWeek.end);
  const lastWeekCompletion = completionRateForRange(lastWeek.start, lastWeek.end);
  const completionDelta = thisWeekCompletion - lastWeekCompletion;

  const thisWeekExpenses = sumByType('expense', thisWeek.start, thisWeek.end);
  const lastWeekExpenses = sumByType('expense', lastWeek.start, lastWeek.end);
  const expenseDeltaPct = lastWeekExpenses === 0
    ? (thisWeekExpenses > 0 ? 100 : 0)
    : ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses) * 100;

  const thisWeekIncome = sumByType('income', thisWeek.start, thisWeek.end);
  const thisWeekNet = thisWeekIncome - thisWeekExpenses;

  const habitsDirection = completionDelta >= 0 ? 'up' : 'down';
  const spendingDirection = expenseDeltaPct >= 0 ? 'up' : 'down';
  const cashFlowDirection = thisWeekNet >= 0 ? 'positive' : 'negative';

  return {
    data: {
      completionDelta,
      expenseDeltaPct,
      thisWeekNetCents: thisWeekNet,
      thisWeekExpenses,
      lastWeekExpenses,
    },
    summary: `This week vs last week: habits ${habitsDirection} ${Math.abs(Math.round(completionDelta))} pp, spending ${spendingDirection} ${Math.abs(Math.round(expenseDeltaPct))}%, net cash flow ${cashFlowDirection}`,
    detail: `This week net cash flow is ${formatCents(thisWeekNet, currency)}.`,
    visualizable: true,
    actions: [{ label: 'Open Dashboard', type: 'navigate', payload: { page: 'dashboard' } }],
  };
}

export function runFabricQuery(input: RunFabricQueryInput): FabricQueryResult {
  const { action } = input.intent;

  if (action === 'query_spending') return spendingSummary(input);
  if (action === 'query_income') return incomeSummary(input);
  if (action === 'query_commitments') return commitmentsSummary(input);
  if (action === 'query_savings_rate') return savingsRateQuery(input);
  if (action === 'query_day_of_week') return dayOfWeekQuery(input);
  if (action === 'query_correlation') return correlationQuery(input);
  if (action === 'query_momentum') return momentumQuery(input);
  if (action === 'query_accounts') return accountsSummary(input);
  if (action === 'query_recurring') return recurringSummary(input);
  if (action === 'query_family') return familySummary(input);
  if (action === 'query_net_worth') return netWorthSummary(input);
  if (action === 'query_today') return todayQuery(input);
  if (action === 'query_upcoming') return upcomingQuery(input);
  if (action === 'plan_week') return planWeek(input);
  if (action === 'summarize_week') return weekSummary(input);

  if (action === 'navigate' && input.intent.entities.page) {
    const page = input.intent.entities.page;
    return {
      data: null,
      summary: `Opening ${page}.`,
      visualizable: false,
      actions: [{ label: `Go to ${page}`, type: 'navigate', payload: { page } }],
    };
  }

  if (action === 'record_expense' || action === 'record_income') {
    const { amount, category } = input.intent.entities;
    return {
      data: { amount, category, type: action === 'record_expense' ? 'expense' : 'income' },
      summary: amount
        ? `Ready to log a${action === 'record_expense' ? 'n expense' : 'n income'} of ${formatCents(Math.round(amount * 100), detectPrimaryCurrency(input.transactions))}${category ? ` in ${category}` : ''}.`
        : `Opening transaction form.`,
      visualizable: false,
      actions: [{ label: 'Add Transaction', type: 'record_transaction', payload: { amount, category } }],
    };
  }

  return {
    data: null,
    summary: "I didn't quite catch that.",
    detail: "Try asking:\n• 'How much did I spend on food this month?'\n• 'What's my savings rate?'\n• 'Which day do I spend the most?'\n• 'How do my habits connect to my spending?'\n• 'How am I trending this week?'",
    visualizable: false,
    actions: [],
  };
}
