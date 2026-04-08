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
  if (action === 'query_scenario') return scenarioQuery(input);

  if (action === 'navigate' && input.intent.entities.page) {
    return navigateQuery(input.intent);
  }

  if (action === 'record_expense' || action === 'record_income') {
    return recordTransactionQuery(input);
  }

  return fallbackQuery();
}

export type { RunFabricQueryInput };
