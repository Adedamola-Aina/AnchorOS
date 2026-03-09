import type { AnchorTask, AnchorTransaction, FabricMessage, Prediction, WeeklyReport } from '../../types';
import { secureDb } from '../../utils/secureDb';

export async function loadFabricActivity(userId: string): Promise<{ transactions: AnchorTransaction[]; commitments: AnchorTask[] }> {
  const [transactions, commitments] = await Promise.all([
    secureDb.queryCollection<AnchorTransaction>(userId, 'finance', []),
    secureDb.queryCollection<AnchorTask>(userId, 'commitments', []),
  ]);
  return { transactions, commitments };
}

export async function loadDismissedPredictionIds(userId: string): Promise<Set<string>> {
  const state = await secureDb.getDocument<{ dismissedIds?: string[] }>(userId, ['fabric_predictions', 'state']);
  return new Set(state?.dismissedIds ?? []);
}

export async function persistPredictionState(
  userId: string,
  predictions: Prediction[],
  dismissedPredictionIds: Set<string>
): Promise<void> {
  await secureDb.setDocument(userId, ['fabric_predictions', 'state'], {
    active: predictions,
    dismissedIds: [...dismissedPredictionIds],
    updatedAt: new Date().toISOString(),
  });
}

export async function persistWeeklyReport(userId: string, report: WeeklyReport): Promise<void> {
  const weekKey = report.weekStart.slice(0, 10);
  await secureDb.setDocument(userId, ['fabric_reports', weekKey], report as unknown as Record<string, unknown>);
}

export async function clearFabricData(userId: string, enabled: boolean, nowIso: string): Promise<void> {
  await Promise.all([
    secureDb.setDocument(userId, ['fabric_behavior', 'state'], {
      patterns: [],
      confirmedPatterns: [],
      recentActions: [],
      dismissedPatterns: [],
      updatedAt: nowIso,
    }),
    secureDb.setDocument(userId, ['fabric_predictions', 'state'], {
      active: [],
      dismissedIds: [],
      updatedAt: nowIso,
    }),
    secureDb.setDocument(userId, ['fabric_settings', 'state'], {
      enabled,
      dataCollectionEnabled: enabled,
      lastCleared: nowIso,
    }),
  ]);
}

export async function appendFabricConversation(userId: string, userMessage: string, assistantMessage: string): Promise<void> {
  const dateKey = new Date().toISOString().slice(0, 10);
  const existing = await secureDb.getDocument<{ messages?: FabricMessage[]; startedAt?: string }>(userId, ['fabric_conversations', dateKey]);
  const nowIso = new Date().toISOString();
  const userEntry: FabricMessage = { id: `u-${Date.now()}`, role: 'user', content: userMessage, timestamp: nowIso };
  const fabricEntry: FabricMessage = { id: `f-${Date.now() + 1}`, role: 'fabric', content: assistantMessage, timestamp: nowIso };

  const messages: FabricMessage[] = [
    ...(existing?.messages ?? []),
    userEntry,
    fabricEntry,
  ].slice(-50);

  await secureDb.setDocument(userId, ['fabric_conversations', dateKey], {
    messages,
    startedAt: existing?.startedAt ?? nowIso,
    updatedAt: nowIso,
  });
}
