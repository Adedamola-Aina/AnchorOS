import type { Prediction } from '../../types';
import { buildAnomalySignals } from './predictionAnomalySignals';
import { buildBehaviorSignals } from './predictionBehaviorSignals';
import { buildBudgetAndBurnSignals } from './predictionBudgetSignals';
import { buildGoalSignals } from './predictionGoalSignals';
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
  const anomalySignals = buildAnomalySignals(input);
  const goalSignals = buildGoalSignals(input);

  return [...budgetSignals, ...behaviorSignals, ...patternSignals, ...anomalySignals, ...goalSignals]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
