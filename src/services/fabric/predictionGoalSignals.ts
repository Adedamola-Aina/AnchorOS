import type { AnchorGoal, Prediction } from '../../types';
import { formatCents } from './fabricUtils';
import { nextIso } from './predictionCommon';
import type { PredictionInput } from './predictionTypes';

const MAX_GOAL_SIGNALS = 3;

export function buildGoalSignals(input: PredictionInput): Prediction[] {
  const { goals, transactions, now } = input;
  if (!goals || goals.length === 0) return [];

  const monthlySavings = estimateMonthlySavings(transactions, now);

  const signals: Prediction[] = [];

  for (const goal of goals) {
    if (!goal.targetDate) continue;
    const remaining = goal.targetAmountCents - goal.currentAmountCents;
    if (remaining <= 0) continue;

    const targetDate = new Date(goal.targetDate);
    const monthsLeft = monthsBetween(now, targetDate);
    if (monthsLeft <= 0) continue;

    const requiredPerMonth = remaining / monthsLeft;
    const onTrack = monthlySavings >= requiredPerMonth;
    const estimatedMonths = monthlySavings > 0
      ? Math.ceil(remaining / monthlySavings)
      : Infinity;

    const confidence = onTrack
      ? Math.min(0.6 + (monthlySavings / requiredPerMonth - 1) * 0.2, 0.95)
      : Math.min(0.5 + (1 - monthlySavings / requiredPerMonth) * 0.2, 0.9);

    signals.push(buildGoalPrediction(goal, onTrack, estimatedMonths, confidence, now));
  }

  return signals
    .sort((a, b) => {
      if (a.type === 'goal_at_risk' && b.type !== 'goal_at_risk') return -1;
      if (b.type === 'goal_at_risk' && a.type !== 'goal_at_risk') return 1;
      return b.confidence - a.confidence;
    })
    .slice(0, MAX_GOAL_SIGNALS);
}

function buildGoalPrediction(
  goal: AnchorGoal,
  onTrack: boolean,
  estimatedMonths: number,
  confidence: number,
  now: Date,
): Prediction {
  const remaining = goal.targetAmountCents - goal.currentAmountCents;
  const formatted = formatCents(remaining, goal.currency);

  if (onTrack) {
    return {
      id: `pred-goal-track-${goal.id}`,
      type: 'goal_on_track',
      message: `"${goal.title}" is on track.`,
      detail: `${formatted} remaining — estimated ${estimatedMonths} month${estimatedMonths === 1 ? '' : 's'} to goal.`,
      severity: 'info',
      confidence,
      actionable: false,
      expiresAt: nextIso(now, 14),
      createdAt: now.toISOString(),
    };
  }

  return {
    id: `pred-goal-risk-${goal.id}`,
    type: 'goal_at_risk',
    message: `"${goal.title}" may miss its target date.`,
    detail: `${formatted} remaining — at current pace, ~${estimatedMonths === Infinity ? '∞' : estimatedMonths} month${estimatedMonths === 1 ? '' : 's'} needed vs target.`,
    severity: 'warning',
    confidence,
    actionable: true,
    action: { label: 'Review goal', navigateTo: '/finance' },
    expiresAt: nextIso(now, 7),
    createdAt: now.toISOString(),
  };
}

function estimateMonthlySavings(
  transactions: PredictionInput['transactions'],
  now: Date,
): number {
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const income = transactions
    .filter((tx) => {
      if (tx.type !== 'income' || tx.isSoftDeleted) return false;
      const d = new Date(tx.date);
      return d >= lastMonth && d <= lastMonthEnd;
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const expenses = transactions
    .filter((tx) => {
      if (tx.type !== 'expense' || tx.isSoftDeleted) return false;
      const d = new Date(tx.date);
      return d >= lastMonth && d <= lastMonthEnd;
    })
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  return Math.max(income - expenses, 0);
}

function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}
