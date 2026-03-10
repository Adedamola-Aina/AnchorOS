import type {
  AnchorAccount,
  AnchorTask,
  AnchorTransaction,
  FabricContext,
  FabricQueryResult,
  FabricSettings,
  IFabricService,
  Insight,
  ParsedIntent,
  PatternAction,
  PatternTrigger,
  Prediction,
  RecurringTransaction,
  UserPattern,
  WeeklyReport,
} from '../../types';
import { secureDb } from '../../utils/secureDb';
import { BehavioralEngine } from './BehavioralEngine';
import { getAmbientContext } from './AmbientContext';
import { parseIntent } from './IntentParser';
import { runFabricQuery } from './QueryEngine';
import { buildPredictions } from './PredictionsEngine';
import { buildInsights } from './InsightsEngine';
import { buildWeeklyReport } from './WeeklyReportEngine';
import {
  appendFabricConversation,
  clearFabricData,
  loadDismissedPredictionIds,
  loadFabricActivity,
  persistPredictionState,
  persistWeeklyReport,
} from './fabricPersistence';
import { buildDailyBriefing } from './DailyBriefingEngine';

const SAVE_DEBOUNCE_MS = 500;

export class FabricService implements IFabricService {
  private static instance: FabricService | undefined;
  static getInstance(): FabricService {
    if (!FabricService.instance) FabricService.instance = new FabricService();
    return FabricService.instance;
  }
  static resetForTests(): void { FabricService.instance?.dispose(); FabricService.instance = undefined; }

  private engine = new BehavioralEngine();
  private activeUserId: string | null = null;
  private enabled = false;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private transactions: AnchorTransaction[] = [];
  private commitments: AnchorTask[] = [];
  private accounts: AnchorAccount[] = [];
  private recurring: RecurringTransaction[] = [];
  private predictions: Prediction[] = [];
  private dismissedPredictionIds = new Set<string>();
  /** Dirty flag — predictions are only recomputed when state has changed */
  private predictionsDirty = false;

  private constructor() {}

  isEnabled(): boolean { return this.enabled; }

  async initialize(userId: string): Promise<void> {
    this.activeUserId = userId;

    const settings = await secureDb.getDocument<FabricSettings>(userId, ['fabric_settings', 'state']);
    this.enabled = settings?.enabled === true;

    if (!this.enabled) {
      this.engine.reset();
      return;
    }

    await this.engine.loadBehavior(userId);
    const { transactions, commitments, accounts, recurring } = await loadFabricActivity(userId);
    this.transactions = transactions;
    this.commitments = commitments;
    this.accounts = accounts;
    this.recurring = recurring;
    this.dismissedPredictionIds = await loadDismissedPredictionIds(userId);

    if (this.engine.getPatterns().length === 0) {
      this.engine.seedFromHistory(this.transactions, this.commitments);
      if (this.engine.getPatterns().length > 0) {
        await this.engine.saveBehavior(userId);
      }
    }

    this.recomputePredictions();
  }

  getContext(): FabricContext { return getAmbientContext(); }

  learnFrom(trigger: PatternTrigger, action: PatternAction): void {
    if (!this.enabled || !this.activeUserId) return;
    this.engine.recordAction(trigger, action);
    this.predictionsDirty = true;
    this.scheduleSave();
  }

  /**
   * Push updated data from real-time listeners into the service so insights
   * and predictions always reflect the latest state.
   */
  updateActivity(
    transactions: AnchorTransaction[],
    commitments: AnchorTask[],
    accounts: AnchorAccount[],
    recurring: RecurringTransaction[],
  ): void {
    this.transactions = transactions;
    this.commitments = commitments;
    this.accounts = accounts;
    this.recurring = recurring;
    this.predictionsDirty = true;
  }

  getPatterns(): UserPattern[] { return this.engine.getPatterns(); }
  getConfirmedPatterns(): UserPattern[] { return this.engine.getConfirmedPatterns(); }

  dismissPattern(patternId: string): void {
    if (!this.enabled || !this.activeUserId) return;
    this.engine.dismissPattern(patternId);
    this.scheduleSave();
  }

  deletePattern(patternId: string): void {
    if (!this.enabled || !this.activeUserId) return;
    this.engine.deletePattern(patternId);
    this.scheduleSave();
  }

  async clearAllData(): Promise<void> {
    if (!this.activeUserId) return;

    const now = new Date().toISOString();
    await clearFabricData(this.activeUserId, this.enabled, now);

    this.engine.reset();
    this.predictions = [];
    this.dismissedPredictionIds.clear();
  }

  getPredictions(): Prediction[] {
    if (this.predictionsDirty) {
      this.recomputePredictions();
      this.predictionsDirty = false;
    }
    return [...this.predictions];
  }

  dismissPrediction(predictionId: string): void {
    if (!this.activeUserId) return;
    this.dismissedPredictionIds.add(predictionId);
    this.predictions = this.predictions.filter((p) => p.id !== predictionId);
    void persistPredictionState(this.activeUserId, this.predictions, this.dismissedPredictionIds);
  }

  getInsightsFor(feature: 'dashboard' | 'commitments' | 'finance' | 'family'): Insight[] {
    return buildInsights({
      feature,
      transactions: this.transactions,
      commitments: this.commitments,
      recurring: this.recurring,
      now: new Date(),
    });
  }

  getBriefing() {
    return buildDailyBriefing(
      this.getContext().timeOfDay,
      this.transactions,
      this.commitments,
      this.recurring,
      new Date(),
    );
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    if (!this.activeUserId) {
      throw new Error('Fabric service is not initialized for a user.');
    }

    const now = new Date();
    const report = buildWeeklyReport({
      transactions: this.transactions,
      commitments: this.commitments,
      now,
    });
    await persistWeeklyReport(this.activeUserId, report);
    return report;
  }

  parseIntent(input: string): ParsedIntent { return parseIntent(input); }

  async query(input: string): Promise<FabricQueryResult> {
    const intent = this.parseIntent(input);

    const result = runFabricQuery({
      intent,
      input,
      transactions: this.transactions,
      commitments: this.commitments,
      accounts: this.accounts,
      recurring: this.recurring,
      now: new Date(),
    });

    if (this.activeUserId && this.enabled) {
      await appendFabricConversation(this.activeUserId, input, result.summary);
    }
    return result;
  }

  dispose(): void {
    if (!this.saveTimer) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = null;
  }

  private scheduleSave(): void {
    if (!this.activeUserId) return;
    if (this.saveTimer) clearTimeout(this.saveTimer);

    this.saveTimer = setTimeout(async () => {
      if (!this.activeUserId) return;
      await this.engine.saveBehavior(this.activeUserId);
      this.predictionsDirty = true;
      this.saveTimer = null;
    }, SAVE_DEBOUNCE_MS);
  }

  private recomputePredictions(): void {
    if (!this.enabled) { this.predictions = []; return; }
    const computed = buildPredictions({
      patterns: this.engine.getPatterns(),
      transactions: this.transactions,
      commitments: this.commitments,
      now: new Date(),
    });
    this.predictions = computed.filter((item) => !this.dismissedPredictionIds.has(item.id));
  }
}
