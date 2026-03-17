import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  FabricQueryResult,
  Insight,
  ParsedIntent,
  Prediction,
  RecurringTransaction,
  WeeklyReport,
} from '../../types';
import type { BehavioralEngine } from './BehavioralEngine';
import { runFabricQuery } from './QueryEngine';
import { buildPredictions } from './PredictionsEngine';
import { buildInsights } from './InsightsEngine';
import { buildWeeklyReport } from './WeeklyReportEngine';
import { appendFabricConversation, persistWeeklyReport } from './fabricPersistence';
import { buildDailyBriefing } from './DailyBriefingEngine';

export function buildServiceInsights(
  feature: 'dashboard' | 'commitments' | 'finance' | 'family',
  transactions: AnchorTransaction[],
  commitments: AnchorTask[],
  recurring: RecurringTransaction[],
): Insight[] {
  return buildInsights({
    feature,
    transactions,
    commitments,
    recurring,
    now: new Date(),
  });
}

export function buildServiceBriefing(
  timeOfDay: 'morning' | 'afternoon' | 'evening',
  transactions: AnchorTransaction[],
  commitments: AnchorTask[],
  recurring: RecurringTransaction[],
) {
  return buildDailyBriefing(
    timeOfDay,
    transactions,
    commitments,
    recurring,
    new Date(),
  );
}

export async function generateWeeklyReportForUser(
  userId: string,
  transactions: AnchorTransaction[],
  commitments: AnchorTask[],
): Promise<WeeklyReport> {
  const now = new Date();
  const report = buildWeeklyReport({ transactions, commitments, now });
  await persistWeeklyReport(userId, report);
  return report;
}

export async function runQueryAndPersistConversation(input: {
  rawInput: string;
  intent: ParsedIntent;
  userId: string | null;
  enabled: boolean;
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  accounts: AnchorAccount[];
  recurring: RecurringTransaction[];
}): Promise<FabricQueryResult> {
  const result = runFabricQuery({
    intent: input.intent,
    input: input.rawInput,
    transactions: input.transactions,
    commitments: input.commitments,
    accounts: input.accounts,
    recurring: input.recurring,
    now: new Date(),
  });

  if (input.userId && input.enabled) {
    await appendFabricConversation(input.userId, input.rawInput, result.summary);
  }
  return result;
}

export function recomputeServicePredictions(input: {
  enabled: boolean;
  engine: BehavioralEngine;
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  dismissedPredictionIds: Set<string>;
}): Prediction[] {
  if (!input.enabled) return [];

  const computed = buildPredictions({
    patterns: input.engine.getPatterns(),
    transactions: input.transactions,
    commitments: input.commitments,
    now: new Date(),
  });

  return computed.filter((item) => !input.dismissedPredictionIds.has(item.id));
}
