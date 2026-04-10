import { describe, expect, it } from 'vitest';
import type { AnchorTransaction, ParsedIntent } from '../../../../types';
import { scenarioQuery } from '../../query/scenarioQueries';
import type { RunFabricQueryInput } from '../../query/types';

function tx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: overrides.id || `tx-${Math.random()}`,
    title: overrides.title || 'Test',
    amountCents: overrides.amountCents ?? 0,
    type: overrides.type || 'expense',
    category: overrides.category || 'General',
    date: overrides.date || '2026-03-10T12:00:00.000Z',
    accountId: overrides.accountId || 'acc-1',
    currency: overrides.currency || 'USD',
    scope: overrides.scope || 'personal',
    ...overrides,
  } as AnchorTransaction;
}

function makeInput(intent: ParsedIntent, transactions: AnchorTransaction[]): RunFabricQueryInput {
  return {
    intent,
    input: intent.rawInput,
    transactions,
    commitments: [],
    accounts: [],
    recurring: [],
    now: new Date('2026-04-15T00:00:00.000Z'),
  };
}

describe('scenarioQuery', () => {
  it('uses default 20% reduction when amount is missing', () => {
    const intent: ParsedIntent = {
      action: 'query_scenario',
      confidence: 0.9,
      rawInput: 'What if I cut groceries?',
      entities: { category: 'Groceries' },
    };

    const result = scenarioQuery(
      makeInput(intent, [
        tx({ type: 'income', amountCents: 50_000, category: 'Salary' }),
        tx({ type: 'expense', amountCents: 10_000, category: 'Groceries' }),
        tx({ type: 'expense', amountCents: 20_000, category: 'Rent' }),
      ]),
    );

    expect(result.visualizable).toBe(true);
    expect(result.summary).toContain('Groceries');
    expect(result.summary).toContain('20%');
    expect(result.summary).toContain('$60.00'); // $20/mo * 3 months
    expect(result.detail).toContain('$300.00/mo');
    expect(result.detail).toContain('$280.00/mo');
    expect(result.actions?.[0]).toMatchObject({
      label: 'View spending',
      type: 'navigate',
      payload: { path: '/finance' },
    });
  });

  it('uses provided percentage when amount is <= 100', () => {
    const intent: ParsedIntent = {
      action: 'query_scenario',
      confidence: 0.9,
      rawInput: 'Cut dining by 35%',
      entities: { category: 'Dining', amount: 35 },
    };

    const result = scenarioQuery(
      makeInput(intent, [
        tx({ type: 'expense', amountCents: 20_000, category: 'Dining' }),
      ]),
    );

    expect(result.summary).toContain('35%');
    expect((result.data as { reducePercent: number }).reducePercent).toBe(35);
  });

  it('falls back to default percentage when amount is > 100 and category is missing', () => {
    const intent: ParsedIntent = {
      action: 'query_scenario',
      confidence: 0.8,
      rawInput: 'What if I reduce by 300?',
      entities: { amount: 300 },
    };

    const result = scenarioQuery(
      makeInput(intent, [
        tx({ type: 'expense', amountCents: 10_000, category: 'Food' }),
      ]),
    );

    expect(result.summary).toContain('overall spending');
    expect(result.summary).toContain('20%');
    expect((result.data as { reducePercent: number }).reducePercent).toBe(20);
  });
});

