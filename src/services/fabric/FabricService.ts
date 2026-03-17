import type { AnchorAccount, AnchorTask, AnchorTransaction, FabricContext, FabricQueryResult, IFabricService, Insight, ParsedIntent, PatternAction, PatternTrigger, Prediction, ProactiveQuestionState, ProactiveQuestionType, RecurringTransaction, UserPattern, WeeklyReport } from '../../types';
import { BehavioralEngine } from './BehavioralEngine';
import { getAmbientContext } from './AmbientContext';
import { parseIntent } from './IntentParser';
import { clearFabricData, persistPredictionState } from './fabricPersistence';
import { initializeFabricState } from './fabricServiceInitialization';
import { applyPredictionDismissFeedback } from './fabricServicePredictionUtils';
import { getProactiveQuestionText, resolveQuestionShownState } from './fabricServiceQuestionUtils';
import { buildServiceBriefing, buildServiceInsights, generateWeeklyReportForUser, recomputeServicePredictions, runQueryAndPersistConversation } from './fabricServiceRuntime';

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
  private userTimezone: string | undefined;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private transactions: AnchorTransaction[] = [];
  private commitments: AnchorTask[] = [];
  private accounts: AnchorAccount[] = [];
  private recurring: RecurringTransaction[] = [];
  private predictions: Prediction[] = [];
  private dismissedPredictionIds = new Set<string>();
  private predictionsDirty = false;
  private lastQuestionState: ProactiveQuestionState | null = null;

  private constructor() {}

  isEnabled(): boolean { return this.enabled; }
  getContext(): FabricContext { return getAmbientContext(new Date(), this.userTimezone); }
  getPatterns(): UserPattern[] { return this.engine.getPatterns(); }
  getConfirmedPatterns(): UserPattern[] { return this.engine.getConfirmedPatterns(); }
  parseIntent(input: string): ParsedIntent { return parseIntent(input); }

  async initialize(userId: string): Promise<void> {
    this.activeUserId = userId;
    const initialized = await initializeFabricState(userId, this.engine);
    this.enabled = initialized.enabled;
    this.userTimezone = initialized.userTimezone;
    this.transactions = initialized.transactions;
    this.commitments = initialized.commitments;
    this.accounts = initialized.accounts;
    this.recurring = initialized.recurring;
    this.dismissedPredictionIds = initialized.dismissedPredictionIds;
    if (!this.enabled) return;
    this.recomputePredictions();
  }

  learnFrom(trigger: PatternTrigger, action: PatternAction): void {
    if (!this.enabled || !this.activeUserId) return;
    this.engine.recordAction(trigger, action);
    this.predictionsDirty = true;
    this.scheduleSave();
  }

  updateActivity(transactions: AnchorTransaction[], commitments: AnchorTask[], accounts: AnchorAccount[], recurring: RecurringTransaction[]): void {
    this.transactions = transactions;
    this.commitments = commitments;
    this.accounts = accounts;
    this.recurring = recurring;
    this.predictionsDirty = true;
  }

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
    await clearFabricData(this.activeUserId, this.enabled, new Date().toISOString());
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
    if (applyPredictionDismissFeedback(this.engine, this.predictions, predictionId)) this.scheduleSave();
    this.dismissedPredictionIds.add(predictionId);
    this.predictions = this.predictions.filter((p) => p.id !== predictionId);
    void persistPredictionState(this.activeUserId, this.predictions, this.dismissedPredictionIds);
  }

  getInsightsFor(feature: 'dashboard' | 'commitments' | 'finance' | 'family'): Insight[] {
    return buildServiceInsights(feature, this.transactions, this.commitments, this.recurring);
  }

  getBriefing() {
    return buildServiceBriefing(this.getContext().timeOfDay, this.transactions, this.commitments, this.recurring);
  }

  getProactiveQuestion(): string | null {
    if (!this.enabled) return null;
    return getProactiveQuestionText(this.questionContext(), this.lastQuestionState);
  }

  markQuestionShown(question: ProactiveQuestionType | string): void {
    this.lastQuestionState = resolveQuestionShownState(this.questionContext(), question);
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    if (!this.activeUserId) throw new Error('Fabric service is not initialized for a user.');
    return generateWeeklyReportForUser(this.activeUserId, this.transactions, this.commitments);
  }

  async query(input: string): Promise<FabricQueryResult> {
    return runQueryAndPersistConversation({
      rawInput: input,
      intent: this.parseIntent(input),
      userId: this.activeUserId,
      enabled: this.enabled,
      transactions: this.transactions,
      commitments: this.commitments,
      accounts: this.accounts,
      recurring: this.recurring,
    });
  }

  dispose(): void {
    if (!this.saveTimer) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = null;
  }

  private questionContext() {
    return {
      engine: this.engine,
      transactions: this.transactions,
      commitments: this.commitments,
      accounts: this.accounts,
    };
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
    this.predictions = recomputeServicePredictions({
      enabled: this.enabled,
      engine: this.engine,
      transactions: this.transactions,
      commitments: this.commitments,
      dismissedPredictionIds: this.dismissedPredictionIds,
    });
  }
}
