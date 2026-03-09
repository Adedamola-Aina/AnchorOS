import type { PatternAction, PatternTrigger, UserPattern } from '../../types';

export interface RecentAction {
  trigger: PatternTrigger;
  action: PatternAction;
  timestamp: string;
}

export interface BehaviorState {
  patterns: UserPattern[];
  confirmedPatterns: UserPattern[];
  recentActions: RecentAction[];
  dismissedPatterns: string[];
  updatedAt: string;
}

export const MAX_RECENT_ACTIONS = 100;
export const RECENT_ACTION_TTL_DAYS = 90;
export const RECENCY_WINDOW_DAYS = 30;
export const CONFIRMED_THRESHOLD = 0.5;

export function toSignature(trigger: PatternTrigger, action: PatternAction): string {
  return JSON.stringify({
    triggerType: trigger.type,
    trigger,
    actionType: action.type,
    action,
  });
}

export function calculateConfidence(
  frequency: number,
  dismissed: number,
  recentOccurrences: number
): number {
  const baseConfidence = frequency / (frequency + dismissed + 2);
  const recencyBoost = frequency > 0 ? recentOccurrences / frequency : 0;
  const weighted = baseConfidence * (0.7 + 0.3 * recencyBoost);
  return Math.max(0, Math.min(1, Number(weighted.toFixed(4))));
}

export function initialBehaviorState(nowIso: string): BehaviorState {
  return {
    patterns: [],
    confirmedPatterns: [],
    recentActions: [],
    dismissedPatterns: [],
    updatedAt: nowIso,
  };
}