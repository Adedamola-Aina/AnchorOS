import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { calculateCashFlow, groupSmallValues } from './finance';
import { buildTransaction } from '../test/factories';

describe('finance utils property tests (QA-004)', () => {
  it('groupSmallValues conserves total value', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 10_000 }), { minLength: 0, maxLength: 20 }),
        fc.float({ min: 0, max: 0.5, noNaN: true }),
        (values, threshold) => {
          const data = values.map((value, idx) => ({ name: `x${idx}`, value, color: '#000' }));
          const totalBefore = data.reduce((sum, item) => sum + item.value, 0);
          const totalAfter = groupSmallValues(data, threshold).reduce((sum, item) => sum + item.value, 0);
          expect(totalAfter).toBe(totalBefore);
        }
      )
    );
  });

  it('calculateCashFlow always satisfies net = income - expense', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            amountCents: fc.integer({ min: 0, max: 500_000 }),
            type: fc.constantFrom<'income' | 'expense' | 'transfer'>('income', 'expense', 'transfer'),
          }),
          { minLength: 0, maxLength: 40 }
        ),
        (items) => {
          const date = new Date().toISOString();
          const txs = items.map((item, idx) => buildTransaction({
            id: `tx-${idx}`,
            type: item.type,
            amountCents: item.amountCents,
            date,
          }));
          const summary = calculateCashFlow(txs, 30);
          expect(summary.net).toBe(summary.income - summary.expense);
        }
      )
    );
  });
});
