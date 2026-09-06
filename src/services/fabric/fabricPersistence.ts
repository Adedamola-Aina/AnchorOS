import type { AnchorAccount, AnchorTask, AnchorTransaction, FabricMessage, Prediction, RecurringTransaction, WeeklyReport } from '../../types';
import type { MonthlyReview } from './MonthlyReviewEngine';
import { APP_ID } from '../../config/firebase';
import { secureDb } from '../../utils/secureDb';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from '../../utils/secureDb';

async function loadRecurringRules(userId: string): Promise<RecurringTransaction[]> {
  try {
    const recurringSnap = await getDocs(query(
      collection(db, 'artifacts', APP_ID, 'recurring_transactions'),
      where('userId', '==', userId),
    ));
    return recurringSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RecurringTransaction));
  } catch {
    return [];
  }
}

export async function loadFabricActivity(userId: string): Promise<{
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  accounts: AnchorAccount[];
  recurring: RecurringTransaction[];
}> {
  const [transactions, commitments, accounts, recurring] = await Promise.all([
    secureDb.queryCollection<AnchorTransaction>(userId, 'finance', []),
    secureDb.queryCollection<AnchorTask>(userId, 'commitments', []),
    secureDb.queryCollection<AnchorAccount>(userId, 'accounts', []),
    loadRecurringRules(userId),
  ]);
  return { transactions, commitments, accounts, recurring };
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

export async function loadRecentConversationMessages(userId: string, maxMessages: number): Promise<FabricMessage[]> {
  const dateKey = new Date().toISOString().slice(0, 10);
  const existing = await secureDb.getDocument<{ messages?: FabricMessage[] }>(userId, ['fabric_conversations', dateKey]);
  const messages = existing?.messages ?? [];
  return messages.slice(-maxMessages);
}

export async function appendFabricConversation(userId: string, userMessage: string, assistantMessage: string): Promise<void> {
  const dateKey = new Date().toISOString().slice(0, 10);
  const existing = await secureDb.getDocument<{ messages?: FabricMessage[]; startedAt?: string }>(userId, ['fabric_conversations', dateKey]);
  const nowIso = new Date().toISOString();
  const userEntry: FabricMessage = { id: crypto.randomUUID(), role: 'user', content: userMessage, timestamp: nowIso };
  const fabricEntry: FabricMessage = { id: crypto.randomUUID(), role: 'fabric', content: assistantMessage, timestamp: nowIso };

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

interface MonthlyReflection {
  month: string;
  review: MonthlyReview;
  answers: Record<string, string>;
  savedAt: string;
}

export async function loadMonthlyReflection(userId: string, month: string): Promise<MonthlyReflection | null> {
  const doc = await secureDb.getDocument<MonthlyReflection>(userId, ['fabric_monthly_reviews', month]);
  return doc ?? null;
}
