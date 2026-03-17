import type {
  PatternAction,
  PatternTrigger,
  Prediction,
  PredictionType,
  ProactiveQuestionType,
  UserPattern,
} from '../../types';
import type { BehavioralEngine } from './BehavioralEngine';

const PROACTIVE_QUESTION_TYPES: readonly ProactiveQuestionType[] = [
  'missed_habit',
  'completion_drop',
  'category_spike',
  'surplus_idle',
];

const PREDICTION_ID_TYPE_MAP: Array<[string, PredictionType]> = [
  ['pred-budget-overage', 'budget_overage'],
  ['pred-burn-rate', 'budget_overage'],
  ['pred-streak-risk', 'streak_at_risk'],
  ['pred-recurring-due', 'recurring_due'],
];

export function inferPredictionType(predictionId: string): PredictionType | null {
  for (const [prefix, type] of PREDICTION_ID_TYPE_MAP) {
    if (predictionId.startsWith(prefix)) return type;
  }
  return null;
}

export function isProactiveQuestionType(value: string): value is ProactiveQuestionType {
  return PROACTIVE_QUESTION_TYPES.includes(value as ProactiveQuestionType);
}

export function applyPredictionDismissFeedback(
  engine: BehavioralEngine,
  predictions: Prediction[],
  predictionId: string,
): boolean {
  const prediction = predictions.find((p) => p.id === predictionId);
  const predType = prediction?.type ?? inferPredictionType(predictionId);
  if (!predType) return false;

  const patterns = engine.getConfirmedPatterns();
  const matchedPattern = matchPatternForPredictionType(predType, patterns);
  if (!matchedPattern) return false;

  engine.dismissPattern(matchedPattern.id);
  return true;
}

function matchPatternForPredictionType(
  predType: PredictionType,
  patterns: UserPattern[],
): UserPattern | undefined {
  if (predType === 'budget_overage' || predType === 'recurring_due') {
    return patterns.find((p) => p.followUpAction.type === 'review_budget');
  }
  if (predType === 'streak_at_risk') {
    return patterns.find((p) => p.trigger.type === 'commitment_completed');
  }
  return undefined;
}

export function isPatternFeedbackEvent(trigger: PatternTrigger, action: PatternAction): boolean {
  return trigger.type !== 'app_opened' || action.type !== 'view_page';
}
