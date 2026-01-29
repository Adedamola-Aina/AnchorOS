import { bench, describe } from 'vitest';
import { formatCurrency } from '../utils/format';

describe('Performance: Utilities', () => {
  bench('formatCurrency (USD)', () => {
    formatCurrency(123456, 'USD');
  });

  bench('formatCurrency (NGN)', () => {
    formatCurrency(987654321, 'NGN');
  });
});
