import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  FabricSettings,
  RecurringTransaction,
} from '../../types';
import { secureDb } from '../../utils/secureDb';
import { loadDismissedPredictionIds, loadFabricActivity } from './fabricPersistence';
import type { BehavioralEngine } from './BehavioralEngine';

export interface FabricInitializedState {
  enabled: boolean;
  userTimezone: string | undefined;
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  accounts: AnchorAccount[];
  recurring: RecurringTransaction[];
  dismissedPredictionIds: Set<string>;
}

export async function initializeFabricState(
  userId: string,
  engine: BehavioralEngine,
): Promise<FabricInitializedState> {
  const settings = await secureDb.getDocument<FabricSettings>(userId, ['fabric_settings', 'state']);
  const enabled = settings?.enabled === true;

  const profile = await secureDb.getDocument<{ timezone?: string }>(userId, []);
  const userTimezone = profile?.timezone;

  if (!enabled) {
    engine.reset();
    return {
      enabled,
      userTimezone,
      transactions: [],
      commitments: [],
      accounts: [],
      recurring: [],
      dismissedPredictionIds: new Set<string>(),
    };
  }

  await engine.loadBehavior(userId);
  const { transactions, commitments, accounts, recurring } = await loadFabricActivity(userId);
  const dismissedPredictionIds = await loadDismissedPredictionIds(userId);

  if (engine.getPatterns().length === 0) {
    engine.seedFromHistory(transactions, commitments);
    if (engine.getPatterns().length > 0) {
      await engine.saveBehavior(userId);
    }
  }

  return {
    enabled,
    userTimezone,
    transactions,
    commitments,
    accounts,
    recurring,
    dismissedPredictionIds,
  };
}
