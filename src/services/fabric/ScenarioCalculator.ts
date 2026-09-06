import type { AnchorTransaction } from '../../types';
import { getDateRange, withinRange } from './fabricUtils';

interface ScenarioInput {
  transactions: AnchorTransaction[];
  reduceCategory?: string;
  reducePercent: number;
  projectionMonths?: number;
  now: Date;
}

interface ScenarioResult {
  baseline: {
    monthlyExpenseCents: number;
    monthlyIncomeCents: number;
    monthlySavingsCents: number;
  };
  projected: {
    monthlyExpenseCents: number;
    monthlyIncomeCents: number;
    monthlySavingsCents: number;
  };
  savingsOverPeriodCents: number;
  projectionMonths: number;
  reduceCategory: string | undefined;
  reducePercent: number;
}

export function calculateScenario(input: ScenarioInput): ScenarioResult {
  const { transactions, reduceCategory, reducePercent, now } = input;
  const projectionMonths = input.projectionMonths ?? 3;

  const { start, end } = getDateRange('last_month', now);
  const lastMonthTxns = transactions.filter((tx) => !tx.isSoftDeleted && withinRange(tx.date, start, end));

  const income = lastMonthTxns
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amountCents, 0);

  const expenses = lastMonthTxns.filter((tx) => tx.type === 'expense');
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amountCents, 0);

  const factor = reducePercent / 100;

  let projectedExpense: number;
  if (reduceCategory) {
    const categoryExpense = expenses
      .filter((tx) => tx.category === reduceCategory)
      .reduce((sum, tx) => sum + tx.amountCents, 0);
    const otherExpense = totalExpense - categoryExpense;
    projectedExpense = otherExpense + Math.round(categoryExpense * (1 - factor));
  } else {
    projectedExpense = Math.round(totalExpense * (1 - factor));
  }

  const monthlySaved = totalExpense - projectedExpense;

  return {
    baseline: {
      monthlyExpenseCents: totalExpense,
      monthlyIncomeCents: income,
      monthlySavingsCents: income - totalExpense,
    },
    projected: {
      monthlyExpenseCents: projectedExpense,
      monthlyIncomeCents: income,
      monthlySavingsCents: income - projectedExpense,
    },
    savingsOverPeriodCents: monthlySaved * projectionMonths,
    projectionMonths,
    reduceCategory,
    reducePercent,
  };
}
