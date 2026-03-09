import type {
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
  UserPattern,
  WeeklyReport,
} from '../../types';
import { secureDb } from '../../utils/secureDb';
import { BehavioralEngine } from './BehavioralEngine';
import { getAmbientContext } from './AmbientContext';

const SAVE_DEBOUNCE_MS = 500;

export class FabricService implements IFabricService {
  private static instance: FabricService | undefined;

  static getInstance(): FabricService {
    if (!FabricService.instance) {
      FabricService.instance = new FabricService();
    }
    return FabricService.instance;
  }

  static resetForTests(): void {
    FabricService.instance?.dispose();
    FabricService.instance = undefined;
  }

  private engine = new BehavioralEngine();
  private activeUserId: string | null = null;
  private enabled = false;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  isEnabled(): boolean {
    return this.enabled;
  }

  async initialize(userId: string): Promise<void> {
    this.activeUserId = userId;

    const settings = await secureDb.getDocument<FabricSettings>(userId, ['fabric_settings', 'state']);
    this.enabled = settings?.enabled === true;

    if (!this.enabled) {
      this.engine.reset();
      return;
    }

    await this.engine.loadBehavior(userId);

    if (this.engine.getPatterns().length === 0) {
      const [transactions, commitments] = await Promise.all([
        secureDb.queryCollection<AnchorTransaction>(userId, 'finance', []),
        secureDb.queryCollection<AnchorTask>(userId, 'commitments', []),
      ]);
      this.engine.seedFromHistory(transactions, commitments);
      if (this.engine.getPatterns().length > 0) {
        await this.engine.saveBehavior(userId);
      }
    }
  }

  getContext(): FabricContext {
    return getAmbientContext();
  }

  learnFrom(trigger: PatternTrigger, action: PatternAction): void {
    if (!this.enabled || !this.activeUserId) return;
    this.engine.recordAction(trigger, action);
    this.scheduleSave();
  }

  getPatterns(): UserPattern[] {
    return this.engine.getPatterns();
  }

  getConfirmedPatterns(): UserPattern[] {
    return this.engine.getConfirmedPatterns();
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

    const now = new Date().toISOString();
    await Promise.all([
      secureDb.setDocument(this.activeUserId, ['fabric_behavior', 'state'], {
        patterns: [],
        confirmedPatterns: [],
        recentActions: [],
        dismissedPatterns: [],
        updatedAt: now,
      }),
      secureDb.setDocument(this.activeUserId, ['fabric_predictions', 'state'], {
        active: [],
        updatedAt: now,
      }),
      secureDb.setDocument(this.activeUserId, ['fabric_settings', 'state'], {
        enabled: this.enabled,
        dataCollectionEnabled: this.enabled,
        lastCleared: now,
      }),
    ]);

    this.engine.reset();
  }

  getPredictions(): Prediction[] {
    return [];
  }

  dismissPrediction(_predictionId: string): void {}

  getInsightsFor(_feature: 'dashboard' | 'commitments' | 'finance' | 'family'): Insight[] {
    return [];
  }

  async generateWeeklyReport(): Promise<WeeklyReport> {
    throw new Error('Weekly reports are not implemented yet.');
  }

  parseIntent(input: string): ParsedIntent {
    return {
      action: 'unknown',
      confidence: 0,
      entities: {},
      rawInput: input,
    };
  }

  async query(_input: string): Promise<FabricQueryResult> {
    return {
      data: null,
      summary: 'Anchor AI query responses are not available yet.',
      detail: 'Use guided prompt chips while conversational parsing is under development.',
      visualizable: false,
      actions: [],
    };
  }

  dispose(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
  }

  private scheduleSave(): void {
    if (!this.activeUserId) return;
    if (this.saveTimer) clearTimeout(this.saveTimer);

    this.saveTimer = setTimeout(async () => {
      if (!this.activeUserId) return;
      await this.engine.saveBehavior(this.activeUserId);
      this.saveTimer = null;
    }, SAVE_DEBOUNCE_MS);
  }
}
