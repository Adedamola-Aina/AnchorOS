import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  ProactiveQuestionState,
  ProactiveQuestionType,
  UserPattern,
} from '../../types';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const SPIKE_THRESHOLD = 1.5;
const SURPLUS_THRESHOLD_CENTS = 50_000_00; // 50,000 in cents

interface ProactiveQuestionInput {
  patterns: UserPattern[];
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  accounts: AnchorAccount[];
  now: Date;
}

interface ProactiveQuestionResult {
  question: string;
  questionType: ProactiveQuestionType;
}

export function wasQuestionShownRecently(
  lastState: ProactiveQuestionState | null,
  questionType: ProactiveQuestionType,
  now: Date,
): boolean {
  if (!lastState) return false;
  if (lastState.questionType !== questionType) return false;
  const elapsed = now.getTime() - new Date(lastState.shownAt).getTime();
  return elapsed < SEVEN_DAYS_MS;
}

export function generateProactiveQuestion(
  input: ProactiveQuestionInput,
  lastState: ProactiveQuestionState | null,
): ProactiveQuestionResult | null {
  return (
    checkMissedHabit(input, lastState) ??
    checkCompletionDrop(input, lastState) ??
    checkCategorySpike(input, lastState) ??
    checkSurplusIdle(input, lastState) ??
    null
  );
}

function checkMissedHabit(
  { patterns, now }: ProactiveQuestionInput,
  lastState: ProactiveQuestionState | null,
): ProactiveQuestionResult | null {
  if (wasQuestionShownRecently(lastState, 'missed_habit', now)) return null;

  const confirmed = patterns.filter((p) => p.confidence >= 0.6);
  for (const pattern of confirmed) {
    const elapsed = now.getTime() - new Date(pattern.lastOccurred).getTime();
    if (elapsed > THREE_DAYS_MS) {
      const actionLabel = pattern.followUpAction.type.replace(/_/g, ' ');
      return {
        question: `You usually ${actionLabel}. It's been a few days — would you like to do that now?`,
        questionType: 'missed_habit',
      };
    }
  }
  return null;
}

function checkCompletionDrop(
  { commitments, now }: ProactiveQuestionInput,
  lastState: ProactiveQuestionState | null,
): ProactiveQuestionResult | null {
  if (wasQuestionShownRecently(lastState, 'completion_drop', now)) return null;
  if (commitments.length === 0) return null;

  const sevenDaysAgo = now.getTime() - SEVEN_DAYS_MS;
  const fourteenDaysAgo = now.getTime() - 2 * SEVEN_DAYS_MS;

  let recentCompleted = 0;
  let priorCompleted = 0;

  for (const c of commitments) {
    if (!c.lastCompletedAt) continue;
    const ts = new Date(c.lastCompletedAt).getTime();
    if (ts >= sevenDaysAgo) recentCompleted++;
    else if (ts >= fourteenDaysAgo) priorCompleted++;
  }

  if (priorCompleted >= 2 && recentCompleted < priorCompleted * 0.5) {
    return {
      question: 'Your commitment completion has dropped recently. Would you like to review them?',
      questionType: 'completion_drop',
    };
  }
  return null;
}

function checkCategorySpike(
  { transactions, now }: ProactiveQuestionInput,
  lastState: ProactiveQuestionState | null,
): ProactiveQuestionResult | null {
  if (wasQuestionShownRecently(lastState, 'category_spike', now)) return null;

  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return null;

  const sevenDaysAgo = now.getTime() - SEVEN_DAYS_MS;
  const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

  const recentByCategory = new Map<string, number>();
  const priorByCategory = new Map<string, number>();

  for (const tx of expenses) {
    const txDate = new Date(typeof tx.date === 'string' ? tx.date : tx.date).getTime();
    if (txDate >= sevenDaysAgo) {
      recentByCategory.set(tx.category, (recentByCategory.get(tx.category) ?? 0) + tx.amountCents);
    } else if (txDate >= thirtyDaysAgo) {
      priorByCategory.set(tx.category, (priorByCategory.get(tx.category) ?? 0) + tx.amountCents);
    }
  }

  for (const [category, recentTotal] of recentByCategory) {
    const priorTotal = priorByCategory.get(category) ?? 0;
    // Normalize prior to weekly average (prior covers ~23 days: day 8-30)
    const priorWeeks = 23 / 7;
    const weeklyAvg = priorTotal / priorWeeks;
    if (weeklyAvg > 0 && recentTotal > weeklyAvg * SPIKE_THRESHOLD) {
      return {
        question: `Spending in ${category} is higher than usual this week. Want to take a look?`,
        questionType: 'category_spike',
      };
    }
  }
  return null;
}

function checkSurplusIdle(
  { accounts, transactions, now }: ProactiveQuestionInput,
  lastState: ProactiveQuestionState | null,
): ProactiveQuestionResult | null {
  if (wasQuestionShownRecently(lastState, 'surplus_idle', now)) return null;

  const totalBalance = accounts.reduce((sum, a) => sum + a.balanceCents, 0);
  if (totalBalance < SURPLUS_THRESHOLD_CENTS) return null;

  // Check if there are any recent savings-related transactions (last 14 days)
  const fourteenDaysAgo = now.getTime() - 2 * SEVEN_DAYS_MS;
  const hasSavingsActivity = transactions.some((tx) => {
    const txDate = new Date(typeof tx.date === 'string' ? tx.date : tx.date).getTime();
    return txDate >= fourteenDaysAgo && tx.type === 'income' && /saving|invest/i.test(tx.category);
  });

  if (!hasSavingsActivity) {
    return {
      question: 'You have surplus funds available. Would you like to set a savings goal?',
      questionType: 'surplus_idle',
    };
  }
  return null;
}
