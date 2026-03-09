import type { AnchorTask, AnchorTransaction, PatternAction, PatternTrigger, UserPattern } from '../../types';
import { secureDb } from '../../utils/secureDb';
import { detectCategory, isFinanciallyRelevant, parseAmountFromText } from './heuristics';
import {
  calculateConfidence,
  CONFIRMED_THRESHOLD,
  initialBehaviorState,
  type BehaviorState,
  MAX_RECENT_ACTIONS,
  type RecentAction,
  RECENT_ACTION_TTL_DAYS,
  RECENCY_WINDOW_DAYS,
  toSignature,
} from './behaviorEngineUtils';
import { buildSeedPatterns } from './seedPatterns';

export class BehavioralEngine {
  private state: BehaviorState = initialBehaviorState(new Date().toISOString());
  private readonly nowProvider: () => Date;

  constructor(nowProvider: () => Date = () => new Date()) {
    this.nowProvider = nowProvider;
  }

  recordAction(trigger: PatternTrigger, action: PatternAction): void {
    const nowIso = this.nowProvider().toISOString();
    const signature = toSignature(trigger, action);

    this.state.recentActions.push({ trigger, action, timestamp: nowIso });
    this.pruneRecentActions();

    const pattern = this.state.patterns.find((item) => toSignature(item.trigger, item.followUpAction) === signature);
    const recentOccurrences = this.countRecentOccurrences(signature);

    if (pattern) {
      pattern.frequency += 1;
      pattern.lastOccurred = nowIso;
      pattern.updatedAt = nowIso;
      pattern.confidence = calculateConfidence(pattern.frequency, pattern.dismissed, recentOccurrences);
      this.syncConfirmedPattern(pattern);
    } else {
      const created: UserPattern = {
        id: `pattern-${this.state.patterns.length + 1}-${Date.now()}`,
        trigger,
        followUpAction: action,
        frequency: 1,
        confidence: calculateConfidence(1, 0, recentOccurrences),
        lastOccurred: nowIso,
        averageDelayMs: 0,
        dismissed: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      this.state.patterns.push(created);
      this.syncConfirmedPattern(created);
    }
  }

  dismissPattern(patternId: string): void {
    const nowIso = this.nowProvider().toISOString();
    this.state.dismissedPatterns = Array.from(new Set([...this.state.dismissedPatterns, patternId]));

    const updatePattern = (pattern: UserPattern) => {
      if (pattern.id !== patternId) return pattern;
      const next = { ...pattern };
      next.dismissed += 1;
      next.updatedAt = nowIso;
      next.confidence = calculateConfidence(next.frequency, next.dismissed, this.countRecentOccurrences(toSignature(next.trigger, next.followUpAction)));
      return next;
    };

    this.state.patterns = this.state.patterns.map(updatePattern);
    this.state.confirmedPatterns = this.state.confirmedPatterns.map(updatePattern).filter((pattern) => pattern.confidence > CONFIRMED_THRESHOLD);
  }

  deletePattern(patternId: string): void {
    this.state.patterns = this.state.patterns.filter((pattern) => pattern.id !== patternId);
    this.state.confirmedPatterns = this.state.confirmedPatterns.filter((pattern) => pattern.id !== patternId);
    this.state.dismissedPatterns = this.state.dismissedPatterns.filter((id) => id !== patternId);
  }

  getPatterns(): UserPattern[] {
    this.refreshConfidence();
    return [...this.state.patterns].sort((a, b) => b.confidence - a.confidence);
  }

  getConfirmedPatterns(): UserPattern[] {
    this.refreshConfidence();
    return [...this.state.confirmedPatterns].sort((a, b) => b.confidence - a.confidence);
  }

  getRecentActions(): RecentAction[] {
    return [...this.state.recentActions];
  }

  reset(): void {
    this.state = initialBehaviorState(this.nowProvider().toISOString());
  }

  async loadBehavior(userId: string): Promise<void> {
    const persisted = await secureDb.getDocument<BehaviorState>(userId, ['fabric_behavior', 'state']);
    this.state = {
      ...initialBehaviorState(this.nowProvider().toISOString()),
      ...(persisted ?? {}),
      patterns: persisted?.patterns ?? [],
      confirmedPatterns: persisted?.confirmedPatterns ?? [],
      recentActions: persisted?.recentActions ?? [],
      dismissedPatterns: persisted?.dismissedPatterns ?? [],
      updatedAt: persisted?.updatedAt ?? this.nowProvider().toISOString(),
    };
    this.pruneRecentActions();
  }

  async saveBehavior(userId: string): Promise<void> {
    this.state.updatedAt = this.nowProvider().toISOString();
    await secureDb.setDocument(userId, ['fabric_behavior', 'state'], this.state as unknown as Record<string, unknown>);
  }

  seedFromHistory(transactions: AnchorTransaction[], commitments: AnchorTask[]): void {
    const nowIso = this.nowProvider().toISOString();
    const seededPatterns = buildSeedPatterns(transactions, commitments, nowIso);
    seededPatterns.forEach((pattern) => this.upsertPattern(pattern));
  }

  private upsertPattern(pattern: UserPattern): void {
    const index = this.state.patterns.findIndex((item) => item.id === pattern.id);
    if (index >= 0) {
      this.state.patterns[index] = pattern;
    } else {
      this.state.patterns.push(pattern);
    }
    this.syncConfirmedPattern(pattern);
  }

  private syncConfirmedPattern(pattern: UserPattern): void {
    const index = this.state.confirmedPatterns.findIndex((item) => item.id === pattern.id);
    if (pattern.confidence > CONFIRMED_THRESHOLD) {
      if (index >= 0) this.state.confirmedPatterns[index] = { ...pattern };
      else this.state.confirmedPatterns.push({ ...pattern });
    } else if (index >= 0) {
      this.state.confirmedPatterns.splice(index, 1);
    }
  }

  private refreshConfidence(): void {
    this.pruneRecentActions();
    this.state.patterns = this.state.patterns.map((pattern) => {
      const signature = toSignature(pattern.trigger, pattern.followUpAction);
      return {
        ...pattern,
        confidence: calculateConfidence(pattern.frequency, pattern.dismissed, this.countRecentOccurrences(signature)),
      };
    });
    this.state.confirmedPatterns = this.state.patterns.filter((pattern) => pattern.confidence > CONFIRMED_THRESHOLD);
  }

  private pruneRecentActions(): void {
    const nowMs = this.nowProvider().getTime();
    const ttlMs = RECENT_ACTION_TTL_DAYS * 24 * 60 * 60 * 1000;
    this.state.recentActions = this.state.recentActions
      .filter((entry) => nowMs - Date.parse(entry.timestamp) <= ttlMs)
      .slice(-MAX_RECENT_ACTIONS);
  }

  private countRecentOccurrences(signature: string): number {
    const cutoffMs = this.nowProvider().getTime() - RECENCY_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    return this.state.recentActions.filter((entry) => {
      if (Date.parse(entry.timestamp) < cutoffMs) return false;
      return toSignature(entry.trigger, entry.action) === signature;
    }).length;
  }
}

export { detectCategory, isFinanciallyRelevant, parseAmountFromText };
