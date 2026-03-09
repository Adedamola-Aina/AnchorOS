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
  | 'commitment_reminder';

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
  | 'query_commitments'
  | 'navigate'
  | 'unknown';

export interface IntentEntities {
  amount?: number;
  currency?: 'USD' | 'NGN';
  category?: string;
  title?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  timePeriod?: 'today' | 'this_week' | 'this_month' | 'last_week' | 'last_month';
  page?: string;
}

export interface FabricQuery {
  intent: IntentAction;
  entities: IntentEntities;
  domain: 'commitments' | 'finance' | 'general' | 'mixed';
  firestoreQuery: {
    collection: string;
    filters: Record<string, unknown>;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface FabricQueryResult {
  data: unknown;
  summary: string;
  detail?: string;
  visualizable: boolean;
  actions?: FabricQuickAction[];
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
}

export interface HouseholdInsight extends Insight {
  householdId: string;
  affectedMembers: string[];
}

export interface HouseholdPattern {
  id: string;
  householdId: string;
  type: 'shared_expense' | 'coordinated_commitment' | 'split_pattern';
  description: string;
  involvedMembers: string[];
  frequency: number;
  lastOccurred: string;
}
