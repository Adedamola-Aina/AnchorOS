import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { addMoney, fromCents, subtractMoney, toCents } from './moneyUtils';

describe('moneyUtils property tests (QA-004)', () => {
  it('round-trips amounts with <=2 decimal precision through cents', () => {
    fc.assert(
      fc.property(fc.integer({ min: -10_000_000, max: 10_000_000 }), (cents) => {
        expect(toCents(fromCents(cents))).toBe(cents);
      })
    );
  });

  it('add/subtract follow inverse arithmetic laws in cents', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1_000_000_000, max: 1_000_000_000 }),
        fc.integer({ min: -1_000_000_000, max: 1_000_000_000 }),
        (a, b) => {
          expect(subtractMoney(addMoney(a, b), b)).toBe(a);
          expect(addMoney(a, b)).toBe(addMoney(b, a));
        }
      )
    );
  });
});
