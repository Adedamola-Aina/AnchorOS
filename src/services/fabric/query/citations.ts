/**
 * AI-11 — grounding invariants.
 *
 * Every answer that states a number about the user's records carries citations,
 * derived here in one place from the same inputs the answer used. Deriving them
 * centrally (rather than inside each query) is what makes the invariant
 * enforceable: a new query type cannot be added without appearing in this map,
 * and the test iterates the map.
 *
 * The `today` citation is deliberately computed with the *page's* definition of
 * "today" (commitmentSchedule.getDueToday), so the assistant cannot report a
 * different number from the Commitments page.
 */

import type { FabricQueryResult, QueryCitation } from '../../../types';
import { getDueToday } from '../commitmentSchedule';
import { formatPeriodLabel, getDateRange, toDate } from '../fabricUtils';
import type { RunFabricQueryInput } from './types';

/** Actions that claim nothing about the user's records, so they cite nothing. */
export const UNCITED_ACTIONS = ['navigate', 'record_expense', 'record_income', 'unknown'] as const;

export function deriveCitations(input: RunFabricQueryInput): QueryCitation[] | undefined {
  const { action } = input.intent;
  const period = formatPeriodLabel(input.intent.entities.timePeriod);
  const range = getDateRange(input.intent.entities.timePeriod, input.now);
  const live = input.transactions.filter((tx) => !tx.isSoftDeleted);
  const inRange = live.filter((tx) => {
    const date = toDate(tx.date);
    return !!date && date >= range.start && date <= range.end;
  });
  const expenses = inRange.filter((tx) => tx.type === 'expense');
  const incomes = inRange.filter((tx) => tx.type === 'income');

  switch (action) {
    case 'query_spending':
      return [{
        label: 'Expense transactions',
        count: expenses.length,
        window: period,
        basis: 'Summed from your ledger; soft-deleted transactions are excluded.',
      }];
    case 'query_income':
      return [{
        label: 'Income transactions',
        count: incomes.length,
        window: period,
        basis: 'Summed from your ledger; soft-deleted transactions are excluded.',
      }];
    case 'query_savings_rate':
      return [{
        label: 'Transactions',
        count: inRange.length,
        window: period,
        basis: 'Savings rate = (income − expenses) ÷ income, on the transactions above.',
      }];
    case 'query_day_of_week':
      return [{
        label: 'Expense transactions',
        count: expenses.length,
        window: period,
        basis: 'Grouped by weekday and averaged, so a single large day does not dominate.',
      }];
    case 'query_correlation':
      return [{
        label: 'Transactions compared against your commitments',
        count: inRange.length,
        window: period,
        basis: 'Correlation of daily spend against daily completion — an association, not a cause.',
      }];
    case 'query_momentum':
      return [{
        label: 'Completed commitments',
        count: input.commitments.filter((task) => task.completed).length,
        basis: 'Momentum is the recent completion trend, not the all-time total.',
      }];
    case 'query_commitments':
      return [{
        label: 'Commitments',
        count: input.commitments.length,
        window: period,
        basis: 'Completion rate = completed ÷ total commitments.',
      }];
    case 'query_accounts':
    case 'query_net_worth':
      return [{
        label: 'Accounts',
        count: input.accounts.length,
        basis: 'Balances are summed exactly as stored on your accounts.',
      }];
    case 'query_recurring':
      return [{
        label: 'Recurring payments',
        count: input.recurring.length,
        basis: 'Next due dates are derived from your recurring rules.',
      }];
    case 'query_family':
      return [{
        label: 'Shared accounts and commitments',
        count: input.commitments.filter((task) => task.category === 'family').length,
        basis: 'Only records shared with your family connection are counted.',
      }];
    case 'query_today':
      // The page's definition of "today" — scheduled today or carried over.
      return [{
        label: 'Commitments due today or carried over',
        count: getDueToday(input.commitments, input.now).length,
        window: 'today',
        basis: 'The same "today" the Commitments page uses: scheduled today, or still owed from an earlier day.',
      }];
    case 'query_upcoming':
      return [{
        label: 'Recurring payments due in the next 7 days',
        count: input.recurring.length,
        window: 'next 7 days',
        basis: 'Due dates come from your recurring rules.',
      }];
    case 'plan_week':
    case 'summarize_week':
      return [
        {
          label: 'Transactions this week',
          count: inRange.length,
          window: 'this week',
          basis: 'Spent and earned are summed over this week only.',
        },
        {
          label: 'Commitments',
          count: input.commitments.length,
          window: 'this week',
          basis: 'Completed ÷ total commitments you track.',
        },
      ];
    case 'query_scenario':
      return [{
        label: 'Your recent transactions',
        count: live.length,
        basis: 'A projection from your own spending pattern — an estimate, not a promise.',
      }];
    default:
      return undefined;
  }
}

/** Attaches the citations without mutating the query result. */
export function withCitations(
  result: FabricQueryResult,
  citations: QueryCitation[] | undefined,
): FabricQueryResult {
  if (!citations || citations.length === 0) return result;
  return { ...result, citations };
}
