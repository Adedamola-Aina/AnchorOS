import type { FabricQueryResult } from '../../../types';
import { detectPrimaryCurrency, formatCents } from '../fabricUtils';
import { calculateScenario } from '../ScenarioCalculator';
import type { RunFabricQueryInput } from './types';

const DEFAULT_REDUCE_PERCENT = 20;

export function scenarioQuery(input: RunFabricQueryInput): FabricQueryResult {
  const { transactions, now, intent } = input;
  const category = intent.entities.category;
  const percent = intent.entities.amount && intent.entities.amount <= 100
    ? intent.entities.amount
    : DEFAULT_REDUCE_PERCENT;
  const currency = detectPrimaryCurrency(transactions);

  const result = calculateScenario({
    transactions,
    reduceCategory: category,
    reducePercent: percent,
    projectionMonths: 3,
    now,
  });

  const catLabel = category ?? 'overall spending';
  const saved = formatCents(result.savingsOverPeriodCents, currency);
  const monthlySaved = formatCents(result.savingsOverPeriodCents / result.projectionMonths, currency);

  return {
    data: result,
    summary: `If you cut ${catLabel} by ${percent}%, you'd save ~${saved} over ${result.projectionMonths} months.`,
    detail: `Baseline: ${formatCents(result.baseline.monthlyExpenseCents, currency)}/mo expenses → projected: ${formatCents(result.projected.monthlyExpenseCents, currency)}/mo. That's ${monthlySaved}/mo in extra savings.`,
    visualizable: true,
    actions: [{ label: 'View spending', navigateTo: '/finance' }],
  };
}
