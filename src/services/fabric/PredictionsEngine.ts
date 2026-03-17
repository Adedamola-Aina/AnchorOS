import type { Prediction } from '../../types';
import { buildBehaviorSignals } from './predictionBehaviorSignals';
import { buildBudgetAndBurnSignals } from './predictionBudgetSignals';
import { buildPatternInformedPredictions } from './predictionPatternSignals';
import type { PredictionInput } from './predictionTypes';

export function buildPredictions(input: PredictionInput): Prediction[] {
  const budgetSignals = buildBudgetAndBurnSignals(input);
  const behaviorSignals = buildBehaviorSignals(input);
  const patternSignals = buildPatternInformedPredictions(
    input.patterns,
    input.transactions,
    input.commitments,
    input.now,
  );

  return [...budgetSignals, ...behaviorSignals, ...patternSignals]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
