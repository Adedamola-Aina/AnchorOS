import type { FabricQuickAction, Insight } from './fabric';

export interface Prediction {
  id: string;
  type: PredictionType;
  message: string;
  detail?: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  actionable: boolean;
  action?: PredictionAction;
  expiresAt: string;
  createdAt: string;
}

export type PredictionType =
  | 'budget_overage'
  | 'streak_at_risk'
  | 'recurring_due'
  | 'cash_flow_alert'
  | 'unusual_spending'
  | 'commitment_reminder'
  | 'goal_on_track'
  | 'goal_at_risk';

export interface PredictionAction {
  label: string;
  navigateTo?: string;
  prefill?: Record<string, unknown>;
}

export interface ParsedIntent {
  action: IntentAction;
  confidence: number;
  entities: IntentEntities;
  rawInput: string;
}

export type IntentAction =
  | 'record_expense'
  | 'record_income'
  | 'create_commitment'
  | 'query_spending'
  | 'query_income'
  | 'query_commitments'
  | 'query_savings_rate'
  | 'query_day_of_week'
  | 'query_correlation'
  | 'query_momentum'
  | 'query_accounts'
  | 'query_recurring'
  | 'query_family'
  | 'query_net_worth'
  | 'query_today'
  | 'query_upcoming'
  | 'query_scenario'
  | 'plan_week'
  | 'summarize_week'
  | 'navigate'
  | 'unknown';

export interface IntentEntities {
  amount?: number;
  currency?: 'USD' | 'NGN';
  category?: string;
  title?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  /**
   * Named or dynamic time period.
   * Named: today | yesterday | this_week | last_week | this_month | last_month | this_year | last_year
   * Dynamic: month_YYYY_MM | last_N_months | last_N_days | last_N_weeks | year_YYYY
   */
  timePeriod?: string;
  page?: string;
}

/**
 * AI-11 / AI-15 — the records behind an answer.
 *
 * Every sentence the assistant produces must be traceable to records the user
 * owns. A citation names the records, how many there were, the window they were
 * read from, and the basis of the arithmetic — which is what "why I said this"
 * means in practice.
 */
export interface QueryCitation {
  /** What was read, e.g. "Expense transactions". */
  label: string;
  /** How many records the statement was computed from. */
  count: number;
  /** The window, e.g. "this month" — omitted when the answer is not time-bound. */
  window?: string;
  /** The basis of the arithmetic, so the number can be checked by hand. */
  basis: string;
}

export interface FabricQueryResult {
  data: unknown;
  summary: string;
  detail?: string;
  visualizable: boolean;
  actions?: FabricQuickAction[];
  /**
   * AI-11: the grounding invariant. Present for every answer that states a
   * number about the user's records; absent only for answers that claim nothing
   * (navigation, a fallback, or a recording confirmation).
   */
  citations?: QueryCitation[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  insights: Insight[];
  commitmentSummary: {
    completed: number;
    skipped: number;
    missed: number;
    completionRate: number;
    bestCategory: string;
    worstCategory: string;
    longestStreak: { name: string; days: number };
  };
  financeSummary: {
    totalSpent: number;
    totalIncome: number;
    netCashFlow: number;
    topCategory: { name: string; amount: number };
    vsLastWeek: number;
  };
  generatedAt: string;
  /** ISO 4217 currency code detected from the user's transactions */
  currency?: string;
}

