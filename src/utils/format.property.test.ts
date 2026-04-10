import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { formatCurrencyCompact } from './format';

describe('format property tests (QA-004)', () => {
  it('compact format always includes magnitude suffix when forced', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -10_000_000_000, max: 10_000_000_000, noNaN: true, noInfinity: true }),
        fc.constantFrom<'USD' | 'NGN'>('USD', 'NGN'),
        (amount, currency) => {
          const compact = formatCurrencyCompact(amount, currency, { forceCompact: true });
          expect(/[KMB]$/.test(compact)).toBe(true);
        }
      )
    );
  });

  it('below-threshold values match full format with default options', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -9999.99, max: 9999.99, noNaN: true, noInfinity: true }),
        fc.constantFrom<'USD' | 'NGN'>('USD', 'NGN'),
        (amount, currency) => {
          const compact = formatCurrencyCompact(amount, currency);
          expect(/[KMB]$/.test(compact)).toBe(false);
        }
      )
    );
  });
});
