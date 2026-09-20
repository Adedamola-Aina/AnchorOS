import type { FabricQueryResult } from '../../types';
import { commitmentsSummary, weekSummary } from './query/commitmentQueries';
import {
  accountsSummary,
  familySummary,
  incomeSummary,
  netWorthSummary,
  recordTransactionQuery,
  recurringSummary,
  spendingSummary,
} from './query/financeQueries';
import { fallbackQuery, navigateQuery } from './query/generalQueries';
import { correlationQuery, dayOfWeekQuery, savingsRateQuery } from './query/insightQueries';
import { momentumQuery } from './query/momentumQueries';
import { planWeek, todayQuery, upcomingQuery } from './query/planningQueries';
import { scenarioQuery } from './query/scenarioQueries';
import type { RunFabricQueryInput } from './query/types';
import { deriveCitations, withCitations } from './query/citations';

/**
 * AI-11: every answer that states a number about the user's records carries
 * citations. Attaching them here — once, after dispatch — means a query cannot
 * be added without them, and the invariant test can iterate the action map.
 */
export function runFabricQuery(input: RunFabricQueryInput): FabricQueryResult {
  return withCitations(dispatchQuery(input), deriveCitations(input));
}

function dispatchQuery(input: RunFabricQueryInput): FabricQueryResult {
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
  if (action === 'query_scenario') return scenarioQuery(input);

  if (action === 'navigate' && input.intent.entities.page) {
    return navigateQuery(input.intent);
  }

  if (action === 'record_expense' || action === 'record_income') {
    return recordTransactionQuery(input);
  }

  if (action === 'unknown' && input.intent.entities.amount) {
    return recordTransactionQuery({
      ...input,
      intent: { ...input.intent, action: 'record_expense' },
    });
  }

  return fallbackQuery();
}

